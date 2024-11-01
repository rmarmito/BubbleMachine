import React, { useMemo, useState } from "react";
import MaterialReactTable from "material-react-table";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useBubbleStore from "../zustand/bubbleStore.jsx";
import { createID } from "../../helpers/utils.jsx";

const BubbleTable = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const bubbles = useBubbleStore((state) => state.bubbles);
  const addBubble = useBubbleStore((state) => state.addBubble);
  const updateBubble = useBubbleStore((state) => state.updateBubble);
  const deleteBubble = useBubbleStore((state) => state.deleteBubble);

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "Id", enableEditing: false },
      // Other columns...
      {
        accessorKey: "bubbleName",
        header: "Bubble Name",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.bubbleName,
          helperText: validationErrors?.bubbleName,
          onFocus: () =>
            setValidationErrors({ ...validationErrors, bubbleName: undefined }),
        },
      },
      // Add other fields similarly...
    ],
    [validationErrors]
  );

  const handleCreateBubble = async ({ values }) => {
    // Validation logic...
    values.id = createID();
    setValidationErrors({});
    addBubble({ ...values });
  };

  const handleSaveBubble = async ({ values }) => {
    // Validation logic...
    updateBubble(values.id, values);
  };

  return (
    <MaterialReactTable
      columns={columns}
      data={bubbles}
      // Other props...
      renderRowActions={({ row }) => (
        <Box sx={{ display: "flex", gap: "1rem" }}>
          <Tooltip title="Edit">
            <IconButton onClick={() => table.setEditingRow(row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={() => openDeleteConfirmModal(row)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    />
  );
};

export default BubbleTable;
