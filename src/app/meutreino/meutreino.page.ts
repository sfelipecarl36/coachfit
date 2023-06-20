import { Component, OnInit } from '@angular/core';
import { Services } from '../shared/services';
import { Database } from '../shared/database';
import { AuthService } from '../shared/auth-service';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { subexercicioI } from '../model/subexercicios';
import { fichaI } from '../model/fichas';
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
  exerciciosSubscription: any;
  categoriasSubscription: any;

  constructor(
    public service: Services,
    private router: Router,
    private firestore: AngularFirestore,
    public database: Database,
    private auth: AuthService,
    private loadingController: LoadingController,
  ) {

  }

  carregarExerciciosPorFicha(): void {
    for (const ficha of this.fichas) {
      this.database.getExerciciosPorFicha(ficha.uid).subscribe((exercicios: any[]) => {
        this.exerciciosPorFicha[ficha.uid] = exercicios;
      });
    }
    setTimeout(() =>{
      this.loadingController.dismiss();
    }, 500)
  }

  ngOnDestroy() {
    if (this.fichasSubscription) {
      this.fichasSubscription.unsubscribe();
    }
  }

  async ngOnInit() {
    
    const loading = await this.loadingController.create({
      message: 'Carregando Fichas',
      spinner: 'circular',
      duration: 10000,
    });
    loading.present();

    this.fichasSubscription = this.database.getFichas().subscribe(fichas => {
      this.fichas = fichas;
      this.carregarExerciciosPorFicha();
    });

    this.exerciciosSubscription = this.database.getExercicios().subscribe(exercicios => {
      this.exerciciosBanco = exercicios
    })
      this.categoriasSubscription = this.database.getCategorias().subscribe(categorias => {
        this.categorias = categorias
      })
  }

  detalharFicha(ficha: any, ficharotulo: any) {
    setTimeout(() => this.router.navigate(['detalhesficha'],{
      queryParams: [ficha, ficharotulo]
      }),150);
  }

}
