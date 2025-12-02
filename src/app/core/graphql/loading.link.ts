import { Injectable } from '@angular/core';
import { ApolloLink } from '@apollo/client/core';
import { map, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoadingService } from '../../services/loadingService/loading.service';

@Injectable({ providedIn: 'root' })
export class LoadingLinkFactory {
  constructor(private loading: LoadingService) {}

  create(): ApolloLink {
    return new ApolloLink((operation, forward) => {
      this.loading.show();
      return forward(operation).pipe(
        map(result => {
          this.loading.hide();
          return result;
        }),
        catchError(error => {
          this.loading.hide();
          throw error;
        })
      );
    });
  }
}
