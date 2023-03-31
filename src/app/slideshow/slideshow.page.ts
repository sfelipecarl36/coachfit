import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.page.html',
  styleUrls: ['./slideshow.page.scss'],
})
export class SlideshowPage {

  slides = [
    {
      title: "Seja Forte & Seja Fitness",
      description: "Com o nosso aplicativo Alcance os seus objetivos almejados com simplicidade e clareza.",
      image: "../assets/img/slide1-image.png",
    },
  ];

}
