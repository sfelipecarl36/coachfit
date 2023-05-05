import { Component,OnInit,ViewChildren,TemplateRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../shared/auth-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Database } from '../shared/database';
import { Services } from '../shared/services';
import { subexercicioI } from '../model/subexercicios';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { CircleComponentComponent } from '../modal/circle-component/circle-component.component';
import { fichaHistoricoI } from '../model/fichaHistorico';
import { subexercicioHistI } from '../model/subexerciciosHist';

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
  subexerciciosHist!: any;
  fichaHistorico!: Observable<Array<fichaHistoricoI>>;
  lengthExercicios = 0

  time: BehaviorSubject<string> = new BehaviorSubject('00:00');
  
  timer: any;
  timerExe: any;
  interval: any;
  intervalExe: any;

  today = new Date();
  date = this.datePipe.transform(this.today, 'dd/MM/yyyy');
  
  state: 'start' | 'stop' = 'stop';
  intervalPopUp: any
  timerExeInitial!: number;

  fichaRotulo: any;
  exerciciosHistList: Array<any> = [];
  
  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    public database: Database,
    public service: Services,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private datePipe: DatePipe
  ) 
    {}

    async presentModal(ficha: any, fichaseries: any, ficharepeticoes: any, fichadescanso: any, exeuid: any, exe: any, series: any, repeticoes: any,  peso: any, descanso: any) {
      let i = 0
      console.log(this.date)
      const modal = await this.modalCtrl.create({
        component: CircleComponentComponent,
        id: 'modalCircle',
        backdropDismiss: false,
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
      console.log(data)
      if(data) {
        this.firestore.collection<fichaHistoricoI>('fichaHistorico', ref => ref.where('data', '==', this.date).where('ficha', '==', ficha)).valueChanges().subscribe( (historico: fichaHistoricoI[]) => {
          if(i==0) {
          i+=1;
          console.log('executei, ó!')
          if (historico.length!=0) {
            historico.forEach((item) => {
              this.firestore.collection('fichaHistorico').doc(item.uid).collection('exercicioHist').add({ exeuid: exeuid, exercicio: data.exercicio, peso: data.peso, series: data.series, repeticoes: data.repeticoes, usuario: this.auth.userUid, data: this.date, ficha: this.fichaRotulo })
              console.log('Exercício adicionado ao Histórico')
              return
            })
          }
          else {
            this.firestore.collection('fichaHistorico').add({ uid: '', usuario: this.auth.userUid, ficha: ficha, series: fichaseries, repeticoes: ficharepeticoes, descanso: fichadescanso, data: this.date, concluido: false}).
        then( async (novaFichaHistorico: { id: any; }) => {
          await this.firestore.collection('fichaHistorico').doc(novaFichaHistorico.id).update({uid: novaFichaHistorico.id})
          console.log('Ficha Histórico Criada!');
          this.firestore.collection('fichaHistorico').doc(novaFichaHistorico.id).collection('exercicioHist').add({ exeuid: exeuid, exercicio: data.exercicio, peso: data.peso, series: data.series, repeticoes: data.repeticoes, usuario: this.auth.userUid, data: this.date, ficha: this.fichaRotulo })
          return;
          });
          }
        }
        })
      }
    }

    async ionViewDidEnter(){
      console.log(this.exerciciosHistList)
      this.exerciciosHistList.forEach( (element) => {
        console.log(element)
        element.classList.add('executado');
      })
    }

    async startTimer() {
      
      const loading = await this.loadingController.create({
        spinner: 'circular',
        duration: 1000,
        message: 'Iniciando'
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

    console.log(this.date)
    this.lengthExercicios = 0
    this.categoriasList = [];
    this.exerciciosHistList = [];

    this.activatedRoute.queryParams.subscribe(params => {
      this.fichaId = params[0];
      this.fichaRotulo = params[1];
      this.fichas = this.firestore.collection('fichas', ref => ref.where('uid','==', this.fichaId)).valueChanges();
      this.exercicios = this.firestore.collection('fichas').doc(this.fichaId).collection('exercicio').valueChanges();
      this.subexerciciosLocal = this.firestore!.collectionGroup<subexercicioI>('exercicio', ref => ref.where('ficha', '==', this.fichaId).orderBy('ficha')).valueChanges();
  })
    this.exerciciosBanco = this.database!.exerciciosLocal
    this.categorias = this.database!.categoriasLocal

    console.log('this.fichaId:',this.fichaId)
    console.log('this.fichaRotulo:',this.fichaRotulo)
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

  async contarRegistros(exeuid: any) {
    const query = this.firestore!.collectionGroup<subexercicioHistI>('exercicioHist', ref => ref.where('data', '==', this.date).where('exeuid', '==', exeuid).where('ficha', '==', this.fichaRotulo))
    const querySnapshot = await query.get().toPromise();
    const numDocumentos = querySnapshot!.size;
    console.log(`Número de registros: ${numDocumentos}`);
    return numDocumentos
  }

  async contarRegistrosBooleano(exeuid: any) {
    console.log('executei')
    return true
  }

  async clickExercicio(ficha: any, fichaseries: any, ficharepeticoes: any, fichadescanso: any, exeuid: any, exe: any, series:any, repeticoes: any, peso: any, descanso: any) {

    const toast = await this.toastController.create({
      message: 'Você já concluiu essa atividade hoje',
      duration: 1000,
      position: 'bottom',
    });

    if (this.state=='stop') {
        this.detalharExercicio(exe);
    }

    else if(this.state=='start') {
      
      if(await this.contarRegistros(exeuid)==0){
        this.presentModal(ficha, fichaseries, ficharepeticoes, fichadescanso, exeuid, exe, series, repeticoes, peso, descanso);
      }
      else {
        await toast.present();
      }

      
      
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
