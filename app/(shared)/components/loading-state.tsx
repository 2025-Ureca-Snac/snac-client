import LoadingSpinner from '@/app/(shared)/components/LoadingSpinner';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = '사용자 정보를 불러오는 중...',
}: LoadingStateProps) {
  return (
    <div className="min-h-screen bg-background w-full flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" color="border-primary" />
        <p className="text-foreground">{message}</p>
      </div>
    </div>
  );
}
