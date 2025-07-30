import {
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  Legend,
  ResponsiveContainer as PieResponsiveContainer,
} from 'recharts';

const PIE_DATA = [
  { name: '스팸/광고', value: 45 },
  { name: '욕설/비방', value: 25 },
  { name: '부적절한 컨텐츠', value: 20 },
  { name: '기타', value: 10 },
];

const COLORS = ['#5C4531', '#98FF58', '#FF66C4', '#D09436'];

export function ReportTypesChart() {
  return (
    <div className="w-full h-80">
      <PieResponsiveContainer>
        <PieChart>
          <Pie
            data={PIE_DATA}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="purple"
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
          >
            {PIE_DATA.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <PieTooltip
            contentStyle={{
              backgroundColor: '#fff',
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
