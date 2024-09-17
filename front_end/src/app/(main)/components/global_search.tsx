"use client";
import React, { useState, RefObject, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import SearchInput from "@/components/search_input";
import { POST_TEXT_SEARCH_FILTER } from "@/constants/posts_feed";
import { encodeQueryParams } from "@/utils/navigation";

interface GlobalSearchProps {
  globalSearch?: boolean;
  inputRef?: RefObject<HTMLInputElement>;
  onSubmit?: () => void;
  className?: string;
  isMobile?: boolean;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  globalSearch,
  inputRef,
  onSubmit,
  className,
  isMobile = false,
}) => {
  const t = useTranslations();
  const router = useRouter();
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (isMobile) return;

    const checkVisibility = () => {
      const isExistingSearchVisible =
        document.body.getAttribute("data-existing-search-visible") === "true";
      setIsHidden(isExistingSearchVisible);
    };

    checkVisibility();

    const observer = new MutationObserver(checkVisibility);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-existing-search-visible"],
    });

    return () => observer.disconnect();
  }, [isMobile]);

  const handleSearchSubmit = useCallback(
    (query: string) => {
      router.push(
        `/questions` + encodeQueryParams({ [POST_TEXT_SEARCH_FILTER]: query })
      );
      onSubmit?.();
    },
    [router, onSubmit]
  );

  const visibilityClass = isMobile
    ? "flex xl:hidden"
    : isHidden
      ? "hidden"
      : "hidden xl:flex";

  return (
    <div
      className={`self-center xl:ml-4 xl:items-center ${visibilityClass} ${className}`}
    >
      <SearchInput
        onChange={() => {}} // This is now handled internally in SearchInput
        onErase={() => {}} // This is now handled internally in SearchInput
        onSubmit={handleSearchSubmit}
        placeholder={t("questionSearchPlaceholder")}
        size="base"
        className="w-full"
        globalSearch={true}
        inputRef={inputRef}
      />
    </div>
  );
};

export default GlobalSearch;
