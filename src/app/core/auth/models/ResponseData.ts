import { User } from "../../models/UserData";

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

