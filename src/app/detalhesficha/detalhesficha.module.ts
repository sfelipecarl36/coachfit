import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalhesfichaPageRoutingModule } from './detalhesficha-routing.module';

import { DetalhesfichaPage } from './detalhesficha.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalhesfichaPageRoutingModule
  ],
  declarations: [DetalhesfichaPage]
})
export class DetalhesfichaPageModule {}
