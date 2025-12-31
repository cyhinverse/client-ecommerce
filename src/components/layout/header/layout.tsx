"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { ShoppingCart, Search, Bell, Menu, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import NotificationModel from "@/components/notifications/NotificationModel";
import { countUnreadNotification } from "@/features/notification/notificationAction";
import { toggleChat } from "@/features/chat/chatSlice";
import SearchModal from "@/components/search/SearchModal";
import { pathArray } from "@/constants/PathArray";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NavLinks = ({ className }: { className?: string }) => (
  <>
    {["Men", "Women", "Children", "Accessories"].map((item) => (
      <Link
        key={item}
        href={`/products?category=${item.toLowerCase()}`}
        className={cn(
          "text-sm font-medium transition-colors hover:text-foreground/80 opacity-70 hover:opacity-100",
          className
        )}
      >
        {item}
      </Link>
    ))}
    <Link
      href="/products"
      className={cn(
        "text-sm font-medium transition-colors hover:text-foreground/80 opacity-70 hover:opacity-100",
        className
      )}
    >
      All Products
    </Link>
  </>
);

export default function HeaderLayout() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token, data } = useAppSelector(
    (state) => state.auth
  );
  const { data: cartData } = useAppSelector((state) => state.cart);
  const { unreadCount } = useAppSelector((state) => state.notification);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const path = usePathname();

  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(countUnreadNotification());
    }
  }, [isAuthenticated, token, dispatch]);

  const cartItemsCount =
    cartData?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  if (pathArray.includes(path)) return null;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-black/5 dark:border-white/5 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden -ml-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left text-lg font-bold">
                    Store
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  <NavLinks className="text-lg py-2 border-b border-border/50" />
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight"> STORE</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <NavLinks />
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>

            {isAuthenticated && token && (
              <>
                <Link href="/cart">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground relative"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => dispatch(toggleChat())}
                  className="text-muted-foreground hover:text-foreground relative"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen((prev) => !prev)}
                  className={cn(
                    "text-muted-foreground hover:text-foreground relative",
                    isOpen && "text-foreground"
                  )}
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-red-500" />
                  )}
                </Button>
              </>
            )}

            <NotificationModel
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
            />

            {isAuthenticated && token ? (
              <Link href="/profile" className="ml-2">
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted hover:ring-2 hover:ring-primary/20 transition-all">
                  <Image
                    alt={data?.username || "User"}
                    src={data?.avatar || "/images/CyBer.jpg"}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
            ) : (
              <Button asChild size="sm" className="ml-2 rounded-full px-5">
                <Link href="/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
