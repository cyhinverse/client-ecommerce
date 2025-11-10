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
      <main className="w-full max-w-7xl mx-auto  h-full m-5 ">
        {children}
        <div className="flex gap-10">
          <Category />
          <Banner />
        </div>
        <ListFeatures />
        <ProductFeatures />
        <NewArrivals />
        <OnSaleProduct />
      </main>
    </>
  );
}
