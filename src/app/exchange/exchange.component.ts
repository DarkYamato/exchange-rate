import { Component } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ExchangeService } from '../services/exchange.service';
import { Rates } from '../interfaces/interaces';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.css'],
})
export class ExchangeComponent {
  now: Date = new Date();

  eur$: Observable<Rates> = timer(0, 10000).pipe(
    mergeMap(() => this.exhangeService.getRate())
  );
  constructor(private exhangeService: ExchangeService) {
    setInterval(() => {
      this.now = new Date();
    }, 1000);
  }
}
