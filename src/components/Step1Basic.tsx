import React from 'react';
import { WebsiteData, WebsiteType, DesignStyle } from '../types';
import StyleShowcase from './StyleShowcase';

interface Step1BasicProps {
  data: WebsiteData;
  onChange: (update: Partial<WebsiteData>) => void;
}

const WEBSITE_TYPES: { value: WebsiteType; label: string; icon: string }[] = [
  { value: 'ecommerce', label: 'فروشگاه آنلاین', icon: '🛍️' },
  { value: 'corporate', label: 'سایت شرکتی', icon: '🏢' },
  { value: 'portfolio', label: 'نمونه کار / پورتفولیو', icon: '🎨' },
  { value: 'blog', label: 'وبلاگ / مجله خبری', icon: '✍️' },
  { value: 'landing', label: 'لندینگ پیج (صفحه فرود)', icon: '🚀' },
  { value: 'restaurant', label: 'رستوران / کافه', icon: '🍕' },
  { value: 'services', label: 'سایت خدماتی / مشاوره', icon: '🛠️' },
];

const DESIGN_STYLES: { value: DesignStyle; label: string }[] = [
  { value: 'glassmorphism', label: 'شیشه‌ای (Glassmorphism)' },
  { value: 'neumorphism', label: 'نوومورفیسم (Neumorphism)' },
  { value: 'minimalist', label: 'مینیمالیست (Minimalist)' },
  { value: 'luxury', label: 'لوکس تاریک (Dark Luxury)' },
  { value: 'brutalist', label: 'بروتالیست (Brutalist)' },
  { value: 'bento', label: 'باکس بنتو (Bento Grid)' },
  { value: 'gradient', label: 'شفق قطبی (Aurora / Gradient)' },
  { value: 'claymorphism', label: 'سفالی (Claymorphism)' },
  { value: 'memphis', label: 'طراحی ممفیس (Memphis)' },
  { value: 'cyberpunk', label: 'سایبرپانک (Cyberpunk)' },
];

export default function Step1Basic({ data, onChange }: Step1BasicProps) {
  return (
    <div className="flex flex-col gap-6" id="step-1-container">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">مرحله ۱: اطلاعات پایه سایت</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">نام، موضوع اصلی و زبان طراحی وب‌سایت خود را انتخاب کنید.</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300" htmlFor="site-name-input">
          نام سایت شما <span className="text-red-500">*</span>
        </label>
        <input
          id="site-name-input"
          type="text"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="مثال: گالری مبل افرا، پورتفولیو سارا، کافه لاته"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Website Type Dropdown */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300" htmlFor="site-type-select">
            نوع و موضوع سایت <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="site-type-select"
              value={data.type}
              onChange={(e) => onChange({ type: e.target.value as WebsiteType })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
            >
              {WEBSITE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-slate-500">
              ▼
            </div>
          </div>
        </div>

        {/* Design Style Dropdown */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300" htmlFor="design-style-select">
            سبک طراحی بصری <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="design-style-select"
              value={data.style}
              onChange={(e) => onChange({ style: e.target.value as DesignStyle })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
            >
              {DESIGN_STYLES.map((style) => (
                <option key={style.value} value={style.value}>
                  🎨 {style.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-slate-500">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Style Showcase Card */}
      <StyleShowcase style={data.style} />
    </div>
  );
}
