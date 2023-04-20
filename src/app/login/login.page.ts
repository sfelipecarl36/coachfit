import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth-service';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';

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
    private firestore: AngularFirestore
  ) {

   }

  ngOnInit() {
  }

  async logar(email: any, senha: any){
    const userVal = this.auth.SignIn(email.value, senha.value);
    if (await userVal){
      const autenticacao = getAuth();
      setPersistence(autenticacao, browserSessionPersistence);
      this.router.navigateByUrl('home');
    }
  }

}
