import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { AlertTriangle, X } from "lucide-react";

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "#1e1e1e",
          borderRadius: 2,
          minWidth: "320px",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#FAFAD2",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AlertTriangle size={20} color="#ff9800" />
          {title}
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "grey.500" }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography sx={{ color: "grey.300" }}>{message}</Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2, backgroundColor: "#252525" }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: "grey.300",
            borderColor: "grey.700",
            "&:hover": {
              borderColor: "grey.500",
              backgroundColor: "#333",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          variant="contained"
          color="error"
          sx={{
            "&:hover": {
              backgroundColor: "#d32f2f",
            },
          }}
        >
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
