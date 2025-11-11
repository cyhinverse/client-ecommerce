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
  Mail,
  MapPin,
  Phone,
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
  ];

  if (adminPaths.includes(path)) return null;

  return (
    <footer className="w-full bg-background border-t">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Your Company</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We are dedicated to providing the best service and quality
              products to our valued customers worldwide.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Youtube className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="ghost" className="justify-start" asChild>
                <a href="/about">About Us</a>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <a href="/products">Products</a>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <a href="/blog">Blog</a>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <a href="/careers">Careers</a>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <a href="/support">Support</a>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <a href="/sitemap">Sitemap</a>
              </Button>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Customer Service</h4>
            <div className="space-y-2">
              <Button variant="ghost" className="justify-start" asChild>
                <a href="/contact">Contact Us</a>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <a href="/shipping">Shipping Info</a>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <a href="/returns">Returns</a>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <a href="/privacy">Privacy Policy</a>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <a href="/terms">Terms of Service</a>
              </Button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  123 Business Street
                  <br />
                  City, State 10001
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  info@yourcompany.com
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>
              &copy; {new Date().getFullYear()} Your Company. All rights
              reserved.
            </span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>We accept:</span>
            <div className="flex space-x-2">
              {/* Payment Icons - You can replace with actual payment icons */}
              <div className="w-8 h-5 bg-muted rounded-sm flex items-center justify-center text-xs font-medium">
                VISA
              </div>
              <div className="w-8 h-5 bg-muted rounded-sm flex items-center justify-center text-xs font-medium">
                MC
              </div>
              <div className="w-8 h-5 bg-muted rounded-sm flex items-center justify-center text-xs font-medium">
                PP
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
