import { useState } from 'react'
import Analyzer from './components/Analyzer.jsx'

const NAV = [
  { href: '#analyzer', label: 'المحلل' },
  { href: '#features', label: 'المميزات' },
  { href: '#how', label: 'كيف يعمل' },
  { href: '#pricing', label: 'الأسعار' },
  { href: '#faq', label: 'الأسئلة الشائعة' },
]

const FEATURES = [
  { icon: '🧠', title: 'قراءة فورية للشارت', desc: 'ارفع صورة أي رسم بياني وسيحدد الذكاء الاصطناعي الاتجاه، النماذج الفنية، والمؤشرات خلال ثوانٍ.' },
  { icon: '🎯', title: 'مستويات دعم ومقاومة', desc: 'استخراج تلقائي للدقة الحرجة مع اقتراح أهداف سعرية ووقف خسارة مناسب لإدارة المخاطر.' },
  { icon: '📉', title: 'تحليل المؤشرات الكلاسيكية', desc: 'قراءة RSI وMACD ومتوسطات الحركة وأحجام التداول في سياق موحّد بدل مؤشرات متفرقة.' },
  { icon: '🔔', title: 'تنبيهات ذكية', desc: 'راقب مستوياتك المفضلة واحصل على إشعار فور اقتراب السعر من نقطة دخول أو خروج.' },
  { icon: '🌍', title: 'جميع الأسواق', desc: 'أسهم، عملات رقمية، فوركس، سلع، ومؤشرات — تحليل واحد لأي سوق تتداول فيه.' },
  { icon: '📚', title: 'شرح تعليمي خطوة بخطوة', desc: 'كل توصية مدعومة بملخص يعلّمك لماذا اتخذ هذا القرار، لتطور مهارتك مع كل تحليل.' },
]

const STEPS = [
  { n: 1, title: 'ارفع الشارت', desc: 'صورة من TradingView أو أي منصة، أو الصق الرابط — لا حاجة لملفات معقدة.' },
  { n: 2, title: 'دع النموذج يقرأ', desc: 'يحلل الذكاء الاصطناعي البنية السعرية، الأنماط، الزخم، والأحجام في لحظة.' },
  { n: 3, title: 'احصل على خطتك', desc: 'توصية واضحة بمستويات دخول، أهداف، ووقف خسارة مع شرح كامل لكل عنصر.' },
]

const PLANS = [
  { name: 'المجاني', price: '0$', period: '/ للأبد', items: ['5 تحليلات شهرياً', 'قراءة أساسية للاتجاه', 'مستوى دعم ومقاومة واحد'], cta: 'ابدأ مجاناً', popular: false },
  { name: 'المحترف', price: '19$', period: '/ شهرياً', items: ['تحليلات غير محدودة', 'مستويات كاملة + أهداف ووقف خسارة', 'تحليل المؤشرات (RSI/MACD/Volume)', 'تنبيهات سعرية فورية', 'حفظ سجل التحليلات'], cta: 'اشترك الآن', popular: true },
  { name: 'الفرق', price: '49$', period: '/ شهرياً', items: ['كل مزايا المحترف', 'حتى 5 مقاعد للفريق', 'واجهة API للتكامل', 'تقارير أسبوعية مخصصة', 'دعم ذو أولوية 24/7'], cta: 'تواصل معنا', popular: false },
]

const QUOTES = [
  { name: 'سارة العتيبي', role: 'متداولة أسهم — تداول', text: 'أوفر ساعات من التحليل اليدوي. أرفع شارت أرامكو وأنسخ خطة الدخول مباشرة إلى منصتي.', initials: 'س' },
  { name: 'محمد ح.', role: 'متداول عملات رقمية', text: 'أفضل شيء هو الشرح التعليمي — صرت أفهم سبب كل مستوى بدل مجرد أرقام.', initials: 'م' },
  { name: 'خالد الدوسري', role: 'مدير محافظ استثمارية', text: 'التنبيهات الذكية غيّرت طريقة إدارتي للصفقات. أنصح به لكل محترف.', initials: 'خ' },
]

