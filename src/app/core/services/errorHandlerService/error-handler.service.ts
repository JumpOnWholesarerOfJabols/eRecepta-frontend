import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from '../snackbarService/snackbar.service';
import { ERROR_MESSAGES, DEFAULT_ERROR_MESSAGE } from '../../constraints/error-message.const';
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(
    private snackBar: SnackbarService,
    private router: Router
  ) { };

  handleGraphQLError(
    errorCode: string,
    message: string,
    validationErrors?: { [field: string]: string }
  ): void {

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
    
    // Check for 401 Unauthorized
    if (error?.status === 401 || error?.error?.status === 401 || 
        (error?.message && error.message.includes('401 Unauthorized'))) {
      this.snackBar.openErrorSnackBar('Session expired. Please log in again.');
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      this.router.navigate(['/']);
      this.logError({ type: 'Network', error: '401 Unauthorized - redirected to login' });
      return;
    }
    
    const message = 'No connection with the server. Check your internet connection';
    this.snackBar.openErrorSnackBar(message);
    
    this.logError({ type: 'Network', error: error?.message || error?.toString() });
  }

  private handleValidationErrors(errors: { [field: string]: string }): void {
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
        break;

      case 'InvalidCredentialsException':
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
