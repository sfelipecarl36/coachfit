import { Component, OnInit } from '@angular/core';
import { Services } from '../shared/services';

@Component({
  selector: 'app-criaficha',
  templateUrl: './criaficha.page.html',
  styleUrls: ['./criaficha.page.scss'],
})
export class CriafichaPage implements OnInit {

  rotulo: string = '';
  rotulos = ['A', 'B', 'C'];

  constructor(
    public service: Services
  ) { 
    
  }

  ngOnInit() {
  }

  checkValue(event: any) { 
    this.rotulo = event.detail.value;
    }

}
