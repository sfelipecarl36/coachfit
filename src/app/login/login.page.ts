import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Data, Router } from '@angular/router';
import { AuthService } from '../shared/auth-service';
import { getAuth, setPersistence, browserSessionPersistence, onAuthStateChanged } from 'firebase/auth';
import { Database } from '../shared/database';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  users: any

  constructor(
    private auth: AuthService,
    private router: Router,
    private firestore: AngularFirestore,
    private database: Database,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    const autenticacao = getAuth();
    onAuthStateChanged(autenticacao, (user) => {
      if (user) {
        console.log('Logado');
        this.router.navigateByUrl('home');
        console.log('UserUid2:',this.auth.userUid);
    }
      else{ 
        console.log('Não logado');
        console.log('UserUid:',this.auth.userUid);
    }
  })
   }

  ngOnInit() {
  }

  async logar(email: any, senha: any){

    const loading = await this.loadingController.create({
      spinner: 'circular',
      duration: 12000,
    });

    loading.present();

    this.auth.SignIn(email.value, senha.value)
    .then(async (res) => {
      const autenticacao = getAuth();
      setPersistence(autenticacao, browserSessionPersistence);
      this.database.atualizaValores();
      loading.dismiss()
      this.router.navigateByUrl('home');
      const loading2 = await this.loadingController.create({
        spinner: 'circular',
        duration: 1200,
      });
  
      loading2.present();
    }).catch(async (error) => {
      const alert = await this.alertController.create({
        header: 'Erro ao autenticar',
        message: error.message,
        buttons:[
          {
            text: 'Ok',
            role: 'cancel',
            cssClass: 'alert-cancel',
            handler: () => {
              console.log('Ok');
            }
          }
        ]
      })
      await alert.present()
    })
  }

}
