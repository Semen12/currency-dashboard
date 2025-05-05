import { Card } from '@consta/uikit/Card';
import React from 'react';

//типизация для компонета
interface PropsCard {
  average: string; //среднее значение
}

const AverageCard: React.FC<PropsCard> = ({ average }) => {
  return (
    //карточка с инлайновыми тилями для комопнента
    <Card style={{ flex: '0 0 163px', textAlign: 'center' }} shadow={false}>
      <p style={{ color: '#667985', fontWeight: '400', margin: '9px 0' }}>Среднее за период</p>
      <p style={{ color: '#F38B00', fontSize: '48px', margin: '20px 9px 3px 18px' }}>
        {average} <span style={{ color: '#667985', fontSize: '16px' }}>₽</span>
      </p>
    </Card>
  );
};

export default AverageCard;
