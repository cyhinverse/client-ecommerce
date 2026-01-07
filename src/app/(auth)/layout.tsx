import { ShoppingBag } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      {/* Branding Panel */}
      <div className="hidden lg:flex flex-col justify-between bg-[#E53935] p-10 text-white relative overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold">Ecommerce</span>
        </div>
        
        {/* Center Illustration */}
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="text-center space-y-4">
            <div className="w-32 h-32 mx-auto bg-white/10 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-16 w-16 opacity-80" />
            </div>
            <h2 className="text-2xl font-bold">Chào mừng bạn!</h2>
            <p className="text-white/80 max-w-xs">
              Khám phá hàng ngàn sản phẩm chất lượng với giá tốt nhất
            </p>
          </div>
        </div>
        
        {/* Testimonial */}
        <div className="relative z-10">
          <blockquote className="space-y-2 bg-white/10 rounded-2xl p-6">
            <p className="text-lg leading-relaxed opacity-90">
              &ldquo;Mua sắm thông minh, tiết kiệm thời gian với trải nghiệm tuyệt vời&rdquo;
            </p>
            <footer className="text-sm opacity-75 flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full" />
              <span>— Ecommerce Team</span>
            </footer>
          </blockquote>
        </div>
      </div>
      
      {/* Form Panel */}
      <div className="flex items-center justify-center p-6 lg:p-10 bg-background min-h-screen lg:min-h-0">
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  );
}
