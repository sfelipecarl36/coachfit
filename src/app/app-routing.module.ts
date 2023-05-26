import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { GuardGuard } from './shared/guard.guard';
import { LoginblockGuard } from './shared/loginblock.guard';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'slideshow',
    pathMatch: 'full'
  },

  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },

  {
    path: 'slideshow',
    canActivate: [LoginblockGuard],
    loadChildren: () => import('./slideshow/slideshow.module').then( m => m.SlideshowPageModule)
  },

  {
    path: 'home',
    canActivate: [GuardGuard],
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    canActivate: [LoginblockGuard],
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'cadastro',
    canActivate: [LoginblockGuard],
    loadChildren: () => import('./cadastro/cadastro.module').then( m => m.CadastroPageModule)
  },
  {
    path: 'verify-email',
    loadChildren: () => import('./verify-email/verify-email.module').then( m => m.VerifyEmailPageModule)
  },
  {
    path: 'meutreino',
    loadChildren: () => import('./meutreino/meutreino.module').then( m => m.MeutreinoPageModule)
  },
  {
    path: 'exercicios',
    loadChildren: () => import('./exercicios/exercicios.module').then( m => m.ExerciciosPageModule)
  },
  {
    path: 'criaficha',
    loadChildren: () => import('./criaficha/criaficha.module').then( m => m.CriafichaPageModule)
  },
  {
    path: 'detalhesexercicio',
    loadChildren: () => import('./detalhesexercicio/detalhesexercicio.module').then( m => m.DetalhesexercicioPageModule)
  },
  {
    path: 'detalhesficha',
    loadChildren: () => import('./detalhesficha/detalhesficha.module').then( m => m.DetalhesfichaPageModule)
  },
  {
    path: 'detalhesficha',
    loadChildren: () => import('./detalhesficha/detalhesficha.module').then( m => m.DetalhesfichaPageModule)
  },
  {
    path: 'editarficha',
    loadChildren: () => import('./editarficha/editarficha.module').then( m => m.EditarfichaPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule)
  },





];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
