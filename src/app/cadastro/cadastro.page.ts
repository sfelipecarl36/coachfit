import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth-service';
import { Services } from '../shared/services';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastController: ToastController,
    private service: Services
  ) { 

  }

  ngOnInit() {
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Usuário Cadastrado!',
      duration: 1500,
      position: 'middle'
    });

    await toast.present();
  }

  async cadastrar(nomecompleto: any, usuario: any, email: any, senha: any, confirmasenha: any){
    this.service.abrirLoading('Cadastrando')
    if(senha.value==confirmasenha.value){
      this.auth.RegisterUser(nomecompleto.value, usuario.value, email.value, senha.value).then(() => {
        this.presentToast();
        this.service.navegar('login');
        this.service.fecharLoading();
      });
      
    }
  }

}
