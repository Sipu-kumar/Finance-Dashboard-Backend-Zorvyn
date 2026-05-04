import { useState, useEffect, useRef } from 'react';
import { fetchPerformanceData } from '../api/performance';
import AppLayout from '../components/AppLayout';
import './Performance.css';

/* ─── Helpers ──────────────────────────────────────────── */
function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const DONUT_COLORS = [
  '#00D4FF', // cyan
  '#7B2FBE', // purple
  '#2ECC71', // green
  '#FF6B6B', // coral
  '#F39C12', // amber
  '#E74C3C', // red
  '#3498DB', // blue
  '#1ABC9C', // teal
  '#9B59B6', // violet
  '#E67E22', // orange
];

/* ─── Balance Trend Line Chart (SVG) ───────────────────── */
function BalanceTrendChart({ data }) {
  if (!data || data.length === 0) return <div className="chart-empty">No data available</div>;

  const width = 560;
  const height = 280;
  const padL = 70, padR = 20, padT = 20, padB = 50;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const values = data.map(d => d.balance);
  const minVal = Math.min(0, ...values);
  const maxVal = Math.max(...values) || 1;
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => ({
    x: padL + (i / Math.max(data.length - 1, 1)) * chartW,
    y: padT + chartH - ((d.balance - minVal) / range) * chartH,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaD = `${pathD} L${points[points.length - 1].x},${padT + chartH} L${points[0].x},${padT + chartH} Z`;

  // Y-axis ticks
  const tickCount = 5;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => {
    const val = minVal + (range * i) / tickCount;
    return {
      val,
      y: padT + chartH - (i / tickCount) * chartH,
    };
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="balance-trend-svg" id="balance-trend-chart">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00B4D8" />
          <stop offset="100%" stopColor="#00D4FF" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={padL} y1={t.y} x2={width - padR} y2={t.y}
            stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <text x={padL - 10} y={t.y + 4} textAnchor="end"
            className="chart-axis-label">
            {formatCurrency(t.val)}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaD} fill="url(#lineGrad)" />

      {/* Line */}
      <path d={pathD} fill="none" stroke="url(#strokeGrad)"
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Data points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="5" fill="#0a0f1e" stroke="#00D4FF" strokeWidth="2.5" />
          {/* X-axis labels */}
          <text x={p.x} y={height - 10} textAnchor="middle" className="chart-axis-label">
            {data[i].month}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ─── Donut Chart (SVG) ────────────────────────────────── */
function DonutChart({ data }) {
  if (!data || data.length === 0) return <div className="chart-empty">No spending data</div>;

  const total = data.reduce((s, d) => s + d.total, 0);
  if (total === 0) return <div className="chart-empty">No spending data</div>;

  const size = 240;
  const cx = size / 2, cy = size / 2;
  const outerR = 100, innerR = 60;
  let cumAngle = -90; // start from top

  const slices = data.map((d, i) => {
    const angle = (d.total / total) * 360;
    const startAngle = cumAngle;
    cumAngle += angle;
    const endAngle = cumAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const largeArc = angle > 180 ? 1 : 0;

    const x1o = cx + outerR * Math.cos(startRad);
    const y1o = cy + outerR * Math.sin(startRad);
    const x2o = cx + outerR * Math.cos(endRad);
    const y2o = cy + outerR * Math.sin(endRad);

    const x1i = cx + innerR * Math.cos(endRad);
    const y1i = cy + innerR * Math.sin(endRad);
    const x2i = cx + innerR * Math.cos(startRad);
    const y2i = cy + innerR * Math.sin(startRad);

    const pathD = [
      `M${x1o},${y1o}`,
      `A${outerR},${outerR} 0 ${largeArc} 1 ${x2o},${y2o}`,
      `L${x1i},${y1i}`,
      `A${innerR},${innerR} 0 ${largeArc} 0 ${x2i},${y2i}`,
      'Z',
    ].join(' ');

    return { pathD, color: DONUT_COLORS[i % DONUT_COLORS.length], ...d };
  });

  return (
    <div className="donut-chart-wrapper" id="spending-donut-chart">
      <svg viewBox={`0 0 ${size} ${size}`} className="donut-svg">
        {slices.map((s, i) => (
          <path key={i} d={s.pathD} fill={s.color} className="donut-slice">
            <title>{s.category}: {formatCurrency(s.total)} ({((s.total / total) * 100).toFixed(1)}%)</title>
          </path>
        ))}
      </svg>
      <div className="donut-legend">
        {slices.map((s, i) => (
          <div key={i} className="donut-legend-item">
            <span className="donut-legend-color" style={{ background: s.color }} />
            <span className="donut-legend-label">{s.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Monthly Income vs Expense Bar Chart (SVG) ────────── */
function MonthlyComparisonChart({ data }) {
  if (!data || data.length === 0) return <div className="chart-empty">No data available</div>;

  const width = 560;
  const height = 280;
  const padL = 70, padR = 20, padT = 20, padB = 50;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const maxVal = Math.max(...data.flatMap(d => [d.income, d.expense]), 1);
  const barGroupWidth = chartW / data.length;
  const barWidth = barGroupWidth * 0.3;
  const gap = barGroupWidth * 0.1;

  const tickCount = 5;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => ({
    val: (maxVal * i) / tickCount,
    y: padT + chartH - (i / tickCount) * chartH,
  }));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="comparison-chart-svg" id="monthly-comparison-chart">
      {/* Grid */}
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={padL} y1={t.y} x2={width - padR} y2={t.y}
            stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <text x={padL - 10} y={t.y + 4} textAnchor="end" className="chart-axis-label">
            {formatCurrency(t.val)}
          </text>
        </g>
      ))}

      {data.map((d, i) => {
        const groupX = padL + i * barGroupWidth + barGroupWidth / 2;
        const incH = (d.income / maxVal) * chartH;
        const expH = (d.expense / maxVal) * chartH;

        return (
          <g key={i}>
            {/* Income bar */}
            <rect
              x={groupX - barWidth - gap / 2}
              y={padT + chartH - incH}
              width={barWidth}
              height={incH}
              rx="4"
              fill="#2ECC71"
              opacity="0.85"
              className="bar-rect"
            >
              <title>Income: {formatCurrency(d.income)}</title>
            </rect>
            {/* Expense bar */}
            <rect
              x={groupX + gap / 2}
              y={padT + chartH - expH}
              width={barWidth}
              height={expH}
              rx="4"
              fill="#FF6B6B"
              opacity="0.85"
              className="bar-rect"
            >
              <title>Expense: {formatCurrency(d.expense)}</title>
            </rect>
            {/* Month label */}
            <text x={groupX} y={height - 10} textAnchor="middle" className="chart-axis-label">
              {d.month}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Performance Page ─────────────────────────────────── */
export default function Performance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [months, setMonths] = useState(6);

  useEffect(() => {
    loadData();
  }, [months]);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const result = await fetchPerformanceData(months);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout title="Performance">
      {loading && (
        <div className="dashboard-loading">
          <div className="spinner-lg" />
          <span>Loading performance data...</span>
        </div>
      )}

      {error && <div className="dashboard-error">{error}</div>}

      {!loading && !error && data && (
        <>
          {/* ─── Top Charts Row ─── */}
          <div className="perf-charts-row">

            {/* Balance Trend */}
            <div className="perf-chart-card perf-chart-wide" id="balance-trend-panel">
              <div className="perf-chart-header">
                <h2 className="perf-chart-title">Balance Trend</h2>
                <div className="perf-period-btns">
                  <button
                    className={`perf-period-btn${months === 6 ? ' active' : ''}`}
                    onClick={() => setMonths(6)}
                    id="period-6m"
                  >6M</button>
                  <button
                    className={`perf-period-btn${months === 12 ? ' active' : ''}`}
                    onClick={() => setMonths(12)}
                    id="period-1y"
                  >1Y</button>
                  <button
                    className={`perf-period-btn${months === 60 ? ' active' : ''}`}
                    onClick={() => setMonths(60)}
                    id="period-all"
                  >All</button>
                </div>
              </div>
              <div className="perf-chart-body">
                <BalanceTrendChart data={data.balanceTrend} />
              </div>
            </div>

            {/* Spending by Category */}
            <div className="perf-chart-card" id="spending-category-panel">
              <div className="perf-chart-header">
                <h2 className="perf-chart-title">Spending by Category</h2>
              </div>
              <div className="perf-chart-body donut-container">
                <DonutChart data={data.spendingByCategory} />
              </div>
            </div>
          </div>

          {/* ─── Monthly Comparison ─── */}
          <div className="perf-charts-row">
            <div className="perf-chart-card perf-chart-full" id="monthly-comparison-panel">
              <div className="perf-chart-header">
                <h2 className="perf-chart-title">Income vs Expenses</h2>
                <div className="perf-legend-inline">
                  <span className="perf-legend-dot" style={{ background: '#2ECC71' }} /> Income
                  <span className="perf-legend-dot" style={{ background: '#FF6B6B', marginLeft: 16 }} /> Expenses
                </div>
              </div>
              <div className="perf-chart-body">
                <MonthlyComparisonChart data={data.monthlyComparison} />
              </div>
            </div>
          </div>

          {/* ─── Category Table ─── */}
          {data.spendingByCategory && data.spendingByCategory.length > 0 && (
            <div className="perf-chart-card perf-chart-full" id="category-table-panel">
              <div className="perf-chart-header">
                <h2 className="perf-chart-title">Category Breakdown</h2>
              </div>
              <table className="perf-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Category</th>
                    <th>Total Spent</th>
                    <th>Share</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const total = data.spendingByCategory.reduce((s, d) => s + d.total, 0);
                    return data.spendingByCategory.map((cat, i) => (
                      <tr key={cat.category}>
                        <td>
                          <span className="perf-rank" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }}>
                            {i + 1}
                          </span>
                        </td>
                        <td>{cat.category}</td>
                        <td className="perf-amount">{formatCurrency(cat.total)}</td>
                        <td>
                          <div className="perf-bar-wrapper">
                            <div className="perf-bar-fill"
                              style={{
                                width: `${total > 0 ? (cat.total / total) * 100 : 0}%`,
                                background: DONUT_COLORS[i % DONUT_COLORS.length],
                              }}
                            />
                            <span className="perf-bar-pct">
                              {total > 0 ? ((cat.total / total) * 100).toFixed(1) : 0}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </AppLayout>
  );
}
