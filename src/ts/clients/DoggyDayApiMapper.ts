import Airtable from "airtable";
import { FullUser, User, /*UserForTable, */UserRole } from "./DoggyDayApi";

export interface RawUserMatch {
  id: string;
  user: string;
  matches: string[];
  emailSentDate: string;
}

class DoggyDayApiMapper {
  /*mapUserForTable (record: Airtable.Record<Airtable.FieldSet>): UserForTable {
    return {
      id: record.id,
      userNo: <number>record.get("NO"),
      email: <string>record.get("Email"),
      role: <UserRole>record.get("Role"),
      activity: <string>record.get("Activity"),
      startDate: <string>record.get("StartDate"),
      endDate: <string>record.get("EndDate"),
      activePeriod: <string>record.get("ActivePeriod"),
    };
  }*/
  mapUser(record: Airtable.Record<Airtable.FieldSet>): User {
    return {
      id: record.id,
      userNo: <number>record.get("NO"),
      userId: <number>record.get("ID"),
      email: <string>record.get("Email"),
      role: <UserRole>record.get("Role"),
      activity: <string>record.get("Activity"),
      sentMatches: <string>record.get("sentMatches"),
      startDate: <string>record.get("StartDate"),
      endDate: <string>record.get("EndDate"),
      activePeriod: <string>record.get("ActivePeriod"),
      zipCode: <number>record.get("ZipNo"),
      firstName: <string>record.get("FirstName"),
      lastName: <string>record.get("LastName"),
      groups: <string>record.get("NeighGroup") ,
      status: <string>record.get("Status"),
      profileComplete: <boolean>record.get("Profile complete?"),
      profileUrl: <string>record.get("Profile link"),
      instagramUrl: <string>record.get("IGHandle"),
      photoUrl: <string>record.get("WPPhotoLink"),
    };
  }

  mapFullUser(record: Airtable.Record<Airtable.FieldSet>): FullUser {
    const mappedUser = this.mapUser(record);
    return {
      ...mappedUser,
      dogName: <string>record.get("DogName"),
      dogBreed: <string>record.get("DogBreed"),
      dogSize: <string>record.get("DogSize"),
    };
  }

  mapUserMatch(record: Airtable.Record<Airtable.FieldSet>): RawUserMatch {
    return {
      id: record.id,
      user: <string>record.get("ID1"),
      matches: [
        <string>record.get("ID2"),
        <string>record.get("ID3"),
        <string>record.get("ID4"),
      ],
      emailSentDate: <string>record.get("A-EmailSentDate"),
    };
  }

  createUserMatch(
    user: User,
    matches: User[],
    sentDate?: Date
  ): Partial<Airtable.FieldSet> {
    if (matches.length != 3) {
      throw Error(`Exactly 3 matches required, got ${matches.length}`);
    }
    const m1 = matches[0];
    const m2 = matches[1];
    const m3 = matches[2];
    return {
      ID1: [user.firstName],
      ID2: [m1.firstName],
      ID3: [m2.firstName],
      ID4: [m3.firstName],
      "A-EmailSentDate": sentDate ? sentDate.getTime() : undefined,
    };
  }
}

export default DoggyDayApiMapper;
