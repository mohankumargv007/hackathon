import React from 'react';
import next from 'next';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';

import {
  randomCreatedDate,
  randomTraderName,
  randomEmail,
  randomUpdatedDate,
} from '@mui/x-data-grid-generator';

export default function Table(props) {
    const columns = props.columns;
    const rows = props.data;

    return (
        <div style={{ height: 400, width: '100%' }}>
        <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pinnedColumns: { left: ['name'], right: ['actions'] } }}
        />
        </div>
    );
}