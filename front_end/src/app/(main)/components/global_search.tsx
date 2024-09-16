"use client";
import React, { useState, RefObject, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import SearchInput from "@/components/search_input";
import { POST_TEXT_SEARCH_FILTER } from "@/constants/posts_feed";
import { encodeQueryParams } from "@/utils/navigation";

interface GlobalSearchProps {
  globalSearch?: boolean;
  inputRef?: RefObject<HTMLInputElement>;
  onSubmit?: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  globalSearch,
  inputRef,
  onSubmit,
}) => {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const urlSearchQuery = searchParams.get("search");
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
    } else {
      // Reset the search query when there's no search parameter in the URL
      setSearchQuery("");
    }
  }, [searchParams]);

  const handleSearchSubmit = (query: string) => {
    router.push(
      `/questions` + encodeQueryParams({ [POST_TEXT_SEARCH_FILTER]: query })
    );
    onSubmit?.();
  };

  return (
    <SearchInput
      value={searchQuery}
      onChange={(event) => setSearchQuery(event.target.value)}
      onErase={() => setSearchQuery("")}
      onSubmit={handleSearchSubmit}
      placeholder={t("questionSearchPlaceholder")}
      size="base"
      className="w-full"
      globalSearch={true}
      inputRef={inputRef}
    />
  );
};

export default GlobalSearch;
