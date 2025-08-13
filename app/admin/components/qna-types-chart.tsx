'use client';

import { useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  Legend,
  ResponsiveContainer as PieResponsiveContainer,
} from 'recharts';
import { useAdminStore } from '@/app/(shared)/stores/use-admin-store';

const COLORS = ['#82B1FF', '#FDD835', '#a374db'];

export function QnaTypesChart() {
  const { qnaChartData, qnaChartLoading, qnaChartError, fetchQnaChartData } =
    useAdminStore();

  useEffect(() => {
    fetchQnaChartData();
  }, [fetchQnaChartData]);

  if (qnaChartLoading) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-muted-foreground">
        데이터를 불러오는 중...
      </div>
    );
  }

  if (qnaChartError) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-red-500">
        {qnaChartError}
      </div>
    );
  }

  if (qnaChartData.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-muted-foreground">
        표시할 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <PieResponsiveContainer>
        <PieChart>
          <Pie
            data={qnaChartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
            stroke="none"
          >
            {qnaChartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <PieTooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(5px)',
              border: '1px solid #D4D4D4',
              borderRadius: '0.5rem',
            }}
          />
          <Legend iconType="circle" />
        </PieChart>
      </PieResponsiveContainer>
    </div>
  );
}
