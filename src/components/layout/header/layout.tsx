"use client";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/hooks/hooks";
import { ShoppingCart, Search } from "lucide-react";
import SpinnerLoading from "@/components/common/SpinerLoading";
import { usePathname } from "next/navigation";

export default function HeaderLayout() {
  const { loading, isAuthenticated, token, data } = useAppSelector(
    (state) => state.auth
  );
  const path = usePathname();

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
  ];

  return (
    <>
      {pathArray.includes(path) ? null : (
        <header className="sticky top-5 z-50 w-full h-[60px] max-w-7xl mx-auto flex flex-col m-3 items-center justify-center bg-white border border-gray-200 cursor-pointer rounded-lg p-5 shadow-sm">
          <div className="w-full h-[50px] flex items-center justify-between px-6">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                width={40}
                height={40}
                className="object-contain"
                src="/images/logo.png"
                alt="Logo"
              />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/men"
                className="text-sm font-medium transition-colors hover:text-gray-900 text-gray-600"
              >
                Men
              </Link>
              <Link
                href="/women"
                className="text-sm font-medium transition-colors hover:text-gray-900 text-gray-600"
              >
                Women
              </Link>
              <Link
                href="/children"
                className="text-sm font-medium transition-colors hover:text-gray-900 text-gray-600"
              >
                Children
              </Link>
              <Link
                href="/deals"
                className="text-sm font-medium transition-colors hover:text-gray-900 text-gray-600"
              >
                Deals
              </Link>
            </nav>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search..."
                  className="w-[200px] pl-9 pr-4"
                />
              </div>

              {/* Cart */}
              {isAuthenticated && token && (
                <Link href="/cart" className="p-2">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
              )}

              {/* Avatar or Login */}
              {isAuthenticated && token ? (
                <Link href="/profile">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={data?.avatar} />
                    <AvatarFallback className="text-xs">
                      {data?.username?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium transition-colors hover:text-gray-900 text-gray-600"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </header>
      )}
    </>
  );
}
