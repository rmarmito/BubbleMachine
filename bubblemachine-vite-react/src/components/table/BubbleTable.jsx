import { useMemo, useState, useRef } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Popper,
  ClickAwayListener,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ChromePicker } from "react-color";
import useBubbleStore from "../zustand/bubbleStore.jsx";
import { createID, generateRandomColor } from "../../helpers/utils.jsx";

// ColorPickerCell component defined within BubbleTable
const ColorPickerCell = ({ value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const anchorRef = useRef(null);

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        ref={anchorRef}
        onClick={() => setShowPicker(!showPicker)}
        sx={{
          width: "36px",
          height: "24px",
          backgroundColor: value || "#fff",
          cursor: "pointer",
          border: "2px solid #fff",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
          borderRadius: "2px",
        }}
      />
      <Popper
        open={showPicker}
        anchorEl={anchorRef.current}
        placement="right-start"
        style={{ zIndex: 9999 }}
      >
        <ClickAwayListener onClickAway={() => setShowPicker(false)}>
          <div>
            <ChromePicker
              color={value || "#fff"}
              onChange={(color) => {
                onChange(color.hex);
              }}
            />
          </div>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

const BubbleTable = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const bubbles = useBubbleStore((state) => state.bubbles);
  const addBubble = useBubbleStore((state) => state.addBubble);
  const updateBubble = useBubbleStore((state) => state.updateBubble);
  const deleteBubble = useBubbleStore((state) => state.deleteBubble);

  const columns = useMemo(
    () => [
      {
        accessorKey: "layer",
        header: "Layer",
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
        header: "Bubble Name",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.bubbleName,
          helperText: validationErrors?.bubbleName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              bubbleName: undefined,
            }),
        },
      },
      {
        accessorKey: "startTime",
        header: "Start Time",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.startTime,
          helperText: validationErrors?.startTime,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              startTime: undefined,
            }),
        },
      },
      {
        accessorKey: "stopTime",
        header: "Stop Time",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.stopTime,
          helperText: validationErrors?.stopTime,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              stopTime: undefined,
            }),
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
              row.setEditingRow({
                ...row._valuesCache,
                [column.id]: newColor,
              });
            }}
          />
        ),
      },
    ],
    [validationErrors, updateBubble]
  );

  const handleCreateBubble = async ({ values, table }) => {
    const newValidationErrors = validateBubble(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    values.id = createID();
    values.color = generateRandomColor(); // Generate random color for new bubbles
    setValidationErrors({});
    addBubble({ ...values });
    table.setCreatingRow(null);
  };
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

  const openDeleteConfirmModal = (row) => {
    if (window.confirm("Are you sure you want to delete this bubble?")) {
      deleteBubble(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: bubbles,
    createDisplayMode: "row",
    editDisplayMode: "row",
    enableEditing: true,
    positionActionsColumn: "last",
    initialState: { columnVisibility: { id: true } },
    getRowId: (row) => row.id,
    enableToolbarInternalActions: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    muiToolbarAlertBannerProps: undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: "500px",
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateBubble,
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
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        Create New Bubble
      </Button>
    ),
    state: {
      isLoading: false,
      isSaving: false,
      showAlertBanner: false,
      showProgressBars: false,
    },
  });

  return <MaterialReactTable table={table} />;
};

export default BubbleTable;

const validateRequired = (value) => String(value).length > 0;
const validateTime = (value) =>
  value !== undefined &&
  value !== null &&
  String(value).length > 0 &&
  String(value).match(
    /^((0|[0-5][0-9]?)\:)?([0-5][0-9])(:([0-9][0-9][0-9]))?$/
  );

function validateBubble(bubble) {
  return {
    bubbleName: !validateRequired(bubble.bubbleName)
      ? "Bubble name is Required"
      : "",
    startTime: !validateTime(bubble.startTime) ? "Start Time is Required" : "",
    stopTime: !validateTime(bubble.stopTime) ? "Stop Time is Required" : "",
  };
}
