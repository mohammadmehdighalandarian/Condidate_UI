
export class ApiResponse {
    isSuccess: boolean;
    responseType: number;
    responseDesc: string;
}
export class ApiDataResponse<T> extends ApiResponse {
    data: T;
}