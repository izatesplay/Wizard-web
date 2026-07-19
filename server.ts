import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

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

      // Build the detailed design style description
      let styleDetailsPrompt = '';
      if (style === 'glassmorphism') {
        styleDetailsPrompt = `
- Style: Glassmorphism (شیشه‌ای)
- Visual Theme: Vibrant mesh gradients background with glass cards.
- Design Rules: Use "backdrop-filter: blur(16px)" and "background: rgba(255, 255, 255, 0.1)". Include thin semi-transparent white borders (1px) on cards, rounded-3xl corners, and soft multiple layers of shadows. Use glowing neon blur blobs in the background to emphasize the glass transparency.
- Colors: Primary: ${visual.primaryColor}, Secondary: ${visual.secondaryColor}, Background: ${visual.backgroundColor}, Text: ${visual.textColor}.`;
      } else if (style === 'neumorphism') {
        styleDetailsPrompt = `
- Style: Neumorphism (نوومورفیسم)
- Visual Theme: Soft 3D extruded and sunken panels.
- Design Rules: Use flat subtle solid colors for background. Elements should look like they are molded from the background itself. Use dual shadows: a dark soft shadow on the bottom-right and a light soft shadow on the top-left (e.g., box-shadow: 12px 12px 24px rgba(0,0,0,0.06), -12px -12px 24px rgba(255,255,255,0.8)). Buttons should sink when clicked (active:shadow-inner).
- Colors: Primary: ${visual.primaryColor}, Secondary: ${visual.secondaryColor}, Background: ${visual.backgroundColor}, Text: ${visual.textColor}.`;
      } else if (style === 'minimalist') {
        styleDetailsPrompt = `
- Style: Minimalist (مینیمالیسم)
- Visual Theme: High typography contrast, generous white spaces, thin subtle lines.
- Design Rules: Absolute clean lines, no shadows, no complex gradients. Heavy emphasis on elegant typography spacing, thin borders, monochrome palettes with single accent color, lightweight icons, spacious margins.
- Colors: Primary: ${visual.primaryColor}, Secondary: ${visual.secondaryColor}, Background: ${visual.backgroundColor}, Text: ${visual.textColor}.`;
      } else if (style === 'luxury') {
        styleDetailsPrompt = `
- Style: Dark Luxury (لوکس مجلل تاریک)
- Visual Theme: Elegant golden accents on deep velvet dark backgrounds.
- Design Rules: Deep luxury look. Delicate golden borders (e.g. 1px solid ${visual.primaryColor}), elegant serif headings, warm lighting shadows, gold glowing gradients, fine decorations. Use premium serif google font pairing for display titles.
- Colors: Primary: ${visual.primaryColor}, Secondary: ${visual.secondaryColor}, Background: ${visual.backgroundColor}, Text: ${visual.textColor}.`;
      } else if (style === 'brutalist') {
        styleDetailsPrompt = `
- Style: Neo-Brutalist (بروتالیست مدرن)
- Visual Theme: Solid thick black borders, flat high-contrast colors, offset flat shadows.
- Design Rules: Use thick solid black borders (e.g. border-4 border-black) on all elements. Use sharp offset flat shadows without any blur (e.g. shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]). High energy typography, monospace details, rotating/skewed boxes, vibrant flat background fills.
- Colors: Primary: ${visual.primaryColor}, Secondary: ${visual.secondaryColor}, Background: ${visual.backgroundColor}, Text: ${visual.textColor}.`;
      } else if (style === 'bento') {
        styleDetailsPrompt = `
- Style: Bento Grid (باکس‌های بنتو)
- Visual Theme: Structured compartments grid with distinct sizes and big rounded corners.
- Design Rules: Use CSS Grid with varying column/row spans. Every section of content should be in its own card with very rounded corners (rounded-3xl). Keep visual layout extremely neat, structured, and modern like Apple interfaces.
- Colors: Primary: ${visual.primaryColor}, Secondary: ${visual.secondaryColor}, Background: ${visual.backgroundColor}, Text: ${visual.textColor}.`;
      } else if (style === 'gradient') {
        styleDetailsPrompt = `
- Style: Aurora / Gradient (شفق قطبی زنده)
- Visual Theme: Dynamic flowing fluid color gradients, illuminated glowing look.
- Design Rules: Apply multi-stop gradients. Use gradient text masking (bg-clip-text text-transparent bg-gradient-to-r) for display headers. Use interactive cards that light up on hover, soft colorful back-glows.
- Colors: Primary: ${visual.primaryColor}, Secondary: ${visual.secondaryColor}, Background: ${visual.backgroundColor}, Text: ${visual.textColor}.`;
      } else if (style === 'claymorphism') {
        styleDetailsPrompt = `
- Style: Claymorphism (سفالی سه‌بعدی)
- Visual Theme: 3D puffy plastic shapes with soft double shadows and rounded silhouettes.
- Design Rules: Double inner shadows to simulate depth (e.g. box-shadow: 10px 10px 20px rgba(0,0,0,0.06), inset -6px -6px 10px rgba(0,0,0,0.12), inset 6px 6px 10px rgba(255,255,255,0.4)). Massive rounded corners (rounded-full or rounded-3xl), playful visual widgets.
- Colors: Primary: ${visual.primaryColor}, Secondary: ${visual.secondaryColor}, Background: ${visual.backgroundColor}, Text: ${visual.textColor}.`;
      } else if (style === 'memphis') {
        styleDetailsPrompt = `
- Style: Retro Memphis (ممفیس)
- Visual Theme: Playful geometric symbols, zigzags, dotted patterns, neon-pastel blocks.
- Design Rules: Use retro shapes (crosses, waves, triangles). Thick outlines, cute grid patterns, asymmetric grids. Playful, cheerful, nostalgic vibes of the 80s with clean modern spacing.
- Colors: Primary: ${visual.primaryColor}, Secondary: ${visual.secondaryColor}, Background: ${visual.backgroundColor}, Text: ${visual.textColor}.`;
      } else if (style === 'cyberpunk') {
        styleDetailsPrompt = `
- Style: Cyberpunk (سایبرپانک)
- Visual Theme: High-intensity neon glow, neon cyber grids, technological HUDs.
- Design Rules: Glowing neon borders and text-shadows, sharp angled cut corners, tech HUD grids, glowing buttons with scanline backgrounds or glitch animations. Colors must pop on the very dark backdrop.
- Colors: Primary: ${visual.primaryColor}, Secondary: ${visual.secondaryColor}, Background: ${visual.backgroundColor}, Text: ${visual.textColor}.`;
      }

      // Build the detailed prompt for website content based on type
      let contentPrompt = '';
      if (type === 'ecommerce') {
        const catStr = JSON.stringify(categories, null, 2);
        contentPrompt = `
This is an E-COMMERCE (فروشگاه آنلاین) website.
Here is the product catalog with categories and products:
${catStr}

IMPORTANT EXTRA FUNCTIONALITY REQUIREMENT:
Since this is an ecommerce site, you MUST build a fully operational client-side Shopping Cart!
- Header: Must include a cart icon button with a glowing numeric count badge.
- Clicking the cart icon must slide in or trigger a beautifully styled Cart Modal or Drawer.
- In the product grid: Clicking the "افزودن به سبد خرید" (Add to Cart) button on any product card must dynamically add that product to the cart state, update the header count badge, and show a beautiful success toast.
- Inside the Cart Drawer: Users can see their selected items with names, price, image, quantity input/selectors (+ and -), a trash icon to remove item, dynamic subtotal calculation, and a "ثبت نهایی سفارش" (Proceed to Checkout) button.
- Clicking Checkout must show a gorgeous Checkout Form (Name, Phone, Address) right inside the drawer or as a modal. Submitting the form must clear the cart, show a stunning "سفارش شما با موفقیت ثبت شد" (Order placed successfully) custom animated success screen or toast, and alert the user.
- This shopping cart logic MUST be coded cleanly in native client-side JavaScript inside the generated file, and must be fully styled in the chosen design style!`;
      } else if (type === 'restaurant') {
        contentPrompt = `
This is a CAFE/RESTAURANT (کافه و رستوران) website.
We want to show a stunning food/drink menu, about section, and a table reservation system.
- Food Menu Section: Display gorgeous category tabs (e.g. قهوه‌ها، نوشیدنی‌های سرد، کیک و دسر، غذاهای گرم). Clicking a category must smoothly show/hide appropriate items with descriptions and prices.
- Table Reservation System: Build an interactive "رزرو میز" form. Users can select date, time, number of people, and input their name/phone. Clicking "ثبت رزرو" must show a gorgeous success toast or animation, stating that their reservation is received. Add interactive feedback!`;
      } else if (type === 'portfolio') {
        contentPrompt = `
This is a PORTFOLIO (نمونه کار / پورتفولیو) website.
- Grid Showcase: Show a creative grid of projects.
- Interactive Filter: Include project filter tabs (e.g. همه، طراحی وب، گرافیک، عکاسی). Clicking a tab must smoothly animate and filter the project cards using JavaScript!
- Lightbox Modal: Clicking on any project card must open a stunning modal with detailed images, project descriptions, tags, and link to project.
- Make it extremely creative, smooth, and artistically optimized for a portfolio.`;
      } else if (type === 'blog') {
        contentPrompt = `
This is a BLOG/MAGAZINE (وبلاگ / مجله خبری) website.
- Article Cards: Show a beautiful grid of mock blog articles.
- Dynamic Categories: Tabs like (تازهترین‌ها، تکنولوژی، سبک زندگی، کسب و کار).
- Quick Read Modal: Clicking "ادامه مطلب" (Read More) on any blog card must slide open a beautiful modal containing the full text of the article so the reader doesn't have to leave the page, complete with reading-time indicator, author avatar, and a beautiful share panel.`;
      } else if (type === 'corporate') {
        contentPrompt = `
This is a CORPORATE (سایت شرکتی) website.
- Key Sections: Professional Hero, About Us with dynamic statistics counters (e.g. مشتریان راضی، پروژه‌های موفق، سال‌های تجربه) which animate on scroll using Intersection Observer!
- Services Grid: Beautifully interactive cards showing the company's core values or service plans.
- Client Logos Carousel: Smooth scrolling loop of client placeholder logos.
- FAQ Accordion: A highly polished interactive Accordion (سوالات متداول). Clicking a question must smoothly expand/collapse the answer with subtle chevron rotation.`;
      } else if (type === 'services') {
        contentPrompt = `
This is a SERVICE / CONSULTING (سایت خدماتی) website.
- Key Sections: Core services, Price Calculator, Testimonials, Contact/Booking.
- Interactive Service Price Calculator: Build a lightweight, fully functional interactive calculator! For example, users select checkboxes for services (e.g. طراحی پایه، بهینه‌سازی سئو، پشتیبانی ۶ ماهه) or adjust a slider, and the calculator instantly updates and displays the total estimated cost! Clicking "ثبت درخواست مشاوره" should prefill the contact form with that estimate! This is an extraordinary feature that makes the site incredibly useful.`;
      } else if (type === 'landing') {
        contentPrompt = `
This is a LANDING PAGE (صفحه فرود) website.
- High Conversion Focus: High-impact hero section with primary and secondary call-to-actions, visual graphics or mock screens.
- Interactive Feature Grid: Highlighting features with hover micro-interactions.
- Testimonial slider: A fully interactive manual/auto testimonial slider (کاربران درباره ما چه می‌گویند) using client-side JS to cycle through reviews.
- Clean pricing toggle: A monthly/yearly billing toggle that dynamically updates the pricing numbers!`;
}

      const fontObj = {
        id: visual.fontFamily,
        importUrl: `https://fonts.googleapis.com/css2?family=${visual.fontFamily === 'Vazirmatn' ? 'Vazirmatn:wght@300;400;700;900' : visual.fontFamily === 'Shabnam' ? 'Shabnam' : visual.fontFamily === 'Inter' ? 'Inter:wght@300;400;600;800' : visual.fontFamily === 'Playfair Display' ? 'Playfair+Display:ital,wght@0,400;0,700;1,400' : 'JetBrains+Mono:wght@300;400;700'}&display=swap`,
        fontFamilyName: visual.fontFamily === 'Vazirmatn' ? 'Vazirmatn' : visual.fontFamily === 'Shabnam' ? 'Shabnam' : visual.fontFamily === 'Inter' ? 'Inter' : visual.fontFamily === 'Playfair Display' ? 'Playfair Display' : 'JetBrains Mono',
      };

      const systemPrompt = `You are a world-class principal front-end engineer and award-winning UI/UX designer.
Your task is to write a single, complete, stunning, fully responsive, and highly functional website file in HTML+CSS+JS based on the user's requirements.
The website must be absolutely outstanding, visually gorgeous, and look like a premium premium template with fluid animations and rich interactive features.

Here are the strict requirements of the generated code:
1. Output format: You must output ONLY the complete HTML code. Start directly with <!DOCTYPE html> and end with </html>.
2. Put the code inside a single markdown code block: \`\`\`html ... \`\`\`. Do not write any explanations before or after.
3. Incorporate Tailwind CSS by importing the modern Tailwind browser script from a CDN:
   <script src="https://cdn.tailwindcss.com"></script>
4. Include FontAwesome or Lucide icons from a CDN for pixel-perfect modern icons:
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
5. Font Import: You MUST import and apply this Google Font:
   - Import URL: ${fontObj.importUrl}
   - Font Family Name: ${fontObj.fontFamilyName}
   Make sure you define this in the <style> block of the page:
   * { font-family: '${fontObj.fontFamilyName}', 'Vazirmatn', 'Inter', sans-serif; }
6. RTL Support: Since the website is mainly in Persian (Farsi), add dir="rtl" to the <html> tag, but if English fonts like Inter or Playfair are selected, ensure English labels are beautiful and align well.
7. Color Theme: Apply these exact HEX colors for the palette:
   - Primary Accent (Buttons, highlights): ${visual.primaryColor}
   - Secondary Accent (Hover effects, active states): ${visual.secondaryColor}
   - Background Color (Body backdrop): ${visual.backgroundColor}
   - Text Color: ${visual.textColor}
   Inject these colors dynamically into Tailwind config or use them as CSS variables in <style>:
   :root {
      --primary: ${visual.primaryColor};
      --secondary: ${visual.secondaryColor};
      --bg: ${visual.backgroundColor};
      --text: ${visual.textColor};
   }
   Using custom Tailwind colors makes it super easy:
   <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              customPrimary: '${visual.primaryColor}',
              customSecondary: '${visual.secondaryColor}',
              customBg: '${visual.backgroundColor}',
              customText: '${visual.textColor}',
            }
          }
        }
      }
   </script>
8. Design Style Guidelines:
   Ensure the visual style fits the chosen design style perfectly:
   ${styleDetailsPrompt}
9. Content Requirements:
   - Site Name: "${name}"
   - Main Headline / Message: "${welcomeMessage}"
   - Phone: "${phone}"
   - Email: "${email}"
   - Address: "${address}"
   - Socials: Instagram: ${socialInstagram || 'none'}, Telegram: ${socialTelegram || 'none'}, Github: ${socialGithub || 'none'}
10. Interactive Core Features:
    ${contentPrompt}
11. Responsive layout: Build a fully functional mobile navigation bar (hamburger menu) that toggles open/close beautifully on touch screens.
12. Animations: Build a lightweight intersection observer in native JS to animate components as they scroll into view (e.g. fading in, slide-up), creating a fluid premium experience. Add hover transitions to all buttons and cards.
13. Content completeness: DO NOT use any "lorem ipsum" or mock placeholders like "Lorem, ipsum dolor sit amet...". Write real, beautiful, persuasive copy in Persian relevant to the specific business name and theme. Create beautiful layout with structured navigation links (خانه، خدمات، درباره ما، تماس با ما).

Make sure the output code is completely self-contained, with no external styling needed. Let's build a masterpiece!`;

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
