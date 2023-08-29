import { User, UserMatchEvent } from "../clients/DoggyDayApi";
import UserMatchEventCard from "./UserMatchEventCard";

export interface SuggestedMatchesListProps {
  user: User;
  matches: User[];
  regenerateMatches: () => void;
}

const SuggestedMatchesList = ({
  user,
  matches,
  regenerateMatches,
}: SuggestedMatchesListProps) => {
  const event: UserMatchEvent = {
    user,
    matches,
  };
  return (
    <div className="card mt-4 mb-4">
      <div className="card-body">
        <h3 className="card-title">Suggested Matches</h3>
        <div className="card-text">
          {!!matches.length && (
            <div>
              <UserMatchEventCard title="Not Sent Yet" event={event} />
              <div className="d-grid gap-2">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={regenerateMatches}
                >
                  Generate New Matches
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuggestedMatchesList;
