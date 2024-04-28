import { StakedAsset } from '@/app/types';
import dynamic from 'next/dynamic';
import React from 'react';
import { Pie, Cell } from 'recharts';

const PieChart = dynamic(
  () => import('recharts').then((recharts) => recharts.PieChart),
  { ssr: false }
);

const PortfolioCompositionChart = ({ data }: { data: StakedAsset[] }) => {
  return (
    <PieChart width={800} height={800}>
      <Pie
        data={data}
        dataKey='balance'
        startAngle={90}
        endAngle={-270}
        cx='50%'
        cy='50%'
        innerRadius={100}
        outerRadius={200}
        cornerRadius={5}
        label={({
          cx,
          cy,
          midAngle,
          innerRadius,
          outerRadius,
          value,
          symbol,
        }) => {
          const RADIAN = Math.PI / 180;
          const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
          const x = cx + radius * Math.cos(-midAngle * RADIAN);
          const y = cy + radius * Math.sin(-midAngle * RADIAN);
          return (
            <text
              x={x}
              y={y}
              fill='#000'
              textAnchor={x > cx ? 'start' : 'end'}
              dominantBaseline='central'
            >
              {symbol}
            </text>
          );
        }}
        labelLine={false}
      >
        {data.map((item, index) => (
          <Cell
            key={`cell-${index}`}
            fill={item.color}
            stroke='rgba(255,255,255, 0.5'
            strokeWidth={2}
            radius={7}
          />
        ))}
      </Pie>
    </PieChart>
  );
};

export default PortfolioCompositionChart;
