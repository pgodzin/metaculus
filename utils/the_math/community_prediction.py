"""
Ftr, the general shape of the aggregation is:
Everytime a new prediction is made, take the latest prediction of each user.
For each of those user-predictions, compute a reputation weight and a recency weight, then combine them to get a weight for the user-prediction.
Transform the predictions to logodds.
For each possible outcome, take the weighted average of all user-prediction logodds.
Transform back to probabilities.
Normalise to 1 over all outcomes.
"""

from datetime import datetime
from typing import Optional
from questions.models import Forecast, Question
from collections import defaultdict
import numpy as np


def latest_forecasts_at(
    forecasts: list[Forecast], at_datetime: Optional[datetime]
) -> int:
    if at_datetime:
        forecasts = [f for f in forecasts if f.start_time <= at_datetime]

    user_latest_forecasts = defaultdict(lambda: None)
    for forecast in forecasts:
        if (
            user_latest_forecasts[forecast.author_id] is None
            or forecast.start_time
            > user_latest_forecasts[forecast.author_id].start_time
        ):
            user_latest_forecasts[forecast.author_id] = forecast

    return list(user_latest_forecasts.values())


def compute_binary_cp(
    forecasts: list[Forecast], at_datetime: Optional[datetime]
) -> int:
    forecasts = latest_forecasts_at(forecasts, at_datetime)
    if len(forecasts) == 0:
        return None
    probabilities = [x.probability_yes for x in forecasts]
    return {
        "mean": np.quantile(probabilities, 0.5),
        "max": np.quantile(probabilities, 0.75),
        "min": np.quantile(probabilities, 0.25),
        "nr_forecasters": len(forecasts),
    }


def compute_multiple_choice_cp(
    question: Question, forecasts: list[Forecast], at_datetime: Optional[datetime]
) -> int:
    forecasts = latest_forecasts_at(forecasts, at_datetime)
    if len(forecasts) == 0:
        return None
    data = {x: [] for x in question.options}
    for f in forecasts:
        for i, prob in enumerate(f.probability_yes_per_category):
            data[question.options[i]].append(prob["probability"])
    for k in data:
        data[k] = {
            "mean": np.quantile(data[k], 0.5),
            "nr_forecasters": len(data[k]),
        }
    sum_medians = np.sum([x["mean"] for x in data.values()])
    for k in list(data.keys()):
        data[k]["mean"] = data[k]["mean"] / sum_medians
        data["nr_forecasters"] = data[k]["nr_forecasters"]
        del data[k]["nr_forecasters"]
    return data


def compute_continuous_cp(
    question: Question, forecasts: list[Forecast], at_datetime: Optional[datetime]
) -> int:
    forecasts = latest_forecasts_at(forecasts, at_datetime)
    if len(forecasts) == 0:
        return None

    predictions = np.array([f.continuous_prediction_values for f in forecasts])
    forecasts_per_bin = np.mean(predictions, axis=0)

    # TODO: Associate bins with numbers
    step = (question.max - question.min) / 200
    bin_vals = [question.min + step * i for i in range(200)]

    cumulative_probability = np.cumsum(forecasts_per_bin)

    # Find the indices where the cumulative probability crosses the thresholds
    min = bin_vals[np.searchsorted(cumulative_probability, 0.25, side="right")]
    mean = bin_vals[np.searchsorted(cumulative_probability, 0.5, side="right")]
    max = bin_vals[np.searchsorted(cumulative_probability, 0.75, side="right")]

    return {
        "mean": mean,
        "max": max,
        "min": min,
        "nr_forecasters": len(forecasts),
    }
