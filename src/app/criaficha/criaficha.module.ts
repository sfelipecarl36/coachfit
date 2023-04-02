import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CriafichaPageRoutingModule } from './criaficha-routing.module';

import { CriafichaPage } from './criaficha.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CriafichaPageRoutingModule
  ],
  declarations: [CriafichaPage]
})
export class CriafichaPageModule {}
