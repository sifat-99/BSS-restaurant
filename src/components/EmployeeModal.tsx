import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    type TextFieldProps,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Box,
    IconButton,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ImageDropzone } from "../utils/ImageConverter";
import { BACKEND_API } from "../api/API";

interface EmployeeFormData {
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

type EmployeeFormErrors = Partial<Record<keyof EmployeeFormData, string>>;

type EmployeeModalMode = "create" | "edit" | "view";

interface EmployeeModalProps {
    open: boolean;
    onClose: () => void;
    mode: EmployeeModalMode;
    formData: EmployeeFormData;
    errors?: EmployeeFormErrors;
    onChange: NonNullable<TextFieldProps["onChange"]>;
    onImageSelect: (base64: string | null, file: File | null) => void;
    onSubmit: () => void;
}

const EmployeeModal = ({
    open,
    onClose,
    mode, // 'create', 'edit', 'view'
    formData,
    errors = {},
    onChange,
    onImageSelect,
    onSubmit,
}: EmployeeModalProps) => {
    const [dobFocused, setDobFocused] = useState(false);
    const [joinFocused, setJoinFocused] = useState(false);

    const isView = mode === "view";
    const title =
        mode === "create"
            ? "Add New Employee"
            : mode === "edit"
                ? "Edit Staff Member"
                : "View Employee Details";

    return (
        <Dialog
            disableRestoreFocus
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            slotProps={{
                paper: { sx: { borderRadius: 2, bgcolor: "background.paper" } },
            }}
        >
            <DialogTitle
                sx={{
                    fontWeight: "bold",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "text.primary",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box component="span" sx={{ color: "text.secondary" }}>
                        👤
                    </Box>
                    {title}
                </Box>
                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{ color: "text.secondary" }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 4, bgcolor: "background.default" }}>
                {/* Top Section: Names (Left) and Image (Right) */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 4,
                        mb: 4,
                    }}
                >
                    {/* Left: Names */}
                    <Box
                        sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}
                    >
                        <TextField
                            fullWidth
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={(event) => onChange(event)}
                            required
                            disabled={isView}
                            error={!!errors.firstName}
                            helperText={errors.firstName}

                        />
                        <TextField
                            fullWidth
                            label="Middle Name"
                            name="middleName"
                            value={formData.middleName}
                            onChange={(event) => onChange(event)}
                            disabled={isView}

                        />
                        <TextField
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={onChange}
                            required
                            disabled={isView}
                            error={!!errors.lastName}
                            helperText={errors.lastName}

                        />
                    </Box>

