from django.db import models

from utils.models import TimeStampedModel


# Create your models here.


class UserWeight(TimeStampedModel):
    user = models.ForeignKey("users.User", on_delete=models.CASCADE)
    calculated_on = models.DateTimeField(auto_now_add=True)
    weight = models.FloatField(default=1)


class LeaderboardEntry(TimeStampedModel):
    class LeaderboardType(models.TextChoices):
        METACULUS_POINTS = "metaculus_points"
        PEER_ACCURACY = "peer_accuracy"
        BASELINE_ACCURACY = "baseline_accuracy"
        PEER_SPOT_FORECAST = "peer_spot_forecast"
        BASELINE_SPOT_FORECAST = "baseline_spot_forecast"
        # TODO: add comment and question writing leaderboard types

    user = models.ForeignKey("users.User", on_delete=models.CASCADE)
    for_project = models.ForeignKey("projects.Project", on_delete=models.CASCADE)
    leaderboard_type = models.CharField(max_length=200, choices=LeaderboardType.choices)
    score = models.FloatField()
    medal = models.CharField(max_length=200, null=True)
    calculated_on = models.DateTimeField(auto_now_add=True)
    # Here and for the score we can either have a boolean flag which says "stop computing" (i.e. this entry is forever stored)
    # Or we can have a dynamic calculation which decides if we stop computing (e.g. the project is closed, or for questions, the question is closed)


class Score(TimeStampedModel):
    user = models.ForeignKey("users.User", on_delete=models.CASCADE)
    for_question = models.ForeignKey("questions.Question", on_delete=models.CASCADE)
    score = models.FloatField()
    score_type = models.CharField(
        max_length=200, choices=LeaderboardEntry.LeaderboardType.choices
    )
