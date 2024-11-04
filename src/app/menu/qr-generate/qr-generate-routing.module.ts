import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrGeneratePage } from './qr-generate.page';

const routes: Routes = [
  {
    path: '',
    component: QrGeneratePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrGeneratePageRoutingModule {}
