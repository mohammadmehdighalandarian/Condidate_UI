export interface PageDto<T> {
  items: T[];
  pageNo: number;
  pageCount: number;
  totalCount: number;
  totalPages: number;
}