import { Injectable } from '@angular/core';
import { UserData } from '../../utils/UserData';
import { Observable } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

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
            id
            name
            email
          }
        }
      `,
      variables: {
        input: userData,
      },
    });
  }
}
