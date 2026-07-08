import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  CheckSquare,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SidebarProps {
  className?: string;
  onItemClick?: () => void;
}

export function Sidebar({ className, onItemClick }: SidebarProps) {
  const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/job-applications", label: "Applications", icon: Briefcase },
    { to: "/companies", label: "Companies", icon: Building2 },
    { to: "/tasks", label: "Tasks", icon: CheckSquare },
    { to: "/ai-assistant", label: "AI Assistant", icon: Sparkles },
  ];

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r border-border bg-card px-4 py-6 text-card-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 px-3 py-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
          TP
        </div>
        <div>
          <span className="font-semibold text-foreground tracking-tight block">
            TalentPilot
          </span>
          <span className="text-[10px] text-muted-foreground block font-medium -mt-0.5">
            AI Job Tracker
          </span>
        </div>
      </div>

      <nav className="mt-8 flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onItemClick}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-border pt-4">
        <div className="flex items-center gap-3 rounded-lg bg-ai/5 border border-ai/10 p-3 text-xs text-muted-foreground">
          <Sparkles className="h-4 w-4 shrink-0 text-ai" />
          <div>
            <p className="font-medium text-foreground">AI Assistant Ready</p>
            <p className="mt-0.5 leading-normal">
              Insights will appear as you add job applications.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
