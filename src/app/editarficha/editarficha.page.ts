import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, ViewChildren, Renderer2 } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Database } from '../shared/database';
import { Services } from '../shared/services';
import { subexercicioI } from '../model/subexercicios';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Observable, take } from 'rxjs';
import { fichaI } from '../model/fichas';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-editarficha',
  templateUrl: './editarficha.page.html',
  styleUrls: ['./editarficha.page.scss'],
})
export class EditarfichaPage implements OnInit {

  fichas: any;
  fichaId: any;
  categorias: any;
  categoriasList: Array<any> = [];
  exercicios: any;
  exerciciosBanco: any;
  desfazer = false;
  subexerciciosLocal!: Observable<Array<subexercicioI>>;
  exerciciosPorFicha: { [key: string]: any[] } = {};
  fichaRotulo: any;
  fichasSubscription: any;
  fichaDescanso: any;
  fichaSeries: any;
  fichaRepeticoes: any;
  fichaDescansoMin: any;
  fichaDescansoSeg: any;

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public database: Database,
    public service: Services,
    private alertController: AlertController,
    private toastController: ToastController,

  ) {
    
   }

   async carregarExerciciosPorFicha() {
      this.database.getExerciciosPorFicha(this.fichaId).subscribe((exercicios: any[]) => {
        this.exerciciosPorFicha[this.fichaId] = exercicios;
      })
  }

   ionViewWillEnter() { 
    this.categoriasList = [];

    this.activatedRoute.queryParams.subscribe(params => {
      this.fichaId = params[0];
      this.fichaRotulo = params[1];
      
      this.fichasSubscription = this.database.getFichaPorId(this.fichaId).subscribe((ficha: fichaI) => {
        this.fichaDescanso = ficha.descanso;
        this.fichaSeries = ficha.series;
        this.fichaRepeticoes = ficha.repeticoes;
        this.fichaDescansoMin = this.fichaDescanso.substring(0,2)
        this.fichaDescansoSeg = this.fichaDescanso.substring(3,5)
      });

      this.exercicios = this.firestore.collection('fichas').doc(this.fichaId).collection('exercicio').valueChanges();
      this.subexerciciosLocal = this.firestore!.collectionGroup<subexercicioI>('exercicio', ref => ref.where('ficha', '==', this.fichaId)).valueChanges();
      this.carregarExerciciosPorFicha();
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
      })
    })

  }

  async toastFichaEditada() {
    const toast = await this.toastController.create({
      cssClass: 'toast-edit-ficha',
      message: 'Ficha Editada com sucesso!',
      duration: 2500,
      position: 'bottom',
    });

    await toast.present();
  }

  async toastDeleteExe() {
    const toast = await this.toastController.create({
      cssClass: 'toast-delete-exe',
      message: 'Exercício removido da ficha',
      duration: 2000,
      position: 'middle',
    });

    await toast.present();
  }

  async modalDeleteExe(exe: any) {
    const alert = await this.alertController.create({
      cssClass: 'modal-delete-exe',
      header: 'Remover exercício da ficha?',
      buttons:[
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-cancel',
          handler: () => {
            console.log('Exercício não removido.');
          },
        },
        {
          text: 'Sim',
          handler: () => {
            console.log('Exercício Removido.');
            this.firestore.collection('fichas').doc(this.fichaId).collection('exercicio').doc(exe).delete().then( () => {
              this.toastDeleteExe();
            })
          },
        },
      ],

      
    });

    await alert.present();
  }

  async modalEditFicha(fichaRotulo: any, descansomin: any, descansoseg: any, fichaseries: any, ficharepeticoes: any) {
    const alert = await this.alertController.create({
      cssClass: 'modal-edit',
      header: 'Confirmar alterações em ficha '+fichaRotulo+'?',
      buttons:[
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-cancel',
          handler: () => {
            console.log('Editar Ficha: Cancelado');
          },
        },
        {
          text: 'Confirmar',
          handler: async () => {
            alert.dismiss();
            await this.salvarAlteracoes(descansomin, descansoseg, fichaseries, ficharepeticoes);
          },
        },
      ],

      
    });

    await alert.present();
  }


  detalharFicha() {
    setTimeout(() => this.router.navigate(['detalhesficha'],{
      queryParams: [this.fichaId, this.fichaRotulo]
      }),150);
  }

  cancelarEditFicha() {
    this.detalharFicha();
  }

  async salvarAlteracoes(descansomin: any, descansoseg: any, fichaseries: any, ficharepeticoes: any) {

    this.service.abrirLoading("Salvando");

    await this.exercicios.pipe(take(1)).subscribe((res: subexercicioI[]) => {
    
      res.forEach((exe) => {
        
        var inputSeries = (<HTMLInputElement>document.getElementById(exe.uid + "series")).value;
    
        var inputRepeticoes = (<HTMLInputElement>document.getElementById(exe.uid + "repeticoes")).value;
    
        var inputPeso = (<HTMLInputElement>document.getElementById(exe.uid + "peso")).value;
    
        this.firestore.collection('fichas').doc(this.fichaId).collection('exercicio').doc(exe.uid).update({ series: inputSeries, repeticoes: inputRepeticoes, peso: inputPeso }).then(() => {
          console.log('Exercicio atualizado.');
        });
      });
    });
    
    await this.firestore.collection('fichas').doc(this.fichaId).update({ descanso: descansomin.value + ":" + descansoseg.value, series: fichaseries.value, repeticoes: ficharepeticoes.value })

    await this.toastFichaEditada()
    this.detalharFicha()
    this.service.fecharLoading()
  }

  ngOnInit() {
  }

}
