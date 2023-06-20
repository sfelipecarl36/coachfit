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
import { BehaviorSubject, Observable, from, lastValueFrom, take } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { CircleComponentComponent } from '../modal/circle-component/circle-component.component';
import { fichaHistoricoI } from '../model/fichaHistorico';
import { subexercicioHistI } from '../model/subexerciciosHist';
import { fichaI } from '../model/fichas';
import { categoriaI } from '../model/categorias';

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
  executadosList: Array<any> = [];
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
  fichaState = ''
  intervalPopUp: any
  timerExeInitial!: number;

  alertExecucaoBol = false
  alertConcluidoBol = false

  fichaRotulo: any;
  exerciciosHistList: Array<any> = [];
  fichasSubscription: any;
  exerciciosPorCategoria: { [key: string]: any[] } = {};
  categoriasSubscription: any;
  fichaDescanso: any;
  fichaSeries: any
  fichaRepeticoes: any
  
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

    async presentModal(ficha: any, fichaseries: any, ficharepeticoes: any, fichadescanso: any, exeuid: any, exe: any, series: any, repeticoes: any,  peso: any) {
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
          descanso: fichadescanso
        }
      });
      await modal.present();
      const { data } = await modal.onDidDismiss();
      console.log(data)
      if(data) {
        this.firestore.collection<fichaHistoricoI>('fichaHistorico', ref => ref.where('data', '==', this.date).where('fichaId', '==', this.fichaId)).valueChanges().subscribe( (historico: fichaHistoricoI[]) => {
          if(i==0) {
          i+=1;
          if (historico.length!=0) {
            historico.forEach((item) => {
              this.firestore.collection('fichaHistorico').doc(item.uid).collection('exercicioHist').add({ exeuid: exeuid, exercicio: data.exercicio, peso: data.peso, series: data.series, repeticoes: data.repeticoes, usuario: this.auth.userUid, data: this.date, fichaId: this.fichaId })
              console.log('Exercício adicionado ao Histórico')
              this.checkExe();
              return
            })
          }
          else {
            this.firestore.collection('fichaHistorico').add({ uid: '', fichaId: this.fichaId, usuario: this.auth.userUid, ficha: ficha, series: fichaseries, repeticoes: ficharepeticoes, descanso: fichadescanso, data: this.date, concluido: false}).
        then( async (novaFichaHistorico: { id: any; }) => {
          await this.firestore.collection('fichaHistorico').doc(novaFichaHistorico.id).update({uid: novaFichaHistorico.id})
          console.log('Ficha Histórico Criada!');
          this.firestore.collection('fichaHistorico').doc(novaFichaHistorico.id).collection('exercicioHist').add({ exeuid: exeuid, exercicio: data.exercicio, peso: data.peso, series: data.series, repeticoes: data.repeticoes, usuario: this.auth.userUid, data: this.date, fichaId: this.fichaId })
          this.checkExe();
          return;
          });
          }
        }
        })
      }
    }

    async ionViewDidEnter(){
      const int = setInterval( () => {
        this.checkExe();
        clearInterval(int)
      }, 1000)
    }

    async startTimer() {

      const loading = await this.loadingController.create({
        spinner: 'circular',
        duration: 1000,
        message: 'Iniciando'
      });
      loading.present();

      if(await this.contarTreinosConcluidos()>0){
        const alertConcluido = await this.alertController.create({
          header: 'Você já concluiu esse Treino Hoje',
          message: 'Tente treinar outra ficha',
          buttons: [
            {
              text: 'Ok',
            }
          ]
        })
        alertConcluido.present()
      }

      else {

        this.state = 'start';
        this.fichaState = this.fichaRotulo; 
        this.checkExe();
        this.timer = 0;
        this.interval = setInterval( () => {
          this.updateTimeValue();
        }, 1000)
    }
  }

    stopTimer() {
      clearInterval(this.interval);
      this.time.next('00:00');
      this.state = 'stop';
      this.fichaState = '';
      const elementos = document.querySelectorAll('.executado');
      elementos.forEach((elemento) => {
        elemento.classList.remove('executado');
      });
    }

    async alertExecucao() {
      if(this.alertExecucaoBol==false){
      this.alertController.dismiss()
      const alert = await this.alertController.create({
        header: 'Você tem outro treino em execução!',
        buttons: [
          {
            text: 'Ok',
          },
        ],
      });
      alert.present()
      }
    }

    async alertConcluido() {
      if(this.alertConcluidoBol==false){
      this.alertController.dismiss()
      const alert = await this.alertController.create({
        header: 'Você concluiu o treino de hoje',
        buttons: [
          {
            text: 'Finalizar',
            handler:() => {
               this.router.navigateByUrl('meutreino')
            },
          },
        ],
      });
      alert.present()
      }
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


   async ionViewWillEnter() { 

    this.alertExecucaoBol = false

    if(this.state == 'start'){
      const loading = await this.loadingController.create({
        message: 'Carregando',
        spinner: 'circular',
        duration: 900,
      });
      loading.present();
    }

    console.log(this.date)
    this.lengthExercicios = 0
    this.categoriasList = [];
    this.exerciciosHistList = [];

    this.activatedRoute.queryParams.subscribe(async params => {
      this.fichaId = params[0];
      this.fichaRotulo = params[1];
      if(this.fichaState!=''){
        if(this.fichaState!=this.fichaRotulo) {
          this.alertExecucao()
          this.alertExecucaoBol = true
          this.router.navigateByUrl('meutreino')
        }
      }
      
  })
    this.carregarFichas()
    this.exerciciosBanco = this.database!.exerciciosLocal
    this.categorias = this.database!.categoriasLocal

  }

  async contarSubExercicios() {
    const query = this.firestore!.collectionGroup<subexercicioHistI>('exercicioHist', ref => ref.where('data', '==', this.date).where('fichaId', '==', this.fichaId))
    const querySnapshot = await query.get().toPromise();
    const numDocumentos = querySnapshot!.size;
    console.log(`Número de registros: ${numDocumentos}`);
    return numDocumentos
  }

  async contarTreinosConcluidos() {
    const query = this.firestore.collection<fichaHistoricoI>('fichaHistorico', ref => ref.where('data', '==', this.date).where('concluido', '==', true).where('fichaId', '==', this.fichaId))
    const querySnapshot = await query.get().toPromise();
    const numDocumentos = querySnapshot!.size;
    console.log(`Número de registros: ${numDocumentos}`);
    return numDocumentos
  }

  async contarExercicios() {
    return this.exerciciosBanco.length
  }

  getTotalIndex(categoryIndex: number, exerciseIndex: number): number {
    let totalIndex = 0;
    for (let i = 0; i < categoryIndex; i++) {
      totalIndex += this.exerciciosPorCategoria[this.categoriasList[i]].length;
    }
    return totalIndex + exerciseIndex + 1;
  }

  async checkFicha() {
    let i = 0
    if(this.state == 'start'){
      const exeCount = await this.contarExercicios()
      const subexeCount = await this.contarSubExercicios()
      if(subexeCount>=exeCount){
        this.firestore!.collection<fichaHistoricoI>('fichaHistorico', ref => ref.where('data', '==', this.date).where('fichaId', '==', this.fichaId)).valueChanges().subscribe((res: fichaHistoricoI[]) => {
          res.forEach(async (item) => {    
            if(i==0) {
              i+=1
              this.firestore.collection('fichaHistorico').doc(item.uid).update({ concluido: true })
              this.stopTimer()
              this.fichaState = ''
              const alert = await this.alertController.create({
                header: 'Parabéns, você concluiu o Treino '+this.fichaRotulo,
                message: '<img src="../assets/img/fichaconcluido.jpg" />',
                buttons:[
                  {
                    text: 'Ok',
                    role: 'ok',
                    handler: () => {
                      this.router.navigateByUrl('meutreino')
                    },
                  },
                ]
              })
              alert.present()
              await alert.onDidDismiss().then(() => {
                this.router.navigateByUrl('meutreino')   
              });
              return
            }
          })
        
        })
      }
    }
  }

  async checkExe() {
    if(this.state == 'start'){
    console.log('checkExe rodando...')
    this.firestore.collectionGroup<subexercicioHistI>('exercicioHist', ref => ref.where('data', '==', this.date).where('fichaId', '==', this.fichaId)).valueChanges().subscribe((res: subexercicioHistI[]) => {
      res.forEach((item) => {    
        const element = (<HTMLElement>document.getElementById(String(item.exeuid)))
        if(element!=undefined || element!=null){
          element.classList.add('executado');
        }
        else{
          console.log('não encontrou elementos executados')
        }
      })
    })
    if(this.fichaState==this.fichaRotulo) {
    this.checkFicha();
    }
    }
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
    const query = this.firestore!.collectionGroup<subexercicioHistI>('exercicioHist', ref => ref.where('data', '==', this.date).where('exeuid', '==', exeuid).where('fichaId', '==', this.fichaId))
    const querySnapshot = await query.get().toPromise();
    const numDocumentos = querySnapshot!.size;
    console.log(`Número de registros: ${numDocumentos}`);
    return numDocumentos
  }

  async clickExercicio(ficha: any, fichaseries: any, ficharepeticoes: any, fichadescanso: any, exeuid: any, exe: any, series:any, repeticoes: any, peso: any) {

    const toast = await this.toastController.create({
      message: 'Você já concluiu essa atividade hoje',
      duration: 1000,
      position: 'middle',
    });

    if (this.state=='stop') {
        this.detalharExercicio(exe);
    }

    else if(this.state=='start') {
      
      if(await this.contarRegistros(exeuid)==0){
        this.presentModal(ficha, fichaseries, ficharepeticoes, fichadescanso, exeuid, exe, series, repeticoes, peso);
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
      const exerciciosCollection = this.firestore.collection(`fichas/${this.fichaId}/exercicio`);
      exerciciosCollection.get().subscribe(snapshot => {
      snapshot.forEach(doc => {
        exerciciosCollection.doc(doc.id).delete();
      });
      this.firestore.collection('fichas').doc(this.fichaId).delete();
    })

  }

  editarFicha() {
    setTimeout(() => this.router.navigate(['editarficha'],{
    queryParams: [this.fichaId, this.fichaRotulo]
      }),150);
  }

  async modalDeleteFicha(ficha: any) {

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
            this.database.abrirLoading('Deletando Ficha '+this.fichaRotulo)
            await this.deletarFicha();
            this.avisoDeletado();
            this.database.fecharLoading()
            this.router.navigateByUrl('meutreino');
          },
        },
      ],

      
    });

    await alert.present();
  }

  async carregarFichas() {
    this.database.abrirLoading('Carregando Exercícios')
    
    this.fichasSubscription = this.database.getFichaPorId(this.fichaId).subscribe((ficha: fichaI) => {
      this.fichaDescanso = ficha.descanso;
      this.fichaSeries = ficha.series;
      this.fichaRepeticoes = ficha.repeticoes;
  
      this.carregarCategorias();
    });
  }

  async carregarCategorias() {
    
    this.categoriasSubscription = this.firestore
      .collection<categoriaI>('categorias')
      .valueChanges()
      .subscribe((categorias: categoriaI[]) => {
        this.categorias = categorias;
      });

      this.firestore
      .collection('fichas')
      .doc(this.fichaId)
      .collection('exercicio')
      .get()
      .toPromise() // Convertendo para Promise
      .then((querySnapshot: any) => {
        querySnapshot.forEach((doc: any) => {
          if (this.categoriasList.length < 1) {
            this.categoriasList.push(doc.data().categoria);
          } else {
            if (this.categoriasList.indexOf(doc.data().categoria) === -1) {
              this.categoriasList.push(doc.data().categoria);
            }
          }
        });
        this.carregarExerciciosPorCategoria();
      })
      .catch((error: any) => {
        console.error('Erro ao obter os exercícios:', error);
      });
    
  }

  carregarExerciciosPorCategoria() {
    if(this.categoriasList.length) {
    for (const cat of this.categoriasList) {
      this.firestore
        .collection<fichaI>('fichas')
        .doc(this.fichaId)
        .collection('exercicio', ref => ref
        .where('categoria', '==', cat))
        .valueChanges()
        .subscribe((exercicios: any[]) => {
          this.lengthExercicios+=1;
          this.exerciciosPorCategoria[cat] = exercicios;
        });
    }

  }

  else {
    console.log('categoriasList:',this.categoriasList)
  }

  this.database.fecharLoading();
  
}

  ngOnDestroy() {
    if (this.fichasSubscription) {
      this.fichasSubscription.unsubscribe();
    }
  }

  ngOnInit() {
  }
}
