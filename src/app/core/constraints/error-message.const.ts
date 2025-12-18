export const ERROR_MESSAGES: Record<string, string> = {
  // =====================
  // User errors
  // =====================
  'UserDoesNotExistException': 'User does not exist in the system',
  'UserAlreadyExistsException': 'User with this email address or PESEL number already exists',
  'InvalidCredentialsException': 'Invalid email, PESEL or password',
  'AccountVerificationException': 'Account has not been verified. Check your email inbox.',

  // =====================
  // Code verification errors
  // =====================
  'CodeDoesNotExistException': 'The verification code provided is invalid',
  'CodeExpiredException': 'Verification code has expired. Generate a new one.',

  // =====================
  // Validation errors
  // =====================
  'MultiFieldValidationException': 'Form contains validation errors',
  'AbstractBadRequestException': 'Invalid request data provided',
  'EndBeforeStartException': 'End date cannot be before start date',
  'InThePastException': 'The selected date cannot be in the past',
  'OutsideAvailabilityException': 'Selected time is outside doctor availability',

  // =====================
  // Availability & schedule errors
  // =====================
  'AvailabilityExceptionCollisionException': 'Availability conflicts with an existing one',
  'AvailabilityExceptionNotFoundException': 'Availability not found',
  'WeeklyAvailabilityNotFoundException': 'Weekly availability not found',

  // =====================
  // Doctor errors
  // =====================
  'DoctorNotFoundException': 'Doctor not found',
  'DoctorSpecializationExistsException': 'Doctor specialization already exists',
  'DoctorSpecializationNotFoundException': 'Doctor specialization not found',

  // =====================
  // Visit errors
  // =====================
  'VisitNotFoundException': 'Visit not found',
  'VisitCollisionException': 'Visit time conflicts with another visit. Please choose different time',

  // =====================
  // Generic / system errors
  // =====================
  'UNAUTHORIZED': 'You do not have permission to perform this operation',
  'NOT_FOUND': 'Requested resource was not found',
  'BAD_REQUEST': 'Invalid request',
  'INTERNAL_ERROR': 'Server error occurred. Please try again later.'
};

export const DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred';
