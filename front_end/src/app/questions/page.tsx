import { Suspense } from "react";

import QuestionFilters from "@/app/questions/components/question_filters";
import QuestionTopics from "@/app/questions/components/question_topics";
import QuestionsFeed from "@/app/questions/components/questions_feed";
import {
  ACCESS_FILTER,
  AUTHOR_FILTER,
  CATEGORIES_FILTER,
  COMMENTED_BY_FILTER,
  GUESSED_BY_FILTER,
  NOT_GUESSED_BY_FILTER,
  ORDER_BY_FILTER,
  QUESTION_TYPE_FILTER,
  STATUS_FILTER,
  TAGS_FILTER,
  TEXT_SEARCH_FILTER,
  TOPIC_FILTER,
  UPVOTED_BY_FILTER,
} from "@/app/questions/constants/query_params";
import LoadingIndicator from "@/components/ui/loading_indicator";
import ProjectsApi from "@/services/projects";
import { QuestionsParams } from "@/services/questions";

export default async function Questions({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const filters = generateFilters(searchParams);

  const [topics, categories, tags] = await Promise.all([
    ProjectsApi.getTopics(),
    ProjectsApi.getCategories(),
    ProjectsApi.getTags(),
  ]);

  return (
    <main className="mx-auto mt-4 min-h-min w-full max-w-5xl flex-auto px-0 sm:px-2 md:px-3">
      <div className="gap-3 p-0 sm:flex sm:flex-row sm:gap-4">
        <QuestionTopics topics={topics} />
        <div className="min-h-[calc(100vh-300px)] grow overflow-x-hidden p-2 pt-2.5 no-scrollbar sm:p-0 sm:pt-5">
          <QuestionFilters categories={categories} tags={tags} />
          <Suspense
            key={JSON.stringify(searchParams)}
            fallback={
              <LoadingIndicator className="mx-auto h-8 w-24 text-metac-gray-600 dark:text-metac-gray-600-dark" />
            }
          >
            <QuestionsFeed filters={filters} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

function generateFilters(
  searchParams: Record<string, string | string[] | undefined>
): QuestionsParams {
  const filters: QuestionsParams = {};

  if (typeof searchParams[TEXT_SEARCH_FILTER] === "string") {
    filters.search = searchParams[TEXT_SEARCH_FILTER];
  }

  if (typeof searchParams[TOPIC_FILTER] === "string") {
    filters.topic = searchParams[TOPIC_FILTER];
  }

  if (searchParams[QUESTION_TYPE_FILTER]) {
    filters.forecast_type = searchParams[QUESTION_TYPE_FILTER];
  }

  if (searchParams[STATUS_FILTER]) {
    filters.status = searchParams[STATUS_FILTER];
  }

  if (searchParams[CATEGORIES_FILTER]) {
    filters.categories = searchParams[CATEGORIES_FILTER];
  }

  if (searchParams[TAGS_FILTER]) {
    filters.tags = searchParams[TAGS_FILTER];
  }

  if (typeof searchParams[GUESSED_BY_FILTER] === "string") {
    filters.guessed_by = searchParams[GUESSED_BY_FILTER];
  }
  if (typeof searchParams[AUTHOR_FILTER] === "string") {
    filters.author = searchParams[AUTHOR_FILTER];
  }
  if (typeof searchParams[UPVOTED_BY_FILTER] === "string") {
    filters.upvoted_by = searchParams[UPVOTED_BY_FILTER];
  }
  if (typeof searchParams[COMMENTED_BY_FILTER] === "string") {
    filters.commented_by = searchParams[COMMENTED_BY_FILTER];
  }
  if (typeof searchParams[NOT_GUESSED_BY_FILTER] === "string") {
    filters.not_guessed_by = searchParams[NOT_GUESSED_BY_FILTER];
  }

  if (typeof searchParams[ACCESS_FILTER] === "string") {
    filters.access = searchParams[ACCESS_FILTER];
  }

  if (typeof searchParams[ORDER_BY_FILTER] === "string") {
    filters.order_by = searchParams[ORDER_BY_FILTER];
  }

  return filters;
}
