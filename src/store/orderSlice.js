import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetAllOrdersDataTableApi } from "../api/GET";
import { UpdateOrdersByIdAPI, UpdateOrderStatusAPI } from "../api/PUT";
import { DeleteOrdersByIdAPI } from "../api/DELETE";

export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async ({ token, page = 1, perPage = 12, search = "", sort = "-createdat", status = "" }, { rejectWithValue }) => {
    try {
      const response = await GetAllOrdersDataTableApi(token, page, perPage, search, sort, status);

      let data = [];
      let totalPages = 1;
      const responseData = response.data;

      if (responseData && responseData.data) {
        data = responseData.data;
        totalPages = responseData.last_page || responseData.totalPages || Math.ceil((responseData.total || 0) / perPage) || 1;
      } else if (Array.isArray(responseData)) {
        data = responseData;
        totalPages = 1;
      }

      return { data, totalPages, page, perPage, search, sort, status };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders.");
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ id, status, token }, { dispatch, getState, rejectWithValue }) => {
    try {
      await UpdateOrderStatusAPI(id, { status: status.toString() }, token);

      // Re-fetch orders after successful update to reflect changes globally
      const { page, perPage, search, sort, status: filterStatus } = getState().order;
      dispatch(fetchOrders({ token, page, perPage, search, sort, status: filterStatus }));

      return { id, status };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update order status.");
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async ({ id, token }, { dispatch, getState, rejectWithValue }) => {
    try {
      await DeleteOrdersByIdAPI(id, token);

      const { page, perPage, search, sort, status } = getState().order;
      dispatch(fetchOrders({ token, page, perPage, search, sort, status }));

      return { id };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete order.");
    }
  }
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ id, data, token }, { dispatch, getState, rejectWithValue }) => {
    try {
      await UpdateOrdersByIdAPI(id, data, token);

      const { page, perPage, search, sort, status: filterStatus } = getState().order;
      dispatch(fetchOrders({ token, page, perPage, search, sort, status: filterStatus }));

      return { id, status };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update order status.");
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    loading: false,
    error: null,
    page: 1,
    perPage: 12,
    totalPages: 1,
    search: "",
    sort: "createdat",
    status: "",
  },
  reducers: {
    setOrderFilters: (state, action) => {
      if (action.payload.page !== undefined) state.page = action.payload.page;
      if (action.payload.perPage !== undefined) state.perPage = action.payload.perPage;
      if (action.payload.search !== undefined) state.search = action.payload.search;
      if (action.payload.sort !== undefined) state.sort = action.payload.sort;
      if (action.payload.status !== undefined) state.status = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.page = action.payload.page;
        state.perPage = action.payload.perPage;
        state.search = action.payload.search;
        state.sort = action.payload.sort;
        state.status = action.payload.status;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch orders";
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter((order) => order.id !== action.payload.id);
        state.totalPages = Math.max(1, Math.ceil((state.orders.length || 0) / state.perPage));
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete order.";
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map((order) =>
          order.id === action.payload.id ? { ...order, ...action.payload } : order
        );
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update order.";
      });
  },
});

export const { setOrderFilters } = orderSlice.actions;
export default orderSlice.reducer;
