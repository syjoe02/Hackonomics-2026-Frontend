import type { ErrorAction } from "@/api/types";
import rawErrorCodes from "./error-codes.json";

// Frontend App Error Type
export interface AppError {
    status: number;
    code: string;
    message: string;
    action: ErrorAction;
}

//Backend error JSON structure
export interface BackendErrorDefinition {
    code: string;
    status: number;
    message: string;
}

export const BackendErrorCodes =
    rawErrorCodes as Record<string, BackendErrorDefinition>;