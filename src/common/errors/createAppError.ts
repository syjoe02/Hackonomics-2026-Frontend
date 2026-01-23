import { ErrorCatalog } from "./errorCatalog";
import type { AppError } from "./errorTypes";

export function createAppError(
    source: keyof typeof ErrorCatalog | any,
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
    const data = source?.response?.data;

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