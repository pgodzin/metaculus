"use client";
import { FC } from "react";

import MultipleChoiceTile from "@/components/multiple_choice_tile";
import GroupNumericTile from "@/components/post_card/group_of_questions_tile/group_numeric_tile";
import { useAuth } from "@/contexts/auth_context";
import { TimelineChartZoomOption } from "@/types/charts";
import { PostStatus } from "@/types/post";
import {
  QuestionType,
  QuestionWithForecasts,
  QuestionWithNumericForecasts,
} from "@/types/question";
import {
  generateChoiceItemsFromBinaryGroup,
  getGroupQuestionsTimestamps,
} from "@/utils/charts";

type Props = {
  questions: QuestionWithForecasts[];
  curationStatus: PostStatus;
};

const GroupOfQuestionsTile: FC<Props> = ({ questions, curationStatus }) => {
  const { user } = useAuth();
  const tileType = questions.at(0)?.type;

  if (!tileType) {
    return <div>Forecasts data is empty</div>;
  }

  switch (tileType) {
    case QuestionType.Binary: {
      const visibleChoicesCount = 3;
      const timestamps = getGroupQuestionsTimestamps(
        questions as QuestionWithNumericForecasts[]
      );
      const choices = generateChoiceItemsFromBinaryGroup(
        questions as QuestionWithNumericForecasts[],
        { activeCount: visibleChoicesCount, sortPredictionDesc: true }
      );
      return (
        <MultipleChoiceTile
          choices={choices}
          timestamps={timestamps}
          visibleChoicesCount={visibleChoicesCount}
          defaultChartZoom={
            user
              ? TimelineChartZoomOption.All
              : TimelineChartZoomOption.TwoMonths
          }
        />
      );
    }
    case QuestionType.Numeric:
    case QuestionType.Date:
      return (
        <GroupNumericTile
          questions={questions as QuestionWithNumericForecasts[]}
          curationStatus={curationStatus}
        />
      );
    default:
      return null;
  }
};

export default GroupOfQuestionsTile;
