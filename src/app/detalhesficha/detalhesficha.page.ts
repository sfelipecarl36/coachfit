import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, ViewChildren, Renderer2, TemplateRef, ContentChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Database } from '../shared/database';
import { Services } from '../shared/services';
import { subexercicioI } from '../model/subexercicios';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { BehaviorSubject, Observable, timeout, timer } from 'rxjs';
import { exercicioI } from '../model/exercicios';

const circleR = 80;
const circleDasharray = 2 * Math.PI * circleR;

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
  lengthExercicios = 0

  time: BehaviorSubject<string> = new BehaviorSubject('00:00');
  timeExe: BehaviorSubject<string> = new BehaviorSubject('00:00');
  percent: BehaviorSubject<number> = new BehaviorSubject(100);

  conteudoAlert: any
  
  timer: any;
  timerExe: any;
  interval: any;
  intervalExe: any;

  circleR = circleR;
  circleDasharray = circleDasharray

  state: 'start' | 'stop' = 'stop';
  stateExe: 'start' | 'stop' = 'stop';
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
  ) 
    {}

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

    startTimerExe(exe:any , repeticoes: any) {
      this.stateExe = 'start';
      this.firestore.collection<exercicioI>('exercicios', ref => ref.where('uid', '==', exe)).valueChanges().subscribe((res: exercicioI[]) => {

        res.forEach((item) => {
          if (item.tempo) {
          this.timerExe = (repeticoes * item.tempo)+5;
          this.timerExeInitial = Number((repeticoes * item.tempo)+5);
        }
          return
        });

      })
      this.intervalExe = setInterval( () => {
        this.updateTimeValueExe();
      }, 1000)
  }

  stopTimerExe() {
    clearInterval(this.intervalExe);
    this.timeExe.next('00:00');
    this.stateExe = 'stop';
  }

  percentageOffset(percent: any) {
    const percentFloat = percent / 100;
    return circleDasharray * (1 - percentFloat);
  }

  updateTimeValueExe() {
      let minutes: any = this.timerExe / 60;
      let seconds: any = this.timerExe % 60;

      minutes = String('0' + Math.floor(minutes)).slice(-2);
      seconds = String('0' + Math.floor(seconds)).slice(-2);

      const text = minutes + ':' + seconds;
      this.timeExe.next(text);

      const totalTime = this.timerExeInitial
      const percentage = ((totalTime - this.timerExe) / totalTime) * 100;
      this.percent.next(percentage)

      --this.timerExe;

      if (this.timerExe < -1) {
        this.stopTimerExe();
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

  clickExercicio(exe: any, repeticoes: any) {
    if (this.state=='stop') {
        this.detalharExercicio(exe);
    }

    else if(this.state=='start') {
      this.startTimerExe(exe, repeticoes);
      this.popUpExercicio(exe);
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

  async popUpExercicio(exercicio: any) {

    let nomeExe = ''
    let tempoExe = 0
    let imgExe = ''

    let timerLocal: any
    timerLocal = this.timeExe.getValue();

    const exercicioBanco = this.firestore.collection<exercicioI>('exercicios', ref => ref.where('uid', '==', exercicio)).valueChanges();
    exercicioBanco.subscribe((res: exercicioI[]) => {

      res.forEach((item) => {
        nomeExe = String(item.nome);
        imgExe = String(item.img);
        tempoExe = Number(item.tempo);
      });
    })

    
    this.intervalPopUp = setTimeout(() => this.time.subscribe( () => {
      timerLocal = this.timeExe.getValue();
      console.log(this.conteudoAlert)
      alert.header = nomeExe
      alert.message = '<h1>'+timerLocal+'</h1>'
      // '<svg '+
      //   'id="progress-circle" '+
      //   'width="90%" '+
      //   'height="90% " '+
      //   'viewBox="0 0 200 200" '+
      //   '> '+
  
      //   '<linearGradient id="linearColors1" '+ 
      //   'x1="0" '+
      //   'y1="0" '+
      //   'x2="1" '+
      //   'y2="1"> '+
      //   '<stop offset="0%" stop-color="#ddd6f3"></stop> '+
      //   '<stop offset="100%" stop-color="#faaca8"></stop> '+
      //   '</linearGradient> '+
  
      //   '<circle '+
      //   'cx="50%" '+
      //   'cy="50%" '+
      //   '[attr.r]="circleR" '+
      //   'fill="none" '+
      //   'stroke="#f3f3f3" '+
      //   'stroke-width="12" '+
      //   '/> '+
  
      //   '<circle '+
      //   'cx="50%" '+
      //   'cy="50%" '+
      //   '[attr.r]="circleR" '+
      //   'fill="none" '+
      //   'stroke="url(#linearColors1)" '+
      //   'stroke-width="12" '+
      //   'stroke-linecap="round" '+
      //   '[attr.stroke-dasharray]="circleDasharray" '+
      //   '[attr.stroke-dashoffset]="percentageOffset(percent | async)" '+
      //   '/> '+
      //   '<text x="50%" y="55%" class="timer-text">'+timerLocal+'</text> '+
      // '</svg>'
  })
  ,1000);

    const alert = await this.alertController.create({
      cssClass: 'alert-exe-start',
      header: nomeExe,
      message: '<h1>'+timerLocal+'</h1>',
      buttons:[
        {
          text: 'PULAR EXERCÍCIO',
          role: 'cancel',
          cssClass: 'alert-cancel',
          handler: () => {
            console.log('Exercício Pulado.');
            this.stopTimerExe();
            clearInterval(this.intervalPopUp);
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
