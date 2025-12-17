import { useState, useEffect } from "react";
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
  Eye,
  Filter,
  Download,
  Package,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Category } from "@/types/category";
import { Badge } from "@/components/ui/badge";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import Image from "next/image";

interface CategoriesTableProps {
  categories: Category[];
  searchTerm: string;
  pageSize: number;
  isLoading?: boolean;
  onSearch: (value: string) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onView: (category: Category) => void;
  getParentName: (category: Category) => string;
  getProductCount: (category: Category) => number;
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

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US");
};

const CategoryRow = ({
  category,
  level = 0,
  onEdit,
  onDelete,
  onView,
  getParentName,
  getProductCount,
  isLoading = false,
}: {
  category: Category;
  level?: number;
  onEdit: (c: Category) => void;
  onDelete: (c: Category) => void;
  onView: (c: Category) => void;
  getParentName: (c: Category) => string;
  getProductCount: (c: Category) => number;
  isLoading?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren =
    category.subcategories && category.subcategories.length > 0;

  return (
    <>
      <TableRow
        className={`hover:bg-gray-50/50 border-border/50 transition-colors ${
          isLoading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <TableCell className="font-medium p-4">
          <div
            className="flex items-center"
            style={{ paddingLeft: `${level * 24}px` }}
          >
            {hasChildren ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 mr-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            ) : (
              <div className="w-8" />
            )}
            {category.images && category.images.length > 0 ? (
               <div className="relative h-10 w-10 mr-3 rounded-lg overflow-hidden border border-border/50">
                  <Image
                    src={category.images[0]}
                    alt={category.name as string}
                    fill
                    className="object-cover"
                  />
               </div>
            ) : (
              <div className="w-10 h-10 mr-3 rounded-lg border border-border/50 bg-gray-50 flex items-center justify-center">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <span
              className={`text-sm ${level > 0 ? "text-muted-foreground" : "font-medium text-foreground"}`}
            >
              {category.name}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <code className="relative rounded-md bg-gray-100 px-[0.4rem] py-[0.2rem] font-mono text-xs text-muted-foreground">
            {category.slug}
          </code>
        </TableCell>
        <TableCell className="text-muted-foreground text-sm">{getParentName(category)}</TableCell>
        <TableCell className="text-center font-medium text-sm">
          {getProductCount(category)}
        </TableCell>
        <TableCell>{getStatusBadge(category.isActive)}</TableCell>
        <TableCell className="text-muted-foreground text-sm">{formatDate(category.updatedAt)}</TableCell>
        <TableCell className="text-right pr-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-xl border-border/50 shadow-lg"
            >
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onView(category)} className="cursor-pointer gap-2">
                <Eye className="h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(category)} className="cursor-pointer gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem
                onClick={() => onDelete(category)}
                className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Category
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
      {isExpanded &&
        hasChildren &&
        category.subcategories?.map((sub) => (
          <CategoryRow
            key={sub._id}
            category={sub}
            level={level + 1}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            getParentName={getParentName}
            getProductCount={getProductCount}
          />
        ))}
    </>
  );
};

export function CategoriesTable({
  categories,
  searchTerm,
  pageSize,
  onSearch,
  onPageSizeChange,
  onEdit,
  onDelete,
  onView,
  getParentName,
  getProductCount,
  isLoading = false,
}: CategoriesTableProps) {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearch !== searchTerm) {
       onSearch(debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white/50 dark:bg-white/5 p-4 rounded-[1.5rem] backdrop-blur-xl border border-border/50">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={localSearch}
              onChange={handleSearch}
              className="pl-9 rounded-xl border-gray-200 bg-white/80 focus-visible:ring-0 focus-visible:border-primary transition-all shadow-sm"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl border-gray-200 bg-white/80 hover:bg-gray-50 shadow-sm w-9 h-9"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl border-gray-200 bg-white/80 hover:bg-gray-50 shadow-sm w-9 h-9"
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
            className="h-9 rounded-lg border border-gray-200 bg-white/80 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:bg-black/20 dark:border-white/10"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[2rem] border border-border/50 bg-white/60 dark:bg-[#1C1C1E]/60 backdrop-blur-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
            <Table>
            <TableHeader className="bg-gray-50/50">
                <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="w-[300px] uppercase text-xs font-bold tracking-wider text-muted-foreground pl-6">
                    Category Name
                </TableHead>
                <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">
                    Slug
                </TableHead>
                <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">
                    Parent Category
                </TableHead>
                <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground text-center">
                    Products
                </TableHead>
                <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">
                    Status
                </TableHead>
                <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground">
                    Updated At
                </TableHead>
                <TableHead className="uppercase text-xs font-bold tracking-wider text-muted-foreground text-right pr-6">
                    Actions
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading && (
                <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex justify-center items-center">
                        <SpinnerLoading />
                    </div>
                    </TableCell>
                </TableRow>
                )}
                {!isLoading && categories.length === 0 && (
                <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Package className="h-12 w-12 mb-3 opacity-20" />
                        <div className="text-muted-foreground">
                        No categories found
                        </div>
                    </div>
                    </TableCell>
                </TableRow>
                )}
                {!isLoading &&
                categories.map((category) => (
                    <CategoryRow
                    key={category._id}
                    category={category}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                    getParentName={getParentName}
                    getProductCount={getProductCount}
                    isLoading={isLoading}
                    />
                ))}
            </TableBody>
            </Table>
        </div>
      </div>
    </div>
  );
}
