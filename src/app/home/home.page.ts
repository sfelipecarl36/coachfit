import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/auth-service';
import { Services } from '../shared/services';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user: any;
  nome: any = '';
  categorias: any;
  localCat: any;


  slideOpts = { 
    initialSlide: 1, 
    slidesPerView: 2.4,
    speed: 350, 
    effect: 'flip', 
    spaceBetween: 20,
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
    public service: Services,
    private router: Router,
    private firestore: AngularFirestore
  ) { 
        if(this.auth.userData['name'].length>0){
          this.nome = this.auth!.userData['name'];
        }

        else{
          this.router.navigate(['login']);
        }
        
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
