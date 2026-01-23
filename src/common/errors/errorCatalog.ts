import { BackendErrorCodes } from "./errorTypes";
import { ErrorActions } from "./errorActions";
import type { ErrorAction } from "@/api/types";

export interface UiErrorDefinition {
    code: string;
    status: number;
    message: string;
    action: ErrorAction;
}

export const ErrorCatalog: Record<string, UiErrorDefinition> =
    Object.fromEntries(
        Object.entries(BackendErrorCodes).map(([key, def]) => [
            key,
            {
                code: def.code,
                status: def.status,
                message: def.message,
                action: ErrorActions[key] ?? "SHOW_ALERT",
            },
        ])
    );