import React from 'react';
import { DesignStyle } from '../types';

interface StyleShowcaseProps {
  style: DesignStyle;
}

export const STYLE_DETAILS: Record<
  DesignStyle,
  {
    name: string;
    englishName: string;
    description: string;
    features: string[];
    bgClass: string;
  }
> = {
  glassmorphism: {
    name: 'شیشه‌ای (Glassmorphism)',
    englishName: 'Glassmorphism',
    description: 'ترکیبی مدرن از شفافیت، تاری پس‌زمینه (backdrop-blur) و مرزهای درخشان و شیشه‌ای روی پس‌زمینه‌های رنگارنگ زنده.',
    features: ['افکت شیشه شفاف و مات', 'سایه‌های نرم چندلایه', 'خطوط باریک نیمه شفاف برای لبه‌ها', 'بک‌گراند گرادیانی پویا'],
    bgClass: 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500',
  },
  neumorphism: {
    name: 'نوومورفیسم (Neumorphism)',
    englishName: 'Neumorphism',
    description: 'طراحی نرم و سه‌بعدی با استفاده هوشمندانه از سایه‌های دوبل (تیره و روشن) که انگار اجزای صفحه از دل پس‌زمینه بیرون زده‌اند.',
    features: ['برجستگی و فرورفتگی طبیعی', 'سایه‌های نرم دوگانه', 'ترکیب رنگ یکدست و آرامش‌بخش', 'دکمه‌های تعاملی فشاری'],
    bgClass: 'bg-zinc-100',
  },
  minimalist: {
    name: 'مینیمالیست (Minimalist)',
    englishName: 'Minimalist',
    description: 'طراحی بسیار ساده، تمرکز عمیق روی تایپوگرافی، فضای خالی سخاوتمندانه (White Space) و استفاده از خطوط باریک بدون شلوغی بصری.',
    features: ['تایپوگرافی درشت و خوانا', 'فضای خالی بسیار زیاد', 'پالت رنگی مونوکروم (تک‌رنگ)', 'سادگی مطلق در المان‌ها'],
    bgClass: 'bg-white',
  },
  luxury: {
    name: 'لوکس تاریک (Dark Luxury)',
    englishName: 'Dark Luxury',
    description: 'شکوه و تجمل با ترکیب طلایی تیره، سرمه‌ای یا مشکی زغال‌سنگی، فونت‌های سریف ظریف، خطوط طلایی بسیار ظریف و نورپردازی ملایم.',
    features: ['پالت رنگی مشکی و طلایی', 'تایپوگرافی کلاسیک و شیک', 'حاشیه‌های باریک طلایی جادویی', 'حس عمیق اشرافیت و کیفیت'],
    bgClass: 'bg-zinc-950',
  },
  brutalist: {
    name: 'بروتالیست (Brutalist/Neo-Brutalist)',
    englishName: 'Brutalist',
    description: 'سبکی سرکش و جذاب با مرزهای ضخیم مشکی، سایه‌های تخت بدون محو شدگی، رنگ‌های خالص و جیغ، و المان‌های نامتقارن.',
    features: ['مرزهای مشکی ضخیم (border-4)', 'سایه‌های تخت و تیز بدون بلور', 'رنگ‌های پاپ و نئونی تخت', 'طراحی پر انرژی و متفاوت'],
    bgClass: 'bg-amber-100',
  },
  bento: {
    name: 'باکس‌های بنتو (Bento Grid)',
    englishName: 'Bento Grid',
    description: 'الهام‌گرفته از جعبه‌های غذای ژاپنی؛ تقسیم‌بندی محتوا به کارت‌های مجزا با اندازه‌های متفاوت و زوایای گرد که ساختاری منظم و مدرن می‌سازند.',
    features: ['شبکه‌بندی منظم کارت‌ها', 'لبه‌های کاملاً گرد (rounded-3xl)', 'بخش‌های مجزا با انیمیشن ملایم', 'مناسب برای نمایش پورتفولیو و ویژگی‌ها'],
    bgClass: 'bg-slate-50',
  },
  gradient: {
    name: 'شفق قطبی (Aurora / Gradient)',
    englishName: 'Aurora Gradient',
    description: 'ترکیب رنگی سیال و مواج گرادیان‌های پرانرژی که جلوه‌ای پویا و چشم‌نواز مانند شفق‌های قطبی ایجاد می‌کنند.',
    features: ['تداخل رنگ‌های گرم و سرد', 'گرادیان‌های متحرک جذاب', 'برش‌های نوری روی متون', 'فضای شاداب و امروزی'],
    bgClass: 'bg-slate-900',
  },
  claymorphism: {
    name: 'سفالی (Claymorphism)',
    englishName: 'Claymorphism',
    description: 'شبیه‌سازی المان‌های سه‌بعدی خمیری یا سفالی با گوشه‌های فوق‌العاده گرد، سایه‌های داخلی ملایم و رنگ‌های پاستلی شاداب.',
    features: ['حجم‌های سه‌بعدی نرم و خمیری', 'سایه‌های داخلی دوگانه‌ی ملایم', 'گوشه‌های کاملاً بیضی', 'حس کارتونی و دلنشین'],
    bgClass: 'bg-indigo-50',
  },
  memphis: {
    name: 'طراحی ممفیس (Memphis Retro)',
    englishName: 'Memphis',
    description: 'سبک جذاب دهه‌ی ۸۰ میلادی با اشکال هندسی بی‌نظم (موج، ضربدر، دایره)، الگوهای نقطه‌چین و ترکیب رنگ‌های جسورانه.',
    features: ['الگوهای هندسی و نقطه‌چین', 'خطوط زیگزاگ و ضربدری', 'تضاد رنگی بالا و سرگرم‌کننده', 'حس نوستالژی پاپ'],
    bgClass: 'bg-rose-50',
  },
  cyberpunk: {
    name: 'سایبرپانک (Cyberpunk)',
    englishName: 'Cyberpunk',
    description: 'آینده‌نگری نئونی با تضاد شدید صورتی تند، آبی فیروزه‌ای و زرد روشن روی پس‌زمینه‌ی تاریک تیره، خطوط زاویه‌دار و استایل گلایف.',
    features: ['سایه‌های نئونی درخشان', 'زاویه‌های شکسته و تیز', 'طراحی های‌تک و گیمینگی', 'جلوه‌های سایبرنتیک پرانرژی'],
    bgClass: 'bg-zinc-950',
  },
};

