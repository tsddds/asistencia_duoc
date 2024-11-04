import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./User/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'sign',
    loadChildren: () => import('./User/sign/sign.module').then( m => m.SignPageModule)
  },
  {
    path: 'qr-scan',
    loadChildren: () => import('./menu/qr-scan/qr-scan.module').then( m => m.QrScanPageModule)
  },
  {
    path: 'asignaturas',
    loadChildren: () => import('./menu/asignaturas/asignaturas.module').then( m => m.AsignaturasPageModule)
  },
  {
    path: 'asistencias',
    loadChildren: () => import('./menu/asistencias/asistencias.module').then( m => m.AsistenciasPageModule)
  },
  {
    path: 'cambiar-clave',
    loadChildren: () => import('./menu/cambiar-clave/cambiar-clave.module').then( m => m.CambiarClavePageModule)
  },
  {
    path: 'clases-a-cargo',
    loadChildren: () => import('./menu/clases-a-cargo/clases-a-cargo.module').then( m => m.ClasesACargoPageModule)
  },
  {
    path: 'qr-generate/:id',
    loadChildren: () => import('./menu/qr-generate/qr-generate.module').then( m => m.QrGeneratePageModule)
  },
  






  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
