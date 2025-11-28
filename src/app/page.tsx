"use client";

import Banner from "@/components/common/Banner";
import Category from "@/components/common/Category";
import ListFeatures from "@/components/common/ListFeatures";
import NewArrivals from "@/components/common/NewArrivals";
import OnSaleProduct from "@/components/common/OnSaleProduct";
import ProductFeatures from "@/components/common/ProductFeatures";

export default function Home({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="w-full min-h-screen">
        <Banner />
        <div className="container mx-auto px-4 py-12 space-y-20">
          <Category />
          <ListFeatures />
          <ProductFeatures />
          <NewArrivals />
          <OnSaleProduct />
        </div>
      </main>
    </>
  );
}
