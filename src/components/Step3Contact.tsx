import React, { useState } from 'react';
import { WebsiteData } from '../types';
import { MapPin, Phone, Mail, Github, Instagram, MessageSquare, Send, Globe, Image, Upload, Trash2 } from 'lucide-react';

interface Step3ContactProps {
  data: WebsiteData;
  onChange: (update: Partial<WebsiteData>) => void;
}

export default function Step3Contact({ data, onChange }: Step3ContactProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('لطفاً فقط فایل تصویر (JPG یا PNG) آپلود کنید.');
      return;
    }
    
    // Check size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('حجم فایل تصویر باید کمتر از ۲ مگابایت باشد.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onChange({ logoUrl: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="flex flex-col gap-6" id="step-3-container">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">مرحله ۳: اطلاعات تماس، لوگو و سئو</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">اطلاعات تماس، پیام آغازین، لوگوی اختصاصی و کلمات کلیدی سئو را وارد کنید تا هوش مصنوعی سایت و قالب را بر اساس آن‌ها شخصی‌سازی کند.</p>
      </div>

      {/* Main Welcome Message */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5" htmlFor="welcome-msg-textarea">
          <MessageSquare size={16} className="text-indigo-500" />
          پیام خوش‌آمدگویی یا شعار اصلی سایت <span className="text-red-500">*</span>
        </label>
        <textarea
          id="welcome-msg-textarea"
          rows={3}
          value={data.welcomeMessage}
          onChange={(e) => onChange({ welcomeMessage: e.target.value })}
          placeholder="مثال: به فروشگاه گالری مبل افرا خوش آمدید. هنر ایرانی، کیفیت جهانی و ماندگاری بی‌نظیر برای خانه شما."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
        />
        <span className="text-[10px] text-slate-400 dark:text-slate-500">این متن به عنوان عنوان و توضیحات اصلی در بخش Hero (بالای صفحه اصلی) نمایش داده می‌شود.</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Logo Upload */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Image size={15} className="text-indigo-500" />
            بارگذاری فایل تصویر لوگو (اختیاری)
          </label>
          
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-5 transition-all text-center min-h-[120px] ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
                : data.logoUrl
                ? 'border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950'
            }`}
          >
            {data.logoUrl ? (
              <div className="flex items-center gap-4 w-full text-right justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-800 p-1.5">
                    <img src={data.logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">لوگو با موفقیت بارگذاری شد</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">آماده قرارگیری در قالب و هدر/فوتر سایت</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onChange({ logoUrl: '' })}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 text-xs font-bold transition-all cursor-pointer"
                >
                  <Trash2 size={13} />
                  حذف لوگو
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center gap-2 cursor-pointer w-full">
                <Upload size={22} className="text-slate-400 dark:text-slate-500 animate-pulse" />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    فایل لوگو را به اینجا بکشید یا برای انتخاب کلیک کنید
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    فرمت‌های پشتیبانی شده: JPG, PNG (حداکثر ۲ مگابایت)
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* SEO Keywords */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5" htmlFor="seo-keywords-input">
            <Globe size={15} className="text-indigo-500" />
            کلمات کلیدی سئو (اختیاری - با ویرگول جدا کنید)
          </label>
          <input
            id="seo-keywords-input"
            type="text"
            value={data.seoKeywords || ''}
            onChange={(e) => onChange({ seoKeywords: e.target.value })}
            placeholder="مثال: مبل راحتی, مبل دلاوران, گالری مبل, خرید مبل افرا"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-right"
            dir="rtl"
          />
          <span className="text-[10px] text-slate-400 dark:text-slate-500">کلماتی که می‌خواهید سایت شما با جستجوی آن‌ها در گوگل رتبه بهتری بگیرد.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phone */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5" htmlFor="phone-input">
            <Phone size={15} className="text-indigo-500" />
            شماره تلفن تماس <span className="text-red-500">*</span>
          </label>
          <input
            id="phone-input"
            type="text"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="مثال: ۰۲۱-۸۸۸۸۴۴۴۴ یا ۰۹۱۲۳۴۵۶۷۸۹"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-left"
            dir="ltr"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5" htmlFor="email-input">
            <Mail size={15} className="text-indigo-500" />
            آدرس ایمیل <span className="text-red-500">*</span>
          </label>
          <input
            id="email-input"
            type="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="مثال: info@yoursite.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-left"
            dir="ltr"
          />
        </div>
      </div>

      {/* Address */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5" htmlFor="address-input">
          <MapPin size={15} className="text-indigo-500" />
          آدرس حضوری یا محل کار <span className="text-red-500">*</span>
        </label>
        <input
          id="address-input"
          type="text"
          value={data.address}
          onChange={(e) => onChange({ address: e.target.value })}
          placeholder="مثال: تهران، خیابان ولیعصر، نرسیده به میدان ونک، پلاک ۱۲۴"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>

      {/* Social Links */}
      <div className="border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 bg-slate-50/40 dark:bg-slate-950/5">
        <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-1.5">
          <span>🔗</span> شبکه‌های اجتماعی و پیام‌رسان‌ها (اختیاری)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Instagram */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1" htmlFor="instagram-input">
              <Instagram size={13} className="text-pink-500" />
              اینستاگرام (نام کاربری)
            </label>
            <input
              id="instagram-input"
              type="text"
              value={data.socialInstagram}
              onChange={(e) => onChange({ socialInstagram: e.target.value })}
              placeholder="مثال: afra_gallery"
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-left"
              dir="ltr"
            />
          </div>

          {/* Telegram */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1" htmlFor="telegram-input">
              <Send size={13} className="text-sky-500" />
              تلگرام (آیدی کانال یا کاربری)
            </label>
            <input
              id="telegram-input"
              type="text"
              value={data.socialTelegram}
              onChange={(e) => onChange({ socialTelegram: e.target.value })}
              placeholder="مثال: afra_admin"
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-left"
              dir="ltr"
            />
          </div>

          {/* Github */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1" htmlFor="github-input">
              <Github size={13} className="text-slate-700 dark:text-slate-300" />
              گیت‌هاب (آدرس کاربری یا لینک پروژه)
            </label>
            <input
              id="github-input"
              type="text"
              value={data.socialGithub}
              onChange={(e) => onChange({ socialGithub: e.target.value })}
              placeholder="مثال: myportfolio"
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-left"
              dir="ltr"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
