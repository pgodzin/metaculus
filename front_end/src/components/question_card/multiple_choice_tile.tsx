"use client";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { FC, useMemo } from "react";

import MultipleChoiceChart from "@/components/charts/multiple_choice_chart";
import ChoiceIcon from "@/components/choice_icon";
import { QuestionWithMultipleChoiceForecasts } from "@/types/question";
import { generateChartChoices } from "@/utils/charts";
import { getForecastPctDisplayValue } from "@/utils/forecasts";

const NUM_VISIBLE_CHOICES = 3;

const HEIGHT = 100;

type Props = {
  question: QuestionWithMultipleChoiceForecasts;
};

const MultipleChoiceTile: FC<Props> = ({ question }) => {
  const t = useTranslations();

  const { forecasts } = question;

  const { choices, visibleChoices } = useMemo(() => {
    const choices = generateChartChoices(forecasts);

    return { choices, visibleChoices: choices.slice(0, NUM_VISIBLE_CHOICES) };
  }, [forecasts]);
  const otherItemsCount = choices.length - visibleChoices.length;

  return (
    <div className="ml-0 mr-2 flex w-full grid-cols-[200px_auto] flex-col items-start gap-3 p-1 pl-0 xs:grid">
      <div className="resize-container">
        <div className="embed-gap flex flex-col gap-2">
          {visibleChoices.map(({ choice, color, values }) => (
            <div
              key={`choice-option-${choice}`}
              className="flex h-auto flex-row items-center self-start sm:self-stretch"
            >
              <div className="py-0.5 pr-1.5">
                <ChoiceIcon color={color} className="resize-icon" />
              </div>
              <div className="resize-label line-clamp-2 w-full px-1.5 py-0.5 text-left text-sm font-medium leading-4 text-gray-900 dark:text-gray-900-dark">
                {choice}
              </div>
              <div className="resize-label py-0.5 pr-1.5 text-right text-sm font-bold leading-4 text-gray-900 dark:text-gray-900-dark">
                {getForecastPctDisplayValue(values[values.length - 1])}
              </div>
            </div>
          ))}
          {otherItemsCount > 0 && (
            <div className="flex flex-row text-gray-600 dark:text-gray-600-dark">
              <div className="self-center py-0 pr-1.5 text-center">
                <FontAwesomeIcon
                  icon={faEllipsis}
                  size="xl"
                  className="resize-ellipsis"
                />
              </div>
              <div className="resize-label whitespace-nowrap px-1.5 py-0.5 text-left text-sm font-medium leading-4">
                {t("otherWithCount", { count: otherItemsCount })}
              </div>
            </div>
          )}
        </div>
      </div>
      <MultipleChoiceChart
        timestamps={forecasts.timestamps}
        choiceItems={choices}
        height={HEIGHT}
      />
    </div>
  );
};

export default MultipleChoiceTile;
