import { Injectable, NgZone, OnInit } from '@angular/core';
import { exercicioI } from '../model/exercicios';
import { subexercicioI } from '../model/subexercicios';
import { categoriaI } from '../model/categorias';
import { Observable } from 'rxjs';
import { fichaI } from '../model/fichas';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { abort } from 'process';

@Injectable({
  providedIn: 'root',
})
export class Database {

    public exerciciosLocal: Observable<Array<exercicioI>>;
    public categoriasLocal: Observable<Array<categoriaI>>;
    public subexerciciosLocal!: Observable<Array<subexercicioI>>;
    public fichasLocal!: Observable<Array<fichaI>>;

  constructor(
    private firestore: AngularFirestore,
  ) {
    this.exerciciosLocal = this.firestore.collection<exercicioI>('exercicios').valueChanges();
    this.categoriasLocal = this.firestore.collection<categoriaI>('categorias').valueChanges();
  }

  public atualizaValores (userUid: string) {
    this.subexerciciosLocal = this.firestore!.collectionGroup<subexercicioI>('exercicio', ref => ref.where('usuario', '==', userUid)).valueChanges();
    this.fichasLocal = this.firestore.collection<fichaI>('fichas', ref => ref.where('usuario', '==', userUid)).valueChanges();
    
  }

}