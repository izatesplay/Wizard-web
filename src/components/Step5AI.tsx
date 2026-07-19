import React from 'react';
import { WebsiteData, AIProvider } from '../types';
import { Cpu, Shield, Key, Sparkles, HelpCircle } from 'lucide-react';

interface Step5AIProps {
  data: WebsiteData;
  onChange: (update: Partial<WebsiteData>) => void;
}

interface ProviderOption {
  id: AIProvider;
  name: string;
  badge: string;
  badgeColor: string;
  description: string;
  icon: string;
  requiresKey: boolean;
  placeholder: string;
}

const PROVIDERS: ProviderOption[] = [
  {
    id: 'gemini_builtin',
    name: 'هوش مصنوعی سرور (پیش‌فرض رایگان)',
    badge: 'توصیه شده و سریع',
    badgeColor: 'bg-emerald-500 text-white',
    description: 'استفاده مستقیم از مدل فوق‌العاده سریع و هوشمند Google Gemini 3.5 Flash بدون نیاز به وارد کردن کلید خصوصی (رایگان برای شما).',
    icon: '✨',
    requiresKey: false,
    placeholder: '',
  },
  {
    id: 'gemini_custom',
    name: 'کلید اختصاصی Google Gemini',
    badge: 'شخصی',
    badgeColor: 'bg-blue-500 text-white',
    description: 'اتصال به پنل رسمی Google AI Studio با استفاده از API Key اختصاصی خودتان.',
    icon: '🔵',
    requiresKey: true,
    placeholder: 'AIzaSy...',
  },
  {
    id: 'openai',
    name: 'کلید اختصاصی OpenAI GPT-4o',
    badge: 'بسیار باهوش',
    badgeColor: 'bg-purple-500 text-white',
    description: 'تولید کدهای خلاقانه و پیشرفته با اتصال به موتورهای هوش مصنوعی OpenAI.',
    icon: '🟢',
    requiresKey: true,
    placeholder: 'sk-proj-...',
  },
  {
    id: 'anthropic',
    name: 'کلید اختصاصی Anthropic Claude 3.5',
    badge: 'بهترین برای برنامه‌نویسی',
    badgeColor: 'bg-amber-500 text-white',
    description: 'استفاده از مدل بی‌نظیر Claude 3.5 Sonnet برای دریافت باکیفیت‌ترین و تمیزترین کدهای فرانت‌اند.',
    icon: '🟠',
    requiresKey: true,
    placeholder: 'sk-ant-api03-...',
  },
  {
    id: 'custom_openai',
    name: 'سرویس هوش مصنوعی سفارشی (کاستوم / سازگار با OpenAI)',
    badge: 'سازگار با همه مدل‌ها',
    badgeColor: 'bg-rose-500 text-white',
    description: 'اتصال مستقیم به هر نوع سرویس هوش مصنوعی سازگار با ساختار استاندارد OpenAI (مانند DeepSeek، OpenRouter، Groq، یا سرور محلی).',
    icon: '⚙️',
    requiresKey: true,
    placeholder: 'sk-...',
  },
];

