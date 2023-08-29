import { User } from "../clients/DoggyDayApi";
import React, { useContext, useEffect, useState } from "react";
import EmailSendForm from "./EmailSendForm";
import LoadingSpinner from "./LoadingSpinner";
import { getImageUrl } from "../utils/imageUtil";
import { DoggyDayApiClientContext } from "../clients/DoggyDayApiClient";

/* eslint-disable @typescript-eslint/no-var-requires */
const emailTemplate = require("../../templates/email_matches.hbs");
const FALLBACK_PROFILE_URL =
  "https://doggyday.co/wp-content/uploads/2021/11/8.png";

export interface SuggestedMatchesEmailProps {
  user?: User;
  suggestedMatches: User[];
}

const SuggestedMatchesEmail = ({
  user,
  suggestedMatches,
}: SuggestedMatchesEmailProps) => {
  const doggyDayApiClient = useContext(DoggyDayApiClientContext);
  const [currentVersion, setCurrentVersion] = useState(0);
  const [content, setContent] = useState<string>();

  useEffect(() => {
    if (!user || !suggestedMatches.length) {
      return;
    }
    setCurrentVersion(currentVersion + 1);
    const renderedVersion = currentVersion;

    setContent(undefined);
    const matchedUsers = suggestedMatches.map(async (user): Promise<User> => {
      const photoUrl = await getImageUrl(user.photoUrl, FALLBACK_PROFILE_URL);
      return {
        ...user,
        photoUrl,
      };
    });
    Promise.all(matchedUsers).then((suggestedMatches) => {
      if (renderedVersion !== currentVersion) {
        // The rendered version doesn't match current version, drop results
        return;
      }
      const updatedContent = emailTemplate({
        user,
        suggestedMatches,
        timestamp: Math.round(Date.now() / 1000),
      });
      setContent(updatedContent);
    });
  }, [user, suggestedMatches]);

  const getEmailSentCallback = () => {
    const sentUser = user;
    const sentMatches = suggestedMatches;
    const apiClient = doggyDayApiClient;
    return async () => {
      const sentDate = new Date();
      await apiClient.storeMatches(sentUser, sentMatches, sentDate);
    };
  };

  return content ? (
    <div className="card mt-4 mb-4">
      <div className="card-body">
        <h3 className="card-title">Match Email</h3>
        <div className="card-text">
          <EmailSendForm
            toAddress={user.email}
            subject="Your DoggyDay neighbors are here!"
            htmlContent={content}
            sentCallback={getEmailSentCallback()}
          />
        </div>
      </div>
    </div>
  ) : (
    <LoadingSpinner loadingText="Generating suggested matches email..." />
  );
};

export default SuggestedMatchesEmail;
