import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthService } from './shared/auth-service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent{
  public selectedIndex = 0;
  public user: any;
  
  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private auth: AuthService,
  ) {
    
  }

  }
