// Тип CurrencyIndicator определяет возможные значения для индикатора валюты
export type CurrencyIndicator = 'Курс доллара' | 'Курс евро' | 'Курс юаня';

// Интерфейс CurrencyRecord описывает структуру объекта, представляющего запись о валюте
export interface CurrencyRecord {
  indicator: CurrencyIndicator; //индикатор валюты
  month: string; //месяц
  value: number; // значение за данный месяц
}