export default function Step5AI({ data, onChange }: Step5AIProps) {
  const selectedOption = PROVIDERS.find((p) => p.id === data.aiProvider) || PROVIDERS[0];

  return (
    <div className="flex flex-col gap-6" id="step-5-container">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">مرحله ۵: موتور هوش مصنوعی و کلید دسترسی</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">مشخص کنید پلتفرم برای تحلیل اطلاعات و کدنویسی سایت شما از کدام سرویس هوش مصنوعی استفاده کند.</p>
      </div>

      <div className="flex flex-col gap-4">
        {PROVIDERS.map((provider) => {
          const isSelected = data.aiProvider === provider.id;
          return (
            <button
              key={provider.id}
              type="button"
              onClick={() => {
                onChange({
                  aiProvider: provider.id,
                  // Don't clear custom key so they don't lose it if they toggle around
                });
              }}
              className={`p-4 rounded-2xl border text-right transition-all flex flex-col md:flex-row gap-4 items-start md:items-center bg-white dark:bg-slate-950/40 hover:shadow-md w-full ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl shrink-0">
                {provider.icon}
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">{provider.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${provider.badgeColor}`}>
                    {provider.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {provider.description}
                </p>
              </div>

              {/* Selector bullet */}
              <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700">
                {isSelected && (
                  <div className="w-3.5 h-3.5 bg-indigo-500 rounded-full" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* API Key input panel */}
      {selectedOption.requiresKey && (
        <div className="p-4 border border-indigo-100 dark:border-indigo-950/30 rounded-2xl bg-indigo-50/20 dark:bg-indigo-950/5 flex flex-col gap-3 animate-fade-in">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5" htmlFor="api-key-input">
              <Key size={15} className="text-indigo-500" />
              کلید اختصاصی API {selectedOption.name} <span className="text-red-500">*</span>
            </label>
            <span className="text-[9px] text-slate-400 flex items-center gap-0.5">
              <Shield size={10} /> اطلاعات کلید شما سمت سرور ما ذخیره نخواهد شد
            </span>
          </div>

          <input
            id="api-key-input"
            type="password"
            value={data.apiKey}
            onChange={(e) => onChange({ apiKey: e.target.value })}
            placeholder={selectedOption.placeholder}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 text-left"
            dir="ltr"
          />

          {selectedOption.id === 'custom_openai' && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 text-right">
                    آدرس Endpoint (پایه URL) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.customEndpoint || ''}
                    onChange={(e) => onChange({ customEndpoint: e.target.value })}
                    placeholder="https://api.openai.com/v1"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 text-left"
                    dir="ltr"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 text-right">
                    نام مدل مورد نظر (Model ID) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={data.customModel || ''}
                    onChange={(e) => onChange({ customModel: e.target.value })}
                    placeholder="gpt-4o"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Quick preset helpers */}
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 self-center">انتخاب سریع آدرس:</span>
                <button
                  type="button"
                  onClick={() => onChange({ customEndpoint: 'https://api.nary.ir/v1' })}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-[10px] font-mono rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Nary Proxy (api.nary.ir)
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ customEndpoint: 'https://api.openai.com/v1' })}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-[10px] font-mono rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
                >
                  OpenAI Original
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 self-center">انتخاب سریع مدل (پیشنهادی برای سرعت بالا):</span>
                <button
                  type="button"
                  onClick={() => onChange({ customModel: 'gpt-4o-mini' })}
                  className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 text-[10px] font-mono rounded-lg text-emerald-700 dark:text-emerald-400 transition-colors border border-emerald-100/50 dark:border-emerald-900/30"
                >
                  gpt-4o-mini (بسیار سریع ⚡)
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ customModel: 'gemini-1.5-flash' })}
                  className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 text-[10px] font-mono rounded-lg text-emerald-700 dark:text-emerald-400 transition-colors border border-emerald-100/50 dark:border-emerald-900/30"
                >
                  gemini-1.5-flash (اقتصادی ⚡)
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ customModel: 'gpt-4o' })}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-[10px] font-mono rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
                >
                  gpt-4o (سنگین)
                </button>
              </div>

              {/* Dynamic Warning Alert */}
              <div className="p-3 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/30 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed space-y-1">
                <p className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <span>💡</span> راهنمای سرعت و پیشگیری از اتمام زمان پاسخ (Timeout 524):
                </p>
                <p>
                  فرآیند طراحی و کدنویسی همزمان یک سایت کامل، سنگین و نیازمند خروجی طولانی است. مدل‌هایی مانند <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-[10px]">gpt-4o</code> گاهی زمان پاسخ‌دهی‌شان بالای ۱۰۰ ثانیه طول می‌کشد که موجب بر خوردن به سد فایروال پروکسی‌ها (خطای ۵۲۴) می‌گردد.
                </p>
                <p className="font-medium">
                  اکیداً پیشنهاد می‌کنیم مدل مورد نظر را روی مدل‌های فوق‌سریع و ارزان مانند <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-emerald-600 dark:text-emerald-400 text-[10px]">gpt-4o-mini</code> یا <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-emerald-600 dark:text-emerald-400 text-[10px]">gemini-1.5-flash</code> بگذارید تا سایت عالی شما در کمتر از ۱۵ ثانیه آماده شود.
                </p>
                {data.apiKey?.startsWith('sk-nry-') && (
                  <p className="text-amber-600 dark:text-amber-500 font-bold mt-1.5 flex items-center gap-1">
                    <span>⚠️</span> کلید اختصاصی وارد شده مربوط به پروکسی Nary است. حتماً مطمئن شوید فیلد آدرس روی آدرس پروکسی یعنی <code className="font-mono text-slate-800 dark:text-slate-200 text-[10px]">https://api.nary.ir/v1</code> باشد (نه OpenAI).
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1 leading-relaxed">
            <HelpCircle size={12} className="shrink-0" />
            <span>
              برای دریافت کلید می‌توانید به کنسول رسمی ارائه‌دهنده مراجعه کنید. اگر ترجیح می‌دهید کلیدی وارد نکنید، به سادگی گزینه اول (هوش مصنوعی داخلی) را انتخاب نمایید.
            </span>
          </div>
        </div>
      )}

      {/* Built-in warning/reassurance */}
      {!selectedOption.requiresKey && (
        <div className="p-4 border border-emerald-100 dark:border-emerald-950/30 rounded-2xl bg-emerald-50/20 dark:bg-emerald-950/5 flex items-center gap-3">
          <Sparkles className="text-emerald-500 shrink-0 animate-pulse" size={20} />
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            با انتخاب این گزینه، سیستم از توکن پیش‌فرض سرور برای تولید سایت شما استفاده می‌کند. نیازی به ورود هیچ اطلاعات حساسی نیست و دکمه ساخت سایت بلافاصله فعال است!
          </p>
        </div>
      )}
    </div>
  );
}
