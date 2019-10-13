export class Article{
    BarCode: string;
    ArticleCode: string;
    Description: string;
    Amount: number;

    constructor(BarCode, ArticleCode, Description, Amount){
        this.BarCode = BarCode;
        this.ArticleCode = ArticleCode;
        this.Description = Description;
        this.Amount = Amount;
    }
  }