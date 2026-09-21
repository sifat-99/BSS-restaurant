import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Box,
    Typography,
    Grid,
    useMediaQuery,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Avatar,
    Chip,
    IconButton,
    Badge,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    InputAdornment,
} from "@mui/material";
import {
    TableRestaurant,
    RestaurantMenu,
    AddShoppingCart,
    Search,
} from "@mui/icons-material";
import { useTheme, alpha } from "@mui/material/styles";
import { fetchOrderTables } from "../store/tableSlice";
import { fetchFoods } from "../store/foodSlice";
import { setTable, addToCart } from "../store/cartSlice";
import { BACKEND_API } from "../api/API";
import FloatingCart from "./FloatingCart";

const OrderPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
    const dispatch = useDispatch();

    const token = useSelector((state) => state.auth.token);
    const [searchQuery, setSearchQuery] = useState("");
    const {
        orderTables: tables,
        orderTableLoading: tableLoading,
        orderTablePage: tablePage,
        orderTableLastPage: tableLastPage,
    } = useSelector((state) => state.table);
    const { foods, loading: foodLoading } = useSelector((state) => state.food);
    const { selectedTable, cartItems } = useSelector((state) => state.cart);

    useEffect(() => {
        if (token) {
            // Ensure we have initial data (5 tables)
            dispatch(fetchOrderTables({ token, page: 1, perPage: 5 }));
            dispatch(fetchFoods({ token, perPage: 100 }));
        }
    }, [dispatch, token]);

    const handleTableScroll = (e) => {
        const {
            scrollHeight,
            scrollTop,
            clientHeight,
            scrollWidth,
            scrollLeft,
            clientWidth,
        } = e.target;
        const isBottom = scrollHeight - scrollTop <= clientHeight + 10;
        const isRight = scrollWidth - scrollLeft <= clientWidth + 10;

        if (isBottom || isRight) {
            if (!tableLoading && tablePage < tableLastPage) {
                dispatch(
                    fetchOrderTables({
                        token,
                        page: tablePage + 1,
                        perPage: 5,
                        isLoadMore: true,
                    }),
                );
            }
        }
    };

    const handleSelectTable = (table) => {
        dispatch(setTable(table));
    };

    const handleAddFood = (food) => {
        dispatch(addToCart(food));
    };

    const filteredFoods = foods.filter((food) =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Spinning keyframes
    const spinKeyframes = `
    @keyframes slowSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes reverseSpin {
      from { transform: translate(-50%, -50%) rotate(360deg); }
      to { transform: translate(-50%, -50%) rotate(0deg); }
    }
  `;

    return (
        <Box
            sx={{
                p: { xs: 2, md: 4 },
                height: "calc(100vh - 120px)",
                overflow: "hidden",
                position: "relative",
            }}
        >
            <style>{spinKeyframes}</style>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", lg: "row" },
                    gap: 3,
                    height: "100%",
                }}
            >
                {/* Left Column: Persistent Table List */}
                <Box
                    sx={{
                        width: { xs: "100%", lg: "20%" },
                        height: { xs: "auto", lg: "100%" },
                        flexShrink: 0,
                    }}
                >
                    <Box
                        sx={{
                            height: "100%",
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            bgcolor: "background.paper",
                            borderRadius: 4,
                            boxShadow: theme.shadows[3],
                            p: 2,
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                                mb: {
                                    xs: 1,
                                    lg: 2,
                                },
                                color: "text.secondary",
                                flexShrink: 0,
                            }}
                        >
                            Select Table
                        </Typography>
                        <Box
                            onScroll={handleTableScroll}
                            sx={{
                                flexGrow: 1,
                                overflowY: { xs: "hidden", lg: "auto" },
                                overflowX: { xs: "auto", lg: "hidden" },
                                display: "flex",
                                flexDirection: { xs: "row", lg: "column" },
                                gap: 2,
                                pr: { lg: 1 },
                                pb: { xs: 1, lg: 0 },
                                "&::-webkit-scrollbar": { width: 6, height: 6 },
                                "&::-webkit-scrollbar-thumb": {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.3),
                                    borderRadius: 4,
                                },
                            }}
                        >
                            {tables.map((table) => (
                                <Card
                                    key={table.id}
                                    elevation={selectedTable?.id === table.id ? 8 : 2}
                                    sx={{
                                        flexShrink: 0,
                                        borderRadius: 3,
                                        minHeight: { xs: "100px", lg: "140px" },
                                        minWidth: { xs: "100px", lg: "auto" },
                                        border:
                                            selectedTable?.id === table.id
                                                ? `2px solid ${theme.palette.primary.main}`
                                                : "2px solid transparent",
                                        transition: "transform 0.2s",
                                        "&:hover": { transform: "translateY(-4px)" },
                                    }}
                                >
                                    <CardActionArea
                                        onClick={() => handleSelectTable(table)}
                                        sx={{
                                            p: 2,
                                            textAlign: "center",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "flex-start",
                                            flexDirection: "column",
                                            height: "100%",
                                            gap: 2,
                                        }}
                                        disabled={table.isOccupied}
                                        style={{
                                            cursor: table.isOccupied ? "not-allowed" : "pointer",
                                            filter: table.isOccupied ? "grayscale(100%)" : "none",
                                        }}
                                    >
                                        <Avatar
                                            src={
                                                table.image
                                                    ? `${BACKEND_API}/images/table/${table.image}`
                                                    : ""
                                            }
                                            sx={{
                                                width: { xs: 50, lg: 100 },
                                                height: { xs: 50, lg: 100 },
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                color: "primary.main",
                                            }}
                                        >
                                            {!table.image && (
                                                <TableRestaurant sx={{ fontSize: 24 }} />
                                            )}
                                        </Avatar>
                                        <Box sx={{ textAlign: "left" }}>
                                            <Typography
                                                variant="subtitle2"
                                                fontWeight="bold"
                                                sx={{ fontSize: { xs: "0.75rem", lg: "0.875rem" } }}
                                            >
                                                Table {table.tableNumber || table.id}
                                            </Typography>
                                            <Chip
                                                label={table.isOccupied ? "Occupied" : "Available"}
                                                color={table.isOccupied ? "error" : "success"}
                                                size="small"
                                                sx={{
                                                    mt: 0.5,
                                                    fontWeight: "bold",
                                                    fontSize: "0.6rem",
                                                    height: 18,
                                                }}
                                            />
                                        </Box>
                                    </CardActionArea>
                                </Card>
                            ))}
                            {tableLoading && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        p: 2,
                                    }}
                                >
                                    <CircularProgress size={30} />
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* Right Column: Order Area */}
                <Box
                    sx={{
                        width: { xs: "100%", lg: "80%" },
                        flexGrow: 1,
                        minHeight: 0,
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box
                        sx={{
                            flexGrow: 1,
                            minHeight: 0,
                            display: "flex",
                            flexDirection: "column",
                            pr: { xs: 0, lg: 1 },
                            pb: { xs: 1, lg: 2 },
                        }}
                    >
                        {!selectedTable ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100%",
                                    width: "100%",
                                }}
                            >
                                <TableRestaurant
                                    sx={{
                                        fontSize: 80,
                                        color: "text.secondary",
                                        opacity: 0.2,
                                        mb: 2,
                                    }}
                                />
                                <Typography
                                    variant="h5"
                                    fontWeight="bold"
                                    sx={{ color: "text.secondary" }}
                                >
                                    Please Select a Table from the Sidebar
                                </Typography>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                    flexGrow: 1,
                                    minHeight: 0,
                                    overflow: "hidden",
                                }}
                            >
                                {/* Top Section: Spinning Table */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        mb: { xs: 1, lg: 4 },
                                        height: { xs: 200, lg: 350 },
                                        flexShrink: 0,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: "relative",
                                            width: { xs: 180, lg: 300 },
                                            height: { xs: 180, lg: 300 },
                                            borderRadius: "50%",
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            // backgroundImage: selectedTable.image
                                            //   ? `url(${BACKEND_API}/images/table/${selectedTable.image})`
                                            //   : "none",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            border: `4px dashed ${theme.palette.primary.main}`,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            animation: "slowSpin 20s linear infinite",
                                        }}
                                    >
                                        {selectedTable.image && (
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    borderRadius: "50%",
                                                    bgcolor: "transparent",
                                                    zIndex: 0,
                                                }}
                                            />
                                        )}
                                        {/* Center Table Name */}
                                        <Typography
                                            variant="h5"
                                            fontWeight="bold"
                                            color="primary.main"
                                            sx={{
                                                animation: "slowSpin 20s linear infinite reverse",
                                                zIndex: 1,
                                            }}
                                        >
                                            Table {selectedTable.tableNumber || selectedTable.id}
                                        </Typography>

                                        {/* Orbiting Foods */}
                                        {cartItems.map((item, index) => {
                                            const angle = (index / cartItems.length) * 360;
                                            const radius = isMobile ? 55 : 95; // Inside the table
                                            const x = radius * Math.cos((angle * Math.PI) / 180);
                                            const y = radius * Math.sin((angle * Math.PI) / 180);

                                            return (
                                                <Badge
                                                    key={item.id}
                                                    badgeContent={item.quantity}
                                                    color="error"
                                                    overlap="circular"
                                                    sx={{
                                                        position: "absolute",
                                                        left: `calc(50% + ${x}px)`,
                                                        top: `calc(50% + ${y}px)`,
                                                        transform: "translate(-50%, -50%)",
                                                        animation: "reverseSpin 20s linear infinite",
                                                        zIndex: 99,
                                                    }}
                                                >
                                                    <Avatar
                                                        src={
                                                            item.image
                                                                ? `${BACKEND_API}/images/food/${item.image}`
                                                                : ""
                                                        }
                                                        sx={{
                                                            width: { xs: 36, lg: 56 },
                                                            height: { xs: 36, lg: 56 },
                                                            boxShadow: theme.shadows[6],
                                                            border: `3px solid ${theme.palette.background.paper}`,
                                                        }}
                                                    >
                                                        {!item.image && <RestaurantMenu />}
                                                    </Avatar>
                                                </Badge>
                                            );
                                        })}
                                    </Box>
                                </Box>

                                {/* Bottom Section: Food Menu */}
                                <Box
                                    sx={{
                                        flexGrow: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        overflow: "hidden",
                                        marginTop: {
                                            xs: "-40px",
                                            lg: "-80px",
                                        },
                                        marginBottom: {
                                            xs: "-30px",
                                            lg: "-30px",
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            mb: 3,
                                            pl: 1,
                                            pr: 1,
                                            flexShrink: 0,
                                            flexWrap: "wrap",
                                            gap: 2,
                                        }}
                                    >
                                        <Typography variant="h5" fontWeight="bold">
                                            Food Menu
                                        </Typography>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            placeholder="Search foods..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            sx={{
                                                width: { xs: "100%", sm: "300px" },
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 3,
                                                    bgcolor: alpha(theme.palette.background.paper, 0.8),
                                                },
                                            }}
                                            slotProps={{
                                                input: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Search color="action" />
                                                        </InputAdornment>
                                                    ),
                                                },
                                            }}
                                        />
                                    </Box>

                                    {foodLoading ? (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                flexGrow: 1,
                                                minHeight: 200,
                                            }}
                                        >
                                            <CircularProgress size={40} />
                                        </Box>
                                    ) : (
                                        <TableContainer
                                            component={Paper}
                                            elevation={2}
                                            sx={{
                                                borderRadius: 4,
                                                mb: 4,
                                                flexGrow: 1,
                                                overflowY: "auto",
                                            }}
                                        >
                                            <Table
                                                sx={{ minWidth: 500 }}
                                                aria-label="food menu table"
                                            >
                                                <TableHead
                                                    sx={{
                                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                    }}
                                                >
                                                    <TableRow>
                                                        <TableCell>Item</TableCell>
                                                        <TableCell>Description</TableCell>
                                                        <TableCell align="right">Price</TableCell>
                                                        <TableCell align="center">Action</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {filteredFoods.map((food) => (
                                                        <TableRow
                                                            hover
                                                            key={food.id}
                                                            sx={{
                                                                "&:last-child td, &:last-child th": {
                                                                    border: 0,
                                                                },
                                                                "&:hover": {
                                                                    bgcolor: alpha(
                                                                        theme.palette.primary.main,
                                                                        0.04,
                                                                    ),
                                                                },
                                                            }}
                                                        >
                                                            <TableCell component="th" scope="row">
                                                                <Box
                                                                    sx={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: 2,
                                                                    }}
                                                                >
                                                                    <Avatar
                                                                        variant="rounded"
                                                                        src={
                                                                            food.image
                                                                                ? `${BACKEND_API}/images/food/${food.image}`
                                                                                : ""
                                                                        }
                                                                        sx={{
                                                                            width: 60,
                                                                            height: 60,
                                                                            bgcolor: alpha(
                                                                                theme.palette.secondary.main,
                                                                                0.1,
                                                                            ),
                                                                        }}
                                                                    >
                                                                        {!food.image && (
                                                                            <RestaurantMenu
                                                                                sx={{ color: "secondary.main" }}
                                                                            />
                                                                        )}
                                                                    </Avatar>
                                                                    <Box>
                                                                        <Typography
                                                                            variant="subtitle1"
                                                                            fontWeight="bold"
                                                                        >
                                                                            {food.name}
                                                                        </Typography>
                                                                        {food.discount > 0 && (
                                                                            <Chip
                                                                                label={
                                                                                    food.discountType === "Percentage"
                                                                                        ? `${food.discount}% OFF`
                                                                                        : `৳${food.discount} OFF`
                                                                                }
                                                                                color="error"
                                                                                size="small"
                                                                                sx={{
                                                                                    fontWeight: "bold",
                                                                                    height: 20,
                                                                                    fontSize: "0.65rem",
                                                                                    mt: 0.5,
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </Box>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                    sx={{
                                                                        display: "-webkit-box",
                                                                        WebkitLineClamp: 2,
                                                                        WebkitBoxOrient: "vertical",
                                                                        overflow: "hidden",
                                                                        maxWidth: 250,
                                                                    }}
                                                                >
                                                                    {food.description || "No description"}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                {food.discount > 0 ? (
                                                                    <Box>
                                                                        <Typography
                                                                            variant="body2"
                                                                            color="text.secondary"
                                                                            sx={{
                                                                                textDecoration: "line-through",
                                                                                fontSize: "0.8rem",
                                                                            }}
                                                                        >
                                                                            ৳{food.price}
                                                                        </Typography>
                                                                        <Typography
                                                                            variant="subtitle1"
                                                                            color="primary.main"
                                                                            fontWeight="bold"
                                                                        >
                                                                            ৳{food.discountPrice || food.price}
                                                                        </Typography>
                                                                    </Box>
                                                                ) : (
                                                                    <Typography
                                                                        variant="subtitle1"
                                                                        color="primary.main"
                                                                        fontWeight="bold"
                                                                    >
                                                                        ৳{food.price}
                                                                    </Typography>
                                                                )}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <IconButton
                                                                    color="primary"
                                                                    onClick={() => handleAddFood(food)}
                                                                    sx={{
                                                                        bgcolor: alpha(
                                                                            theme.palette.primary.main,
                                                                            0.1,
                                                                        ),
                                                                    }}
                                                                >
                                                                    <AddShoppingCart />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Right Middle Floating Cart */}
            <FloatingCart />
        </Box>
    );
};

export default OrderPage;
