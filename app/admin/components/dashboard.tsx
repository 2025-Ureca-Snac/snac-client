'use client';
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAdminStore } from '@/app/(shared)/stores/use-admin-store';

import NewReportIcon from '@/public/newReport.svg';
import PostIcon from '@/public/post.svg';
import TotalUserIcon from '@/public/totalUser.svg';
import QnaIcon from '@/public/qna.svg';

const ReportTypesChart = dynamic(
  () => import('./report-types-chart').then((mod) => mod.ReportTypesChart),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-72 md:h-80 bg-muted rounded-lg animate-pulse" />
    ),
  }
);

const QnaTypesChart = dynamic(
  () => import('./qna-types-chart').then((mod) => mod.QnaTypesChart),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-72 md:h-80 bg-muted rounded-lg animate-pulse" />
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
  onClick?: () => void;
};

function MetricCard({
  title,
  value,
  icon,
  colorClass,
  valueColorClass = 'text-foreground',
  isLoading,
  onClick,
}: MetricCardProps) {
  const Icon = icon;
  const CardContent = (
    <>
      <div>
        <p className="text-regular-sm font-medium text-muted-foreground text-muted-foreground">
          {title}
        </p>
        {isLoading ? (
          <div className="mt-1 h-8 w-24 bg-muted rounded animate-pulse"></div>
        ) : (
          <p className={`text-regular-2xl3xl font-bold ${valueColorClass}`}>
            {value}
          </p>
        )}
      </div>
      <div className={`${colorClass} p-3 rounded-full`}>
        <Icon className="h-6 w-6" />
      </div>
    </>
  );

  return onClick ? (
    <button
      onClick={onClick}
      className="bg-card p-6 rounded-2xl shadow-light flex items-center justify-between w-full text-left
                   cursor-pointer hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-teal-green focus:ring-opacity-50"
      disabled={isLoading}
    >
      {CardContent}
    </button>
  ) : (
    <div className="bg-card p-6 rounded-2xl shadow-light flex items-center justify-between">
      {CardContent}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="총 사용자"
          icon={TotalUserIcon}
          value={dashboardMetrics?.memberCount ?? '...'}
          colorClass="bg-indigo-100 text-blue-600"
          isLoading={loading}
        />
        <MetricCard
          title="총 게시글"
          value={dashboardMetrics?.activePostsCount ?? '...'}
          icon={PostIcon}
          colorClass="bg-green-100 text-green-600"
          isLoading={loading}
          onClick={() => (window.location.href = '/blog/admin')}
        />
        <MetricCard
          title="총 신고"
          value={dashboardMetrics?.countByCategory?.REPORT ?? '...'}
          icon={NewReportIcon}
          colorClass="bg-yellow-100 text-yellow-600"
          isLoading={loading}
          onClick={() => (window.location.href = '/admin/dispute/report')}
        />
        <MetricCard
          title="총 문의"
          value={dashboardMetrics?.countByCategory?.QNA ?? '...'}
          icon={QnaIcon}
          colorClass="bg-purple-100 text-purple-600"
          isLoading={loading}
          onClick={() => (window.location.href = '/dispute/qna')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card p-6 rounded-2xl shadow-light flex flex-col">
          <h3 className="text-regular-lg font-semibold text-foreground mb-4">
            신고 유형 분포
          </h3>
          <ReportTypesChart />
        </div>
        <div className="bg-card p-6 rounded-2xl shadow-light flex flex-col">
          <h3 className="text-regular-lg font-semibold text-foreground mb-4">
            문의 유형 분포
          </h3>
          <QnaTypesChart />
        </div>
      </div>
    </div>
  );
}
