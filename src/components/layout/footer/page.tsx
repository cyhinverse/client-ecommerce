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
  ];

  if (adminPaths.includes(path)) return null;

  return (
    <footer className="w-full bg-background border-t">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand & Newsletter */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-xl font-bold tracking-tight">STORE</h4>
            <p className="text-muted-foreground max-w-sm">
              Subscribe to our newsletter to get updates on our latest
              collections, campaigns, and special offers.
            </p>
            <div className="flex gap-2 max-w-sm">
              <Input
                placeholder="Enter your email"
                className="bg-background border-input focus-visible:ring-1"
              />
              <Button size="icon">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-4 pt-4">
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-foreground"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-foreground"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-foreground"
              >
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-6">
            <h4 className="font-semibold tracking-wider text-sm uppercase">
              Shop
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href="/men"
                  className="hover:text-foreground transition-colors"
                >
                  Men
                </a>
              </li>
              <li>
                <a
                  href="/women"
                  className="hover:text-foreground transition-colors"
                >
                  Women
                </a>
              </li>
              <li>
                <a
                  href="/children"
                  className="hover:text-foreground transition-colors"
                >
                  Children
                </a>
              </li>
              <li>
                <a
                  href="/new-arrivals"
                  className="hover:text-foreground transition-colors"
                >
                  New Arrivals
                </a>
              </li>
              <li>
                <a
                  href="/accessories"
                  className="hover:text-foreground transition-colors"
                >
                  Accessories
                </a>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-6">
            <h4 className="font-semibold tracking-wider text-sm uppercase">
              Help
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href="/support"
                  className="hover:text-foreground transition-colors"
                >
                  Customer Service
                </a>
              </li>
              <li>
                <a
                  href="/shipping"
                  className="hover:text-foreground transition-colors"
                >
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-foreground transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-12" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} STORE. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
