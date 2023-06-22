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
import { take } from 'rxjs';

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
  fichasSubscription: any;
  categoriasSubscription: any;

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public database: Database,
    public service: Services,
    public auth: AuthService,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {
    this.service.abrirLoading()
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
        this.categoriasSubscription = this.database.getCategorias().subscribe(categorias => {
          this.categorias = categorias
          this.service.fecharLoading()
        })
    })
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
    try {
      const fichaU: fichaI | undefined = await this.database.getFichaPorId(ficha).pipe(take(1)).toPromise();
      if (!fichaU) {
      throw new Error('Ficha não encontrada');
      }
  
      const series = String(fichaU.series);
      const repeticoes = String(fichaU.repeticoes);
  
      const newExe = await this.firestore
        .collection('fichas')
        .doc(ficha)
        .collection('exercicio')
        .add({ uid: '', exercicio: exercicio, categoria: categoria, peso: 5, ficha: ficha, series: series, repeticoes: repeticoes, usuario: this.auth.userUid });
  
      console.log('Exercicio Adicionado a Ficha', ficha);
      await this.firestore.collection('fichas').doc(ficha).collection('exercicio').doc(newExe.id).update({ uid: newExe.id });
  
      this.addExercicioToast();
    } catch (error) {
      console.error('Erro ao adicionar exercício:', error);
      // Trate o erro de acordo com sua lógica de tratamento de erros
    }
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
    this.database.getFichas().subscribe(fichas => {
    this.fichas = fichas
    fichas.forEach(ficha => {
      if(this.alertInputs.length==0){
        this.alertInputs.push({
          name: ficha.rotulo,
          label: 'Ficha '+ficha.rotulo,
          type: 'radio',
          value: ficha.uid,
        })
        console.log(ficha.uid)
      }
      else {
        if(this.alertInputs.filter(e => e.name === ficha.rotulo).length > 0){
          console.log('ficha repetida')
        }
        else {
          this.alertInputs.push({
            name: ficha.rotulo,
            label: 'Ficha '+ficha.rotulo,
            type: 'radio',
            value: ficha.uid,
          })
        }
      }
        console.log('Ficha:',ficha.rotulo)
    });
    });
  }



}
