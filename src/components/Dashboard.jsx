import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { formatTime } from "../utils/timeFormatter";
import {
  fetchDashboardStats,
  setMonth,
  setYear,
} from "../store/dashboardSlice";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge,
  Skeleton,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { alpha, useTheme } from "@mui/material/styles";
import { BACKEND_API } from "../api/API";

const StatCard = ({ title, value, icon, color }) => {
  const theme = useTheme();
  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 4,
        position: "relative",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(color, 0.05)} 100%)`,
        border: `1px solid ${alpha(color, 0.1)}`,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: theme.shadows[6],
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -20,
          right: -20,
          opacity: 0.1,
          transform: "scale(3)",
          color: color,
        }}
      >
        {icon}
      </Box>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 3,
              backgroundColor: alpha(color, 0.15),
              color: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography
            variant="h6"
            color="text.secondary"
            fontWeight="600"
            sx={{ fontSize: "1rem" }}
          >
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" fontWeight="bold" color="text.primary">
          {value !== undefined && value !== null ? value : "..."}
        </Typography>
      </CardContent>
    </Card>
  );
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const FoodAvatar = ({ src, alt, name, sx }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <Box
      sx={{
        position: "relative",
        width: sx.width,
        height: sx.height,
        mr: sx.mr,
      }}
    >
      {src && !loaded && !error && (
        <Skeleton
          variant="circular"
          animation="wave"
          width={sx.width}
          height={sx.height}
          sx={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
        />
      )}
      <Avatar
        src={error ? "" : src}
        alt={alt}
        sx={{ ...sx, mr: 0 }}
        {...(src && !error
          ? {
              slotProps: {
                img: {
                  onLoad: () => setLoaded(true),
                  onError: () => {
                    setLoaded(true);
                    setError(true);
                  },
                }
              },
            }
          : {})}
      >
        {name ? name[0] : "F"}
      </Avatar>
    </Box>
  );
};

const CustomRechartsTooltip = ({ active, payload }) => {
  const theme = useTheme();
  if (active && payload && payload.length) {
    return (
      <Paper
        elevation={4}
        sx={{
          p: 1.5,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary, mb: 0.5, fontWeight: 500 }}
        >
          {payload[0].name}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: payload[0].payload.color || theme.palette.primary.main,
            fontWeight: "bold",
          }}
        >
          {payload[0].value.toLocaleString()}
        </Typography>
      </Paper>
    );
  }
  return null;
};

const CustomPieChart = ({ data, title }) => {
  const theme = useTheme();

  if (!data || data.length === 0 || data.every((d) => d.value === 0)) {
    return (
      <Card
        elevation={3}
        sx={{
          borderRadius: 4,
          height: 300,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.disabled">
          No data available
        </Typography>
      </Card>
    );
  }

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 4,
        height: 300,
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      <Typography
        variant="h6"
        sx={{ p: 2, pb: 0, fontWeight: "bold", color: "text.primary" }}
      >
        {title}
      </Typography>
      <Box sx={{ flexGrow: 1, minHeight: 0, pb: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke={theme.palette.background.paper}
              strokeWidth={2}
            >
              {data.map((entry, index) => {
                const dynamicColors = [
                  theme.palette.primary.main,
                  theme.palette.secondary.main,
                  theme.palette.info.main,
                  theme.palette.warning.main,
                  theme.palette.error.main,
                  theme.palette.success.main,
                ];
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.color || dynamicColors[index % dynamicColors.length]
                    }
                  />
                );
              })}
            </Pie>
            <RechartsTooltip content={<CustomRechartsTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{
                color: theme.palette.text.primary,
                fontSize: "0.875rem",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const { stats, loading, error, month, year } = useSelector(
    (state) => state.dashboard,
  );

  useEffect(() => {
    if (token) {
      dispatch(fetchDashboardStats({ token, month, year }));
    }
  }, [dispatch, token, month, year]);

  // Data extraction based on API response
  const recentOrders = stats?.recentOrders || [];
  const topFoods = stats?.topSellingFoods || [];

  const tableData = stats
    ? [
        {
          name: "Occupied",
          value: stats.occupiedTables || 0,
          color: theme.palette.secondary.main,
        },
        {
          name: "Available",
          value: Math.max(
            0,
            (stats.totalTables || 0) - (stats.occupiedTables || 0),
          ),
          color: theme.palette.primary.main,
        },
      ]
    : [];

  const orderData = stats
    ? [
        {
          name: "Today's Orders",
          value: stats.todaysOrders || 0,
          color: theme.palette.primary.main,
        },
        {
          name: "Past Orders",
          value: Math.max(
            0,
            (stats.totalOrders || 0) - (stats.todaysOrders || 0),
          ),
          color: alpha(theme.palette.primary.main, 0.3),
        },
      ]
    : [];

  const financialData = stats?.salesRevenue
    ? [
        {
          name: "Yearly Sales",
          value: stats.salesRevenue.yearlySalesAmount || 0,
          color: theme.palette.primary.main,
        },
        {
          name: "Yearly Expenses",
          value: stats.salesRevenue.yearlyExpenses || 0,
          color: alpha(theme.palette.primary.main, 0.6),
        },
      ]
    : [];

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header & Filters */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          mb: 4,
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="primary.main"
            gutterBottom
          >
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening in your restaurant today.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={month}
              label="Month"
              onChange={(e) => dispatch(setMonth(e.target.value))}
              sx={{ borderRadius: 2 }}
            >
              {[...Array(12)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={year}
              label="Year"
              onChange={(e) => dispatch(setYear(e.target.value))}
              sx={{ borderRadius: 2 }}
            >
              {[2023, 2024, 2025, 2026, 2027].map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {error && (
        <Paper
          sx={{
            p: 3,
            mb: 4,
            bgcolor: alpha(theme.palette.error.main, 0.1),
            color: "error.main",
          }}
        >
          <Typography fontWeight="bold">{error}</Typography>
        </Paper>
      )}

      {loading && !stats ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 10 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : (
        <>
          {/* Stat Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Total Revenue"
                value={
                  stats?.totalRevenue !== undefined
                    ? `৳${stats.totalRevenue.toLocaleString()}`
                    : 0
                }
                icon={<TrendingUpIcon fontSize="large" />}
                color={theme.palette.success.main}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Total Orders"
                value={stats?.totalOrders || 0}
                icon={<ShoppingCartIcon fontSize="large" />}
                color={theme.palette.info.main}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Total Employees"
                value={stats?.totalEmployees || 0}
                icon={<PeopleIcon fontSize="large" />}
                color={theme.palette.warning.main}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Menu Items"
                value={stats?.totalFoods || 0}
                icon={<RestaurantMenuIcon fontSize="large" />}
                color={theme.palette.secondary.main}
              />
            </Grid>
          </Grid>

          {/* Charts Row */}
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <CustomPieChart data={tableData} title="Table Status" />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <CustomPieChart data={orderData} title="Orders Overview" />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <CustomPieChart
                data={financialData}
                title="Financial Overview (Yearly)"
              />
            </Grid>
          </Grid>

          {/* Tables and Lists */}
          <Grid container spacing={4}>
            {/* Recent Orders */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Card elevation={3} sx={{ borderRadius: 4, height: "100%" }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ mb: 3 }}
                  >
                    Recent Orders
                  </Typography>
                  <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{ border: `1px solid ${theme.palette.divider}` }}
                  >
                    <Table
                      sx={{ minWidth: 500 }}
                      aria-label="recent orders table"
                    >
                      <TableHead
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                        }}
                      >
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Order ID
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Customer
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Date
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Table
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Amount
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Status
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentOrders.length > 0 ? (
                          recentOrders.slice(0, 5).map((row, index) => (
                            <TableRow key={index} hover>
                              <TableCell>
                                {row.orderNumber || `#ORD-${index + 100}`}
                              </TableCell>
                              <TableCell>
                                {row.customerName ||
                                  row.CustomerName ||
                                  "Walk-in"}
                              </TableCell>
                              <TableCell>
                                {formatTime(
                                  row.orderTime ||
                                    row.OrderTime ||
                                    row.createdAt
                                )}
                              </TableCell>
                              <TableCell>
                                {row.tableNumber || row.TableNumber || "N/A"}
                              </TableCell>
                              <TableCell fontWeight="500">
                                ৳
                                {row.amount ||
                                  row.Amount ||
                                  row.totalAmount ||
                                  "0.00"}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={
                                    row.orderStatus ||
                                    row.OrderStatus ||
                                    "Completed"
                                  }
                                  size="small"
                                  color={
                                    (
                                      row.orderStatus || row.OrderStatus
                                    )?.toLowerCase() === "pending"
                                      ? "warning"
                                      : "success"
                                  }
                                  sx={{ fontWeight: "bold" }}
                                />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              align="center"
                              sx={{ py: 3 }}
                            >
                              <Typography color="text.secondary">
                                No recent orders found.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Top Selling Foods */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Card elevation={3} sx={{ borderRadius: 4, height: "100%" }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ mb: 3 }}
                  >
                    Top Selling Foods
                  </Typography>
                  <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                    {topFoods.length > 0 ? (
                      topFoods.slice(0, 5).map((food, index) => (
                        <ListItem
                          key={index}
                          alignItems="center"
                          sx={{
                            px: 1,
                            py: 2,
                            borderBottom: `1px dashed ${theme.palette.divider}`,
                          }}
                        >
                          <ListItemAvatar sx={{ mr: 2 }}>
                            <Badge
                              badgeContent={`#${index + 1}`}
                              color={
                                index === 0
                                  ? "warning"
                                  : index === 1
                                    ? "primary"
                                    : index === 2
                                      ? "secondary"
                                      : "default"
                              }
                              overlap="circular"
                              anchorOrigin={{
                                vertical: "top",
                                horizontal: "left",
                              }}
                              sx={{
                                "& .MuiBadge-badge": {
                                  left: 6,
                                  top: 6,
                                  border: `2px solid ${theme.palette.background.paper}`,
                                },
                              }}
                            >
                              <FoodAvatar
                                src={
                                  food.image
                                    ? `${BACKEND_API}/images/food/${food.image}`
                                    : ""
                                }
                                alt={food.name || food.Name}
                                name={food.name || food.Name}
                                sx={{
                                  bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.1,
                                  ),
                                  color: "primary.main",
                                  fontWeight: "bold",
                                  width: 52,
                                  height: 52,
                                }}
                              />
                            </Badge>
                          </ListItemAvatar>
                          <ListItemText
                            disableTypography
                            primary={
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  mb: 0.5,
                                }}
                              >
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                >
                                  {food.name || food.Name || "Unknown Food"}
                                </Typography>
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                  fontWeight="bold"
                                >
                                  ৳
                                  {(
                                    food.price ||
                                    food.Price ||
                                    0
                                  ).toLocaleString()}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 1,
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {food.totalQuantitySold || 0} Sold
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="success.main"
                                    fontWeight="bold"
                                  >
                                    Revenue: ৳
                                    {(food.totalRevenue || 0).toLocaleString()}
                                  </Typography>
                                </Box>
                                <LinearProgress
                                  variant="determinate"
                                  value={Math.min(
                                    ((food.totalQuantitySold || 0) /
                                      (topFoods[0]?.totalQuantitySold || 100)) *
                                      100,
                                    100,
                                  )}
                                  sx={{ height: 8, borderRadius: 4 }}
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                      ))
                    ) : (
                      <Box sx={{ py: 3, textAlign: "center" }}>
                        <Typography color="text.secondary">
                          No top selling foods data available.
                        </Typography>
                      </Box>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