                    {/* Right: Image Upload */}
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{ height: "100%", minHeight: 220 }}>
                            {isView ? (
                                <Box
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: "1px dashed",
                                        borderColor: "divider",
                                        borderRadius: 2,
                                        overflow: "hidden",
                                        p: 1,
                                        bgcolor: "background.paper",
                                    }}
                                >
                                    {formData.image || formData.base64 ? (
                                        <Box
                                            component="img"
                                            src={
                                                formData.base64
                                                    ? formData.base64
                                                    : `${BACKEND_API}/images/user/${formData.image}`
                                            }
                                            alt="Employee"
                                            sx={{
                                                maxWidth: "100%",
                                                maxHeight: "100%",
                                                objectFit: "contain",
                                                borderRadius: 1,
                                            }}
                                        />
                                    ) : (
                                        <Typography sx={{ color: "text.secondary" }}>
                                            No Image
                                        </Typography>
                                    )}
                                </Box>
                            ) : (
                                <ImageDropzone
                                    onImageSelect={onImageSelect}
                                    defaultImage={
                                        mode === "edit" && formData.image && !formData.base64
                                            ? `${BACKEND_API}/images/user/${formData.image}`
                                            : formData.base64
                                    }
                                    title="Upload Employee Image"
                                />
                            )
                            }
                        </Box>
                        {
                            errors.image && (
                                <Typography
                                    variant="caption"
                                    sx={{ color: "error.main", mt: -6, display: "block" }}
                                >Upload a profile image for the employee...
                                </Typography>
                            )
                        }
                    </Box>
                </Box>

                {/* Middle Section 1: Parents & Spouse */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                        gap: 3,
                        mb: 4,
                    }}
                >
                    <TextField
                        fullWidth
                        label="Spouse Name"
                        name="spouseName"
                        value={formData.spouseName}
                        onChange={onChange}
                        required
                        disabled={isView}
                        error={!!errors.spouseName}
                        helperText={errors.spouseName}
                    />
                    {/* {
                        errors.spouseName && (
                            <Typography
                                variant="caption"
                                sx={{ color: "error.main", mt: 0, display: "block" }}
                            >
                                {errors.spouseName}
                            </Typography>
                        )
                    } */}
                    <TextField
                        fullWidth
                        label="Father's Name"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={onChange}
                        required
                        disabled={isView}
                        error={!!errors.fatherName}
                        helperText={errors.fatherName}

                    />
                    <TextField
                        fullWidth
                        label="Mother's Name"
                        name="motherName"
                        value={formData.motherName}
                        onChange={onChange}
                        required
                        disabled={isView}
                        error={!!errors.motherName}
                        helperText={errors.motherName}

                    />
                </Box>

                {/* Middle Section 2: Contact & Role */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                        gap: 3,
                        mb: 4,
                    }}
                >
                    <TextField
                        fullWidth
                        label="Designation"
                        name="designation"
                        value={formData.designation}
                        onChange={onChange}
                        required
                        disabled={isView}
                        error={!!errors.designation}
                        helperText={errors.designation}

                    />
                    <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={onChange}
                        required
                        disabled={isView}
                        error={!!errors.email}
                        helperText={errors.email}

                    />
                    <TextField
                        fullWidth
                        label="Phone Number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={onChange}
                        required
                        disabled={isView}
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber}

                    />
                </Box>

                {/* Bottom Section: Gender, Dates, NID */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(4, 1fr)",
                        },
                        gap: 3,
                    }}
                >
                    <FormControl
                        fullWidth
                        required
                        disabled={isView}

                    >
                        <InputLabel>Gender</InputLabel>
                        <Select
                            name="genderId"
                            value={formData.genderId}
                            label="Gender"
                            onChange={(event) => onChange(event as never)}
                        >
                            <MenuItem value={1}>Male</MenuItem>
                            <MenuItem value={2}>Female</MenuItem>
                            <MenuItem value={3}>Other</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Date of Birth"
                        name="dob"
                        type={dobFocused || formData.dob || isView ? "date" : "text"}
                        onFocus={() => setDobFocused(true)}
                        onBlur={() => setDobFocused(false)}
                        slotProps={{ inputLabel: { shrink: dobFocused || !!formData.dob || isView } }}
                        value={formData.dob}
                        onChange={(event) => onChange(event)}
                        required
                        disabled={isView}
                        error={!!errors.dob}
                        helperText={errors.dob}

                    />

                    <TextField
                        fullWidth
                        label="Date of Join"
                        name="joinDate"
                        type={joinFocused || formData.joinDate || isView ? "date" : "text"}
                        onFocus={() => setJoinFocused(true)}
                        onBlur={() => setJoinFocused(false)}
                        slotProps={{ inputLabel: { shrink: joinFocused || !!formData.joinDate || isView } }}
                        value={formData.joinDate}
                        onChange={(event) => onChange(event)}
                        required
                        disabled={isView}
                        error={!!errors.joinDate}
                        helperText={errors.joinDate}

                    />

                    <TextField
                        fullWidth
                        label="NID Card Number"
                        name="nid"
                        value={formData.nid}
                        onChange={onChange}
                        required
                        disabled={isView}
                        error={!!errors.nid}
                        helperText={errors.nid}

                    />
                </Box>
            </DialogContent>

            <DialogActions
                sx={{
                    p: 3,
                    display: "flex",
                    justifyContent: "flex-end",
                    bgcolor: "background.paper",
                }}
            >
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="inherit"
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        px: 3,
                        color: "text.primary",
                        borderColor: "divider",
                    }}
                >
                    {isView ? "Close" : "Cancel Operation"}
                </Button>
                {!isView && (
                    <Button
                        onClick={onSubmit}
                        variant="contained"
                        color="primary"
                        sx={{ ml: 2, borderRadius: 2, textTransform: "none", px: 3 }}
                    >
                        {mode === "edit" ? "Save Changes" : "Add New Employee"}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default EmployeeModal;
