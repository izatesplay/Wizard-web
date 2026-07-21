import React, { useState, useEffect } from 'react';
import { Monitor, Tablet, Smartphone, Download, ExternalLink, Code, ChevronRight, Eye, Copy, Check, FolderArchive } from 'lucide-react';
import JSZip from 'jszip';
import { WebsiteData } from '../types';

interface WebsitePreviewProps {
  code: string;
  siteName: string;
  onBack: () => void;
  data: WebsiteData;
}

export default function WebsitePreview({ code, siteName, onBack, data }: WebsitePreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string>('');
  const [exportingWp, setExportingWp] = useState(false);

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

  const handleDownloadWordPress = async () => {
    try {
      setExportingWp(true);
      const zip = new JSZip();
      
      const cleanThemeSlug = (siteName || 'ai_theme')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/^_+|_+$/g, '') || 'ai_custom_theme';

      const themeFolder = zip.folder(cleanThemeSlug);
      if (!themeFolder) throw new Error("Could not create theme folder in ZIP");

      // 1. style.css
      const styleCss = `/*
Theme Name: ${siteName || 'AI Smart Theme'}
Theme URI: https://wordpress.org/themes/
Author: AI Website Builder
Author URI: https://ai.studio/build
Description: پوسته هوشمند و زیبای "${siteName || 'AI Smart Theme'}" طراحی شده تماماً توسط هوش مصنوعی با معماری واکنش‌گرا و سرعت لود فوق‌العاده بالا. همراه با پنل مدیریت تخصصی در مدیریت وردپرس.
Version: 1.0.0
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: ${cleanThemeSlug}
*/`;
      themeFolder.file("style.css", styleCss);

      // 2. index.php (The raw HTML compiled, with PHP STORE_DATA overlay injected)
      const staticCategoriesJson = JSON.stringify(data.categories || []);
      const storeDataRegex = /window\.STORE_DATA\s*=\s*\[[\s\S]*?\]\s*;/g;

      const phpReplacement = `window.STORE_DATA = <?php 
$saved_data = get_option('ai_site_store_data');
if ($saved_data) {
    echo json_encode($saved_data, JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(json_decode('${staticCategoriesJson.replace(/'/g, "\\'")}', true), JSON_UNESCAPED_UNICODE);
}
?>;`;

      let indexPhp = code;
      if (storeDataRegex.test(code)) {
        indexPhp = code.replace(storeDataRegex, phpReplacement);
      } else {
        indexPhp = code.replace('</head>', `<script>\n${phpReplacement}\n</script>\n</head>`);
      }
      themeFolder.file("index.php", indexPhp);

      // 3. initial_data.json
      themeFolder.file("initial_data.json", JSON.stringify(data.categories || [], null, 2));

      // 4. functions.php
      let managerTitle = "مدیریت و پنل تنظیمات قالب هوشمند AI";
      let sectionTitle = "مدیریت محتوای سایت";
      let itemLabel = "آیتم";
      let addBtnLabel = "افزودن آیتم جدید به این دسته";

      if (data.type === 'ecommerce') {
        managerTitle = "مدیریت فروشگاه و محصولات پوسته AI";
        sectionTitle = "مدیریت فروشگاه";
        itemLabel = "محصول";
        addBtnLabel = "افزودن محصول جدید به این دسته";
      } else if (data.type === 'restaurant') {
        managerTitle = "مدیریت منوی رستوران و کافه پوسته AI";
        sectionTitle = "مدیریت منو و کافه";
        itemLabel = "آیتم منو";
        addBtnLabel = "افزودن نوشیدنی یا غذا به این دسته";
      } else if (data.type === 'portfolio') {
        managerTitle = "مدیریت پروژه‌ها و پورتفولیو پوسته AI";
        sectionTitle = "مدیریت پورتفولیو";
        itemLabel = "پروژه";
        addBtnLabel = "افزودن پروژه جدید به این دسته";
      } else if (data.type === 'blog') {
        managerTitle = "مدیریت مقالات و نوشته‌های وبلاگ پوسته AI";
        sectionTitle = "مدیریت وبلاگ";
        itemLabel = "مقاله/نوشته";
        addBtnLabel = "افزودن نوشته یا مقاله جدید";
      }

      const functionsPhp = `<?php
/**
 * Theme functions and definitions
 *
 * Compiled and designed by AI Website Builder
 */

// Register the WordPress Admin Options Page
add_action('admin_menu', 'ai_site_register_admin_page');
function ai_site_register_admin_page() {
    add_menu_page(
        '${sectionTitle}', // Page title
        'مدیریت پوسته AI ⚡',   // Menu title
        'manage_options',       // Capability
        'ai-site-admin',        // Menu slug
        'ai_site_render_admin_page', // Callback function
        'dashicons-layout',     // Icon
        2                       // Position
    );
}

// Initial default data if none exists
function ai_site_get_default_data() {
    return [
        [
            "id" => "1",
            "name" => "دسته‌بندی اصلی",
            "products" => [
                [
                    "id" => "p1",
                    "name" => "نام محصول نمونه",
                    "description" => "این یک محصول نمونه است که از پنل وردپرس قابل ویرایش است.",
                    "price" => "۱۰۰,۰۰۰ تومان",
                    "image" => "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80"
                ]
            ]
        ]
    ];
}

// Render the Administration Page
function ai_site_render_admin_page() {
    // Handle saving of changes
    if (isset($_POST['ai_site_submit_settings']) && check_admin_referer('ai_site_save_action', 'ai_site_nonce')) {
        if (isset($_POST['store_data_json'])) {
            $json_raw = wp_unslash($_POST['store_data_json']);
            $decoded = json_decode($json_raw, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                update_option('ai_site_store_data', $decoded);
                echo '<div class="notice notice-success is-dismissible" style="margin-top: 15px; border-right-color: #4f46e5;"><p style="font-weight: bold; font-family: Vazirmatn, sans-serif;">✅ تغییرات با موفقیت در بانک اطلاعاتی وردپرس ذخیره شدند!</p></div>';
            } else {
                echo '<div class="notice notice-error is-dismissible" style="margin-top: 15px;"><p style="font-weight: bold;">❌ خطا در پردازش اطلاعات ارسالی.</p></div>';
            }
        }
    }

    // Get current data
    $saved = get_option('ai_site_store_data');
    if (!$saved) {
        // Try to load initial data injected by the builder
        $initial_file = get_template_directory() . '/initial_data.json';
        if (file_exists($initial_file)) {
            $saved = json_decode(file_get_contents($initial_file), true);
        }
        if (!$saved) {
            $saved = ai_site_get_default_data();
        }
    }

    $store_data_json = json_encode($saved, JSON_UNESCAPED_UNICODE);
    ?>
    
    <!-- Include Google Fonts, Tailwind CSS & FontAwesome for a beautiful Premium Admin Portal -->
    <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.tailwindcss.com"></script>
    
    <style>
        .ai-admin-body * {
            font-family: 'Vazirmatn', sans-serif !important;
        }
        /* Fix WP sidebar interference */
        #wpcontent {
            padding-left: 0 !important;
        }
    </style>

    <div class="wrap ai-admin-body p-6 max-w-6xl mr-auto" dir="rtl">
        <!-- Header Banner -->
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 text-white mb-8 shadow-xl shadow-indigo-500/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center text-3xl">
                    ⚡
                </div>
                <div>
                    <h1 class="text-xl font-black text-white m-0"><?php echo "${managerTitle}"; ?></h1>
                    <p class="text-xs text-indigo-100 mt-1 opacity-90">به راحتی دسته‌بندی‌ها، آیتم‌ها، قیمت‌ها و تصاویر وب‌سایت خود را بدون دستکاری کد ویرایش کنید.</p>
                </div>
            </div>
            <div class="px-4 py-2 bg-white/10 backdrop-blur rounded-2xl text-xs font-bold border border-white/10">
                پوسته فعال: <?php echo wp_get_theme()->get('Name'); ?>
            </div>
        </div>

        <div id="ai-store-manager-app">
            <!-- Dynamic Form with Vue-like logic in Vanilla JS -->
            <form method="post" action="" id="settings-form">
                <?php wp_nonce_field('ai_site_save_action', 'ai_site_nonce'); ?>
                <input type="hidden" name="ai_site_submit_settings" value="1">
                <input type="hidden" name="store_data_json" id="store_data_json_input" value="">

                <!-- Main Grid Layout -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <!-- Sidebar Actions -->
                    <div class="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm h-fit">
                        <h3 class="text-sm font-black text-slate-800 border-b border-slate-100 pb-3 mb-4">عملیات کلی</h3>
                        
                        <div class="flex flex-col gap-3">
                            <button type="button" onclick="addNewCategory()" class="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all">
                                <i class="fa-solid fa-folder-plus text-indigo-600"></i>
                                افزودن دسته‌بندی جدید
                            </button>
                            
                            <button type="button" onclick="saveAllChanges()" class="w-full px-4 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/15 transition-all">
                                <i class="fa-solid fa-floppy-disk"></i>
                                ذخیره نهایی تنظیمات
                            </button>
                        </div>

                        <div class="mt-6 p-4 rounded-2xl bg-indigo-50 text-[10px] text-slate-600 leading-relaxed">
                            <span class="font-bold text-indigo-600 flex items-center gap-1.5 mb-1.5">
                                <i class="fa-solid fa-circle-info"></i> راهنمای استفاده سریع:
                            </span>
                            در این بخش می‌توانید دسته‌ها و آیتم‌ها را اضافه، حذف یا ویرایش کنید. پس از پایان تغییرات، حتماً روی دکمه <strong class="text-indigo-600">ذخیره نهایی تنظیمات</strong> کلیک کنید تا تغییرات در سایت اعمال شوند.
                        </div>
                    </div>

                    <!-- Categories and items editor -->
                    <div class="lg:col-span-8 flex flex-col gap-6" id="categories-container">
                        <!-- Dynamic categories will be generated here -->
                    </div>
                </div>
            </form>
        </div>
    </div>

    <!-- Admin Panel Scripting -->
    <script>
        // Parse the initial data
        let storeData = <?php echo $store_data_json; ?>;

        // Ensure every product/item has an array inside categories (handle dynamic names if applicable)
        storeData = storeData.map(cat => {
            // Normalize product arrays
            let items = cat.products || cat.items || cat.projects || cat.articles || [];
            return {
                id: cat.id || String(Math.random()),
                name: cat.name || '',
                products: items
            };
        });

        // Main rendering function
        function renderManager() {
            const container = document.getElementById('categories-container');
            if (!container) return;
            
            if (storeData.length === 0) {
                container.innerHTML = \`
                    <div class="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center">
                        <i class="fa-solid fa-box-open text-slate-300 text-5xl mb-4"></i>
                        <h4 class="text-sm font-bold text-slate-700 mb-1">هیچ دسته‌بندی یا آیتمی یافت نشد</h4>
                        <p class="text-xs text-slate-400 mb-6 font-medium">برای شروع روی دکمه افزودن دسته‌بندی جدید کلیک کنید.</p>
                        <button type="button" onclick="addNewCategory()" class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all">
                            ایجاد اولین دسته‌بندی
                        </button>
                    </div>
                \`;
                return;
            }

            let html = '';

            storeData.forEach((category, catIdx) => {
                html += \`
                    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 relative">
                        <!-- Category Header -->
                        <div class="flex justify-between items-center border-b border-slate-100 pb-4 mb-4 gap-4">
                            <div class="flex-1">
                                <label class="text-[10px] font-bold text-slate-400 block mb-1">نام دسته‌بندی:</label>
                                <input type="text" value="\${category.name}" onchange="updateCategoryName(\${catIdx}, this.value)" class="w-full md:max-w-xs px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="مثلا: مبلمان راحتی">
                            </div>
                            <button type="button" onclick="deleteCategory(\${catIdx})" class="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition-all mt-4" title="حذف این دسته‌بندی">
                                <i class="fa-solid fa-trash-can"></i>
                                حذف دسته
                            </button>
                        </div>

                        <!-- Items Grid inside category -->
                        <div class="flex flex-col gap-4 mb-4">
                            <h4 class="text-xs font-black text-slate-700 flex items-center gap-1.5">
                                <i class="fa-solid fa-boxes-stacked text-slate-400"></i>
                                آیتم‌ها و محصولات این دسته‌بندی (\${category.products.length})
                            </h4>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                \${category.products.map((item, itemIdx) => \`
                                    <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-3 relative group">
                                        <!-- Delete Item Button -->
                                        <button type="button" onclick="deleteItem(\${catIdx}, \${itemIdx})" class="absolute top-3 left-3 w-7 h-7 bg-white hover:bg-red-50 border border-slate-200 text-red-500 hover:text-red-600 rounded-lg flex items-center justify-center transition-all shadow-sm" title="حذف آیتم">
                                            <i class="fa-solid fa-trash-can text-xs"></i>
                                        </button>

                                        <!-- Item Details form -->
                                        <div class="flex items-center gap-3">
                                            <div class="w-12 h-12 bg-slate-200 rounded-lg overflow-hidden shrink-0">
                                                <img src="\${item.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=100&q=80'}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=100&q=80'">
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <label class="text-[9px] font-bold text-slate-400 block">عنوان آیتم / نام محصول:</label>
                                                <input type="text" value="\${item.name}" onchange="updateItemField(\${catIdx}, \${itemIdx}, 'name', this.value)" class="w-full bg-white px-2 py-1 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none" placeholder="نام آیتم">
                                            </div>
                                        </div>

                                        <div>
                                            <label class="text-[9px] font-bold text-slate-400 block mb-0.5">توضیحات کوتاه:</label>
                                            <textarea onchange="updateItemField(\${catIdx}, \${itemIdx}, 'description', this.value)" rows="2" class="w-full bg-white px-2 py-1 border border-slate-200 rounded-lg text-[11px] leading-relaxed focus:outline-none" placeholder="توضیحات کوتاه درباره ویژگی‌ها یا مواد سازنده...">\${item.description || ''}</textarea>
                                        </div>

                                        <div class="grid grid-cols-2 gap-2">
                                            <div>
                                                <label class="text-[9px] font-bold text-slate-400 block mb-0.5">قیمت / برچسب هزینه:</label>
                                                <input type="text" value="\${item.price}" onchange="updateItemField(\${catIdx}, \${itemIdx}, 'price', this.value)" class="w-full bg-white px-2 py-1 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none" placeholder="قیمت آیتم">
                                            </div>
                                            <div>
                                                <label class="text-[9px] font-bold text-slate-400 block mb-0.5">آدرس لینک تصویر:</label>
                                                <input type="text" value="\${item.image || ''}" onchange="updateItemField(\${catIdx}, \${itemIdx}, 'image', this.value)" class="w-full bg-white px-2 py-1 border border-slate-200 rounded-lg text-[10px] focus:outline-none" placeholder="https://...">
                                            </div>
                                        </div>
                                    </div>
                                \`).join('')}

                                <!-- Add Item Card Button -->
                                <button type="button" onclick="addNewItem(\${catIdx})" class="border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-2 text-slate-400 hover:text-indigo-500 transition-all min-h-[180px]">
                                    <i class="fa-solid fa-plus-circle text-2xl"></i>
                                    <span class="text-xs font-bold">${addBtnLabel}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                \`;
            });

            container.innerHTML = html;
        }

        // Action Handlers
        function updateCategoryName(catIdx, value) {
            storeData[catIdx].name = value;
        }

        function deleteCategory(catIdx) {
            if (confirm('آیا از حذف این دسته‌بندی و تمام محصولات موجود در آن مطمئن هستید؟')) {
                storeData.splice(catIdx, 1);
                renderManager();
            }
        }

        function addNewCategory() {
            storeData.push({
                id: String(Math.random()),
                name: 'دسته‌بندی جدید',
                products: []
            });
            renderManager();
            setTimeout(() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }, 100);
        }

        function updateItemField(catIdx, itemIdx, field, value) {
            storeData[catIdx].products[itemIdx][field] = value;
            if (field === 'image') {
                renderManager();
            }
        }

        function deleteItem(catIdx, itemIdx) {
            if (confirm('آیا مطمئن هستید که می‌خواهید این آیتم را حذف کنید؟')) {
                storeData[catIdx].products.splice(itemIdx, 1);
                renderManager();
            }
        }

        function addNewItem(catIdx) {
            storeData[catIdx].products.push({
                id: 'p_' + Math.random().toString(36).substr(2, 9),
                name: 'نام آیتم جدید',
                description: 'توضیحات کوتاه درباره این محصول جدید.',
                price: 'قیمت جدید',
                image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'
            });
            renderManager();
        }

        function saveAllChanges() {
            document.getElementById('store_data_json_input').value = JSON.stringify(storeData);
            document.getElementById('settings-form').submit();
        }

        // Initial Load
        renderManager();
    </script>
    <?php
}
`;
      themeFolder.file("functions.php", functionsPhp);

      // 5. Generate and download zip
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cleanThemeSlug}_wp_theme.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("خطا در تولید فایل فشرده وردپرس.");
    } finally {
      setExportingWp(false);
    }
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

          {/* Download HTML button */}
          <button
            type="button"
            onClick={handleDownload}
            className="px-3 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            title="دانلود سایت به صورت یک فایل HTML مستقل"
          >
            <Download size={14} />
            دانلود تک‌فایل (HTML)
          </button>

          {/* Download WordPress Theme button */}
          <button
            type="button"
            onClick={handleDownloadWordPress}
            disabled={exportingWp}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm shadow-indigo-500/20 transition-all"
          >
            <FolderArchive size={14} />
            {exportingWp ? 'در حال تولید پوسته...' : 'دانلود پوسته وردپرس'}
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
