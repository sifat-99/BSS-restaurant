import { createSlice } from "@reduxjs/toolkit";

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
    placeOrder: (state, action) => {
      console.log("Submitting Order via Redux:", action.payload);
      // Clear the cart after placing the order
      state.cartItems = [];
      state.customerPhone = "";
      state.isCartOpen = false;
    },
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
  placeOrder,
} = cartSlice.actions;

export default cartSlice.reducer;
