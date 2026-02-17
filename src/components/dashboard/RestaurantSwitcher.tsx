import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/context/AppContext";
import { Store, Plus } from "lucide-react";
import { useNavigate } from "react-router";

export function RestaurantSwitcher() {
    const { userRestaurants, currentRestaurant, selectRestaurant, currentUser } = useApp();
    const navigate = useNavigate();

    const handleValueChange = (value: string) => {
        if (value === "add-new") {
            navigate("/onboarding"); // Reutilizamos onboarding para crear nueva sede
            return;
        }
        selectRestaurant(value);
    };

    if (!currentUser || !currentRestaurant) return null;

    // Solo mostramos el switcher si hay más de 1 restaurante o si es owner/admin (para poder agregar)
    if (userRestaurants.length <= 1 && currentUser.role !== 'owner' && currentUser.role !== 'admin') {
        return (
            <div className="flex items-center gap-2 px-2 py-1.5 text-sm font-semibold text-gray-900">
                <Store className="h-4 w-4" />
                <span>{currentRestaurant.name}</span>
            </div>
        );
    }

    return (
        <Select value={currentRestaurant.id} onValueChange={handleValueChange}>
            <SelectTrigger className="w-full bg-white border-gray-200">
                <div className="flex items-center gap-2 pr-2 overflow-hidden">
                    <Store className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <SelectValue placeholder="Seleccionar sede" />
                </div>
            </SelectTrigger>
            <SelectContent>
                {userRestaurants.map((restaurant) => (
                    <SelectItem key={restaurant.id} value={restaurant.id}>
                        {restaurant.name}
                    </SelectItem>
                ))}

                {(currentUser.role === 'owner' || currentUser.role === 'admin') && (
                    <>
                        <div className="h-px bg-gray-100 my-1" />
                        <SelectItem value="add-new" className="text-blue-600 focus:text-blue-700 font-medium">
                            <div className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                <span>Nueva Sede</span>
                            </div>
                        </SelectItem>
                    </>
                )}
            </SelectContent>
        </Select>
    );
}
