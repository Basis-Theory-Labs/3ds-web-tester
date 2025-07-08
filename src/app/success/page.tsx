"use client";

import { useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

export default function SuccessPage() {
  useEffect(() => {
    // Send success message to parent window
    if (window.opener) {
      window.opener.postMessage({
        type: '3ds-result',
        result: 'success'
      }, window.location.origin);
      
      // Close this popup window
      window.close();
    }
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      gap={2}
    >
      <CircularProgress />
      <Typography variant="h6">3DS Authentication Successful</Typography>
      <Typography variant="body2" color="text.secondary">
        This window will close automatically...
      </Typography>
    </Box>
  );
} 