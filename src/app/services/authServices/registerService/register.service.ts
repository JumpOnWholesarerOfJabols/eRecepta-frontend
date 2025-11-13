import { Injectable } from '@angular/core';
import { UserData } from '../../../utils/UserData';
import { Observable } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { VerificationData } from '../../../utils/CredentialsData';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(private apollo: Apollo) { }

  registerUser(userData: UserData): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation RegisterUser($input: RegisterInput!) {
          register(input: $input) {
            message
          }
        }
      `,
      variables: {
        input: userData,
      },
    });
  }

  sendVerificationCode(login: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation sendVerificationCodeRequest($input: SendVerificationCodeRequestInput!) {
          sendVerificationCodeRequest(input: $input) {
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

  verifyUser(verificationData: VerificationData): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation VerifyAccount($input: VerifyInput!){
        verifyAccount(input: $input) {
          message
        }
      }
      `,
      variables: {
        input: verificationData
      }
    })
  }
}
