import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  styled,
  TextField,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ColorPickerCell from "./ColorPickerCell";
import useBubbleStore from "../zustand/bubbleStore.jsx";
import { createID, generateRandomColor } from "../../helpers/utils.jsx";

// Styled components for better UI
const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  borderRadius: "8px",
  transition: "all 0.2s",
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: theme.shadows[4],
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  transition: "all 0.2s",
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

// Smart time input formatter
const formatTimeInput = (value) => {
  if (!value) return "";

  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, "");

  // Handle different lengths
  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 4) {
    return `${numbers.slice(0, 2)}:${numbers.slice(2)}`;
  } else {
    return `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}:${numbers.slice(
      4,
      7
    )}`;
  }
};

// Custom time input component
const TimeInput = ({ value, onChange, error, helperText }) => {
  const [localValue, setLocalValue] = useState(value || "");

  const handleChange = (e) => {
    const newValue = formatTimeInput(e.target.value);
    setLocalValue(newValue);

    // Only trigger onChange when we have a complete time
    const isComplete = /^\d{2}:\d{2}:\d{3}$/.test(newValue);
    if (isComplete) {
      onChange({ target: { value: newValue } });
    }
  };

  return (
    <TextField
      size="small"
      value={localValue}
      onChange={handleChange}
      error={error}
      helperText={helperText}
      placeholder="00:00:000"
      inputProps={{
        style: { fontFamily: "monospace" },
      }}
    />
  );
};

