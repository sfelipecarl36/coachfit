import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarfichaPageRoutingModule } from './editarficha-routing.module';

import { EditarfichaPage } from './editarficha.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarfichaPageRoutingModule
  ],
  declarations: [EditarfichaPage]
})
export class EditarfichaPageModule {}
