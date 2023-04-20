import { Injectable, NgZone, OnInit } from '@angular/core';
import { exercicioI } from '../model/exercicios';
import { subexercicioI } from '../model/subexercicios';
import { fichaI } from '../model/fichas';
import { categoriaI } from '../model/categorias';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../shared/auth-service';

@Injectable({
  providedIn: 'root',
})
export class Database {

    public exerciciosLocal!: Observable<Array<exercicioI>>;
    public fichasLocal!: Observable<Array<fichaI>>;
    public categoriasLocal!: Observable<Array<categoriaI>>;
    public subexerciciosLocal!: Observable<Array<subexercicioI>>;

  constructor(
    private firestore: AngularFirestore,
    private auth: AuthService
  ) {
    this.exerciciosLocal = this.firestore.collection<exercicioI>('exercicios').valueChanges();
    this.fichasLocal = this.firestore.collection<fichaI>('fichas', ref => ref.where('usuario', '==', this.auth.userUid)).valueChanges();
    this.categoriasLocal = this.firestore.collection<categoriaI>('categorias').valueChanges();
    this.subexerciciosLocal = this.firestore.collectionGroup<subexercicioI>('exercicio', ref => ref.where('usuario', '==', this.auth.userUid)).valueChanges();
  }

}