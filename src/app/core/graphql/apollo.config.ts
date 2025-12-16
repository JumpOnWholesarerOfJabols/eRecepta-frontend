// src/app/core/graphql/apollo.config.ts

import { inject } from '@angular/core';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { SetContextLink } from '@apollo/client/link/context';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/services/authService/auth.service';
import { ErrorLinkFactory } from './apollo-ErrorLinkFactory';
import { LoadingLinkFactory } from './apollo-LoadingLinkFactory';

const prevURL = 'http://localhost:12000/graphql';
const BASE_URL = 'http://localhost:7952';

const createClientConfig = (uri: string) => {
  const httpLink = inject(HttpLink);
  const authService = inject(AuthService);
  const errorLinkFactory = inject(ErrorLinkFactory);
  const loadingLinkFactory = inject(LoadingLinkFactory);

  const authLink = new SetContextLink((prevContext) => {
    const token = authService.getToken();
    const headers = (prevContext.headers instanceof HttpHeaders)
      ? prevContext.headers
      : new HttpHeaders(prevContext.headers || {});

    return {
      headers: headers.set(
        'authorization',
        token ? `Bearer ${token}` : ''
      ),
    };
  });

  return {
    link: ApolloLink.from([
      loadingLinkFactory.create(),
      errorLinkFactory.create(),
      authLink,
      httpLink.create({ uri }),
    ]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all' as const,
        fetchPolicy: 'cache-and-network' as const,
      },
      query: {
        errorPolicy: 'all' as const,
        fetchPolicy: 'network-only' as const,
      },
      mutate: {
        errorPolicy: 'all' as const,
      },
    },
  };
};

export const apolloConfig = () =>
  createClientConfig(prevURL);

export const namedApolloClients = () => ({
  auth: createClientConfig(`${BASE_URL}/auth/graphql`),
  admin: createClientConfig(`${BASE_URL}/admin/graphql`),
});
