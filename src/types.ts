export type WebsiteType =
  | 'ecommerce'
  | 'corporate'
  | 'portfolio'
  | 'blog'
  | 'landing'
  | 'restaurant'
  | 'services';

export type DesignStyle =
  | 'glassmorphism'
  | 'neumorphism'
  | 'minimalist'
  | 'luxury'
  | 'brutalist'
  | 'bento'
  | 'gradient'
  | 'claymorphism'
  | 'memphis'
  | 'cyberpunk';

export type AIProvider = 'gemini_builtin' | 'gemini_custom' | 'openai' | 'anthropic' | 'custom_openai';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  products: Product[];
}

export interface VisualConfig {
  paletteName: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
}

export interface WebsiteData {
  // Step 1: Basic
  name: string;
  type: WebsiteType;
  style: DesignStyle;

  // Step 2: Products (ecommerce only)
  categories: ProductCategory[];

  // Step 3: Contact Info
  address: string;
  phone: string;
  email: string;
  socialGithub: string;
  socialInstagram: string;
  socialTelegram: string;
  welcomeMessage: string;

  // Step 4: Visual Identity
  visual: VisualConfig;

  // Step 5: AI Config
  aiProvider: AIProvider;
  apiKey: string;
  customEndpoint?: string;
  customModel?: string;
}

export interface DesignStyleDetail {
  id: DesignStyle;
  name: string;
  englishName: string;
  description: string;
  colors: string[];
  features: string[];
}
