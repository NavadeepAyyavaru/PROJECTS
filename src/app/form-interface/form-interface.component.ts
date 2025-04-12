import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableDataService } from '../services/table-data.service';
import { TableInterface } from '../models/table-interface';

@Component({
  selector: 'app-form-interface',
  templateUrl: './form-interface.component.html',
  styleUrls: ['./form-interface.component.css']
})
export class FormInterfaceComponent implements OnInit {

  displayedColumns: string[] = ['companyName', 'createdOn', 'amount', 'totalAmount', 'edit', 'delete'];

  datasource: TableInterface[] = [];
  loading: boolean = false;

  constructor(private router: Router, private tableDataService: TableDataService) { }

  ngOnInit(): void {
    this.fetchTableData();
  }

  fetchTableData(): void {
    this.loading = true;
    this.tableDataService.getTableData().subscribe({
      next: (data) => {
        console.log(data);
        this.datasource = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching table data:', error);
        this.loading = false;
      }
    });
  }

  openAddForm() {
    this.router.navigate(['/add-form']);

  }

  openEditForm(data: TableInterface) {
    this.router.navigate(['/edit-form', data.companyCompanyId]);
  }

  deleteTableData(id: number): void {
    // const index = this.datasource.findIndex((item) => item.companyCompanyId === id);
    // // const index=id;
    // if (index !== -1) {
    //   this.datasource.splice(index, 1);
    //   this.tableDataService.deleteTableData(id).subscribe({
    //     next: () => {
    //       console.log('Data deleted successfully');
    //       this.fetchTableData();
    //     },
    //     error: (error) => {
    //       console.error('Error deleting data:', error);
    //     }
    //   });
    // }
  }
}
