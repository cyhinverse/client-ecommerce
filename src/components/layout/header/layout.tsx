"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/hooks";
import { ShoppingCart, Search } from "lucide-react";
import SpinnerLoading from "@/components/common/SpinerLoading";
import { usePathname } from "next/navigation";
import SearchModal from "@/components/search/SearchModel";

export default function HeaderLayout() {
  const { loading, isAuthenticated, token, data } = useAppSelector(
    (state) => state.auth,
  );
  const path = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  if (loading) {
    return <SpinnerLoading />;
  }

  const pathArray = [
    "/admin",
    "/admin/products",
    "/admin/orders",
    "/admin/users",
    "/admin/notifications",
    "/admin/categories",
    "/admin/discounts",
    "/admin/settings",
    "/admin/dashboard"
  ];

  return (
    <>
      {pathArray.includes(path) ? null : (
        <>
          <header className="sticky top-5 z-40 w-full h-[60px] max-w-7xl mx-auto flex flex-col m-3 items-center justify-center bg-white border border-gray-200 cursor-pointer rounded-lg p-5 shadow-sm">
            <div className="w-full h-[50px] flex items-center justify-between px-6">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <Image
                  width={40}
                  height={40}
                  className="object-contain"
                  src="/images/logoEcom.png"
                  alt="Logo"
                />
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link
                  href="/men"
                  className="text-base font-medium transition-colors hover:text-gray-900 text-gray-600 relative group"
                >
                  Men
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all group-hover:w-full"></span>
                </Link>
                <Link
                  href="/women"
                  className="text-base font-medium transition-colors hover:text-gray-900 text-gray-600 relative group"
                >
                  Women
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all group-hover:w-full"></span>
                </Link>
                <Link
                  href="/children"
                  className="text-base font-medium transition-colors hover:text-gray-900 text-gray-600 relative group"
                >
                  Children
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all group-hover:w-full"></span>
                </Link>
                <Link
                  href="/deals"
                  className="text-base font-medium transition-colors hover:text-gray-900 text-gray-600 relative group"
                >
                  Deals
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all group-hover:w-full"></span>
                </Link>
              </nav>

              {/* Search and Actions */}
              <div className="flex items-center space-x-4">
                {/* Search Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  className="hidden sm:flex"
                >
                  <Search className="h-5 w-5" />
                </Button>

                {/* Mobile Search */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  className="sm:hidden"
                >
                  <Search className="h-5 w-5" />
                </Button>

                {/* Cart */}
                {isAuthenticated && token && (
                  <Link href="/cart" className="p-2">
                    <ShoppingCart className="h-5 w-5" />
                  </Link>
                )}

                {/* Avatar or Login */}
                {isAuthenticated && token ? (
                  <Link href="/profile">
                    {/* Sửa lỗi ở đây: chỉ dùng width/height HOẶC fill, không dùng cả hai */}
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        alt={data?.username as string}
                        src={data?.avatar as string}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="text-base font-medium transition-colors hover:text-gray-900 text-gray-600"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </header>

          {/* Search Modal */}
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
        </>
      )}
    </>
  );
}