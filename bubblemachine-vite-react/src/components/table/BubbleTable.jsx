import React, { useMemo, useState, useCallback } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  useTheme,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import useBubbleStore from "../zustand/bubbleStore.jsx";
import { createID, generateRandomColor } from "../../helpers/utils.jsx";
import ColorPickerCell from "./ColorPickerCell.jsx";

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

const BubbleTable = () => {
  const theme = useTheme();
  const [validationErrors, setValidationErrors] = useState({});
  const bubbles = useBubbleStore((state) => state.bubbles);
  const addBubble = useBubbleStore((state) => state.addBubble);
  const updateBubble = useBubbleStore((state) => state.updateBubble);
  const deleteBubble = useBubbleStore((state) => state.deleteBubble);

  const handleKeyDown = useCallback((e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      const saveButton = document.querySelector('[aria-label="Save"]');
      if (saveButton) {
        saveButton.click();
      }
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

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
        size: 80,
        Edit: ({ row }) => (
          <TextField
            select
            size="small"
            defaultValue={row.original.layer || "1"}
            onChange={(e) => {
              row._valuesCache.layer = e.target.value;
            }}
            sx={{ minWidth: 60 }}
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
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.08)"
                  : "grey.100",
              color: theme.palette.mode === "dark" ? "grey.300" : "grey.800",
              borderRadius: 1,
              px: 1,
              py: 0.5,
              textAlign: "center",
              width: "fit-content",
              minWidth: "30px",
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
      },
    ],
    [theme.palette.mode, validationErrors, updateBubble]
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
      color: values.color || generateRandomColor(),
    };

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

    setValidationErrors({});
    updateBubble(values.id, updatedBubble);
    table.setEditingRow(null);
  };

  const handleBulkDelete = (rows) => {
    if (
      window.confirm(`Are you sure you want to delete ${rows.length} bubbles?`)
    ) {
      rows.forEach((row) => {
        deleteBubble(row.original.id);
      });
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: bubbles,
    createDisplayMode: "row",
    editDisplayMode: "row",
    enableEditing: true,
    positionActionsColumn: "last",
    getRowId: (row) => row.id,

    // Disable all extra features
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    enableRowSelection: false,
    enableColumnOrdering: false,
    enableColumnResizing: false,
    enableHiding: false,
    enableFilters: false,
    enableFullScreen: false,
    enableGlobalFilter: false,

    // Only show density adjustment
    enableDensityToggle: true,
    enableToolbarInternalActions: false,

    // Custom toolbar with just density toggle
    renderTopToolbarCustomActions: undefined,
    renderToolbarInternalActions: ({ table }) => (
      <Box>
        <IconButton
          onClick={() =>
            table.setDensity(
              table.getState().density === "compact" ? "comfortable" : "compact"
            )
          }
        >
          <Tooltip title="Toggle Density">
            {table.getState().density === "compact" ? (
              <TableRowsIcon />
            ) : (
              <ViewHeadlineIcon />
            )}
          </Tooltip>
        </IconButton>
      </Box>
    ),

    // Row action buttons (Edit/Delete)
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "0.5rem" }}>
        {table.getState().editingRow?.id === row.id ? (
          <>
            <IconButton
              onClick={() => table.setEditingRow(null)}
              color="error"
              size="small"
              aria-label="Cancel"
            >
              <Tooltip title="Cancel (Esc)">
                <CancelIcon />
              </Tooltip>
            </IconButton>
            <IconButton
              onClick={() => table.handleSaveRow(row)}
              color="success"
              size="small"
              aria-label="Save"
            >
              <Tooltip title="Save (⌘/Ctrl + Enter)">
                <SaveIcon />
              </Tooltip>
            </IconButton>
          </>
        ) : (
          <>
            <IconButton
              onClick={() => {
                row._valuesCache = { ...row.original };
                table.setEditingRow(row);
              }}
              size="small"
              aria-label="Edit"
            >
              <Tooltip title="Edit">
                <EditIcon />
              </Tooltip>
            </IconButton>
            <IconButton
              color="error"
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to delete this bubble?")
                ) {
                  deleteBubble(row.original.id);
                }
              }}
              size="small"
              aria-label="Delete"
            >
              <Tooltip title="Delete">
                <DeleteIcon />
              </Tooltip>
            </IconButton>
          </>
        )}
      </Box>
    ),

    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "8px",
        border: `1px solid ${theme.palette.divider}`,
        overflow: "hidden",
      },
    },
    muiTableProps: {
      sx: {
        "& .MuiTableCell-root": {
          px: { xs: 1, sm: 2 },
          py: 1,
          whiteSpace: "nowrap",
        },
        "& .MuiTableBody-root .MuiTableCell-root": {
          fontSize: "0.875rem",
        },
      },
    },
    muiTableBodyRowProps: {
      sx: {
        "&:hover td": {
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.04)"
              : "rgba(0, 0, 0, 0.04)",
        },
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontSize: "0.875rem",
        py: 0.75,
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: { xs: "400px", sm: "600px" },
        maxWidth: "100%",
        overflow: "auto",
        "&::-webkit-scrollbar": {
          height: 8,
          width: 8,
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(0, 0, 0, 0.05)",
        },
        "&::-webkit-scrollbar-thumb": {
          borderRadius: 4,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.2)"
              : "rgba(0, 0, 0, 0.2)",
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.3)"
                : "rgba(0, 0, 0, 0.3)",
          },
        },
      },
    },

    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateBubble,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveBubble,
  });

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default BubbleTable;
