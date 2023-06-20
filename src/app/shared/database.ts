import { Injectable } from '@angular/core';
import { exercicioI } from '../model/exercicios';
import { subexercicioI } from '../model/subexercicios';
import { categoriaI } from '../model/categorias';
import { Observable, map } from 'rxjs';
import { fichaI } from '../model/fichas';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { subexercicioHistI } from '../model/subexerciciosHist';
import { AuthService } from './auth-service';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class Database {

    public exerciciosLocal: Observable<Array<exercicioI>>;
    public categoriasLocal: Observable<Array<categoriaI>>;
    public subexerciciosLocal!: Observable<Array<subexercicioI>>;
    public fichasLocal!: Observable<Array<fichaI>>;
    public user: any
    public subexerciciosHist!: Observable<Array<subexercicioHistI>>;
    public fichasSubscription: any;
    public loading: any;

  constructor(
    private firestore: AngularFirestore,
    private auth: AuthService,
    private loadingController: LoadingController
  ) {
    this.exerciciosLocal = this.firestore.collection<exercicioI>('exercicios').valueChanges();
    this.categoriasLocal = this.firestore.collection<categoriaI>('categorias').valueChanges();
  }

  public getFichas(): Observable<Array<fichaI>> {
    return this.firestore
      .collection<fichaI>('fichas', ref => ref
      .where('usuario', '==', this.auth.userUid).orderBy('rotulo'))
      .valueChanges()
      .pipe(map((fichas: fichaI[]) => fichas));
  }

  public getExercicios(): Observable<Array<exercicioI>> {
    return this.firestore
      .collection<exercicioI>('exercicios')
      .valueChanges()
      .pipe(map((exercicios: exercicioI[]) => exercicios));
  }

  public getCategorias(): Observable<Array<categoriaI>> {
    return this.firestore
      .collection<categoriaI>('categorias')
      .valueChanges()
      .pipe(map((categorias: categoriaI[]) => categorias));
  }

  public getExerciciosPorFicha(fichaUid: string): Observable<Array<exercicioI>> {
    return this.firestore
      .collection('fichas')
      .doc(fichaUid)
      .collection('exercicio')
      .valueChanges();
  }

  public getFichaPorId(fichaId: string): Observable<fichaI> {
    return this.firestore
      .collection<fichaI>('fichas')
      .doc<fichaI>(fichaId)
      .valueChanges()
      .pipe(
        map((ficha: fichaI | undefined) => {
          if (ficha) {
            return ficha;
          } else {
            throw new Error('Ficha não encontrada.');
          }
        })
      );
  }

  public getExercicioPorId(exercicioId: string): Observable<exercicioI> {
    return this.firestore
      .collection<exercicioI>('exercicios', ref => ref.where('uid', '==', exercicioId))
      .valueChanges()
      .pipe(
        map((exercicios: exercicioI[]) => {
          if (exercicios.length > 0) {
            return exercicios[0];
          } else {
            throw new Error(`Exercício com ID '${exercicioId}' não encontrado`);
          }
        })
      );
  }

  async abrirLoading(message?: string) {
    this.loading = await this.loadingController.create({
      message: message ? message : '',
      spinner: 'circular',
      duration: 10000,
    });
    this.loading.present();
   }
  
  async fecharLoading() {
    setTimeout(() => {
      this.loading.dismiss();
    }, 500)
   }
  

  ngOnInit() {
    
  }
}