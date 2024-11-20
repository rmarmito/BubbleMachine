import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, IconButton, Tooltip, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import useCommentsStore from "../zustand/commentsStore";
import { formatTime, convertToSeconds } from "../../helpers/utils";

const CommentsTable = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const comments = useCommentsStore((state) => state.comments);
  const updateComment = useCommentsStore((state) => state.updateComment);
  const deleteComment = useCommentsStore((state) => state.deleteComment);

  const validateTimeFormat = (timeString) => {
    if (!timeString) return false;
    const regex = /^([0-5]?\d):([0-5]?\d):(\d{3})$/;
    return regex.test(timeString);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "startTime",
        header: "Start Time",
        size: 100,
        Cell: ({ cell }) => formatTime(cell.getValue()),
        Edit: ({ row }) => (
          <TextField
            size="small"
            defaultValue={formatTime(row.original.startTime)}
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
        size: 100,
        Cell: ({ cell }) => formatTime(cell.getValue()),
        Edit: ({ row }) => (
          <TextField
            size="small"
            defaultValue={formatTime(row.original.endTime)}
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
        muiEditTextFieldProps: {
          size: "small",
          multiline: true,
          minRows: 2,
          maxRows: 4,
          onKeyDown: (e) => {
            // Stop propagation of arrow keys
            if (
              ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
                e.key
              )
            ) {
              e.stopPropagation();
            }
            // Keep the Ctrl+Enter save functionality
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              const table = document.querySelector(".MuiTable-root");
              const saveButton = table.querySelector('[aria-label="Save"]');
              if (saveButton) {
                saveButton.click();
              }
            }
          },
        },
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
      text: values.text.trim(),
    };

    console.log("Updating comment:", updatedComment);
    setValidationErrors({});
    updateComment(values.id, updatedComment);
    table.setEditingRow(null);
  };
  // This component can be used in both BubbleTable and CommentsTable

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

    const handleKeyDown = (e) => {
      // Stop propagation of all arrow keys to prevent table navigation
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.stopPropagation();
      }
    };

    return (
      <TextField
        size="small"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        error={error}
        helperText={helperText}
        placeholder="00:00:000"
        inputProps={{
          style: { fontFamily: "monospace" },
        }}
      />
    );
  };

  const table = useMaterialReactTable({
    columns,
    data: comments,
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
            <IconButton
              onClick={() => table.setEditingRow(null)}
              color="error"
              size="small"
            >
              <Tooltip title="Cancel">
                <CancelIcon />
              </Tooltip>
            </IconButton>
            <IconButton
              onClick={() => table.handleSaveRow(row)}
              color="success"
              size="small"
            >
              <Tooltip title="Save">
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
            >
              <Tooltip title="Delete">
                <DeleteIcon />
              </Tooltip>
            </IconButton>
          </>
        )}
      </Box>
    ),

    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveComment,
  });

  return <MaterialReactTable table={table} />;
};

export default CommentsTable;
