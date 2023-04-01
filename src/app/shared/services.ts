import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
  })

export class Services {
  
  constructor(
    private router: Router
  ) 
  
  {

  }

  public navegar(url: string) {
        setTimeout(() => this.router.navigateByUrl(url),180);
     }
    
  }
