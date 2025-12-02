// src/app/core/graphql/apollo.config.ts

import { inject } from '@angular/core';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { SetContextLink } from '@apollo/client/link/context';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/authServices/authService/auth.service';
import { ErrorLinkFactory } from './apollo-error.link';
import { LoadingLinkFactory } from './loading.link';

const url = 'http://localhost:12000/graphql';

export const apolloConfig = () => {
    const httpLink = inject(HttpLink);
    const authService = inject(AuthService);
    const errorLinkFactory = inject(ErrorLinkFactory);
    const loadingLinkFactory = inject(LoadingLinkFactory);

    const authLink = new SetContextLink((prevContext) => {
        const token = authService.getToken();

        const headers = (prevContext.headers instanceof HttpHeaders)
            ? prevContext.headers
            : new HttpHeaders(prevContext.headers || {});

        const updated = headers.set(
            'authorization',
            token ? `Bearer ${token}` : ''
        );

        return {
            headers: updated
        };
    });

    const errorLink = errorLinkFactory.create();
    const loadingLink = loadingLinkFactory.create();

    const http = httpLink.create({
        uri: url,
    });

    const link = ApolloLink.from([
        loadingLink,
        errorLink,
        authLink,
        http
    ]);

    return {
        link,
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
}