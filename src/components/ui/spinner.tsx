
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: number;
}

export function Spinner({ className, size = 24, ...props }: SpinnerProps) {
    return (
        <div className={cn("flex justify-center items-center w-full h-full", className)} {...props}>
            <Loader2 className="animate-spin text-primary" size={size} />
        </div>
    );
}

export function PageSpinner() {
    return (
        <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
}
