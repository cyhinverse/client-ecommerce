"use client";
import Link from "next/link";
import { useAppSelector } from "@/hooks/hooks";
import {
  MapPin,
  Phone,
  HelpCircle,
  Heart,
  User,
  ChevronDown,
  Globe,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface TopBarLinkProps {
  href: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const TopBarLink = ({ href, icon, children, className }: TopBarLinkProps) => (
  <Link
    href={href}
    className={cn(
      "flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors",
      className
    )}
  >
    {icon}
    <span>{children}</span>
  </Link>
);

const Divider = () => (
  <span className="h-3 w-px bg-border/60 mx-2 hidden sm:block" />
);

export default function TopBar() {
  const { isAuthenticated, data } = useAppSelector((state) => state.auth);

  return (
    <div className="w-full bg-muted/30 border-b border-border/40 hidden md:block">
      <div className="container mx-auto px-4 h-8 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center">
          {/* Location */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors outline-none">
              <MapPin className="h-3 w-3" />
              <span>Việt Nam</span>
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem>
                <span className="text-xs">🇻🇳 Việt Nam</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="text-xs">🇺🇸 United States</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="text-xs">🇯🇵 Japan</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="text-xs">🇰🇷 Korea</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Divider />

          {/* User greeting or login prompt */}
          {isAuthenticated && data ? (
            <span className="text-xs text-muted-foreground">
              Xin chào,{" "}
              <Link
                href="/profile"
                className="text-primary hover:underline font-medium"
              >
                {data.username || data.email?.split("@")[0]}
              </Link>
            </span>
          ) : (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Xin chào,</span>
              <Link href="/login" className="text-primary hover:underline">
                Đăng nhập
              </Link>
              <span>hoặc</span>
              <Link href="/register" className="text-primary hover:underline">
                Đăng ký
              </Link>
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center">
          {/* Quick Links */}
          {isAuthenticated && (
            <>
              <TopBarLink
                href="/profile/orders"
                icon={<User className="h-3 w-3" />}
              >
                Đơn hàng của tôi
              </TopBarLink>
              <Divider />
              <TopBarLink href="/wishlist" icon={<Heart className="h-3 w-3" />}>
                Yêu thích
              </TopBarLink>
              <Divider />
            </>
          )}

          {/* Support */}
          <TopBarLink href="/support" icon={<Phone className="h-3 w-3" />}>
            Hotline: 1900-xxxx
          </TopBarLink>

          <Divider />

          <TopBarLink href="/help" icon={<HelpCircle className="h-3 w-3" />}>
            Trợ giúp
          </TopBarLink>

          <Divider />

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors outline-none">
              <Globe className="h-3 w-3" />
              <span>Tiếng Việt</span>
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem>
                <span className="text-xs">🇻🇳 Tiếng Việt</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="text-xs">🇺🇸 English</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="text-xs">🇯🇵 日本語</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="text-xs">🇰🇷 한국어</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
