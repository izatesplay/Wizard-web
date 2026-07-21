import React, { useState, useEffect } from 'react';
import { WebsiteData, ProductCategory } from './types';
import Step1Basic from './components/Step1Basic';
import Step2Products from './components/Step2Products';
import Step3Contact from './components/Step3Contact';
import Step4Visual from './components/Step4Visual';
import Step5AI from './components/Step5AI';
import WebsitePreview from './components/WebsitePreview';
import { Sparkles, ChevronLeft, ChevronRight, AlertCircle, RefreshCw, Cpu, Layers, HelpCircle, CheckCircle } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'ai_website_builder_config_v1';

// Dynamic rotation of cute loading state logs
const LOADING_MESSAGES = [
  'در حال اعتبارسنجی اطلاعات ورودی شما...',
  'در حال فرموله‌سازی پرامپت هوشمند فرانت‌اند...',
  'در حال اتصال امن به سرور هوش مصنوعی...',
  'در حال مهندسی ساختار صفحات و هدر واکنش‌گرا...',
  'در حال استایل‌دهی و اعمال پالت رنگی انتخابی...',
  'در حال کدنویسی منطق خرید و سبد کالا...',
  'در حال پیاده‌سازی افکت‌های انیمیشنی هاور...',
  'در حال بهینه‌سازی ریسپانسیو برای تبلت و موبایل...',
  'در حال گردآوری نهایی و بررسی ساختار HTML...',
];

const INITIAL_STATE: WebsiteData = {
  name: 'مبل دلاوران',
  type: 'ecommerce',
  style: 'glassmorphism',
  categories: [
    {
      id: '1',
      name: 'مبلمان راحتی',
      products: [
        {
          id: 'p1',
          name: 'کاناپه سه نفره آیرون',
          description: 'طراحی مدرن با پایه‌های چوب راش روسی و پارچه مخمل ضد لک نانو',
          price: '۲۴,۸۰۰,۰۰۰ تومان',
          image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
        },
        {
          id: 'p2',
          name: 'مبل تک‌نفره کلاسیک',
          description: 'فوم سرد درجه یک با راحتی استثنایی و گارانتی ۳ ساله',
          price: '۹,۲۰۰,۰۰۰ تومان',
          image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=80',
        }
      ]
    }
  ],
  address: 'تهران، بازار مبل دلاوران، نبش خیابان پنجم، پلاک ۲۴۰',
  phone: '۰۲۱-۷۷۸۸۹۹۰۰',
  email: 'info@delavaran-furniture.com',
  socialGithub: '',
  socialInstagram: 'delavaran_mobl',
  socialTelegram: 'delavaran_mobl',
  welcomeMessage: 'به گالری مبلمان دلاوران خوش آمدید. طراحی ماندگار مبل‌های راحتی و سلطنتی مدرن با هنر دست استادکاران برتر ایرانی برای دکوراسیون خاص خانه‌ شما.',
  logoUrl: '',
  seoKeywords: 'مبل دلاوران, خرید مبل, مبل راحتی, مبلمان کلاسیک, گالری مبل تهران',
  visual: {
    paletteName: 'شفق قطبی زنده (Aurora Teal)',
    primaryColor: '#0d9488',
    secondaryColor: '#8b5cf6',
    backgroundColor: '#0f172a',
    textColor: '#f8fafc',
    fontFamily: 'Vazirmatn',
  },
  aiProvider: 'gemini_builtin',
  apiKey: 'sk-nry-zwdEBHtqpSZnvBM-JB_2BJlU16dy9U4tM9h9gwagbec',
  customEndpoint: 'https://api.openai.com/v1',
  customModel: 'gpt-4o',
};

