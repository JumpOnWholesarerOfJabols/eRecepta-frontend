import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { ResetPasswordData } from '../../../utils/CredentialsData';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  constructor(private apollo: Apollo) { }

  resetRequest(login: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation ResetPasswordRequest($input: ResetPasswordRequestInput!) {
          requestPasswordReset(input: $input) {
            message
          }
        }
      `,
      variables: {
          input: {
            login
          }
      }

    })
  }

  reset(resetData: ResetPasswordData): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation ResetPassword($input: ResetPasswordInput!) {
          resetPassword(input: $input) {
            message
          }
        }
      `,
      variables: {
          input: resetData
      }

    })
  }
}
