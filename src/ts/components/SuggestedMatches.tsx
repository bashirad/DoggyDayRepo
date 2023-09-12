import {
  DoggyDayApiClientContext,
  DirectoryView,
  
} from "../clients/DoggyDayApiClient";
import { useContext, useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { generateNewMatches } from "../utils/matchUtil";
import SuggestedMatchesList from "./SuggestedMatchesList";
import SuggestedMatchesEmail from "./SuggestedMatchesEmail";
import { User, UserMatchEvent } from "../clients/DoggyDayApi";

export interface SuggestedMatchesProps {
  user?: User;
  events: UserMatchEvent[];
}

const SuggestedMatches = ({ user, events }: SuggestedMatchesProps) => {
  const doggyDayApiClient = useContext(DoggyDayApiClientContext);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allUsersLoading, setAllUsersLoading] = useState(false);
  const [suggestedMatches, setSuggestedMatches] = useState<User[]>([]);

  useEffect(() => {
    setAllUsers([]);
    setAllUsersLoading(true);
    doggyDayApiClient
      .listUsersForMatching({ view: DirectoryView.ALL_MEMBERS })
      .then((newUsers) => {
        setAllUsers(newUsers);
      })
      .catch((err) => {
        console.log("Airtable error: " + err);
      })
      .finally(() => {
        setAllUsersLoading(false);
      });
  }, [user, doggyDayApiClient]);
  
  
  const regenerateMatches = () => {
    const generatedMatches = generateNewMatches(user, events, allUsers);
    setSuggestedMatches(generatedMatches);
  };
  useEffect(() => {
    regenerateMatches();
  }, [allUsers]);

  if (suggestedMatches.length === 0) {
    return (
      <div className="card mt-4 mb-4">
        <div className="card-body">
          <h3 className="card-title">
            Sorry! We Run Out of Matches
          </h3>
          <div className="row">
            <div className="col-12">
              <span className="fw-bold">Sorry: </span> Filtered users are empty
            </div>
          </div>
        </div>
      </div>
    );
  } 
  else {
      return (
        <div>
          {user && !!suggestedMatches.length && (
            <>
              <SuggestedMatchesList
                user={user}
                matches={suggestedMatches}
                regenerateMatches={regenerateMatches}
              />
              <SuggestedMatchesEmail
                user={user}
                suggestedMatches={suggestedMatches}
              />
            </>
          )}
          {allUsersLoading && (
            <LoadingSpinner loadingText="Calculating new matches..." />
          )}
        </div>
      );
  }
};

export default SuggestedMatches;