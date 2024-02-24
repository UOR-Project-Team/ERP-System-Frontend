import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function SimpleLineChart({ pLabel, uLabel, pData, uData, label }) {
  return (
    <LineChart
      width={900}
      height={300}
      series={[
        { data: pData, label: pLabel },
        { data: uData, label: uLabel },
      ]}
      xAxis={[{ scaleType: 'point', data: label }]}
    />
  );
}