"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/hooks";
import { ShoppingCart, Search, Bell } from "lucide-react";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { usePathname } from "next/navigation";
import SearchModal from "@/components/search/SearchModal";
import { pathArray } from "@/constants/PathArray";
import NotificationModel from "@/components/notifications/NotificationModel";

export default function HeaderLayout() {
  const { loading, isAuthenticated, token, data } = useAppSelector(
    (state) => state.auth
  );
  const { data: cartData } = useAppSelector((state) => state.cart);
  const [isOpen, setIsOpen] = useState(false);

  // Calculate total items in cart (sum of quantities)
  const cartItemsCount = cartData?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const path = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  if (loading) {
    return <SpinnerLoading />;
  }


  if (pathArray.includes(path)) return null;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between mx-auto px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mr-6">
            <Image
              width={32}
              height={32}
              className="object-contain"
              src="/images/logoEcom.png"
              alt="Logo"
            />
            <span className="text-xl font-bold tracking-tight">STORE</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Men
            </Link>
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Women
            </Link>
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Children
            </Link>
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Deals
            </Link>
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center gap-4">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Cart */}
            {isAuthenticated && token && (
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative cursor-pointer">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {cartItemsCount > 99 ? "99+" : cartItemsCount}
                    </span>
                  )}
                  <span className="sr-only">Cart</span>
                </Button>
              </Link>
            )}

            {
              isAuthenticated && token ? (
                <Button onClick={() => setIsOpen(pre => !pre)} variant="ghost" size="icon" className="cursor-pointer">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
              ) : null
            }

            <NotificationModel isOpen={isOpen} onClose={() => setIsOpen(false)} />

            {/* Avatar or Login */}
            {isAuthenticated && token ? (
              <Link href="/profile">
                <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-primary transition-all">
                  <Image
                    alt={data?.username as string}
                    src={data?.avatar as string}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
            ) : (
              <Button variant="default" asChild size="sm">
                <Link href="/login">Login</Link>
              </Button>
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
  );
}