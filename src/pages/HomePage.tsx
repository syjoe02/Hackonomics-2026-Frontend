import { useEffect, useState } from "react";
import { api } from "@/api/client";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import AppBackground from "@/components/layouts/AppBackground";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

type HistoryPoint = {
    date: string;
    rate: number;
};

type ExchangeHistoryResponse = {
    base: string;
    target: string;
    period: string;
    end_date: string;
    history: HistoryPoint[];
};

const PERIODS = [
    { label: "3M", value: "3m" },
    { label: "6M", value: "6m" },
    { label: "1Y", value: "1y" },
    { label: "2Y", value: "2y" },
];

export default function HomePage() {
    const [currency, setCurrency] = useState<string | null>(null);
    const [period, setPeriod] = useState("6m");
    const [data, setData] = useState<HistoryPoint[]>([]);
    const [loading, setLoading] = useState(false);

    const loadAccountCurrency = async () => {
        try {
            const res = await api.get("/account/me/");
            const userCurrency = res.data.currency;
            setCurrency(userCurrency);
        } catch {
            setCurrency("CAD");
        }
    };

    const loadHistory = async (cur: string) => {
        setLoading(true);
        try {
            const res = await api.get<ExchangeHistoryResponse>(
                "/exchange/history/",
                {
                    params: {
                        currency: cur,
                        period,
                    },
                }
            );
            setData(res.data.history);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAccountCurrency();
    }, []);

    useEffect(() => {
        if (!currency) return;
        loadHistory(currency);
    }, [currency, period]);

    return (
        <AppBackground>
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <Card className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {currency ? `USD → ${currency} Exchange History` : "Loading currency..."}
                    </h1>
                    <p className="text-gray-500">
                        Period: {period.toUpperCase()}
                    </p>
                </Card>

                {/* Chart + Controls */}
                <Card className="h-[480px] flex flex-col">
                    {/* Period Buttons */}
                    <div className="flex justify-center gap-2 mb-4">
                        {PERIODS.map((p) => (
                            <Button
                                key={p.value}
                                variant={
                                    period === p.value
                                        ? "primary"
                                        : "secondary"
                                }
                                onClick={() => setPeriod(p.value)}
                                size="sm"
                                disabled={!currency || loading}
                            >
                                {p.label}
                            </Button>
                        ))}
                    </div>

                    {/* Chart */}
                    <div className="flex-1">
                        {!currency ? (
                            <div className="h-full flex items-center justify-center text-gray-400">
                                Loading currency...
                            </div>
                        ) : loading ? (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                Loading chart...
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis
                                        domain={[
                                            (dataMin: number) =>
                                                dataMin * 0.995,
                                            (dataMax: number) =>
                                                dataMax * 1.005,
                                        ]}
                                        tickFormatter={(value: number) =>
                                            value.toFixed(2)
                                        }
                                        width={70}
                                    />
                                    <Tooltip
                                        formatter={(value) =>
                                            typeof value === "number" ? value.toFixed(2) : value
                                        }
                                        labelFormatter={(label) => `Date: ${label}`}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="rate"
                                        stroke="#6366f1"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </Card>
            </div>
        </AppBackground>
    );
}