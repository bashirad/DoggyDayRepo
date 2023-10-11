import { useContext, useEffect, useState } from "react";
import {
  SubscriptionRecordView,
  DoggyDayApiClientContext,
  DirectoryView,
} from "../clients/DoggyDayApiClient";
import UserTable from "../components/UserTable";
import LoadingSpinner from "../components/LoadingSpinner";
import { User } from "../clients/DoggyDayApi";

const DirectoryPage = () => {
  const doggyDayClient = useContext(DoggyDayApiClientContext);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  useEffect(() => {
    setUsers([]);
    setUsersLoading(true);
    doggyDayClient
      .listUsers({ view: SubscriptionRecordView.UI_VIEW })
      .then((newUsers) => {
        setUsers(newUsers);
      })
      .catch((err) => {
        console.log("Airtable error: " + err);
      })
      .finally(() => {
        setUsersLoading(false);
      });
  }, [doggyDayClient]);

  return (
    <div>
      <h2>Weekly Active</h2>
      <UserTable users={users} />
      <div className="row">
        <div className="col-sm-12">{usersLoading && <LoadingSpinner />}</div>
      </div>
    </div>
  );
};

export default DirectoryPage;
