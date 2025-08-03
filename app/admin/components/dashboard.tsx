'use client';
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAdminStore } from '@/app/(shared)/stores/use-admin-store';

import NewReportIcon from '@/public/newReport.svg';
import PostIcon from '@/public/post.svg';
import TotalUserIcon from '@/public/totalUser.svg';

const WeeklyReportsChart = dynamic(
  () => import('./weekly-reports-chart').then((mod) => mod.WeeklyReportsChart),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-80 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
    ),
  }
);

const ReportTypesChart = dynamic(
  () => import('./report-types-chart').then((mod) => mod.ReportTypesChart),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-80 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
    ),
  }
);

type MetricCardProps = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  colorClass: string;
  valueColorClass?: string;
  isLoading?: boolean;
};

function MetricCard({
  title,
  value,
  icon,
  colorClass,
  valueColorClass = 'text-gray-800 dark:text-gray-100',
  isLoading,
}: MetricCardProps) {
  const Icon = icon;
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-light flex items-center justify-between">
      <div>
        <p className="text-regular-sm font-medium text-gray-500 dark:text-gray-300">
          {title}
        </p>
        {isLoading ? (
          <div className="mt-1 h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        ) : (
          <p className={`text-regular-2xl3xl font-bold ${valueColorClass}`}>
            {value}
          </p>
        )}
      </div>
      <div className={`${colorClass} p-3 rounded-full`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}

export function Dashboard() {
  const { dashboardMetrics, loading, error, fetchDashboardMetrics } =
    useAdminStore();

  useEffect(() => {
    fetchDashboardMetrics();
  }, [fetchDashboardMetrics]);

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        <MetricCard
          title="총 사용자"
          icon={TotalUserIcon}
          value={dashboardMetrics?.memberCount ?? '...'}
          colorClass="bg-indigo-100 text-blue-600 dark:bg-indigo-900 dark:text-blue-300"
          isLoading={loading}
        />
        <MetricCard
          title="신고 수"
          value={28} // TODO: API 연동 필요
          icon={NewReportIcon}
          colorClass="bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
          isLoading={loading}
        />
        <MetricCard
          title="활성 게시글"
          value={dashboardMetrics?.activePostsCount ?? '...'}
          icon={PostIcon}
          colorClass="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
          isLoading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-light">
          <h3 className="text-regular-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            주간 신고 현황
          </h3>
          <WeeklyReportsChart />
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-light">
          <h3 className="text-regular-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            신고 유형 분포
          </h3>
          <ReportTypesChart />
        </div>
      </div>
    </div>
  );
}
