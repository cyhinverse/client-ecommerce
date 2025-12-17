import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Download,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchFilterBarProps {
  title?: string;
  description?: string;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  enableFilter?: boolean;
  enableExport?: boolean;
  onSearchChange?: (value: string) => void;
  onExport?: () => void;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  title,
  description,
  enableSearch = true,
  searchPlaceholder = "Search...",
  enableFilter = true,
  enableExport = false,
  onSearchChange,
  onExport,
  actionButton,
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm);

  useEffect(() => {
    onSearchChange?.(debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {title && <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>}
          {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
        </div>
        {actionButton && (
          <Button onClick={actionButton.onClick} className="rounded-xl bg-black text-white hover:bg-black/90 dark:bg-[#0071e3] shadow-sm">
            {actionButton.icon && <span className="mr-2">{actionButton.icon}</span>}
            {actionButton.label}
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3 bg-white/50 p-1.5 rounded-2xl border border-border/50 backdrop-blur-sm">
        <div className="relative flex-1">
          {enableSearch && (
            <>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                className="pl-9 w-full rounded-xl border-transparent bg-transparent hover:bg-white/50 focus:bg-white/80 transition-all focus-visible:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </>
          )}
        </div>
        {enableFilter && (
          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/50">
            <Filter className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
        {enableExport && (
          <Button variant="ghost" size="icon" onClick={onExport} className="rounded-xl hover:bg-white/50">
            <Download className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchFilterBar;