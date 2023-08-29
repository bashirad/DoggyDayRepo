import UserMatchEventCard from "./UserMatchEventCard";
import { UserMatchEvent } from "../clients/DoggyDayApi";

export interface UserMatchListProps {
  events: UserMatchEvent[];
}

const UserMatchEventList = ({ events }: UserMatchListProps) => {
  const orderByEmailSentDesc = (m1: UserMatchEvent, m2: UserMatchEvent) => {
    const m1Date = m1.emailSentDate
      ? Date.parse(m1.emailSentDate)
      : Number.MAX_VALUE;
    const m2Date = m2.emailSentDate
      ? Date.parse(m2.emailSentDate)
      : Number.MAX_VALUE;
    return m2Date - m1Date;
  };
  return (
    !!events.length && (
      <div className="card mt-4 mb-4">
        <div className="card-body">
          <h3 className="card-title">Previous Matches</h3>
          <div className="card-text">
            {[...events].sort(orderByEmailSentDesc).map((event) => {
              const title = event.emailSentDate
                ? `Sent ${new Date(
                    Date.parse(event.emailSentDate)
                  ).toLocaleString()}`
                : "Not Sent";
              return (
                <UserMatchEventCard
                  key={event.id}
                  title={title}
                  event={event}
                />
              );
            })}
          </div>
        </div>
      </div>
    )
  );
};

export default UserMatchEventList;
