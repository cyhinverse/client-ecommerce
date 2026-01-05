"use client";
import Banner from "@/components/home/Banner";
import Category from "@/components/category/Category";
import ListFeatures from "@/components/home/ListFeatures";
import NewArrivals from "@/components/product/NewArrivals";
import OnSaleProduct from "@/components/product/OnSaleProduct";
import ProductFeatures from "@/components/product/ProductFeatures";

export default function Home() {
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
