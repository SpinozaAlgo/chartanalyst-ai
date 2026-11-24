import { useCallback, useEffect, useRef, useState } from 'react'
import AnalysisResults from './AnalysisResults.jsx'

const STEPS = [
  'جارٍ رفع الصورة ومعالجتها…',
  'التعرف على الشموع والمؤشرات الفنية…',
  'تحديد مستويات الدعم والمقاومة…',
  'حساب الزخم (RSI / MACD) وأحجام التداول…',
  'توليد التوصية النهائية…',
]

/** توليد نتيجة تحليل محاكية بناءً على رمز الأصل والإطار الزمني */
function mockAnalyze(symbol, timeframe) {
  let seed = symbol.length * 7 + timeframe.length * 13
  for (const ch of symbol) seed += ch.charCodeAt(0)
  const rand = (min, max) => {
    seed = (seed * 9301 + 49297) % 233280
    return min + (seed / 233280) * (max - min)
  }

  const basePrice = Math.round(rand(20, 260) * 100) / 100
  const bias = rand(-1, 1) // ميل صاعد/هابط
  const score = Math.round(45 + bias * 30 + rand(0, 20))
  const clampedScore = Math.max(12, Math.min(96, score))

  const trend = clampedScore >= 62 ? 'صاعد' : clampedScore <= 42 ? 'هابط' : 'عرضي'
  const verdict = clampedScore >= 62 ? 'شراء' : clampedScore <= 42 ? 'بيع' : 'حياد / انتظار'
  const rsi = Math.round(clampedScore >= 62 ? rand(55, 72) : clampedScore <= 42 ? rand(28, 45) : rand(45, 55))

  const supports = [Math.round(basePrice * rand(0.9, 0.95) * 100) / 100, Math.round(basePrice * rand(0.83, 0.89) * 100) / 100]
  const resistances = [Math.round(basePrice * rand(1.04, 1.09) * 100) / 100, Math.round(basePrice * rand(1.12, 1.2) * 100) / 100]
  const target = resistances[1]
  const stop = supports[1]

  // بيانات الرسم البياني
  const chartData = []
  const n = 24
  let p = basePrice * (bias > 0 ? 0.9 : 1.08)
  for (let i = 0; i < n; i++) {
    p += (basePrice - p) * 0.08 + rand(-1, 1) * basePrice * 0.015
    chartData.push({ t: `ن${i + 1}`, actual: Math.round(p * 100) / 100 })
  }
  const last = chartData[n - 1].actual
  for (let i = 1; i <= 8; i++) {
    const up = last + (target - last) * (i / 8) * (clampedScore >= 55 ? 1 : 0.3)
    const down = last - (last - stop) * (i / 8) * (clampedScore <= 50 ? 1 : 0.35)
    chartData.push({
      t: `+${i}`,
      forecast: Math.round(up * 100) / 100,
      bearish: Math.round(down * 100) / 100,
      actual: null,
    })
  }

  const patterns = ['نموذج الرأس والكتفين', 'مثلث صاعد', 'قاع مزدوج', 'نموذج الوهج (Flag)', 'قناة سعرية هابطة', 'اختراق نطاق عرضي']
  const pattern = patterns[Math.floor(rand(0, patterns.length))]

  const summary =
    `بناءً على تحليل شارت ${symbol} على إطار ${timeframe}، يرصد النموذج ${pattern}. ` +
    `الاتجاه العام ${trend} مع RSI عند ${rsi}${rsi > 70 ? ' (منطقة تشبع شرائي — احذر التصحيح)' : rsi < 30 ? ' (منطقة تشبع بيعي — فرصة ارتداد محتملة)' : ' ضمن النطاق المتوازن'}. ` +
    `${bias > 0 ? 'يوجد تقاطع إيجابي في الماكد مدعوماً بارتفاع أحجام التداول، مما يعزز سيناريو الصعود نحو الهدف.' : 'الماكد يميل للسلبية مع ضعف أحجام التداول عند الارتدادات، مما يرجّح اختبار الدعم التالي.'} ` +
    `الخطة المقترحة: مراقبة مستوى ${supports[0]} كدعم، واستهداف ${target} مع وقف خسارة أسفل ${stop}. ` +
    `⚠️ هذا التحليل لأغراض تعليمية ولا يُعد توصية استثمارية.`

  return {
    score: clampedScore, verdict, trend, rsi,
    macd: { positive: bias > 0 },
    volumeSignal: { strong: bias > 0, text: bias > 0 ? 'أحجام مرتفعة ↑' : 'أحجام ضعيفة ↓' },
    supports, resistances, target, stop, summary, chartData, pattern,
  }
}

