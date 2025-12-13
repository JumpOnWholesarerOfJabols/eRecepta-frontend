export interface GraphQLErrorExtensions {
  errorCode: string;
  validationErrors?: { [field: string]: string };
  classification?: string;
  [key: string]: any;
}

export interface GraphQLErrorList {
  message: string;
  extensions: GraphQLErrorExtensions;
  path?: (string | number)[];
  locations?: Array<{ line: number; column: number }>;
}

export interface GraphQLError<T = any> {
  data?: T;
  errors?: GraphQLErrorList[];
  extension: any;
  name: String;
  message: String;
}

export interface MutationResponse<T = any> {
  data: T;
  errors: GraphQLError[];
  loading: boolean;
}