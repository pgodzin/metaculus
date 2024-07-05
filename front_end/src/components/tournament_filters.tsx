"use client";
import { useTranslations } from "next-intl";
import { FC, useMemo } from "react";

import {
  getDropdownSortOptions,
  getMainOrderOptions,
  getPostsFilters,
} from "@/app/(main)/questions/helpers/filters";
import PostsFilters from "@/components/posts_filters";
import {
  POST_GUESSED_BY_FILTER,
  POST_ORDER_BY_FILTER,
  POST_STATUS_FILTER,
} from "@/constants/posts_feed";
import { useAuth } from "@/contexts/auth_context";
import useSearchParams from "@/hooks/use_search_params";
import { Category, Tag } from "@/types/projects";
import { QuestionOrder } from "@/types/question";

type Props = {
  categories: Category[];
  tags: Tag[];
};

const OPEN_STATUS_FILTERS = [
  QuestionOrder.PublishTimeDesc,
  QuestionOrder.WeeklyMovementDesc,
  QuestionOrder.LastPredictionTimeDesc,
  QuestionOrder.DivergenceDesc,
  QuestionOrder.StaleDesc,
  QuestionOrder.CloseTimeAsc,
  QuestionOrder.ScoreDesc,
  QuestionOrder.ScoreAsc,
];
const RESOLVED_STATUS_FILTERS = [
  QuestionOrder.StaleDesc,
  QuestionOrder.UnreadCommentCountDesc,
];
const GUESSED_BY_FILTERS = [
  QuestionOrder.LastPredictionTimeAsc,
  QuestionOrder.LastPredictionTimeDesc,
  QuestionOrder.DivergenceDesc,
];

const TournamentFilters: FC<Props> = ({ categories, tags }) => {
  const { user } = useAuth();
  const { params, setParam, deleteParam, navigateToSearchParams } =
    useSearchParams();
  const t = useTranslations();

  const filters = useMemo(() => {
    return getPostsFilters({ tags, user, t, params, categories });
  }, [categories, params, t, tags, user]);

  const mainSortOptions = useMemo(() => {
    return getMainOrderOptions(t);
  }, [t]);

  const sortOptions = useMemo(() => {
    return getDropdownSortOptions(t, !!user);
  }, [t, user]);

  const handleOrderChange = (
    order: QuestionOrder,
    setFilterParam: (
      name: string,
      val: string | string[],
      withNavigation?: boolean
    ) => void
  ) => {
    const postStatusFilters = [];

    if (OPEN_STATUS_FILTERS.includes(order)) postStatusFilters.push("open");
    if (RESOLVED_STATUS_FILTERS.includes(order))
      postStatusFilters.push("resolved");

    if (!!user && GUESSED_BY_FILTERS.includes(order)) {
      setFilterParam(POST_GUESSED_BY_FILTER, user.id.toString(), false);
    }

    if (order === QuestionOrder.ResolveTimeAsc) {
      setFilterParam(POST_STATUS_FILTER, "open", false);
    }

    if (postStatusFilters.length) {
      setFilterParam(POST_STATUS_FILTER, postStatusFilters, false);
    }
  };

  return (
    <PostsFilters
      filters={filters}
      mainSortOptions={mainSortOptions}
      sortOptions={sortOptions}
      onOrderChange={handleOrderChange}
    />
  );
};

export default TournamentFilters;
