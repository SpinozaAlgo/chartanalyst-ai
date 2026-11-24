import { useMemo } from 'react'
import {
  ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, ReferenceLine, Legend
} from 'recharts'

/**
 * لوحة نتائج التحليل: مؤشر الثقة (Gauge)، مستويات الدعم/المقاومة،
 * التوصية، ملخص فني مكتوب، ورسم بياني توضيحي مولّد من التحليل.
 */
export default function AnalysisResults({ result }) {
  const { score, verdict, trend, rsi, macd, volumeSignal, supports, resistances, target, stop, summary, chartData } = result

  const circumference = 2 * Math.PI * 62
  const dash = (score / 100) * circumference
  const gaugeColor = score >= 65 ? '#34d399' : score >= 45 ? '#fbbf24' : '#f87171'

  const verdictClass = verdict === 'شراء' ? 'buy' : verdict === 'بيع' ? 'sell' : 'hold'

  return (
    <div className="results fade-in">
      {/* Gauge + Verdict */}
      <div className="analysis-text">
        <h4>🎯 القرار المقترح</h4>
        <div className="gauge-wrap">
          <div className="gauge">
            <svg width="150" height="150" viewBox="0 0 150 150">
              <circle cx="75" cy="75" r="62" fill="none" stroke="rgba(148,163,184,0.12)" strokeWidth="12" />
              <circle
                cx="75" cy="75" r="62" fill="none" stroke={gaugeColor} strokeWidth="12"
                strokeLinecap="round" strokeDasharray={`${dash} ${circumference}`}
                style={{ transition: 'stroke-dasharray 0.8s ease' }}
              />
            </svg>
            <div className="center">
              <b style={{ color: gaugeColor }}>{score}%</b>
              <span>قوة الإشارة</span>
            </div>
          </div>
          <div className="verdict">
            <span className={`tag ${verdictClass}`}>{verdict}</span>
            <div className="levels">
              <div className="level support"><b>{supports[0]}</b>دعم رئيسي</div>
              <div className="level resistance"><b>{resistances[0]}</b>مقاومة رئيسية</div>
              <div className="level target"><b>{target}</b>الهدف</div>
              <div className="level stop"><b>{stop}</b>وقف الخسارة</div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="result-grid">
        <div className="metric">
          <div className="label">الاتجاه العام</div>
          <div className={`value ${trend === 'صاعد' ? 'up' : trend === 'هابط' ? 'down' : 'neutral'}`}>{trend}</div>
        </div>
        <div className="metric">
          <div className="label">مؤشر القوة النسبية RSI</div>
          <div className={`value ${rsi > 70 ? 'down' : rsi < 30 ? 'up' : 'neutral'}`}>{rsi}</div>
        </div>
        <div className="metric">
          <div className="label">المتوسط MACD</div>
          <div className={`value ${macd.positive ? 'up' : 'down'}`}>{macd.positive ? 'تقاطع إيجابي ↑' : 'تقاطع سلبي ↓'}</div>
        </div>
        <div className="metric">
          <div className="label">إشارة أحجام التداول</div>
          <div className={`value ${volumeSignal.strong ? 'up' : 'neutral'}`}>{volumeSignal.text}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="analysis-text">
        <h4>📈 المسار المتوقع (محاكاة بصرية)</h4>
        <div style={{ direction: 'ltr', height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="t" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} domain={['auto', 'auto']} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#0b1220', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 10, color: '#e2e8f0' }}
              />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Area type="monotone" dataKey="actual" name="السعر الحالي" stroke="#22d3ee" strokeWidth={2} fill="url(#priceGrad)" />
              <Line type="monotone" dataKey="forecast" name="التوقع الصاعد" stroke="#34d399" strokeWidth={2} strokeDasharray="6 4" dot={false} />
              <Line type="monotone" dataKey="bearish" name="سيناريو الهبوط" stroke="#f87171" strokeWidth={2} strokeDasharray="6 4" dot={false} />
              <ReferenceLine y={resistances[0]} stroke="#f87171" strokeDasharray="4 4" label={{ value: 'مقاومة', fill: '#f87171', fontSize: 11, position: 'insideTopRight' }} />
              <ReferenceLine y={supports[0]} stroke="#34d399" strokeDasharray="4 4" label={{ value: 'دعم', fill: '#34d399', fontSize: 11, position: 'insideBottomRight' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Written summary */}
      <div className="analysis-text">
        <h4>🧠 القراءة الفنية للذكاء الاصطناعي</h4>
        <p>{summary}</p>
      </div>
    </div>
  )
}
