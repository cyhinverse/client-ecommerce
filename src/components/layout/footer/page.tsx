"use client";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const FooterSection = ({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) => (
  <div className="space-y-4">
    <h4 className="font-semibold tracking-wide text-xs uppercase text-foreground/70">
      {title}
    </h4>
    <ul className="space-y-3 text-xs text-muted-foreground">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            href={link.href}
            className="hover:text-foreground transition-colors hover:underline"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function FooterLayout() {
  const path = usePathname();
  const adminPaths = [
    "/admin",
    "/admin/products",
    "/admin/orders",
    "/admin/users",
    "/admin/notifications",
    "/admin/categories",
    "/admin/discounts",
    "/admin/settings",
    "/admin/dashboard",
    "/admin/banners",
  ];

  if (adminPaths.includes(path)) return null;

  return (
    <footer className="w-full bg-[#FAFAFC] border-t border-border/40">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand & Newsletter */}
          <div className="md:col-span-1 space-y-6">
            <Link href="/" className="block">
              <span className="text-lg font-bold tracking-tight"> STORE</span>
            </Link>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-[280px]">
              Subscribe to our newsletter for the latest updates, exclusive
              deals, and more.
            </p>
            <div className="flex gap-2 max-w-[280px]">
              <Input
                placeholder="Email address"
                className="bg-background/50 border-border/50 focus-visible:ring-1 text-xs h-9 rounded-full px-4"
              />
              <Button size="icon" className="h-9 w-9 rounded-full shrink-0">
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="flex gap-1 pt-2">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-transparent"
                >
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>

          <FooterSection
            title="Shop"
            links={[
              { label: "Mac", href: "/products?category=mac" },
              { label: "iPad", href: "/products?category=ipad" },
              { label: "iPhone", href: "/products?category=iphone" },
              { label: "Watch", href: "/products?category=watch" },
              { label: "Accessories", href: "/products?category=accessories" },
            ]}
          />

          <FooterSection
            title="Account"
            links={[
              { label: "Manage Account", href: "/profile" },
              { label: "Orders", href: "/profile?tab=orders" },
              { label: "Returns", href: "/returns" },
              { label: "Wishlist", href: "/wishlist" },
            ]}
          />

          <FooterSection
            title="Policy"
            links={[
              { label: "Terms of Use", href: "/terms" },
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Cookie Policy", href: "/cookies" },
              { label: "Shipping Policy", href: "/shipping" },
            ]}
          />
        </div>

        <Separator className="bg-border/40" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-muted-foreground pt-8">
          <p>
            &copy; {new Date().getFullYear()} Apple Store Inc. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Use
            </Link>
            <Link href="/sales" className="hover:underline">
              Sales and Refunds
            </Link>
            <Link href="/legal" className="hover:underline">
              Legal
            </Link>
            <Link href="/sitemap" className="hover:underline">
              Site Map
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
