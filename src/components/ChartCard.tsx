import React, { CSSProperties, useMemo } from 'react';
import { ReactECharts } from '../Echarts/ReactECharts';

interface ChartProps {
  data: { month: string; value: number }[]; // Массив объектов с месяцем и значением курса
  loading: boolean; // Флаг загрузки для отображения спиннера
  style?: CSSProperties; // Опциональные стили для контейнера графика
  selectedCurrency: string; // Выбранная валюта для подписи в тултипе
}

const ChartCard: React.FC<ChartProps> = ({ data, loading, style, selectedCurrency }) => {
  // Генерируем конфигурацию графика только при изменении данных или валюты
  const option = useMemo(() => {
    let isLeft = false; // Флаг для определения положения тултипа (слева или справа)

    // Извлекаем массив значений для построения шкалы Y
    const values = data.map((item) => item.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);

    // Расчёт шага сетки по Y: делим на четыре интервала и округляем
    const range = maxVal - minVal;
    const ticks = 4;
    const step = Math.ceil(range / ticks);

    // Вычисляем минимальные и максимальные границы оси Y, кратные шагу
    const yMin = Math.floor(minVal / step) * step;
    const yMax = Math.ceil(maxVal / step) * step;

    return {
      xAxis: {
        type: 'category', // Категориальная ось X (месяцы)
        data: data.map((item) => item.month), // Подписи по оси X
        boundaryGap: false,
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value', // Числовая ось Y
        min: yMin,
        max: yMax,
        interval: step, // Шаг делений на оси
        splitLine: {
          show: true, // Отображаем фоновые линии
          lineStyle: {
            type: 'dashed',
            color: '#00416633',
            width: 1,
          },
        },
      },
      tooltip: {
        trigger: 'axis',
        borderWidth: 0,
        padding: 0,
        backgroundColor: '#FFFFFF',

        // Позиционирование тултипа: если справа не помещается, показываем слева
        position: (point, _params, _dom, _rect, size) => {
          const [x, y] = point;
          const chartWidth = size.viewSize[0];
          const tooltipWidth = size.contentSize[0];

          if (x + tooltipWidth + 10 > chartWidth) {
            isLeft = true;
            return [x - tooltipWidth - 10, y - 30];
          }
          return [x + 10, y - 30];
        },

        // Собираем HTML для тултипа вручную, включая стрелку и стили
        formatter: function (params) {
          const point = params[0];
          const label = point.axisValue; // Месяц
          const value = point.value; // Значение курса

          // Стиль для указателя тултипа (стрелочки)
          const arrowStyle = isLeft
            ? `
              right: -6px;
              border-left: 6px solid white;
            `
            : `
              left: -6px;
              border-right: 6px solid white;
            `;

          return `
            <div style="
              position: relative;
              background: white;
              border: 1px solid #ccc;
              border-radius: 4px;
              padding: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              font-size: 12px;
              color: #333;
              width: 195px;
            ">
              <!-- Стрелочка тултипа -->
              <div style="
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 0;
                height: 0;
                border-top: 6px solid transparent;
                border-bottom: 6px solid transparent;
                opacity: 0.5;
                ${arrowStyle}
              "></div>

              <!-- Отображаем месяц -->
              <div style="
                font-weight: 700;
                font-size: 12px;
                line-height: 16.8px;
                color: #002033;
              ">
                ${label}
              </div>

              <!-- Значение с цветным маркером и валютой -->
              <div style="display: flex; align-items: center; gap: 6px; margin-top: 11px;">
                <span style="
                  width: 12px;
                  height: 12px;
                  background-color: #F38B00;
                  border-radius: 50%;
                  display: inline-block;
                "></span>
                <span style="color: #667985;">${selectedCurrency}</span>
                <span style="margin-left: auto; font-weight: 700;">${value} ₽</span>
              </div>
            </div>
          `;
        },
      },

      series: [
        {
          data: values, // Массив значений для построения линии
          type: 'line', // Линейный график
          smooth: 0.2, // Скругление углов линии
          showSymbol: false, // Не показывать маркеры у точек

          itemStyle: {
            color: '#F38B00', // цвет линии и точек по умолчанию
          },
        },
      ],
    };
  }, [data, selectedCurrency]); //измение только при новых данны и новой  валюте

  // Рендерим компонент-обёртку для ECharts
  return <ReactECharts option={option} loading={loading} style={style} />;
};

export default ChartCard;
