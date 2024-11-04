import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClasesACargoPage } from './clases-a-cargo.page';

const routes: Routes = [
  {
    path: '',
    component: ClasesACargoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClasesACargoPageRoutingModule {}
