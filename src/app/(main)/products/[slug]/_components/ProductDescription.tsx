"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";

interface ProductDescriptionProps {
  product: Product;
}

export function ProductDescription({ product }: ProductDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const hasImages = product.descriptionImages && product.descriptionImages.length > 0;
  const hasText = product.description && product.description.trim().length > 0;

  if (!hasImages && !hasText) {
    return (
      <section id="section-description" className="py-8">
        <h2 className="text-lg font-bold mb-6">Mô tả chi tiết</h2>
        <p className="text-gray-500 text-sm">Chưa có mô tả sản phẩm</p>
      </section>
    );
  }

  return (
    <section id="section-description" className="py-8">
      <h2 className="text-lg font-bold mb-6">Mô tả chi tiết</h2>
      
      {/* Text Description - Always show if available */}
      {hasText && (
        <div className="prose prose-sm max-w-none p-6 bg-gray-50 rounded-lg mb-6">
          <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
            {product.description}
          </p>
        </div>
      )}

      {/* Description Images */}
      {hasImages && (
        <div 
          className={cn(
            "flex flex-col relative overflow-hidden transition-all duration-300",
            !isExpanded && "max-h-[600px] lg:max-h-none"
          )}
        >
          {product.descriptionImages!.map((img, index) => (
            <div key={index} className="w-full relative">
              <Image 
                src={img} 
                alt={`${product.name} - Mô tả ${index + 1}`} 
                width={900}
                height={0}
                style={{ height: 'auto' }}
                className="w-full"
                loading="lazy"
              />
            </div>
          ))}
          
          {/* Gradient overlay for collapsed state on mobile */}
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent lg:hidden" />
          )}
        </div>
      )}

      {/* Expand/Collapse Button - Mobile only */}
      {hasImages && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden w-full mt-4 py-3 text-sm text-[#E53935] font-medium flex items-center justify-center gap-1 border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors"
        >
          {isExpanded ? (
            <>
              Thu gọn <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Xem thêm <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}

      {/* Price Explanation Block */}
      <div className="bg-[#fcfcfc] p-6 lg:p-10 space-y-6 text-xs text-gray-500 leading-relaxed border-t border-gray-100 mt-8">
        <h3 className="font-bold text-gray-800 text-sm tracking-wide uppercase">
          Giải thích giá:
        </h3>
        <div className="space-y-4">
          <div>
            <strong className="text-gray-800 block mb-1">Giá gạch ngang</strong>
            <p>
              Giá gạch ngang là giá bán lẻ đề xuất, giá hướng dẫn của nhà sản xuất, 
              hoặc giá bán trước đó. Đây không phải giá gốc và chỉ mang tính tham khảo.
            </p>
          </div>
          <div>
            <strong className="text-gray-800 block mb-1">Giá hiện tại</strong>
            <p>
              Đây là giá bán thực tế của sản phẩm. Giá có thể thay đổi tùy theo 
              chương trình khuyến mãi hoặc mã giảm giá. Giá cuối cùng sẽ được 
              hiển thị tại trang thanh toán.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDescription;
