import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function SimpleBarChart({ pLabel, uLabel, pData, uData, label }) {
  
  return (
    <BarChart
      width={800}
      height={400}
      series={[
        { data: pData, label: pLabel, id: 'pvId' },
        { data: uData, label: uLabel, id: 'uvId' },
      ]}
      xAxis={[{ data: label, scaleType: 'band' }]}
    />
  );
}