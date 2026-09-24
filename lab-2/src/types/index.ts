export interface FieldErrors {
  [field: string]: string;
}

export interface FormResult {
  success: boolean;
  errors: FieldErrors;
}

export interface OperationResult {
  success: boolean;
  message?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  totalPages: number;
  currentPage: number;
}
