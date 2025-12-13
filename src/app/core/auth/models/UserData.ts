export interface UserData {
    email: string
    pesel: string
    firstName: string
    lastName: string
    phoneNumber: string
    gender: Gender | null
    dateOfBirth: string
    password: string
}

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE'
}