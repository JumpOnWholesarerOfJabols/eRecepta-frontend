export enum MedicationForm {
  TABLET = 'TABLET',
  CAPSULE = 'CAPSULE',
  SYRUP = 'SYRUP',
  SOLUTION_FOR_INJECTION = 'SOLUTION_FOR_INJECTION',
  OINTMENT = 'OINTMENT',
  GEL = 'GEL',
  INHALER = 'INHALER',
  PATCH = 'PATCH',
}

export enum RouteOfAdministration {
  ORAL = 'ORAL',
  INTRAVENOUS = 'INTRAVENOUS',
  INTRAMUSCULAR = 'INTRAMUSCULAR',
  TOPICAL = 'TOPICAL',
  INHALATION = 'INHALATION',
  RECTAL = 'RECTAL',
}

export enum RiskLevel {
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  CONTRAINDICATED = 'CONTRAINDICATED',
}

export interface Ingredient {
  id: string;
  name: string;
  strength: string;
  isActive: boolean;
}

export interface DrugInteraction {
  targetMedicationId: string;
  riskLevel: RiskLevel;
  effect?: string | null;
}

export interface Medication {
  id: string;
  ean?: string | null;
  atcCode?: string | null;
  tradeName: string;
  genericName: string;
  manufacturer: string;
  form: MedicationForm;
  route: RouteOfAdministration;
  packageSize: string;
  requiresPrescription: boolean;
  ingredients: Ingredient[];
  indications?: string[] | null;
  sideEffects?: string[] | null;
}

export interface MedicationFilterInput {
  search?: string | null;
  requiresPrescription?: boolean | null;
  manufacturer?: string | null;
  atcCode?: string | null;
}

export interface IngredientInput {
  name: string;
  strength: string;
  isActive: boolean;
}

export interface UpdateIngredientInput {
  name?: string | null;
  strength?: string | null;
  isActive?: boolean | null;
}

export interface CreateMedicationInput {
  ean: string;
  atcCode: string;
  tradeName: string;
  genericName: string;
  manufacturer: string;
  form: MedicationForm;
  route: RouteOfAdministration;
  packageSize: string;
  requiresPrescription: boolean;
  ingredients?: IngredientInput[] | null;
  indications?: string[] | null;
  sideEffects?: string[] | null;
}

export interface PatchMedicationInput {
  ean?: string | null;
  atcCode?: string | null;
  tradeName?: string | null;
  genericName?: string | null;
  manufacturer?: string | null;
  form?: MedicationForm | null;
  route?: RouteOfAdministration | null;
  packageSize?: string | null;
  requiresPrescription?: boolean | null;
}
