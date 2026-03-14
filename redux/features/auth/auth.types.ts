export enum Roles {
  FREE = "FREE",
  PREMIUM = "PREMIUM",
  COACHING = "COACHING",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: Roles;
  image?: string;
  uniqueNameCode: string;
  friends: string[];
  friendRequests: string[];
  studentInfo?: {
    instituteName: string;
    group: string;
    class: string;
  };
}
