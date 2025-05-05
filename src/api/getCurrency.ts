import axios from 'axios';
import { CurrencyRecord } from '../types/types.ts';

const BASE_URL = 'https://6816144432debfe95dbd5d5a.mockapi.io/rates'; // Базовый URL для API, откуда будем получать данные о валютах

// Асинхронная функция для получения данных о валютах
export async function getCurrencies(): Promise<CurrencyRecord[]> {
  try {
    // Выполняем HTTP GET запрос к API для получения данных о валютах
    const response = await axios.get(BASE_URL);

    // Возвращаем данные из ответа.
    return response.data;
  } catch (e) {
    // Если произошла ошибка при запросе , выводим |базовую| ошибку в консоль
    console.error(e);

    // Выбрасываем ошибку, чтобы обработать её в другом месте
    throw new Error('Не удалось получить данные');
  }
}
