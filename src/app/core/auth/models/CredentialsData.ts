export interface LoginData {
    login: string,
    password: string
}

export interface ResetPasswordData {
    login: string,
    password: string,
    code: string
}

export interface VerificationData {
    login: string,
    code: string
}