import {
  DoggyDayApiClientContext,
  DirectoryView,
  
} from "../clients/DoggyDayApiClient";

import { useContext, useEffect, useState } from "react";

export interface UserInfoProps {
  user?: User;
}

import { User } from "../clients/DoggyDayApi";

const UserInfo = ({ user }: UserInfoProps) => {
  const doggyDayApiClient = useContext(DoggyDayApiClientContext);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allUsersLoading, setAllUsersLoading] = useState(false);

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

  const findUserByUserEmail = (email: string) =>
  allUsers.find(u => u.email === email) || ({} as User);

  const maybeMissing = (field: string | number) =>
    field || <span className="fst-italic">(missing)</span>;
  const maybeMissingLink = (linkUrl: string) =>
    linkUrl ? (
      <a href={linkUrl} target="_blank" rel="noopener noreferrer">
        link
      </a>
    ) : (
      <span className="fst-italic">(missing)</span>
    );
  return (
    allUsers && user && (
      <div className="card mt-4 mb-4">
        <div className="card-body">
          <h3 className="card-title">Profile</h3>
          <div className="card-text">
            <div className="row">
              <div className="col-4">
                <span className="fw-bold">User ID:</span> {" "}
                {maybeMissing(findUserByUserEmail(user.email).userNo)}
              </div>
              <div className="col-4">
                <span className="fw-bold">First Name:</span>{" "}
                {maybeMissing(findUserByUserEmail(user.email).firstName)}
              </div>
              <div className="col-4">
                <span className="fw-bold">Last Name:</span>{" "}
                {maybeMissing(findUserByUserEmail(user.email).lastName)}
              </div>
              <div className="col-4">
                <span className="fw-bold">Role:</span>{" "}
                {maybeMissing(findUserByUserEmail(user.email).role)}
              </div>
              <div className="col-4">
              <span className="fw-bold">Zip Code:</span>{" "}
              {maybeMissing(findUserByUserEmail(user.email).zipCode)}
              </div>
              <div className="col-4">
              <span className="fw-bold">Email:</span>{" "}
              {maybeMissing(findUserByUserEmail(user.email).email)}
              </div>
              <div className="col-4">
                <span className="fw-bold">Instagram:</span>{" "}
                {maybeMissingLink(findUserByUserEmail(user.email).instagramUrl)}
              </div>
              <div className="col-4">
                <span className="fw-bold">DoggyDay:</span>{" "} 
                {maybeMissingLink(findUserByUserEmail(user.email).profileUrl)}
              </div>
              

            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default UserInfo;
