import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    fetchEmployees,
    deleteEmployee,
    createEmployee,
    updateEmployee,
} from "../store/employeeSlice";
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useTheme, alpha } from "@mui/material/styles";
import EmployeeModal from "./EmployeeModal";

const EmployeeList = () => {
    const theme = useTheme();
    const dispatch = useDispatch<any>();
    const token = useSelector((state: any) => state.auth.token);
    const { employees, totalCount, page, perPage, search, loading, error } =
        useSelector((state: any) => state.employee);

    // States for Modals
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<{ id: string | number } | null>(null);

    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState<any | null>(null);

    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [employeeToView, setEmployeeToView] = useState(null);
    const [errors, setErrors] = useState({});

    const [searchInput, setSearchInput] = useState(search);

    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        fatherName: "",
        motherName: "",
        spouseName: "",
        email: "",
        phoneNumber: "",
        designation: "",
        nid: "",
        joinDate: "",
        dob: "",
        genderId: 1, // Default to Male or 0 depending on backend
        image: "",
        base64: "",
    });

    useEffect(() => {
        if (token) dispatch(fetchEmployees({ token, page, perPage, search }));
    }, [dispatch, token, page, perPage, search]);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Handlers for Delete
    const handleDeleteClick = (emp: any) => {
        setEmployeeToDelete(emp);
        setDeleteDialogOpen(true);
    };
    const confirmDelete = () => {
        if (employeeToDelete) {
            dispatch(
                deleteEmployee({
                    id: employeeToDelete.id as string,
                    token,
                    page,
                    perPage,
                    search,
                }),
            );
        }
        setDeleteDialogOpen(false);
    };

    // Handlers for View
    const handleViewClick = (emp: any) => {
        setEmployeeToView(emp);
        setFormData({
            firstName: emp.user?.firstName || "",
            middleName: emp.user?.middleName || "",
            lastName: emp.user?.lastName || "",
            fatherName: emp.user?.fatherName || "",
            motherName: emp.user?.motherName || "",
            spouseName: emp.user?.spouseName || "",
            email: emp.user?.email || "",
            phoneNumber: emp.user?.phoneNumber || "",
            designation: emp.designation || "",
            nid: emp.user?.nid || "",
            joinDate: emp.joinDate ? emp.joinDate.split("T")[0] : "",
            dob: emp.user?.dob ? emp.user?.dob.split("T")[0] : "",
            genderId: emp.user?.genderId || 1,
            image: emp.user?.image || "",
            base64: "",
        });
        setViewDialogOpen(true);
    };

    // Handlers for Form (Add/Edit)
    const handleAddClick = () => {
        setIsEditing(false);
        setCurrentEmployee(null);
        setErrors({});
        setFormData({
            firstName: "",
            middleName: "",
            lastName: "",
            fatherName: "",
            motherName: "",
            spouseName: "",
            email: "",
            phoneNumber: "",
            designation: "",
            nid: "",
            joinDate: "",
            dob: "",
            genderId: 1,
            image: "",
            base64: "",
        });
        setFormDialogOpen(true);
    };

    const handleEditClick = (emp: any) => {
        setIsEditing(true);
        setCurrentEmployee(emp);
        setErrors({});
        setFormData({
            firstName: emp.user?.firstName || "",
            middleName: emp.user?.middleName || "",
            lastName: emp.user?.lastName || "",
            fatherName: emp.user?.fatherName || "",
            motherName: emp.user?.motherName || "",
            spouseName: emp.user?.spouseName || "",
            email: emp.user?.email || "",
            phoneNumber: emp.user?.phoneNumber || "",
            designation: emp.designation || "",
            nid: emp.user?.nid || "",
            joinDate: emp.joinDate ? emp.joinDate.split("T")[0] : "",
            dob: emp.user?.dob ? emp.user?.dob.split("T")[0] : "",
            genderId: emp.user?.genderId || 1,
            image: emp.user?.image || "",
            base64: "",
        });
        setFormDialogOpen(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field when user starts typing
        if ((errors as { [key: string]: string })[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleImageSelect = (base64String: string, file: File | null) => {
        setFormData((prev) => ({
            ...prev,
            base64: base64String || "",
            image: file ? file.name : "",
        }));
    };

    interface formData {
        firstName: string;
        middleName: string;
        lastName: string;
        fatherName: string;
        motherName: string;
        spouseName: string;
        email: string;
        phoneNumber: string;
        designation: string;
        nid: string;
        joinDate: string;
        dob: string;
        genderId: number;
        image: string;
        base64: string;
    }

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        const requiredFields: (keyof typeof formData)[] = [
            "firstName",
            "lastName",
            "spouseName",
            "fatherName",
            "motherName",
            "designation",
            "email",
            "phoneNumber",
            "dob",
            "base64",
            "image",
            "joinDate",
            "nid",
        ];



        requiredFields.forEach((field) => {
            if (!formData[field]) {
                // Format field name for readable error message (e.g. firstName -> First Name)
                const formattedField = field
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str: string) => str.toUpperCase());
                newErrors[field] = `${formattedField} is required`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = () => {
        if (!validateForm()) {
            return;
        }

        const payload = {
            ...formData,
            // Default to ISO string format for Date types if backend expects full DateTime
            joinDate: formData.joinDate
                ? new Date(formData.joinDate).toISOString()
                : null,
            dob: formData.dob ? new Date(formData.dob).toISOString() : null,
            base64: formData.base64 ? formData.base64 : null,
        };

        if (isEditing && currentEmployee) {
            dispatch(
                updateEmployee({
                    id: currentEmployee.id,
                    data: payload,
                    token,
                    page,
                    perPage,
                    search,
                }),
            );
        } else {
            dispatch(createEmployee({ data: payload, token, page, perPage, search }));
        }
        setFormDialogOpen(false);
    };

    const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
        dispatch({
            type: "employee/setPagination",
            payload: { page: newPage + 1 },
        });
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: "employee/setPagination",
            payload: { perPage: parseInt(event.target.value, 10), page: 1 },
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>) => {
        if ((e as React.KeyboardEvent<HTMLDivElement>).key === "Enter" || (e as React.MouseEvent<HTMLButtonElement>).type === "click") {
            dispatch({
                type: "employee/setPagination",
                payload: { search: searchInput, page: 1 },
            });
        }
    };

    console.log("Employees:", employees);

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

                            sx={{
                                typography: { xs: "h5", sm: "h4" },
                                variant: "h4",
                                fontWeight: "bold",
                                color: "primary.main",
                                textWrap: "nowrap"
                            }}


                        >
                            Staff Directory
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ typography: { xs: "body2", sm: "body1" } }}
                            color="text.secondary"
                        >
                            Manage your culinary and service team effectively.
                        </Typography>
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2,
                        flexWrap: "wrap",
                        alignItems: { xs: "stretch", sm: "center" },
                        width: { xs: "100%", md: "auto" },
                    }}
                >
                    <TextField
                        size="small"
                        placeholder="Search employees..."
                        variant="outlined"
                        value={searchInput}
                        onChange={handleSearchChange}
                        onKeyPress={handleSearchSubmit}
                        sx={{ bgcolor: "background.paper", borderRadius: 1, width: { xs: "100%", sm: "250px" } }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddCircleIcon />}
                        onClick={handleAddClick}
                        sx={{ borderRadius: 1, px: 3, py: 1, fontWeight: "bold", textWrap: "nowrap" }}
                    >
                        Add Staff
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
                    <Typography sx={{
                        fontWeight: "bold",
                        textWrap: "nowrap"
                    }}>{error}</Typography>
                </Paper>
            )}

            <Card
                elevation={6}
                sx={{ borderRadius: 4, width: "100%", overflow: "hidden" }}
            >
                <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", my: 10 }}>
                            <CircularProgress size={60} thickness={4} />
                        </Box>
                    ) : (
                        <Paper sx={{ width: "100%", overflow: "hidden" }}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650, maxWidth: "100%" }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: "bold", textWrap: "nowrap" }}>
                                                Employee Name
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: "bold", textWrap: "nowrap" }}>
                                                Gender
                                            </TableCell>
                                            <TableCell align="left" sx={{ fontWeight: "bold", textWrap: "nowrap" }}>
                                                Email
                                            </TableCell>
                                            <TableCell align="left" sx={{ fontWeight: "bold", textWrap: "nowrap" }}>
                                                Position
                                            </TableCell>
                                            <TableCell align="left" sx={{ fontWeight: "bold", textWrap: "nowrap" }}>
                                                Join Date
                                            </TableCell>
                                            <TableCell align="left" sx={{ fontWeight: "bold", textWrap: "nowrap" }}>
                                                Phone Number
                                            </TableCell>
                                            <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody >
                                        {employees.map((emp: any) => (
                                            <TableRow
                                                key={emp.id}
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
                                                <TableCell component="th" scope="row">
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <Avatar
                                                            src={
                                                                emp.user?.image
                                                                    ? `${BACKEND_API}/images/user/${emp.user.image}`
                                                                    : ""
                                                            }
                                                            alt={`${emp.user?.firstName || ""} ${emp.user?.lastName || ""}`}
                                                            sx={{
                                                                width: 30,
                                                                height: 30,
                                                                mr: 1,
                                                                bgcolor: alpha(
                                                                    theme.palette.secondary.main,
                                                                    0.2,
                                                                ),
                                                                color: "secondary.main",
                                                                fontWeight: "bold",
                                                                border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                                            }}
                                                        >
                                                            {emp.user?.firstName
                                                                ? emp.user.firstName[0].toUpperCase()
                                                                : "S"}
                                                        </Avatar>
                                                        <Typography
                                                            sx={{
                                                                variant: "subtitle1",
                                                                fontWeight: "bold",
                                                                textWrap: "nowrap"
                                                            }}
                                                        >
                                                            {`${emp.user?.firstName || ""} ${emp.user?.lastName || ""}`.trim() ||
                                                                emp.user?.fullName ||
                                                                "Unknown"}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="left" sx={{
                                                    textWrap: "nowrap"
                                                }} >{
                                                        emp.user?.genderId === 1 ? "Male" : "Female"}</TableCell>
                                                <TableCell align="left" sx={{
                                                    textWrap: "nowrap"
                                                }} >{emp.user?.email || "N/A"}</TableCell>
                                                <TableCell align="left" sx={{
                                                    textWrap: "nowrap"
                                                }} >{emp.designation || "N/A"}</TableCell>
                                                <TableCell align="left" sx={{
                                                    textWrap: "nowrap"
                                                }}>{emp.joinDate ? formatDate(emp.joinDate) : "N/A"}</TableCell>
                                                <TableCell align="left" sx={{
                                                    textWrap: "nowrap"
                                                }} >{emp.user?.phoneNumber || "N/A"}</TableCell>
                                                <TableCell sx={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                        <Tooltip title="View Details">
                                                            <IconButton
                                                                size="small"
                                                                color="info"
                                                                onClick={() => handleViewClick(emp)}
                                                            >
                                                                <VisibilityIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Edit Staff">
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                sx={{ mx: 0.5 }}
                                                                onClick={() => handleEditClick(emp)}
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Remove Staff">
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleDeleteClick(emp)}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 50, 100]}
                                component="div"
                                count={totalCount}
                                rowsPerPage={perPage}
                                page={page - 1} // MUI pagination is 0-indexed
                                onPageChange={handleChangePage as any}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                sx={{
                                    overflowX: "hidden",
                                    ".MuiTablePagination-toolbar": {
                                        flexWrap: "wrap",
                                        justifyContent: "center",
                                        minHeight: "auto",
                                        py: 1,
                                    },
                                    ".MuiTablePagination-selectLabel": { m: 0 },
                                    ".MuiTablePagination-displayedRows": { m: 0 },
                                    ".MuiTablePagination-actions": { ml: 0 },
                                }}
                            />
                        </Paper>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog
                disableRestoreFocus
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirm Removal</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to remove this staff member from the
                        restaurant roster?
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

            <EmployeeModal
                open={formDialogOpen || viewDialogOpen}
                onClose={() => {
                    setFormDialogOpen(false);
                    setViewDialogOpen(false);
                }}
                mode={viewDialogOpen ? "view" : isEditing ? "edit" : "create"}
                formData={formData}
                errors={errors}
                onChange={handleFormChange}
                onImageSelect={handleImageSelect as any}
                onSubmit={handleFormSubmit}
            />
        </Box>
    );
};

export default EmployeeList;
