import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-exercicios',
  templateUrl: './exercicios.page.html',
  styleUrls: ['./exercicios.page.scss'],
})
export class ExerciciosPage implements OnInit {
  
  categorias: any;
  exercicios: any;

  constructor(
    private firestore: AngularFirestore
  ) { 

    this.categorias = this.firestore.collection('categorias').valueChanges();
    this.exercicios = this.firestore.collection('exercicios').valueChanges();
  }

  ngOnInit() {
  }

}
