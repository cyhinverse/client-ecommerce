"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { ShoppingCart, Search, Bell } from "lucide-react";
import SpinnerLoading from "@/components/common/SpinnerLoading";
import { usePathname } from "next/navigation";
import NotificationModel from "@/components/notifications/NotificationModel";
import { countUnreadNotification } from "@/features/notification/notificationAction";
import { useEffect } from "react";
import IconBadge from "@/components/common/IconBadge";
import SearchModal from "@/components/search/SearchModal";
import { pathArray } from "@/constants/PathArray";

export default function HeaderLayout() {
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated, token, data } = useAppSelector(
    (state) => state.auth
  );
  const { data: cartData } = useAppSelector((state) => state.cart);
  const { unreadCount } = useAppSelector((state) => state.notification);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(countUnreadNotification());
    }
  }, [isAuthenticated, token, dispatch]);

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
            <span className="text-xl font-bold tracking-tight">𝓢𝓣𝓞𝓡𝓔</span>
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
                <IconBadge 
                  count={cartItemsCount} 
                  icon={<ShoppingCart className="h-5 w-5" />} 
                />
              </Link>
            )}

            {
              isAuthenticated && token ? (
                <IconBadge 
                  count={unreadCount} 
                  icon={<Bell className="h-5 w-5" />} 
                  onClick={() => setIsOpen((pre) => !pre)}
                  variant="destructive"
                />
              ) : null
            }

            <NotificationModel isOpen={isOpen} onClose={() => setIsOpen(false)} />

            {/* Avatar or Login */}
            {isAuthenticated && token ? (
              <Link href="/profile">
                <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-primary transition-all">
                  <Image
                    alt={data?.username as string}
                    src={data?.avatar || "/images/CyBer.jpg"}
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