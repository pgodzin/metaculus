"use client";

import { useTranslations } from "next-intl";
import React, { FC, useCallback, useState } from "react";

import { updateProfileAction } from "@/app/(main)/accounts/profile/actions";
import Checkbox from "@/components/ui/checkbox";
import { ProfilePreferencesType } from "@/types/preferences";
import { CurrentUser } from "@/types/users";

export type Props = {
  user: CurrentUser;
};

const AccountPreferences: FC<Props> = ({ user }) => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);

  const handlePreferencesChange = useCallback(
    async (preferenceType: ProfilePreferencesType, checked: boolean) => {
      // remove after BE updates
      if (user.unsubscribed_preferences_tags === undefined) {
        user.unsubscribed_preferences_tags = [];
      }

      const preferences = checked
        ? user.unsubscribed_preferences_tags?.filter(
            (remote_type) => remote_type != preferenceType
          )
        : Array.from(
            new Set([...user.unsubscribed_preferences_tags, preferenceType])
          );

      console.log(preferences, preferenceType, checked);

      setIsLoading(true);
      try {
        // Update helper (BE) to handle unsubscribed_preferences_tags field
        await updateProfileAction({
          unsubscribed_preferences_tags: preferences,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [user.unsubscribed_preferences_tags]
  );

  const options = [
    {
      type: ProfilePreferencesType.community_prediction_default,
      label: t("showCommunityPredictionByDefault"),
    },
    {
      type: ProfilePreferencesType.community_prediction_if_predicted,
      label: t("showCommunityPredictionIfPredicted"),
    },
  ];

  return (
    <section>
      <h2 className="mx-[-4px] mb-5 mt-3 border-t border-gray-500 px-1 pt-4">
        {t("settingsPreferences")}
      </h2>

      <h3 className="bg-blue-200 p-1 text-sm font-medium dark:bg-blue-800">
        {t("communityPredictionLabel")}
      </h3>
      <div className="text-sm">
        {options.map(({ type, ...opts }) => (
          <Checkbox
            key={`subscriptions-${type}`}
            checked={!user.unsubscribed_preferences_tags?.includes(type)} // if user didn`t unsubscribe check by default
            onChange={(checked) => {
              handlePreferencesChange(type, checked).then();
            }}
            className="p-1.5"
            readOnly={isLoading}
            {...opts}
          />
        ))}
      </div>
    </section>
  );
};

export default AccountPreferences;