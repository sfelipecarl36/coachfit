import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SlideshowPage } from './slideshow.page';

const routes: Routes = [
  {
    path: '',
    component: SlideshowPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SlideshowPageRoutingModule {}
