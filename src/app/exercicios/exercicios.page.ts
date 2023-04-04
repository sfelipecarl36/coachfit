import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-exercicios',
  templateUrl: './exercicios.page.html',
  styleUrls: ['./exercicios.page.scss'],
})
export class ExerciciosPage implements OnInit {
  
  categorias: any;
  exercicios: any;
  fichas: any

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private popoverCtrl: PopoverController
  ) { 
    this.categorias = this.firestore.collection('categorias').valueChanges();
    this.exercicios = this.firestore.collection('exercicios').valueChanges();
    this.fichas = this.firestore.collection('fichas').valueChanges();
  }

  ngOnInit() {
  }

  addExercicio(exercicio: any, ficha: any) {
    
    console.log(ficha);
      this.firestore.collection('fichas').doc(ficha).collection('exercicio').add({ exercicio: exercicio, peso: 5, ficha: ficha}).then(() => {
        console.log('Exercicio Adicionado a Ficha',ficha);
      });
  }

  async DismissClick() {
      this.popoverCtrl.dismiss();
  }

  detalharExercicio(exercicio: any) {
    this.DismissClick()
    setTimeout(() => this.router.navigate(['detalhesexercicio'],{
      queryParams: [exercicio]
      }),150);
  }

}
