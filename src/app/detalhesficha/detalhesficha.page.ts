import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Database } from '../shared/database';
import { Services } from '../shared/services';
import { subexercicioI } from '../model/subexercicios';
import { UnsubscriptionError } from 'rxjs';

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

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public database: Database,
    public service: Services,
  ) {

   }

   ionViewWillEnter() {

    this.categoriasList = [];

    this.activatedRoute.queryParams.subscribe(params => {
      this.fichaId = params[0];
      this.fichas = this.firestore.collection('fichas', ref => ref.where('uid','==', this.fichaId)).valueChanges();
      this.exercicios = this.firestore.collection('fichas').doc(this.fichaId).collection('exercicio').valueChanges();
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


  detalharExercicio(exercicio: any) {
    setTimeout(() => this.router.navigate(['detalhesexercicio'],{
      queryParams: [exercicio]
      }),150);
  }

  ngOnInit() {
    
  }

}
