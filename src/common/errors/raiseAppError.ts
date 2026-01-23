import { ErrorCatalog } from "./errorCatalog";
import { handleAppError } from "./handleAppError";
import type { AppError } from "./errorTypes";
import type { NavigateFunction } from "react-router-dom";

type CatalogKey = keyof typeof ErrorCatalog;

export function raiseAppError(
    source: any | CatalogKey,
    navigate: NavigateFunction,
    overrideMessage?: string
): AppError {
    let appError: AppError;

    // 1) API error (axios error)
    if (typeof source === "object" && source?.response) {
        const data = source.response?.data;
        const code = data?.code ?? "INTERNAL_ERROR";

        const def =
            Object.values(ErrorCatalog).find((e) => e.code === code) ??
            ErrorCatalog.INTERNAL_ERROR;

        appError = {
            status: data?.status ?? def.status,
            code: def.code,
            message: overrideMessage ?? data?.message ?? def.message,
            action: def.action,
        };
    }
    // 2) ErrorCatalog Key
    else if (typeof source === "string" && source in ErrorCatalog) {
        const key = source as CatalogKey;
        const def = ErrorCatalog[key];

        appError = {
            status: def.status,
            code: def.code,
            message: overrideMessage ?? def.message,
            action: def.action,
        };
    } else {
        const def = ErrorCatalog.INTERNAL_ERROR;

        appError = {
            status: def.status,
            code: def.code,
            message: overrideMessage ?? def.message,
            action: def.action,
        };
    }

    handleAppError(appError, navigate);
    return appError;
}