export default function Analyzer() {
  const [image, setImage] = useState(null)
  const [fileName, setFileName] = useState('')
  const [symbol, setSymbol] = useState('BTC/USDT')
  const [timeframe, setTimeframe] = useState('4 ساعات')
  const [notes, setNotes] = useState('')
  const [drag, setDrag] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stepIdx, setStepIdx] = useState(0)
  const [result, setResult] = useState(null)
  const inputRef = useRef(null)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => { setImage(reader.result); setFileName(file.name); setResult(null) }
    reader.readAsDataURL(file)
  }, [])

  const analyze = () => {
    setLoading(true)
    setResult(null)
    setStepIdx(0)
    timers.current.forEach(clearTimeout)
    timers.current = STEPS.map((_, i) => setTimeout(() => setStepIdx(i), i * 550))
    timers.current.push(setTimeout(() => {
      setResult(mockAnalyze(symbol.trim() || 'CHART', timeframe))
      setLoading(false)
    }, STEPS.length * 550 + 400))
  }

  return (
    <div className="analyzer-card fade-in">
      {/* Right column: upload */}
      <div>
        <div
          className={`dropzone ${drag ? 'drag' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]) }}
        >
          <input
            ref={inputRef} type="file" accept="image/*" hidden
            onChange={(e) => handleFile(e.target.files[0])}
          />
          {image ? (
            <>
              <img src={image} alt="معاينة الشارت" className="preview" />
              <span style={{ fontSize: '0.8rem' }}>{fileName} — اضغط للاستبدال</span>
            </>
          ) : (
            <>
              <div className="icon">📊</div>
              <b>اسحب صورة الشارت هنا</b>
              <span style={{ fontSize: '0.85rem' }}>أو اضغط لاختيار ملف (PNG / JPG)</span>
            </>
          )}
        </div>

        <label className="field-label">أو جرّب مثالاً جاهزاً:</label>
        <div className="chips">
          {['مثال: شمعة ابتلاعية صاعدة', 'مثال: قمة مزدوجة'].map((ex) => (
            <button
              key={ex} className="chip"
              onClick={() => {
                setNotes(ex.replace('مثال: ', ''))
                if (!image) {
                  // معاينة SVG بسيطة كصورة جاهزة
                  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='360'><rect width='600' height='360' fill='%230b1220'/>${Array.from({ length: 20 }, (_, i) => { const x = 20 + i * 28; const h = 30 + ((i * 47) % 90); const y = 300 - h; const c = i % 3 === 0 ? '%23f87171' : '%2334d399'; return `<line x1='${x}' y1='${y - 14}' x2='${x}' y2='${y + h + 10}' stroke='${c}'/><rect x='${x - 8}' y='${y}' width='16' height='${h * 0.7}' fill='${c}' rx='2'/>` }).join('')}</svg>`
                  setImage(`data:image/svg+xml;utf8,${svg}`)
                  setFileName('example-chart.svg')
                }
              }}
            >{ex}</button>
          ))}
        </div>
      </div>

      {/* Left column: settings + action */}
      <div>
        <label className="field-label">الرمز / الأصل المالي</label>
        <input
          className="textarea" style={{ resize: 'none' }} value={symbol}
          onChange={(e) => setSymbol(e.target.value)} placeholder="مثال: BTC/USDT، EURUSD، أرامكو"
        />

        <label className="field-label">الإطار الزمني</label>
        <div className="chips">
          {['15 دقيقة', 'ساعة', '4 ساعات', 'يومي', 'أسبوعي'].map((tf) => (
            <button key={tf} className={`chip ${timeframe === tf ? 'active' : ''}`} onClick={() => setTimeframe(tf)}>{tf}</button>
          ))}
        </div>

        <label className="field-label">ملاحظات إضافية (اختياري)</label>
        <textarea
          className="textarea" rows="3" value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="مثال: السعر قريب من دعم تاريخي، هل أنتظر تأكيد الاختراق؟"
        />

        <div style={{ marginTop: 20 }}>
          <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={analyze} disabled={loading}>
            {loading ? (<><span className="spinner" /> جارٍ التحليل…</>) : ('⚡ حلّل الشارت الآن')}
          </button>
        </div>

        {loading && (
          <div style={{ marginTop: 18 }}>
            <div className="progress"><div className="bar" style={{ width: `${((stepIdx + 1) / STEPS.length) * 100}%` }} /></div>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: 10 }}>🔍 {STEPS[stepIdx]}</p>
          </div>
        )}

        {result && <AnalysisResults result={result} />}
      </div>
    </div>
  )
}
