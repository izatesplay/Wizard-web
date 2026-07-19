import React, { useState, useEffect } from 'react';
import { Monitor, Tablet, Smartphone, Download, ExternalLink, Code, ChevronRight, Eye, Copy, Check } from 'lucide-react';

interface WebsitePreviewProps {
  code: string;
  siteName: string;
  onBack: () => void;
}

export default function WebsitePreview({ code, siteName, onBack }: WebsitePreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string>('');

  // Generate blob URL for safe preview iframe
  useEffect(() => {
    if (!code) return;
    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    setIframeUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [code]);

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Clean filename
    const safeName = siteName.replace(/[^a-zA-Z0-9آ-ی]/g, '_') || 'my_generated_site';
    a.download = `${safeName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenNewTab = () => {
    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Device width classes
  const deviceWidths = {
    desktop: 'w-full h-full max-w-full',
    tablet: 'w-[768px] h-[90%] max-w-full shadow-2xl rounded-2xl border-4 border-slate-300 dark:border-slate-800',
    mobile: 'w-[375px] h-[85%] max-w-full shadow-2xl rounded-[32px] border-8 border-slate-300 dark:border-slate-800',
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[500px]" id="preview-screen-container">
      {/* Top action bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl mb-4">
        
        {/* Title and Back */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl transition-all flex items-center justify-center"
            title="بازگشت به فرم ویرایش"
          >
            <ChevronRight size={20} />
          </button>
          <div>
            <h2 className="text-md font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              🎉 وب‌سایت شما ساخته شد!
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              نام وب‌سایت: <span className="font-bold text-indigo-500">{siteName}</span>
            </p>
          </div>
        </div>

        {/* Responsive device simulator selectors */}
        <div className="flex items-center gap-1.5 bg-slate-200/60 dark:bg-slate-800/60 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              device === 'desktop'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Monitor size={14} />
            <span className="hidden sm:inline">دسکتاپ</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice('tablet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              device === 'tablet'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Tablet size={14} />
            <span className="hidden sm:inline">تبلت</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              device === 'mobile'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Smartphone size={14} />
            <span className="hidden sm:inline">موبایل</span>
          </button>
        </div>

        {/* Download & Actions buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Show Code toggle */}
          <button
            type="button"
            onClick={() => setShowCode(!showCode)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              showCode
                ? 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Code size={14} />
            {showCode ? 'نمایش زنده' : 'مشاهده کد HTML'}
          </button>

          {/* Open full screen */}
          <button
            type="button"
            onClick={handleOpenNewTab}
            className="px-3 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            title="پیش‌نمایش زنده تمام‌صفحه در تب جدید"
          >
            <ExternalLink size={14} />
            <span className="hidden lg:inline">تمام‌صفحه</span>
          </button>

          {/* Download button */}
          <button
            type="button"
            onClick={handleDownload}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm shadow-indigo-500/20 transition-all"
          >
            <Download size={14} />
            دانلود سایت (HTML)
          </button>
        </div>
      </div>

      {/* Main Sandbox Preview area */}
      <div className="flex-1 bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl overflow-hidden flex items-center justify-center p-4 relative">
        {showCode ? (
          /* HTML Code editor mode */
          <div className="w-full h-full bg-slate-900 dark:bg-black rounded-2xl p-4 overflow-auto font-mono text-xs text-slate-300 relative select-text" dir="ltr">
            <div className="absolute top-4 right-4 z-10">
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl flex items-center gap-1.5 text-[10px] font-bold border border-slate-700/50 backdrop-blur"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {copied ? 'کپی شد!' : 'کپی کد'}
              </button>
            </div>
            <pre className="mt-8 overflow-x-auto whitespace-pre-wrap">{code}</pre>
          </div>
        ) : (
          /* Interactive Live Frame device simulator preview */
          <div className={`transition-all duration-300 flex items-center justify-center ${deviceWidths[device]}`}>
            {iframeUrl ? (
              <iframe
                id="generated-site-preview-iframe"
                src={iframeUrl}
                title={siteName}
                className="w-full h-full bg-white rounded-xl overflow-hidden shadow-sm"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            ) : (
              <div className="text-center text-slate-400 text-xs">در حال پردازش نمایش زنده...</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
