import React from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Zoom,
} from "@mui/material";
import { CheckCircle, X } from "lucide-react";

const NotificationDialog = ({
  open,
  onClose,
  title = "Success",
  message = "Operation completed successfully",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Zoom}
      PaperProps={{
        sx: {
          backgroundColor: "#1e1e1e",
          borderRadius: 2,
          minWidth: "320px",
          maxWidth: "400px",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          position: "relative",
          background: "linear-gradient(45deg, #1E1E2E, #2C3E50)",
        }}
      >
        <CheckCircle size={24} color="#4CAF50" />
        <Typography
          variant="h6"
          sx={{
            color: "#FAFAD2",
            flex: 1,
          }}
        >
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "grey.500",
            "&:hover": {
              color: "grey.300",
            },
          }}
        >
          <X size={20} />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 2, pb: 3 }}>
        <Typography sx={{ color: "grey.300" }}>{message}</Typography>
      </DialogContent>

      {/* Subtle gradient overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          background: `
            radial-gradient(circle at 10% 20%, rgba(78, 158, 231, 0.03) 0%, transparent 20%),
            radial-gradient(circle at 90% 50%, rgba(78, 158, 231, 0.02) 0%, transparent 20%),
            radial-gradient(circle at 30% 80%, rgba(78, 158, 231, 0.03) 0%, transparent 20%)
          `,
          pointerEvents: "none",
        }}
      />
    </Dialog>
  );
};

export default NotificationDialog;
