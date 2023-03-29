import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {

   }

  ngOnInit() {
  }

  async logar(email: any, senha: any){
    const userVal = this.auth.SignIn(email.value, senha.value);
    if (await userVal){
      this.router.navigateByUrl('home');
    }
  }

}
