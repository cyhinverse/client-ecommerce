"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/configStore";
import {
    toggleChat,
    closeChat,
    sendMessage as sendMessageAction,
    addMessage,
    loadSuggestions,
} from "@/features/chat/chatSlice";
import { MessageCircle, X, Send, Minimize2, User, Bot, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { Message } from "@/types/chat";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    ReviewList,
    CategoryGrid,
    AddressList,
    ComparisonTable,
    StockStatus,
    OrderConfirmation,
    ShippingFeeCard,
    VoucherCard,
    PurchaseHistoryCard,
    PersonalizedRecommendations,
    FlashDealsCard,
    LowStockBadge,
    LimitedOffersCard,
    RecentPurchasesNotif,
    TrendingProducts,
    PersonalizedDiscountCard,
    BundleSavingsCard,
    AbandonedCartCard,
    CartRecoveryIncentive,
    UpgradeSuggestions,
    FrequentlyBoughtTogether,
} from "./ChatDataComponents";

/**
 * Product List Component for Chat
 */
const ProductList = ({
    products,
    onProductClick,
}: {
    products: any[];
    onProductClick: (slug: string) => void;
}) => {
    if (!products || products.length === 0) return null;

    return (
        <div className="flex gap-3 overflow-x-auto py-3 px-1 snap-x scrollbar-none">
            {products.map((product) => (
                <motion.div
                    key={product._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                >
                    <Card
                        className="min-w-[160px] w-[160px] snap-start cursor-pointer hover:shadow-md transition-all duration-200 border-gray-200 flex-shrink-0 group"
                        onClick={() => onProductClick(product.slug)}
                    >
                        <div className="relative w-full h-32 bg-gray-50 rounded-t-lg overflow-hidden">
                            {product.images && product.images[0] ? (
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    sizes="160px"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <ShoppingBag className="w-8 h-8" />
                                </div>
                            )}
                        </div>
                        <CardContent className="p-3">
                            <h4
                                className="text-xs font-medium line-clamp-2 h-8 mb-1.5 text-gray-900"
                                title={product.name}
                            >
                                {product.name}
                            </h4>
                            <p className="text-sm font-bold text-black">
                                {product.price?.currentPrice?.toLocaleString("vi-VN")}đ
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
};

/**
 * Main Chat Widget Component
 * Floating chat button and window
 */
const ChatWidget = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { isOpen, messages, isTyping, suggestions, isLoading } = useSelector(
        (state: RootState) => state.chat
    );
    const { data: user } = useSelector((state: RootState) => state.auth);

    const [inputMessage, setInputMessage] = useState("");
    const [isMinimized, setIsMinimized] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Prevent scroll propagation to main page
    useEffect(() => {
        const scrollArea = scrollAreaRef.current;
        if (!scrollArea) return;

        const handleWheel = (e: WheelEvent) => {
            const { scrollTop, scrollHeight, clientHeight } = scrollArea;
            const isScrollingDown = e.deltaY > 0;
            const isScrollingUp = e.deltaY < 0;

            // Prevent scroll leak when at boundaries
            if ((isScrollingUp && scrollTop === 0) || 
                (isScrollingDown && scrollTop + clientHeight >= scrollHeight)) {
                e.preventDefault();
            }
            // Always stop propagation
            e.stopPropagation();
        };

        scrollArea.addEventListener('wheel', handleWheel, { passive: false });
        return () => scrollArea.removeEventListener('wheel', handleWheel);
    }, [isOpen]);

    // Load suggestions on mount
    useEffect(() => {
        if (isOpen) {
            dispatch(loadSuggestions());
        }
    }, [isOpen, dispatch]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage("");

        // Add user message to UI immediately
        dispatch(
            addMessage({
                role: "user",
                content: userMessage,
                timestamp: new Date().toISOString(),
            })
        );

        // Send to backend
        dispatch(sendMessageAction(userMessage));

        // Auto-focus input after sending
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInputMessage(suggestion);
    };

    const handleProductClick = (slug: string) => {
        router.push(`/${slug}`);
    };

    const handleCategoryClick = (categoryName: string) => {
        // Send message to view products in this category
        const message = `Xem sản phẩm ${categoryName}`;
        dispatch(
            addMessage({
                role: "user",
                content: message,
                timestamp: new Date().toISOString(),
            })
        );
        dispatch(sendMessageAction(message));
    };

    // If user not logged in, don't show chat
    if (!user) {
        return null;
    }

    return (
        <>
            {/* Floating Chat Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="fixed bottom-6 right-6 z-50"
                    >
                        <Button
                            onClick={() => dispatch(toggleChat())}
                            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl bg-black hover:bg-gray-800 text-white p-0"
                            aria-label="Open chat"
                        >
                            <MessageCircle className="w-6 h-6" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            height: isMinimized ? 64 : 600,
                            width: isMinimized ? 320 : 380
                        }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{ overscrollBehaviorY: 'contain', touchAction: 'pan-y' }}
                        className="fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden origin-bottom-right"
                    >
                        {/* Header */}
                        <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Avatar className="h-9 w-9 border border-gray-100">
                                        <AvatarImage src="/bot-avatar.png" />
                                        <AvatarFallback className="bg-black text-white">AI</AvatarFallback>
                                    </Avatar>
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-900">Trợ lý ảo</h3>
                                    <p className="text-[10px] text-gray-500 font-medium">Online</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    className="h-8 w-8 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full"
                                >
                                    <Minimize2 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => dispatch(closeChat())}
                                    className="h-8 w-8 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Messages Area */}
                                <div 
                                    ref={scrollAreaRef}
                                    className="flex-1 overflow-auto p-4 bg-white"
                                    style={{ overscrollBehavior: 'contain' }}
                                >
                                    <div className="space-y-6">
                                        {messages.length === 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex flex-col items-center justify-center mt-10 text-center space-y-3"
                                            >
                                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                                                    <Bot className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900">Xin chào!</h4>
                                                    <p className="text-sm text-gray-500 max-w-[200px]">
                                                        Tôi có thể giúp bạn tìm sản phẩm, kiểm tra đơn hàng và hơn thế nữa.
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}

                                        {messages.map((message: Message, index: number) => {
                                            const isUser = message.role === "user";
                                            const hasProducts =
                                                message.data &&
                                                Array.isArray(message.data) &&
                                                message.data.length > 0 &&
                                                message.data[0].slug;

                                            return (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 10, x: isUser ? 10 : -10 }}
                                                    animate={{ opacity: 1, y: 0, x: 0 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                    className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"
                                                        }`}
                                                >
                                                    <div
                                                        className={`flex items-end gap-2 max-w-[90%] ${isUser ? "flex-row-reverse" : "flex-row"
                                                            }`}
                                                    >
                                                        {!isUser && (
                                                            <Avatar className="h-6 w-6 mt-1 flex-shrink-0">
                                                                <AvatarFallback className="bg-black text-white text-[10px]">AI</AvatarFallback>
                                                            </Avatar>
                                                        )}

                                                        <div
                                                            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${isUser
                                                                ? "bg-black text-white rounded-tr-sm"
                                                                : "bg-gray-100 text-gray-900 rounded-tl-sm"
                                                                }`}
                                                        >
                                                            <div className="whitespace-pre-wrap break-words">
                                                                {message.content}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Timestamp */}
                                                    <div className={`text-[10px] text-gray-400 px-1 ${isUser ? "mr-10" : "ml-10"}`}>
                                                        {message.timestamp && new Date(message.timestamp).toLocaleTimeString(
                                                            "vi-VN",
                                                            { hour: "2-digit", minute: "2-digit" }
                                                        )}
                                                    </div>

                                                    {/* Enhanced Data Display (Only for assistant messages) */}
                                                    {!isUser && message.data && (
                                                        <div className="ml-8 w-full max-w-[90%] mt-2">
                                                            {/* Product List */}
                                                            {hasProducts && (
                                                                <ProductList
                                                                    products={message.data}
                                                                    onProductClick={handleProductClick}
                                                                />
                                                            )}

                                                            {/* Reviews */}
                                                            {message.metadata?.intent === "get_product_reviews" && (
                                                                <ReviewList reviews={message.data} />
                                                            )}

                                                            {/* Categories */}
                                                            {message.metadata?.intent === "browse_categories" && (
                                                                <CategoryGrid
                                                                    categories={message.data}
                                                                    onCategoryClick={handleCategoryClick}
                                                                />
                                                            )}

                                                            {/* Addresses */}
                                                            {message.metadata?.intent === "get_user_addresses" && (
                                                                <AddressList addresses={message.data} />
                                                            )}

                                                            {/* Product Comparison */}
                                                            {message.metadata?.intent === "compare_products" && Array.isArray(message.data) && (
                                                                <ComparisonTable products={message.data} />
                                                            )}

                                                            {/* Stock Status */}
                                                            {message.metadata?.intent === "check_stock_availability" && (
                                                                <StockStatus stockData={message.data} />
                                                            )}

                                                            {/* Order Confirmation */}
                                                            {message.metadata?.intent === "create_order_from_cart" && message.data._id && (
                                                                <OrderConfirmation order={message.data} />
                                                            )}

                                                            {/* Shipping Fee */}
                                                            {message.metadata?.intent === "calculate_shipping_fee" && (
                                                                <ShippingFeeCard shippingData={message.data} />
                                                            )}

                                                            {/* Voucher Applied */}
                                                            {message.metadata?.intent === "apply_voucher_to_cart" && message.data.voucherCode && (
                                                                <VoucherCard voucherData={message.data} />
                                                            )}

                                                            {/* ========== PERSUASIVE COMMERCE ========== */}
                                                            
                                                            {/* Purchase History */}
                                                            {message.metadata?.intent === "get_user_purchase_history" && (
                                                                <PurchaseHistoryCard historyData={message.data} />
                                                            )}

                                                            {/* Personalized Recommendations */}
                                                            {message.metadata?.intent === "get_personalized_recommendations" && (
                                                                <PersonalizedRecommendations
                                                                    data={message.data}
                                                                    onProductClick={handleProductClick}
                                                                />
                                                            )}

                                                            {/* Flash Deals */}
                                                            {message.metadata?.intent === "get_flash_deals" && (
                                                                <FlashDealsCard
                                                                    dealsData={message.data}
                                                                    onProductClick={handleProductClick}
                                                                />
                                                            )}

                                                            {/* Low Stock Products */}
                                                            {message.metadata?.intent === "get_low_stock_products" && (
                                                                <LowStockBadge stockData={message.data} />
                                                            )}

                                                            {/* Limited Time Offers */}
                                                            {message.metadata?.intent === "get_limited_time_offers" && (
                                                                <LimitedOffersCard offersData={message.data} />
                                                            )}

                                                            {/* Recent Purchases (Social Proof) */}
                                                            {message.metadata?.intent === "get_recent_purchases" && (
                                                                <RecentPurchasesNotif purchasesData={message.data} />
                                                            )}

                                                            {/* Trending Now */}
                                                            {message.metadata?.intent === "get_trending_now" && (
                                                                <TrendingProducts
                                                                    trendingData={message.data}
                                                                    onProductClick={handleProductClick}
                                                                />
                                                            )}

                                                            {/* Personalized Discount */}
                                                            {message.metadata?.intent === "generate_personalized_discount" && (
                                                                <PersonalizedDiscountCard discountData={message.data} />
                                                            )}

                                                            {/* Bundle Savings */}
                                                            {message.metadata?.intent === "calculate_bundle_savings" && (
                                                                <BundleSavingsCard bundleData={message.data} />
                                                            )}

                                                            {/* Abandoned Cart */}
                                                            {message.metadata?.intent === "get_abandoned_cart" && (
                                                                <AbandonedCartCard cartData={message.data} />
                                                            )}

                                                            {/* Cart Recovery Incentive */}
                                                            {message.metadata?.intent === "send_cart_recovery_incentive" && (
                                                                <CartRecoveryIncentive incentiveData={message.data} />
                                                            )}

                                                            {/* Upgrade Suggestions */}
                                                            {message.metadata?.intent === "get_upgrade_suggestions" && (
                                                                <UpgradeSuggestions
                                                                    upgradeData={message.data}
                                                                    onProductClick={handleProductClick}
                                                                />
                                                            )}

                                                            {/* Frequently Bought Together */}
                                                            {message.metadata?.intent === "get_frequently_bought_together" && (
                                                                <FrequentlyBoughtTogether
                                                                    fbtData={message.data}
                                                                    onProductClick={handleProductClick}
                                                                />
                                                            )}
                                                        </div>
                                                    )}
                                                </motion.div>
                                            );
                                        })}

                                        {isTyping && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-end gap-2"
                                            >
                                                <Avatar className="h-6 w-6 flex-shrink-0">
                                                    <AvatarFallback className="bg-black text-white text-[10px]">AI</AvatarFallback>
                                                </Avatar>
                                                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm">
                                                    <div className="flex space-x-1.5">
                                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                                        <div
                                                            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                                            style={{ animationDelay: "0.1s" }}
                                                        ></div>
                                                        <div
                                                            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                                            style={{ animationDelay: "0.2s" }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        <div ref={messagesEndRef} />
                                    </div>
                                </div>

                                {/* Suggestions */}
                                {messages.length === 0 && suggestions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="px-4 py-3 bg-white border-t border-gray-50"
                                    >
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Gợi ý</p>
                                        <div className="flex flex-wrap gap-2">
                                            {suggestions.map((suggestion: string, index: number) => (
                                                <Button
                                                    key={index}
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-7 text-xs rounded-full border-gray-200 text-gray-600 hover:bg-black hover:text-white hover:border-black transition-colors"
                                                >
                                                    {suggestion}
                                                </Button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Input Area */}
                                <div className="p-4 bg-white border-t border-gray-100">
                                    <div className="relative flex items-center">
                                        <Input
                                            ref={inputRef}
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Nhập tin nhắn..."
                                            className="pr-12 py-6 rounded-full border-gray-200 focus-visible:ring-black bg-gray-50 focus:bg-white transition-all"
                                            disabled={isLoading}
                                            autoFocus
                                        />
                                        <Button
                                            onClick={handleSendMessage}
                                            disabled={!inputMessage.trim() || isLoading}
                                            className="absolute right-1.5 h-9 w-9 rounded-full bg-black hover:bg-gray-800 text-white p-0 transition-transform active:scale-95"
                                            size="icon"
                                        >
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2 text-center">
                                        Được hỗ trợ bởi Google Gemini AI
                                    </p>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatWidget;
