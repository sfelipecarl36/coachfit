import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, ViewChildren, Renderer2, TemplateRef, ContentChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Database } from '../shared/database';
import { Services } from '../shared/services';
import { subexercicioI } from '../model/subexercicios';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { BehaviorSubject, Observable, Subject, timeout, timer } from 'rxjs';
import { exercicioI } from '../model/exercicios';
import { ModalController } from '@ionic/angular';
import { CircleComponentComponent } from '../modal/circle-component/circle-component.component';
import { fichaHistoricoI } from '../model/fichaHistorico';

@Component({
  selector: 'app-detalhesficha',
  templateUrl: './detalhesficha.page.html',
  styleUrls: ['./detalhesficha.page.scss'],
})
export class DetalhesfichaPage implements OnInit {

  fichas: any;
  fichaId: any;
  categorias: any;
  categoriasList: Array<any> = [];
  exercicios: any;
  exerciciosBanco: any;
  desfazer = false;
  subexerciciosLocal!: Observable<Array<subexercicioI>>;
  fichaHistorico!: Observable<Array<fichaHistoricoI>>;
  lengthExercicios = 0

  time: BehaviorSubject<string> = new BehaviorSubject('00:00');

  conteudoAlert: any
  
  timer: any;
  timerExe: any;
  interval: any;
  intervalExe: any;

  state: 'start' | 'stop' = 'stop';
  intervalPopUp: any
  timerExeInitial!: number;

  @ViewChildren ('circleElement') circleElement!: TemplateRef<any>;
  circleElements: any;
  
  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public database: Database,
    public service: Services,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private modalCtrl: ModalController
  ) 
    {}

    async presentModal(exe: any, series: any, repeticoes: any,  peso: any, descanso: any) {
      const modal = await this.modalCtrl.create({
        component: CircleComponentComponent,
        id: 'modalCircle',
        componentProps: { 
          exe: exe,
          series: series,
          repeticoes: repeticoes,
          peso: peso,
          descanso: descanso
        }
      });
      await modal.present();
      const { data } = await modal.onDidDismiss();
      console.log(data);
    }

    ngAfterViewInit(){
      this.conteudoAlert = this.circleElement;
      let tempoAfter = setInterval( () => {
        console.log(this.conteudoAlert)
        clearInterval(tempoAfter)
      }, 4000)
    }

    async startTimer() {
      const loading = await this.loadingController.create({
        spinner: 'circular',
        duration: 1000,
      });

      loading.present();
        this.state = 'start';
        this.timer = 0;
        this.interval = setInterval( () => {
          this.updateTimeValue();
        }, 1000)
    }

    stopTimer() {
      clearInterval(this.interval);
      this.time.next('00:00');
      this.state = 'stop';
    }

    updateTimeValue() {
        let minutes: any = this.timer / 60;
        let seconds: any = this.timer % 60;

        minutes = String('0' + Math.floor(minutes)).slice(-2);
        seconds = String('0' + Math.floor(seconds)).slice(-2);

        const text = minutes + ':' + seconds;
        this.time.next(text);

        ++this.timer;

        if (this.timer < -1) {
          this.stopTimer();
        }
    }

   ionViewWillEnter() { 

    this.lengthExercicios = 0
    this.categoriasList = [];

    this.activatedRoute.queryParams.subscribe(params => {
      this.fichaId = params[0];
      this.fichas = this.firestore.collection('fichas', ref => ref.where('uid','==', this.fichaId)).valueChanges();
      this.exercicios = this.firestore.collection('fichas').doc(this.fichaId).collection('exercicio').valueChanges();
      this.subexerciciosLocal = this.firestore!.collectionGroup<subexercicioI>('exercicio', ref => ref.where('ficha', '==', this.fichaId).orderBy('ficha')).valueChanges();
  })
    this.exerciciosBanco = this.database!.exerciciosLocal
    this.categorias = this.database!.categoriasLocal

    console.log('this.fichaId:',this.fichaId)
    console.log('this.categoriasList:',this.categoriasList)

    this.exercicios.subscribe((res: subexercicioI[]) => {

      res.forEach((item) => {
        if(this.categoriasList.length<1) {
          this.categoriasList.push(item.categoria)
        }

        else {
          if (this.categoriasList.indexOf(item.categoria)==-1) {
            this.categoriasList.push(item.categoria)
          }
        }
        this.lengthExercicios+=1;
      })
    })

  }


  async avisoDeletado() {
    const toast = await this.toastController.create({
      cssClass: 'toast-delete',
      message: 'Ficha Deletada',
      duration: 5000,
      position: 'bottom',
    });

    await toast.present();
  }


  detalharExercicio(exercicio: any) {
    setTimeout(() => this.router.navigate(['detalhesexercicio'],{
      queryParams: [exercicio]
      }),150);
  }

  clickExercicio(exe: any, series:any, repeticoes: any, peso: any, descanso: any) {
    if (this.state=='stop') {
        this.detalharExercicio(exe);
    }

    else if(this.state=='start') {
      this.presentModal(exe, series, repeticoes, peso, descanso);
    }
  }

  async alertPararTreino() {
    const alert = await this.alertController.create({
      cssClass: 'alert-ficha-stop',
      header: 'Parar execução do Treino?',
      buttons:[
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'alert-cancel',
          handler: () => {
            console.log('Treino Continua.');
          },
        },
        {
          text: 'Sim',
          handler: () => {
            console.log('Treino Interrompido.');
            this.stopTimer();
          },
        },
      ],

      
    });

    await alert.present();
  }

  async deletarFicha() {
    
    await this.subexerciciosLocal.subscribe(async (res: subexercicioI[]) => {

      await res.forEach((item) => {
        this.firestore.collection('fichas').doc(this.fichaId).collection('exercicio').doc(item.uid).delete();
      });

      this.firestore.collection('fichas').doc(this.fichaId).delete();
    })

  }

  editarFicha(ficha: any) {
    setTimeout(() => this.router.navigate(['editarficha'],{
      queryParams: [ficha]
      }),150);
  }

  async modalDeleteFicha(ficha: any) {
    const loading = await this.loadingController.create({
      message: 'Deletando Treino'+ficha,
      spinner: 'circular',
      duration: 5000,
    });

    const alert = await this.alertController.create({
      cssClass: 'modal-delete',
      header: 'Deseja mesmo deletar a ficha '+ficha+'?',
      message: 'A ação não poderá ser desfeita.',
      buttons:[
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-cancel',
          handler: () => {
            console.log('Deletar Ficha: Cancelado');
          },
        },
        {
          text: 'Deletar',
          handler: async () => {
            console.log('Ficha sendo Deletada');
            loading.present();
            await this.deletarFicha();
            this.avisoDeletado();
            loading.dismiss();
            this.router.navigateByUrl('meutreino');
          },
        },
      ],

      
    });

    await alert.present();
  }

  ngOnInit() {
  }

}