const FAQS = [
  { q: 'هل ChartAnalyst منصة تداول؟', a: 'لا، نحن أداة تحليل بالذكاء الاصطناعي تساعدك على قراءة الرسوم البيانية واتخاذ قراراتك بنفسك عبر المنصات المرخصة.' },
  { q: 'ما دقة التحليلات؟', a: 'تعتمد النتائج على جودة الشارت المرفوع وسياق السوق. نعرض نسبة ثقة لكل إشارة لتكون واضحاً دائماً، ولا يُعد أي مخرى توصية مالية ملزمة.' },
  { q: 'هل يدعم السوق السعودي؟', a: 'نعم، حلّل شارتات تداول (تاسي)، الفوركس، العملات الرقمية، والسلع — مع واجهة عربية بالكامل.' },
  { q: 'هل يمكنني إلغاء الاشتراك؟', a: 'بالتأكيد، إلغاء الاشتراك متاح في أي لحظة من إعدادات حسابك وتبقى فترة الاشتراك سارية حتى نهايتها.' },
]

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <div className="bg-glow" />

      {/* Navbar */}
      <nav className="navbar">
        <div className="container">
          <a href="#" className="logo">
            <img src="/logo.svg" alt="ChartAnalyst" />
            <span>Chart<span className="ai">Analyst</span></span>
          </a>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {NAV.map((l) => (
              <li key={l.href}><a href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a></li>
            ))}
          </ul>
          <div className="nav-actions">
            <a href="#analyzer" className="btn btn-primary" style={{ padding: '9px 20px' }}>جرّب مجاناً</a>
            <button className="burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="القائمة">{menuOpen ? '✕' : '☰'}</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero">
        <div className="container">
          <span className="badge"><span className="dot" /> مدعوم بالذكاء الاصطناعي التوليدي</span>
          <h1>
            حوّل أي شارت إلى <span className="grad">خطة تداول واضحة</span><br />خلال ثوانٍ
          </h1>
          <p className="sub">
            ارفع صورة رسمك البياني، ودع ChartAnalyst يقرأ الاتجاه، الأنماط، المؤشرات، ومستويات الدعم والمقاومة — مع توصية مكتوبة تفهمها فوراً.
          </p>
          <div className="hero-cta">
            <a href="#analyzer" className="btn btn-primary btn-lg">⚡ حلّل شارتك الآن</a>
            <a href="#how" className="btn btn-ghost btn-lg">شاهد كيف يعمل</a>
          </div>
          <div className="hero-stats">
            <div className="stat"><b>+120K</b><span>شارت تم تحليله</span></div>
            <div className="stat"><b>8 ثوانٍ</b><span>متوسط زمن التحليل</span></div>
            <div className="stat"><b>4.8/5</b><span>تقييم المتداولين</span></div>
          </div>
        </div>
      </header>

      {/* Analyzer */}
      <section id="analyzer">
        <div className="container">
          <div className="section-head">
            <span className="kicker">المحلل المباشر</span>
            <h2>جرّب التحليل الآن — بدون تسجيل</h2>
            <p>ارفع صورة الشارت أو استخدم مثالاً جاهزاً، واحصل على قراءة فنية كاملة فوراً.</p>
          </div>
          <Analyzer />
        </div>
      </section>

      {/* Features */}
      <section id="features">
        <div className="container">
          <div className="section-head">
            <span className="kicker">المميزات</span>
            <h2>كل ما تحتاجه لقراءة احترافية للشارت</h2>
            <p>أدوات مصممة للمبتدئ والمحترف: من التعرف على الأنماط إلى إدارة المخاطر.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div className="feature" key={f.title}>
                <div className="f-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ background: 'rgba(15,23,42,0.35)' }}>
        <div className="container">
          <div className="section-head">
            <span className="kicker">كيف يعمل</span>
            <h2>ثلاث خطوات فقط تفصلك عن قرارك التالي</h2>
          </div>
          <div className="steps">
            {STEPS.map((s) => (
              <div className="step" key={s.n}>
                <div className="num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials">
        <div className="container">
          <div className="section-head">
            <span className="kicker">آراء المتداولين</span>
            <h2>موثوق به من آلاف المتداولين العرب</h2>
          </div>
          <div className="quotes">
            {QUOTES.map((q) => (
              <div className="quote" key={q.name}>
                <div className="stars">★★★★★</div>
                <p>“{q.text}”</p>
                <div className="who">
                  <div className="avatar">{q.initials}</div>
                  <div><b>{q.name}</b><span>{q.role}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing">
        <div className="container">
          <div className="section-head">
            <span className="kicker">الأسعار</span>
            <h2>خطط تناسب رحلتك التداولية</h2>
            <p>ابدأ مجاناً وطوّر خطتك متى احتجت المزيد.</p>
          </div>
          <div className="plans">
            {PLANS.map((p) => (
              <div className={`plan ${p.popular ? 'popular' : ''}`} key={p.name}>
                {p.popular && <span className="pop-tag">الأكثر طلباً</span>}
                <h3>{p.name}</h3>
                <div className="price">{p.price}<small> {p.period}</small></div>
                <ul>{p.items.map((i) => <li key={i}>{i}</li>)}</ul>
                <a href="#analyzer" className={`btn ${p.popular ? 'btn-primary' : 'btn-ghost'}`}>{p.cta}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="container">
          <div className="section-head">
            <span className="kicker">الأسئلة الشائعة</span>
            <h2>عندك سؤال؟ لدينا إجابة</h2>
          </div>
          <div className="faq">
            {FAQS.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}</summary>
                <div className="answer">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section>
        <div className="container">
          <div className="cta-band">
            <h2>جاهز لترى شارتك بعين الذكاء الاصطناعي؟</h2>
            <p>انضم لآلاف المتداولين الذين يحللون رسومهم البيانية في ثوانٍ — مجاناً.</p>
            <a href="#analyzer" className="btn btn-primary btn-lg">ابدأ التحليل الآن 🚀</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div>
              <a href="#" className="logo" style={{ marginBottom: 12 }}>
                <img src="/logo.svg" alt="" />
                <span>Chart<span className="ai">Analyst</span></span>
              </a>
              <p style={{ fontSize: '0.9rem', maxWidth: 320 }}>منصة عربية لتحليل الرسوم البيانية بالذكاء الاصطناعي — قرارات أوضح، تداول أذكى.</p>
            </div>
            <div>
              <h4>المنتج</h4>
              <a href="#analyzer">المحلل</a>
              <a href="#features">المميزات</a>
              <a href="#pricing">الأسعار</a>
            </div>
            <div>
              <h4>الشركة</h4>
              <a href="#">من نحن</a>
              <a href="#">المدونة</a>
              <a href="#">تواصل معنا</a>
            </div>
            <div>
              <h4>قانوني</h4>
              <a href="#">سياسة الخصوصية</a>
              <a href="#">شروط الاستخدام</a>
              <a href="#">إخلاء المسؤولية</a>
            </div>
          </div>
          <div className="disclaimer">
            ⚠️ تنويه: محتوى ChartAnalyst لأغراض تعليمية وتحليلية فقط ولا يُعد نصيحة أو توصية استثمارية. التداول ينطوي على مخاطر عالية.
            <br />© {new Date().getFullYear()} ChartAnalyst — جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>
    </>
  )
}
