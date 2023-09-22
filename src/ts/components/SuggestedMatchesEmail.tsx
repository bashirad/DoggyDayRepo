import { User } from "../clients/DoggyDayApi";
import React, { useContext, useEffect, useState } from "react";
import EmailSendForm from "./EmailSendForm";
import LoadingSpinner from "./LoadingSpinner";
import { getImageUrl } from "../utils/imageUtil";
import { DoggyDayApiClientContext } from "../clients/DoggyDayApiClient";
import StoreIDsForm from "./StoreIDsForm";
import axios from "axios";

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
  const [ids, setIds] = useState<number[]>([]);

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
      //await apiClient.storeMatches(sentUser, sentMatches, sentDate);
      // get sentUser's id, and the 3 ids of the 3 sentmatches from here
      const newIds = [sentUser.userId, ...sentMatches.slice(0, 3).map(match => match.userId)];
      setIds(newIds);
    };
  };

  const handleFormSubmit = async (submittedIds: number[]) => {
    try {
      // Construct the URL for the PHP code
      const apiUrl = "https://doggyday.co/storeMatches.php";

      // Create an object with the data to send as parameters
      const sentDate = new Date();
      const dataToSend = {
        sentUser: submittedIds[0],
        sentMatch1: submittedIds[1],
        sentMatch2: submittedIds[2],
        sentMatch3: submittedIds[3],
        sentDate: sentDate,
      };

      // Make a POST request to the PHP code
      const response = await axios.post(apiUrl, dataToSend);

      if (response.status === 200) {
        // If the request is successful, you can handle the success or navigate to a success page
        console.log("Form submitted successfully!");
      } else {
        console.error("Error submitting form: Unexpected response status:", response.status);
      }
    } catch (error) {
      // If there's an error, set the error message
      console.error("Error submitting form:", error.message);
    }
  };  


  return content ? (
    <div className="card mt-4 mb-4">
      <div className="card-body">
        <h3 className="card-title">Match Email</h3>
        <div className="card-text">
          <StoreIDsForm
             id1={ids[0]} // Use the IDs from state
             id2={ids[1]}
             id3={ids[2]}
             id4={ids[3]}
            onSubmit={handleFormSubmit}       
            />
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
