
import { useState } from "react";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import type { DateRange } from "react-day-picker";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { TemperatureChart } from "@/components/reports/TemperatureChart";
import { ReportTable } from "@/components/reports/ReportTable";

export function ReportsPage() {
    const { equipment, readings, currentRestaurant } = useApp();

    // State for filters
    const [date, setDate] = useState<DateRange | undefined>({
        from: subDays(new Date(), 7),
        to: new Date(),
    });
    const [selectedEquipment, setSelectedEquipment] = useState<string>("all");

    // Filtered data logic
    const filteredReadings = readings.filter(reading => {
        // Filter by date
        if (date?.from && new Date(reading.recorded_at) < date.from) return false;
        if (date?.to && new Date(reading.recorded_at) > date.to) return false;

        // Filter by equipment
        if (selectedEquipment !== "all" && reading.equipment_id !== selectedEquipment) return false;

        // Filter by current restaurant (implicit via readings context usually, but good to be safe)
        const eq = equipment.find(e => e.id === reading.equipment_id);
        if (!eq || eq.restaurant_id !== currentRestaurant?.id) return false;

        return true;
    });

    const handleExportPDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text("Reporte de Temperaturas", 14, 22);

        // Metadata
        doc.setFontSize(11);
        doc.text(`Generado el: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}`, 14, 32);

        let rangeText = "Todo el historial";
        if (date?.from) {
            rangeText = format(date.from, "dd/MM/yyyy", { locale: es });
            if (date.to) {
                rangeText += ` - ${format(date.to, "dd/MM/yyyy", { locale: es })}`;
            }
        }
        doc.text(`Rango de Fechas: ${rangeText}`, 14, 40);

        const equipmentName = selectedEquipment === "all"
            ? "Todos los equipos"
            : equipment.find(e => e.id === selectedEquipment)?.name || "Equipo Desconocido";
        doc.text(`Equipo: ${equipmentName}`, 14, 48);

        if (currentRestaurant) {
            doc.text(`Sede: ${currentRestaurant.name}`, 14, 56);
        }

        // Table Data
        const tableColumn = ["Fecha", "Equipo", "Temp (°C)", "Estado", "Mín/Máx", "Usuario", "Notas"];
        const tableRows: any[] = [];

        filteredReadings.forEach(reading => {
            const eq = equipment.find(e => e.id === reading.equipment_id);
            const min = reading.snapshot_min_temp ?? eq?.min_temp ?? -Infinity;
            const max = reading.snapshot_max_temp ?? eq?.max_temp ?? Infinity;

            const isAlert = reading.value < min || reading.value > max;
            const status = isAlert ? "ALERTA" : "Normal";

            const rowData = [
                format(new Date(reading.recorded_at), "dd/MM/yyyy HH:mm"),
                eq?.name || "N/A",
                `${reading.value}°C`,
                status,
                `${min}°C / ${max}°C`,
                reading.taken_by || reading.created_by || "N/A",
                reading.notes || "-"
            ];
            tableRows.push(rowData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 65,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [22, 163, 74] }, // Green-600 tailored to brand?
            alternateRowStyles: { fillColor: [240, 253, 244] },
            didParseCell: (data) => {
                // Highlight Alert rows
                if (data.section === 'body' && data.column.index === 3) {
                    if (data.cell.raw === "ALERTA") {
                        data.cell.styles.textColor = [220, 38, 38]; // Red
                        data.cell.styles.fontStyle = 'bold';
                    }
                }
            }
        });

        doc.save(`reporte_temperaturas_${format(new Date(), "yyyyMMdd")}.pdf`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
                    <p className="text-muted-foreground">
                        Analiza el historial de temperaturas y genera exportaciones.
                    </p>
                </div>
                <Button variant="outline" onClick={handleExportPDF}>
                    <Download className="mr-2 h-4 w-4" />
                    Exportar Datos
                </Button>
            </div>

            {/* Filters Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4">
                    {/* Date Picker */}
                    <div className="grid gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                        "w-[300px] justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date?.from ? (
                                        date.to ? (
                                            <>
                                                {format(date.from, "LLL dd, y", { locale: es })} -{" "}
                                                {format(date.to, "LLL dd, y", { locale: es })}
                                            </>
                                        ) : (
                                            format(date.from, "LLL dd, y", { locale: es })
                                        )
                                    ) : (
                                        <span>Seleccionar fechas</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={date?.from}
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Equipment Selector */}
                    <div className="w-[200px]">
                        <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar Equipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los equipos</SelectItem>
                                {equipment
                                    .filter(e => e.restaurant_id === currentRestaurant?.id)
                                    .map((eq) => (
                                        <SelectItem key={eq.id} value={eq.id}>
                                            {eq.name}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Tendencia de Temperaturas</CardTitle>
                        <CardDescription>Visualización gráfica del periodo seleccionado.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-0 pb-0">
                        <TemperatureChart data={filteredReadings} />
                    </CardContent>
                </Card>
            </div>

            {/* Table Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Detalle de Lecturas</CardTitle>
                </CardHeader>
                <CardContent>
                    <ReportTable data={filteredReadings} />
                </CardContent>
            </Card>
        </div>
    );
}
