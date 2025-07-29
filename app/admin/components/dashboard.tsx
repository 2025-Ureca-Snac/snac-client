'use client';
import React from 'react';
import dynamic from 'next/dynamic';

import NewReportIcon from '../../../public/newReport.svg';
import PostIcon from '../../../public/post.svg';
import TotalUserIcon from '../../../public/totalUser.svg';
import IssueIcon from '../../../public/issue.svg';

const WeeklyReportsChart = dynamic(
  () => import('./weekly-reports-chart').then((mod) => mod.WeeklyReportsChart),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-80 bg-gray-200 rounded-lg animate-pulse" />
    ),
  }
);

const ReportTypesChart = dynamic(
  () => import('./report-types-chart').then((mod) => mod.ReportTypesChart),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-80 bg-gray-200 rounded-lg animate-pulse" />
    ),
  }
);

type MetricCardProps = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  colorClass: string;
  valueColorClass?: string;
};

function MetricCard({
  title,
  value,
  icon,
  colorClass,
  valueColorClass = 'text-gray-800',
}: MetricCardProps) {
  const Icon = icon;
  return (
    <div className="bg-white p-6 rounded-2xl shadow-light flex items-center justify-between">
      <div>
        <p className="text-regular-sm font-medium text-gray-500">{title}</p>
        <p className={`text-regular-2xl3xl font-bold ${valueColorClass}`}>
          {value}
        </p>
      </div>
      <div className={`${colorClass} p-3 rounded-full`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}

export function Dashboard() {
  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="총 사용자"
          value="1,234"
          icon={TotalUserIcon}
          colorClass="bg-indigo-100 text-blue-600"
        />
        <MetricCard
          title="신규 신고"
          value="28"
          icon={NewReportIcon}
          colorClass="bg-yellow-100 text-yellow-600"
        />
        <MetricCard
          title="활성 게시글"
          value="589"
          icon={PostIcon}
          colorClass="bg-green-100 text-green-600"
        />
        <MetricCard
          title="처리 필요 이슈"
          value="3"
          icon={IssueIcon}
          colorClass="bg-pink-100 text-pink-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-light">
          <h3 className="text-regular-lg font-semibold text-gray-800 mb-4">
            주간 신고 현황
          </h3>
          <WeeklyReportsChart />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-light">
          <h3 className="text-regular-lg font-semibold text-gray-800 mb-4">
            신고 유형 분포
          </h3>
          <ReportTypesChart />
        </div>
      </div>
    </main>
  );
}
