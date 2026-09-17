import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  CircularProgress,
  IconButton,
  TablePagination,
  TextField,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Menu,
  Chip,
  Divider,
} from "@mui/material";
import {
  Search,
  Receipt,
  SyncAlt,
  Edit,
  Delete,
  RestaurantMenu,
} from "@mui/icons-material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  deleteOrder,
  fetchOrders,
  setOrderFilters,
  updateOrderStatus,
} from "../store/orderSlice";
import { BACKEND_API } from "../api/API";
import OrderUpdateModal from "./OrderUpdateModal";

const STATUS_OPTIONS = [
  { value: 0, label: "Pending", color: "warning", acronym: "Pending" },
  { value: 1, label: "Confirmed", color: "info", acronym: "Confirmed" },
  { value: 2, label: "Preparing", color: "secondary", acronym: "Preparing" },
  {
    value: 3,
    label: "Prepared to Serve",
    color: "primary",
    acronym: "Prepared to Serve",
  },
  { value: 4, label: "Served", color: "success", acronym: "Served" },
  { value: 5, label: "Paid", color: "success", acronym: "Paid" },
];

const getStatusInfo = (status) => {
  if (typeof status === "string") {
    const found = STATUS_OPTIONS.find(
      (s) =>
        s.label.replace(/\s/g, "").toLowerCase() ===
        status.replace(/\s/g, "").toLowerCase(),
    );
    return found || { label: status, color: "default", acronym: "UNK" };
  }
  return (
    STATUS_OPTIONS.find((s) => s.value === status) || {
      label: "Unknown",
      color: "default",
      acronym: "UNK",
    }
  );
};

