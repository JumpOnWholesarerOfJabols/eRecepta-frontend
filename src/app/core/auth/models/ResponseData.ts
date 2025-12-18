import { User } from "../../models/UserData";

export enum DayOfWeek{
    SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY
}

export interface LoginResponse {
  login: {
    token: string;
    expiresAt: string;
  }
}

export interface UniversalResponse {
  response: {
    message: string;
  }
}

export interface GetAllUsersResponse {
  getAllUsers: User[]
}

export interface AdminUserDeleteResponse {
  deleteUser: {
    success: boolean;
    message: string;
  }
}

export interface AdminUserCreateResponse {
  createUser: {
    success: boolean;
    message: string;
  }
}

export interface WeeklyAvailability{
    doctorId: string
    dayOfWeek: DayOfWeek
    startTime: string
    endTime: string
}

export interface AllWeeklyAvailabilitiesResponse {
  findAllWeeklyAvailabilities: WeeklyAvailability[];
}

