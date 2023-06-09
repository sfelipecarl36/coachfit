import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth-service';
import { Database } from '../shared/database';
import { PopoverController } from '@ionic/angular';
import { Services } from '../shared/services';
import { ToastController } from '@ionic/angular';
import { exercicioI } from '../model/exercicios';

@Component({
  selector: 'app-exercicios',
  templateUrl: './exercicios.page.html',
  styleUrls: ['./exercicios.page.scss'],
})
export class ExerciciosPage implements OnInit {
  
  exercicios!: any;
  fichas!: any;
  categorias!: any;
  textSearch: any;
  fichasSubscription: any;
  exerciciosSubscription: any;
  categoriasSubscription: any;

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private popoverCtrl: PopoverController,
    private auth: AuthService,
    private database: Database,
    public service: Services,
    private toastController: ToastController,
  ) { 

  }

  handleInput(event: any) {
    const query = event.target.value.replace(/\s/g, '');
    const formattedQuery = query.charAt(0).toUpperCase() + query.slice(1);
    this.textSearch = formattedQuery;
    this.exercicios = this.firestore.collection<exercicioI>('exercicios', ref => ref.orderBy('nome').startAt(this.textSearch).endAt(this.textSearch + '~')).valueChanges();
  }

  async addExercicioToast(exercicio: any, ficha: any) {
    const toast = await this.toastController.create({
      cssClass: 'toast-delete',
      message: exercicio+' adicionado a ficha '+ficha,
      duration: 1000,
      position: 'middle',
    });

    await toast.present();
  }


  ngOnInit() {
    this.service.abrirLoading();
    this.categoriasSubscription = this.database.getCategorias().subscribe(categorias => {
      this.categorias = categorias
    })
        
    this.fichasSubscription = this.database.getFichas().subscribe(fichas => {
      this.fichas = fichas;
    })

    this.exerciciosSubscription = this.database.getExercicios().subscribe(exercicios => {
      this.exercicios = exercicios
    })

    this.service.fecharLoading();
  }

  ionViewWillEnter () {
  }

  async DismissClick() {
    this.popoverCtrl.dismiss();
}

  addExercicio(exercicio: any, categoria: any, ficha: any, series: any, repeticoes: any) {
    
    this.DismissClick();
    console.log(ficha);
      this.firestore.collection('fichas', ref => ref.where('usuario', '==', this.auth.userUid)).doc(ficha).collection('exercicio').add({uid: '', exercicio: exercicio, categoria: categoria, peso: 5, ficha: ficha, series: series, repeticoes: repeticoes, usuario: this.auth.userUid}).then(newExe => {
        console.log('Exercicio Adicionado a Ficha',ficha);
        this.firestore.collection('fichas').doc(ficha).collection('exercicio').doc(newExe.id).update({uid: newExe.id})
      });
  }

  detalharExercicio(exercicio: any) {
    this.DismissClick()
    setTimeout(() => this.router.navigate(['detalhesexercicio'],{
      queryParams: [exercicio]
      }),150);
  }

}
