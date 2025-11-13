import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { LoginData } from '../../../utils/CredentialsData';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private apollo: Apollo) { }

  login(loginData: LoginData): Observable<any> {
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
}
