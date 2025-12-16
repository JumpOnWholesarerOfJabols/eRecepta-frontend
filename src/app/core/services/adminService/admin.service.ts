import { Injectable } from '@angular/core';
import { ApolloClient } from '@apollo/client';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { PatientData } from '../../models/UserData';
import { User } from '../../models/UserData';
import { AdminUserCreateResponse, AdminUserDeleteResponse, GetAllUsersResponse } from '../../auth/models/ResponseData';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apolloCientName = 'admin';

  private getAllUsersQuery: TypedDocumentNode<GetAllUsersResponse> = gql`
        query getAllUsers {
          getAllUsers {
            id
            firstName
            lastName
            email
            dateOfBirth
            pesel
            phoneNumber
            gender
            role
          }
        }
      `

  constructor(private apollo: Apollo) { }

  getAllUsers(): Observable<ApolloClient.QueryResult<GetAllUsersResponse>> {
    return this.apollo.use(this.apolloCientName).query({
      query: this.getAllUsersQuery,
    });
  }

  deleteUser(id: String): Observable<ApolloClient.MutateResult<AdminUserDeleteResponse>> {
    return this.apollo.use(this.apolloCientName).mutate({
      mutation: gql`
        mutation deleteUser($input: String!) {
          deleteUser(userId: $input) {
            success
            message
          }
        }
      `,
      variables: {
        input: id
      },
      refetchQueries: [
        {
          query: this.getAllUsersQuery
        }
      ],
      awaitRefetchQueries: true
    })
  }

  createUser(input: any): Observable<ApolloClient.MutateResult<AdminUserCreateResponse>> {
    return this.apollo.use(this.apolloCientName).mutate({
      mutation: gql`
        mutation createUser($input: CreateUserInput!) {
          createUser(input: $input) {
            success
            message
          }
        }
      `,
      variables: {
        input
      },
      refetchQueries: [
        {
          query: this.getAllUsersQuery
        }
      ],
      awaitRefetchQueries: true
    })
  }
}