export default function StyleShowcase({ style }: StyleShowcaseProps) {
  const details = STYLE_DETAILS[style];

  return (
    <div className="flex flex-col gap-4 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-900/50">
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse" />
        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
          پیش‌نمایش سبک: <span className="text-indigo-500">{details.name}</span>
        </h4>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        {details.description}
      </p>

      {/* Interactive visual sandbox showing the style in miniature */}
      <div className={`w-full h-44 rounded-xl relative overflow-hidden flex items-center justify-center p-4 transition-all duration-500 ${details.bgClass}`}>
        
        {style === 'glassmorphism' && (
          <>
            {/* Dynamic neon circles behind glass */}
            <div className="absolute w-20 h-20 bg-pink-400 rounded-full blur-xl top-4 left-6" />
            <div className="absolute w-24 h-24 bg-yellow-300 rounded-full blur-xl bottom-4 right-6" />
            <div className="absolute w-16 h-16 bg-blue-400 rounded-full blur-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            {/* Glass Card */}
            <div className="relative z-10 w-4/5 max-w-[240px] p-4 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-md shadow-xl text-center">
              <div className="w-8 h-8 rounded-full bg-white/20 mx-auto mb-2 flex items-center justify-center text-white text-xs font-bold">✨</div>
              <h5 className="font-bold text-white text-xs mb-1">کارت شیشه‌ای</h5>
              <p className="text-[10px] text-white/80">شفافیت شیک و ملایم بصری</p>
            </div>
          </>
        )}

        {style === 'neumorphism' && (
          <div className="flex flex-col items-center gap-3">
            {/* Neumorphic Raised Card */}
            <div 
              className="w-44 p-4 rounded-2xl text-center"
              style={{
                backgroundColor: '#f4f4f5',
                boxShadow: '8px 8px 16px #e4e4e7, -8px -8px 16px #ffffff'
              }}
            >
              <h5 className="font-bold text-zinc-700 text-xs mb-1">کارت نوومورفیک</h5>
              <button 
                className="px-3 py-1.5 rounded-xl text-[10px] font-bold text-zinc-600 active:shadow-inner"
                style={{
                  backgroundColor: '#f4f4f5',
                  boxShadow: 'inset 3px 3px 6px #e4e4e7, inset -3px -3px 6px #ffffff'
                }}
              >
                کلیک کنید
              </button>
            </div>
          </div>
        )}

        {style === 'minimalist' && (
          <div className="w-4/5 max-w-[240px] border border-zinc-200 p-4 text-center bg-white shadow-sm">
            <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-mono">EDITION 2026</span>
            <h5 className="font-serif font-medium text-zinc-900 text-sm my-1 leading-tight">سادگی والاترین زیبایی است.</h5>
            <div className="h-[1px] w-8 bg-zinc-900 mx-auto my-2" />
            <p className="text-[9px] text-zinc-500 font-sans">بدون افزونه‌های اضافی، خالص و متمرکز.</p>
          </div>
        )}

        {style === 'luxury' && (
          <div className="w-4/5 max-w-[240px] border border-[#d4af37]/30 p-5 rounded-lg text-center bg-zinc-950 shadow-2xl relative">
            {/* Fine border decoration */}
            <div className="absolute inset-1.5 border border-[#d4af37]/10 pointer-events-none" />
            <span className="text-[8px] tracking-widest text-[#d4af37] font-serif uppercase">L U X U R Y</span>
            <h5 className="font-serif font-bold text-white text-xs mt-1 mb-2">عمارت رویایی شما</h5>
            <p className="text-[9px] text-zinc-400 italic">طراحی بی‌نظیر با جزئیات طلایی مجلل</p>
            <div className="mt-3 px-4 py-1 border border-[#d4af37] text-[#d4af37] text-[9px] rounded hover:bg-[#d4af37] hover:text-black inline-block transition-all">
              ورود به دنیای خاص
            </div>
          </div>
        )}

        {style === 'brutalist' && (
          <div className="w-4/5 max-w-[240px] border-4 border-black p-4 text-right bg-lime-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg]">
            <h5 className="font-mono font-black text-black text-sm mb-1 uppercase tracking-tight">طراحی بروتال!</h5>
            <p className="text-[10px] text-black font-mono font-bold leading-normal">ضخیم، صریح، بی‌باک و فوق‌العاده چشم‌گیر.</p>
            <button className="mt-3 px-3 py-1 bg-fuchsia-400 border-2 border-black font-mono font-black text-[10px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
              اکشن فوری
            </button>
          </div>
        )}

        {style === 'bento' && (
          <div className="w-full h-full grid grid-cols-3 gap-2 p-1">
            <div className="col-span-2 bg-white rounded-xl p-2 shadow-sm flex flex-col justify-between">
              <span className="text-[9px] font-bold text-slate-800">بخش بزرگ</span>
              <p className="text-[8px] text-slate-400">شبکه‌بندی هوشمند بنتو</p>
            </div>
            <div className="bg-white rounded-xl p-2 shadow-sm flex flex-col justify-between items-center text-center">
              <span className="text-xs">⚡</span>
              <span className="text-[8px] font-bold text-slate-500">سریع</span>
            </div>
            <div className="bg-white rounded-xl p-2 shadow-sm flex items-center justify-center col-span-3">
              <p className="text-[9px] text-slate-600 font-bold">باکس‌های فوق‌العاده تمیز</p>
            </div>
          </div>
        )}

        {style === 'gradient' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center text-center overflow-hidden">
            {/* Rotating colorful mesh gradients */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 opacity-60 animate-pulse" />
            <div className="relative z-10 p-4">
              <h5 className="font-extrabold text-white text-base tracking-tight mb-1 bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                شفق قطبی زنده
              </h5>
              <p className="text-[10px] text-cyan-100">گرادیان‌های امروزی پر جنب و جوش</p>
            </div>
          </div>
        )}

        {style === 'claymorphism' && (
          <div 
            className="w-44 p-4 rounded-3xl text-center bg-sky-300 text-sky-950 font-bold"
            style={{
              boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.08), inset -8px -8px 12px rgba(0,0,0,0.15), inset 8px 8px 12px rgba(255,255,255,0.4)'
            }}
          >
            <div className="w-8 h-8 rounded-full bg-white mx-auto mb-2 flex items-center justify-center text-sky-500"
              style={{
                boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.1), inset 2px 2px 4px rgba(255,255,255,0.5)'
              }}
            >
              ☁️
            </div>
            <h5 className="text-xs font-extrabold">کارت سفالی سه‌بعدی</h5>
            <p className="text-[8px] opacity-80 mt-1">طراحی خمیری و فانتزی نرم</p>
          </div>
        )}

        {style === 'memphis' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Random Memphis floating vectors */}
            <div className="absolute w-4 h-4 border-2 border-black rounded-full top-2 left-4 bg-yellow-300" />
            <div className="absolute w-6 h-1 bg-black rotate-45 top-6 right-6" />
            <div className="absolute w-6 h-1 bg-black -rotate-45 top-6 right-6" />
            <div className="absolute bottom-2 left-6 font-bold text-xs text-black font-mono">▲▼▲▼</div>
            
            <div className="relative z-10 w-40 p-3 bg-white border-2 border-black rounded-none shadow-[4px_4px_0px_rgba(0,0,0,1)] text-center">
              <h5 className="font-black text-black text-xs uppercase">پاپ آرت رترو</h5>
              <div className="h-1 bg-yellow-400 border-t-2 border-black my-1.5" />
              <p className="text-[9px] text-zinc-600 font-mono font-black">طراحی شاد دهه‌ی هشتاد</p>
            </div>
          </div>
        )}

        {style === 'cyberpunk' && (
          <div className="w-4/5 max-w-[240px] border-2 border-fuchsia-500 p-4 bg-black relative shadow-[0_0_15px_rgba(240,70,180,0.5)]">
            <div className="absolute top-0 right-4 transform -translate-y-1/2 bg-yellow-400 text-black font-mono font-black text-[7px] px-1.5">
              SYS_ACTIVE
            </div>
            <h5 className="font-mono font-extrabold text-cyan-400 text-xs mb-1 uppercase tracking-widest">
              پروتکل نئون ۲۰۷۷
            </h5>
            <p className="text-[9px] text-zinc-400 font-mono">طراحی تاریک سایبری با روشنایی خیره‌کننده</p>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-[8px] text-yellow-400 font-mono">STATUS: 100%</span>
              <button className="px-2 py-0.5 bg-fuchsia-600 font-mono font-bold text-[8px] text-white rounded hover:bg-cyan-500 transition-colors">
                اتصال نئون
              </button>
            </div>
          </div>
        )}

      </div>

      <div className="flex flex-wrap gap-2 mt-1">
        {details.features.map((feature, idx) => (
          <span
            key={idx}
            className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200/50 dark:border-slate-700/50"
          >
            ✓ {feature}
          </span>
        ))}
      </div>
    </div>
  );
}
