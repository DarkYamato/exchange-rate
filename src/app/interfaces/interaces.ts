export interface Rates {
  Valute: {
    [key: string]: Currency;
  };
}

export interface Currency {
  CharCode: string;
  Value: number;
}
