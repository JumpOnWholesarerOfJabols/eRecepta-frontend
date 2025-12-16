import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { LoginData, ResetPasswordData, VerificationData } from '../../models/CredentialsData';
import { PatientData } from '../../../models/UserData';
import { MutationResponse } from '../../../models/graphql-data.model';
import { LoginResponse, UniversalResponse } from '../../models/ResponseData';
import { ApolloClient, MutateResult } from '@apollo/client';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  constructor(private apollo: Apollo) { }

  login(loginData: LoginData): Observable<ApolloClient.MutateResult<LoginResponse>> {
    return this.apollo.mutate({
      mutation: gql`
          mutation LoginUser($input: LoginInput!) {
            login(input: $input) {
              token
              expiresAt
            }
          }
        `,
      variables: {
        input: loginData
      }
    })
  }

  registerUser(userData: PatientData): Observable<ApolloClient.MutateResult> {
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

  sendVerificationCode(login: string): Observable<ApolloClient.MutateResult> {
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

  verifyUser(verificationData: VerificationData): Observable<ApolloClient.MutateResult> {
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

  sendResetPasswordRequest(login: string): Observable<ApolloClient.MutateResult> {
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

  resetPassword(resetData: ResetPasswordData): Observable<ApolloClient.MutateResult> {
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
