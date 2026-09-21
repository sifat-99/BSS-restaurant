import { useEffect, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    fetchFoods,
    deleteFood,
    createFood,
    updateFood,
} from "../store/foodSlice";
import { BACKEND_API } from "../api/API";
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useTheme, alpha } from "@mui/material/styles";
import FoodModal from "./FoodModal";
import type { AppDispatch, RootState } from "../store/store";

type DiscountType = "None" | "Percentage" | "Amount";

interface Food {
    id: string;
    name: string;
    description?: string;
    price: number;
    discountType?: DiscountType;
    discount?: number;
    discountPrice?: number;
    image?: string;
}

interface FoodFormData {
    name: string;
    description: string;
    price: string;
    discountType: DiscountType;
    discount: string;
    image: string;
    base64: string;
}

interface FoodPayload {
    name: string;
    description: string;
    price: number;
    discountType: DiscountType;
    discount: number;
    image: string;
    base64: string | null;
}

type FormErrors = Partial<Record<keyof FoodFormData, string>>;

interface FoodState {
    foods: Food[];
    totalCount: number;
    page: number;
    perPage: number;
    search: string;
    loading: boolean;
    error: string | null;
}

const emptyFormData: FoodFormData = {
    name: "",
    description: "",
    price: "",
    discountType: "None",
    discount: "",
    image: "",
    base64: "",
};

