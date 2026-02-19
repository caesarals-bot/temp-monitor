
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { TemperatureReading } from "@/types";
import { useApp } from "@/context/AppContext";

interface ReportTableProps {
    data: TemperatureReading[];
}

export function ReportTable({ data }: ReportTableProps) {
    const { equipment } = useApp();

    const getEquipmentName = (id: string) => {
        return equipment.find(e => e.id === id)?.name || "Equipo Desconocido";
    };

    const sortedData = data.slice().sort((a, b) =>
        new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
    );

    if (data.length === 0) {
        return (
            <div className="h-[200px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">No hay registros para mostrar.</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Equipo</TableHead>
                        <TableHead>Temp. (°C)</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Registrado Por</TableHead>
                        <TableHead className="hidden md:table-cell">Notas</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedData.map((reading) => {
                        const min = reading.snapshot_min_temp ?? -Infinity;
                        const max = reading.snapshot_max_temp ?? Infinity;
                        const isAlert = reading.value < min || reading.value > max;
                        return (
                            <TableRow key={reading.id}>
                                <TableCell className="whitespace-nowrap">
                                    {format(new Date(reading.recorded_at), "dd/MM/yyyy HH:mm", { locale: es })}
                                </TableCell>
                                <TableCell>{getEquipmentName(reading.equipment_id)}</TableCell>
                                <TableCell className="font-medium">
                                    {reading.value}°C
                                </TableCell>
                                <TableCell>
                                    <Badge variant={isAlert ? "destructive" : "default"} className={isAlert ? "" : "bg-green-500 hover:bg-green-600"}>
                                        {isAlert ? "Alerta" : "Normal"}
                                    </Badge>
                                </TableCell>
                                <TableCell>{reading.taken_by || reading.created_by}</TableCell>
                                <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                                    {reading.notes || "-"}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
