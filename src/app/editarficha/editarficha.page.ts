import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, ViewChildren, Renderer2 } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Database } from '../shared/database';
import { Services } from '../shared/services';
import { subexercicioI } from '../model/subexercicios';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { exit } from 'process';

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

  @ViewChildren('fichacaixa') fichacaixa?: HTMLElement;

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public database: Database,
    public service: Services,
    private alertController: AlertController,
    private toastController: ToastController,
    private renderer: Renderer2
  ) {

    
   }

   ionViewWillEnter() { 

    this.categoriasList = [];

    this.activatedRoute.queryParams.subscribe(params => {
      this.fichaId = params[0];
      this.fichas = this.firestore.collection('fichas', ref => ref.where('uid','==', this.fichaId)).valueChanges();
      this.exercicios = this.firestore.collection('fichas').doc(this.fichaId).collection('exercicio', ref => ref.limit(1)).valueChanges();
      // this.exercicios = this.firestore.collectionGroup('exercicio', ref => ref.where('ficha', '==', this.fichaId)).valueChanges();
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
      duration: 1500,
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
            this.firestore.collection('fichas').doc(this.fichaId).collection('exercicio').doc(exe).delete();
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
          handler: () => {
            console.log('Ficha Atualizada');
            this.salvarAlteracoes(descansomin, descansoseg, fichaseries, ficharepeticoes);
            this.toastFichaEditada()
          },
        },
      ],

      
    });

    await alert.present();
  }


  detalharFicha(ficha: any) {
    setTimeout(() => this.router.navigate(['detalhesficha'],{
      queryParams: [ficha]
      }),150);
  }


  salvarAlteracoes(descansomin: any, descansoseg: any, fichaseries: any, ficharepeticoes: any) {

    

    this.exercicios.subscribe((res: subexercicioI[]) => {

      let i = 0;

      res.forEach((exe) => {

        i+=1;
        
        var inputSeries = (<HTMLInputElement>document.getElementById(exe.uid+"series")).value;
        console.log('inputSeries:',inputSeries);

        var inputRepeticoes = (<HTMLInputElement>document.getElementById(exe.uid+"repeticoes")).value;

        var inputPeso = (<HTMLInputElement>document.getElementById(exe.uid+"peso")).value;

        console.log('inputSeries:',inputSeries);
        console.log('inputRepeticoes:',inputRepeticoes);
        console.log('inputPeso:',inputPeso);

        this.firestore.collection('fichas').doc(this.fichaId).collection('exercicio').doc(exe.uid).update({series: inputSeries, repeticoes: inputRepeticoes, peso: inputPeso}).then ( () => {
          console.log('Exercicio atualizado.')
        })
      
      })
    
    }).then ( () => {

      console.log(this.fichaId)
            console.log(descansomin.value)
            console.log(descansoseg.value)
            console.log(fichaseries.value)
            console.log(ficharepeticoes.value)

    this.firestore.collection('fichas').doc(this.fichaId).update({descanso: descansomin.value+":"+descansoseg.value, series: fichaseries.value, repeticoes: ficharepeticoes.value}).then( res => {
      this.router.navigate(['detalhesficha'],{
        queryParams: [this.fichaId]
        })
    })
    })  

    this.detalharFicha(this.fichaId);

  }

  ngOnInit() {
  }

}
