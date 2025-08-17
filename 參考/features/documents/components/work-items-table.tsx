"use client";

import { useState, useEffect, useMemo } from 'react';
import { FileJson, FileText, Trash2, Plus, Percent } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { ExtractWorkItemsOutput } from '@/ai/flows/extract-work-items';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';


type DocumentItem = ExtractWorkItemsOutput['workItems'][0];

interface DocumentItemsTableProps {
  initialData: DocumentItem[];
}

export function DocumentItemsTable({ initialData }: DocumentItemsTableProps) {
  const [data, setData] = useState<DocumentItem[]>(initialData);
  const [previewData, setPreviewData] = useState<DocumentItem[]>(initialData);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [percentage, setPercentage] = useState('');
  const [adjustmentTarget, setAdjustmentTarget] = useState<'unitPrice' | 'totalPrice'>('unitPrice');
  const [roundAfterAdjustment, setRoundAfterAdjustment] = useState(false);
  const [justUpdatedRows, setJustUpdatedRows] = useState<number[]>([]);


  useEffect(() => {
    setData(initialData);
    setPreviewData(initialData);
    setSelectedRows([]);
    setPercentage('');
  }, [initialData]);

  useEffect(() => {
    const percentValue = parseFloat(percentage);
    if (isNaN(percentValue) || percentage.trim() === '' || percentage.endsWith('.')) {
        setPreviewData(data);
        return;
    }

    const multiplier = 1 + percentValue / 100;
    const newPreviewData = data.map((item, index) => {
        if (selectedRows.includes(index)) {
            const newItem = { ...item };
            let newUnitPrice, newPrice;

            if (adjustmentTarget === 'unitPrice') {
                newUnitPrice = item.unitPrice * multiplier;
                newPrice = newUnitPrice * item.quantity;
            } else { // adjustmentTarget === 'totalPrice'
                newPrice = item.price * multiplier;
                newUnitPrice = item.quantity > 0 ? newPrice / item.quantity : 0;
            }
            
            if (roundAfterAdjustment) {
                newItem.unitPrice = Math.round(newUnitPrice);
                newItem.price = Math.round(newPrice);
            } else {
                newItem.unitPrice = parseFloat(newUnitPrice.toFixed(2));
                newItem.price = parseFloat(newPrice.toFixed(2));
            }

            return newItem;
        }
        return item;
    });
    setPreviewData(newPreviewData);
  }, [percentage, selectedRows, adjustmentTarget, data, roundAfterAdjustment]);


  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(data.map((_, index) => index));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (index: number, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, index]);
    } else {
      setSelectedRows(selectedRows.filter((i) => i !== index));
    }
  };

  const handleApplyPercentage = () => {
    setData(previewData);
    setPercentage('');
    setJustUpdatedRows([...selectedRows]);
    setTimeout(() => {
      setJustUpdatedRows([]);
    }, 1000); // Remove flash effect after 1s
  };

  const handleInputChange = (index: number, field: keyof DocumentItem, value: string) => {
    const updateData = (currentData: DocumentItem[]) => {
      const newData = [...currentData];
      const updatedItem = { ...newData[index] };
      
      if (field === 'item') {
        updatedItem.item = value;
      } else {
        const numericValue = parseFloat(value);
        const safeValue = isNaN(numericValue) ? 0 : numericValue;

        if (field === 'quantity') {
          updatedItem.quantity = safeValue;
        } else if (field === 'price') {
          updatedItem.price = safeValue;
        } else if (field === 'unitPrice') {
          updatedItem.unitPrice = safeValue;
        }
        
        if (field === 'quantity' || field === 'unitPrice') {
          const quantity = field === 'quantity' ? safeValue : updatedItem.quantity;
          const unitPrice = field === 'unitPrice' ? safeValue : updatedItem.unitPrice;
          updatedItem.price = parseFloat((quantity * unitPrice).toFixed(2));
        } else if (field === 'price') {
          if (updatedItem.quantity > 0) {
              updatedItem.unitPrice = parseFloat((safeValue / updatedItem.quantity).toFixed(2));
          } else {
              updatedItem.unitPrice = 0;
          }
        }
      }
      
      newData[index] = updatedItem;
      return newData;
    };
    
    const newData = updateData(data);
    setData(newData);
    setPreviewData(newData);
  };
  
  const handleRemoveRow = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
    setPreviewData(newData);
  };

  const handleAddRow = () => {
    const newRow: DocumentItem = {
      item: 'New Item',
      quantity: 1,
      price: 0,
      unitPrice: 0,
    };
    const newData = [...data, newRow];
    setData(newData);
    setPreviewData(newData);
  };

  const totalAmount = useMemo(() => {
    return previewData.reduce((sum, item) => sum + (item.price || 0), 0);
  }, [previewData]);
  
  const exportToCSV = () => {
    const headers = ['Item', 'Quantity', 'Unit Price', 'Price'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => `"${row.item.replace(/"/g, '""')}",${row.quantity},${row.unitPrice},${row.price}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'document-items.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'document-items.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentData = previewData;

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No items were extracted from the document.</p>
        <p className="text-muted-foreground mt-2">You can add items manually below.</p>
        <Button onClick={handleAddRow} className="mt-4" variant="secondary">
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>
    );
  }

  return (
    <div>
      {selectedRows.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 my-4 border rounded-lg bg-card">
          <div className="flex-grow">
            <h3 className="font-semibold">{selectedRows.length} item(s) selected</h3>
            <p className="text-sm text-muted-foreground">Apply a percentage change to selected items.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
             <div className="flex items-center space-x-2">
                <Label htmlFor="adjustment-target" className={adjustmentTarget === 'totalPrice' ? 'text-muted-foreground' : ''}>Unit Price</Label>
                <Switch
                    id="adjustment-target"
                    checked={adjustmentTarget === 'totalPrice'}
                    onCheckedChange={(checked) => setAdjustmentTarget(checked ? 'totalPrice' : 'unitPrice')}
                />
                <Label htmlFor="adjustment-target" className={adjustmentTarget === 'unitPrice' ? 'text-muted-foreground' : ''}>Total Price</Label>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Input
                    type="number"
                    placeholder="e.g. 10 or -5"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    className="w-32"
                    step="0.1"
                    />
                    <Button onClick={handleApplyPercentage}>
                    <Percent className="mr-2 h-4 w-4" />
                    Apply
                    </Button>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="round-checkbox" checked={roundAfterAdjustment} onCheckedChange={(checked) => setRoundAfterAdjustment(checked as boolean)} />
                <Label htmlFor="round-checkbox" className="text-sm font-medium">抹去小數點</Label>
            </div>
          </div>
        </div>
      )}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center px-4">
                 <Checkbox
                  checked={selectedRows.length === data.length && data.length > 0}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                  aria-label="Select all rows"
                />
              </TableHead>
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead className="w-[50%]">Item Description</TableHead>
              <TableHead className="text-right w-[120px]">Quantity</TableHead>
              <TableHead className="text-right w-[150px]">Unit Price</TableHead>
              <TableHead className="text-right w-[150px]">Total Price</TableHead>
              <TableHead className="w-12 p-2"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((row, index) => {
              const percentageOfTotal = totalAmount > 0 ? (row.price / totalAmount) * 100 : 0;
              const isJustUpdated = justUpdatedRows.includes(index);
              
              return (
              <TableRow 
                key={index} 
                className={cn("hover:bg-muted/50", isJustUpdated && 'flash-animation')}
                data-state={selectedRows.includes(index) ? 'selected' : ''}>
                <TableCell className="text-center px-4">
                   <Checkbox
                    checked={selectedRows.includes(index)}
                    onCheckedChange={(checked) => handleSelectRow(index, checked as boolean)}
                    aria-label={`Select row ${index + 1}`}
                  />
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                    <div className='flex items-center justify-center gap-2'>
                        <span>{index + 1}</span>
                         {percentageOfTotal > 0 && (
                           <Badge variant="outline" className='text-xs font-normal'>{percentageOfTotal.toFixed(1)}%</Badge>
                         )}
                    </div>
                </TableCell>
                <TableCell className="p-1">
                  <Input
                    value={row.item}
                    onChange={(e) => handleInputChange(index, 'item', e.target.value)}
                    className="bg-transparent border-0 h-9 focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </TableCell>
                <TableCell className="p-1">
                  <Input
                    type="number"
                    value={row.quantity}
                    onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                    className="text-right bg-transparent border-0 h-9 focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </TableCell>
                <TableCell className="p-1">
                  <Input
                    type="number"
                    value={row.unitPrice}
                    onChange={(e) => handleInputChange(index, 'unitPrice', e.target.value)}
                    className="text-right bg-transparent border-0 h-9 focus-visible:ring-1 focus-visible:ring-ring"
                    step="0.01"
                  />
                </TableCell>
                <TableCell className="p-1">
                  <Input
                    type="number"
                    value={row.price}
                    onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                    className="text-right bg-transparent border-0 h-9 focus-visible:ring-1 focus-visible:ring-ring"
                    step="0.01"
                  />
                </TableCell>
                <TableCell className="p-1 text-center">
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveRow(index)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        <span className="sr-only">Remove row</span>
                    </Button>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-end items-center mt-4">
        <div className="w-full max-w-xs space-y-2">
            <Separator />
            <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-bold text-xl text-primary">
                    ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button onClick={handleAddRow} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Row
        </Button>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="secondary">
            <FileText className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={exportToJSON} variant="secondary">
            <FileJson className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
        </div>
      </div>
    </div>
  );
}
