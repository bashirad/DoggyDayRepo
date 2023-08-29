import { UserMatchEvent } from "../clients/DoggyDayApi";
import UserMatchEventUserInfo from "./UserMatchEventUserInfo";

export interface UserMatchProps {
  title: string;
  event: UserMatchEvent;
}

const UserMatchEventCard = ({ title, event }: UserMatchProps) => {
  return (
    <div className="card mt-2 mb-2">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <div className="card-text">
          <div className="row">
            {event.matches.map((matchUser) => (
              <div key={matchUser.userId} className="col-4">
                <UserMatchEventUserInfo user={matchUser} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMatchEventCard;
