import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Slide2Page } from './slide2.page';

const routes: Routes = [
  {
    path: '',
    component: Slide2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Slide2PageRoutingModule {}
