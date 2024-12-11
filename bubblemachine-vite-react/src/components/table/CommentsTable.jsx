import React, { useMemo, useState, useCallback } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, IconButton, Tooltip, TextField, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import useCommentsStore from "../zustand/commentsStore";
import { formatTime, convertToSeconds } from "../../helpers/utils";

const formatTimeInput = (value) => {
  if (!value) return "";

  const numbers = value.replace(/\D/g, "");

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

const MAX_COMMENT_LENGTH = 2000;

const CommentsTable = () => {
  const theme = useTheme();
  const [validationErrors, setValidationErrors] = useState({});
  const comments = useCommentsStore((state) => state.comments);
  const updateComment = useCommentsStore((state) => state.updateComment);
  const deleteComment = useCommentsStore((state) => state.deleteComment);

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
        accessorKey: "startTime",
        header: "Start Time",
        size: 120,
        Cell: ({ cell }) => formatTime(cell.getValue()),
        Edit: ({ row }) => (
          <TimeInput
            value={formatTime(row.original.startTime)}
            onChange={(e) => {
              const newValue = convertToSeconds(e.target.value);
              row._valuesCache.startTime = newValue;
            }}
            error={!!validationErrors?.startTime}
            helperText={validationErrors?.startTime}
          />
        ),
      },
      {
        accessorKey: "endTime",
        header: "End Time",
        size: 120,
        Cell: ({ cell }) => formatTime(cell.getValue()),
        Edit: ({ row }) => (
          <TimeInput
            value={formatTime(row.original.endTime)}
            onChange={(e) => {
              const newValue = convertToSeconds(e.target.value);
              row._valuesCache.endTime = newValue;
            }}
            error={!!validationErrors?.endTime}
            helperText={validationErrors?.endTime}
          />
        ),
      },
      {
        accessorKey: "text",
        header: "Comment",
        size: 300,
        Edit: ({ row }) => (
          <TextField
            size="small"
            multiline
            minRows={2}
            maxRows={4}
            error={!!validationErrors?.text}
            helperText={
              validationErrors?.text ||
              `${
                MAX_COMMENT_LENGTH - (row.original?.text?.length || 0)
              } characters remaining`
            }
            defaultValue={row.original.text}
            onChange={(e) => {
              row._valuesCache.text = e.target.value;
            }}
            inputProps={{
              maxLength: MAX_COMMENT_LENGTH,
            }}
            onKeyDown={(e) => {
              if (
                ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
                  e.key
                )
              ) {
                e.stopPropagation();
              }

              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                const saveButton = document.querySelector(
                  '[aria-label="Save"]'
                );
                if (saveButton) {
                  saveButton.click();
                }
              }
            }}
            fullWidth
          />
        ),
      },
    ],
    [validationErrors]
  );

  const validateComment = (comment) => {
    const errors = {};

    if (!validateTimeFormat(formatTime(comment.startTime))) {
      errors.startTime = "Invalid time format (MM:SS:MMM)";
    }

    if (!validateTimeFormat(formatTime(comment.endTime))) {
      errors.endTime = "Invalid time format (MM:SS:MMM)";
    }

    if (!comment.text?.trim()) {
      errors.text = "Comment is required";
    } else if (comment.text.length > MAX_COMMENT_LENGTH) {
      errors.text = `Comment must be ${MAX_COMMENT_LENGTH} characters or less`;
    }

    return errors;
  };

  const handleSaveComment = async ({ values, row, table }) => {
    const newValidationErrors = validateComment(values);
    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors);
      return;
    }

    const updatedComment = {
      ...values,
      text: values.text.trim().slice(0, MAX_COMMENT_LENGTH),
    };

    setValidationErrors({});
    updateComment(values.id, updatedComment);
    table.setEditingRow(null);
  };

  const table = useMaterialReactTable({
    columns,
    data: comments,
    enableEditing: true,
    positionActionsColumn: "last",
    getRowId: (row) => row.id,

    editDisplayMode: "row",
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
    enableDensityToggle: true,
    enableToolbarInternalActions: false,

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
                  window.confirm(
                    "Are you sure you want to delete this comment?"
                  )
                ) {
                  deleteComment(row.original.id);
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

    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveComment,
  });

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default CommentsTable;
