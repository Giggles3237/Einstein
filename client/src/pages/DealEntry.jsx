import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DataGrid } from '@mui/x-data-grid'
import { api } from '../services/api'

export default function DealEntry() {
  const qc = useQueryClient()
  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['deals', 'recent'],
    queryFn: () => api.getDeals({ recentDays: 120 })
  })

  const { data: salespeople = [] } = useQuery({
    queryKey: ['salespeople'],
    queryFn: api.getSalespeople
  })

  const { data: fins = [] } = useQuery({
    queryKey: ['financeManagers'],
    queryFn: api.getFinanceManagers
  })

  const spOptions = salespeople.map(s => ({ value: s.id, label: s.name }))
  const fmOptions = fins.map(s => ({ value: s.id, label: s.name }))

  const mutation = useMutation({
    mutationFn: ({ id, changes }) => api.patchDeal(id, changes),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['deals', 'recent'] })
  })

  const columns = [
    { field: 'dealDate', headerName: 'Date', width: 110, valueGetter: ({ value }) => value ? value.slice(0,10) : '' , editable: true },
    { field: 'bank', headerName: 'Bank', width: 110, editable: true },
    { field: 'fundedDate', headerName: 'Funded', width: 110, valueGetter: ({ value }) => value ? value.slice(0,10) : '' , editable: true },
    { field: 'stockNo', headerName: 'Stock #', width: 110, editable: true },
    { field: 'customerName', headerName: 'Customer', width: 180, editable: true },
    { field: 'salespersonName', headerName: 'Salesperson', width: 170, editable: true,
      type: 'singleSelect', valueOptions: spOptions, valueGetter: (p) => p.row.salespersonName },
    { field: 'financeManagerName', headerName: 'F&I', width: 150, editable: true,
      type: 'singleSelect', valueOptions: fmOptions, valueGetter: (p) => p.row.financeManagerName },
    { field: 'fundingNotes', headerName: 'Funding Notes', width: 300, editable: true },
  ]

  const processRowUpdate = async (newRow, oldRow) => {
    const changes = {}
    function toDateOrNull(v) {
      if (!v) return null
      // Accept YYYY-MM-DD or Date object
      if (typeof v === 'string' && v.length >= 10) return v.slice(0,10)
      return v
    }
    if (newRow.dealDate !== oldRow.dealDate) changes.dealDate = toDateOrNull(newRow.dealDate)
    if (newRow.bank !== oldRow.bank) changes.bank = newRow.bank
    if (newRow.fundedDate !== oldRow.fundedDate) changes.fundedDate = toDateOrNull(newRow.fundedDate)
    if (newRow.stockNo !== oldRow.stockNo) changes.stockNo = newRow.stockNo
    if (newRow.customerName !== oldRow.customerName) changes.customerName = newRow.customerName
    if (newRow.salespersonName !== oldRow.salespersonName) {
      const found = spOptions.find(o => o.label === newRow.salespersonName || o.value === newRow.salespersonName)
      changes.salespersonId = found ? found.value : null
    }
    if (newRow.financeManagerName !== oldRow.financeManagerName) {
      const found = fmOptions.find(o => o.label === newRow.financeManagerName || o.value === newRow.financeManagerName)
      changes.financeManagerId = found ? found.value : null
    }
    if (newRow.fundingNotes !== oldRow.fundingNotes) changes.fundingNotes = newRow.fundingNotes

    await mutation.mutateAsync({ id: newRow.id, changes })
    return newRow
  }

  return (
    <div>
      <h3>Deal Entry</h3>
      <p style={{ marginTop: -8, color: '#666' }}>Last 120 days. Inline edit any cell to save.</p>
      <div style={{ height: 650, width: '100%', background: 'white' }}>
        <DataGrid
          rows={deals}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[25,50,100]}
          initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(err) => alert(err.message)}
          getRowId={(row) => row.id}
        />
      </div>
    </div>
  )
}
