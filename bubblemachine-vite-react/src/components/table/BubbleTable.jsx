import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ColorPickerCell from "./ColorPickerCell";
import useBubbleStore from "../zustand/bubbleStore.jsx";
import { createID, generateRandomColor } from "../../helpers/utils.jsx";

// Time format helper component
const TimeFormatHelper = () => (
  <div className="text-xs text-gray-500 mt-1">
    Format: MM:SS:mmm (e.g., 01:30:000)
  </div>
);

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
        size: 100,
        editVariant: "select",
        editSelectOptions: ["1", "2", "3", "4", "5", "6"],
        muiEditTextFieldProps: {
          select: true,
          error: !!validationErrors?.layer,
          helperText: validationErrors?.layer,
        },
      },
      {
        accessorKey: "bubbleName",
        header: "Name",
        size: 150,
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
        size: 150,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.startTime,
          helperText: validationErrors?.startTime || <TimeFormatHelper />,
          size: "small",
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
              updateBubble(row.original.id, {
                ...row.original,
                color: newColor,
              });
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
    muiTableBodyCellProps: {
      sx: { fontSize: "0.875rem" },
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "0.5rem" }}>
        <Tooltip title="Edit">
          <IconButton
            onClick={() => {
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
    renderTopToolbarCustomActions: ({ table }) => (
      <Button variant="contained" onClick={() => table.setCreatingRow(true)}>
        Create New Bubble
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
