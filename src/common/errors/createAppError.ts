import { ErrorCatalog } from "./errorCatalog";
import type { AppError } from "./errorTypes";

type ApiErrorResponse = {
    status?: number;
    code?: string;
    message?: string;
};

type AxiosLikeError = {
    response?: {
        data?: ApiErrorResponse;
    };
};

export function createAppError(
    source: keyof typeof ErrorCatalog | unknown,
    overrideMessage?: string
): AppError {
    // 1: ErrorCatalog Key
    if (typeof source === "string" && source in ErrorCatalog) {
        const def = ErrorCatalog[source];

        return {
            status: def.status,
            code: def.code,
            message: overrideMessage ?? def.message ?? "",
            action: def.action,
        };
    }
    // 2: API error (axios error)
    const err = source as AxiosLikeError | null;
    const data = err?.response?.data;

    const code = data?.code ?? "INTERNAL_ERROR";
    const def =
        Object.values(ErrorCatalog).find((e) => e.code === code) ??
        ErrorCatalog.INTERNAL_ERROR;

    return {
        status: data?.status ?? def.status,
        code: def.code,
        message: overrideMessage ?? data?.message ?? def.message,
        action: def.action,
    };
}