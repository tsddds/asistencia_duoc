import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { IonicModule } from '@ionic/angular'; // Importa IonicModule
import { ChangePasswordComponent } from './change-password.component';

@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [
    CommonModule,
    FormsModule,  
    IonicModule,  
  ],
  exports: [ChangePasswordComponent]
})
export class ChangePasswordModule { }
