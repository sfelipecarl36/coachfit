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
  userData: any;
  users: any;

  constructor(
    private auth: AuthService,
    private router: Router,
    private firestore: AngularFirestore
  ) { 
      // this.auth.GuardLogin();
      this.userData = JSON.parse(localStorage.getItem('user')!);
      console.log(this.userData);
      
      this.users = this.firestore.collection('users', ref => ref.
      where('uid', '==', auth.userUid)).valueChanges();

      this.users.subscribe((res: User[]) => {

        res.forEach((item) => {
          this.userData['displayName'] = item.displayName;
        });
    })
    console.log(this.userData);
  }

  async logout(){
      this.auth.SignOut();
    }

}
