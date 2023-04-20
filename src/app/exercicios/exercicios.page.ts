import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth-service';
import { Database } from '../shared/database';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-exercicios',
  templateUrl: './exercicios.page.html',
  styleUrls: ['./exercicios.page.scss'],
})
export class ExerciciosPage implements OnInit {
  
  exercicios!: any;
  fichas!: any;
  categorias!: any;

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private popoverCtrl: PopoverController,
    private auth: AuthService,
    private database: Database
  ) { 

  }

  ngOnInit() {
    this.exercicios = this.database.exerciciosLocal
    this.fichas = this.database.fichasLocal
    this.categorias = this.database.categoriasLocal
  }

  async DismissClick() {
    this.popoverCtrl.dismiss();
}

  addExercicio(exercicio: any, ficha: any) {
    
    console.log(ficha);
      this.firestore.collection('fichas', ref => ref.where('usuario', '==', this.auth.userData['uid'])).doc(ficha).collection('exercicio').add({ exercicio: exercicio, peso: 5, ficha: ficha, usuario: this.auth.userUid}).then(() => {
        console.log('Exercicio Adicionado a Ficha',ficha);
      });
      this.DismissClick();
  }

  detalharExercicio(exercicio: any) {
    this.DismissClick()
    setTimeout(() => this.router.navigate(['detalhesexercicio'],{
      queryParams: [exercicio]
      }),150);
  }

}
