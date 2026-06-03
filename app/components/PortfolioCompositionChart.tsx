import { StakedAsset } from '../types';
import dynamic from 'next/dynamic';
import React from 'react';
import { Pie, Cell, ResponsiveContainer } from 'recharts';

const PieChart = dynamic(
  () => import('recharts').then((recharts) => recharts.PieChart),
  { ssr: false }
);

const PortfolioCompositionChart = ({ data }: { data: StakedAsset[] }) => {
  const chartData = data.map((asset) => ({
    ...asset,
    value: Number(asset.balance * Number(asset.price!)),
  }));

  console.log('chartData', chartData);

  return (
    <ResponsiveContainer width='100%' height={500}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey='value'
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
          }: any) => {
            if (midAngle === undefined) return null;
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
          {chartData.map((item, index) => (
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
    </ResponsiveContainer>
  );
};

export default PortfolioCompositionChart;
