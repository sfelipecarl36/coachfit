import { Component, OnInit } from '@angular/core';
import { Services } from '../shared/services';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-criaficha',
  templateUrl: './criaficha.page.html',
  styleUrls: ['./criaficha.page.scss'],
})
export class CriafichaPage implements OnInit {

  rotulo: string = '';
  rotulos = ['A', 'B', 'C'];
  descanso: any;
  series: string = '3';
  repeticoes: string = '12';
  fichas: any;

  constructor(
    public service: Services,
    private firestore: AngularFirestore
  ) { 
   
    this.fichas = firestore.collection('fichas');
  }

  ngOnInit() {
  }

  checkValue(event: any) { 
    this.rotulo = event.detail.value;
    console.log(this.rotulo);
  }

  checkValue2( event: any) {
    console.log(new Date (this.descanso).toLocaleTimeString().substring(0,5));
  }

  checkValue3( event: any) {
    console.log(this.series);
    console.log(this.repeticoes);
  }



  criarFicha() {
    this.fichas.add({ uid: '', rotulo: this.rotulo, descanso: new Date (this.descanso).toLocaleTimeString().substring(0,5), series: this.series, repeticoes: this.repeticoes}).then( (novaFicha: { id: any; }) => {
      this.fichas.doc(novaFicha.id).update({uid: novaFicha.id})
      console.log('Ficha Criada!');
      this.service.navegar('meutreino');
      });

  }

}
