import { createSlice } from "@reduxjs/toolkit";
import { createPaymentUrl, getPaymentByOrder } from "./paymentAction";

interface PaymentState {
    paymentUrl: string | null;
    currentPayment: any | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: PaymentState = {
    paymentUrl: null,
    currentPayment: null,
    isLoading: false,
    error: null,
};

export const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        clearPaymentError: (state) => {
            state.error = null;
        },
        clearPaymentUrl: (state) => {
            state.paymentUrl = null;
        },
    },
    extraReducers: (builder) => {
        // Create Payment URL
        builder
            .addCase(createPaymentUrl.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createPaymentUrl.fulfilled, (state, action) => {
                state.isLoading = false;
                state.paymentUrl = action.payload.paymentUrl;
            })
            .addCase(createPaymentUrl.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Failed to create payment URL";
            });

        // Get Payment By Order
        builder
            .addCase(getPaymentByOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getPaymentByOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentPayment = action.payload;
            })
            .addCase(getPaymentByOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Failed to fetch payment details";
            });
    },
});

export const { clearPaymentError, clearPaymentUrl } = paymentSlice.actions;
export default paymentSlice.reducer;
