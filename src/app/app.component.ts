import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent{
  public selectedIndex = 0;
  
  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth
  ) {
    // this.initializeApp();
  }

  // initializeApp() {
      // this.fireAuth.onAuthStateChanged(user => {
        // if (user) {
          // this.router.navigate(['/home']);
        // }
        // else {
         // this.router.navigate(['/login']);
       // }
      // });
    // };
  }
