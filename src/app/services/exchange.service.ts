import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { xml2json } from 'xml2json-light';

import { Rates } from '../interfaces/interaces';

@Injectable({
  providedIn: 'root',
})
export class ExchangeService {
  index = 0;
  private rateUrls = [
    { link: 'https://www.cbr-xml-daily.ru/daily_json.js', type: 'json' },
    { link: 'https://www.cbr-xml-daily.ru/daily_utf8.xml', type: 'xml' },
  ];

  constructor(private http: HttpClient) {}

  callApi(): Observable<Rates> {
    if (this.rateUrls[this.index].type === 'xml') {
      return this.http
        .get(this.rateUrls[this.index].link, { responseType: 'text' })
        .pipe(
          map((res) => {
            return xml2json(res).ValCurs.Valute.filter(
              (x) => x.CharCode === 'EUR'
            )[0];
          })
        );
    } else {
      return this.http
        .get(this.rateUrls[this.index].link)
        .pipe(map((res) => res['Valute'].EUR));
    }
  }

  getRate(): Observable<Rates> {
    return this.callApi().pipe(
      retry(3),
      catchError((err) => {
        if (this.rateUrls.length > this.index) {
          this.index = this.index + 1;
          return this.getRate();
        } else {
          throw err;
        }
      })
    );
  }
}
