import { User } from "./UserData";

export enum DayOfWeek {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY'
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

