import { createContext, useContext, useEffect, useState } from "react";
import { AirtableConfig, createAirtableClient } from "./AirtableClient";
import DoggyDayApiMapper, { RawUserMatch } from "./DoggyDayApiMapper";
import { FullUser, User, /*UserForTable,*/ UserMatchEvent } from "./DoggyDayApi";
import Airtable from "airtable";

const TABLE_TEST = "SubscriptionRecordTest";
const TABLE_DIRECTORY = "DirectoryTest";
const TABLE_MATCHES_V4 = "Matches_v4";

export interface DoggyDayClientProps {
  airtableConfig?: AirtableConfig;
}

export enum SubscriptionRecordTestView {
  WEEKLY_ACTIVE = "viwPoxCUgdifKfDsc"
}

export enum DirectoryView {
  ALL_MEMBERS = "viwMhs93cxBHEOZg9",
  MATCH_GROUP = "viwllRLPvvL3ujr2W"
}


export interface ListUsersProps {
  view?: SubscriptionRecordTestView;
  idFilter?: string[];
  userIdFilter?: string[];
}
export interface ListUsersMatchProps {
  view?: DirectoryView;
  idFilter?: string[];
  userIdFilter?: string[];
  userGroup?: string;
}



class DoggyDayApiClient {
  private readonly airtableClient;
  private readonly mapper;

  constructor({ airtableConfig }: DoggyDayClientProps = {}) {
    this.airtableClient = airtableConfig
      ? createAirtableClient(airtableConfig)
      : undefined;
    this.mapper = new DoggyDayApiMapper();
  }

  async getUser(id: string): Promise<User> {
    if (!this.airtableClient) {
      return;
    }
    return new Promise((resolve, reject) => {
      this.airtableClient(TABLE_TEST).find(id, (err, record) => {
        if (err) {
          return reject(err);
        } else {
          resolve(this.mapper.mapUser(record));
        }
      });
    });
  }

  // Get matches from the Directory Table
  async getUserForMatching(id: string): Promise<User> {
    if (!this.airtableClient) {
      return;
    }
    return new Promise((resolve, reject) => {
      this.airtableClient(TABLE_DIRECTORY).find(id, (err, record) => {
        if (err) {
          return reject(err);
        } else {
          resolve(this.mapper.mapUser(record));
        }
      });
    });
  }

  async listUserMatches(id: string): Promise<UserMatchEvent[]> {
    if (!this.airtableClient) {
      return [];
    }
    const user = await this.getUserForMatching(id);
    const userMatches = await this.listRawUserMatches(user.userId);
    const idFilter = Array.from(new Set(userMatches.flatMap((m) => m.matches)));
    const otherUsers = await this.listUsersForMatching({ idFilter });
    const userMap = [user, ...otherUsers].reduce(
      (acc: Record<string, User>, user) => ({ ...acc, [user.id]: user }),
      {}
    );
    return userMatches.map((m) => ({
      id: m.id,
      user: userMap[m.user],
      matches: m.matches.map((id) => userMap[id]),
      emailSentDate: m.emailSentDate,
    }));
  }

  private async listRawUserMatches(userID: number): Promise<RawUserMatch[]> {
    return new Promise<RawUserMatch[]>((resolve, reject) => {
      let userMatches: RawUserMatch[] = [];
      this.airtableClient(TABLE_MATCHES_V4)
        .select({
          sort: [{ field: "No.", direction: "asc" }],
          filterByFormula: `{ID1}='${userID}'`,
        })
        .eachPage(
          (records, fetchNextPage) => {
            const newUserMatches = records.map((record) =>
              this.mapper.mapUserMatch(record)
            );
            userMatches = userMatches.concat(newUserMatches);
            fetchNextPage();
          },
          (error) => {
            if (error) {
              reject(error);
            } else {
              resolve(userMatches);
            }
          }
        );
    });
  }

  async listUsers({
    view = SubscriptionRecordTestView.WEEKLY_ACTIVE,
    idFilter = [],
    userIdFilter = [],
  }: ListUsersProps = {}): Promise<User[]> {
    if (!this.airtableClient) {
      return [];
    }
    return new Promise((resolve, reject) => {
      let users: User[] = [];
      const filterTerms = [
        ...userIdFilter.map((userId) => `{NO}='${userId}'`),
        ...idFilter.map((pkey) => `RECORD_ID()='${pkey}'`),
      ];
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const selectParams: Record<string, any> = {
        sort: [{ field: "ID", direction: "asc" }],
        view,
      };
      if (filterTerms.length) {
        selectParams["filterByFormula"] = `OR(${filterTerms.join(",")})`;
      }
      this.airtableClient(TABLE_TEST)
        .select(selectParams)
        .eachPage(
          (records, fetchNextPage) => {
            const newUsers = records.map(this.mapper.mapUser);
            users = [...users, ...newUsers];
            fetchNextPage();
          },
          (error) => {
            if (error) {
              reject(error);
            } else {
              resolve(users);
            }
          }
        );
    });
  }

// this lists the user matches
async listUsersForMatching({
  view = DirectoryView.ALL_MEMBERS,
  idFilter = [],
  userIdFilter = [],
  userGroup,
  
}: ListUsersMatchProps = {}): Promise<User[]> {
  if (!this.airtableClient) {
    return [];
  }
  
  return new Promise((resolve, reject) => {
   let currentGroup = "PHCH";
    let users: User[] = [];
    const filterTerms = [
      ...userIdFilter.map((userId) => `{ID}='${userId}'`),
      ...idFilter.map((pkey) => `RECORD_ID()='${pkey}'`),
    ];
    /* eslint-disable @typescript-eslint/no-explicit-any */
    /*const selectParams: Record<string, any> = {
      sort: [{ field: "ID", direction: "asc" }],
      view,
    };*/

    const selectParams: Record<string, any> = {
      sort: [{ field: "ID", direction: "asc" }],
      view,
      //filterByFormula: `{NeighGroup}='${userGroup}'`,
    };

    if (filterTerms.length) {
      selectParams["filterByFormula"] = `OR(${filterTerms.join(",")})`;
    }
    this.airtableClient(TABLE_DIRECTORY)
      .select(selectParams)
      .eachPage(
        (records, fetchNextPage) => {
          const newUsers = records.map(this.mapper.mapUser);
          users = [...users, ...newUsers];
          fetchNextPage();
        },
        (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(users);
          }
        }
      );
  });
}

  async storeMatches(
    user: User,
    matches: User[],
    sentDate?: Date
  ): Promise<Airtable.Record<Airtable.FieldSet>> {
    return new Promise((resolve, reject) => {
      const userMatch = this.mapper.createUserMatch(user, matches, sentDate);
      this.airtableClient(TABLE_MATCHES_V4).create(
        userMatch,
        (error, record) => {
          if (error) {
            reject(error);
          } else {
            resolve(record);
          }
        }
      );
    });
  }

  async storeMatches2(
    user: User,
    matches: User[],
    sentDate?: Date
  ): Promise<Airtable.Record<Airtable.FieldSet>> {
    return new Promise((resolve, reject) => {
      const userMatch = this.mapper.createUserMatch(user, matches, sentDate);
      this.airtableClient(TABLE_MATCHES_V4).create(
        userMatch,
        (error, record) => {
          if (error) {
            reject(error);
          } else {
            resolve(record);
          }
        }
      );
    });
  }

}

export const DoggyDayApiClientContext = createContext<DoggyDayApiClient>(
  new DoggyDayApiClient()
);

export default DoggyDayApiClient;
