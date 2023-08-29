import { User } from "../clients/DoggyDayApi";

export interface UserMatchUserInfoProps {
  user: User;
}

const UserMatchEventUserInfo = ({ user }: UserMatchUserInfoProps) => {
  return (
    <div>
      <div className="row">
        <div className="col-12">
          <span className="fw-bold">Name:</span> {user.firstName}{" "}
          {user.lastName}
        </div>
        <div className="col-12">
          <span className="fw-bold">Email:</span>{" "}
          <a href={`mailto:${user.email}`}>{user.email}</a>
        </div>
        <div className="col-12">
          <span className="fw-bold">Zip Code:</span>{" "}
          {user.zipCode || <span className="fst-italic">(missing)</span>}
        </div>
        <div className="col-12">
          <span className="fw-bold">Instagram:</span>{" "}
          {user.instagramUrl ? (
            <a
              href={user.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              link
            </a>
          ) : (
            <span className="fst-italic">(missing)</span>
          )}
        </div>
        <div className="col-12">
          <span className="fw-bold">Doggy Day:</span>{" "}
          <a href={user.profileUrl} target="_blank" rel="noopener noreferrer">
            link
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserMatchEventUserInfo;
