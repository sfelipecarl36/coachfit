import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalhesexercicioPageRoutingModule } from './detalhesexercicio-routing.module';

import { DetalhesexercicioPage } from './detalhesexercicio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalhesexercicioPageRoutingModule
  ],
  declarations: [DetalhesexercicioPage]
})
export class DetalhesexercicioPageModule {}
