import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthService } from './shared/auth-service';
import { AlertController, Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public selectedIndex = 0;
  public user: any;
  
  constructor(
    private router: Router,
    private platform: Platform,
    private location: Location,
    private alertCtrl: AlertController,
    private fireAuth: AngularFireAuth,
    private auth: AuthService,
    private navCtrl: NavController,
  ) {
    this.backButtonEvent();
    // StatusBar.setBackgroundColor({color: '#ffffff'});
  }

  backButtonEvent () {
    this.platform.backButton.subscribeWithPriority(10, () => {
        this.navCtrl.back();      
    })
  }

  async backButtonAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Deseja mesmo sair?',
      buttons: [
         {
          text: 'Não',
          role: 'cancel'
         },
         {
          text: 'Sim',
          handler: () => {
            this.auth.SignOut();
          }
         }
      ]
    })

    await alert.present();
  }

  }
