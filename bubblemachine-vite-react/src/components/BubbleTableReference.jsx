import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    { field: 'id', headerName: 'Bubble', width: 100 },
    { field: 'color', headerName: 'Color', width: 200 },
    { field: 'title', headerName: 'Title', width: 300, editable: true },
    { field: 'startTime', headerName: 'Start Time', width: 100, editable: true },
    { field: 'stopTime', headerName: 'Stop Time', width: 100, editable: true },
    { field: 'edit', headerName: '', width: 50 },
    { field: 'deleteBubble', headerName: '', width: 70 },

];

const rows = [
    { id: 1, color: 'red', title: 'Bubble 1', startTime: '0:00', stopTime: '0:10', edit: 'Edit', deleteBubble: 'Delete'},
    { id: 2, color: 'blue', title: 'Bubble 2', startTime: '0:10', stopTime: '0:20', edit: 'Edit', deleteBubble: 'Delete'},
];

export default function LayerTable() {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}