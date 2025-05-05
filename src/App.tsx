import { useEffect, useMemo, useState } from 'react';
import { CurrencyIndicator, CurrencyRecord } from './types/types.ts';
import { getCurrencies } from './api/getCurrency.ts';
import CurrencySwitcher, { options } from './components/CurrencySwitcher.tsx';
import classNames from 'classnames';
import AverageCard from './components/AverageCard.tsx';
import ChartCard from './components/ChartCard.tsx';
import { Text } from '@consta/uikit/Text';
import './styles.scss';
import { Card } from '@consta/uikit/Card/index';

function App() {
  // Состояния для хранения всех записей, выбранной валюты, индикатора загрузки и текста ошибки
  const [data, setData] = useState<CurrencyRecord[]>([]);
  const [selected, setSelected] = useState<CurrencyIndicator>('Курс доллара');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // При монтировании компонента — загружаем данные из API
  useEffect(() => {
    setLoading(true); // включаем индикатор загрузки

    getCurrencies()
      .then(setData) // сохраняем полученный массив
      .catch((e) => setError(e.message)) // при ошибке сохраняем текст ошибки
      .finally(() => setLoading(false)); // по завершении (успех или ошибка) — выключаем загрузку
  }, []); // пустой массив — вызов только один раз

  // Фильтруем данные по выбранному индикатору валюты
  const filtered = useMemo(() => {
    return data.filter((item) => item.indicator === selected);
  }, [data, selected]);

  // Вычисляем среднее значение по отфильтрованному набору
  const average = useMemo(() => {
    if (!filtered.length) return '0'; // если данных нет — возвращаем '0'

    // Считаем среднее и форматируем с одной цифрой после точки
    const avg = filtered.reduce((sum, cur) => sum + cur.value, 0) / filtered.length;
    const rounded = +avg.toFixed(1);

    // Форматируем число под локаль «ru-ru»
    return Intl.NumberFormat('ru-ru').format(rounded);
  }, [filtered]);

  return (
    <Card style={{ padding: '8px 13px', height: '100%' }}>
      <div className={classNames('dashboard', { loading })}>
        {/* Заголовок: большая надпись с выбранной валютой и её символом */}
        <div className="dashboard__header">
          <Text size="xl" weight="bold" color="primary">
            {selected.toLocaleUpperCase()},{' '}
            <span>{options.find((item) => item.value === selected)?.label}/₽</span>
          </Text>

          {/* Свитчер для выбора валюты */}
          <CurrencySwitcher size="xs" value={selected} onChange={setSelected} />
        </div>

        {/* Тело дашборда: либо ошибка, либо график и карточка среднего */}
        <div className="dashboard__body">
          {error ? (
            // Если есть текст ошибки — показываем его
            <div className="dashboard__body-error">{error}</div>
          ) : (
            <>
              {/* График курса за период */}
              <ChartCard
                data={filtered}
                loading={loading}
                style={{ minHeight: '300px' }}
                selectedCurrency={selected}
              />

              {/* Карточка со средним значением за период */}
              <AverageCard average={average} />
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

export default App;
