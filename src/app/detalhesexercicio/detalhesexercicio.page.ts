import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Database } from '../shared/database';
import { Services } from '../shared/services';
import { AuthService } from '../shared/auth-service';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertInput } from '@ionic/core/dist/types/components/alert/alert-interface';
import { fichaI } from '../model/fichas';

@Component({
  selector: 'app-detalhesexercicio',
  templateUrl: './detalhesexercicio.page.html',
  styleUrls: ['./detalhesexercicio.page.scss'],
})
export class DetalhesexercicioPage implements OnInit {

  exercicios: any;
  exercicioId: any;
  categorias: any;
  fichas: any;

  alertInputs: AlertInput[] = []

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public database: Database,
    public service: Services,
    public auth: AuthService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
      
    this.activatedRoute.queryParams.subscribe(params => {
        this.exercicioId = params[0];
        this.exercicios = this.firestore.collection('exercicios', ref => ref.where('uid','==', this.exercicioId)).valueChanges();
        this.categorias = this.database!.categoriasLocal
    })

   }

  ionViewWillEnter () {
    this.database.atualizaValores();
  }

  async addExercicioToast() {
    const toast = await this.toastController.create({
      cssClass: 'toast-add',
      message: 'Exercício adicionado a ficha',
      duration: 1000,
      position: 'middle',
    });

    await toast.present();
  }

  async addExercicio(exercicio: any, categoria: any, ficha: any) {
    
    console.log(ficha);

    let series = ''
    let repeticoes = ''

    await this.fichas.subscribe((res: fichaI[]) => {
      res.forEach((item) => {
          series = String(item.series)
          repeticoes = String(item.repeticoes)
      });
    })
    setTimeout(() => {
      this.firestore.collection('fichas').doc(ficha).collection('exercicio').add({uid: '', exercicio: exercicio, categoria: categoria, peso: 5, ficha: ficha, series: series, repeticoes: repeticoes, usuario: this.auth.userUid}).then(newExe => {
        console.log('Exercicio Adicionado a Ficha',ficha);
        this.firestore.collection('fichas').doc(ficha).collection('exercicio').doc(newExe.id).update({uid: newExe.id})
      })
    },500);
    this.addExercicioToast();
  }

  async presentAlertAdd(exercicio: any, categoria: any) {

    const alert = await this.alertController.create({
      header: 'Selecione a ficha',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-cancel',
          handler: () => {
            console.log('Operação Cancelada.');
          },
        },
        {
          text: 'Adicionar',
          handler: (data:string) => {
            this.addExercicio(exercicio, categoria, data)
          },
        },
        
      ],
      inputs: this.alertInputs
    });
    await alert.present();
  }

  ngOnInit() {
    setTimeout(() => {
      this.fichas = this.database.fichasLocal
      this.fichas.subscribe((res: fichaI[]) => {
        res.forEach((item) => {
          if (this.alertInputs.length==0) {
            this.alertInputs.push({
              name: item.rotulo,
              label: 'Ficha '+item.rotulo,
              type: 'radio',
              value: item.uid,
            })
          }
            console.log('Ficha: ',item.rotulo)
        });
      })
    },1200);
  }



}
