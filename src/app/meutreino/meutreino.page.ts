import { Component, OnInit } from '@angular/core';
import { Services } from '../shared/services';

@Component({
  selector: 'app-meutreino',
  templateUrl: './meutreino.page.html',
  styleUrls: ['./meutreino.page.scss'],
})
export class MeutreinoPage implements OnInit {

  constructor(
    public service: Services
  ) { }

  ngOnInit() {
  }

}
