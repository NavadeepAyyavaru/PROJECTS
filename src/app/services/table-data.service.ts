import { DialogService } from './../dialog-service';
import { DialogItems } from 'src/app/dialogItems';
import { Item } from '../item';
import { InvoiceItems } from '../invoice-items';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { Company } from '../company';
import { Observable } from 'rxjs';
import { TableInterface } from '../models/table-interface';
import { map } from 'rxjs/operators';
import { GstTax } from '../gst-tax';

@Injectable({
  providedIn: 'root',
})
export class TableDataService {
  items: DialogItems[] = [];
  services: DialogService[] = [];

  // private  apiUrl ='http://localhost:3000';


  private invoicesUrl = 'http://127.0.0.1:5003/api/Invoices';
  private companiesUrl = 'http://127.0.0.1:5003/api/Companies';
  private itemUrl='http://127.0.0.1:5003/api/item';
  private addInvoiceItemUrl='http://127.0.0.1:5003/api/Invoices/SetInvoiceItems';
  private GstTaxApiUrl = 'http://127.0.0.1:5003/api/Gsttaxes';
  
  


  private _token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImhhcmkiLCJEZXBhcnRtZW50IjoiU3Ryb2UiLCJyb2xlIjoiMyIsIm5iZiI6MTc0MjcxNjIzNiwiZXhwIjoxNzQyNzUyMjM2LCJpYXQiOjE3NDI3MTYyMzZ9.eXtkXhUvHYAH5hIDZlkqHRDQqPPFTP0AXaJWneYoy4s';

  private invoiceIdSubject = new BehaviorSubject<number | null>(null);
  invoiceId$ = this.invoiceIdSubject.asObservable();

  private selectedCompany: Company | null = null;
  setSelectedCompany(company: Company): void {
  this.selectedCompany = company;
}
  constructor(private http: HttpClient) { }

  getTableData(): Observable<TableInterface[]> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this._token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.get<TableInterface[]>(`${this.invoicesUrl}`, { headers});
  }


  getAllCompanies(): Observable<Company[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
  
    return this.http.get<Company[]>(this.companiesUrl, { headers }).pipe(
      map((companies: Company[]) => {
        
        const uniqueCompanies = [...new Map(companies.map((company) => [company.name, company])).values()];
        return uniqueCompanies;  
      }),
      catchError((error) => {
        console.error('Error fetching companies:', error);
        return throwError(() => new Error('Failed to fetch companies. Please try again.'));
      })
    );
  }
  
  

  addTableData(formData: TableInterface): Observable<TableInterface> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this._token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    return this.http.post<TableInterface>(`${this.invoicesUrl}`, formData, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error adding table data:', error);
        return throwError(error); 
      })
    );
  }
  

  updateTableData( id: number,record: TableInterface): Observable<TableInterface> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this._token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.put<TableInterface>(`${this.invoicesUrl}/${id}`,record,{ headers });
  }


  getAllItems(): Observable<Item[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this._token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
  
    return this.http.get<Item[]>(this.itemUrl, { headers }).pipe(
      map((items: Item[]) => {
        
        const uniqueItems = [...new Map(items.map((Item) => [Item.partnumber, Item])).values()];
        return uniqueItems;  
      }),
      catchError((error) => {
        console.error('Error fetching items', error);
        return throwError(() => new Error('Failed to fetch items. Please try again.'));
      })
    );
  }

getAllGstTaxList(): Observable <GstTax[]>{
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this._token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });
  return this.http.get<GstTax[]>(this.GstTaxApiUrl, { headers }).pipe(
    map((items: GstTax[]) => {
      
      const uniqueItems = [...new Map(items.map((Item) => [Item.name, Item])).values()];
      return uniqueItems;  
    }),
    catchError((error) => {
      console.error('Error fetching items', error);
      return throwError(() => new Error('Failed to fetch items. Please try again.'));
    })
  );
}



  

 
setInvoiceId(invoiceId: number): void {
  console.log("Setting invoiceId:", invoiceId);
  this.invoiceIdSubject.next(invoiceId);
}

getInvoiceId(): number | null {
  const currentId = this.invoiceIdSubject.value; 
  
  return currentId;
}



getSelectedCompanyId(): number {
  
  return this.selectedCompany ? this.selectedCompany.idCompany : 34;  
}
 

submitInvoiceItemsFromService(invoiceItems: InvoiceItems[]): Observable<any> {
  const invoiceId = this.getInvoiceId();
  console.log("Invoice ID in submitInvoiceItemsFromService:", invoiceId);

  if (!invoiceId) {
    console.error("Invoice ID is missing or invalid.");
    return throwError(() => new Error("Invoice ID is missing or invalid."));
  }

 
  const modifiedInvoiceItems = Array.isArray(invoiceItems) ? invoiceItems : [invoiceItems];  

  
  const modifiedItems = modifiedInvoiceItems.map(item => {
    const { itemName, servicesName, ...rest } = item;
    return { ...rest };  
  });

  // const amount = modifiedItems.reduce((sum, item) => sum + (item.unitPrice * item.qty), 0);
  // const taxAmount = amount * 0.1;  
  // const totalAmount = amount + taxAmount;
  // const createdOn = new Date().toISOString();
  // const selectedCompanyId = this.getSelectedCompanyId();

  console.log("Modified Invoice Items:", modifiedItems);

 
  const payload = {
    idInvoice: invoiceId,
  };
  //   createdOn: createdOn,  
  //   createdBy: 2,  
  //   companyCompanyId: selectedCompanyId,  
  //   remarks: "",  
  //   amount: amount, 
  //   taxAmount: taxAmount,  
  //   totalAmount: totalAmount,  
  //   status: 0,  
  //   paymentReceived: 0.0,  
  //   companyCompany: null,  
  //   createdByNavigation: null, 
  //   invoiceitems: modifiedItems  
  // };

  return this.addInvoiceItemsData(invoiceId, payload);  
}



addInvoiceItemsData(invoiceId: number, payload: any): Observable<any> {
  const headers = this.createHeaders();

  
  return this.http.post<any>(`${this.addInvoiceItemUrl}/${invoiceId}`, payload, { headers });
}


private createHeaders(): HttpHeaders {
  return new HttpHeaders({
    'Authorization': `Bearer ${this._token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  });
}

private handleError(error: any): Observable<never> {
  console.error('API Error:', error);
  return throwError(() => new Error('An error occurred. Please try again.'));
}

}
