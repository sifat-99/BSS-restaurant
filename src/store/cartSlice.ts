import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { CreateOrderAPI } from "../api/POST";
import { fetchOrders } from "./orderSlice";

export const placeOrder = createAsyncThunk(
  "cart/placeOrder",
  async ({ orderData, token }: { orderData: OrderData; token: string }, { dispatch, rejectWithValue }) => {
    try {
      const response = await CreateOrderAPI(orderData, token);
      dispatch(fetchOrders({ token })); // Refresh orders list
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data || "Failed to place order");
    }
  }
);

export interface FoodCartItem {
  id: string | number;
  name: string;
  price: number;
  discountPrice?: number;
  image?: string;
  quantity: number;
  totalPrice: number;
}

export interface SelectedTable {
  id: string | number;
  tableNumber?: string | number;
  phoneNumber?: string;
  booking?: { phoneNumber?: string };
}

export interface OrderData {
  tableId: string | number;
  orderNumber: string;
  amount: number;
  phoneNumber: string;
  items: Array<{
    foodId: string | number;
    foodPackageId: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

export interface CartState {
  selectedTable: SelectedTable | null;
  cartItems: FoodCartItem[];
  isCartOpen: boolean;
  customerPhone: string;
}

const initialState: CartState = {
  selectedTable: null,
  cartItems: [],
  isCartOpen: false,
  customerPhone: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setTable: (state, action: PayloadAction<SelectedTable | null>) => {
      state.selectedTable = action.payload;
    },
    clearTable: (state) => {
      state.selectedTable = null;
      state.cartItems = [];
    },
    addToCart: (state, action: PayloadAction<Omit<FoodCartItem, "quantity" | "totalPrice">>) => {
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
    removeFromCart: (state, action: PayloadAction<string | number>) => {
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
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isCartOpen = action.payload;
    },
    setCustomerPhone: (state, action: PayloadAction<string>) => {
      state.customerPhone = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(placeOrder.fulfilled, (state:any, action:any) => {
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
