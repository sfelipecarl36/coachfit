import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Slide2PageRoutingModule } from './slide2-routing.module';

import { Slide2Page } from './slide2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Slide2PageRoutingModule
  ],
  declarations: [Slide2Page]
})
export class Slide2PageModule {}
