import { Component } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {
  BarcodeScannerOptions,
  BarcodeScanner
} from "@ionic-native/barcode-scanner/ngx";
import { SegmentChangeEventDetail } from '@ionic/core';
import { from } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HTTP } from '@ionic-native/http/ngx';
import { Platform, LoadingController } from '@ionic/angular';


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

  constructor(private barcodeScanner: BarcodeScanner, private httpService: HttpClient, private nativeHttp: HTTP, private plt: Platform, private loadingCtrl: LoadingController) {
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
    // this.getArticle('049000040869')

    var data =  {
      "BarCode": "049000040869",
      "Amount": 24
    }

      let loading = await this.loadingCtrl.create();
      await loading.present();
      from(this.nativeHttp.post(this.updateUrl, { "BarCode": "049000040869", "Amount": 66}, {'Content-Type': 'application/json'})).pipe(
        finalize(() => loading.dismiss())
      ).subscribe(data => {
        let parsed = JSON.parse(data.data);
        this.article = parsed.results;
      }, err => {
        console.log('Native Call error: ', err);
      });
    }

    
  scanCode() {
    this.getArticle('3574661173542');
    // this.barcodeScanner
    //   .scan()
    //   .then(barcodeData => {

    //    this.getArticle(barcodeData.text);
    //   })
    //   .catch(err => {
    //     alert("Fout tijdens scannen: " +  err);
    //   });
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
