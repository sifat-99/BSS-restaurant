import { useState, useEffect, type ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Fab,
    Badge,
    Drawer,
    Box,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Button,
    TextField,
} from "@mui/material";
import {
    ShoppingCart as ShoppingCartIcon,
    Close as CloseIcon,
    Add as AddIcon,
    Remove as RemoveIcon,
    TableRestaurant as TableRestaurantIcon,
} from "@mui/icons-material";
import { useTheme, alpha } from "@mui/material/styles";
import {
    toggleCart,
    setCartOpen,
    addToCart,
    removeFromCart,
    clearTable,
    setCustomerPhone,
    placeOrder,
} from "../store/cartSlice";
import { BACKEND_API } from "../api/API";
import type { AppDispatch, RootState } from "../store/store";

interface CartItem {
    id: string | number;
    name: string;
    price: number;
    discountPrice?: number;
    image?: string;
    quantity: number;
    totalPrice: number;
}

interface SelectedTable {
    id: string | number;
    tableNumber?: string | number;
    phoneNumber?: string;
    booking?: { phoneNumber?: string };
}

interface CartState {
    cartItems: CartItem[];
    isCartOpen: boolean;
    selectedTable: SelectedTable | null;
    customerPhone: string;
}

const FloatingCart = () => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const { cartItems, isCartOpen, selectedTable, customerPhone } = useSelector(
        (state: RootState) => state.cart as unknown as CartState,
    );
    const token = useSelector((state: RootState) => state.auth.token) ?? "";

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

    const [phoneError, setPhoneError] = useState("");

    useEffect(() => {
        if (selectedTable) {
            dispatch(
                setCustomerPhone(
                    selectedTable.phoneNumber ||
                    selectedTable?.booking?.phoneNumber ||
                    "",
                ),
            );
        }
    }, [selectedTable, dispatch]);

    const handleSubmitOrder = () => {
        if (!/^\+?[0-9]{11}$/.test(customerPhone)) {
            setPhoneError("Please enter a valid 11-digit phone number");
            return;
        }

        const orderObject = {
            tableId: selectedTable?.id || 0,
            orderNumber: "ORD-" + Math.floor(1000 + Math.random() * 9000),
            amount: totalPrice,
            phoneNumber: customerPhone,
            items: cartItems.map((item) => ({
                foodId: item.id,
                foodPackageId: 0,
                quantity: item.quantity,
                unitPrice: item.discountPrice || item.price,
                totalPrice: item.totalPrice,
            })),
        };

        dispatch(placeOrder({ orderData: orderObject, token }));
    };

    return (
        <>
            {/* Floating Action Button */}
            {selectedTable && (
                <Fab
                    color="primary"
                    aria-label="cart"
                    onClick={() => dispatch(toggleCart())}
                    sx={{
                        position: "fixed",
                        right: 24,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 1000,
                        width: 64,
                        height: 64,
                        boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
                        "&:hover": {
                            transform: "translateY(-50%) scale(1.05)",
                        },
                        transition: "transform 0.2s ease-in-out",
                    }}
                >
                    <Badge
                        badgeContent={totalItems}
                        color="error"
                        sx={{
                            "& .MuiBadge-badge": {
                                fontSize: "1rem",
                                height: 24,
                                minWidth: 24,
                                borderRadius: 12,
                            },
                        }}
                    >
                        <ShoppingCartIcon sx={{ fontSize: 32 }} />
                    </Badge>
                </Fab>
            )}

            {/* Cart Drawer */}
            <Drawer
                anchor="right"
                open={isCartOpen}
                onClose={() => dispatch(setCartOpen(false))}
                slotProps={{
                    paper: {
                        sx: {
                            width: { xs: "100%", sm: 400 },
                            height: "96vh",
                            bgcolor: "background.default",
                            display: "flex",
                            flexDirection: "column",
                        },
                    },
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        p: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        bgcolor: "background.paper",
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                            <ShoppingCartIcon />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Current Order
                        </Typography>
                    </Box>
                    <IconButton onClick={() => dispatch(setCartOpen(false))}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Selected Table Info */}
                {selectedTable && (
                    <Box
                        sx={{
                            px: 3,
                            py: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <TableRestaurantIcon color="primary" />
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                Table {selectedTable.tableNumber || selectedTable.id}
                            </Typography>
                        </Box>
                        <Button
                            size="small"
                            color="error"
                            onClick={() => dispatch(clearTable())}
                            sx={{ textTransform: "none", fontWeight: "bold" }}
                        >
                            Clear Table
                        </Button>
                    </Box>
                )}

                <Divider />

                {/* Cart Items List */}
                <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
                    {cartItems.length === 0 ? (
                        <Box
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "text.secondary",
                                opacity: 0.7,
                            }}
                        >
                            <ShoppingCartIcon sx={{ fontSize: 64, mb: 2 }} />
                            <Typography variant="h6">Your cart is empty</Typography>
                            <Typography variant="body2">
                                Add some foods from the menu
                            </Typography>
                        </Box>
                    ) : (
                        <List sx={{ pt: 0 }}>
                            {cartItems.map((item) => (
                                <ListItem
                                    key={item.id}
                                    sx={{
                                        bgcolor: "background.paper",
                                        mb: 2,
                                        borderRadius: 2,
                                        boxShadow: `0 2px 8px ${alpha(
                                            theme.palette.common.black,
                                            0.05,
                                        )}`,
                                        px: 2,
                                        py: 1.5,
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            src={
                                                item.image
                                                    ? `${BACKEND_API}/images/food/${item.image}`
                                                    : ""
                                            }
                                            variant="rounded"
                                            sx={{ width: 56, height: 56, mr: 1 }}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }} noWrap>
                                                {item.name}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography
                                                variant="body2"
                                                color="primary.main"
                                                sx={{ fontWeight: "bold" }}
                                            >
                                                ৳{item.discountPrice || item.price}
                                            </Typography>
                                        }
                                    />
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            bgcolor: alpha(theme.palette.divider, 0.1),
                                            borderRadius: 8,
                                        }}
                                    >
                                        <IconButton
                                            size="small"
                                            onClick={() => dispatch(removeFromCart(item.id))}
                                            color="error"
                                        >
                                            <RemoveIcon fontSize="small" />
                                        </IconButton>
                                        <Typography
                                            sx={{
                                                minWidth: 24,
                                                textAlign: "center",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {item.quantity}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={() => dispatch(addToCart(item))}
                                            color="primary"
                                        >
                                            <AddIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>

                {/* Footer / Checkout */}
                <Box
                    sx={{
                        p: 3,
                        bgcolor: "background.paper",
                        borderTop: `1px solid ${theme.palette.divider}`,
                        boxShadow: `0 -4px 16px ${alpha(theme.palette.common.black, 0.05)}`,
                    }}
                >
                    <TextField
                        label="Phone Number"
                        variant="outlined"
                        fullWidth
                        value={customerPhone}
                        error={!!phoneError}
                        helperText={phoneError}
                        sx={{
                            mb: 2,
                            "& .MuiInputBase-root": {
                                borderRadius: 2,
                            },
                        }}
                        placeholder={
                            selectedTable?.phoneNumber ||
                            selectedTable?.booking?.phoneNumber ||
                            "Enter phone number (Optional)"
                        }
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            dispatch(setCustomerPhone(e.target.value));
                            if (phoneError) setPhoneError("");
                        }}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 2,
                        }}
                    >
                        <Typography variant="h6" color="text.secondary">
                            Total Amount
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }} color="primary.main">
                            ৳{totalPrice.toFixed(2)}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        onClick={handleSubmitOrder}
                        disabled={cartItems.length === 0}
                        sx={{
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                        }}
                    >
                        Place Order
                    </Button>
                </Box>
            </Drawer>
        </>
    );
};

export default FloatingCart;
