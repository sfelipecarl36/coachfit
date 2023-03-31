import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/auth-service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user: any;
  categorias: any;
  localCat: any;


  slideOpts = { 
    initialSlide: 1, 
    slidesPerView: 2.4,
    speed: 350, 
    effect: 'flip', 
    spaceBetween: 20
    }; 

  slideOptsCat = { 
      initialSlide: 1, 
      slidesPerView: 5,
      speed: 350, 
      effect: 'flip', 
      spaceBetween: 12
      }; 

  constructor(
    private auth: AuthService,
    private router: Router,
    private firestore: AngularFirestore
  ) { 
        this.auth.GuardLogin();
        this.user = this.auth.userData;
        this.user['name'] = this.user['displayName'].substring(0, this.user['displayName'].indexOf(' '));
        
        this.categorias = this.firestore.collection('categorias').valueChanges();

        interface Categoria {
          img: any,
          uid: any,
          nome: any
        }

        this.categorias.subscribe((res: Categoria[]) => {
        
          res.forEach((cat) => {
          console.log(cat);
          });   
        })

  }

  async logout(){
      this.auth.SignOut();
    }

}
