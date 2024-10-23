import { useMemo, useState, useCallback } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useBubbleStore from '../zustand/bubbleStore.jsx';
import { createID } from '../../helpers/utils.jsx';

const LayerTable = ({layer}) => {
    const [validationErrors, setValidationErrors] = useState({});
    const bubbles = useBubbleStore((state) => state.bubbles);
    const addBubble = useBubbleStore((state) => state.addBubble);
    const updateBubble = useBubbleStore((state) => state.updateBubble);
    const deleteBubble = useBubbleStore((state) => state.deleteBubble);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                enableEditing: false,
                size: 80,
            },
            {
            accessorKey: 'layer',
            header: 'Layer',
            editVariant: 'select',
            editSelectOptions: ["1", "2", "3", "4", "5", "6"],
            muiEditTextFieldProps: {
                select: true,
                error: !!validationErrors?.layer,
                helperText: validationErrors?.layer,
            },
            },
            {
                accessorKey: 'bubbleName',
                header: 'Bubble Name',
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
                accessorKey: 'startTime',
                header: 'Start Time',
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
                accessorKey: 'stopTime',
                header: 'Stop Time',
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
                accessorKey: 'color',
                header: 'Color',
                editVariant: 'select',
                editSelectOptions: ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink", "Brown", "Gray"],
                muiEditTextFieldProps: {
                    select: true,
                    error: !!validationErrors?.color,
                    helperText: validationErrors?.color,
                },
            },
            
        ],
        [validationErrors]
    );


    const handleCreateBubble = useCallback(async ({ values, table }) => {
        const newValidationErrors = validateBubble(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        values.id = createID();
        console.log('values', values);
        setValidationErrors({});
        addBubble({ ...values });
        table.setCreatingRow(null);
    },[addBubble]);

    const handleSaveBubble = useCallback(async ({ values, table }) => {
        const newValidationErrors = validateBubble(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});    
        const index = bubbles.findIndex((bubble) => bubble.id === values.id);
        if (index !== -1) {
            updateBubble(index, values);
            console.log('Updated bubble at index:', index);
        } else {
            console.error('Bubble not found:', values.id);
        }
        table.setEditingRow(null);
    }, [bubbles, updateBubble]);

    const openDeleteConfirmModal = useCallback((row) => {
        if (window.confirm('Are you sure you want to delete this bubble?')) {
            const index = bubbles.findIndex((bubble) => bubble.id === row.original.id);
            deleteBubble(index);
        }
    }, [bubbles, deleteBubble]);

    const table = useMaterialReactTable({
        columns,
        data: bubbles.filter(bubble => bubble.layer === layer),
        createDisplayMode: 'row',
        editDisplayMode: 'row',
        enableEditing: true,
        positionActionsColumn: 'last',
        initialState: { columnVisibility: { id: false } },
        getRowId: (row) => row.id,
        enableToolbarInternalActions: false,
        enableColumnActions: false,
        enableColumnFilters: false,
        enablePagination: false,
        enableSorting: false,
        muiToolbarAlertBannerProps: undefined,
        muiTableContainerProps: {
            sx: {
                //minHeight: '500px',
            },
        },
        onCreatingRowCancel: () => setValidationErrors({}),
        onCreatingRowSave: handleCreateBubble,
        onEditingRowCancel: () => setValidationErrors({}),
        onEditingRowSave: handleSaveBubble,
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
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
        state: {
            isLoading: false,
            isSaving: false,
            showAlertBanner: false,
            showProgressBars: false,
        },
    });

    return <MaterialReactTable table={table} />;
};

export default LayerTable;

const validateRequired = (value) => String(value).length > 0;
const validateTime = (value) => 
    value !== undefined && 
    value !== null && 
    String(value).length > 0 &&
    String(value).match(/^((0|[0-5][0-9]?)\:)?([0-5][0-9])(:([0-9][0-9][0-9]))?$/);

function validateBubble(bubble) {
    return {
        bubbleName: !validateRequired(bubble.bubbleName)
            ? 'Bubble name is Required'
            : '',
        startTime: !validateTime(bubble.startTime) ? 'Start Time is Required' : '',
        stopTime: !validateTime(bubble.stopTime) ? 'Stop Time is Required' : '',        
    };
}