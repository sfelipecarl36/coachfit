import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeutreinoPageRoutingModule } from './meutreino-routing.module';

import { MeutreinoPage } from './meutreino.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MeutreinoPageRoutingModule
  ],
  declarations: [MeutreinoPage]
})
export class MeutreinoPageModule {}
