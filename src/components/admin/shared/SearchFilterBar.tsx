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
  searchPlaceholder = "Tìm kiếm...",
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
          {title && <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>}
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
        {actionButton && (
          <Button onClick={actionButton.onClick}>
            {actionButton.icon && <span className="mr-2">{actionButton.icon}</span>}
            {actionButton.label}
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          {enableSearch && (
            <>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </>
          )}
        </div>
        {enableFilter && (
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        )}
        {enableExport && (
          <Button variant="outline" size="icon" onClick={onExport}>
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchFilterBar;