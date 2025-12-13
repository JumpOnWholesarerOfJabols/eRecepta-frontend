export const ERROR_MESSAGES: Record<string, string> = {
  // User errors
  'UserDoesNotExistException': 'User does not exist in the system',
  'UserAlreadyExistsException': 'User with this email address or PESEL number already exists',
  'InvalidCredentialsException': 'Invalid email, PESEL or password',
  'AccountVerificationException': 'Account has not been verified. Check your email inbox.',

  // Code verification errors
  'CodeDoesNotExistException': 'The verification code provided is invalid',
  'CodeExpiredException': 'Verification code has expired. Generate a new one.',

  // Validation errors
  'MultiFieldValidationException': 'Form contains errors',

  // Generic errors
  'UNAUTHORIZED': 'You do not have permission to perform this operation',
  'NOT_FOUND': 'Resource was not found',
  'BAD_REQUEST': 'Invalid request',
  'INTERNAL_ERROR': 'Server error occurred. Please try again later.'
};

export const DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred';