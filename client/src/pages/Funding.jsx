import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'
import { api } from '../services/api'

export default function Funding() {
  const qc = useQueryClient()
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ['funding','unfunded'],
    queryFn: api.getUnfunded
  })

  const mark = useMutation({
    mutationFn: (id) => api.markFunded(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['funding','unfunded'] })
  })

  const columns = [
    { field: 'daysOut', headerName: 'Days Out', width: 100, type: 'number' },
    { field: 'dealDate', headerName: 'Deal Date', width: 120, valueGetter: ({ value }) => value ? value.slice(0,10) : '' },
    { field: 'bank', headerName: 'Bank', width: 120 },
    { field: 'stockNo', headerName: 'Stock #', width: 110 },
    { field: 'customerName', headerName: 'Customer', width: 200 },
    { field: 'salespersonName', headerName: 'Salesperson', width: 170, valueGetter: (p) => p.row.salespersonName || '' },
    { field: 'financeManagerName', headerName: 'F&I', width: 150, valueGetter: (p) => p.row.financeManagerName || '' },
    { field: 'fundingNotes', headerName: 'Funding Notes', width: 300 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          label="Mark Funded Today"
          showInMenu
          onClick={() => mark.mutate(params.row.id)}
        />
      ]
    }
  ]

  return (
    <div>
      <h3>Funding – Contracts In Transit</h3>
      <p style={{ marginTop: -8, color: '#666' }}>Unfunded deals only. Use the action to mark as funded.</p>
      <div style={{ height: 650, width: '100%', background: 'white' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[25,50,100]}
          initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
          getRowId={(row) => row.id}
        />
      </div>
    </div>
  )
}
