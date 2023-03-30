import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth-service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { 

  }

  ngOnInit() {
  }

  async cadastrar(nomecompleto: any, usuario: any, email: any, senha: any, confirmasenha: any){
    if(senha.value==confirmasenha.value){
      this.auth.RegisterUser(nomecompleto.value, usuario.value, email.value, senha.value);
    }
  }

}
