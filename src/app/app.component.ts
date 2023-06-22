import { Component } from '@angular/core';
import { AuthService } from './shared/auth-service';
import { AlertController, Platform } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public selectedIndex = 0;
  public user: any;
  
  constructor(
    private platform: Platform,
    private alertCtrl: AlertController,
    private auth: AuthService,
    private navCtrl: NavController,
  ) {
    this.backButtonEvent();

    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('StatusBar') && this.platform.is('android')) {
        StatusBar.setOverlaysWebView({ overlay: true });
        StatusBar.setBackgroundColor({color: '#ffffff'});
        StatusBar.setStyle({ style: Style.Light})
      }
    });
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
