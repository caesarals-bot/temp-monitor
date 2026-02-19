
import { useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { TemperatureReading } from "@/types";

interface TemperatureChartProps {
    data: TemperatureReading[];
}

export function TemperatureChart({ data }: TemperatureChartProps) {
    const chartData = useMemo(() => {
        return data
            .slice()
            .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime())
            .map(item => ({
                ...item,
                formattedDate: format(new Date(item.recorded_at), "dd/MM HH:mm", { locale: es }),
                timestamp: new Date(item.recorded_at).getTime(),
            }));
    }, [data]);

    if (data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">No hay datos para mostrar en este periodo.</p>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart
                data={chartData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="formattedDate"
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                />
                <YAxis
                    unit="°C"
                    tick={{ fontSize: 12 }}
                />
                <Tooltip
                    labelStyle={{ color: "black" }}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="value"
                    name="Temperatura"
                    stroke="#2563eb"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    dot={false}
                />
                {/* Optional: Add reference lines for min/max if filtering by single equipment */}
            </LineChart>
        </ResponsiveContainer>
    );
}
