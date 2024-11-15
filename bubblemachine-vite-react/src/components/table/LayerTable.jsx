import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ColorPickerCell from "./ColorPickerCell";
import useBubbleStore from "../zustand/bubbleStore.jsx";
import { convertToMilliseconds, formatTime } from "../../helpers/utils.jsx";

const LayerTable = ({ layer, bubbles }) => {
  const [validationErrors, setValidationErrors] = useState({});
  const updateBubble = useBubbleStore((state) => state.updateBubble);
  const deleteBubble = useBubbleStore((state) => state.deleteBubble);

  const validateTimeInput = (timeString) => {
    if (!timeString) return false;
    try {
      const milliseconds = convertToMilliseconds(timeString);
      return milliseconds > 0;
    } catch (error) {
      return false;
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "bubbleName",
        header: "Bubble Name",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.bubbleName,
          helperText: validationErrors?.bubbleName,
          size: "small",
        },
      },
      {
        accessorKey: "startTime",
        header: "Start Time",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.startTime,
          helperText: validationErrors?.startTime || "Format: MM:SS:mmm",
          size: "small",
          placeholder: "00:00:000",
        },
      },
      {
        accessorKey: "stopTime",
        header: "Stop Time",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.stopTime,
          helperText: validationErrors?.stopTime || "Format: MM:SS:mmm",
          size: "small",
          placeholder: "00:00:000",
        },
      },
      {
        accessorKey: "color",
        header: "Color",
        Cell: ({ cell, row }) => (
          <ColorPickerCell
            value={cell.getValue()}
            onChange={(newColor) => {
              const updatedBubble = {
                ...row.original,
                color: newColor,
              };
              updateBubble(row.original.id, updatedBubble);
            }}
          />
        ),
        Edit: ({ cell, column, row }) => (
          <ColorPickerCell
            value={cell.getValue()}
            onChange={(newColor) => {
              const updatedValues = {
                ...row._valuesCache,
                [column.id]: newColor,
              };
              row._valuesCache = updatedValues;
            }}
          />
        ),
      },
    ],
    [validationErrors, updateBubble]
  );

  const validateBubble = (bubble) => {
    const errors = {};

    if (!bubble.bubbleName?.trim()) {
      errors.bubbleName = "Name is required";
    }

    if (!validateTimeInput(bubble.startTime)) {
      errors.startTime = "Invalid time format (MM:SS:mmm)";
    }

    if (!validateTimeInput(bubble.stopTime)) {
      errors.stopTime = "Invalid time format (MM:SS:mmm)";
    }

    // Validate that stop time is after start time
    if (!errors.startTime && !errors.stopTime) {
      const startMs = convertToMilliseconds(bubble.startTime);
      const stopMs = convertToMilliseconds(bubble.stopTime);
      if (stopMs <= startMs) {
        errors.stopTime = "Stop time must be after start time";
      }
    }

    return errors;
  };

  const handleSaveBubble = ({ values, table }) => {
    // First validate the bubble
    const newValidationErrors = validateBubble(values);
    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors);
      return;
    }

    try {
      // Ensure all required fields are present
      const updatedBubble = {
        ...values,
        layer, // Keep the current layer
        id: values.id,
        startTime: values.startTime,
        stopTime: values.stopTime,
        bubbleName: values.bubbleName.trim(),
        color: values.color,
      };

      console.log("Saving bubble:", updatedBubble);

      // Update the bubble in the store
      updateBubble(updatedBubble.id, updatedBubble);

      // Clear any validation errors
      setValidationErrors({});

      // Exit edit mode
      table.setEditingRow(null);
    } catch (error) {
      console.error("Error saving bubble:", error);
      setValidationErrors({ submit: "Error saving changes" });
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: bubbles,
    enableEditing: true,
    positionActionsColumn: "last",
    getRowId: (row) => row.id,
    enableToolbarInternalActions: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    muiTableBodyCellProps: {
      sx: { fontSize: "0.875rem" },
    },
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveBubble,
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "0.5rem" }}>
        <Tooltip title="Edit">
          <IconButton
            onClick={() => {
              // Ensure we have a clean copy of the original values
              row._valuesCache = { ...row.original };
              table.setEditingRow(row);
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            color="error"
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this bubble?")
              ) {
                deleteBubble(row.original.id);
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default LayerTable;
