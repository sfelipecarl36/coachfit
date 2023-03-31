import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth-service';
import { User } from '../shared/user';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user: any;

  slideOpts = { 
    initialSlide: 1, 
    slidesPerView: 2.4,
    speed: 350, 
    effect: 'flip', 
    }; 

  constructor(
    private auth: AuthService,
    private router: Router,
    private firestore: AngularFirestore
  ) { 
        this.auth.GuardLogin();
        this.user = this.auth.userData;
        this.user['name'] = this.user['displayName'].substring(0, this.user['displayName'].indexOf(' '));
  }

  async logout(){
      this.auth.SignOut();
    }

}
