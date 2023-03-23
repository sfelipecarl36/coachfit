import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Slide1Page } from './slide1.page';

const routes: Routes = [
  {
    path: '',
    component: Slide1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Slide1PageRoutingModule {}
