export interface PromptData {
  name: string;
  type: string;
  style: string;
  welcomeMessage: string;
  phone: string;
  email: string;
  address: string;
  socialInstagram?: string;
  socialTelegram?: string;
  socialGithub?: string;
  categories?: Array<{
    id: string;
    name: string;
    products?: Array<{
      id: string;
      name: string;
      price: string;
      image: string;
      description?: string;
    }>;
  }>;
  visual: {
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
}

export function getFontConfig(fontFamily: string) {
  return {
    id: fontFamily,
    importUrl: `https://fonts.googleapis.com/css2?family=${
      fontFamily === 'Vazirmatn'
        ? 'Vazirmatn:wght@300;400;700;900'
        : fontFamily === 'Shabnam'
        ? 'Shabnam'
        : fontFamily === 'Inter'
        ? 'Inter:wght@300;400;600;800'
        : fontFamily === 'Playfair Display'
        ? 'Playfair+Display:ital,wght@0,400;0,700;1,400'
        : 'JetBrains+Mono:wght@300;400;700'
    }&display=swap`,
    fontFamilyName:
      fontFamily === 'Vazirmatn'
        ? 'Vazirmatn'
        : fontFamily === 'Shabnam'
        ? 'Shabnam'
        : fontFamily === 'Inter'
        ? 'Inter'
        : fontFamily === 'Playfair Display'
        ? 'Playfair Display'
        : 'JetBrains Mono',
  };
}

export function generateSystemPrompt(data: PromptData): string {
  const {
    name,
    type,
    style,
    welcomeMessage,
    phone,
    email,
    address,
    socialInstagram,
    socialTelegram,
    socialGithub,
    categories,
    visual,
  } = data;

  // Build style description
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

  // Build content prompt based on type
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

  const fontObj = getFontConfig(visual.fontFamily);

  // Generate random creative design cues to guarantee 100% unique layouts even for identical data inputs
  const layoutStyles = [
    "Use a striking modern split-screen hero layout where one side features rich bold typographic headlines and the other features an interactive, dynamic glass card with floating, micro-animating items.",
    "Structure the landing/hero container with an elegant asymmetric fluid grid, using custom CSS clip-paths or overlapping layers for a premium, non-standard layout architecture.",
    "Design an immersive full-screen hero section featuring a dark/light blurred ambient glowing background sphere that follows subtle keyframe animations, giving a high-end web app feel.",
    "Construct the hero with massive, oversized avant-garde display typography paired with a minimalistic clean structure, utilizing generous negative space and a staggered double-column introduction.",
    "Incorporate a modern Bento-grid inspired hero visual container with mini compartments, where each compartment houses an interactive micro-detail or a beautifully animated statistic."
  ];

  const visualAccents = [
    "Apply smooth interactive rotating card hover animations or subtle 3D lift transformations (using CSS perspectives or pure Tailwind transitions) on all main cards to elevate tactile feedback.",
    "Add elegant custom animated background grid lines or decorative geometric outline elements that gently fade or morph on hover, providing a polished custom-crafted aesthetic.",
    "Incorporate gorgeous floating glowing colored blobs/auroras in the backdrop (using absolute blur-3xl divs) that slowly pulse or drift using CSS keyframe animations.",
    "Implement sleek accent underline effects or border draw-lines on hover for all primary interactive elements, utilizing custom CSS transitions for a high-fidelity boutique look.",
    "Utilize sophisticated custom gradient masks or subtle glass border-lines (rgba-based) to separate sections, avoiding generic solid borders or basic horizontal dividers."
  ];

  const creativeAnimations = [
    "Include a custom-crafted text writing/revealing typing delay effect or staggered fade-in up animation for the main headline and subtext, using lightweight CSS animations.",
    "Incorporate elegant mouse-hover parallax-like drift on key floating interactive badges or badge labels, giving the interface a high-fidelity living response.",
    "Implement a smooth custom horizontal marquee/infinite scroll track for categories or highlights, moving at a slow elegant pace to introduce fresh dynamic motion.",
    "Design custom CSS pulsed radial wave ripples behind the primary action button to naturally draw the user's focus with an organic glowing visual heartbeat.",
    "Create a staggered cascade entry animation for cards, menu items, or product lists so that items enter the screen one by one with a refined micro-delay."
  ];

  const randomLayout = layoutStyles[Math.floor(Math.random() * layoutStyles.length)];
  const randomAccent = visualAccents[Math.floor(Math.random() * visualAccents.length)];
  const randomAnim = creativeAnimations[Math.floor(Math.random() * creativeAnimations.length)];
  const randomSeed = Math.floor(Math.random() * 1000000);

  return `You are a world-class principal front-end engineer and award-winning UI/UX designer.
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
14. STRICT UNIQUENESS GUARANTEE (RANDOM SEED: ${randomSeed}):
    To ensure this website is 100% unique, custom-made, and non-repetitive, you MUST implement a completely original, bespoke visual layout. Do NOT copy standard cookie-cutter layouts.
    - Specifically utilize this layout blueprint: ${randomLayout}
    - Embellish with this custom design accent: ${randomAccent}
    - Inject this micro-interaction/motion signature: ${randomAnim}
    - Generate a fresh, signature arrangement of components, sections, and grids that is uniquely tailored. Avoid generic structures. Every block must feel high-fidelity, polished, and architecturally distinct.

Make sure the output code is completely self-contained, with no external styling needed. Let's build a masterpiece!`;
}
