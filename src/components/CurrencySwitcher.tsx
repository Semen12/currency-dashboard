/* eslint-disable react/react-in-jsx-scope */
import { CurrencyIndicator } from '../types/types';
import { ChoiceGroup } from '@consta/uikit/ChoiceGroup';
interface Props {
  value: CurrencyIndicator; //значение выбранной вылюты
  onChange: (value: CurrencyIndicator) => void; //колбэк функция при измнении выбора
  size?: 's' | 'm' | 'xs' | 'l'; // Опциональный размер компонента
}

export const options = [
  { label: '$', value: 'Курс доллара' }, // Отображается доллар
  { label: '€', value: 'Курс евро' }, // Отображается евро
  { label: '¥', value: 'Курс юаня' }, // Отображается юань
];

const CurrencySwitcher: React.FC<Props> = ({ value, onChange, size = 'm' }) => {
  // Находим объект-опцию, соответствующий текущему значению value.
  // Если не найдена — берём первую опцию по умолчанию.
  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <ChoiceGroup
      size={size}
      name="ChoiceCurrency"
      items={options}
      value={selectedOption}
      getItemLabel={(opt) => opt.label} // Функция для получения метки радио-кнопки
      onChange={({ value: newOption }) => {
        //  вызываем колбэк с новым значением
        onChange(newOption.value);
      }}
    />
  );
};

export default CurrencySwitcher;
