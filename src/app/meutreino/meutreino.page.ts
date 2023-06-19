import { Component, OnInit } from '@angular/core';
import { Services } from '../shared/services';
import { Database } from '../shared/database';
import { AuthService } from '../shared/auth-service';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { subexercicioI } from '../model/subexercicios';
import { fichaI } from '../model/fichas';
import { FilterPipe } from 'ngx-filter-pipe';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-meutreino',
  templateUrl: './meutreino.page.html',
  styleUrls: ['./meutreino.page.scss'],
})
export class MeutreinoPage implements OnInit {

  fichas!: any;
  exercicios!: Observable<Array<subexercicioI>>;
  exerciciosPorFicha: { [key: string]: any[] } = {};
  categorias!: any;
  exerciciosBanco!: any;
  fichasSubscription: any;

  constructor(
    public service: Services,
    private router: Router,
    private firestore: AngularFirestore,
    public database: Database,
    private auth: AuthService,
    private loadingController: LoadingController,
  ) {

  }

  async carregarFichas() {
    const loading = await this.loadingController.create({
      message: 'Carregando Fichas',
      spinner: 'circular',
      duration: 10000,
    });
    loading.present();
    this.fichasSubscription = this.firestore
      .collection<fichaI>('fichas', ref => ref
      .where('usuario', '==', this.auth.userUid))
      .valueChanges()
      .subscribe((fichas: fichaI[]) => {
        this.fichas = fichas;
        this.carregarExerciciosPorFicha();
      });
  }

  carregarExerciciosPorFicha() {
    for (const ficha of this.fichas) {
      this.firestore
        .collection('fichas')
        .doc(ficha.uid)
        .collection('exercicio')
        .valueChanges()
        .subscribe((exercicios: any[]) => {
          this.exerciciosPorFicha[ficha.uid] = exercicios;
        });
    }

    this.loadingController.dismiss();
  }

  ngOnDestroy() {
    if (this.fichasSubscription) {
      this.fichasSubscription.unsubscribe();
    }
  }

  async ngOnInit() {
      this.carregarFichas()
      this.exerciciosBanco = this.database!.exerciciosLocal
      this.categorias = this.database!.categoriasLocal
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
