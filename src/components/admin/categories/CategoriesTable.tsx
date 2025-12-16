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
    <Badge className="bg-primary text-primary-foreground border-primary">
      <CheckCircle className="h-3 w-3 mr-1" />
      Active
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="border-muted-foreground text-muted-foreground"
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
        className={`hover:bg-muted/50 border-b border-border ${
          isLoading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <TableCell className="font-medium">
          <div
            className="flex items-center"
            style={{ paddingLeft: `${level * 24}px` }}
          >
            {hasChildren ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 mr-2 hover:bg-muted rounded-none"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            ) : (
              <div className="w-8" />
            )}
            {category.images && category.images.length > 0 ? (
              <Image
                src={category.images[0]}
                alt={category.name as string}
                width={32}
                height={32}
                className="w-8 h-8 mr-2 object-cover border border-border"
              />
            ) : (
              <div className="w-8 h-8 mr-2 border border-border bg-muted flex items-center justify-center">
                <Package className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <span
              className={level > 0 ? "text-muted-foreground" : "font-medium"}
            >
              {category.name}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            {category.slug}
          </code>
        </TableCell>
        <TableCell>{getParentName(category)}</TableCell>
        <TableCell className="text-center">
          {getProductCount(category)}
        </TableCell>
        <TableCell>{getStatusBadge(category.isActive)}</TableCell>
        <TableCell>{formatDate(category.updatedAt)}</TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 rounded-none">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-none border-border"
            >
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onView(category)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(category)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(category)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
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
  const debouncedSearch = useDebounce(localSearch);

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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={localSearch}
              onChange={handleSearch}
              className="pl-8 rounded-none border-border focus-visible:ring-0 focus-visible:border-primary"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="rounded-none border-border"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-none border-border"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="pageSize" className="text-muted-foreground">
            Show:
          </Label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border border-border rounded-none px-2 py-1 text-sm bg-background text-foreground focus:border-primary focus:ring-primary"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-none border border-border bg-background shadow-sm overflow-x-auto no-scrollbar">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-muted/50 bg-muted/50">
              <TableHead className="text-foreground font-semibold">
                Category Name
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Slug
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Parent Category
              </TableHead>
              <TableHead className="text-foreground font-semibold text-center">
                Products
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Status
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Updated At
              </TableHead>
              <TableHead className="text-foreground font-semibold text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <SpinnerLoading />
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!isLoading && categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Package className="h-12 w-12 mb-2 opacity-50" />
                    <div className="text-muted-foreground">
                      No categories found
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
