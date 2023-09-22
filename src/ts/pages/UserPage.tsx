import { useContext, useEffect, useState } from "react";
import { DoggyDayApiClientContext } from "../clients/DoggyDayApiClient";
import { useParams } from "react-router-dom";
import UserInfo from "../components/UserInfo";
import UserMatchEventList from "../components/UserMatchEventList";
import LoadingSpinner from "../components/LoadingSpinner";
import SuggestedMatches from "../components/SuggestedMatches";
import { User, UserMatchEvent } from "../clients/DoggyDayApi";

const UserPage = () => {
  const { userId } = useParams();
  const { id } = useParams();
  const doggyDayApiClient = useContext(DoggyDayApiClientContext);
  const [user, setUser] = useState<User>();
  const [userLoading, setUserLoading] = useState(false);
  const [userMatchEvents, setUserMatchEvents] = useState<UserMatchEvent[]>([]);
  const [userMatchesLoading, setUserMatchesLoading] = useState(false);


  useEffect(() => {
    setUser(undefined);
    setUserLoading(true);
    doggyDayApiClient
      .getUser(userId)
      .then((newUser) => {
        setUser(newUser);
      })
      .catch((err) => {
        console.log("Airtable error: " + err);
      })
      .finally(() => {
        setUserLoading(false);
      });
  }, [userId, doggyDayApiClient]);
  
  useEffect(() => {
    setUserMatchEvents([]);
    setUserMatchesLoading(true);
    doggyDayApiClient
      .listUserMatches(userId)
      .then((newUserMatches) => {
        setUserMatchEvents(newUserMatches);
      })
      .catch((err) => {
        console.log("Airtable error: " + err);
      })
      .finally(() => {
        setUserMatchesLoading(false);
      });
  }, [userId, doggyDayApiClient]);

  console.log("user ", user);
  console.log("userMatchEvents ", userMatchEvents);
  
  return (
    <div>
      <h2>User</h2>
      {userLoading ? (
        <LoadingSpinner loadingText="Loading user information..." />
      ) : (
        <>
          <UserInfo user={user} />
          {userMatchesLoading ? (
            <LoadingSpinner loadingText="Loading user matches..." />
          ) : (
            <>
          <SuggestedMatches user={user} events={userMatchEvents} />
          <UserMatchEventList events={userMatchEvents} />

          {/* Print the user object 
          <pre>{JSON.stringify(user, null, 2)}</pre>*/}
          
            </>
          )}``
        </>
      )}
    </div>
  );
};

export default UserPage;
