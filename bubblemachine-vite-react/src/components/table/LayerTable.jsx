import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ColorPickerCell from "./ColorPickerCell"; // Update import
import useBubbleStore from "../zustand/bubbleStore.jsx";

const LayerTable = ({ layer, bubbles }) => {
  const [validationErrors, setValidationErrors] = useState({});
  const updateBubble = useBubbleStore((state) => state.updateBubble);
  const deleteBubble = useBubbleStore((state) => state.deleteBubble);

  const columns = useMemo(
    () => [
      {
        accessorKey: "bubbleName",
        header: "Bubble Name",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.bubbleName,
          helperText: validationErrors?.bubbleName,
        },
      },
      {
        accessorKey: "startTime",
        header: "Start Time",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.startTime,
          helperText: validationErrors?.startTime,
        },
      },
      {
        accessorKey: "stopTime",
        header: "Stop Time",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.stopTime,
          helperText: validationErrors?.stopTime,
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
      },
    ],
    [validationErrors, updateBubble]
  );

  const handleSaveBubble = async ({ values, table }) => {
    const newValidationErrors = validateBubble(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    updateBubble(values.id, values);
    table.setEditingRow(null);
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
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveBubble,
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
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
  });

  return <MaterialReactTable table={table} />;
};

export default LayerTable;
