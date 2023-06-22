import { Component } from '@angular/core';
import { AuthService } from '../shared/auth-service';
import { Services } from '../shared/services';
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
      categoriasSubscription: any;

  constructor(
    private auth: AuthService,
    private database: Database,
    public service: Services,
  ) {}

  async logout(){
      this.auth.SignOut()
    }

    ngOnInit() {
      this.auth.getUser().then((user) => {
        this.nome = user.nome;
      }).catch((error) => {
        console.error('Erro ao obter dados do usuário:', error);
      });

      this.categoriasSubscription = this.database.getCategorias().subscribe(categorias => {
        this.categorias = categorias
    })
    }

}
