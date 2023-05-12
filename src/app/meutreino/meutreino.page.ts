import { Component, OnInit } from '@angular/core';
import { Services } from '../shared/services';
import { Database } from '../shared/database';
import { AuthService } from '../shared/auth-service';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { subexercicioI } from '../model/subexercicios';
import { fichaI } from '../model/fichas';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-meutreino',
  templateUrl: './meutreino.page.html',
  styleUrls: ['./meutreino.page.scss'],
})
export class MeutreinoPage implements OnInit {

  fichas!: Observable<Array<fichaI>>;
  exercicios!: Observable<Array<subexercicioI>>;
  categorias!: any;
  exerciciosBanco!: any;

  constructor(
    public service: Services,
    private router: Router,
    private firestore: AngularFirestore,
    public database: Database,
    private auth: AuthService,
    private loadingController: LoadingController
  ) {

  }

  async ngOnInit() {
      this.exerciciosBanco = this.database!.exerciciosLocal
      this.categorias = this.database!.categoriasLocal
      const loading = await this.loadingController.create({
        message: 'Carregando Fichas',
        spinner: 'circular',
        duration: 1500,
      });
  
      loading.present();
      setTimeout(() => {
        this.fichas = this.database.fichasLocal
        this.exercicios = this.database!.subexerciciosLocal
      },1500);
      
  }

  ionViewWillEnter () {
      this.database.atualizaValores()
  }

  detalharFicha(ficha: any, ficharotulo: any) {
    setTimeout(() => this.router.navigate(['detalhesficha'],{
      queryParams: [ficha, ficharotulo]
      }),150);
  }

}
