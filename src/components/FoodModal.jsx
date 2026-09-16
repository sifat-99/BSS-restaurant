import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ImageDropzone } from "../utils/ImageConverter";
import { BACKEND_API } from "../api/API";

const FoodModal = ({
  open,
  onClose,
  mode, // 'create', 'edit'
  formData,
  errors = {},
  onChange,
  onImageSelect,
  onSubmit,
  backendError,
  isSubmitting,
}) => {
  const title = mode === "create" ? "Add New Food" : "Edit Food";

  const calculateDiscountedPrice = () => {
    const price = parseFloat(formData.price) || 0;
    const discount = parseFloat(formData.discount) || 0;

    if (formData.discountType === "Percentage") {
      const calculated = price - (price * discount) / 100;
      return calculated > 0 ? calculated.toFixed(2) : "0.00";
    } else if (formData.discountType === "Amount") {
      const calculated = price - discount;
      return calculated > 0 ? calculated.toFixed(2) : "0.00";
    }
    return price.toFixed(2);
  };

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
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: "background.paper" }}>
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
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
          {/* Left Column - Form Fields */}
          <Box
            sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              fullWidth
              label="Food Name"
              name="name"
              value={formData.name}
              onChange={onChange}
              required
              disabled={isSubmitting}
              error={!!errors.name}
              helperText={errors.name}
              sx={{ bgcolor: "background.paper" }}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={onChange}
              multiline
              rows={3}
              disabled={isSubmitting}
              error={!!errors.description}
              helperText={errors.description}
              sx={{ bgcolor: "background.paper" }}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={onChange}
                required
                disabled={isSubmitting}
                error={!!errors.price}
                helperText={errors.price}
                sx={{ bgcolor: "background.paper" }}
              />
              <TextField
                fullWidth
                select
                label="Discount Type"
                name="discountType"
                value={formData.discountType || "None"}
                onChange={onChange}
                disabled={isSubmitting}
                sx={{ bgcolor: "background.paper" }}
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="Percentage">Percentage</MenuItem>
                <MenuItem value="Amount">Amount</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Discount Value"
                name="discount"
                type="number"
                value={formData.discount}
                onChange={onChange}
                disabled={isSubmitting}
                error={!!errors.discount}
                helperText={errors.discount}
                sx={{ bgcolor: "background.paper" }}
              />
              <TextField
                fullWidth
                label="Discounted Price"
                value={`৳${calculateDiscountedPrice()}`}
                disabled
                sx={{
                  bgcolor: "background.paper",
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "primary.main",
                    fontWeight: "bold",
                  },
                }}
              />
            </Box>
          </Box>

          {/* Right Column - Image Upload */}
          <Box sx={{ width: { xs: "100%", md: "300px" } }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Food Image
            </Typography>
            <ImageDropzone
              onImageSelect={onImageSelect}
              defaultImage={
                formData.image
                  ? `${BACKEND_API}/images/food/${formData.image}`
                  : null
              }
              disabled={isSubmitting}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: "background.paper" }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          disabled={isSubmitting}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
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
              : "Add Food"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FoodModal;
