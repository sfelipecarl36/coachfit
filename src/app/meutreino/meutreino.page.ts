import { Component, OnInit } from '@angular/core';
import { Services } from '../shared/services';
import { Database } from '../shared/database';
import { Observable, of } from 'rxjs';
import { subexercicioI } from '../model/subexercicios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meutreino',
  templateUrl: './meutreino.page.html',
  styleUrls: ['./meutreino.page.scss'],
})
export class MeutreinoPage implements OnInit {

  fichas!: any;
  exercicios!: Observable<Array<subexercicioI>>;
  exerciciosPorFicha: { [key: string]: any[] } = {};
  categorias!: any;
  exerciciosBanco!: any;
  fichasSubscription: any;
  exerciciosSubscription: any;
  categoriasSubscription: any;

  constructor(
    public service: Services,
    private router: Router,
    public database: Database,
  ) {

  }

  carregarExerciciosPorFicha(): void {
    for (const ficha of this.fichas) {
      this.database.getExerciciosPorFicha(ficha.uid).subscribe((exercicios: any[]) => {
        this.exerciciosPorFicha[ficha.uid] = exercicios;
      });
    }
    this.service.fecharLoading();
  }

  ngOnDestroy() {
    if (this.fichasSubscription) {
      this.fichasSubscription.unsubscribe();
    }
  }

  async ngOnInit() {
    
    this.service.abrirLoading('Carregando Fichas');

    this.fichasSubscription = this.database.getFichas().subscribe(fichas => {
      this.fichas = fichas;
      this.carregarExerciciosPorFicha();
    });

    this.exerciciosSubscription = this.database.getExercicios().subscribe(exercicios => {
      this.exerciciosBanco = exercicios
    })
      this.categoriasSubscription = this.database.getCategorias().subscribe(categorias => {
        this.categorias = categorias
      })
  }

  detalharFicha(ficha: any, ficharotulo: any) {
    setTimeout(() => this.router.navigate(['detalhesficha'],{
      queryParams: [ficha, ficharotulo]
      }),150);
  }

}
