export type ApiResponse<T> = {
  status: number;
  message: string;
  data: T | null;
  errors: ApiError[] | null;
  metadata: ApiResponseMetadata | null;
};
export type ApiError = {
  field: string;
  message: string;
};
export type ApiResponseMetadata = {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
};

export type ApiResponseError = {
  status: number;
  message: string;
  data: null;
  errors: ApiError[];
  metadata: null;
};
