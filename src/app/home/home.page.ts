import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/auth-service';
import { Services } from '../shared/services';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { User } from '../shared/user';
import { Database } from '../shared/database';

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
  
      userDados: any;

  constructor(
    private auth: AuthService,
    public service: Services,
    private router: Router,
    private database: Database,
    private firestore: AngularFirestore
  ) { 
        const autenticacao = getAuth();
        onAuthStateChanged(autenticacao, (user) => {
          if (user) {
            console.log('Está Logado.');
            this.auth.userUid = user.uid;
            this.userDados = this.firestore.collection('users', ref => ref.
            where('uid', '==', autenticacao.currentUser!.uid)).valueChanges();
            this.getName();
            this.categorias = this.database.categoriasLocal
          }
          else{
            this.router.navigate(['login'])
          }
        });
  }

  async logout(){
      this.auth.SignOut();
    }

    async getName() {

              this.userDados.subscribe((res: User[]) => {

                res.forEach((item) => {
                  this.nome = item.displayName.substring(0, item.displayName.indexOf(' '));
                  this.auth.userData['displayName'] = item.displayName;
                  this.auth.userData['name'] = item.displayName.substring(0, item.displayName.indexOf(' '));
                });
                
              })
            }

  ionViewWillEnter(){
      if(this.auth.userUid?.length<1){
        console.log('Não logado');
        console.log(this.auth.userUid);
      }
      else{
        this.router.navigateByUrl('home');
      }
    }

}
