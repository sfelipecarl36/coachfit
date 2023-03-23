import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Slide3PageRoutingModule } from './slide3-routing.module';

import { Slide3Page } from './slide3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Slide3PageRoutingModule
  ],
  declarations: [Slide3Page]
})
export class Slide3PageModule {}
