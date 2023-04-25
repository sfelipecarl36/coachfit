import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Database } from '../shared/database';

@Component({
  selector: 'app-detalhesexercicio',
  templateUrl: './detalhesexercicio.page.html',
  styleUrls: ['./detalhesexercicio.page.scss'],
})
export class DetalhesexercicioPage implements OnInit {

  exercicios: any;
  exercicioId: any;
  categorias: any;

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public database: Database,
  ) {

    setTimeout(() => console.log('Oi'),280);
      
    this.activatedRoute.queryParams.subscribe(params => {
        this.exercicioId = params[0];
        this.exercicios = this.firestore.collection('exercicios', ref => ref.where('uid','==', this.exercicioId)).valueChanges();
        this.categorias = this.database!.categoriasLocal
    })

   }

  ngOnInit() {
  }



}
