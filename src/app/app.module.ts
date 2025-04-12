import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Added for API calls

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { SideNavComponent } from './side-nav/side-nav.component';
import { FormInterfaceComponent } from './form-interface/form-interface.component';
import { AddFormComponent } from './form-interface/add-form/add-form.component';
import { TableDataService } from './services/table-data.service';
import { AddItemDialogComponent } from './add-item-dialog/add-item-dialog.component';




@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    FormInterfaceComponent,
    AddFormComponent,
    AddItemDialogComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatNativeDateModule,
    MatTableModule,
    FormsModule,
    MatPaginatorModule,
    MatSortModule,
    CommonModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatDialogModule,
    MatToolbarModule,
    MatTabsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatCardModule,
    MatRadioModule,
    MatInputModule,
    MatIconModule,
    RouterModule,
    MatSelectModule,
    MatButtonToggleModule,
    BrowserAnimationsModule
  ],
  providers: [TableDataService],
  bootstrap: [AppComponent]
})
export class AppModule {}
