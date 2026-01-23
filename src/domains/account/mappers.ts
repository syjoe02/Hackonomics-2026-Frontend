import type { AccountApiResponse, MyExchangeRateApiResponse } from "@/api/types";
import type { Account, MyExchangeRate } from "./types";

export function mapAccountFromApi(api: AccountApiResponse): Account {
    return {
        countryCode: api.country_code,
        currency: api.currency,
        annualIncome: Number(api.annual_income),
        monthlyInvestableAmount: Number(api.monthly_investable_amount),
    };
}

export function mapMyExchangeRateFromApi(api: MyExchangeRateApiResponse): MyExchangeRate {
    return {
        base: api.base,
        target: api.target,
        rate: api.rate,
        lastUpdated: api.last_updated,
    };
}