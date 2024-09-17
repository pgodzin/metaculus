"use client";
import React, { useState, RefObject, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import SearchInput from "@/components/search_input";
import { POST_TEXT_SEARCH_FILTER } from "@/constants/posts_feed";
import { encodeQueryParams } from "@/utils/navigation";

interface GlobalSearchProps {
  globalSearch?: boolean;
  inputRef?: RefObject<HTMLInputElement>;
  onSubmit?: () => void;
  className?: string;
  isMobile?: boolean; // New prop to indicate if it's the mobile version
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  globalSearch,
  inputRef,
  onSubmit,
  className,
  isMobile = false, // Default to false
}) => {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const urlSearchQuery = searchParams.get("search");
    setSearchQuery(urlSearchQuery || "");
  }, [searchParams]);

  useEffect(() => {
    if (isMobile) return; // Skip this effect for mobile version

    const checkVisibility = () => {
      const isHomeSearchVisible =
        document.body.getAttribute("data-home-search-visible") === "true";
      setIsHidden(isHomeSearchVisible);
    };

    checkVisibility();

    const observer = new MutationObserver(checkVisibility);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-home-search-visible"],
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
    ? "flex xl:hidden" // Show on mobile, hide on xl screens
    : isHidden
      ? "hidden"
      : "hidden xl:flex"; // Desktop behavior

  return (
    <div
      className={`self-center xl:ml-4 xl:items-center ${visibilityClass} ${className}`}
    >
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
    </div>
  );
};

export default GlobalSearch;
