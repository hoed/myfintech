
import { cn } from "@/lib/utils";
import React from "react";

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  className,
}) => {
  return (
    <div 
      className={cn(
        "rounded-lg border bg-card p-6 shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold">{value}</p>
        {trend && trendValue && (
          <p className={cn(
            "text-xs mt-1",
            trend === "up" && "text-success",
            trend === "down" && "text-danger",
            trend === "neutral" && "text-muted-foreground"
          )}>
            {trend === "up" && "↑"}
            {trend === "down" && "↓"}
            {trend === "neutral" && "→"} {trendValue}
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
