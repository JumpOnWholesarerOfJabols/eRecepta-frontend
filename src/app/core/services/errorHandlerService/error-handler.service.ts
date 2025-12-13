import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from '../snackbarService/snackbar.service';
import { ERROR_MESSAGES, DEFAULT_ERROR_MESSAGE } from '../../constraints/error-message.const';
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(
    private snackBar: SnackbarService
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
    if (ERROR_MESSAGES[errorCode]) {
      return ERROR_MESSAGES[errorCode];
    }
    
    if (backendMessage) {
      return backendMessage;
    }

    return DEFAULT_ERROR_MESSAGE;
  }

   private handleSpecificErrors(errorCode: string): void {
    switch (errorCode) {
      case 'AccountVerificationException':
        console.log('→ Redirecting to verification page');
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
    return ERROR_MESSAGES[errorCode] || DEFAULT_ERROR_MESSAGE;
  }

  isErrorOfType(result: any, errorCode: string): boolean {
    return result?.errors?.some(
      (err: any) => err.extensions?.errorCode === errorCode
    );
  }
}
