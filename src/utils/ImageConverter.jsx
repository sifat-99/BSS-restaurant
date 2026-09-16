import React, { useState, useRef } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * Utility: Encode a File object to a Base64 string
 * @param {File} file
 * @returns {Promise<string>} Base64 data URL
 */
export const encodeImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Utility: Decode a Base64 string to a File object
 * @param {string} base64String
 * @param {string} filename
 * @returns {File}
 */
export const decodeBase64ToFile = (base64String, filename = "image.png") => {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

/**
 * Reusable Image Dropzone Component
 * @param {Object} props
 * @param {function} props.onImageSelect - Callback when an image is selected/dropped. Passes (base64String, file)
 * @param {string} props.defaultImage - Initial Base64 image to display
 * @param {string} props.title - Title for the dropzone
 */
export const ImageDropzone = ({
  onImageSelect,
  defaultImage = null,
  title = "Drag and drop an image here",
}) => {
  const [preview, setPreview] = useState(defaultImage);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileProcess = async (file) => {
    if (file && file.type.startsWith("image/")) {
      if (file.size > 500 * 1024) {
        alert("Image size must be less than 500KB.");
        return;
      }
      try {
        const base64 = await encodeImageToBase64(file);
        setPreview(base64);
        if (onImageSelect) {
          onImageSelect(base64, file);
        }
      } catch (error) {
        console.error("Error encoding image:", error);
      }
    } else {
      alert("Please select a valid image file.");
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const onFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onImageSelect) {
      onImageSelect(null, null);
    }
  };

  return (
    <Box
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => !preview && fileInputRef.current?.click()}
      sx={{
        border: "2px dashed",
        borderColor: isDragging ? "primary.main" : "grey.400",
        borderRadius: 2,
        p: 3,
        textAlign: "center",
        backgroundColor: isDragging ? "action.hover" : "background.paper",
        cursor: preview ? "default" : "pointer",
        position: "relative",
        transition: "all 0.2s ease-in-out",
        minHeight: "200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        "&:hover": {
          borderColor: "primary.main",
          backgroundColor: "action.hover",
        },
      }}
    >
      <input
        type="file"
        accept="image/*"
        hidden
        ref={fileInputRef}
        onChange={onFileSelect}
      />

      {preview ? (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={preview}
            alt="Preview"
            sx={{
              maxWidth: "100%",
              maxHeight: "250px",
              objectFit: "contain",
              borderRadius: 1,
            }}
          />
          <IconButton
            size="small"
            color="error"
            onClick={handleClear}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(255,255,255,0.8)",
              "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ) : (
        <>
          <CloudUploadIcon
            sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.disabled">
            or click to browse
          </Typography>
        </>
      )}
    </Box>
  );
};
