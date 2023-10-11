  export type UserRole = "owner" | "neighbor";

  /*export interface UserForTable {
    id: string;
    userNo: number;
    email: string;
    role: string;
    activity: string;
    startDate: string;
    endDate: string;
    activePeriod: string;
  }*/

  export interface User {
    id: string;
    userNo: number;
    userId: number;
    activity: string;
    startDate: string;
    endDate: string;
    activePeriod: string;
    sentMatches: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    zipCode: number;
    groups: string;
    email: string;
    status: string;
    profileComplete: boolean;
    profileUrl: string;
    instagramUrl: string;
    photoUrl: string;
  }

  export interface FullUser extends User {
    dogName: string;
    dogBreed: string;
    dogSize: string;
  }

  export interface UserMatchEvent {
    id?: string;
    user: User;
    matches: User[];
    emailSentDate?: string;
  }