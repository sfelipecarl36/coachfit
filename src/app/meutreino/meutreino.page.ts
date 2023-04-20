import { Component, OnInit } from '@angular/core';
import { Services } from '../shared/services';
import { Database } from '../shared/database';
import { AuthService } from '../shared/auth-service';
import { Observable } from 'rxjs';
import { subexercicioI } from '../model/subexercicios';
import { fichaI } from '../model/fichas';

@Component({
  selector: 'app-meutreino',
  templateUrl: './meutreino.page.html',
  styleUrls: ['./meutreino.page.scss'],
})
export class MeutreinoPage implements OnInit {

  fichas!: Observable<Array<fichaI>>;
  exercicios!: Observable<Array<subexercicioI>>;
  categorias!: any;
  exerciciosBanco!: any;

  constructor(
    public service: Services,
    private database: Database,
    private auth: AuthService
  ) {

  }

  ngOnInit() {
    this.exerciciosBanco = this.database!.exerciciosLocal
    this.categorias = this.database!.categoriasLocal
    this.fichas = this.database!.fichasLocal
    this.exercicios = this.database!.subexerciciosLocal
  }

  ionViewWillEnter () {
    this.database.atualizaValores(this.auth.userUid);
  }

}
