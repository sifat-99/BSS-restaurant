import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    IconButton,
    Alert,
    CircularProgress,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ImageDropzone } from "../utils/ImageConverter";
import { BACKEND_API } from "../api/API";

interface TableModalProps {
    open: boolean;
    onClose: () => void;
    mode: "create" | "edit";
    formData: {
        tableNumber: string;
        numberOfSeats: number;
        image?: string;
        base64?: string;
    };
    errors?: {
        tableNumber?: string;
        numberOfSeats?: string;
        image?: string;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onImageSelect: (base64Image: string) => void;
    onSubmit: () => void;
    backendError?: string | null;
    isSubmitting: boolean;
}

const TableModal = ({
    open,
    onClose,
    mode,
    formData,
    errors = {},
    onChange,
    onImageSelect,
    onSubmit,
    backendError,
    isSubmitting,
}: TableModalProps) => {
    const title = mode === "create" ? "Add New Table" : "Edit Table";

    return (
        <Dialog
            disableRestoreFocus
            open={open}
            onClose={onClose}
            maxWidth="md"
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
                        🍽️
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
                {backendError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {backendError}
                    </Alert>
                )}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 4,
                    }}
                >
                    {/* Left: Table Details */}
                    <Box
                        sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}
                    >
                        <TextField
                            fullWidth
                            label="Table Number / Name"
                            name="tableNumber"
                            value={formData.tableNumber}
                            onChange={onChange}
                            required
                            disabled={isSubmitting}
                            sx={{ bgcolor: "background.paper" }}
                        />
                        {errors.tableNumber && (
                            <Typography color="error" sx={{ mt: -2 }}>
                                {errors.tableNumber}
                            </Typography>
                        )}
                        <TextField
                            fullWidth
                            label="Number of Seats (Capacity)"
                            name="numberOfSeats"
                            type="number"
                            value={formData.numberOfSeats}
                            onChange={onChange}
                            required
                            disabled={isSubmitting}
                            sx={{ bgcolor: "background.paper" }}
                            slotProps={{ htmlInput: { min: 1 } }}
                        />
                        {errors.numberOfSeats && (
                            <Typography color="error" sx={{ mt: -2 }}>
                                {errors.numberOfSeats}
                            </Typography>
                        )}
                    </Box>

                    {/* Right: Image Upload */}
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{ height: "100%", minHeight: 220 }}

                        >
                            <ImageDropzone
                                onImageSelect={onImageSelect}
                                defaultImage={
                                    mode === "edit" && formData.image && !formData.base64
                                        ? `${BACKEND_API}/images/table/${formData.image}`
                                        : formData.base64 ?? ""
                                }
                                title="Upload Table Image"
                            />
                            {errors.image && (
                                <Typography color="error" sx={{ mt: 2 }}>
                                    {errors.image}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions
                sx={{
                    p: 1.5,
                    display: "flex",
                    justifyContent: "flex-end",
                    bgcolor: "background.paper",
                }}
            >
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="inherit"
                    disabled={isSubmitting}
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        px: 3,
                        color: "text.primary",
                        borderColor: "divider",
                        textWrap: "none",
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onSubmit}
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    startIcon={
                        isSubmitting ? <CircularProgress size={20} color="inherit" /> : null
                    }
                    sx={{ ml: 2, borderRadius: 2, textTransform: "none", px: 3 }}
                >
                    {isSubmitting
                        ? mode === "edit"
                            ? "Saving..."
                            : "Adding..."
                        : mode === "edit"
                            ? "Save Changes"
                            : "Add Table"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TableModal;
