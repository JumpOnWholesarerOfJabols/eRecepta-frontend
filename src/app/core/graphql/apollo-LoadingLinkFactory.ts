import { Injectable } from '@angular/core';
import { ApolloLink } from '@apollo/client/core';
import { map, catchError, finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loadingService/loading.service';

@Injectable({ providedIn: 'root' })
export class LoadingLinkFactory {
  constructor(private loading: LoadingService) {}

  create(): ApolloLink {
    return new ApolloLink((operation, forward) => {
      this.loading.show();
      return forward(operation).pipe(
        finalize(() => {
          this.loading.hide();
        })
      );
    });
  }
}
