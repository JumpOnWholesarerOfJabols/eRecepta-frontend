export const ERROR_MESSAGES: Record<string, string> = {
  // =====================
  // User & Identity errors
  // =====================
  'UserDoesNotExistException': 'User does not exist in the system',
  'UserNotFoundException': 'User not found', // Występuje w medical-documents-service
  'UserAlreadyExistsException': 'User with this email address or PESEL number already exists',
  'InvalidCredentialsException': 'Invalid email, PESEL or password',
  'AccountVerificationException': 'Account has not been verified. Check your email inbox.',
  'UnauthorizedException': 'You are not authorized to access this resource',

  // =====================
  // Code verification errors
  // =====================
  'CodeDoesNotExistException': 'The verification code provided is invalid',
  'CodeExpiredException': 'Verification code has expired. Generate a new one.',

  // =====================
  // Validation & Generic errors
  // =====================
  'MultiFieldValidationException': 'Form contains validation errors',
  'AbstractBadRequestException': 'Invalid request data provided',
  'AbstractNotFoundException': 'Requested resource was not found',

  // =====================
  // Prescription & Medical Docs errors
  // =====================
  'PrescriptionNotFoundException': 'Prescription not found',
  'PrescriptionCancelledException': 'This prescription has been cancelled',
  'PrescriptionExpiredException': 'This prescription has expired',
  'PrescriptionOverfulfillmentException': 'Cannot fulfill prescription. Limit exceeded or already fulfilled.',

  // =====================
  // Medication & Ingredient errors
  // =====================
  'MedicationNotFoundException': 'Medication not found',
  'MedicationAlreadyExistsException': 'This medication is already listed',
  'InvalidMedicationDataException': 'Invalid medication data provided',
  'IngredientNotFoundException': 'Active ingredient not found',

  // =====================
  // Patient Record errors (Allergies & Diseases)
  // =====================
  'AllergyNotFoundException': 'Allergy record not found',
  'AllergyAlreadyExistsException': 'This allergy is already added to the patient record',
  // Uwaga: W backendzie jest literówka w nazwie klasy (Disaese)
  'DisaeseNotFoundException': 'Disease record not found',
  'DisaeseAlreadyExistsException': 'This disease is already added to the patient record',

  // =====================
  // Visit & Schedule constraints
  // =====================
  'EndBeforeStartException': 'End date cannot be before start date',
  'InThePastException': 'The selected date cannot be in the past',
  'OutsideAvailabilityException': 'Selected time is outside doctor availability',

  // =====================
  // Availability & Exceptions errors
  // =====================
  'AvailabilityExceptionCollisionException': 'Availability exception conflicts with an existing one',
  'AvailabilityExceptionNotFoundException': 'Availability exception not found',
  'WeeklyAvailabilityNotFoundException': 'Weekly availability schedule not found',

  // =====================
  // Doctor & Specialization errors
  // =====================
  'DoctorNotFoundException': 'Doctor not found',
  'DoctorSpecializationExistsException': 'Doctor specialization already exists',
  'DoctorSpecializationNotFoundException': 'Doctor specialization not found',

  // =====================
  // Visit Booking errors
  // =====================
  'VisitNotFoundException': 'Visit not found',
  'VisitCollisionException': 'Visit time conflicts with another visit. Please choose a different time.',

  // =====================
  // Generic / System status codes
  // =====================
  'UNAUTHORIZED': 'You do not have permission to perform this operation',
  'NOT_FOUND': 'Requested resource was not found',
  'BAD_REQUEST': 'Invalid request',
  'INTERNAL_ERROR': 'Server error occurred. Please try again later.'
};

export const DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred';