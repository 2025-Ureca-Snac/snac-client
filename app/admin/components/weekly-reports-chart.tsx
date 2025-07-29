import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: '월', 신고: 12 },
  { name: '화', 신고: 19 },
  { name: '수', 신고: 3 },
  { name: '목', 신고: 5 },
  { name: '금', 신고: 2 },
  { name: '토', 신고: 3 },
  { name: '일', 신고: 9 },
];

export function WeeklyReportsChart() {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              backdropFilter: 'blur(5px)',
              border: '1px solid #D4D4D4',
              borderRadius: '0.5rem',
            }}
          />
          <Bar dataKey="신고" fill="#ED1B23" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
