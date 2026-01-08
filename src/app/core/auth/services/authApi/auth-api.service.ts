import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { LoginData, ResetPasswordData, VerificationData } from '../../models/CredentialsData';
import { PatientData } from '../../../models/UserData';
import { MutationResponse } from '../../../models/graphql-data.model';
import { LoginResponse, UniversalResponse, RefreshTokenResponse } from '../../../models/ResponseData';
import { ApolloClient } from '@apollo/client';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  constructor(private apollo: Apollo) { }

  login(loginData: LoginData): Observable<ApolloClient.MutateResult<LoginResponse>> {
    return this.apollo.use('auth').mutate({
      mutation: gql`
          mutation LoginUser($input: LoginInput!) {
            login(input: $input) {
              token
              expiresAt
              refreshToken
            }
          }
        `,
      variables: {
        input: loginData
      }
    })
  }

  refreshToken(refreshToken: string): Observable<ApolloClient.MutateResult<RefreshTokenResponse>> {
    return this.apollo.use('auth').mutate({
      mutation: gql`
        mutation RefreshToken($refreshToken: String!) {
          refreshToken(refreshToken: $refreshToken) {
            token
            expiresAt
            refreshToken
          }
        }
      `,
      variables: {
        refreshToken
      }
    })
  }

  logout(refreshToken: string): Observable<ApolloClient.MutateResult> {
    return this.apollo.use('auth').mutate({
      mutation: gql`
        mutation Logout($refreshToken: String!) {
          logout(refreshToken: $refreshToken) {
            message
          }
        }
      `,
      variables: {
        refreshToken
      }
    })
  }

  logoutFromOtherDevices(refreshToken: string): Observable<ApolloClient.MutateResult> {
    return this.apollo.use('auth').mutate({
      mutation: gql`
        mutation LogoutFromOtherDevices($refreshToken: String!) {
          logoutFromOtherDevices(refreshToken: $refreshToken) {
            message
          }
        }
      `,
      variables: {
        refreshToken
      }
    })
  }

  registerUser(userData: PatientData): Observable<ApolloClient.MutateResult> {
    return this.apollo.use('auth').mutate({
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
    return this.apollo.use('auth').mutate({
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
    return this.apollo.use('auth').mutate({
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
    return this.apollo.use('auth').mutate({
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
    return this.apollo.use('auth').mutate({
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

  getMyLoginAttempts(): Observable<ApolloClient.MutateResult> {
    return this.apollo.use('auth').query({
      query: gql`
        query GetMyLoginAttempts {
          myLoginAttempts {
            id
            userId
            ipAddress
            success
            attemptDate
          }
        }
      `
    })
  }

  getMyAuditLogs(): Observable<ApolloClient.MutateResult> {
    return this.apollo.use('auth').query({
      query: gql`
        query GetMyAuditLogs {
          myAuditLogs {
            id
            userId
            ipAddress
            actionName
            logDate
          }
        }
      `
    })
  }
}
