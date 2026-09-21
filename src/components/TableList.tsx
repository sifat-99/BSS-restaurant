import React, { ReactNode, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    fetchTables,
    deleteTable,
    createTable,
    updateTable,
} from "../store/tableSlice";
import { fetchEmployees } from "../store/employeeSlice";
import { BACKEND_API } from "../api/API";
import { GetNonAssignedEmployeesAPI } from "../api/GET";
import { CreateEmployeeTableRangeAPI } from "../api/POST";
import { DeleteEmployeeTableAPI } from "../api/DELETE";
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
    AvatarGroup,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    InputLabel,
    FormControl,
    OutlinedInput,
    Menu,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useTheme, alpha } from "@mui/material/styles";
import TableModal from "./TableModal";

const TableList = () => {
    const theme = useTheme();
    const dispatch = useDispatch<any>();
    const token = useSelector((state: any) => state.auth.token);
    const { tables, totalCount, page, perPage, search, loading, error } =
        useSelector((state: any) => state.table);
    const { employees } = useSelector((state: any) => state.employee);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [tableToDelete, setTableToDelete] = useState<any>(null);

    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [backendError, setBackendError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTable, setCurrentTable] = useState<any>(null);

    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedTableForAssign, setSelectedTableForAssign] = useState<any>(null);
    const [nonAssignedEmployees, setNonAssignedEmployees] = useState<[]>([]);
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
    const [assignLoading, setAssignLoading] = useState(false);

    const [employeeMenuAnchorEl, setEmployeeMenuAnchorEl] = useState<any>(null);
    const [selectedEmployeeTableId, setSelectedEmployeeTableId] = useState<any>(null);
    const [removeEmployeeLoading, setRemoveEmployeeLoading] = useState<boolean>(false);

    const handleEmployeeAvatarClick = (event: any, empTableId: any) => {
        setEmployeeMenuAnchorEl(event.currentTarget);
        setSelectedEmployeeTableId(empTableId);
    };

    const handleEmployeeMenuClose = () => {
        setEmployeeMenuAnchorEl(null);
        setSelectedEmployeeTableId(null);
    };

    const handleRemoveEmployee = async () => {
        if (!selectedEmployeeTableId) return;
        try {
            setRemoveEmployeeLoading(true);
            await DeleteEmployeeTableAPI(selectedEmployeeTableId, token);
            dispatch(fetchTables({ token, page, perPage, search }));
        } catch (err) {
            console.error(err);
        } finally {
            setRemoveEmployeeLoading(false);
            handleEmployeeMenuClose();
        }
    };

    const handleAddEmployeeClick = async (table: any) => {
        setSelectedTableForAssign(table);
        setAssignModalOpen(true);
        setNonAssignedEmployees([]);
        setSelectedEmployeeIds([]);
        try {
            setAssignLoading(true);
            const res = await GetNonAssignedEmployeesAPI(token, table.id);
            if (res.data) {
                setNonAssignedEmployees(res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setAssignLoading(false);
        }
    };

    const handleAssignSubmit = async () => {
        if (selectedEmployeeIds.length === 0) return;
        try {
            setAssignLoading(true);
            const payload = selectedEmployeeIds.map((empId) => ({
                employeeId: empId,
                tableId: selectedTableForAssign.id.toString() as string,
            }));
            await CreateEmployeeTableRangeAPI(payload, token);
            dispatch(fetchTables({ token, page, perPage, search }));
            setAssignModalOpen(false);
            setSelectedEmployeeIds([]);
        } catch (err) {
            console.error(err);
        } finally {
            setAssignLoading(false);
        }
    };
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [formData, setFormData] = useState({
        tableNumber: "",
        numberOfSeats: "",
        image: "",
        base64: "",
    });

    const [searchInput, setSearchInput] = useState(search);

    useEffect(() => {
        if (token) {
            dispatch(fetchTables({ token, page, perPage, search }));
            dispatch(fetchEmployees({ token, page: 1, perPage: 1000 }));
        }
    }, [dispatch, token, page, perPage, search]);

    // Handlers for Delete
    const handleDeleteClick = (table: any) => {
        setTableToDelete(table);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (tableToDelete) {
            dispatch(
                deleteTable({
                    id: tableToDelete.id,
                    token,
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
        setCurrentTable(null);
        setErrors({});
        setBackendError(null);
        setFormData({ tableNumber: "", numberOfSeats: "", image: "", base64: "" });
        setFormDialogOpen(true);
    };

    const handleEditClick = (table: any) => {
        setIsEditing(true);
        setCurrentTable(table);
        setErrors({});
        setBackendError(null);
        setFormData({
            tableNumber: table.tableNumber || "",
            numberOfSeats: table.numberOfSeats || "",
            image: table.image || "",
            base64: "",
        });
        setFormDialogOpen(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors as { [name: string]: string }) {
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

    const validateForm = () => {
        const newErrors = {} as { [key: string]: string };
        if (!formData.tableNumber)
            newErrors.tableNumber = "Table Number is required";
        if (!formData.numberOfSeats || parseInt(formData.numberOfSeats, 10) <= 0)
            newErrors.numberOfSeats = "Valid capacity is required";

        console.log("Form Data:", formData);
        if (formData.image == "" && !formData.base64) {
            newErrors.image = "Image file is required! Please upload an image..";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = () => {
        if (!validateForm()) return;
        setBackendError(null);
        setIsSubmitting(true);
        const payload = {
            tableNumber: formData.tableNumber,
            numberOfSeats: parseInt(formData.numberOfSeats, 10),
            image: formData.image,
            base64: formData.base64 ? formData.base64 : null,
        };
        if (isEditing && currentTable) {
            dispatch(
                updateTable({
                    id: currentTable.id,
                    data: payload,
                    token,
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
                .catch((err: any) => {
                    setBackendError(err);
                    setIsSubmitting(false);
                });
        } else {
            dispatch(createTable({ data: payload, token, page, perPage, search }))
                .unwrap()
                .then(() => {
                    setFormDialogOpen(false);
                    setIsSubmitting(false);
                })
                .catch((err: any) => {
                    setBackendError(err);
                    setIsSubmitting(false);
                });
        }
    };

    const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
        dispatch({
            type: "table/setPagination",
            payload: { page: newPage + 1 },
        });
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: "table/setPagination",
            payload: { perPage: parseInt(event.target.value, 10), page: 1 },
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
        if ((e as React.KeyboardEvent<HTMLInputElement>).key === "Enter" || (e as React.MouseEvent<HTMLButtonElement>).type === "click") {
            dispatch({
                type: "table/setPagination",
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
                        <TableRestaurantIcon fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography

                            sx={{
                                typography: { xs: "h5", sm: "h4" },
                                variant: "h4",
                                fontWeight: "bold",
                                color: "primary.main"
                            }}


                        >
                            Tables Management
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ typography: { xs: "body2", sm: "body1" } }}
                            color="text.secondary"
                        >
                            Manage your restaurant tables and assignments.
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
                        placeholder="Search tables..."
                        variant="outlined"
                        value={searchInput}
                        onChange={handleSearchChange}
                        onKeyPress={handleSearchSubmit as any}
                        sx={{ bgcolor: "background.paper", borderRadius: 1 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddCircleIcon />}
                        onClick={handleAddClick}
                        sx={{ borderRadius: 8, px: 3, py: 1.5, fontWeight: "bold" }}
                    >
                        Add Table
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
                    {loading && tables.length === 0 ? (
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
                                    aria-label="table list"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: "bold" }}>Table</TableCell>
                                            <TableCell sx={{ fontWeight: "bold" }}>Seats</TableCell>
                                            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: "bold" }}>
                                                Assigned Employees
                                            </TableCell>
                                            <TableCell
                                                sx={{ fontWeight: "bold", textAlign: "right" }}
                                            >
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {tables.length > 0 ? (
                                            tables.map((table: any) => (
                                                <TableRow
                                                    key={table.id}
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
                                                            width: "20%",
                                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                                        }}
                                                    >
                                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                                            <Avatar
                                                                src={
                                                                    table.image
                                                                        ? `${BACKEND_API}/images/table/${table.image}`
                                                                        : undefined
                                                                }
                                                                sx={{
                                                                    width: 48,
                                                                    height: 48,
                                                                    mr: 2,
                                                                    bgcolor: alpha(
                                                                        theme.palette.secondary.main,
                                                                        0.2,
                                                                    ),
                                                                    color: "secondary.main",
                                                                }}
                                                            >
                                                                {!table.image && <WarningAmberIcon />}
                                                            </Avatar>
                                                            <Typography sx={{ fontWeight: "500" }} variant="body1">
                                                                {table.tableNumber}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            width: "15%",
                                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                                        }}
                                                    >
                                                        <Typography variant="body1">
                                                            {table.numberOfSeats}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            width: "20%",
                                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body1"
                                                            sx={{
                                                                fontWeight: "500",
                                                                color: table.isOccupied
                                                                    ? theme.palette.error.main
                                                                    : theme.palette.success.main,
                                                            }}
                                                        >
                                                            {table.isOccupied ? "Not Available" : "Available"}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            width: "25%",
                                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                                        }}
                                                    >
                                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                                            <AvatarGroup
                                                                max={4}
                                                                sx={{
                                                                    mr: 1,
                                                                    "& .MuiAvatar-root": {
                                                                        width: 44,
                                                                        height: 44,
                                                                        fontSize: "1rem",
                                                                    },
                                                                }}
                                                            >
                                                                {table.employees &&
                                                                    table.employees.map((empl: any) => {
                                                                        const storeEmployee = employees?.find(
                                                                            (e: any) => e.id === empl.employeeId,
                                                                        );
                                                                        const empImage = storeEmployee?.user?.image;
                                                                        return (
                                                                            <Tooltip
                                                                                key={empl.employeeTableId}
                                                                                title={`${empl.name}${storeEmployee?.designation ? ` • ${storeEmployee.designation}` : ""}`}
                                                                                arrow
                                                                                placement="top"
                                                                            >
                                                                                <Avatar
                                                                                    onClick={(e) =>
                                                                                        handleEmployeeAvatarClick(
                                                                                            e,
                                                                                            empl.employeeTableId,
                                                                                        )
                                                                                    }
                                                                                    alt={empl.name}
                                                                                    src={
                                                                                        empImage
                                                                                            ? `${BACKEND_API}/images/user/${empImage}`
                                                                                            : ""
                                                                                    }
                                                                                    sx={{
                                                                                        cursor: "pointer",
                                                                                        "&:hover": { opacity: 0.8 },
                                                                                        bgcolor: theme.palette.primary.main,
                                                                                    }}
                                                                                >
                                                                                    {empl.name ? empl.name[0] : "S"}
                                                                                </Avatar>
                                                                            </Tooltip>
                                                                        );
                                                                    })}
                                                            </AvatarGroup>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleAddEmployeeClick(table)}
                                                                sx={{
                                                                    border: `1px dashed ${theme.palette.success.main}`,
                                                                    color: theme.palette.success.main,
                                                                    ml: 1,
                                                                }}
                                                            >
                                                                <AddIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            textAlign: "right",
                                                            whiteSpace: "nowrap",
                                                            width: "20%",
                                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                                        }}
                                                    >
                                                        <Tooltip title="Edit Table">
                                                            <IconButton
                                                                color="success"
                                                                onClick={() => handleEditClick(table)}
                                                                sx={{
                                                                    mx: 0.5,
                                                                    border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                                                                    borderRadius: 2,
                                                                }}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Remove Table">
                                                            <IconButton
                                                                color="error"
                                                                sx={{
                                                                    border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                                                                    borderRadius: 2,
                                                                }}
                                                                onClick={() => handleDeleteClick(table)}
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
                                                        <TableRestaurantIcon sx={{ fontSize: 40 }} />
                                                    </Avatar>
                                                    <Typography
                                                        sx={{ fontWeight: "bold", color: "text.secondary" }}
                                                        variant="h6"
                                                    >
                                                        No tables found
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
                                    onPageChange={handleChangePage as any}
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
                    <Typography>Are you sure you want to remove this table?</Typography>
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

            <TableModal
                open={formDialogOpen}
                onClose={() => setFormDialogOpen(false)}
                mode={isEditing ? "edit" : "create"}
                formData={{
                    ...formData,
                    numberOfSeats: formData.numberOfSeats === "" ? 0 : Number(formData.numberOfSeats),
                }}
                errors={errors}
                onChange={handleFormChange}
                onImageSelect={handleImageSelect as any}
                onSubmit={handleFormSubmit}
                backendError={backendError}
                isSubmitting={isSubmitting}
            />

            {/* Assign Employees Dialog */}
            <Dialog
                open={assignModalOpen}
                onClose={() => setAssignModalOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Assign Employees to Table {selectedTableForAssign?.tableNumber}
                </DialogTitle>
                <DialogContent>
                    {assignLoading && nonAssignedEmployees.length === 0 ? (
                        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="multiple-employee-label">
                                Select Employees
                            </InputLabel>
                            <Select
                                labelId="multiple-employee-label"
                                multiple
                                value={selectedEmployeeIds}
                                onChange={(e: any) => setSelectedEmployeeIds(e.target.value)}
                                input={<OutlinedInput label="Select Employees" />}
                                renderValue={(selected) =>
                                    nonAssignedEmployees
                                        .filter((emp: any) =>
                                            selected.includes(emp.id || emp.employeeId),
                                        )
                                        .map(
                                            (emp: any) =>
                                                emp.name ||
                                                emp.fullName ||
                                                (emp.user && emp.user.fullName) ||
                                                emp.id ||
                                                emp.employeeId,
                                        )
                                        .join(", ")
                                }
                            >
                                {nonAssignedEmployees.map((emp: any) => {
                                    const empIdentifier = emp.id || emp.employeeId;
                                    const empName =
                                        emp.name ||
                                        emp.fullName ||
                                        (emp.user && emp.user.fullName) ||
                                        empIdentifier;

                                    const storeEmployee = employees?.find(
                                        (e: any) => e.id === empIdentifier,
                                    );
                                    const empImage =
                                        storeEmployee?.image ||
                                        storeEmployee?.user?.image ||
                                        emp.image ||
                                        (emp.user && emp.user.image);

                                    let imageSrc = undefined;
                                    if (empImage) {
                                        if (
                                            empImage.startsWith("data:") ||
                                            empImage.startsWith("http")
                                        ) {
                                            imageSrc = empImage;
                                        } else if (
                                            empImage.length > 100 &&
                                            !empImage.includes(".")
                                        ) {
                                            // Base64 without data prefix
                                            imageSrc = `data:image/jpeg;base64,${empImage}`;
                                        } else {
                                            imageSrc = `${BACKEND_API}/images/user/${empImage}`;
                                        }
                                    }

                                    return (
                                        <MenuItem
                                            key={empIdentifier || Math.random()}
                                            value={empIdentifier}
                                        >
                                            <Checkbox
                                                checked={
                                                    selectedEmployeeIds.indexOf(empIdentifier) > -1
                                                }
                                            />
                                            <Avatar
                                                src={imageSrc}
                                                sx={{ width: 32, height: 32, mr: 2, fontSize: "1rem" }}
                                            >
                                                {empName ? empName[0] : "E"}
                                            </Avatar>
                                            <ListItemText
                                                primary={empName}
                                                secondary={emp.designation || ""}
                                            />
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAssignModalOpen(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAssignSubmit}
                        variant="contained"
                        disabled={selectedEmployeeIds.length === 0 || assignLoading}
                    >
                        {assignLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            "Submit"
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Remove Employee Menu */}
            <Menu
                anchorEl={employeeMenuAnchorEl}
                open={Boolean(employeeMenuAnchorEl)}
                onClose={handleEmployeeMenuClose}
            >
                <MenuItem
                    onClick={handleRemoveEmployee}
                    disabled={removeEmployeeLoading}
                >
                    {removeEmployeeLoading ? (
                        <CircularProgress size={20} sx={{ mr: 1, color: "error.main" }} />
                    ) : null}
                    <ListItemText
                        primary="Remove Employee"
                        sx={{ color: "error.main" }}
                    />
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default TableList;
