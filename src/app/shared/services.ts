import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
  })

export class Services {
  
  pageBack: any;

  constructor(
    private router: Router,
    private navCtrl: NavController
  ) 
  
  {}

  public navegar(url: string) {    
    this.pageBack = url;
    setTimeout(() => this.router.navigateByUrl(url),180);
  }

  public voltar() {
    setTimeout(() => this.navCtrl.back(),180);
  }
    
  }
