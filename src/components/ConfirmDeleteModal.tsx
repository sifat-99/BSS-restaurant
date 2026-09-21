import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";

interface ConfirmDeleteModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
}

const ConfirmDeleteModal = ({
    open,
    onClose,
    onConfirm,
    title,
    message,
}: ConfirmDeleteModalProps) => {
    return (
        <Dialog
            disableRestoreFocus
            open={open}
            onClose={onClose}
        >
            <DialogTitle>{title || "Confirm Deletion"}</DialogTitle>
            <DialogContent>
                <Typography>
                    {message || "Are you sure you want to delete this item? This action cannot be undone."}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="error" variant="contained">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDeleteModal;