const FoodList = () => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const token = useSelector((state: RootState) => state.auth.token);
    const { foods, totalCount, page, perPage, search, loading, error } =
        useSelector((state: RootState) => state.food as unknown as FoodState);
    const authToken = token ?? "";

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [foodToDelete, setFoodToDelete] = useState<Food | null>(null);

    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [backendError, setBackendError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentFood, setCurrentFood] = useState<Food | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const [formData, setFormData] = useState<FoodFormData>({ ...emptyFormData });

    const [searchInput, setSearchInput] = useState(search);

    useEffect(() => {
        if (token) {
            dispatch(fetchFoods({ token: authToken, page, perPage, search }));
        }
    }, [dispatch, token, page, perPage, search]);

    const handleDeleteClick = (food: Food) => {
        setFoodToDelete(food);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (foodToDelete) {
            dispatch(
                deleteFood({
                    id: foodToDelete.id,
                    token: authToken,
                    page,
                    perPage,
                    search,
                }),
            );
        }
        setDeleteDialogOpen(false);
    };

    const handleAddClick = () => {
        setIsEditing(false);
        setCurrentFood(null);
        setErrors({});
        setBackendError(null);
        setFormData({ ...emptyFormData });
        setFormDialogOpen(true);
    };

    const handleEditClick = (food: Food) => {
        setIsEditing(true);
        setCurrentFood(food);
        setErrors({});
        setBackendError(null);
        setFormData({
            name: food.name || "",
            description: food.description || "",
            price: String(food.price ?? ""),
            discountType: food.discountType || "None",
            discount: String(food.discount ?? ""),
            image: food.image || "",
            base64: "",
        });
        setFormDialogOpen(true);
    };

    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value } as FoodFormData));
        const fieldName = name as keyof FoodFormData;
        if (errors[fieldName]) setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    };

    const handleImageSelect = (base64String: string | null, file: File | null) => {
        setFormData((prev) => ({
            ...prev,
            base64: base64String || "",
            image: file ? file.name : "",
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.name) newErrors.name = "Food Name is required";
        if (!formData.price || parseFloat(formData.price) <= 0)
            newErrors.price = "Valid price is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = () => {
        if (!validateForm()) return;
        setBackendError(null);
        setIsSubmitting(true);
        const payload: FoodPayload = {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            discountType: formData.discountType,
            discount: parseFloat(formData.discount || "0"),
            image: formData.image,
            base64: formData.base64 ? formData.base64 : null,
        };
        if (isEditing && currentFood) {
            dispatch(
                updateFood({
                    id: currentFood.id,
                    data: payload,
                    token: authToken,
                    page,
                    perPage,
                    search,
                }),
            )
                .unwrap()
                .then(() => {
                    setFormDialogOpen(false);
                    setIsSubmitting(false);
                })
                .catch((err) => {
                    setBackendError(err);
                    setIsSubmitting(false);
                });
        } else {
            dispatch(createFood({ data: payload, token: authToken, page, perPage, search }))
                .unwrap()
                .then(() => {
                    setFormDialogOpen(false);
                    setIsSubmitting(false);
                })
                .catch((err) => {
                    setBackendError(err);
                    setIsSubmitting(false);
                });
        }
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        dispatch({
            type: "food/setPagination",
            payload: { page: newPage + 1 },
        });
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: "food/setPagination",
            payload: { perPage: parseInt(event.target.value, 10), page: 1 },
        });
    };

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const handleSearchSubmit = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.type === "click") {
            dispatch({
                type: "food/setPagination",
                payload: { search: searchInput, page: 1 },
            });
        }
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
                        <RestaurantMenuIcon fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography
                            variant="h4"
                            sx={{ typography: { xs: "h5", sm: "h4" }, fontWeight: "bold" }}
                            color="primary.main"
                        >
                            Foods Management
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ typography: { xs: "body2", sm: "body1" } }}
                            color="text.secondary"
                        >
                            Manage your restaurant foods.
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
                        placeholder="Search foods..."
                        variant="outlined"
                        value={searchInput}
                        onChange={handleSearchChange}
                        onKeyPress={handleSearchSubmit}
                        sx={{ bgcolor: "background.paper", borderRadius: 1 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddCircleIcon />}
                        onClick={handleAddClick}
                        sx={{ borderRadius: 8, px: 3, py: 1.5, fontWeight: "bold" }}
                    >
                        Add Food
                    </Button>
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
                    <Typography sx={{ fontWeight: "bold" }}>{error}</Typography>
                </Paper>
            )}

            <Card
                elevation={6}
                sx={{ borderRadius: 4, width: "100%", overflow: "hidden" }}
            >
                <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                    {loading && foods?.length === 0 ? (
                        <Box sx={{ display: "flex", justifyContent: "center", my: 10 }}>
                            <CircularProgress size={60} thickness={4} />
                        </Box>
                    ) : (
                        <Paper
                            sx={{
                                width: "100%",
                                overflow: "hidden",
                                boxShadow: "none",
                                border: `1px solid ${theme.palette.divider}`,
                            }}
                        >
                            <TableContainer sx={{ maxHeight: 600 }}>
                                <Table
                                    stickyHeader
                                    sx={{ minWidth: 800 }}
                                    aria-label="food list"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: "bold" }}>
                                                Food Item
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: "bold" }}>
                                                Description
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                                            <TableCell sx={{ fontWeight: "bold" }}>
                                                Discount
                                            </TableCell>
                                            <TableCell
                                                sx={{ fontWeight: "bold", textWrap: "nowrap" }}
                                            >
                                                Discounted Price
                                            </TableCell>
                                            <TableCell
                                                sx={{ fontWeight: "bold", textAlign: "right" }}
                                            >
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {foods && foods.length > 0 ? (
                                            foods.map((food) => (
                                                <TableRow
                                                    key={food.id}
                                                    hover
                                                    sx={{
                                                        height: 56,
                                                        "& > .MuiTableCell-root": {
                                                            height: 56,
                                                            boxSizing: "border-box",
                                                            py: 0.5,
                                                            verticalAlign: "middle",
                                                        },
                                                        "&:nth-of-type(odd)": {
                                                            backgroundColor:
                                                                theme.palette.mode === "dark"
                                                                    ? alpha(theme.palette.primary.main, 0.05)
                                                                    : alpha(theme.palette.primary.main, 0.06),
                                                        },
                                                        "&:last-child td, &:last-child th": { border: 0 },
                                                        transition: "background-color 0.2s ease",
                                                        "&:hover": {
                                                            bgcolor:
                                                                theme.palette.mode === "dark"
                                                                    ? alpha(theme.palette.primary.main, 0.15)
                                                                    : alpha(theme.palette.primary.main, 0.12),
                                                        },
                                                    }}
                                                >
                                                    <TableCell
                                                        sx={{
                                                            width: "25%",
                                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                                        }}
                                                    >
                                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                                            <Avatar
                                                                src={
                                                                    food.image
                                                                        ? `${BACKEND_API}/images/food/${food.image}`
                                                                        : undefined
                                                                }
                                                                sx={{
                                                                    width: 40,
                                                                    height: 40,
                                                                    mr: 2,
                                                                    bgcolor: alpha(
                                                                        theme.palette.secondary.main,
                                                                        0.2,
                                                                    ),
                                                                    color: "secondary.main",
                                                                }}
                                                            >
                                                                {!food.image && <WarningAmberIcon />}
                                                            </Avatar>
                                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                                {food.name}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            width: "35%",
                                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                                        }}
                                                    >
                                                        <Typography variant="body2" color="text.secondary">
                                                            {(food.description ?? "").length > 50
                                                                ? `${(food.description ?? "").substring(0, 50)}...`
                                                                : food.description || "N/A"}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            width: "10%",
                                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body1"
                                                            sx={{ fontWeight: 500 }}
                                                            color="primary.main"
                                                        >
                                                            ৳{food.price}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            width: "15%",
                                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                                        }}
                                                    >
                                                        {(food.discount ?? 0) > 0 ? (
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color: theme.palette.success.main,
                                                                    fontWeight: "bold",
                                                                    bgcolor: alpha(
                                                                        theme.palette.success.main,
                                                                        0.1,
                                                                    ),
                                                                    display: "inline-block",
                                                                    px: 1,
                                                                    py: 0.5,
                                                                    borderRadius: 1,
                                                                    textWrap: "nowrap",
                                                                }}
                                                            >
                                                                {food.discountType === "Percentage"
                                                                    ? `${food.discount}% OFF`
                                                                    : `৳${food.discount} OFF`}
                                                            </Typography>
                                                        ) : (
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color: theme.palette.error.main,
                                                                    fontWeight: "bold",
                                                                }}
                                                            >
                                                                None
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            textAlign: "start",
                                                            whiteSpace: "nowrap",
                                                            width: "15%",
                                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            color="primary.main"
                                                            sx={{ fontWeight: "bold" }}
                                                        >
                                                            ৳{food.discountPrice || food.price}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            textAlign: "right",
                                                            whiteSpace: "nowrap",
                                                            width: "15%",
                                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                                        }}
                                                    >
                                                        <Tooltip title="Edit Food">
                                                            <IconButton
                                                                color="success"
                                                                onClick={() => handleEditClick(food)}
                                                                sx={{
                                                                    mx: 0.5,
                                                                    border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                                                                    borderRadius: 2,
                                                                }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Remove Food">
                                                            <IconButton
                                                                color="error"
                                                                sx={{
                                                                    border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                                                                    borderRadius: 2,
                                                                }}
                                                                onClick={() => handleDeleteClick(food)}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                                    <Avatar
                                                        sx={{
                                                            m: "auto",
                                                            mb: 2,
                                                            bgcolor: "transparent",
                                                            color: "text.secondary",
                                                            width: 64,
                                                            height: 64,
                                                        }}
                                                    >
                                                        <RestaurantMenuIcon sx={{ fontSize: 40 }} />
                                                    </Avatar>
                                                    <Typography
                                                        color="text.secondary"
                                                        variant="h6"
                                                        sx={{ fontWeight: "bold" }}
                                                    >
                                                        No foods found
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    p: 2,
                                    borderTop: `1px solid ${theme.palette.divider}`,
                                }}
                            >
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 50, 100]}
                                    component="div"
                                    count={totalCount}
                                    rowsPerPage={perPage}
                                    page={page - 1}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    sx={{
                                        overflowX: "hidden",
                                        ".MuiTablePagination-toolbar": {
                                            flexWrap: "wrap",
                                            justifyContent: "center",
                                            minHeight: "auto",
                                            py: 0,
                                        },
                                        ".MuiTablePagination-selectLabel": { m: 0 },
                                        ".MuiTablePagination-displayedRows": { m: 0 },
                                        ".MuiTablePagination-actions": { ml: 0 },
                                    }}
                                />
                            </Box>
                        </Paper>
                    )}
                </CardContent>
            </Card>

            <Dialog
                disableRestoreFocus
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirm Removal</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to remove this food item?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>

            <FoodModal
                open={formDialogOpen}
                onClose={() => setFormDialogOpen(false)}
                mode={isEditing ? "edit" : "create"}
                formData={formData}
                errors={errors}
                onChange={handleFormChange}
                onImageSelect={handleImageSelect}
                onSubmit={handleFormSubmit}
                backendError={backendError}
                isSubmitting={isSubmitting}
            />
        </Box>
    );
};

export default FoodList;
