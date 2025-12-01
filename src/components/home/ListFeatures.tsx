"use client";

import { motion } from "framer-motion";
import { Truck, Headphones, Shield, CreditCard } from "lucide-react";

export default function ListFeatures() {
  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over 500K"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Always here to help"
    },
    {
      icon: Shield,
      title: "30-Day Returns",
      description: "Hassle-free returns"
    },
    {
      icon: CreditCard,
      title: "Secure Payment",
      description: "100% protected"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="w-full py-12 border-y">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              variants={item}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}