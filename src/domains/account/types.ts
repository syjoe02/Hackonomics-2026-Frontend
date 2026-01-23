export interface Account {
    countryCode: string;
    currency: string;
    annualIncome: number;
    monthlyInvestableAmount: number;
}

export interface MyExchangeRate {
    base: string;
    target: string;
    rate: number;
    lastUpdated?: string;
}