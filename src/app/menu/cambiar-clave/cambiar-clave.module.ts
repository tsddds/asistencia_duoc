import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CambiarClavePageRoutingModule } from './cambiar-clave-routing.module';

import { CambiarClavePage } from './cambiar-clave.page';
import { ChangePasswordModule } from '../../components/change-password/change-password.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CambiarClavePageRoutingModule,
    ChangePasswordModule
  ],
  declarations: [CambiarClavePage]
})
export class CambiarClavePageModule {}
