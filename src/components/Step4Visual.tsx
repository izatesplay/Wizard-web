import React from 'react';
import { WebsiteData, VisualConfig } from '../types';
import { Palette, Type, RefreshCw } from 'lucide-react';

interface Step4VisualProps {
  data: WebsiteData;
  onChange: (update: Partial<WebsiteData>) => void;
}

interface BuiltInPalette {
  name: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export const BUILT_IN_PALETTES: BuiltInPalette[] = [
  {
    name: 'شفق قطبی زنده (Aurora Teal)',
    primary: '#0d9488', // teal-600
    secondary: '#8b5cf6', // violet-500
    background: '#0f172a', // slate-900
    text: '#f8fafc', // slate-50
  },
  {
    name: 'لوکس طلایی (Midnight Gold)',
    primary: '#d4af37', // metallic gold
    secondary: '#a27b1e', // dark gold
    background: '#09090b', // zinc-950
    text: '#fafafa', // zinc-50
  },
  {
    name: 'مینیمالیست تمیز (Nordic Light)',
    primary: '#18181b', // zinc-900
    secondary: '#71717a', // zinc-500
    background: '#ffffff',
    text: '#09090b', // zinc-950
  },
  {
    name: 'نئون سایبرپانک (Neon Cyber)',
    primary: '#f43f5e', // rose-500
    secondary: '#06b6d4', // cyan-500
    background: '#020202', // deep dark
    text: '#ffffff',
  },
  {
    name: 'سبز کهربایی (Sage Forest)',
    primary: '#15803d', // green-700
    secondary: '#f59e0b', // amber-500
    background: '#f8fafc', // slate-50
    text: '#0f172a', // slate-900
  },
  {
    name: 'پاپ رترو (Retro Memphis)',
    primary: '#ec4899', // pink-500
    secondary: '#eab308', // yellow-500
    background: '#fffbeb', // amber-50
    text: '#1c1917', // stone-900
  },
];

export const GOOGLE_FONTS = [
  { id: 'Vazirmatn', name: 'وزیرمتن (Vazirmatn) - رسمی و مدرن', style: "'Vazirmatn', sans-serif" },
  { id: 'Yekan Bakh', name: 'یکان بخ (Yekan Bakh) - هندسی و پویا', style: "'Yekan Bakh', sans-serif" },
  { id: 'Shabnam', name: 'شبنم (Shabnam) - فانتزی و ملو', style: "'Shabnam', sans-serif" },
  { id: 'Inter', name: 'اینتر (Inter) - انگلیسی بسیار مدرن و شیک', style: "'Inter', sans-serif" },
  { id: 'Playfair Display', name: 'پلی‌فر دیسپلی (Playfair Display) - انگلیسی لوکس و سریف', style: "'Playfair Display', serif" },
  { id: 'JetBrains Mono', name: 'جت‌برینز مونو (JetBrains Mono) - فنی و برنامه‌نویسی', style: "'JetBrains Mono', monospace" },
];

export default function Step4Visual({ data, onChange }: Step4VisualProps) {
  const currentVisual = data.visual;

  const selectPreset = (preset: BuiltInPalette) => {
    onChange({
      visual: {
        ...currentVisual,
        paletteName: preset.name,
        primaryColor: preset.primary,
        secondaryColor: preset.secondary,
        backgroundColor: preset.background,
        textColor: preset.text,
      },
    });
  };

  const handleColorChange = (key: keyof Omit<VisualConfig, 'paletteName' | 'fontFamily'>, value: string) => {
    onChange({
      visual: {
        ...currentVisual,
        paletteName: 'سفارشی',
        [key]: value,
      },
    });
  };

  const handleFontChange = (fontFamily: string) => {
    onChange({
      visual: {
        ...currentVisual,
        fontFamily,
      },
    });
  };

  return (
    <div className="flex flex-col gap-6" id="step-4-container">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">مرحله ۴: هویت بصری، رنگ‌ها و تایپوگرافی</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">پالت رنگی دلخواه و فونت اصلی وب‌سایت خود را انتخاب یا شخصی‌سازی کنید.</p>
      </div>

      {/* Preset Palettes */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Palette size={16} className="text-indigo-500" />
          پالت‌های رنگی آماده و پیشنهادی
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {BUILT_IN_PALETTES.map((palette) => {
            const isSelected = currentVisual.paletteName === palette.name;
            return (
              <button
                key={palette.name}
                type="button"
                onClick={() => selectPreset(palette)}
                className={`p-3.5 rounded-xl border text-right transition-all flex flex-col gap-2.5 bg-white dark:bg-slate-950/40 hover:shadow-md ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{palette.name}</span>
                  {isSelected && <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500 text-white rounded">انتخاب شده</span>}
                </div>
                {/* Color swatches preview */}
                <div className="flex gap-1.5 w-full rounded-lg overflow-hidden h-7 border border-slate-100 dark:border-slate-800">
                  <div className="flex-1" style={{ backgroundColor: palette.background }} title="رنگ پس‌زمینه" />
                  <div className="w-1/4" style={{ backgroundColor: palette.primary }} title="رنگ اصلی" />
                  <div className="w-1/4" style={{ backgroundColor: palette.secondary }} title="رنگ ثانویه" />
                  <div className="w-1/4" style={{ backgroundColor: palette.text }} title="رنگ متن" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Color Pickers */}
      <div className="border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 bg-slate-50/40 dark:bg-slate-950/5 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <span>⚙️</span> تنظیم اختصاصی تک‌تک رنگ‌ها
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            پالت فعلی: {currentVisual.paletteName}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Background Color */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400" htmlFor="bg-color-picker">رنگ پس‌زمینه</label>
            <div className="flex items-center gap-2">
              <input
                id="bg-color-picker"
                type="color"
                value={currentVisual.backgroundColor}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0"
              />
              <span className="text-xs font-mono text-slate-700 dark:text-slate-300 uppercase">{currentVisual.backgroundColor}</span>
            </div>
          </div>

          {/* Primary Color */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400" htmlFor="primary-color-picker">رنگ دکمه‌ها و عناصر اصلی</label>
            <div className="flex items-center gap-2">
              <input
                id="primary-color-picker"
                type="color"
                value={currentVisual.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0"
              />
              <span className="text-xs font-mono text-slate-700 dark:text-slate-300 uppercase">{currentVisual.primaryColor}</span>
            </div>
          </div>

          {/* Secondary Color */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400" htmlFor="secondary-color-picker">رنگ هاور و افکت‌ها</label>
            <div className="flex items-center gap-2">
              <input
                id="secondary-color-picker"
                type="color"
                value={currentVisual.secondaryColor}
                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0"
              />
              <span className="text-xs font-mono text-slate-700 dark:text-slate-300 uppercase">{currentVisual.secondaryColor}</span>
            </div>
          </div>

          {/* Text Color */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400" htmlFor="text-color-picker">رنگ نوشته‌ها</label>
            <div className="flex items-center gap-2">
              <input
                id="text-color-picker"
                type="color"
                value={currentVisual.textColor}
                onChange={(e) => handleColorChange('textColor', e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0"
              />
              <span className="text-xs font-mono text-slate-700 dark:text-slate-300 uppercase">{currentVisual.textColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fonts selection */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Type size={16} className="text-indigo-500" />
          انتخاب تایپوگرافی و فونت اصلی
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {GOOGLE_FONTS.map((font) => {
            const isSelected = currentVisual.fontFamily === font.id;
            return (
              <button
                key={font.id}
                type="button"
                onClick={() => handleFontChange(font.id)}
                className={`p-3.5 rounded-xl border text-right transition-all flex justify-between items-center bg-white dark:bg-slate-950/40 hover:shadow-md ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{font.name}</span>
                  <span className="text-[10px] text-slate-500" style={{ fontFamily: font.style }}>
                    بصری‌سازی فونت با یک تست ساده: سلام دنیا! Hello World 123
                  </span>
                </div>
                {isSelected && (
                  <span className="text-xs text-indigo-500 font-bold shrink-0">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
