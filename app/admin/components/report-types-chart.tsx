'use client';

import { useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useAdminStore } from '@/app/(shared)/stores/use-admin-store';

const COLORS = ['#ff5c5c', '#ffb4a2'];

export function ReportTypesChart() {
  const {
    reportChartData,
    reportChartLoading,
    reportChartError,
    fetchReportChartData,
  } = useAdminStore();

  useEffect(() => {
    fetchReportChartData();
  }, [fetchReportChartData]);

  if (reportChartLoading) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-muted-foreground">
        데이터를 불러오는 중...
      </div>
    );
  }

  if (reportChartError) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-red-500">
        {reportChartError}
      </div>
    );
  }

  if (reportChartData.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-muted-foreground">
        표시할 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <BarChart
          data={reportChartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barCategoryGap={32}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(5px)',
              border: '1px solid #D4D4D4',
              borderRadius: '0.5rem',
            }}
          />
          <Legend />
          <Bar
            dataKey="value"
            name="문의 수"
            radius={[10, 10, 0, 0]}
            maxBarSize={56}
          >
            {reportChartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