const BubbleTable = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const bubbles = useBubbleStore((state) => state.bubbles);
  const addBubble = useBubbleStore((state) => state.addBubble);
  const updateBubble = useBubbleStore((state) => state.updateBubble);
  const deleteBubble = useBubbleStore((state) => state.deleteBubble);

  const validateTimeFormat = (timeString) => {
    if (!timeString) return false;
    const regex = /^([0-5]?\d):([0-5]\d):(\d{3})$/;
    return regex.test(timeString);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "layer",
        header: "Layer",
        size: 90,
        Edit: ({ row }) => (
          <TextField
            select
            size="small"
            defaultValue={row.original.layer || "1"}
            onChange={(e) => {
              row._valuesCache.layer = e.target.value;
            }}
            sx={{ minWidth: 80 }}
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <MenuItem key={num} value={String(num)}>
                {num}
              </MenuItem>
            ))}
          </TextField>
        ),
        Cell: ({ cell }) => (
          <Box
            sx={{
              bgcolor: "grey.100",
              borderRadius: 1,
              px: 1,
              py: 0.5,
              textAlign: "center",
              width: "fit-content",
            }}
          >
            {cell.getValue() || 1}
          </Box>
        ),
      },
      {
        accessorKey: "bubbleName",
        header: "Name",
        size: 130,
        muiEditTextFieldProps: {
          size: "small",
          error: !!validationErrors?.bubbleName,
          helperText: validationErrors?.bubbleName,
        },
      },
      {
        accessorKey: "startTime",
        header: "Start",
        size: 120,
        Edit: ({ row }) => (
          <TimeInput
            value={row._valuesCache.startTime}
            onChange={(e) => {
              row._valuesCache.startTime = e.target.value;
            }}
            error={!!validationErrors?.startTime}
            helperText={validationErrors?.startTime}
          />
        ),
      },
      {
        accessorKey: "stopTime",
        header: "Stop",
        size: 120,
        Edit: ({ row }) => (
          <TimeInput
            value={row._valuesCache.stopTime}
            onChange={(e) => {
              row._valuesCache.stopTime = e.target.value;
            }}
            error={!!validationErrors?.stopTime}
            helperText={validationErrors?.stopTime}
          />
        ),
      },
      {
        accessorKey: "color",
        header: "Color",
        size: 100,
        Cell: ({ cell, row }) => (
          <ColorPickerCell
            value={cell.getValue() || generateRandomColor()}
            onChange={(newColor) => {
              updateBubble(row.original.id, {
                ...row.original,
                color: newColor,
              });
            }}
          />
        ),
        Edit: ({ cell, column, row, table }) => {
          // Check if we're creating a new row
          const isCreating = table.getState().creatingRow;
          const initialColor = isCreating
            ? generateRandomColor()
            : cell.getValue();

          return (
            <ColorPickerCell
              value={initialColor}
              onChange={(newColor) => {
                row._valuesCache = {
                  ...row._valuesCache,
                  [column.id]: newColor,
                };
                // If we're creating, update the creating row's value
                if (isCreating) {
                  table.setCreatingRow({
                    ...table.getState().creatingRow,
                    [column.id]: newColor,
                  });
                }
              }}
            />
          );
        },
        muiEditTextFieldProps: {
          required: true,
        },
      },
    ],
    [validationErrors, updateBubble]
  );

  const validateBubble = (bubble) => {
    const errors = {};

    if (!bubble.bubbleName?.trim()) {
      errors.bubbleName = "Name is required";
    }

    if (!validateTimeFormat(bubble.startTime)) {
      errors.startTime = "Invalid time format (MM:SS:mmm)";
    }

    if (!validateTimeFormat(bubble.stopTime)) {
      errors.stopTime = "Invalid time format (MM:SS:mmm)";
    }

    return errors;
  };

  const handleCreateBubble = async ({ values, table }) => {
    const newValidationErrors = validateBubble(values);
    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors);
      return;
    }

    const newBubble = {
      id: createID(),
      layer: values.layer || "1",
      bubbleName: values.bubbleName.trim(),
      startTime: values.startTime,
      stopTime: values.stopTime,
      color: generateRandomColor(),
    };

    console.log("Creating new bubble:", newBubble);
    setValidationErrors({});
    addBubble(newBubble);
    table.setCreatingRow(null);
  };

  const handleSaveBubble = async ({ values, table }) => {
    const newValidationErrors = validateBubble(values);
    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors);
      return;
    }

    const updatedBubble = {
      ...values,
      bubbleName: values.bubbleName.trim(),
      layer: values.layer || "1",
    };

    console.log("Updating bubble:", updatedBubble);
    setValidationErrors({});
    updateBubble(values.id, updatedBubble);
    table.setEditingRow(null);
  };

  const table = useMaterialReactTable({
    columns,
    data: bubbles,
    createDisplayMode: "row",
    editDisplayMode: "row",
    enableEditing: true,
    positionActionsColumn: "last",
    getRowId: (row) => row.id,
    enableToolbarInternalActions: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    enableTopToolbar: true,
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
      },
    },
    muiTableProps: {
      sx: {
        tableLayout: "fixed",
      },
    },
    muiTableBodyRowProps: {
      sx: {
        "&:hover td": {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
        },
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontSize: "0.875rem",
        py: 1,
      },
    },
    renderRowActions: ({ row, table }) => (
      <Box
        sx={{
          display: "flex",
          gap: "0.5rem",
          opacity: 0.7,
          transition: "opacity 0.2s",
          "&:hover": {
            opacity: 1,
          },
        }}
      >
        {table.getState().editingRow?.id === row.id ? (
          <>
            <ActionButton
              onClick={() => table.setEditingRow(null)}
              color="error"
              size="small"
            >
              <Tooltip title="Cancel">
                <CancelIcon />
              </Tooltip>
            </ActionButton>
            <ActionButton
              onClick={() => table.handleSaveRow(row)}
              color="success"
              size="small"
            >
              <Tooltip title="Save">
                <SaveIcon />
              </Tooltip>
            </ActionButton>
          </>
        ) : (
          <>
            <ActionButton
              onClick={() => {
                row._valuesCache = { ...row.original };
                table.setEditingRow(row);
              }}
              size="small"
            >
              <Tooltip title="Edit">
                <EditIcon />
              </Tooltip>
            </ActionButton>
            <ActionButton
              color="error"
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to delete this bubble?")
                ) {
                  deleteBubble(row.original.id);
                }
              }}
              size="small"
            >
              <Tooltip title="Delete">
                <DeleteIcon />
              </Tooltip>
            </ActionButton>
          </>
        )}
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <StyledButton
        variant="contained"
        onClick={() => table.setCreatingRow(true)}
        startIcon={<AddCircleOutlineIcon />}
        sx={{ m: 1 }}
      >
        Create Bubble
      </StyledButton>
    ),
    //
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateBubble,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveBubble,
  });

  return <MaterialReactTable table={table} />;
};

export default BubbleTable;
