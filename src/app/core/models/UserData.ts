export interface User {
    id: String
    firstName: String
    lastName: String
    email: String
    dateOfBirth: String
    pesel: String
    phoneNumber: String
    gender: Gender
    role: Role
}

export interface PatientData {
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

export enum Role {
    ADMINISTRATOR = 'ADMINISTRATOR',
    PATIENT = 'PATIENT',
    DOCTOR = 'DOCTOR',
    PHARMACIST = 'PHARMACIST'
}