import { User, UserMatchEvent } from "../clients/DoggyDayApi";

const MIN_MATCH_COUNT = 3;

// Checks if a given otherUser is in the same NeighGroup as the user
const getUsersGroup = (user: User): string => {
 
  if (user.groups.includes("PHCH")) {
    return "PHCH";
  } else if (user.groups.includes("ParkSlope")) {
    return "ParkSlope";
  } else if (user.groups.includes("BoHill")) {
    return "BoHill";
  } else if (user.groups.includes("BWck")) {
    return "BWck";
  } else {
    return ""; // If none of the specific groups match, return empty string
  }
};

// Checks if a given otherUser is a valid match for the user
const getIsValidMatch =
  (user: User) =>
  (otherUser: User): boolean => {

    const isValid = (
                      (otherUser.email !== user.email) &&
                      (user.role === "owner" || otherUser.role === "owner") &&
                      (user.groups === otherUser.groups)
                    );
    return isValid;
    /**/
};

// Returns a comparator used for user ordering, the users with many earlier
// matches are ordered to the end of the resulting array, if the match count
// is equal then a random order is used.
const getUserComparator = (userMatchEvents: UserMatchEvent[]) => {
  const matchCounts = userMatchEvents
    .flatMap((event) => event.matches)
    .map((matchUser) => matchUser.id)
    .reduce((acc: Record<string, number>, id) => {
      acc[id] = acc[id] ? acc[id] + 1 : 1;
      return acc;
    }, {});
  return (u1: User, u2: User) => {
    const c1 = matchCounts[u1.id];
    const c2 = matchCounts[u2.id];
    return c1 === c2 ? Math.random() - Math.random() : c1 - c2;
  };
};

export const generateNewMatches = (
  user: User | undefined,
  userMatchEvents: UserMatchEvent[],
  allUsers: User[]
): User[] => {
  if (!user || allUsers.length < MIN_MATCH_COUNT) {
    // No users available or not enough users, cannot generate matches
    return [];
  }
  const previousMatches = userMatchEvents.flatMap(event => event.matches);

  // Exclude user IDs from previous matches
  const excludedUsers = new Set(previousMatches.map(matchUser => matchUser.email));

  // Filter all valid users and sort them by comparator, with the rest in random order
  const isValidMatch = getIsValidMatch(user);
  const userComparator = getUserComparator(userMatchEvents);
  const sortedValidUsersWithNoPrevMatches = allUsers.filter(isValidMatch).filter(u => !excludedUsers.has(u.email)).sort(userComparator);
  const sortedValidUsers = allUsers.filter(isValidMatch).sort(userComparator);
  console.log("Sorted valid users with NO previous matches are: ", sortedValidUsersWithNoPrevMatches);
  console.log("Sorted valid users are: ", sortedValidUsers);
  console.log("sortedValidUsersWithNoPrevMatches.length ", sortedValidUsersWithNoPrevMatches.length);

  if (sortedValidUsersWithNoPrevMatches.length < MIN_MATCH_COUNT) {
    // No users available or not enough users, cannot generate matches
    return [];
  }
  return sortedValidUsersWithNoPrevMatches.splice(0, 3);

  
};
