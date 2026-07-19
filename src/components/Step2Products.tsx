import React, { useState } from 'react';
import { WebsiteData, ProductCategory, Product } from '../types';
import { Plus, Trash2, ShoppingBag, Grid, Layers, Clipboard } from 'lucide-react';

interface Step2ProductsProps {
  data: WebsiteData;
  onChange: (update: Partial<WebsiteData>) => void;
}

export default function Step2Products({ data, onChange }: Step2ProductsProps) {
  const isEcommerce = data.type === 'ecommerce';
  const [newCatName, setNewCatName] = useState('');

  // Handle category management
  const addCategory = () => {
    if (!newCatName.trim()) return;
    const newCategory: ProductCategory = {
      id: Date.now().toString(),
      name: newCatName.trim(),
      products: [],
    };
    onChange({
      categories: [...data.categories, newCategory],
    });
    setNewCatName('');
  };

  const removeCategory = (catId: string) => {
    onChange({
      categories: data.categories.filter((c) => c.id !== catId),
    });
  };

  // Handle product management
  const addProduct = (catId: string) => {
    const updated = data.categories.map((cat) => {
      if (cat.id === catId) {
        const newProduct: Product = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          name: '',
          description: '',
          price: '',
          image: '',
        };
        return {
          ...cat,
          products: [...cat.products, newProduct],
        };
      }
      return cat;
    });
    onChange({ categories: updated });
  };

  const updateProduct = (catId: string, prodId: string, fields: Partial<Product>) => {
    const updated = data.categories.map((cat) => {
      if (cat.id === catId) {
        return {
          ...cat,
          products: cat.products.map((p) => {
            if (p.id === prodId) {
              return { ...p, ...fields };
            }
            return p;
          }),
        };
      }
      return cat;
    });
    onChange({ categories: updated });
  };

  const removeProduct = (catId: string, prodId: string) => {
    const updated = data.categories.map((cat) => {
      if (cat.id === catId) {
        return {
          ...cat,
          products: cat.products.filter((p) => p.id !== prodId),
        };
      }
      return cat;
    });
    onChange({ categories: updated });
  };

  if (!isEcommerce) {
    return (
      <div className="flex flex-col gap-6 text-center py-8" id="step-2-container">
        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/40 rounded-full flex items-center justify-center mx-auto text-indigo-500 mb-4 animate-bounce">
          <Layers size={28} />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">مرحله ۲: محصولات و کاتالوگ</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          سایت شما از نوع <span className="font-bold text-indigo-500">«{
            data.type === 'corporate' ? 'شرکتی' :
            data.type === 'portfolio' ? 'نمونه کار' :
            data.type === 'blog' ? 'وبلاگ' :
            data.type === 'landing' ? 'لندینگ پیج' :
            data.type === 'restaurant' ? 'کافه و رستوران' : 'خدماتی'
          }»</span> انتخاب شده است. این مرحله برای ثبت کالاهاست و فقط مخصوص «فروشگاه آنلاین» است.
        </p>
        <div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950/30 max-w-md mx-auto mt-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            می‌توانید بدون تغییر خاصی، مستقیماً به مرحله بعدی (اطلاعات تماس) بروید. هوش مصنوعی به‌طور خودکار بخش‌ها و صفحات فرود مناسب با موضوع سایت شما را خلق خواهد کرد.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6" id="step-2-container">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">مرحله ۲: مدیریت دسته‌بندی‌ها و محصولات فروشگاه</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          برای فروشگاه آنلاین خود، دسته‌بندی‌های کالا را مشخص کرده و سپس کالاهای هر دسته را همراه مشخصات وارد کنید.
        </p>
      </div>

      {/* Add Category Panel */}
      <div className="p-4 border border-indigo-100 dark:border-indigo-950/30 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/10 flex flex-col md:flex-row gap-3 items-center">
        <div className="flex items-center gap-2 text-indigo-500 shrink-0">
          <Grid size={18} />
          <span className="text-xs font-bold">دسته‌بندی جدید:</span>
        </div>
        <div className="flex w-full gap-2">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addCategory();
            }}
            placeholder="مثال: مبل تک‌نفره، ساعت‌های دیجیتال، شیرینی‌جات"
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={addCategory}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
          >
            <Plus size={14} />
            افزودن دسته
          </button>
        </div>
      </div>

      {/* Display Categories */}
      {data.categories.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/10">
          <ShoppingBag className="mx-auto text-slate-400 mb-3" size={32} />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">هنوز دسته‌بندی‌ای ایجاد نکرده‌اید</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">با استفاده از فرم بالا، اولین دسته کالایی خود را اضافه کنید.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {data.categories.map((cat, catIdx) => (
            <div
              key={cat.id}
              className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/40 p-4 shadow-sm"
            >
              {/* Category Header */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {catIdx + 1}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{cat.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full font-mono">
                    {cat.products.length} کالا
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeCategory(cat.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
                  title="حذف کامل این دسته‌بندی"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Products in this Category */}
              {cat.products.length === 0 ? (
                <div className="text-center py-6 bg-slate-50/50 dark:bg-slate-950/10 rounded-xl mb-4 border border-dashed border-slate-200/60 dark:border-slate-800/60">
                  <p className="text-xs text-slate-500">هیچ محصولی در این دسته ثبت نشده است.</p>
                  <button
                    type="button"
                    onClick={() => addProduct(cat.id)}
                    className="mt-2 text-xs font-bold text-indigo-500 hover:text-indigo-600 inline-flex items-center gap-1"
                  >
                    <Plus size={14} /> اولين محصول را اضافه کنید
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4 mb-4">
                  {cat.products.map((prod, prodIdx) => (
                    <div
                      key={prod.id}
                      className="p-4 border border-slate-100 dark:border-slate-800/60 rounded-xl bg-slate-50/50 dark:bg-slate-950/5 relative flex flex-col md:flex-row gap-4"
                    >
                      <button
                        type="button"
                        onClick={() => removeProduct(cat.id, prod.id)}
                        className="absolute top-3 left-3 p-1 text-slate-400 hover:text-red-500 rounded transition-all"
                        title="حذف این محصول"
                      >
                        <Trash2 size={14} />
                      </button>

                      {/* Product details inputs */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 w-full">
                        <div className="md:col-span-1 flex items-center justify-center md:justify-start">
                          <span className="text-xs font-mono text-slate-400">#{prodIdx + 1}</span>
                        </div>

                        {/* Name */}
                        <div className="md:col-span-3 flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400">نام کالا <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={prod.name}
                            onChange={(e) => updateProduct(cat.id, prod.id, { name: e.target.value })}
                            placeholder="مثال: مبل چوبی دونفره"
                            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-950 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>

                        {/* Price */}
                        <div className="md:col-span-2 flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400">قیمت (تومان/ریال) <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={prod.price}
                            onChange={(e) => updateProduct(cat.id, prod.id, { price: e.target.value })}
                            placeholder="مثال: ۴,۲۰۰,۰۰۰ تومان"
                            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-950 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-3 flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400">توضیحات کوتاه</label>
                          <input
                            type="text"
                            value={prod.description}
                            onChange={(e) => updateProduct(cat.id, prod.id, { description: e.target.value })}
                            placeholder="مثال: چوب راش درجه یک با پارچه ترک"
                            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-950 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>

                        {/* Image URL */}
                        <div className="md:col-span-3 flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400">لینک عکس کالا (اختیاری)</label>
                          <input
                            type="text"
                            value={prod.image}
                            onChange={(e) => updateProduct(cat.id, prod.id, { image: e.target.value })}
                            placeholder="https://..."
                            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-950 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Product Button */}
              <button
                type="button"
                onClick={() => addProduct(cat.id)}
                className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/40 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5"
              >
                <Plus size={14} />
                افزودن کالا به دسته‌بندی {cat.name}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
