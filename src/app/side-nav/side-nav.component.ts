import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormInterfaceComponent } from '../form-interface/form-interface.component';
@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent {
  showForm = false;

constructor(private router : Router){

}

  openForm(): void {
console.log('openform is activated');
  if(!this.showForm){
//   this.showForm = true;
this.router.navigate(['/form']);
 }
}

//   closeForm(): void{
//     console.log('close is activated');
//   this.showForm = false;
//  }

}
