import { Injectable, NgZone, OnInit } from '@angular/core';
import { exercicioI } from '../model/exercicios';
import { subexercicioI } from '../model/subexercicios';
import { categoriaI } from '../model/categorias';
import { Observable } from 'rxjs';
import { fichaI } from '../model/fichas';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class Database {

    public exerciciosLocal: Observable<Array<exercicioI>>;
    public categoriasLocal: Observable<Array<categoriaI>>;
    public subexerciciosLocal!: Observable<Array<subexercicioI>>;
    public fichasLocal!: Observable<Array<fichaI>>;
    private router!: Router;
    public user: any

  constructor(
    private firestore: AngularFirestore,
  ) {
    this.exerciciosLocal = this.firestore.collection<exercicioI>('exercicios').valueChanges();
    this.categoriasLocal = this.firestore.collection<categoriaI>('categorias').valueChanges();
  }

  public atualizaValores () {
    const autenticacao = getAuth();
    onAuthStateChanged(autenticacao, (user) => {
          if(user) {
              this.user = user.uid
              this.subexerciciosLocal = this.firestore!.collectionGroup<subexercicioI>('exercicio', ref => ref.where('usuario', '==', this.user)).valueChanges();
              this.fichasLocal = this.firestore.collection<fichaI>('fichas', ref => ref.where('usuario', '==', this.user)).valueChanges();
          }

          else {
            this.router.navigateByUrl('login');
          }
    })
  }

  ngOnInit() {
    
  }
}