export default function App() {
  const [data, setData] = useState<WebsiteData>(INITIAL_STATE);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure structure compatibility
        setData({ ...INITIAL_STATE, ...parsed });
      }
    } catch (e) {
      console.error('Error loading config from localStorage', e);
    }
  }, []);

  // Save to local storage
  const updateData = (update: Partial<WebsiteData>) => {
    setData((prev) => {
      const next = { ...prev, ...update };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  // Rotate loading messages
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [loading]);

  // Validations per step
  const validateStep = (step: number): boolean => {
    setValidationError('');
    if (step === 1) {
      if (!data.name.trim()) {
        setValidationError('لطفاً نام وب‌سایت خود را وارد کنید');
        return false;
      }
    } else if (step === 3) {
      if (!data.welcomeMessage.trim()) {
        setValidationError('لطفاً پیام خوش‌آمدگویی یا شعار اصلی سایت را وارد کنید');
        return false;
      }
      if (!data.phone.trim()) {
        setValidationError('لطفاً شماره تلفن تماس را وارد کنید');
        return false;
      }
      if (!data.email.trim() || !data.email.includes('@')) {
        setValidationError('لطفاً یک آدرس ایمیل معتبر وارد کنید');
        return false;
      }
      if (!data.address.trim()) {
        setValidationError('لطفاً آدرس فیزیکی یا محل کار را وارد کنید');
        return false;
      }
    } else if (step === 5) {
      const needsKey = data.aiProvider !== 'gemini_builtin';
      if (needsKey && !data.apiKey.trim()) {
        setValidationError('لطفاً کلید اختصاصی API برای سرویس هوش مصنوعی انتخاب‌شده را وارد کنید');
        return false;
      }
      if (data.aiProvider === 'custom_openai') {
        if (!data.customEndpoint?.trim()) {
          setValidationError('لطفاً آدرس Endpoint معتبر را وارد کنید');
          return false;
        }
        if (!data.customModel?.trim()) {
          setValidationError('لطفاً نام مدل هوش مصنوعی مورد نظر را وارد کنید');
          return false;
        }
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setValidationError('');
    setCurrentStep((prev) => prev - 1);
  };

  const handleReset = () => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید تمام اطلاعات فرم را به حالت اولیه برگردانید؟')) {
      setData(INITIAL_STATE);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setCurrentStep(1);
      setGeneratedHtml('');
      setValidationError('');
    }
  };

  const handleBuild = async () => {
    if (!validateStep(5)) return;

    setLoading(true);
    setLoadingMsgIdx(0);
    setValidationError('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'خطا در ارتباط با سرور هوش مصنوعی');
      }

      if (resData.html) {
        setGeneratedHtml(resData.html);
        setCurrentStep(6); // Step 6 represents the full interactive preview screen!
      } else {
        throw new Error('کد دریافتی نامعتبر است');
      }
    } catch (err: any) {
      setValidationError(err.message || 'خطای غیرمنتظره در ساخت سایت. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-slate-100 font-sans flex flex-col" dir="rtl" id="app-root-element">
      
      {/* Top Header */}
      <header className="border-b border-slate-200/60 dark:border-slate-900 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-indigo-500/20">
              ⚡
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 dark:text-white">پلتفرم وب‌ساز هوشمند AI</h1>
              <p className="text-[10px] text-slate-500">طراحی گام‌به‌گام و کدنویسی خودکار سایت واکنش‌گرا</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400 rounded-xl text-[10px] font-bold transition-all"
            >
              بازنشانی فرم 🔄
            </button>
            <div className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-bold border border-indigo-100/30">
              مجموعه کامل ابزارها 🛠️
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 flex flex-col justify-center">
        
        {loading ? (
          /* Custom immersive Loading Screen with spinner and revolving logs */
          <div className="flex-1 flex flex-col items-center justify-center text-center py-24 px-4 bg-white/50 dark:bg-slate-950/40 rounded-3xl border border-slate-100 dark:border-slate-900/60 shadow-inner max-w-lg mx-auto w-full">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-100 dark:border-indigo-950 border-t-indigo-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-indigo-500 text-lg animate-pulse">
                🚀
              </div>
            </div>
            
            <h3 className="text-md font-extrabold text-slate-900 dark:text-white mb-2">در حال ساخت وب‌سایت بی‌نظیر شما...</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-6">این فرایند به دلیل تولید همزمان تمام کدهای استایل، کدهای ریسپانسیو و جاوااسکریپت ممکن است تا ۱ دقیقه طول بکشد.</p>
            
            {/* Dynamic log viewer */}
            <div className="w-full bg-slate-100 dark:bg-slate-950/80 border border-slate-200/50 dark:border-slate-800/50 p-4 rounded-2xl min-h-[72px] flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 animate-pulse font-mono">
              ⚡ {LOADING_MESSAGES[loadingMsgIdx]}
            </div>
          </div>
        ) : currentStep === 6 ? (
          /* Finished generated website screen view */
          <WebsitePreview
            code={generatedHtml}
            siteName={data.name}
            onBack={() => setCurrentStep(5)}
            data={data}
          />
        ) : (
          /* Main Multi-Step Form Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Steps Navigation Sidebar */}
            <div className="lg:col-span-3 flex flex-col gap-4 bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-sm">
              <div className="pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-2">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">مراحل طراحی</span>
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 mt-1">پیشرفت فرآیند</h3>
              </div>

              {/* Progress bar line */}
              <div className="flex flex-col gap-3">
                {[
                  { step: 1, label: 'اطلاعات پایه', desc: 'نام، موضوع و زبان بصری' },
                  { step: 2, label: 'محصولات و کاتالوگ', desc: 'لیست اقلام فروشگاه' },
                  { step: 3, label: 'اطلاعات تماس', desc: 'راه‌های ارتباطی و شعار' },
                  { step: 4, label: 'هویت بصری', desc: 'پالت رنگی و فونت' },
                  { step: 5, label: 'تنظیم هوش مصنوعی', desc: 'انتخاب موتور پردازش' },
                ].map((item) => {
                  const isActive = currentStep === item.step;
                  const isCompleted = currentStep > item.step;
                  return (
                    <button
                      key={item.step}
                      type="button"
                      onClick={() => {
                        if (validateStep(currentStep) || item.step < currentStep) {
                          setCurrentStep(item.step);
                        }
                      }}
                      className={`flex gap-3 text-right p-2.5 rounded-xl transition-all w-full items-start ${
                        isActive
                          ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                          : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        isActive
                          ? 'bg-indigo-500 text-white'
                          : isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {isCompleted ? '✓' : item.step}
                      </span>
                      <div className="flex flex-col gap-0.5 overflow-hidden text-ellipsis">
                        <span className="text-xs text-slate-800 dark:text-slate-200 truncate">{item.label}</span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 truncate">{item.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* General support card info */}
              <div className="mt-4 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100/20 text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                <span className="font-bold text-indigo-500 flex items-center gap-1 mb-1">
                  <span>💡</span> ذخیره خودکار فعال است
                </span>
                تغییرات شما فوراً در مرورگر ذخیره می‌شود تا در صورت رفرش شدن، زحماتتان هدر نرود.
              </div>
            </div>

            {/* Step Body Content area */}
            <div className="lg:col-span-9 bg-white dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col gap-6">
              
              {/* Error messages if validation fails */}
              {validationError && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2.5">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Dynamic steps mounting */}
              {currentStep === 1 && <Step1Basic data={data} onChange={updateData} />}
              {currentStep === 2 && <Step2Products data={data} onChange={updateData} />}
              {currentStep === 3 && <Step3Contact data={data} onChange={updateData} />}
              {currentStep === 4 && <Step4Visual data={data} onChange={updateData} />}
              {currentStep === 5 && <Step5AI data={data} onChange={updateData} />}

              {/* Navigation Action Buttons footer */}
              <div className="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-4">
                
                {/* Back button */}
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    currentStep === 1
                      ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                      : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <ChevronRight size={16} />
                  مرحله قبلی
                </button>

                {/* Progress bar visual indicator */}
                <span className="text-[10px] text-slate-400 font-bold font-mono">
                  مرحله {currentStep} از ۵
                </span>

                {/* Next or Generate action button */}
                {currentStep === 5 ? (
                  <button
                    type="button"
                    onClick={handleBuild}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-indigo-500/20 animate-pulse"
                  >
                    <Sparkles size={16} />
                    ساخت وب‌سایت من ✨
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/10 transition-all"
                  >
                    مرحله بعدی
                    <ChevronLeft size={16} />
                  </button>
                )}

              </div>
            </div>

          </div>
        )}

      </main>

      {/* Main Footer */}
      <footer className="border-t border-slate-200/60 dark:border-slate-900 py-6 text-center text-slate-400 dark:text-slate-500 mt-12 bg-white/20 dark:bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px]">
          <p>© ۲۰۲۶ وب‌ساز هوشمند AI - تمام حقوق مادی و معنوی محفوظ است.</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">🔒 تراکنش امن کلیدهای API</span>
            <span className="flex items-center gap-1">🎨 پشتیبانی کامل از RTL</span>
            <span className="flex items-center gap-1">📱 کاملاً واکنش‌گرا</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
