import { Component, OnInit } from '@angular/core';
import { Services } from '../shared/services';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../shared/auth-service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-criaficha',
  templateUrl: './criaficha.page.html',
  styleUrls: ['./criaficha.page.scss'],
})
export class CriafichaPage implements OnInit {

  rotulo: string = '';
  rotulos = ['A', 'B', 'C'];
  descanso = '02:20';
  series: string = '3';
  repeticoes: string = '12';
  fichas: any;
  dateSet = 0

  constructor(
    public service: Services,
    private firestore: AngularFirestore,
    private auth: AuthService,
    private toastController: ToastController
  ) { 
   
    this.fichas = firestore.collection('fichas');
  }

  ngOnInit() {
  }

  checkValue(event: any) { 
    this.rotulo = event.detail.value;
    console.log('Descanso:', this.descanso);
    console.log('Series:',this.series)
    console.log('Repetições:',this.repeticoes)
  }

  checkValue2() {
    console.log(this.descanso);
    this.dateSet=1
  }

  checkValue3() {
    console.log(this.series);
    console.log(this.repeticoes);
  }

  canCreate(): boolean {
    return this.rotulo=='' || this.descanso == null || this.series == '' || this.repeticoes == ''
  }

  async criarFicha() {

    this.service.abrirLoading('Criando sua ficha')

    const toast = await this.toastController.create ({
      message: 'Ficha '+this.rotulo+' criada!',
      position: 'middle',
      duration: 2000
    })

      this.fichas.add({ uid: '', rotulo: this.rotulo, descanso: this.descanso, series: this.series, repeticoes: this.repeticoes, usuario: this.auth.userUid}).then( (novaFicha: { id: any; }) => {
        this.fichas.doc(novaFicha.id).update({uid: novaFicha.id})
        console.log('Ficha Criada!');
        toast.present();
        this.service.navegar('meutreino');
        this.service.fecharLoading();
        });
  }

}
