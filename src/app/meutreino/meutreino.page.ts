import { Component, OnInit } from '@angular/core';
import { Services } from '../shared/services';
import { Database } from '../shared/database';

@Component({
  selector: 'app-meutreino',
  templateUrl: './meutreino.page.html',
  styleUrls: ['./meutreino.page.scss'],
})
export class MeutreinoPage implements OnInit {

  fichas!: any
  categorias!: any;
  exercicios!: any;
  exerciciosBanco!: any;

  constructor(
    public service: Services,
    private database: Database
  ) {

  }

  ngOnInit() {
    this.exerciciosBanco = this.database.exerciciosLocal
    this.fichas = this.database.fichasLocal
    this.categorias = this.database.categoriasLocal
    this.exercicios = this.database.subexerciciosLocal
  }

}
