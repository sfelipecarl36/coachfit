import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'slide1',
    pathMatch: 'full'
  },

  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },

  {
    path: 'slide1',
    loadChildren: () => import('./slideshows/slide1/slide1.module').then( m => m.Slide1PageModule)
  },
  {
    path: 'slide2',
    loadChildren: () => import('./slideshows/slide2/slide2.module').then( m => m.Slide2PageModule)
  },
  {
    path: 'slide3',
    loadChildren: () => import('./slideshows/slide3/slide3.module').then( m => m.Slide3PageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
