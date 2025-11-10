"use client";
import { usePathname } from "next/navigation";

export default function FooterLayout() {
  const path = usePathname();
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
        <footer className="w-full bg-gray-100 py-6 mt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-sm text-gray-600">
                &copy; {new Date().getFullYear()} Your Company. All rights
                reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a
                  href="/about"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  About Us
                </a>
                <a
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Contact
                </a>
                <a
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}
