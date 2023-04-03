import { Component, OnInit } from '@angular/core';
import { Services } from '../shared/services';
import { AngularFirestore, AngularFirestoreCollectionGroup } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-meutreino',
  templateUrl: './meutreino.page.html',
  styleUrls: ['./meutreino.page.scss'],
})
export class MeutreinoPage implements OnInit {

  fichas: Observable<any>
  categorias: Observable<any>;
  exercicios: Observable<any>;
  exerciciosBanco: Observable<any>;

  constructor(
    public service: Services,
    private firestore: AngularFirestore
  ) { 
    this.fichas = firestore.collection('fichas').valueChanges();
    this.categorias = firestore.collection('categorias').valueChanges();
    this.exerciciosBanco = firestore.collection('exercicios').valueChanges();
    this.exercicios = firestore.collectionGroup('exercicio').valueChanges();
    console.log(this.exercicios);
  }

  ngOnInit() {
  }

}
