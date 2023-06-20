import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Database } from '../shared/database';
import { Services } from '../shared/services';
import { AuthService } from '../shared/auth-service';
import { AlertController, LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertInput } from '@ionic/core/dist/types/components/alert/alert-interface';
import { fichaI } from '../model/fichas';
import { exercicioI } from '../model/exercicios';

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
  exerciciosSubscribe: any;
  exercicioNome: any;
  exercicioImg: any;
  exercicioDesc: any;
  exercicioRegiao: any;
  exercicioCat: any;
  exercicioUid: any;
  loading: any;

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public database: Database,
    public service: Services,
    public auth: AuthService,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
  ) {
    this.abrirLoading();
    this.activatedRoute.queryParams.subscribe(params => {

        this.exercicioId = params[0];
        this.database.getExercicioPorId(this.exercicioId).subscribe(
          (exercicio: exercicioI) => {
            this.exercicioNome = exercicio.nome;
            this.exercicioImg = exercicio.img2;
            this.exercicioDesc = exercicio.descricao;
            this.exercicioRegiao = exercicio.regiao;
            this.exercicioCat = exercicio.categoria;
            this.exercicioUid = exercicio.uid;
          },
          (error: any) => {
            console.error(error)
          }
        );
        this.categorias = this.database!.categoriasLocal
    })
   }

   async abrirLoading() {
    this.loading = await this.loadingController.create({
      spinner: 'circular',
      duration: 500,
    });
    this.loading.present();
   }

   async fecharLoading() {
    setTimeout(() => {
      this.loading.dismiss();
    }, 500)
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
    this.alertInputs = []
    setTimeout(() => {
      this.fichas = this.database.fichasLocal
      this.fichas.subscribe((res: fichaI[]) => {
        res.forEach((item) => {
          if(this.alertInputs.length==0){
            this.alertInputs.push({
              name: item.rotulo,
              label: 'Ficha '+item.rotulo,
              type: 'radio',
              value: item.uid,
            })
          }
          else {
            if(this.alertInputs.filter(e => e.name === item.rotulo).length > 0){
              console.log('ficha repetida')
            }
            else {
              this.alertInputs.push({
                name: item.rotulo,
                label: 'Ficha '+item.rotulo,
                type: 'radio',
                value: item.uid,
              })
            }
          }
            console.log('Ficha:',item.rotulo)
        });
      })
    },1200);
  }



}
