import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { generateSystemPrompt } from './src/utils/promptGenerator';

// Load env variables
dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();

  // Allow larger payloads for potential base64 images or custom inputs
  app.use(express.json({ limit: '15mb' }));

  // API endpoint for health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date() });
  });

  // API endpoint for website generation
  app.post('/api/generate', async (req, res): Promise<any> => {
    try {
      const {
        name,
        type,
        style,
        categories,
        address,
        phone,
        email,
        socialGithub,
        socialInstagram,
        socialTelegram,
        welcomeMessage,
        visual,
        aiProvider,
        apiKey,
        customEndpoint,
        customModel,
      } = req.body;

      // Validate required parameters
      if (!name || !type || !style || !welcomeMessage) {
        return res.status(400).json({ error: 'اطلاعات مورد نیاز وارد نشده است' });
      }

      const systemPrompt = generateSystemPrompt(req.body);

      let generatedCode = '';

      // Perform API calls based on chosen AI Provider
      if (aiProvider === 'gemini_builtin' || aiProvider === 'gemini_custom') {
        const activeKey = aiProvider === 'gemini_builtin' ? process.env.GEMINI_API_KEY : apiKey;
        if (!activeKey) {
          throw new Error('کلید API وارد نشده است یا در سرور تنظیم نگردیده است');
        }

        // Initialize Gemini with process.env or user key
        const ai = new GoogleGenAI({
          apiKey: activeKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        // Generate Content with gemini-3.5-flash
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: systemPrompt,
          config: {
            temperature: 0.7,
          },
        });

        generatedCode = response.text || '';
      } else if (aiProvider === 'openai') {
        if (!apiKey) {
          throw new Error('لطفاً کلید اختصاصی API OpenAI را وارد کنید');
        }

        // Call OpenAI using native fetch
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: 'You are an elite frontend developer producing fully functional single-file web pages in HTML+CSS+JS.',
              },
              { role: 'user', content: systemPrompt },
            ],
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData?.error?.message || `پاسخ ناموفق از OpenAI: ${response.statusText}`);
        }

        const data = await response.json();
        generatedCode = data.choices?.[0]?.message?.content || '';
      } else if (aiProvider === 'anthropic') {
        if (!apiKey) {
          throw new Error('لطفاً کلید اختصاصی API Anthropic Claude را وارد کنید');
        }

        // Call Anthropic Claude using native fetch
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 4000,
            messages: [{ role: 'user', content: systemPrompt }],
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData?.error?.message || `پاسخ ناموفق از Anthropic: ${response.statusText}`);
        }

        const data = await response.json();
        generatedCode = data.content?.[0]?.text || '';
      } else if (aiProvider === 'custom_openai') {
        if (!apiKey) {
          throw new Error('لطفاً کلید اختصاصی API کاستوم را وارد کنید');
        }
        let endpoint = (customEndpoint || 'https://api.openai.com/v1').trim();
        if (!endpoint.endsWith('/chat/completions')) {
          if (endpoint.endsWith('/')) {
            endpoint = endpoint + 'chat/completions';
          } else {
            endpoint = endpoint + '/chat/completions';
          }
        }
        const modelName = (customModel || 'gpt-4o').trim();

        // Call Custom API using native fetch
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              {
                role: 'system',
                content: 'You are an elite frontend developer producing fully functional single-file web pages in HTML+CSS+JS.',
              },
              { role: 'user', content: systemPrompt },
            ],
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          let errorMsg = '';
          const errData = await response.json().catch(() => ({}));
          const apiErrorMessage = errData?.error?.message;

          if (apiErrorMessage) {
            errorMsg = `خطای سرور هوش مصنوعی: ${apiErrorMessage}`;
          } else {
            if (response.status === 524) {
              errorMsg = `خطای اتمام زمان پاسخ (Timeout 524). سرور پروکسی شما پس از ۱۰۰ ثانیه پاسخ نداد. این معمولاً به دلیل طولانی شدن پاسخ مدل‌های بزرگ است. پیشنهاد می‌کنیم مدل مورد نظر را به "gpt-4o-mini" یا "gemini-1.5-flash" تغییر دهید تا زیر ۱۵ ثانیه لود شود.`;
            } else if (response.status === 522 || response.status === 521) {
              errorMsg = `خطای عدم اتصال به سرور پروکسی (Error ${response.status}). سرور پروکسی مدنظر شما موقتاً خاموش یا خارج از دسترس است.`;
            } else if (response.status === 504) {
              errorMsg = `خطای مهلت زمانی دروازه (Gateway Timeout 504). پروکسی نتوانست به موقع به سرور هوش مصنوعی متصل شود.`;
            } else if (response.status === 401) {
              errorMsg = `کلید API یا توکن اختصاصی وارد شده معتبر نیست (Unauthorized 401). لطفاً از صحت کلید خود مطمئن شوید.`;
            } else if (response.status === 404) {
              errorMsg = `آدرس Endpoint یا مدل وارد شده پیدا نشد (Not Found 404). لطفاً نام مدل و آدرس پایه را چک کنید.`;
            } else if (response.status === 502) {
              errorMsg = `پاسخ نامعتبر از سرور پروکسی (Bad Gateway 502). احتمالاً آدرس یا پورت را اشتباه تنظیم کرده‌اید.`;
            } else if (response.status === 503) {
              errorMsg = `سرویس موقتاً در دسترس نیست (Service Unavailable 503). ترافیک سرور بالا است، چند لحظه دیگر امتحان کنید.`;
            } else {
              errorMsg = `پاسخ ناموفق از سرویس کاستوم (${response.status}): ${response.statusText || 'خطای شبکه'}`;
            }
          }
          throw new Error(errorMsg);
        }

        const data = await response.json();
        generatedCode = data.choices?.[0]?.message?.content || '';
      }

      // Extract the raw HTML from markdown codeblock if the model returned it
      let finalHtml = generatedCode;
      const codeBlockRegex = /```html([\s\S]*?)```/i;
      const match = codeBlockRegex.exec(generatedCode);
      if (match && match[1]) {
        finalHtml = match[1].trim();
      } else {
        // Fallback cleanup if the backticks are there but no language specifier
        const genericBlockRegex = /```([\s\S]*?)```/;
        const genericMatch = genericBlockRegex.exec(generatedCode);
        if (genericMatch && genericMatch[1]) {
          finalHtml = genericMatch[1].trim();
        }
      }

      // If the code doesn't start with <!DOCTYPE, clean up any leading markdown explanations
      if (!finalHtml.includes('<!DOCTYPE') && finalHtml.includes('html')) {
        const htmlStartIndex = finalHtml.indexOf('<!DOCTYPE');
        if (htmlStartIndex !== -1) {
          finalHtml = finalHtml.substring(htmlStartIndex);
        }
      }

      res.json({ html: finalHtml });
    } catch (error: any) {
      console.error('Generation Error:', error);
      res.status(500).json({ error: error?.message || 'خطای غیرمنتظره در تولید وب‌سایت' });
    }
  });

  // Vite middleware / asset serving setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
