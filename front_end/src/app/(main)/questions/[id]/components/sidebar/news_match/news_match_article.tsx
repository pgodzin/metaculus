"use client";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { faNewspaper } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations, useLocale } from "next-intl";
import { FC, useState } from "react";

import Button from "@/components/ui/button";
import { useAuth } from "@/contexts/auth_context";
import { NewsArticle } from "@/types/news";
import { formatDate } from "@/utils/date_formatters";

import NewsArticleVoteButtons from "./news_match_voter";

type Props = {
  article: NewsArticle;
  questionId: number;
  allowModifications?: boolean;
};

const NewsMatchArticle: FC<Props> = ({
  article,
  questionId,
  allowModifications,
}) => {
  const { user } = useAuth();
  const locale = useLocale();
  const t = useTranslations();

  const [articleRemoved, setArticleRemoved] = useState(false);

  async function blacklistArticle() {
    const response = await Promise.resolve({ ok: true });
    if (!response.ok) return;
    setArticleRemoved(true);
  }

  const media = article.media ?? { name: "Unknown", icon: null, favicon: null };

  const iconUrl = media.icon ?? media.favicon ?? null;

  if (articleRemoved) {
    return (
      <div className="mb-4 rounded bg-gray-200 py-4 text-center font-sans text-base dark:bg-gray-200-dark">
        <div>
          <span className="text-gray-700 dark:text-gray-700-dark">
            {t("removed") + ": "}
          </span>
          <strong>{media.name}</strong>
        </div>
        <span className="italic text-gray-700 dark:text-gray-700-dark">
          {article.title}
        </span>
      </div>
    );
  }

  return (
    <div className="mb-4 flex w-full flex-col @md:flex-row">
      <div className="flex flex-1">
        <a
          className="flex flex-1 items-start no-underline @md:order-2 @md:items-center"
          href={article.url}
        >
          {iconUrl ? (
            <object
              className="mr-3 size-8 rounded-full"
              data={iconUrl}
              type="image/png"
              aria-label={`${media.name} logo`}
            >
              <span className="mr-3 flex size-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-200-dark">
                <FontAwesomeIcon icon={faNewspaper} size="xl" />
              </span>
            </object>
          ) : (
            <span className="mr-3 flex size-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-200-dark">
              <FontAwesomeIcon icon={faNewspaper} size="xl" />
            </span>
          )}
          <div className="flex-1 no-underline">
            <div className="text-base font-medium text-gray-900 dark:text-gray-900-dark">
              {article.title}
            </div>
            <div className="mt-1 text-sm text-gray-700 dark:text-gray-700-dark">
              <span>{media.name}</span>
              <span className="mx-2">•</span>
              <span>{formatDate(locale, new Date(article.date))}</span>
            </div>
          </div>
        </a>
        {user && (
          <div className="mr-1 flex flex-col text-gray-900 @md:order-1 @md:self-center dark:text-gray-900-dark">
            <NewsArticleVoteButtons questionId={questionId} article={article} />
          </div>
        )}
      </div>

      {allowModifications && (
        <Button
          variant="text"
          className="ml-8 self-start @md:ml-2"
          onClick={blacklistArticle}
        >
          <FontAwesomeIcon icon={faXmarkCircle} />
          {t("remove")}
        </Button>
      )}
    </div>
  );
};

export default NewsMatchArticle;