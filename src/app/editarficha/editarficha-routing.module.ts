import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarfichaPage } from './editarficha.page';

const routes: Routes = [
  {
    path: '',
    component: EditarfichaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarfichaPageRoutingModule {}
