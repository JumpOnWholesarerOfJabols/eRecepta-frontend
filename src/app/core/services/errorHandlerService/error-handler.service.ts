import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../services/snackbarService/snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  private readonly errorMessages: { [key: string]: string } = {
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

  constructor(
    private snackBar: SnackbarService,
    private router: Router
  ) { };

  handleGraphQLError(
    errorCode: string,
    message: string,
    validationErrors?: { [field: string]: string }
  ): void {
    console.log('Handling GraphQL error:', { errorCode, message, validationErrors });

    if (errorCode === 'MultiFieldValidationException' && validationErrors) {
      this.handleValidationErrors(validationErrors);
      return;
    }

    const errorMessage = this.getErrorMessage(errorCode, message);

    this.snackBar.openErrorSnackBar(errorMessage);

    this.handleSpecificErrors(errorCode);
    
    // Logging
    this.logError({ type: 'GraphQL', errorCode, message, validationErrors });
  }

  handleNetworkError(error: any): void {
    console.log('Handling network error:', error);
    
    const message = 'No connection with the server. Check your internet connection';
    this.snackBar.openErrorSnackBar(message);
    
    this.logError({ type: 'Network', error: error?.message || error?.toString() });
  }

  private handleValidationErrors(errors: { [field: string]: string }): void {
    console.log('Validation errors:', errors);
    const errorArray = Object.values(errors);

    this.snackBar.openErrorSnackBar(errorArray);
  }

  private getErrorMessage(errorCode: string, backendMessage?: string): string {
    if (this.errorMessages[errorCode]) {
      return this.errorMessages[errorCode];
    }
    
    if (backendMessage) {
      return backendMessage;
    }

    return 'An unexpected error occurred';
  }

   private handleSpecificErrors(errorCode: string): void {
    switch (errorCode) {
      case 'AccountVerificationException':
        console.log('→ Redirecting to verification page');
        this.router.navigate(['verifyAccount']);
        break;

      case 'InvalidCredentialsException':
        console.log('→ Invalid credentials, clearing sensitive data');
        break;
    }
  }

  private logError(errorData: any): void {
    console.error('📋 Error logged:', {
      ...errorData,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
    
  }

  getErrorMessageForCode(errorCode: string): string {
    return this.errorMessages[errorCode] || 'An unknown error occurred';
  }

  isErrorOfType(result: any, errorCode: string): boolean {
    return result?.errors?.some(
      (err: any) => err.extensions?.errorCode === errorCode
    );
  }
}
