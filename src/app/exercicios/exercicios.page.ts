import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth-service';
import { Database } from '../shared/database';
import { PopoverController } from '@ionic/angular';
import { Services } from '../shared/services';

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
    private database: Database,
    public service: Services,
  ) { 

  }

  ngOnInit() {
    this.exercicios = this.database.exerciciosLocal
    this.categorias = this.database.categoriasLocal
    setTimeout(() => {
      this.fichas = this.database.fichasLocal
    },1200);
  }

  ionViewWillEnter () {
    this.database.atualizaValores();
  }

  async DismissClick() {
    this.popoverCtrl.dismiss();
}

  addExercicio(exercicio: any, categoria: any, ficha: any) {
    
    console.log(ficha);
      this.firestore.collection('fichas', ref => ref.where('usuario', '==', this.auth.userData['uid'])).doc(ficha).collection('exercicio').add({ exercicio: exercicio, categoria: categoria, peso: 5, ficha: ficha, usuario: this.auth.userUid}).then(() => {
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
