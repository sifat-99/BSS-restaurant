import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CreateOrderAPI } from "../api/POST";
import { fetchOrders } from "./orderSlice";

export const placeOrder = createAsyncThunk(
  "cart/placeOrder",
  async ({ orderData, token }, { dispatch, rejectWithValue }) => {
    try {
      const response = await CreateOrderAPI(orderData, token);
      dispatch(fetchOrders({ token })); // Refresh orders list
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to place order");
    }
  }
);

const initialState = {
  selectedTable: null,
  cartItems: [],
  isCartOpen: false,
  customerPhone: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setTable: (state, action) => {
      state.selectedTable = action.payload;
    },
    clearTable: (state) => {
      state.selectedTable = null;
      state.cartItems = [];
    },
    addToCart: (state, action) => {
      const food = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === food.id);

      const priceToUse = food.discountPrice || food.price;

      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.totalPrice = existingItem.quantity * priceToUse;
      } else {
        state.cartItems.push({
          ...food,
          quantity: 1,
          totalPrice: priceToUse,
        });
      }
    },
    removeFromCart: (state, action) => {
      const foodId = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === foodId);

      if (existingItem) {
        const priceToUse = existingItem.discountPrice || existingItem.price;
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
          existingItem.totalPrice = existingItem.quantity * priceToUse;
        } else {
          state.cartItems = state.cartItems.filter((item) => item.id !== foodId);
        }
      }
    },
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    setCartOpen: (state, action) => {
      state.isCartOpen = action.payload;
    },
    setCustomerPhone: (state, action) => {
      state.customerPhone = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(placeOrder.fulfilled, (state, action) => {
      console.log("Order submitted successfully:", action.payload);
      state.cartItems = [];
      state.customerPhone = "";
      state.isCartOpen = false;
    });
  },
});

export const {
  setTable,
  clearTable,
  addToCart,
  removeFromCart,
  toggleCart,
  setCartOpen,
  setCustomerPhone,
} = cartSlice.actions;

export default cartSlice.reducer;
