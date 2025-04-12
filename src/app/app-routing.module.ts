import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SideNavComponent } from './side-nav/side-nav.component';
import { FormInterfaceComponent } from './form-interface/form-interface.component';
import { AddFormComponent } from './form-interface/add-form/add-form.component';
import { AddItemDialogComponent } from './add-item-dialog/add-item-dialog.component';




const routes: Routes = [
  { path: 'sideNav', component: SideNavComponent},
  { path: 'form', component: FormInterfaceComponent },
  { path: 'add-form', component: AddFormComponent },
  { path: 'edit-form/:id', component: AddFormComponent },
  // { path: 'add-item-dialog', component: AddItemDialogComponent},
  { path: '', redirectTo: '/form', pathMatch: 'full' },
  { path: '', redirectTo: '/add-form', pathMatch: 'full' }
  // { path: 'add-item-dialog', redirectTo: '/add-form', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
