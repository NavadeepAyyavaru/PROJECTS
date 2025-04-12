import { InvoiceItems } from 'src/app/invoice-items';
import { Company } from 'src/app/company';
import { Component, Input, OnInit } from '@angular/core';
import { TableDataService } from './../../services/table-data.service';
import { TableInterface } from '../../models/table-interface';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddItemDialogComponent } from '../../add-item-dialog/add-item-dialog.component';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { FormControl } from '@angular/forms';



@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.css']
})
export class AddFormComponent implements OnInit {


  isGoods: boolean= true;
  loading: boolean= true;

  invoiceDataSource = new MatTableDataSource<InvoiceItems>([]);

  companies : Company[] = [];
  filteredItems: { idCompany: number; name: string }[] = []; 
  myControl = new FormControl();
  filteredOptions: Observable<string[]> = of([]);                         

  displayColumns: string[] = ['itemDetails', 'qty', 'unitPrice', 'gstTax', 'discountValue', 'action'];

  invoiceItems: InvoiceItems[] = Array.isArray(this.invoiceDataSource.data) ? this.invoiceDataSource.data : [];
 


  
  @Input() isEditMode: boolean = false;
  selectedData: TableInterface | null = null;
  selectedCompany: string = '';
  selectedCompanyCompanyId: number = 0; 
  amount: number = 0; 
  totalAmount: number = 0; 
  createdOn: string = ''; 
  remarks: string = ''; 
  taxAmount: number = 0; 
  status: number = 0; 
  paymentReceived: number = 0; 
  createdBy: number = 2; 
  createdByUserName: string = '';


  dataSource = new MatTableDataSource<TableInterface>([]);

