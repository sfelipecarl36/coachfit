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
    public fichasUid: String[] = [];
    public subexerciciosConj: Observable<Array<subexercicioI>>[] = [];
    public subexerciciosArray: any[] = []

  constructor(
    private firestore: AngularFirestore,
  ) {
    this.exerciciosLocal = this.firestore.collection<exercicioI>('exercicios').valueChanges();
    this.categoriasLocal = this.firestore.collection<categoriaI>('categorias').valueChanges();
  }

  public atualizaValores (userUid: string) {
    this.subexerciciosLocal = this.firestore!.collectionGroup<subexercicioI>('exercicio', ref => ref.where('usuario', '==', userUid)).valueChanges();
    this.fichasLocal = this.firestore.collection<fichaI>('fichas', ref => ref.where('usuario', '==', userUid)).valueChanges();

    this.fichasLocal.subscribe((res: fichaI[]) => {

      res.forEach((ficha, index) => {
        console.log('Ficha '+index+' :'+ficha.uid);
        this.fichasUid.push(String(ficha.uid));
      });
    })
    
    this.fichasUid.forEach((uid: String) => {
        this.subexerciciosConj.push(this.firestore.collection<fichaI>('fichas').doc(String(uid)).collection('exercicio').valueChanges())
    })

    this.subexerciciosConj.forEach((res, index) => {
      res.subscribe((value) => {
          this.subexerciciosArray[index] = value;
          console.log(this.subexerciciosArray)
      });
  });
    
  }

  public getSubExercicio(fichaUid?: String) {
    return this.firestore.collection<fichaI>('fichas').doc(String(fichaUid)).collection('exercicio').valueChanges()
  }

}