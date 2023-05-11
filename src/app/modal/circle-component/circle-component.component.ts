import { Component, OnInit, NgModule, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { exercicioI } from '../../model/exercicios';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';

const circleR = 80;
const circleDasharray = 2 * Math.PI * circleR;

@Component({
  standalone: true,
  selector: 'app-circle-component',
  templateUrl: './circle-component.component.html',
  styleUrls: ['./circle-component.component.scss'],
  imports: [CommonModule,
  IonicModule],
})

export class CircleComponentComponent  implements OnInit {
  
  @Input("exe") exe: any;
  @Input("series") series: any;
  @Input("repeticoes") repeticoes: any;
  @Input("peso") peso: any;
  @Input("descanso") descanso: any;

  circleR = circleR;
  circleDasharray = circleDasharray

  stateExe: 'start' | 'stop' = 'stop';
  stateDescanso: 'start' | 'stop' = 'stop';

  nomeExe = ''
  tempoExe = 0
  imgExe = ''

  timeExe: BehaviorSubject<string> = new BehaviorSubject('00:00');
  timeDescanso: BehaviorSubject<string> = new BehaviorSubject('00:00');
  percent: BehaviorSubject<number> = new BehaviorSubject(0);
  percentDescanso: BehaviorSubject<number> = new BehaviorSubject(0);

  timerExe: any;
  timerDescanso: any;
  intervalExe: any;
  intervalDescanso: any;
  timerExeInitial!: number;
  timerDescansoInitial!: number;

  numeroSeries = 0
  totalSeries = 1

  constructor(
    private firestore: AngularFirestore,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    
  }

  async fecharModal() {
    const dataToReturn = {
      exercicio: this.exe,
      series: this.series,
      repeticoes: this.repeticoes,
      peso: this.peso
    };
    await this.modalCtrl.dismiss(dataToReturn);
  }

  ionViewWillEnter() {
    const exercicioBanco = this.firestore.collection<exercicioI>('exercicios', ref => ref.where('uid', '==', this.exe)).valueChanges();
    exercicioBanco.subscribe((res: exercicioI[]) => {

    this.numeroSeries = this.series
    this.timerDescansoInitial = this.descanso
    this.timerDescanso = this.descanso

      res.forEach((item) => {
        this.nomeExe = String(item.nome);
        this.imgExe = String(item.img);
        this.tempoExe = Number(item.tempo);
      });
    })
    this.startTimerExe();
  }

  startTimerDescanso() {
    this.stateDescanso = 'start';
    const [minutes, seconds] = this.descanso.split(':');
    const totalTempoDescanso = (+minutes * 60) + (+seconds);
    this.timerDescansoInitial = totalTempoDescanso
    this.timerDescanso = totalTempoDescanso
    this.intervalDescanso = setInterval( () => {
      this.updateTimeValueDescanso();
    }, 1000)
}

stopTimerDescanso() {
  clearInterval(this.intervalDescanso);
  this.timeDescanso.next('00:00');
  this.stateDescanso = 'stop';
  if(this.numeroSeries>0) {
    this.startTimerExe();
  }
}

async pularDescanso() {
  this.stopTimerDescanso();
}

updateTimeValueDescanso() {
    let minutes: any = this.timerDescanso / 60;
    let seconds: any = this.timerDescanso % 60;

    minutes = String('0' + Math.floor(minutes)).slice(-2);
    seconds = String('0' + Math.floor(seconds)).slice(-2);

    const text = minutes + ':' + seconds;
    this.timeDescanso.next(text);

    const totalTime = this.timerDescansoInitial
    const percentage = ((totalTime - this.timerDescanso) / totalTime) * 100;
    this.percentDescanso.next(percentage)

    --this.timerDescanso;

    if (this.timerDescanso < 0) {
      this.stopTimerDescanso();
    }
}

  percentageOffsetDescanso(percent: any) {
    const percentFloat = percent / 100;
    return circleDasharray * (1 + percentFloat);
  }

  startTimerExe() {
    this.stateExe = 'start';
    this.firestore.collection<exercicioI>('exercicios', ref => ref.where('uid', '==', this.exe)).valueChanges().subscribe((res: exercicioI[]) => {

      res.forEach((item) => {
        if (item.tempo) {
        this.timerExe = (this.repeticoes * item.tempo)+3;
        this.timerExeInitial = Number((this.repeticoes * item.tempo)+3);
      }
        return
      });

    })
    this.intervalExe = setInterval( () => {
      this.updateTimeValueExe();
    }, 1000)
}

stopTimerExe() {
  clearInterval(this.intervalExe);
  this.numeroSeries-=1;
  this.totalSeries+=1;
  this.timeExe.next('00:00');
  this.stateExe = 'stop';
  if(this.numeroSeries>0) {
    this.startTimerDescanso();
  }
  else{
    console.log('Exercício terminou!')
  }
}

async pararExercicio() {  
  this.stopTimerExe();
  await this.modalCtrl.dismiss();
}

updateTimeValueExe() {
    let minutes: any = this.timerExe / 60;
    let seconds: any = this.timerExe % 60;

    minutes = String('0' + Math.floor(minutes)).slice(-2);
    seconds = String('0' + Math.floor(seconds)).slice(-2);

    const text = minutes + ':' + seconds;
    this.timeExe.next(text);

    const totalTime = this.timerExeInitial
    const percentage = ((totalTime - this.timerExe) / totalTime) * 100;
    this.percent.next(percentage)

    --this.timerExe;

    if (this.timerExe < 0) {
      this.stopTimerExe();
    }
}

  percentageOffset(percent: any) {
    const percentFloat = percent / 100;
    return circleDasharray * (1 + percentFloat);
  }

}
