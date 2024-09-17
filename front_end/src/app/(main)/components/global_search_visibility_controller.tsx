"use client";

import React, { useEffect } from "react";

export default function GlobalSearchVisibilityController({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        document.body.setAttribute(
          "data-home-search-visible",
          entry.isIntersecting.toString()
        );
      },
      { threshold: 0.1 }
    );

    const homeSearchElement = document.querySelector("#home-search");
    if (homeSearchElement) {
      observer.observe(homeSearchElement);
    }

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}
