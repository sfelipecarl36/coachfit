import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CriafichaPage } from './criaficha.page';

const routes: Routes = [
  {
    path: '',
    component: CriafichaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CriafichaPageRoutingModule {}
