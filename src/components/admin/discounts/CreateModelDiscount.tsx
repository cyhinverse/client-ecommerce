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
import { Check, X, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { AppDispatch } from "@/store/store";

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

    const discountData = {
      ...formData,
      discountType: formData.discountType as "percent" | "fixed",
      discountValue: Number(formData.discountValue),
      minOrderValue: Number(formData.minOrderValue) || 0,
      usageLimit: Number(formData.usageLimit),
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tạo mã giảm giá mới</DialogTitle>
          <DialogDescription>
            Điền thông tin để tạo mã giảm giá mới cho cửa hàng.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã giảm giá *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleChange("code", e.target.value)}
                  placeholder="VD: SALE2024"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountType">Loại giảm giá *</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value) => handleChange("discountType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Phần trăm (%)</SelectItem>
                    <SelectItem value="fixed">Số tiền cố định</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Mô tả về mã giảm giá..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountValue">
                  Giá trị giảm *{" "}
                  {formData.discountType === "percent" ? "(%)" : "(VNĐ)"}
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="usageLimit">Giới hạn lượt dùng *</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => handleChange("usageLimit", e.target.value)}
                  placeholder="100"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Ngày kết thúc *</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minOrderValue">
                Giá trị đơn hàng tối thiểu (VNĐ)
              </Label>
              <Input
                id="minOrderValue"
                type="number"
                value={formData.minOrderValue}
                onChange={(e) => handleChange("minOrderValue", e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label>Sản phẩm áp dụng (Để trống = Áp dụng tất cả)</Label>
              <div className="border rounded-md p-4 space-y-4">
                <div className="relative">
                     <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                     <Input 
                        placeholder="Tìm kiếm sản phẩm..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                     />
                  </div>

                  <ScrollArea className="h-[200px] w-full rounded-md border p-2">
                     <div className="space-y-2">
                        {filteredProducts.length === 0 ? (
                           <div className="text-center text-sm text-muted-foreground py-4">
                              Không tìm thấy sản phẩm
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
                                       {new Intl.NumberFormat("vi-VN", {
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
                        <span className="text-xs text-muted-foreground w-full">Đã chọn {selectedProducts.length} sản phẩm:</span>
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
              </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleChange("isActive", checked)}
              />
              <Label htmlFor="isActive">Kích hoạt mã giảm giá</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChangeWrapper(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Tạo mã giảm giá
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
