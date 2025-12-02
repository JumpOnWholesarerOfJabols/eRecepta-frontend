// src/app/core/graphql/error-link.factory.ts

import { Injectable } from "@angular/core";
import { ErrorLink } from "@apollo/client/link/error";
import {
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
} from "@apollo/client/errors";
import { ErrorHandlerService } from "../services/errorHandlerService/error-handler.service";

@Injectable({ providedIn: 'root' })
export class ErrorLinkFactory {

  constructor(private errorHandler: ErrorHandlerService) {}

  create(): ErrorLink {
    return new ErrorLink(({ error }) => {

      if (CombinedGraphQLErrors.is(error)) {
        error.errors.forEach(({ message, extensions }) =>
          this.errorHandler.handleGraphQLError(
            extensions?.['errorCode'] as string,
            message,
            extensions?.['validationErrors'] as { [key: string]: string }
          )
        );
      }

      else if (CombinedProtocolErrors.is(error)) {
        error.errors.forEach(({ message, extensions }) =>
          console.warn(
            `[Protocol error]: ${message}`,
            `Extensions: ${JSON.stringify(extensions)}`
          )
        );
      }

      else {
        this.errorHandler.handleNetworkError(error);
      }

    });
  }
}
