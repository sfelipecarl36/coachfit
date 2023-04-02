import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then( m => m.HomePageModule)
      },

      {
        path: 'meutreino',
        loadChildren: () => import('../meutreino/meutreino.module').then( m => m.MeutreinoPageModule)
      },

      {
        path: 'exercicios',
        loadChildren: () => import('../exercicios/exercicios.module').then( m => m.ExerciciosPageModule)
      },

      {
        path: 'criaficha',
        loadChildren: () => import('../criaficha/criaficha.module').then( m => m.CriafichaPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
