import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClasesACargoPageRoutingModule } from './clases-a-cargo-routing.module';

import { ClasesACargoPage } from './clases-a-cargo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClasesACargoPageRoutingModule
  ],
  declarations: [ClasesACargoPage]
})
export class ClasesACargoPageModule {}
