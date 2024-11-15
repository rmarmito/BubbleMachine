import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, IconButton, Tooltip, MenuItem } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useBubbleStore from "../zustand/bubbleStore";
import { createID } from "../../helpers/utils";

// Time validation function
const validateTime = (value) => {
  if (!value) return false;
  return String(value).match(
    /^((0|[0-5][0-9]?)\:)?([0-5][0-9])(:([0-9][0-9][0-9]))?$/
  );
};

const BubbleTable = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const { bubbles, addBubble, updateBubble, deleteBubble } = useBubbleStore();

  // Time format helper component
  const TimeFormatHelper = () => (
    <div className="text-xs text-gray-500 mt-1">
      Format: MM:SS:mmm (e.g., 01:30:000)
    </div>
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "layer",
        header: "Layer",
        size: 100,
        muiEditTextFieldProps: {
          select: true,
          error: !!validationErrors?.layer,
          helperText: validationErrors?.layer,
        },
        Edit: ({ row }) => (
          <select
            value={row._valuesCache.layer || "1"}
            onChange={(e) => {
              const newValue = e.target.value;
              // Update both the editing cache and the row values
              row._valuesCache.layer = newValue;
              row
                .getAllCells()
                .find((cell) => cell.column.id === "layer")
                .setValue(newValue);
            }}
            className="w-full p-2 border rounded"
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={String(num)}>
                Layer {num}
              </option>
            ))}
          </select>
        ),
        Cell: ({ cell }) => `Layer ${cell.getValue() || 1}`,
      },
      {
        accessorKey: "bubbleName",
        header: "Name",
        size: 150,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.bubbleName,
          helperText: validationErrors?.bubbleName,
        },
      },
      {
        accessorKey: "startTime",
        header: "Start Time",
        size: 150,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.startTime,
          helperText: validationErrors?.startTime || <TimeFormatHelper />,
          placeholder: "00:00:000",
        },
      },
      {
        accessorKey: "stopTime",
        header: "Stop Time",
        size: 150,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.stopTime,
          helperText: validationErrors?.stopTime || <TimeFormatHelper />,
          placeholder: "00:00:000",
        },
      },
    ],
    [validationErrors]
  );

  const validateBubble = (bubble) => {
    const errors = {};
    if (!bubble.bubbleName?.trim()) {
      errors.bubbleName = "Name is required";
    }
    if (!validateTime(bubble.startTime)) {
      errors.startTime = "Invalid time format (MM:SS:mmm)";
    }
    if (!validateTime(bubble.stopTime)) {
      errors.stopTime = "Invalid time format (MM:SS:mmm)";
    }
    return errors;
  };

  const handleCreateBubble = ({ values, table }) => {
    const newValidationErrors = validateBubble(values);
    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors);
      return;
    }

    const newBubble = {
      id: createID(),
      layer: values.layer || "1",
      bubbleName: values.bubbleName,
      startTime: values.startTime,
      stopTime: values.stopTime,
    };

    addBubble(newBubble);
    setValidationErrors({});
    table.setCreatingRow(null);
  };

  const handleSaveBubble = ({ values, table }) => {
    const newValidationErrors = validateBubble(values);
    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors);
      return;
    }

    // Ensure we're passing all values including the layer
    const updatedValues = {
      ...values,
      layer: values.layer || "1", // Fallback to "1" if layer is somehow undefined
    };

    console.log("Saving bubble with values:", updatedValues); // Debug log
    updateBubble(values.id, updatedValues);
    setValidationErrors({});
    table.setEditingRow(null);
  };

  const table = useMaterialReactTable({
    columns,
    data: bubbles,
    enableEditing: true,
    enableRowSelection: false,
    createDisplayMode: "row",
    editDisplayMode: "row",
    positionActionsColumn: "last",
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: true,
    muiTableBodyCellProps: {
      sx: { fontSize: "0.875rem" },
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "0.5rem" }}>
        <Tooltip title="Edit">
          <IconButton
            onClick={() => {
              // Ensure we have the current layer value when starting to edit
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
            onClick={() => deleteBubble(row.original.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button variant="contained" onClick={() => table.setCreatingRow(true)}>
        Create Bubble
      </Button>
    ),
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateBubble,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveBubble,
  });

  return <MaterialReactTable table={table} />;
};

export default BubbleTable;
