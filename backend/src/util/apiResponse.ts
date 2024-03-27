export interface ApiResponse {
    success: boolean,
    message: string,
    data?: unknown
}

interface ApiResponseParams {
    message: string,
    success?: boolean,
    data?: unknown
}

export default function apiResponse({
    message,
    success = true,
    data
}: ApiResponseParams): ApiResponse {
    return {
        success,
        message,
        data
    }
}