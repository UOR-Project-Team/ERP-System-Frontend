import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function PieActiveArc({data}) {
  return (
    <PieChart
      series={[
        {
          data,
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
        },
      ]}
      height={200}
    />
  );
}