import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { LoadingController } from '@ionic/angular';


@Injectable()
export class SpreadsheetData {
  items:any;
  url:string = 'https://docs.google.com/spreadsheets/d/1RWzUR9kWcPYyqqKEs1UUjvz0J5eXbSlmvLEzgf2H_YA/edit?usp=sharing';
  constructor(public http: Http, public loadingCtrl: LoadingController) {

  }

  fetchCountryData(){
    this.http.get(this.url).map(res => res.json()).subscribe(
        data =>{
            this.items = data.Sheet1;
        },
        error =>{
        console.log("DATA"+this.items);
        }
    );
  }
}