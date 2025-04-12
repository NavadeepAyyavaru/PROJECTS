import { Item } from '../item';
import { InvoiceItems } from '../invoice-items';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { TableDataService } from '../services/table-data.service';
import { MatTableDataSource } from '@angular/material/table';
import { GstTax } from '../gst-tax';

@Component({
  selector: 'app-add-item-dialog',
  templateUrl: './add-item-dialog.component.html',
  styleUrls: ['./add-item-dialog.component.css']
})
export class AddItemDialogComponent implements OnInit {
  serviceMappings: { [key: string]: number } = {
    'Project-service': 1,
    'EM-Service': 2,
    'PLC-Service': 3,
    'Site': 4
  };

  isGoods: number = 1;
  items: Item[] = [];
  filteredItems: { idItem: number; partnumber: string }[] = [];
  myControl = new FormControl();
  filteredOptions: Observable<string[]> = of([]);

  GstTaxs: GstTax[] = [];
  filteredGstTaxs: { idTaxTable: number; name: string }[] = [];
  myControlGstTax = new FormControl();
  filteredOptionsGstTax: Observable<{ idTaxTable: number; name: string }[]> = of([]);

  invoiceItems: InvoiceItems[] = [];
  serviceNames: string[] = ['Project-service', 'EM-Service', 'PLC-Service', 'Site'];
  invoiceDataSource = new MatTableDataSource<InvoiceItems>([]);

  constructor(
    public dialogRef: MatDialogRef<AddItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tableDataService: TableDataService
  ) {
    this.isGoods = data?.isGoods !== undefined ? data.isGoods : 1;
    console.log('isGoods value passed to dialog:', this.isGoods);
  }

  ngOnInit(): void {
    console.log('isGoods initialized:', this.isGoods);

    this.addInvoiceItem();
    this.fetchItemsList();
    this.fetchGstTaxList();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
    this.filteredOptionsGstTax = this.myControlGstTax.valueChanges.pipe(
      startWith(''), // Trigger filtering when the input starts
      map(value => this._filterGst(value || '')) // Filter based on input
    );
    
  }

  addInvoiceItem() {
    const newInvoiceItem: InvoiceItems = {
      idInvoiceItems: 0,
      itemId: this.isGoods === 1 ? null : null,
      itemName: null,
      servicesName: null,
      unitPrice: 0,
      qty: 0,
      isGoods: this.isGoods,
      servicesId: this.isGoods === 0 ? null : null,
      description: '',
      idGstTax: '',
      lineTotal: 0,
      isDiscountPercentage: 0,
      discountValue: 0,
      invoiceId: null,
    };

    this.invoiceItems.push(newInvoiceItem);
    console.log('New invoice item added:', newInvoiceItem);
  }

  onRadioChange() {
    if (this.isGoods === 1) {
      this.invoiceItems[0].servicesId = null;
    } else {
      this.invoiceItems[0].itemId = null;
    }
  }

  submitInvoiceItems() {
    const processedItem = { ...this.invoiceItems[0] };

    if (processedItem.isGoods === 1) {
      processedItem.servicesId = null;
    } else {
      processedItem.itemId = null;
    }

    processedItem.lineTotal = processedItem.unitPrice * processedItem.qty;

    this.invoiceDataSource.data = [...this.invoiceDataSource.data, processedItem];
    this.dialogRef.close(processedItem);
  }

  onServiceSelect(index: number) {
    const serviceName = this.invoiceItems[index]?.servicesName;
    if (serviceName) {
      this.invoiceItems[index].servicesId = this.serviceMappings[serviceName];
    }
    console.log('Selected serviceId:', this.invoiceItems[index]?.servicesId);
  }

  onSelectionChange(isGoodsSelected: boolean) {
    this.isGoods = isGoodsSelected ? 1 : 0;
    this.invoiceItems[0].isGoods = this.isGoods;

    if (this.isGoods === 1) {
      this.invoiceItems[0].itemId = null;
      this.invoiceItems[0].servicesId = null;
    } else {
      this.invoiceItems[0].itemId = null;
      this.invoiceItems[0].servicesId = null;
    }

    console.log('Updated isGoods:', this.isGoods, 'Updated itemId:', this.invoiceItems[0].itemId);
  }

  onItemNameChange(partnumber: string, index: number): void {
    const selectedItem = this.filteredItems.find(item => item.partnumber === partnumber);
    if (selectedItem) {
      this.invoiceItems[index].itemId = selectedItem.idItem;
      console.log('Selected Item ID:', selectedItem.idItem);
    } else {
      this.invoiceItems[index].itemId = null;
      console.warn('No matching item found for partnumber:', partnumber);
    }
  }

  onCancel(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.dialogRef.close(null);
  }

  fetchGstTaxList(): void {
    this.tableDataService.getAllGstTaxList().subscribe({
      next: (GstTaxs: GstTax[]) => {
        console.log('Fetched GST Taxes:', GstTaxs); // Log API response
        this.filteredGstTaxs = GstTaxs.map(item => ({
          idTaxTable: item.idTaxTable,
          name: item.name || 'Unknown',
        }));
      },
      error: (error) => {
        console.error('Failed to fetch GST Tax List:', error);
      },
    });
  }
  

  private _filterGst(value: string): { idTaxTable: number; name: string }[] {
    const filterValue = value.toLowerCase();
    return this.filteredGstTaxs.filter(tax => tax.name.toLowerCase().includes(filterValue));
  }

  fetchItemsList(): void {
    this.tableDataService.getAllItems().subscribe({
      next: (items: Item[]) => {
        this.filteredItems = items.map(item => ({
          idItem: item.idItem,
          partnumber: item.partnumber || 'Unknown',
        }));
      },
      error: (error) => {
        console.error('Failed to fetch items:', error);
      },
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.filteredItems
      .map(item => item.partnumber)
      .filter(partnumber => partnumber.toLowerCase().includes(filterValue));
  }
}
