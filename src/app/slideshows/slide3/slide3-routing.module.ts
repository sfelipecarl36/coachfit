import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Slide3Page } from './slide3.page';

const routes: Routes = [
  {
    path: '',
    component: Slide3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Slide3PageRoutingModule {}
