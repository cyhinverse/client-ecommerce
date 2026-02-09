"use client";

import { Product } from "@/types/product";
import { Package, Ruler, Tag, Store, Layers, Palette } from "lucide-react";

interface ProductSpecsProps {
  product: Product;
}

interface SpecItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export function ProductSpecs({ product }: ProductSpecsProps) {
  // Build basic product info specs
  const basicSpecs: SpecItem[] = [
    { 
      label: "Thương hiệu", 
      value: product.brand || "",
      icon: <Tag className="w-4 h-4" />
    },
    { 
      label: "Danh mục", 
      value: product.category?.name || "",
      icon: <Layers className="w-4 h-4" />
    },
    { 
      label: "Danh mục Shop", 
      value: typeof product.shopCategory === 'object' && product.shopCategory?.name 
        ? product.shopCategory.name 
        : "",
      icon: <Store className="w-4 h-4" />
    },
    { 
      label: "Cân nặng", 
      value: product.weight ? `${product.weight}g` : "",
      icon: <Package className="w-4 h-4" />
    },
    { 
      label: "Kích thước", 
      value: product.dimensions && (product.dimensions.length || product.dimensions.width || product.dimensions.height)
        ? `${product.dimensions.length || 0} x ${product.dimensions.width || 0} x ${product.dimensions.height || 0} cm` 
        : "",
      icon: <Ruler className="w-4 h-4" />
    },
    { 
      label: "Số lượng tồn kho", 
      value: product.stock?.toString() || "" 
    },
    { 
      label: "Đã bán", 
      value: product.soldCount?.toString() || "0" 
    },
  ].filter(spec => spec.value !== "");

  // Build sizes spec if available
  const sizesSpec: SpecItem | null = product.sizes && product.sizes.length > 0
    ? { 
        label: "Kích cỡ có sẵn", 
        value: product.sizes.join(", "),
        icon: <Palette className="w-4 h-4" />
      }
    : null;

  // Build custom attributes specs
  const attributeSpecs: SpecItem[] = product.attributes && product.attributes.length > 0
    ? product.attributes.map(attr => ({ 
        label: attr.name, 
        value: attr.value 
      }))
    : [];

  // Combine all specs
  const allSpecs = [
    ...basicSpecs,
    ...(sizesSpec ? [sizesSpec] : []),
    ...attributeSpecs
  ];

  if (allSpecs.length === 0) {
    return (
      <section id="section-specs" className="py-8">
        <h2 className="text-lg font-bold mb-6">Thông số sản phẩm</h2>
        <p className="text-gray-500 text-sm">Chưa có thông số sản phẩm</p>
      </section>
    );
  }

  return (
    <section id="section-specs" className="py-8">
      <h2 className="text-lg font-bold mb-6">Thông số sản phẩm</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 bg-[#fdfdfd] border border-gray-100 rounded-lg overflow-hidden">
        {allSpecs.map((spec, index) => (
          <div 
            key={index} 
            className="flex border-b border-r border-gray-100 last:border-b-0 even:border-r-0 md:even:border-r md:nth-last-[-n+2]:border-b-0"
          >
            <div className="w-2/5 bg-[#f7f7f7] px-4 py-3.5 text-xs text-gray-500 font-medium flex items-center gap-2">
              {spec.icon && <span className="text-gray-400">{spec.icon}</span>}
              {spec.label}
            </div>
            <div className="flex-1 px-4 py-3.5 text-xs text-gray-700 font-medium">
              {spec.value}
            </div>
          </div>
        ))}
      </div>

      {/* Sizes Display - Visual chips */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Kích cỡ có sẵn</h3>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size, idx) => (
              <span 
                key={idx}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-200"
              >
                {size}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Variants Summary */}
      {product.variants && product.variants.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Phân loại ({product.variants.length} màu)
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant, idx) => (
              <span 
                key={idx}
                className="px-3 py-1.5 bg-white text-gray-600 text-xs font-medium rounded-full border border-gray-200 flex items-center gap-1.5"
              >
                {variant.color && (
                  <span 
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ 
                      backgroundColor: getColorCode(variant.color) 
                    }}
                  />
                )}
                {variant.name || variant.color || `Phân loại ${idx + 1}`}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// Helper function to get color code from color name
function getColorCode(colorName: string): string {
  const colorMap: Record<string, string> = {
    'đỏ': '#E53935',
    'red': '#E53935',
    'xanh': '#1976D2',
    'blue': '#1976D2',
    'xanh dương': '#1976D2',
    'xanh lá': '#43A047',
    'green': '#43A047',
    'vàng': '#FDD835',
    'yellow': '#FDD835',
    'cam': '#FB8C00',
    'orange': '#FB8C00',
    'tím': '#8E24AA',
    'purple': '#8E24AA',
    'hồng': '#EC407A',
    'pink': '#EC407A',
    'đen': '#212121',
    'black': '#212121',
    'trắng': '#FAFAFA',
    'white': '#FAFAFA',
    'xám': '#757575',
    'gray': '#757575',
    'grey': '#757575',
    'nâu': '#795548',
    'brown': '#795548',
    'be': '#D7CCC8',
    'beige': '#D7CCC8',
    'navy': '#1A237E',
    'xanh navy': '#1A237E',
  };
  
  const lowerName = colorName.toLowerCase().trim();
  return colorMap[lowerName] || '#E0E0E0';
}

export default ProductSpecs;
