import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Slide1PageRoutingModule } from './slide1-routing.module';

import { Slide1Page } from './slide1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Slide1PageRoutingModule
  ],
  declarations: [Slide1Page]
})
export class Slide1PageModule {}
