// import React from "react";
import { Menu } from "lucide-react";

interface SidebarTriggerProps {
  className?: string;
}

export function SidebarTrigger({ className }: SidebarTriggerProps) {
  return (
    <button
      className={className}
      aria-label="Toggle sidebar"
    >
      <Menu className="h-6 w-6" />
    </button>
  );
} 