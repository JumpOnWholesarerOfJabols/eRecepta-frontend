export interface GraphQLErrorExtensions {
  errorCode: string;
  validationErrors?: { [field: string]: string };
  classification?: string;
  [key: string]: any;
}

export interface GraphQLError {
  message: string;
  extensions: GraphQLErrorExtensions;
  path?: (string | number)[];  // Ścieżka w query (np. ["login"])
  locations?: Array<{ line: number; column: number }>;
}

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: GraphQLError[];
}