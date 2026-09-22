import { IResponse } from "./response.interface";

export interface IPaginationResponse<T, M = IPaginationMeta> extends IResponse<
  T[],
  M
> {
  data: T[];
  meta: M;
}

export interface IPaginationMeta {
  page: number;
  perPage: number;
  total: number;
  pages: number;
}
