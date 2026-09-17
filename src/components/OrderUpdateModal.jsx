import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Autocomplete,
  TextField,
  Avatar,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  RestaurantMenu,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { BACKEND_API } from "../api/API";
import { fetchFoods } from "../store/foodSlice";
import { updateOrder } from "../store/orderSlice";

const OrderUpdateModal = ({ open, onClose, order }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { foods } = useSelector((state) => state.food);

  const [editedItems, setEditedItems] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (token && foods.length === 0) {
      dispatch(fetchFoods({ token, perPage: 100 }));
    }
  }, [dispatch, token, foods.length]);

  useEffect(() => {
    if (order && order.orderItems) {
      setEditedItems(
        order.orderItems.map((item) => {
          const food = item.food || {};
          return {
            id: item.id || Math.random().toString(),
            foodId: item.foodId || food.id,
            name: food.name || food.foodName || "Unknown Item",
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || item.price || food.price || 0,
            image: food.image || food.foodImage,
          };
        }),
      );
    } else if (order && order.items) {
      setEditedItems(
        order.items.map((item) => {
          const food = item.food || {};
          return {
            id: item.id || Math.random().toString(),
            foodId: item.foodId || food.id || item.id,
            name: food.name || food.foodName || item.name || "Unknown Item",
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || item.price || food.price || 0,
            image: food.image || food.foodImage || item.image,
          };
        }),
      );
    } else {
      setEditedItems([]);
    }

    setPhoneNumber(order?.phoneNumber || order?.orderedBy?.phoneNumber || "");
  }, [order]);

  const handleAddFood = (event, selectedFood) => {
    if (!selectedFood) return;

    setEditedItems((prev) => {
      const existing = prev.find((item) => item.foodId === selectedFood.id);
      if (existing) {
        return prev.map((item) =>
          item.foodId === selectedFood.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prev,
        {
          id: Math.random().toString(),
          foodId: selectedFood.id,
          name: selectedFood.name,
          quantity: 1,
          unitPrice: selectedFood.discountPrice || selectedFood.price || 0,
          image: selectedFood.image,
        },
      ];
    });
  };

  const handleIncrement = (foodId) => {
    setEditedItems((prev) =>
      prev.map((item) =>
        item.foodId === foodId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const handleDecrement = (foodId) => {
    setEditedItems((prev) =>
      prev.map((item) =>
        item.foodId === foodId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  };

  const handleRemove = (foodId) => {
    setEditedItems((prev) => prev.filter((item) => item.foodId !== foodId));
  };

  const totalAmount = editedItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  const handleSave = () => {
    if (!order) return;

    const updatedData = {
      id: order.id,
      tableId: parseInt(order.tableId || order.table?.tableId || order.table?.id || 0, 10) || 0,
      orderNumber: order.orderNumber || order.ordernumber || `ORD-${order.id}`,
      amount: parseFloat(totalAmount) || 0,
      phoneNumber: phoneNumber || "",
      items: editedItems.map((item) => {
        const parsedItemId = parseInt(item.id, 10);
        return {
          id: isNaN(parsedItemId) ? 0 : parsedItemId,
          foodId: parseInt(item.foodId, 10) || 0,
          foodPackageId: 0,
          quantity: parseInt(item.quantity, 10) || 0,
          unitPrice: parseFloat(item.unitPrice) || 0,
          totalPrice: parseFloat(item.quantity * item.unitPrice) || 0,
        };
      }),
    };

    dispatch(updateOrder({ id: order.id, data: updatedData, token }));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Update Order #{order?.orderNumber}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <TextField
            label="Order Number"
            value={order?.orderNumber || ""}
            disabled
            size="small"
            sx={{ flex: 1, minWidth: 120 }}
          />
          <TextField
            label="Table Number"
            value={
              order?.table?.tableNumber ||
              order?.tableNumber ||
              order?.tablenumber ||
              "N/A"
            }
            disabled
            size="small"
            sx={{ flex: 1, minWidth: 120 }}
          />
          <TextField
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            size="small"
            placeholder="Optional"
            sx={{ flex: 2, minWidth: 150 }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Add More Items
          </Typography>
          <Autocomplete
            options={foods}
            getOptionLabel={(option) => option.name || ""}
            onChange={handleAddFood}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search and select food"
                size="small"
              />
            )}
            value={null}
          />
        </Box>

        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Current Items
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {editedItems.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={
                    item.image ? `${BACKEND_API}/images/food/${item.image}` : ""
                  }
                  sx={{ width: 40, height: 40 }}
                  variant="rounded"
                >
                  {!item.image && <RestaurantMenu />}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {item.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ৳{item.unitPrice}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => handleDecrement(item.foodId)}
                  disabled={item.quantity <= 1}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ width: 20, textAlign: "center" }}
                >
                  {item.quantity}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => handleIncrement(item.foodId)}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleRemove(item.foodId)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))}
          {editedItems.length === 0 && (
            <Typography variant="body2" color="text.secondary" align="center">
              No items in this order.
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight="bold">
          Total: ৳{totalAmount.toFixed(2)}
        </Typography>
        <Box>
          <Button onClick={onClose} color="inherit" sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save Changes
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default OrderUpdateModal;