const Orders = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const { orders, loading, page, perPage, totalCount, search, sort, status } =
    useSelector((state) => state.order);

  const [localSearch, setLocalSearch] = useState(search);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const handleEditClick = (order) => {
    setOrderToEdit(order);
    setEditModalOpen(true);
  };

  const handleStatusClick = (event, orderId) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrderId(orderId);
  };

  const handleStatusClose = () => {
    setAnchorEl(null);
    setSelectedOrderId(null);
  };

  const handleStatusSelect = (newStatus) => {
    if (selectedOrderId) {
      dispatch(
        updateOrderStatus({ id: selectedOrderId, status: newStatus, token }),
      );
    }
    handleStatusClose();
  };

  // Handle Debounced Search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== search) {
        dispatch(setOrderFilters({ search: localSearch, page: 1 }));
        if (token) {
          dispatch(
            fetchOrders({
              token,
              page: 1,
              perPage,
              search: localSearch,
              sort,
              status,
            }),
          );
        }
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [localSearch, search, dispatch, token, perPage, sort, status]);

  // Initial Fetch
  useEffect(() => {
    if (token && orders.length === 0 && !loading) {
      dispatch(fetchOrders({ token, page, perPage, search, sort, status }));
    }
  }, [dispatch, token]);

  const handleChangePage = (event, newPage) => {
    dispatch(setOrderFilters({ page: newPage + 1 }));
    dispatch(
      fetchOrders({ token, page: newPage + 1, perPage, search, sort, status }),
    );
  };

  const handleChangeRowsPerPage = (event) => {
    const newPerPage = parseInt(event.target.value, 10);
    dispatch(setOrderFilters({ perPage: newPerPage, page: 1 }));
    dispatch(
      fetchOrders({
        token,
        page: 1,
        perPage: newPerPage,
        search,
        sort,
        status,
      }),
    );
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    dispatch(setOrderFilters({ status: newStatus, page: 1 }));
    dispatch(
      fetchOrders({ token, page: 1, perPage, search, sort, status: newStatus }),
    );
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    dispatch(setOrderFilters({ sort: newSort, page: 1 }));
    dispatch(
      fetchOrders({ token, page: 1, perPage, search, sort: newSort, status }),
    );
  };

  const handleOrderDelete = (orderId) => {
    setOrderToDelete(orderId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (orderToDelete) {
      dispatch(deleteOrder({ id: orderToDelete, token }));
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
          mb: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          p: { xs: 2, sm: 3 },
          borderRadius: 4,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{ bgcolor: theme.palette.primary.main, width: 56, height: 56 }}
          >
            <Receipt fontSize="large" />
          </Avatar>
          <Box>
            <Typography
              variant="h4"
              sx={{ typography: { xs: "h5", sm: "h4" } }}
              fontWeight="bold"
              color="primary.main"
            >
              Orders Management
            </Typography>
            <Typography
              variant="body1"
              sx={{ typography: { xs: "body2", sm: "body1" } }}
              color="text.secondary"
            >
              Manage and track customer orders.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: { xs: "stretch", sm: "center" },
            width: { xs: "100%", md: "auto" },
          }}
        >
          <TextField
            size="small"
            placeholder="Search orders..."
            variant="outlined"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            sx={{ bgcolor: "background.paper", borderRadius: 1 }}
          />

          <FormControl
            size="small"
            sx={{ minWidth: 150, bgcolor: "background.paper" }}
          >
            <InputLabel>Status</InputLabel>
            <Select value={status} label="Status" onChange={handleStatusChange}>
              <MenuItem value="">All Statuses</MenuItem>
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            size="small"
            sx={{ minWidth: 150, bgcolor: "background.paper" }}
          >
            <InputLabel>Sort By</InputLabel>
            <Select value={sort} label="Sort By" onChange={handleSortChange}>
              <MenuItem value="-createdat">Newest First</MenuItem>
              <MenuItem value="createdat">Oldest First</MenuItem>
              <MenuItem value="-amount">Amount (High to Low)</MenuItem>
              <MenuItem value="amount">Amount (Low to High)</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: "auto", pb: 2, pr: 1 }}>
        {loading && orders.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : orders.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              flexDirection: "column",
              color: "text.secondary",
              py: 10,
            }}
          >
            <Receipt sx={{ fontSize: 80, opacity: 0.2, mb: 2 }} />
            <Typography variant="h6">No orders found.</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {orders.map((order) => {
              const statusInfo = getStatusInfo(
                order.orderStatus || order.status,
              );
              const items =
                order.orderItems || order.orderDetails || order.items || [];
              const totalQuantity =
                items.reduce((sum, item) => sum + (item.quantity || 1), 0) ||
                order.totalQuantity ||
                items.length ||
                0;

              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  key={
                    order.id ||
                    order.orderNumber ||
                    order.ordernumber ||
                    Math.random()
                  }
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "auto",
                  }}
                >
                  <Card
                    elevation={2}
                    sx={{
                      borderRadius: 3,
                      border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                      height: "400px",
                      width: { xs: "100%", sm: "400px" },
                      maxWidth: "100%",
                      display: "flex",
                      flexDirection: "column",
                      bgcolor: "background.paper",
                      transition:
                        "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out",
                      "&:hover": {
                        boxShadow: theme.shadows[8],
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                      },
                    }}
                  >
                    {/* Header */}
                    <Box
                      sx={{
                        p: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {order.orderNumber || order.ordernumber || "N/A"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.orderTime ||
                          order.orderdate ||
                          order.createdAt ||
                          order.createdat
                            ? new Date(
                                order.orderTime ||
                                  order.orderdate ||
                                  order.createdAt ||
                                  order.createdat,
                              ).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                              })
                            : "N/A"}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          sx={{
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 2,
                            transition: "all 0.2s",
                            "&:hover": {
                              bgcolor: alpha(theme.palette.info.main, 0.1),
                              color: theme.palette.info.main,
                              borderColor: theme.palette.info.main,
                            },
                          }}
                          onClick={(e) =>
                            handleStatusClick(
                              e,
                              order.id ||
                                order.orderNumber ||
                                order.ordernumber,
                            )
                          }
                        >
                          <SyncAlt fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(order)}
                          disabled={order.orderStatus === "Paid"}
                          sx={{
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 2,
                            transition: "all 0.2s",
                            "&:hover": {
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              borderColor: theme.palette.primary.main,
                            },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleOrderDelete(order.id)}
                          sx={{
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 2,
                            transition: "all 0.2s",
                            "&:hover": {
                              bgcolor: alpha(theme.palette.error.main, 0.1),
                              color: theme.palette.error.main,
                              borderColor: theme.palette.error.main,
                            },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    <Divider />

                    {/* Items Body */}
                    <Box
                      sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        flexGrow: 1,
                        overflowY: "auto",
                        maxHeight: 250,
                        "&::-webkit-scrollbar": { display: "none" },
                        msOverflowStyle: "none",
                        scrollbarWidth: "none",
                      }}
                    >
                      {items.length > 0 ? (
                        items.map((item, index) => {
                          const food = item.food || item;
                          return (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                borderBottom:
                                  "1px solid " + theme.palette.divider,
                                pb: 1,
                              }}
                            >
                              <Avatar
                                variant="rounded"
                                src={
                                  food.image || food.foodImage
                                    ? `${BACKEND_API}/images/food/${food.image || food.foodImage}`
                                    : ""
                                }
                                sx={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: 2,
                                  bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.1,
                                  ),
                                }}
                              >
                                {!(food.image || food.foodImage) && (
                                  <RestaurantMenu
                                    sx={{ color: "primary.main" }}
                                  />
                                )}
                              </Avatar>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography
                                  variant="body1"
                                  fontWeight="bold"
                                  sx={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                  }}
                                >
                                  {food.name || food.foodName || "Unknown Item"}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {item.unitPrice || item.price || 0} ৳
                                </Typography>
                              </Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                fontWeight="bold"
                              >
                                QTY. {item.quantity || 1}
                              </Typography>
                            </Box>
                          );
                        })
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            color: "text.secondary",
                            py: 4,
                          }}
                        >
                          <Typography variant="body2">
                            No item details available
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Footer */}
                    <Box
                      sx={{
                        p: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        bgcolor: alpha(theme.palette.background.default, 0.5),
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          Total Quantity:{" "}
                          <Typography
                            component="span"
                            fontWeight="bold"
                            color="text.primary"
                          >
                            {totalQuantity}
                          </Typography>
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          Total Amount (৳):{" "}
                          <Typography
                            component="span"
                            fontWeight="bold"
                            color="text.primary"
                            sx={{
                              fontSize: "1.3rem",
                              fontFamily: "Sarabun",
                              fontWeight: 700,
                              borderBottom:
                                "2px solid " + theme.palette.primary.main,
                            }}
                          >
                            {parseFloat(
                              order.amount || order.totalAmount || 0,
                            ).toFixed(2)}{" "}
                            ৳
                          </Typography>
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          textAlign: "right",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: 0.5,
                        }}
                      >
                        <Chip
                          label={statusInfo.acronym}
                          color={statusInfo.color}
                          size="small"
                          sx={{
                            fontWeight: "bold",
                            height: 24,
                            fontSize: "0.75rem",
                          }}
                        />
                        <Typography
                          variant="h5"
                          color="text.secondary"
                          fontWeight="bold"
                        >
                          {order.table?.tableNumber ||
                          order.tableNumber ||
                          order.tablenumber
                            ? `${order.table?.tableNumber || order.tableNumber || order.tablenumber}`
                            : "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>

      {/* Pagination Table-style */}
      {!loading && (
        <Paper
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: "none",
            flexShrink: 0,
          }}
        >
          <TablePagination
            rowsPerPageOptions={[12, 24, 48, 96]}
            component="div"
            count={totalCount || 0}
            rowsPerPage={perPage}
            page={page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderBottom: "none",
              ".MuiTablePagination-toolbar": { minHeight: 48 },
            }}
          />
        </Paper>
      )}

      {/* Status Change Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleStatusClose}
      >
        {STATUS_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleStatusSelect(option.value)}
            sx={{ color: `${option.color}.main`, fontWeight: "bold" }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "error.main" }}>
          Delete Order
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you absolutely sure you want to delete this order? This action
            cannot be undone and will permanently remove the order from the
            system.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCancelDelete}
            color="inherit"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2, px: 3 }}
            disableElevation
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Order Modal */}
      <OrderUpdateModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setOrderToEdit(null);
        }}
        order={orderToEdit}
      />
    </Box>
  );
};

export default Orders;
