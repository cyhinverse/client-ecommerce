import { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { getAllProducts } from "@/features/product/productAction";
import { Product } from "@/types/product";
import {  X, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { AppDispatch } from "@/store/configStore";
// Updated: Import from voucher types with backward compatibility alias
import { CreateDiscountData } from "@/types/voucher";

interface CreateModelDiscountProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (discountData: CreateDiscountData) => void;
  isLoading: boolean;
}

export function CreateModelDiscount({
  open,
  onOpenChange,
  onCreate,
  isLoading,
}: CreateModelDiscountProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percent",
    discountValue: "",
    startDate: "",
    endDate: "",
    minOrderValue: "",
    usageLimit: "1",
    isActive: true,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
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

    // Map old field names to new voucher structure
    const discountData: CreateDiscountData = {
      code: formData.code,
      name: formData.code, // Use code as name for backward compat
      description: formData.description,
      type: formData.discountType === "percent" ? "percentage" : "fixed_amount",
      value: Number(formData.discountValue),
      scope: "platform", // Default to platform scope
      minOrderValue: Number(formData.minOrderValue) || 0,
      usageLimit: Number(formData.usageLimit),
      startDate: formData.startDate,
      endDate: formData.endDate,
      isActive: formData.isActive,
      // Backward compatibility fields
      discountType: formData.discountType as "percent" | "fixed",
      discountValue: Number(formData.discountValue),
      applicableProducts: selectedProducts,
    };

    onCreate(discountData);
  };

  const handleChange = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discountType: "percent",
      discountValue: "",
      startDate: "",
      endDate: "",
      minOrderValue: "",
      usageLimit: "1",
      isActive: true,
    });
    setSelectedProducts([]);
  };

  const handleOpenChangeWrapper = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChangeWrapper}>
      <DialogContent className="sm:max-w-[600px] rounded-[2rem] border-border/50 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl shadow-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">Create New Discount</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter information to create a new discount for the store.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1 no-scrollbar">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium">Discount Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleChange("code", e.target.value)}
                  placeholder="Ex: SALE2024"
                  required
                  className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountType" className="text-sm font-medium">Discount Type *</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value) => handleChange("discountType", value)}
                >
                  <SelectTrigger className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/50">
                    <SelectItem value="percent">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Discount description..."
                className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountValue" className="text-sm font-medium">
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
                  placeholder={
                    formData.discountType === "percent" ? "10" : "50000"
                  }
                  min="0"
                  max={formData.discountType === "percent" ? "100" : undefined}
                  required
                  className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="usageLimit" className="text-sm font-medium">Usage Limit *</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => handleChange("usageLimit", e.target.value)}
                  placeholder="100"
                  min="1"
                  required
                  className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-medium">Start Date *</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  required
                  className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-medium">End Date *</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  required
                  className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minOrderValue" className="text-sm font-medium">
                Minimum Order Value (VND)
              </Label>
              <Input
                id="minOrderValue"
                type="number"
                value={formData.minOrderValue}
                onChange={(e) => handleChange("minOrderValue", e.target.value)}
                placeholder="0"
                min="0"
                className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Applicable Products (Empty = Apply to All)</Label>
              <div className="border border-border/50 rounded-xl p-4 space-y-4 bg-gray-50/30">
                <div className="relative">
                     <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                     <Input 
                        placeholder="Search products..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 rounded-xl border-gray-200 bg-white"
                     />
                  </div>

                  <ScrollArea className="h-[200px] w-full rounded-xl border border-border/50 bg-white p-2">
                     <div className="space-y-2">
                        {filteredProducts.length === 0 ? (
                           <div className="text-center text-sm text-muted-foreground py-4">
                              No products found
                           </div>
                        ) : (
                           filteredProducts.map((product) => (
                              <div key={product._id} className="flex items-center space-x-2 p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
                                 <Checkbox 
                                    id={`product-${product._id}`}
                                    checked={selectedProducts.includes(product._id)}
                                    onCheckedChange={() => toggleProductSelection(product._id)}
                                    className="rounded-md border-gray-300"
                                 />
                                 <label 
                                    htmlFor={`product-${product._id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full flex justify-between items-center"
                                 >
                                    <span>{product.name}</span>
                                    <span className="text-muted-foreground font-normal text-xs">
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
                     <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
                        <span className="text-xs text-muted-foreground w-full">Selected {selectedProducts.length} products:</span>
                        {selectedProducts.map(id => {
                           const product = products.find(p => p._id === id);
                           return product ? (
                              <Badge key={id} variant="secondary" className="pl-2 pr-1 py-1 flex items-center rounded-lg bg-white border border-border/50">
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
              </div>

            <div className="flex items-center space-x-2 p-3 rounded-xl bg-gray-50/50">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleChange("isActive", checked)}
              />
              <Label htmlFor="isActive" className="text-sm font-medium cursor-pointer">Activate discount code</Label>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChangeWrapper(false)}
              disabled={isLoading}
              className="rounded-xl border-gray-200"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="rounded-xl bg-black hover:bg-black/90 text-white dark:bg-[#0071e3] dark:hover:bg-[#0077ED]">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Discount
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
