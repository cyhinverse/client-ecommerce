import { ShoppingBag } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-[#18181b] p-10 text-white">
        <div className="flex items-center gap-2 text-lg font-medium">
          <ShoppingBag className="h-6 w-6" />
          <span>Ecommerce</span>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This library has saved me countless hours of work and
              helped me deliver stunning designs to my clients faster than ever
              before.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="mx-auto w-full max-w-[450px]">{children}</div>
      </div>
    </div>
  );
}
