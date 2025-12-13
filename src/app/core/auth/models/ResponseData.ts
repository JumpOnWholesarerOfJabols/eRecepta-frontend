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

