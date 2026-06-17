import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import Card from '../ui/Card';

const COLORS = ['#34D399', '#8B93A7'];

const tooltipStyle = {
  backgroundColor: '#131A2C',
  border: '1px solid #1B2438',
  borderRadius: 8,
  color: '#F3EFE6',
  fontSize: 12,
};

export default function StatsCharts({ stats }) {
  const { t } = useTranslation('admin');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <Card className="lg:col-span-2">
        <h3 className="text-cream font-medium mb-4">{t('completion_trend')}</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={stats.completionTrend}>
            <XAxis dataKey="date" tick={{ fill: '#8B93A7', fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
            <YAxis tick={{ fill: '#8B93A7', fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="count" stroke="#C9A227" strokeWidth={2} dot={{ fill: '#C9A227', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h3 className="text-cream font-medium mb-4">{t('status_breakdown')}</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={stats.statusBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
              {stats.statusBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Legend wrapperStyle={{ fontSize: 12, color: '#8B93A7' }} />
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card className="lg:col-span-3">
        <h3 className="text-cream font-medium mb-4">{t('active_users_trend')}</h3>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={stats.activeUsersTrend}>
            <XAxis dataKey="date" tick={{ fill: '#8B93A7', fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
            <YAxis tick={{ fill: '#8B93A7', fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="count" stroke="#34D399" strokeWidth={2} dot={{ fill: '#34D399', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
