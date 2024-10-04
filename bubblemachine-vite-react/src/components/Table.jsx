import { useMemo, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import {
    QueryClient,
    QueryClientProvider,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Data = [{ id: '1', bubbleName: 'Bubble 1', startTime: '00:00', stopTime: '01:00', color: 'Red' },
]

const BubbleTable = () => {
    const [validationErrors, setValidationErrors] = useState();

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                enableEditing: false,
                size: 80,
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
                editSelectOptions: ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink", "Brown", "Black", "White"],
                muiEditTextFieldProps: {
                    select: true,
                    error: !!validationErrors?.color,
                    helperText: validationErrors?.color,
                },
            },
        ],
        [validationErrors]
    );

    const { mutateAsync: createBubble, isPending: isCreatingBubble } =
        useCreateBubble();
    const {
        data: fetchedBubbles = [],
        isError: isLoadingBubblesError,
        isFetching: isFetchingBubbles,
        isLoading: isLoadingBubbles,
    } = useGetBubbles();
    const { mutateAsync: updateBubble, isPending: isUpdatingBubble } =
        useUpdateBubble();
    const { mutateAsync: deleteBubble, isPending: isDeletingBubble } =
        useDeleteBubble();

    const handleCreateBubble = async ({ values, table }) => {
        const newValidationErrors = validateBubble(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        await createBubble(values);
        table.setCreatingRow(null);
    };

    const handleSaveBubble = async ({ values, table }) => {
        const newValidationErrors = validateBubble(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        await updateBubble(values);
        table.setEditingRow(null);
    };

    const openDeleteConfirmModal = (row) => {
        if (window.confirm('Are you sure you want to delete this bubble?')) {
            deleteBubble(row.original.id);
        }
    };

    const table = useMaterialReactTable({
        columns,
        data: fetchedBubbles,
        createDisplayMode: 'row',
        editDisplayMode: 'row',
        enableEditing: true,
        initialState: { columnVisibility: { id: false } },
        getRowId: (row) => row.id,
        muiToolbarAlertBannerProps: isLoadingBubblesError
            ? {
                    color: 'error',
                    children: 'Error loading data',
                }
            : undefined,
        muiTableContainerProps: {
            sx: {
                minHeight: '500px',
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
            isLoading: isLoadingBubbles,
            isSaving: isCreatingBubble || isUpdatingBubble || isDeletingBubble,
            showAlertBanner: isLoadingBubblesError,
            showProgressBars: isFetchingBubbles,
        },
    });

    return <MaterialReactTable table={table} />;
};

function useCreateBubble() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (bubble) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return Promise.resolve();
        },
        onMutate: (newBubbleInfo) => {
            console.log('newBubbleInfo', newBubbleInfo);
            
            queryClient.setQueryData(
                ['bubbles'],
                (prevBubbles) => {
                    const bubbles = prevBubbles || [];
                    return [
                        ...bubbles,
                        {
                            ...newBubbleInfo,
                            id: (Math.random() + 1).toString(36).substring(7),
                        },
                    ]
                }
            );
        },
    });
}

function useGetBubbles() {
    return useQuery({
        queryKey: ['bubbles'],
        queryFn: async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return Promise.resolve(Data);
        },
        refetchOnWindowFocus: false,
    });
}

function useUpdateBubble() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (bubble) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return Promise.resolve();
        },
        onMutate: (newBubbleInfo) => {
            queryClient.setQueryData(['bubbles'], (prevBubbles) =>
                prevBubbles?.map((prevBubble) =>
                    prevBubble.id === newBubbleInfo.id ? newBubbleInfo : prevBubble
                )
            );
        },
    });
}

function useDeleteBubble() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (bubbleId) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return Promise.resolve();
        },
        onMutate: (bubbleId) => {
            queryClient.setQueryData(['bubbles'], (prevBubbles) =>
                prevBubbles?.filter((bubble) => bubble.id !== bubbleId)
            );
        },
    });
}

const queryClient = new QueryClient();

const Table = () => (
    //Put this with your other react-query providers near root of your app
    <QueryClientProvider client={queryClient}>
        <BubbleTable />
    </QueryClientProvider>
);

export default Table;

const validateRequired = (value) => String(value).length > 0;
const validateTime = (value) => 
    value !== undefined && 
    value !== null && 
    String(value).length > 0 &&
    String(value).match(/^((0|[1-9][0-9]?)\:)?([0-5][0-9])(:([0-5][0-9]))?$/);



function validateBubble(bubble) {
    return {
        bubbleName: !validateRequired(bubble.bubbleName)
            ? 'Bubble name is Required'
            : '',
        startTime: !validateTime(bubble.startTime) ? 'Start Time is Required' : '',
        stopTime: !validateTime(bubble.stopTime) ? 'Stop Time is Required' : '',        
    };
}
