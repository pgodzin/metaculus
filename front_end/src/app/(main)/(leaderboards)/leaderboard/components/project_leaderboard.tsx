import classNames from "classnames";
import { getTranslations } from "next-intl/server";
import { FC } from "react";

import SectionToggle from "@/components/ui/section_toggle";
import LeaderboardApi from "@/services/leaderboard";
import { LeaderboardType } from "@/types/scoring";

import ProjectLeaderboardTable from "./project_leaderboard_table";

type Props = {
  projectId: number;
  leaderboardType?: LeaderboardType;
  userId?: number;
  isQuestionSeries?: boolean;
};

const ProjectLeaderboard: FC<Props> = async ({
  projectId,
  leaderboardType,
  isQuestionSeries,
  userId,
}) => {
  const leaderboardDetails = await LeaderboardApi.getProjectLeaderboard(
    projectId,
    leaderboardType
  );
  if (!leaderboardDetails) {
    return null;
  }

  const t = await getTranslations();

  const leaderboardTitle = isQuestionSeries
    ? t("openLeaderboard")
    : t("leaderboard");

  return (
    <SectionToggle
      title={leaderboardTitle}
      className={classNames({
        "bg-gold-200 dark:bg-gold-200-dark": !isQuestionSeries,
      })}
    >
      <ProjectLeaderboardTable
        leaderboardDetails={leaderboardDetails}
        userId={userId}
      />
    </SectionToggle>
  );
};

export default ProjectLeaderboard;
