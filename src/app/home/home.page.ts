import {
  Component
} from "@angular/core";
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import {
  GlobalService
} from '../provider/global.data'
import {
  BarcodeScannerOptions,
  BarcodeScanner
} from "@ionic-native/barcode-scanner/ngx";
import {
  SegmentChangeEventDetail
} from '@ionic/core';
import {
  finalize
} from 'rxjs/operators';
import {
  HTTP
} from '@ionic-native/http/ngx';
import {
  Platform,
  LoadingController
} from '@ionic/angular';
import {
  from
} from 'rxjs';
import {
  Article
} from '../models/articleModel';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  encodeData: any;
  scannedData: {};
  barcodeScannerOptions: BarcodeScannerOptions;
  article: any;
  scan: number;
  pickup: boolean;
  // TEST URL's
  url: string = 'http://localhost:56871/api/articles/get?Barcode=';
  updateUrl: string = 'http://localhost:56871/api/articles/update';
  createUrl: string = 'http://localhost:56871/api/articles/new';
  allUrl: string = 'http://localhost:56871/api/articles/all'

  // LIVE URL's
  // url: string = 'http://h2733926.stratoserver.net/livoni/api/articles/get?Barcode=';
  // updateUrl: string = 'http://h2733926.stratoserver.net/livoni/api/articles/update';
  // createUrl: string = 'http://h2733926.stratoserver.net/livoni/api/articles/new';
  // allUrl: string = 'http://h2733926.stratoserver.net/livoni/api/articles/all'
  httpOptions = {};
  public filteredItems = [];
  public items = Array < Article > ();
  public searchTerm = '';

  constructor(private barcodeScanner: BarcodeScanner,
    private httpService: HttpClient,
    private nativeHttp: HTTP,
    private plt: Platform,
    private loadingCtrl: LoadingController,
    private globalService: GlobalService) {
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
    this.article.NewAmount = '';
    this.article.Locations = [];
  }

  ngOnInit() {
    this.httpService.get(`${this.allUrl}`).subscribe(
      data => {
        this.parseData(data);
      },
      error => {
        this.globalService.debug ? alert(JSON.stringify(error)) : alert("Product niet gevonden");
      });
  }

  parseData(jsonData: object) {
    //considering you get your data in json arrays
    this.items = [];
    this.filteredItems = null;
    for (let key in jsonData) {
      let value = jsonData[key];
      this.items.push(value)
    }
  }

  addNewLocation(){
    this.article.locations.push({ Location : '', Amount : null})
  }

  removeLocation(index){
    var articleLocation = this.article.locations[index]
    console.log(articleLocation)
    if(index !== -1 && articleLocation.Amount === 0){
      this.article.locations.splice(index, 1);
    }
  }

  getArticle(barCode: string) {
    if (barCode !== undefined && barCode !== '') {
      this.httpService.get(`${this.url}${barCode}`).subscribe(
        data => {
          this.article = data
        },
        error => {
          this.globalService.debug ? alert(JSON.stringify(error)) : alert("Product niet gevonden");
        });
    }
  }


  clearValues() {
    this.article.BarCode = '';
    this.article.Description = '';
    this.article.Amount = '';
    this.article.NewAmount = '';
    this.article.ArticleCode = '';
    this.article.locations = [];
  }

  async refreshData(){
    let loading = await this.loadingCtrl.create();
    await loading.present();
    this.httpService.get(`${this.allUrl}`).subscribe(data => {
      this.parseData(data);
      loading.dismiss();
    }, error => {
      this.globalService.debug ? alert(JSON.stringify(error)) : alert("Producten niet gevonden");
    });
  }

  async saveArticle() {
    if (this.article.locations.length !== 0) {
      let loading = await this.loadingCtrl.create();
      await loading.present();
      from(this.nativeHttp.post(this.updateUrl, {
        "BarCode": this.article.BarCode,
        "Amount": this.article.NewAmount.toString()
      }, {})).pipe(
        finalize(() => loading.dismiss())
      ).subscribe(data => {
        let article = JSON.parse(data.data);
        this.clearValues();
      }, err => {
        this.globalService.debug ? alert(JSON.stringify(err)) : alert("Fout tijdens opslaan");
      });
    }
  }

  async saveNewArticle() {
    console.log(this.article.locations)
    if (this.article.locations.length !== 0) {
      let loading = await this.loadingCtrl.create();
      await loading.present();
      from(this.nativeHttp.post(this.createUrl, {
        "Description": this.article.Description,
        "BarCode": this.article.BarCode,
        "Amount": this.article.locations[0].toString(),
        "ArticleCode" : this.article.ArticleCode,
        "Locations" : this.article.locations
      }, {})).pipe(
        finalize(() => loading.dismiss())
      ).subscribe(data => {
        let article = JSON.parse(data.data);
        this.article.BarCode = '';
        this.article.Description = '';
        this.article.ArticleCode = '';
        this.article.Amount = '';
        this.article.NewAmount = '';
      }, err => {
        this.globalService.debug ? alert(JSON.stringify(err)) : alert("Fout tijdens opslaan");
      });
    }
    else{
      alert('Niet alle gegevens gevuld')
    }
  }

  saveNewArticle2() {
    // console.log(this.article.locations)
    // if (this.article.locations.length !== 0) {
    //   (this.httpService.post(this.createUrl, {
    //     "Description": this.article.Description,
    //     "BarCode": this.article.BarCode,
    //     "Amount": this.article.locations[0].toString(),
    //     "ArticleCode" : this.article.ArticleCode
    //   }).subscribe(data => {
    //     let article = data;
    //     this.article.BarCode = '';
    //     this.article.Description = '';
    //     this.article.ArticleCode = '';
    //     this.article.Amount = '';
    //     this.article.NewAmount = '';
    //   }), err => {
    //     this.globalService.debug ? alert(JSON.stringify(err)) : alert("Fout tijdens opslaan");
    //   }
    // }
    this.httpService.post(`${this.createUrl}`,{
      "Description": this.article.Description,
      "BarCode": this.article.BarCode,
      "Amount": this.article.locations[0].toString(),
      "ArticleCode" : this.article.ArticleCode,
      "Locations" : this.article.locations
     } ).subscribe(data => {
      this.parseData(data);
    }, error => {
      this.globalService.debug ? alert(JSON.stringify(error)) : alert("Producten niet gevonden");
    });
  }

  getItems(ev: any) {
    this.filteredItems = this.items;
    this.filteredItems = this.filterLocations(ev.target.value);
  }

  // filter the items based on the typed in searchterm in the searchbar
  filterLocations(searchTerm) {
    if (searchTerm.length > 3) {
      return this.items.filter((item) => {
        return item.Description.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
  }

  getSelectedArticle(article) {
    this.getArticle(article.BarCode)
    // this.article = article;
    this.scan = 1;
  }

  scanCode() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {

        this.getArticle(barcodeData.text);
      })
      .catch(err => {
        this.globalService.debug ? alert(JSON.stringify(err)) : alert("Fout tijdens scannen");
      });
  }

  scanNewCode() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        this.article.BarCode = barcodeData.text;
      })
      .catch(err => {
        this.globalService.debug ? alert(JSON.stringify(err)) : alert("Fout tijdens scannen");
      });
  }

  onFilterUpdate(event: CustomEvent < SegmentChangeEventDetail > ) {
    if (event.detail.value === 'scan') {
      this.scan = 1;
      this.filteredItems = null;
    } else if (event.detail.value === 'search') {
      this.scan = 2;
      this.searchTerm = null;
    } else {
      this.scan = 3;
      this.filteredItems = null;
    }
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