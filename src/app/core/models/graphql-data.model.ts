export interface GraphQLErrorExtensions {
  errorCode: string;
  validationErrors?: { [field: string]: string };
  classification?: string;
  [key: string]: any;
}

export interface GraphQLErrorList {
  message: string;
  extensions: GraphQLErrorExtensions;
  path?: (string | number)[];
  locations?: Array<{ line: number; column: number }>;
}

export interface GraphQLError<T = any> {
  data?: T;
  errors?: GraphQLErrorList[];
  extension: any;
  name: String;
  message: String;
}

export interface MutationResponse<T = any> {
  data: T;
  errors: GraphQLError[];
  loading: boolean;
}

// Appointment related types
export enum Specialization {
  CARDIOLOGY = 'CARDIOLOGY',
  DERMATOLOGY = 'DERMATOLOGY',
  ENDOCRINOLOGY = 'ENDOCRINOLOGY',
  GASTROENTEROLOGY = 'GASTROENTEROLOGY',
  NEUROLOGY = 'NEUROLOGY',
  ONCOLOGY = 'ONCOLOGY',
  OPHTHALMOLOGY = 'OPHTHALMOLOGY',
  ORTHOPEDICS = 'ORTHOPEDICS',
  OTOLARYNGOLOGY = 'OTOLARYNGOLOGY',
  PEDIATRICS = 'PEDIATRICS',
  PSYCHIATRY = 'PSYCHIATRY',
  PULMONOLOGY = 'PULMONOLOGY',
  RADIOLOGY = 'RADIOLOGY',
  SURGERY = 'SURGERY',
  UROLOGY = 'UROLOGY',
  GYNECOLOGY = 'GYNECOLOGY',
  OBSTETRICS = 'OBSTETRICS',
  FAMILY_MEDICINE = 'FAMILY_MEDICINE',
  INTERNAL_MEDICINE = 'INTERNAL_MEDICINE',
  EMERGENCY_MEDICINE = 'EMERGENCY_MEDICINE',
}

export enum VisitStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Visit {
  id: string;
  doctorId: string;
  patientId: string;
  specialization: Specialization;
  visitTime?: string;
  visitStatus?: VisitStatus;
}

export interface CreateVisitInput {
  doctorId: string;
  specialization: Specialization;
  visitTime?: string;
}

// Patient History related types
export enum BloodType {
  A_POSITIVE = 'A_POSITIVE',
  A_NEGATIVE = 'A_NEGATIVE',
  B_POSITIVE = 'B_POSITIVE',
  B_NEGATIVE = 'B_NEGATIVE',
  AB_POSITIVE = 'AB_POSITIVE',
  AB_NEGATIVE = 'AB_NEGATIVE',
  O_POSITIVE = 'O_POSITIVE',
  O_NEGATIVE = 'O_NEGATIVE',
}

export enum RevisionType {
  ADD = 'ADD',
  MOD = 'MOD',
  DEL = 'DEL',
}

export interface PatientInfo {
  userId: string;
  bloodType: BloodType;
  height: number;
  weight: number;
  allergies: string[];
  chronicDiseases: string[];
  medications: string[];
  emergencyContact: string;
}

export interface PatientHistoryEntry {
  revisionNumber: number;
  revisionDate: string;
  revisionType: RevisionType;
  patientState: PatientInfo;
}