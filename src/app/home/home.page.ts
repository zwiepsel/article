import { Component } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {
  BarcodeScannerOptions,
  BarcodeScanner
} from "@ionic-native/barcode-scanner/ngx";
import { SegmentChangeEventDetail } from '@ionic/core';
import { HTTP } from '@ionic-native/http/ngx';
import { from } from 'rxjs';


@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  encodeData: any;
  scannedData: {};
  barcodeScannerOptions: BarcodeScannerOptions;
  article:any;
  scan: boolean;
  pickup: boolean;
  url:string = 'http://h2733926.stratoserver.net/livoni/api/articles/get?Barcode=';
  updateUrl:string = 'http://h2733926.stratoserver.net/livoni/api/articles/update';
  httpOptions = {};

  constructor(private barcodeScanner: BarcodeScanner, private httpService: HttpClient, private http: HTTP) {
    //Options
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };
    this.pickup = true;
    this.article = {};
    this.article.BarCode = '';
    this.article.ArticleCode = '';
    this.article.Amount = '';
    this.article.Description = '';
  }



  getArticle( barCode: string){
    this.httpService.get(`${this.url}${barCode}`).subscribe(
        data =>{
            this.article = data
            alert(JSON.stringify(this.article))
        },
        error =>{
        alert("Fout tijdens ophalen data: " + error )
        }
    );
  }

  async saveArticle(barCode, amount){
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept' : 'application/json'
      })
    }
    // this.getArticle('049000040869')

    var data =  {
      "BarCode": "049000040869",
      "Amount": 66
    }
    // this.httpService.post(this.updateUrl,data).subscribe(data => {
    //  console.log(data)
    // })
 
    // Returns a promise, need to convert with of() to Observable (if want)!
    from(this.http.post(this.updateUrl, {
      "BarCode": "049000040869",
      "Amount": "66"
    }, {'Content-Type': 'application/json'})).subscribe(data => {
      let parsed = JSON.parse(data.data);
      alert(parsed.results);
    }, err => {
      alert("fout" + JSON.stringify(err));
    });


    // var result = from( // wrap the fetch in a from if you need an rxjs Observable
    //   fetch(
    //     this.updateUrl,
    //     {
    //       body: JSON.stringify(data),
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       method: 'POST',
    //       mode: 'no-cors'
    //     }
    //   )
    // );
    
  }

  async getData() {
    try {
      const url = 'https://api.example.com';
      const params = {};
      const headers = {};

      const response = await this.http.get(url, params, headers);

      console.log(response.status);
      console.log(JSON.parse(response.data)); // JSON data returned by server
      console.log(response.headers);

    } catch (error) {
      console.error(error.status);
      console.error(error.error); // Error message as string
      console.error(error.headers);
    }
  }

  scanCode() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
       this.getArticle(barcodeData.text);
      })
      .catch(err => {
        alert("Fout tijdens scannen: " +  err);
      });
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    event.detail.value === 'scan' ? this.scan = true : this.scan = false;
  }

  // Code for QR SCANNER CAN BE COMMENTED OUT FOR NOW
  // encodedText() {
  //   this.barcodeScanner
  //     .encode(this.barcodeScanner.Encode.TEXT_TYPE, this.encodeData)
  //     .then(
  //       encodedData => {
  //         console.log(encodedData);
  //         this.encodeData = encodedData;
  //       },
  //       err => {
  //         console.log("Error occured : " + err);
  //       }
  //     );
  // }
}
