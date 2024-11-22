import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, IconButton, Tooltip, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ColorPickerCell from "./ColorPickerCell";
import useBubbleStore from "../zustand/bubbleStore.jsx";
import { convertToMilliseconds, formatTime } from "../../helpers/utils.jsx";

// Time Input Component
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

const TimeInput = ({ value, onChange, error, helperText, label }) => {
  const [localValue, setLocalValue] = useState(value || "");

  const handleChange = (e) => {
    const newValue = formatTimeInput(e.target.value);
    setLocalValue(newValue);

    const isComplete = /^\d{2}:\d{2}:\d{3}$/.test(newValue);
    if (isComplete) {
      onChange({ target: { value: newValue } });
    }
  };

  const handleKeyDown = (e) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      e.stopPropagation();
    }

    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      const saveButton = document.querySelector('[aria-label="Save"]');
      if (saveButton) {
        saveButton.click();
      }
    }
  };

  return (
    <TextField
      label={label}
      size="small"
      value={localValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      error={error}
      helperText={helperText}
      placeholder="MM:SS:sss"
      fullWidth
      inputProps={{
        style: { fontFamily: "monospace" },
      }}
    />
  );
};

const LayerTable = ({ layer, bubbles }) => {
  const [validationErrors, setValidationErrors] = useState({});
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
        accessorKey: "bubbleName",
        header: "Bubble Name",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.bubbleName,
          helperText: validationErrors?.bubbleName,
          size: "small",
          onKeyDown: (e) => {
            if (
              ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
                e.key
              )
            ) {
              e.stopPropagation();
            }
          },
        },
      },
      {
        accessorKey: "startTime",
        header: "Start Time",
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
        header: "Stop Time",
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
              row._valuesCache = {
                ...row._valuesCache,
                [column.id]: newColor,
              };
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

    if (!validateTimeFormat(bubble.startTime)) {
      errors.startTime = "Invalid time format (MM:SS:mmm)";
    }

    if (!validateTimeFormat(bubble.stopTime)) {
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
    editDisplayMode: "row",
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
