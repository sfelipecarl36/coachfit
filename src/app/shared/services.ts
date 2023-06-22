import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
  })

export class Services {
  
  pageBack: any;
  public loading: any;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private loadingController: LoadingController
  ) 
  
  {}

  public navegar(url: string) {    
    this.pageBack = url;
    setTimeout(() => this.router.navigateByUrl(url),180);
  }

  public voltar() {
    setTimeout(() => this.navCtrl.back(),180);
  }

  public async abrirLoading(message?: string) {
    this.loading = await this.loadingController.create({
      message: message ? message : '',
      spinner: 'circular',
      duration: 12000,
    });
    this.loading.present();
   }
  
  public async fecharLoading() {
    setTimeout(() => {
      this.loading.dismiss();
    }, 500)
   }
    
  }
