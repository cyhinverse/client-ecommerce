import React, { useEffect, useState } from "react";
import { Card, CardTitle } from "../ui/card";
import { motion } from "framer-motion";

export default function ListFeatures() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const features = [
    "Miễn phí vận chuyển đơn hàng trên 500K",
    "Hỗ trợ khách hàng 24/7",
    "Bảo hành 30 ngày đổi trả",
    "Thanh toán an toàn & bảo mật",
  ];

  const handleClick = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    setIsClient(true);

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [features.length]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 50 }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
          Dịch Vụ Của Chúng Tôi
        </h2>
        <p className="mt-3 text-sm text-gray-600 max-w-2xl mx-auto">
          Cam kết mang đến trải nghiệm mua sắm tốt nhất
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {features.map((feature, index) => (
          <motion.div key={index} variants={item}>
            <Card
              onClick={() => handleClick(index)}
              className={`flex flex-col w-full aspect-square justify-center cursor-pointer items-center p-6 bg-white border-0 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out h-full ${currentIndex === index && isClient
                ? "bg-black text-white transform scale-105 shadow-xl"
                : "text-gray-900 hover:bg-gray-50"
                }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${currentIndex === index && isClient ? "bg-white text-black" : "bg-gray-100 text-gray-600"
                }`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {index === 0 && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  )}
                  {index === 1 && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                  {index === 2 && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                  {index === 3 && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  )}
                </svg>
              </div>
              <CardTitle className={`text-center text-sm font-medium leading-tight ${currentIndex === index && isClient ? "text-white" : "text-gray-900"
                }`}>
                {feature}
              </CardTitle>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}