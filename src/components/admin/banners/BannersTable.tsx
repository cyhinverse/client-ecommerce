import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Filter,
  Download,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { BannerItem } from "@/types/banner";
import { Badge } from "@/components/ui/badge";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import Image from "next/image";

interface BannersTableProps {
  banners: BannerItem[];
  searchTerm: string;
  pageSize: number;
  isLoading?: boolean;
  onSearch: (value: string) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (banner: BannerItem) => void;
  onDelete: (banner: BannerItem) => void;
}

export const getStatusBadge = (status: boolean) => {
  return status ? (
    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400 border-0 rounded-lg px-2.5 py-0.5 shadow-none">
      <CheckCircle className="h-3 w-3 mr-1" />
      Active
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="bg-gray-100 text-gray-600 border-0 rounded-lg px-2.5 py-0.5 shadow-none"
    >
      <XCircle className="h-3 w-3 mr-1" />
      Inactive
    </Badge>
  );
};

export function BannersTable({
  banners,
  searchTerm,
  pageSize,
  onSearch,
  onPageSizeChange,
  onEdit,
  onDelete,
  isLoading = false,
}: BannersTableProps) {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const debouncedSearch = useDebounce(localSearch, 500);
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearch !== searchTerm) {
       onSearchRef.current(debouncedSearch);
    }
  }, [debouncedSearch, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-[#f7f7f7] p-4 rounded-2xl">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search banners..."
              value={localSearch}
              onChange={handleSearch}
              className="pl-9 rounded-xl border-0 bg-white focus-visible:ring-0 transition-all"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl border-0 bg-white hover:bg-white/80 w-9 h-9"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl border-0 bg-white hover:bg-white/80 w-9 h-9"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="pageSize" className="text-sm font-medium text-muted-foreground">
            Show:
          </Label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-9 rounded-lg border-0 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/20"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
            <Table>
            <TableHeader className="bg-[#f7f7f7]">
                <TableRow className="border-0 hover:bg-transparent">
                <TableHead className="w-[350px] uppercase text-xs font-bold tracking-wider text-muted-foreground pl-6">
                    Banner Content
                </TableHead>
                <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">
                    Theme
                </TableHead>
                <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">
                    Status
                </TableHead>
                <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground text-right pr-6">
                    Actions
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading && (
                <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center">
                    <div className="flex justify-center items-center">
                        <SpinnerLoading />
                    </div>
                    </TableCell>
                </TableRow>
                )}
                {!isLoading && banners.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-12 w-12 mb-3 opacity-20" />
                        <div className="text-muted-foreground">No banners found</div>
                    </div>
                    </TableCell>
                </TableRow>
                )}
                {!isLoading &&
                banners.map((banner) => (
                    <TableRow key={banner._id} className="hover:bg-[#f7f7f7]/50 border-0 transition-colors">
                      <TableCell className="font-medium p-4 pl-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-28 rounded-xl overflow-hidden bg-[#f7f7f7] flex-shrink-0">
                            <Image
                              src={banner.imageUrl}
                              alt={banner.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-foreground line-clamp-1">
                              {banner.title}
                            </span>
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {banner.subtitle}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="rounded-lg font-medium capitalize border-0 bg-[#f7f7f7]">
                          {banner.theme || "light"}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(banner.isActive)}</TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-[#f7f7f7]">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl border-0 shadow-lg">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onEdit(banner)} className="cursor-pointer gap-2">
                              <Edit className="h-4 w-4" />
                              Edit Banner
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[#f7f7f7]" />
                            <DropdownMenuItem
                              onClick={() => onDelete(banner)}
                              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete Banner
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
      </div>
    </div>
  );
}