  constructor(
    private tableDataService: TableDataService,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private dialog:MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchCompanies();
    this.loadTableData();
    // this.submitForm();
    // this.fetchInvoiceItems();
    
  

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.tableDataService.getTableData().subscribe(data => {

        this.dataSource.data = data;
        this.selectedData = data.find(item => item.companyCompanyId === +id) || null;
        if (this.selectedData) {
          // this.selectedCompany = this.companies.find(c => c.idCompany === this.selectedData?.CompanyCompanyId)?.idCompany || this.companies[0]?.idCompany || 0; 
          // Inside ngOnInit (or wherever the assignment happens)
          const company = this.companies.find(c => c.idCompany === this.selectedData?.companyCompanyId);
          this.selectedCompany = company ? company.name : '';

          this.amount = this.selectedData.amount;
          this.totalAmount = this.selectedData.totalAmount;
          this.createdOn = this.selectedData.createdOn;
        }
      });
    }

  }


 

  fetchCompanies(): void {
    this.tableDataService.getAllCompanies().subscribe(
      (companies: Company[]) => {
        this.companies = companies;

        if (this.companies.length > 0) {
          
          if (this.isEditMode && this.selectedData) {
            const company = this.companies.find(c => c.idCompany === this.selectedData?.companyCompanyId);
            if (company) {
              this.selectedCompanyCompanyId = company.idCompany;
              this.selectedCompany = company.name;
            } 
        }
      }
  });
  }
  
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.filteredItems
      .map(item => item.name) 
      .filter(name => name.toLowerCase().includes(filterValue));
  }

 

  loadTableData(): void {
    this.tableDataService.getTableData().subscribe(data => {
      this.dataSource.data = data.map(item => {
        const company = this.companies.find(c => c.idCompany === item.companyCompanyId);
        if (company) {
          item.companyName = company.name;

        }
        return item;
      });
      console.log("Data is added and companies are merged");
    });
  }

  onCompanySelect(company: Company): void {
    this.selectedCompany = company.name;
    this.selectedCompanyCompanyId = company.idCompany; 
  }
  
  submitForm(): void {
    const formData: TableInterface = {
      companyCompanyId: this.selectedCompanyCompanyId,
      companyName: this.selectedCompany,
      amount: this.amount,
      totalAmount: this.totalAmount,
      createdOn: this.createdOn,
      remarks: this.remarks,
      status: this.status,
      paymentReceived: this.paymentReceived,
      taxAmount: this.taxAmount,
      createdBy: this.createdBy,
      createdByUserName: this.createdByUserName,
      idInvoice: this.isEditMode && this.selectedData ? this.selectedData.idInvoice : 0
    };
  
    if (this.isEditMode && this.selectedData) {
      this.tableDataService.updateTableData(this.selectedData.companyCompanyId, formData).subscribe(() => {
        this.loadTableData();
        console.log('Data is edited');
        this.router.navigate(['/form']);
      });
    } else {
      this.tableDataService.addTableData(formData).subscribe((response) => {
        console.log('Data is added', response);
        const generatedInvoiceId = response.idInvoice;
        if (!generatedInvoiceId) {
          console.error("Failed to retrieve new Invoice ID!");
          return;
        }
        this.tableDataService.setInvoiceId(generatedInvoiceId);
        
        this.invoiceDataSource.data.forEach((item) => {
          if (!item.invoiceId || item.invoiceId === 0) {
            item.invoiceId = generatedInvoiceId;
          }
        });
  
        
        this.tableDataService.submitInvoiceItemsFromService(this.invoiceDataSource.data).subscribe(() => {
          console.log("Invoice items/services added successfully");
          
          this.router.navigate(['/form']);
        }, (error: any) => {
          console.error("Error adding invoice items/services:", error);
        });
      });
    }
  }
  
  
  

  // updateInvoiceIdForItems(generatedInvoiceId: number) {
  //   if (!generatedInvoiceId) {
  //     console.error("Generated Invoice ID is missing. Cannot update invoice items.");
  //     return;  
  //   }
  
  //   this.invoiceDataSource.data.forEach((item) => {
      
  //     if (item.invoiceId === null || item.invoiceId === 0) {  
  //       item.invoiceId = generatedInvoiceId;  
  //     }
  //   });
  
 
  //   this.tableDataService.updateInvoiceItemsWithInvoiceId(generatedInvoiceId, this.invoiceDataSource.data).subscribe(
  //     (updateResponse) => {
  //       console.log('Invoice ID updated for items/services:', updateResponse);
  //     },
  //     (updateError) => {
  //       console.error('Error updating invoice ID for items/services:', updateError);
  //     }
  //   );
  // }
  
  
  onCompanyNameChange(companyName: string): void {
    const selectedCompany = this.companies.find(c => c.name === companyName);
    if (selectedCompany) {
      this.selectedCompanyCompanyId = selectedCompany.idCompany;  
    }
  }
  
  // get filteredData(): InvoiceItems[] {
  //   return this.invoiceDataSource.data; 
  // }

  get filteredData(): InvoiceItems[] {
    return this.invoiceDataSource.filteredData || this.invoiceDataSource.data; 
  }
  



updateAmounts(): void {
  let amount = 0;
  let totalAmount = 0;

  this.invoiceDataSource.data.forEach(item => {
    const lineTotal = item.qty * item.unitPrice;
    const gstAmount = lineTotal *(Number(item.idGstTax) / 100);
    const itemAmount = lineTotal;
    const itemTotalAmount = itemAmount + gstAmount;

    amount += itemAmount;
    totalAmount += itemTotalAmount;
  });

  this.amount = amount;
  this.totalAmount = totalAmount;
}


openAddItemDialog(): void {
  const dialogRef = this.dialog.open(AddItemDialogComponent, {
    width: '550px',
    data: {
      itemName: 'Some Item',
      serviceName: 'Some Service',
      isGoods: 1 ,
    }
  });

  dialogRef.afterClosed().subscribe((result) => {
    
    if (result) {
      this.invoiceDataSource.data = [...this.invoiceDataSource.data, result];
      console.log('New item added to the table:', result);
      this.updateAmounts();  
    } else {
      console.log(" Dailog is cancelled so no item will be added.");
    }
  });
}
}

