import { Box, Typography } from "@mui/material";
import React from "react";

const ErrorPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Typography variant="h2">Error 404</Typography>
      <Typography variant="h5">Page Not Found</Typography>
    </Box>
  );
};

export default ErrorPage;
