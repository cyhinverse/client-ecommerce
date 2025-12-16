import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { UpdateDiscountData, Discount } from "@/types/discount";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/configStore";
import { getAllProducts } from "@/features/product/productAction";
import { Product } from "@/types/product";
import { X, Search, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface UpdateModelDiscountProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  discount: Discount | null;
  onUpdate: (discountData: UpdateDiscountData) => void;
  isLoading: boolean;
}

export function UpdateModelDiscount({
  open,
  onOpenChange,
  discount,
  onUpdate,
  isLoading,
}: UpdateModelDiscountProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [products, setProducts] = useState<Product[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const initialFormData = useMemo(
    () => ({
      code: discount?.code || "",
      description: discount?.description || "",
      discountType: discount?.discountType || "percent",
      discountValue: discount?.discountValue?.toString() || "",
      startDate: discount?.startDate ? discount.startDate.split("T")[0] : "",
      endDate: discount?.endDate ? discount.endDate.split("T")[0] : "",
      minOrderValue: discount?.minOrderValue?.toString() || "",
      usageLimit: discount?.usageLimit?.toString() || "1",
      isActive: discount?.isActive ?? true,
    }),
    [discount]
  );

  const [formData, setFormData] = useState(initialFormData);

  // Initialize selected products from prop directly
  const [selectedProducts, setSelectedProducts] = useState<string[]>(() => {
    if (discount?.applicableProducts && discount.applicableProducts.length > 0) {
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       return discount.applicableProducts.map((p: any) => typeof p === 'object' ? p._id : p);
    }
    return [];
  });

  useEffect(() => {
    // Fetch products for selection
    dispatch(getAllProducts({ page: 1, limit: 100 }))
      .unwrap()
      .then((res: any) => {
        if (res?.data?.data) {
          setProducts(res.data.data);
        }
      });
  }, [dispatch]);

  const filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };
 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!discount) return;

    const discountData = {
      ...formData,
      discountType: formData.discountType as "percent" | "fixed",
      discountValue: Number(formData.discountValue),
      minOrderValue: Number(formData.minOrderValue) || 0,
      usageLimit: Number(formData.usageLimit),
      applicableProducts: selectedProducts,
    };

    onUpdate(discountData);
  };

  const handleChange = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Update Discount</DialogTitle>
          <DialogDescription>
            Edit discount information for {discount?.code}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Discount Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleChange("code", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type *</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value) => handleChange("discountType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountValue">
                  Discount Value *{" "}
                  {formData.discountType === "percent" ? "(%)" : "(VND)"}
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) =>
                    handleChange("discountValue", e.target.value)
                  }
                  min="0"
                  max={formData.discountType === "percent" ? "100" : undefined}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="usageLimit">Usage Limit *</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => handleChange("usageLimit", e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minOrderValue">
                Minimum Order Value (VND)
              </Label>
              <Input
                id="minOrderValue"
                type="number"
                value={formData.minOrderValue}
                onChange={(e) => handleChange("minOrderValue", e.target.value)}
                min="0"
              />
            </div>

            <div className="space-y-3 border rounded-md p-4">
                  <Label>Applicable Products (Empty = Apply to All)</Label>
                  
                  <div className="relative">
                     <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                     <Input 
                        placeholder="Search products..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                     />
                  </div>

                  <ScrollArea className="h-[200px] w-full rounded-md border p-2">
                     <div className="space-y-2">
                        {filteredProducts.length === 0 ? (
                           <div className="text-center text-sm text-muted-foreground py-4">
                              No products found
                           </div>
                        ) : (
                           filteredProducts.map((product) => (
                              <div key={product._id} className="flex items-center space-x-2">
                                 <Checkbox 
                                    id={`product-${product._id}`}
                                    checked={selectedProducts.includes(product._id)}
                                    onCheckedChange={() => toggleProductSelection(product._id)}
                                 />
                                 <label 
                                    htmlFor={`product-${product._id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full flex justify-between"
                                 >
                                    <span>{product.name}</span>
                                    <span className="text-muted-foreground font-normal">
                                       {new Intl.NumberFormat("en-US", {
                                          style: "currency",
                                          currency: "VND",
                                       }).format(product.price?.discountPrice || product.price?.currentPrice || 0)}
                                    </span>
                                 </label>
                              </div>
                           ))
                        )}
                     </div>
                  </ScrollArea>
                  
                  {selectedProducts.length > 0 && (
                     <div className="flex flex-wrap gap-2 pt-2 border-t">
                        <span className="text-xs text-muted-foreground w-full">Selected {selectedProducts.length} products:</span>
                        {selectedProducts.map(id => {
                           const product = products.find(p => p._id === id);
                           return product ? (
                              <Badge key={id} variant="secondary" className="pl-2 pr-1 py-1 flex items-center">
                                 {product.name}
                                 <Button
                                    type="button"
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-4 w-4 ml-1 hover:bg-transparent text-muted-foreground hover:text-foreground p-0"
                                    onClick={() => toggleProductSelection(id)}
                                 >
                                    <X className="h-3 w-3" />
                                 </Button>
                              </Badge>
                           ) : null;
                        })}
                     </div>
                  )}
                </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleChange("isActive", checked)}
              />
              <Label htmlFor="isActive">Activate discount code</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
