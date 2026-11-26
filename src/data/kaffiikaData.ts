export type FeedCategory =
  | 'All'
  | 'Chicks'
  | 'Broilers'
  | 'Layers'
  | 'Piggery'
  | 'Dairy'
  | 'Fish'
  | 'Speciality Products';

export type PageRoute =
  | '/'
  | '/about'
  | '/products'
  | '/farming-guides'
  | '/calculator'
  | '/branches'
  | '/media-gallery'
  | '/contact'
  | '/admin'
  | '/privacy-policy'
  | '/terms'
  | '/delivery-policy';

export interface Product {
  id: number;
  name: string;
  code: string;
  category: Exclude<FeedCategory, 'All'>;
  units: string;
  weightKg: number;
  priceUgx: number;
  feedType: 'Concentrate' | 'Prestarter / Complete' | 'Extruded Fish Feed' | 'Supplement / Additive';
  brand: 'Koudijs' | 'Kaffiika';
  summary: string;
  targetStage: string;
  keySpec: string;
  inclusionOrDosage: string;
  benefits: string[];
  mixingTip?: string;
  imageUrl: string; // Exact extracted image URL from kaffiikafeeds.com
  featured?: boolean;
  stockStatus?: 'In Stock' | 'Low Stock' | 'Out of Stock';
  stockBags?: number;
}

export interface Branch {
  id: string;
  name: string;
  manager: string;
  phones: string[];
  region: 'Kampala Metro' | 'Wakiso & Central' | 'Mukono & Eastern' | 'Masaka & Western';
  districtOrArea: string;
  mapCoords: { x: number; y: number };
  isHeadquarters?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phones: string[];
  department: 'Executive Leadership' | 'Commercial & Operations' | 'Regional Sales Management';
  bio: string;
  photoUrl: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  farmType: string;
  location: string;
  productUsed: string;
  quote: string;
  highlightMetric: string;
  photoUrl: string;
}

export interface SpeciesGuide {
  id: string;
  species: string;
  navSlug: string;
  tagline: string;
  heroImage: string;
  intro: string;
  extraInstructionsTitle?: string;
  extraInstructionsSteps?: string[];
  stages: {
    title: string;
    period: string;
    description: string;
    recommendedProducts: string[];
    benefits: string[];
    targetBenchmark: string;
  }[];
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  author: string;
  category: string;
  summary: string;
  imageUrl: string;
  videoUrl?: string;
  location?: string;
  contacts?: string[];
  content: string[];
}

export interface CustomerOrder {
  id: string;
  reference: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  branchId: string;
  branchName: string;
  deliveryMode: 'Branch Pickup' | 'Farm Delivery';
  createdAt: string;
  status: 'Pending' | 'Processing' | 'Dispatched' | 'Completed';
  items: {
    productId: number;
    productName: string;
    productCode: string;
    units: string;
    quantity: number;
    unitPriceUgx: number;
  }[];
  totalBags: number;
  totalWeightKg: number;
  totalAmountUgx: number;
}

export const KAFFIIKA_ASSETS = {
  logo: 'https://kaffiikafeeds.com/public/assets/frontend/images/logo.png',
  koudijsLogo: 'https://kaffiikafeeds.com/public/assets/frontend/images/koudijs_logo.jpg',
  favicon: 'https://kaffiikafeeds.com/public/assets/frontend/images/favicon_32x32.png',
  breadcrumbBg: 'https://kaffiikafeeds.com/public/assets/frontend/images/breadcrumb-bg.jpg',
  parallaxBg: 'https://kaffiikafeeds.com/public/assets/frontend/images/parallax-img_2048x.jpg',
  testimonialBg: 'https://kaffiikafeeds.com/public/assets/frontend/images/testimonial-bg.jpg',
  accountIcon: 'https://kaffiikafeeds.com/public/assets/frontend/images/account.png',
  banners: [
    'https://kaffiikafeeds.com/public/assets/frontend/images/main-banner-1_2048x.jpg',
    'https://kaffiikafeeds.com/public/assets/frontend/images/main-banner-2_2048x.jpg',
    'https://kaffiikafeeds.com/public/assets/frontend/images/main-banner-3_2048x.jpg',
    'https://kaffiikafeeds.com/public/assets/frontend/images/main-banner-4_2048x.jpg',
    'https://kaffiikafeeds.com/public/assets/frontend/images/main-banner-5_2048x.jpg',
  ],
  productUploads: {
    layers: 'https://kaffiikafeeds.com/public/uploads/images/layers.jpg',
    broilers: 'https://kaffiikafeeds.com/public/uploads/images/broilers.jpg',
    default: 'https://kaffiikafeeds.com/public/uploads/images/default.jpg',
    knursemeal: 'https://kaffiikafeeds.com/public/uploads/images/pdt20230325105340773.jpg',
    cows: 'https://kaffiikafeeds.com/public/uploads/images/cows.jpg',
    tilapia: 'https://kaffiikafeeds.com/public/uploads/images/tilapia.jpg',
  },
  services: [
    'https://kaffiikafeeds.com/public/assets/frontend/images/service1.png',
    'https://kaffiikafeeds.com/public/assets/frontend/images/service2.png',
    'https://kaffiikafeeds.com/public/assets/frontend/images/service3.png',
    'https://kaffiikafeeds.com/public/assets/frontend/images/service4.png',
  ],
  payments: {
    mtn: 'https://kaffiikafeeds.com/public/assets/frontend/images/mtn.png',
    airtel: 'https://kaffiikafeeds.com/public/assets/frontend/images/airtel.png',
    visa: 'https://kaffiikafeeds.com/public/assets/frontend/images/visa.png',
    playStore: 'https://kaffiikafeeds.com/public/assets/frontend/images/play-store.png',
    appStore: 'https://kaffiikafeeds.com/public/assets/frontend/images/app-store.png',
  },
  gallery: [
    {
      id: 'gal-1',
      url: 'https://kaffiikafeeds.com/public/assets/frontend/images/gallery/one.jpg',
      title: 'Kaffiika Farmer Training & Workshop Session',
      category: 'Farmer Training',
    },
    {
      id: 'gal-2',
      url: 'https://kaffiikafeeds.com/public/assets/frontend/images/gallery/two.jpg',
      title: 'Poultry & Livestock Feed Formulation Advisory',
      category: 'Field Support',
    },
    {
      id: 'gal-3',
      url: 'https://kaffiikafeeds.com/public/assets/frontend/images/gallery/three.jpg',
      title: 'Koudijs × Kaffiika Technical Seminar',
      category: 'Partnership',
    },
    {
      id: 'gal-4',
      url: 'https://kaffiikafeeds.com/public/assets/frontend/images/gallery/four.jpg',
      title: 'Commercial Farm Visit & Ration Inspection',
      category: 'On-Farm Visit',
    },
    {
      id: 'gal-5',
      url: 'https://kaffiikafeeds.com/public/assets/frontend/images/gallery/five.jpg',
      title: 'Regional Branch Stock & Distribution Dispatch',
      category: 'Distribution',
    },
    {
      id: 'gal-6',
      url: 'https://kaffiikafeeds.com/public/assets/frontend/images/gallery/six.jpg',
      title: 'Ugandan Poultry & Piggery Producers Engagement',
      category: 'Community',
    },
    {
      id: 'gal-7',
      url: 'https://kaffiikafeeds.com/public/assets/frontend/images/gallery/seven.jpg',
      title: 'Kaffiika Animal Feeds Quality Assurance Team',
      category: 'Operations',
    },
  ],
  educationalVideos: [
    {
      id: 'vid-1',
      embedUrl: 'https://www.youtube.com/embed/TnuWApZVVTg',
      title: 'Koudijs & Kaffiika Animal Nutrition — Modern Livestock Feeding Practices',
      category: 'Poultry & Livestock Management',
      description:
        'Learn how high-efficiency concentrates and proper on-farm mixing improve feed conversion ratios and farm profitability.',
    },
    {
      id: 'vid-2',
      embedUrl: 'https://www.youtube.com/embed/nb8kNuO2z0o',
      title: 'Practical Guide to High-Yield Farming with Koudijs Concentrates',
      category: 'Technical Training Video',
      description:
        'Step-by-step nutritional principles for achieving peak production in layers, broilers, piggery, and fish farming.',
    },
  ],
};

export const COMPANY_INFO = {
  name: 'Kaffiika Animal Feeds',
  tagline: 'We Provide Customized Feeding Solutions',
  foundedYear: 2006,
  partnerBrand: 'Koudijs Animal Nutrition',
  headquarters: 'Kaffiika Animal Feeds Headoffice Mengo, Sentema Road, Kampala, Uganda',
  primaryPhone: '+256 755 247149',
  primaryPhoneClean: '256755247149',
  email: 'kaffiikanimalfeeds@gmail.com',
  mission:
    'TO BE THE MOST RESPECTED BRAND IN THE REGION PROVIDING THE MOST EFFECTIVE FEEDING SOLUTIONS AND RELIABLE TECHNICAL SUPPORT HENCE OFFERING VALUE FOR MONEY TO OUR CUSTOMERS.',
  vision:
    'TO OFFER THE MOST RELIABLE, CUSTOMIZED FEED SOLUTIONS IN THE REGION.',
  values:
    'TREAT CUSTOMERS, TEAM MEMBERS, PARTNERS AND SUPPLIERS WITH THE DIGNITY AND RESPECT WE ALL DESIRE.',
  story:
    'Kaffiika Animal Feeds has been in the Poultry and Animal Feeds business in Uganda and active poultry keeping since the year 2006. As the main suppliers of Koudijs products in Uganda, we provide customized feeding solutions and reliable technical support for layers, broilers, pigs, dairy cattle, and fish from our Kampala head office.',
};

// Exact product images mapped from https://kaffiikafeeds.com/
export const PRODUCTS: Product[] = [
  // ==================== CHICKS ====================
  {
    id: 1,
    name: 'KBPF Galdus',
    code: 'KBPF Galdus',
    category: 'Chicks',
    units: '25kg bag',
    weightKg: 25,
    priceUgx: 103000,
    feedType: 'Prestarter / Complete',
    brand: 'Koudijs',
    summary:
      'Highly nutritious 2.2mm micro-pellet prestarter for broiler chicks to stimulate vigorous early intestinal and skeletal development.',
    targetStage: 'Day-Old Broiler Chicks (Day 1 – Day 10)',
    keySpec: '2.2mm Micro-Pellet • Complete Prestarter',
    inclusionOrDosage: '100% Complete Feed (No mixing required)',
    benefits: [
      'Stimulates strong early development in the critical first week of life',
      'Easy to eat and digest for day-old chicks',
      'Higher weight, immunity, flock uniformity & lower FCR at slaughter weight',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.layers,
    featured: true,
    stockStatus: 'In Stock',
    stockBags: 420,
  },
  {
    id: 20,
    name: 'C1 (Crumble)',
    code: 'C1 (Crumble)',
    category: 'Chicks',
    units: '10kg bag',
    weightKg: 10,
    priceUgx: 60000,
    feedType: 'Prestarter / Complete',
    brand: 'Kaffiika',
    summary:
      'Fine uniform starter crumble formulated for rapid early intake, high digestibility, and uniform chick brooding performance.',
    targetStage: 'Chicks & Early Starter (Week 1 – Week 2)',
    keySpec: 'Fine Crumble • High Digestibility',
    inclusionOrDosage: '100% Complete Feed (Ad libitum)',
    benefits: [
      'Ideal particle size for small beaks to minimize feed wastage',
      'Boosts early gut health and chick survival rate',
      'Convenient 10kg pack for small-to-medium brooding batches',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.layers,
    stockStatus: 'In Stock',
    stockBags: 315,
  },
  {
    id: 39,
    name: 'Galdus Layer',
    code: 'Galdus Layer',
    category: 'Chicks',
    units: '25kg bag',
    weightKg: 25,
    priceUgx: 98000,
    feedType: 'Prestarter / Complete',
    brand: 'Koudijs',
    summary:
      'Specialized 2.2mm micro-pellet prestarter engineered for layer chicks to establish frame size and digestive capacity early.',
    targetStage: 'Day-Old Layer Chicks (Day 1 – Week 2)',
    keySpec: '2.2mm Micro-Pellet • Layer Prestarter',
    inclusionOrDosage: '100% Complete Feed (No mixing required)',
    benefits: [
      'Builds uniform pullet frame and strong immune foundation',
      'Purely natural characteristics for optimal nutrient absorption',
      'Prepares layer chicks for high peak egg production (>95%)',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.layers,
    featured: true,
    stockStatus: 'In Stock',
    stockBags: 290,
  },
  {
    id: 47,
    name: 'UZIMA',
    code: 'UZIMA',
    category: 'Chicks',
    units: '50kg bag',
    weightKg: 50,
    priceUgx: 195000,
    feedType: 'Prestarter / Complete',
    brand: 'Kaffiika',
    summary:
      'Commercial 50kg high-vitality chick starter ration fortified with essential vitamins, amino acids, and trace minerals.',
    targetStage: 'Growing Chicks (Week 1 – Week 4)',
    keySpec: '50kg Commercial Pack • Complete Starter',
    inclusionOrDosage: '100% Complete Ration',
    benefits: [
      'Economical 50kg bag for commercial poultry brooding houses',
      'Promotes rapid feathering, skeletal strength, and flock vitality',
      'Balanced energy-to-protein ratio for East African climates',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.layers,
    stockStatus: 'In Stock',
    stockBags: 185,
  },

  // ==================== BROILERS ====================
  {
    id: 2,
    name: 'KBC 35/30',
    code: 'KBC 35/30',
    category: 'Broilers',
    units: '50kg bag',
    weightKg: 50,
    priceUgx: 212000,
    feedType: 'Concentrate',
    brand: 'Koudijs',
    summary:
      'Flagship Koudijs Broiler Concentrate (35% Starter / 30% Finisher) enabling growth rates above 55g/day with local maize.',
    targetStage: 'Broiler Starter (35%) & Finisher (30%)',
    keySpec: '35% / 30% Inclusion Concentrate',
    inclusionOrDosage: 'Mix 35% in Starter or 30% in Finisher with Maize & Bran',
    benefits: [
      'Supports modern broiler growth >55 grams per day under optimal conditions',
      'High feed efficiency and low Feed Conversion Ratio (FCR)',
      'Better intestinal health, high liveability, and superior meat quality',
    ],
    mixingTip: 'Starter (100kg): 35kg KBC 35/30 + 55kg Broken Maize + 10kg Maize Bran.',
    imageUrl: KAFFIIKA_ASSETS.productUploads.broilers,
    featured: true,
    stockStatus: 'In Stock',
    stockBags: 540,
  },
  {
    id: 3,
    name: 'Koudijs Broiler Concentrate 10',
    code: 'KBC10',
    category: 'Broilers',
    units: '50kg bag',
    weightKg: 50,
    priceUgx: 196000,
    feedType: 'Concentrate',
    brand: 'Koudijs',
    summary:
      'Concentrated 10% inclusion broiler core for commercial farms mixing their own soya bean meal and maize rations.',
    targetStage: 'Broiler Grower & Finisher',
    keySpec: '10% Inclusion Core Concentrate',
    inclusionOrDosage: '10% Concentrate + Soya + Maize + Bran',
    benefits: [
      'Lowers overall feed production cost for farms with access to Soya',
      'Contains essential digestible amino acids, enzymes, and vitamins',
      'Maximizes carcass yield and breast meat deposition',
    ],
    mixingTip: 'Mix 10kg KBC10 + 25kg Soya + 55kg Maize + 10kg Maize Bran per 100kg feed.',
    imageUrl: KAFFIIKA_ASSETS.productUploads.broilers,
    stockStatus: 'In Stock',
    stockBags: 310,
  },
  {
    id: 16,
    name: 'Soya',
    code: 'SOYA',
    category: 'Broilers',
    units: '50kg bag',
    weightKg: 50,
    priceUgx: 190000,
    feedType: 'Supplement / Additive',
    brand: 'Kaffiika',
    summary:
      'Quality-tested, properly toasted high-protein Soya meal for balancing custom poultry and piggery concentrate rations.',
    targetStage: 'All Poultry & Livestock Custom Rations',
    keySpec: '44–48% Crude Protein • Toasted Soya',
    inclusionOrDosage: '15% – 28% depending on concentrate inclusion rate',
    benefits: [
      'Low urease activity — heat-treated to eliminate trypsin inhibitors',
      'Rich source of natural Lysine and digestible plant protein',
      'Pairs seamlessly with KBC 10, KLC 10, KLC 5, and KPC 10/7',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.broilers,
    stockStatus: 'In Stock',
    stockBags: 620,
  },
  {
    id: 31,
    name: 'Koudijs Broiler PS concentrate 20%',
    code: 'KBPS 20%',
    category: 'Broilers',
    units: '50kg bag',
    weightKg: 50,
    priceUgx: 195000,
    feedType: 'Concentrate',
    brand: 'Koudijs',
    summary:
      '20% inclusion Koudijs Broiler Parent Stock & high-performance concentrate for optimal fertility, hatchability, and growth.',
    targetStage: 'Broiler Parent Stock & High-Density Broilers',
    keySpec: '20% Inclusion Concentrate',
    inclusionOrDosage: '20% Concentrate + Soya + Maize + Bran',
    benefits: [
      'Formulated for parent stock longevity, egg fertility, and chick quality',
      'Optimal mineral and vitamin fortification',
      'Consistent mixing accuracy at 20% inclusion rate',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.broilers,
    stockStatus: 'In Stock',
    stockBags: 175,
  },

  // ==================== LAYERS ====================
  {
    id: 4,
    name: 'KLC 20',
    code: 'KLC 20',
    category: 'Layers',
    units: '50kg bag',
    weightKg: 50,
    priceUgx: 213000,
    feedType: 'Concentrate',
    brand: 'Koudijs',
    summary:
      'Uganda’s trusted Koudijs Layer Concentrate 20% designed for >95% peak lay and over 310 eggs per hen across a 76-week cycle.',
    targetStage: 'Laying Hens (18 Weeks – End of Lay)',
    keySpec: '20% Inclusion Layer Concentrate',
    inclusionOrDosage: '20% KLC 20 + Maize + Maize Bran + Limestone',
    benefits: [
      'Supports >95% peak production and >310 eggs per hen over 76 weeks',
      'Better egg quality, deep yolk color, and strong eggshells',
      'Sustainable and persistent laying curve without sudden drops',
    ],
    mixingTip: 'Standard 100kg Layer Mix: 20kg KLC 20 + 45kg Maize + 27kg Maize Bran + 8kg Limestone.',
    imageUrl: KAFFIIKA_ASSETS.productUploads.layers,
    featured: true,
    stockStatus: 'In Stock',
    stockBags: 780,
  },
  {
    id: 5,
    name: 'KLC 5',
    code: 'KLC 5',
    category: 'Layers',
    units: '50kg bag',
    weightKg: 50,
    priceUgx: 213000,
    feedType: 'Concentrate',
    brand: 'Koudijs',
    summary:
      'High-density 5% Koudijs Layer Concentrate for commercial egg producers formulating with their own Soya, Maize, and Limestone.',
    targetStage: 'Rearing Pullets & Laying Hens',
    keySpec: '5% Low-Inclusion Concentrate',
    inclusionOrDosage: '5% KLC 5 + Soya + Maize + Bran + Limestone',
    benefits: [
      'Maximum cost efficiency for medium and large commercial layer farms',
      'Delivers complete Dutch vitamin, enzyme, and amino acid package',
      'Higher revenue due to optimal technical results and low feed cost/egg',
    ],
    mixingTip: '100kg Layer Mix: 5kg KLC 5 + 18kg Soya + 45kg Maize + 24kg Maize Bran + 8kg Limestone.',
    imageUrl: KAFFIIKA_ASSETS.productUploads.layers,
    stockStatus: 'In Stock',
    stockBags: 340,
  },
  {
    id: 6,
    name: 'KLC 10',
    code: 'KLC 10',
    category: 'Layers',
    units: '50kg bag',
    weightKg: 50,
    priceUgx: 213000,
    feedType: 'Concentrate',
    brand: 'Koudijs',
    summary:
      'Balanced 10% Koudijs Layer Concentrate combining ease of on-farm mixing with reduced raw material costs.',
    targetStage: 'Grower Pullets & Commercial Layers',
    keySpec: '10% Inclusion Layer Concentrate',
    inclusionOrDosage: '10% KLC 10 + Soya + Maize + Bran + Limestone',
    benefits: [
      'Easy 10% mixing ratio minimizes on-farm weighing errors',
      'Promotes persistent egg weight and shell thickness',
      'Contains phytase enzymes for superior phosphorus utilization',
    ],
    mixingTip: '100kg Layer Mix: 10kg KLC 10 + 12kg Soya + 45kg Maize + 25kg Maize Bran + 8kg Limestone.',
    imageUrl: KAFFIIKA_ASSETS.productUploads.layers,
    stockStatus: 'In Stock',
    stockBags: 490,
  },
  {
    id: 30,
    name: 'KLPF Galdus Layer',
    code: 'KLPF Galdus Layer',
    category: 'Layers',
    units: '25kg bag',
    weightKg: 25,
    priceUgx: 97000,
    feedType: 'Prestarter / Complete',
    brand: 'Koudijs',
    summary:
      'Complete Koudijs Layer Prestarter & Phase Feed ensuring uniform pullet body weight before transition to grower mash.',
    targetStage: 'Layer Chicks & Early Pullets',
    keySpec: 'Complete Micro-Pellet • 25kg Bag',
    inclusionOrDosage: '100% Complete Feed',
    benefits: [
      'Prevents selective feeding in young layer flocks',
      'High uniformity (>85%) at point of lay',
      'Reduces chick mortality and supports digestive tract maturity',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.layers,
    stockStatus: 'In Stock',
    stockBags: 265,
  },

  // ==================== PIGGERY ====================
  {
    id: 7,
    name: 'Koudijs Pig concentrate 20/10 %',
    code: 'KPC 20/15',
    category: 'Piggery',
    units: '50kg bag',
    weightKg: 50,
    priceUgx: 211000,
    feedType: 'Concentrate',
    brand: 'Koudijs',
    summary:
      'Versatile Koudijs Pig Concentrate for growing and fattening pigs, delivering rapid daily weight gain and lean meat quality.',
    targetStage: 'Grower (20%) & Finisher/Fattener (15–10%) Pigs',
    keySpec: '20% / 15% / 10% Flexible Inclusion',
    inclusionOrDosage: 'Mix 15–20% for Growers, 10–15% for Finishers',
    benefits: [
      'Optimal economic result with low feed intake per kg of pork',
      'Favourable daily growth rate and high carcass lean percentage',
      'Tailored to local Ugandan maize bran and broken maize rations',
    ],
    mixingTip: 'Grower 100kg Mix: 20kg KPC 20/15 + 45kg Maize + 35kg Maize Bran.',
    imageUrl: KAFFIIKA_ASSETS.productUploads.default,
    featured: true,
    stockStatus: 'In Stock',
    stockBags: 410,
  },
  {
    id: 32,
    name: 'Koudijs Romelko',
    code: 'Koudijs Romelko',
    category: 'Piggery',
    units: '50kg bag',
    weightKg: 50,
    priceUgx: 200000,
    feedType: 'Supplement / Additive',
    brand: 'Koudijs',
    summary:
      'Palatable dairy/whey-enriched supplement for piglets and lactating sows to stimulate feed intake and milk production.',
    targetStage: 'Suckling/Weaned Piglets & Lactating Sows',
    keySpec: 'Dairy-Enriched Palatability Booster',
    inclusionOrDosage: '5% – 15% in creep and lactation rations',
    benefits: [
      'Rich in lactose and digestible milk proteins for smooth weaning',
      'Prevents post-weaning growth check and diarrhea',
      'Stimulates higher feed intake in nursing sows during warm weather',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.default,
    stockStatus: 'In Stock',
    stockBags: 190,
  },
  {
    id: 41,
    name: 'KPLC20',
    code: 'KPLC20',
    category: 'Piggery',
    units: '20kg bag',
    weightKg: 20,
    priceUgx: 106000,
    feedType: 'Concentrate',
    brand: 'Koudijs',
    summary:
      'Customer-favorite Koudijs Piglet Concentrate in a convenient 20kg bag for healthy, fast-growing weaned piglets.',
    targetStage: 'Weaned & Starter Piglets (8kg – 25kg BW)',
    keySpec: 'Piglet Starter Concentrate • 20kg Bag',
    inclusionOrDosage: '25% – 30% inclusion with Maize & Bran',
    benefits: [
      'Highly digestible proteins and organic acids for gut health',
      'Higher feed intake and uniform litter weights after weaning',
      'Praised by Ugandan pig farmers for transforming piglet vitality',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.default,
    featured: true,
    stockStatus: 'In Stock',
    stockBags: 520,
  },
  {
    id: 42,
    name: 'KPLC50',
    code: 'KPLC50',
    category: 'Piggery',
    units: '50kg bag',
    weightKg: 50,
    priceUgx: 280000,
    feedType: 'Concentrate',
    brand: 'Koudijs',
    summary:
      'Commercial 50kg pack of Koudijs Piglet Concentrate for medium and large piggery farms rearing multiple litters.',
    targetStage: 'Weaned & Starter Piglets (Commercial Herds)',
    keySpec: 'Piglet Starter Concentrate • 50kg Bag',
    inclusionOrDosage: '25% – 30% inclusion with Maize & Bran',
    benefits: [
      'Economical bulk 50kg unit for multi-sow commercial piggeries',
      'Accelerates transition from sow milk to solid cereal rations',
      'Maximizes survival and 60-day piglet target weights',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.default,
    stockStatus: 'In Stock',
    stockBags: 210,
  },
  {
    id: 44,
    name: 'KPSC 20/22',
    code: 'KPSC 20/22',
    category: 'Piggery',
    units: '50kg bag',
    weightKg: 50,
    priceUgx: 218000,
    feedType: 'Concentrate',
    brand: 'Koudijs',
    summary:
      'Specialized Koudijs Pig Sow Concentrate (20% Gestation / 22% Lactation) for larger litters and abundant sow milk.',
    targetStage: 'Pregnant (Gestating) & Nursing (Lactating) Sows',
    keySpec: '20% Gestation / 22% Lactation Sow Concentrate',
    inclusionOrDosage: '20% in Gestation ration; 22% in Lactation ration',
    benefits: [
      'More weaned piglets per sow per year',
      'Optimal sow body condition development and rapid return to estrus',
      'Higher milk production for heavier weaning weights',
    ],
    mixingTip: 'Lactation 100kg Mix: 22kg KPSC 20/22 + 48kg Maize + 30kg Maize Bran.',
    imageUrl: KAFFIIKA_ASSETS.productUploads.default,
    stockStatus: 'In Stock',
    stockBags: 275,
  },
  {
    id: 45,
    name: 'KPC 30/25',
    code: 'KPC 30/25',
    category: 'Piggery',
    units: '50kg bag',
    weightKg: 50,
    priceUgx: 209000,
    feedType: 'Concentrate',
    brand: 'Koudijs',
    summary:
      'All-in-one Koudijs Pig Concentrate (30% Starter / 25% Grower-Fattener) requiring zero extra soya meal on the farm.',
    targetStage: 'Starter (30%) & Grower/Fattener (25%) Pigs',
    keySpec: '30% / 25% Complete Protein Concentrate',
    inclusionOrDosage: '30% Starter or 25% Grower/Fattener + Maize & Bran only',
    benefits: [
      'Simplifies on-farm mixing — just add Maize and Maize Bran',
      'Guaranteed amino acid profile for fast muscle deposition',
      'Ideal price-to-quality ratio for commercial pork producers',
    ],
    mixingTip: 'Grower 100kg Mix: 25kg KPC 30/25 + 45kg Broken Maize + 30kg Maize Bran.',
    imageUrl: KAFFIIKA_ASSETS.productUploads.default,
    stockStatus: 'In Stock',
    stockBags: 380,
  },
  {
    id: 48,
    name: 'Koudijs Pig concentrate 10/7, 5/5',
    code: 'KPC 10/7,5/5',
    category: 'Piggery',
    units: '50kg bag',
    weightKg: 50,
    priceUgx: 176000,
    feedType: 'Concentrate',
    brand: 'Koudijs',
    summary:
      'Low-inclusion Koudijs Pig Concentrate (10% / 7.5% / 5%) for farmers combining their own Soya meal and cereal by-products.',
    targetStage: 'Grower, Finisher & Breeding Pigs',
    keySpec: '10% / 7.5% / 5% Low-Inclusion Premix Concentrate',
    inclusionOrDosage: '5% – 10% Concentrate + Soya + Maize + Bran',
    benefits: [
      'Lowest concentrate cost per ton of finished pig feed',
      'Provides essential lysine, methionine, vitamins, and minerals',
      'Prevents mineral deficiencies and leg weakness in fast-growing pigs',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.default,
    stockStatus: 'In Stock',
    stockBags: 230,
  },
  {
    id: 51,
    name: 'Knursemeal',
    code: 'Knursemeal',
    category: 'Piggery',
    units: '20kg bag',
    weightKg: 20,
    priceUgx: 198000,
    feedType: 'Prestarter / Complete',
    brand: 'Koudijs',
    summary:
      'Premium Koudijs Piglet Nursing & Creep Meal engineered for early enzymatic training and stress-free weaning.',
    targetStage: 'Suckling Piglets (Day 5 to 10 Days Post-Weaning)',
    keySpec: 'Complete Piglet Nursing Creep Meal • 20kg',
    inclusionOrDosage: '100% Ready-to-Feed Creep Ration',
    benefits: [
      'Ultra-palatable milk-aroma formula encourages early nibbling from Day 5',
      'Trains piglet digestive enzymes before weaning day',
      'Produces heavier, healthier piglets with minimal post-weaning slump',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.knursemeal,
    featured: true,
    stockStatus: 'In Stock',
    stockBags: 165,
  },

  // ==================== DAIRY ====================
  {
    id: 9,
    name: 'KMR',
    code: 'KMR',
    category: 'Dairy',
    units: '25kg bag',
    weightKg: 25,
    priceUgx: 260000,
    feedType: 'Prestarter / Complete',
    brand: 'Koudijs',
    summary:
      'Koudijs Milk Replacer (KMR / Koudalac) for dairy calves — dissolves smoothly in warm water so farmers can sell more fresh cow milk.',
    targetStage: 'Dairy Calves (After Colostrum – Weaning)',
    keySpec: 'Instant Calf Milk Replacer • 25kg Bag',
    inclusionOrDosage: 'Mix 125g–150g per 1 Liter of warm water (42–50°C)',
    benefits: [
      'Allows dairy farmers to market more whole milk while raising strong heifers',
      'Fortified with immunoglobulins, vitamins, and gut-protective probiotics',
      'Prevents calf scours and promotes early rumen development',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.cows,
    featured: true,
    stockStatus: 'In Stock',
    stockBags: 140,
  },
  {
    id: 35,
    name: 'Kdiary MB',
    code: 'Kdiary MB',
    category: 'Dairy',
    units: '10kg bag',
    weightKg: 10,
    priceUgx: 36000,
    feedType: 'Supplement / Additive',
    brand: 'Koudijs',
    summary:
      'Koudijs Dairy Mineral Balancer (10kg) supplying essential macro and trace minerals for fertility, hoof health, and milk yield.',
    targetStage: 'Lactating Cows, Dry Cows & Heifers',
    keySpec: 'Dairy Mineral & Vitamin Balancer • 10kg',
    inclusionOrDosage: '100g – 150g per cow per day or 2–3% in dairy meal',
    benefits: [
      'Prevents milk fever, silent heat, and retained placenta',
      'Improves conception rates and reduces calving intervals',
      'Strengthens hooves and boosts somatic cell immunity',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.cows,
    stockStatus: 'In Stock',
    stockBags: 320,
  },
  {
    id: 8,
    name: 'Koudijs Dairy Concentrate',
    code: 'K Diary C',
    category: 'Dairy',
    units: '25kg bag',
    weightKg: 25,
    priceUgx: 73000,
    feedType: 'Concentrate',
    brand: 'Koudijs',
    summary:
      'High-yield Koudijs Dairy Concentrate formulated to boost daily milk liters, butterfat content, and cow body condition.',
    targetStage: 'High-Yielding Lactating Dairy Cows',
    keySpec: '25kg Dairy Concentrate',
    inclusionOrDosage: 'Mix 25–30% with Maize Bran & Cotton/Sunflower Cake',
    benefits: [
      'Increases daily milk production and lactation persistence',
      'Balances rumen-degradable and bypass protein for high-yielding cows',
      'Buffers rumen pH to prevent sub-acute ruminal acidosis',
    ],
    mixingTip: '100kg Dairy Meal: 25kg K Diary C + 45kg Maize Bran + 30kg Broken Maize/Cake.',
    imageUrl: KAFFIIKA_ASSETS.productUploads.cows,
    featured: true,
    stockStatus: 'In Stock',
    stockBags: 295,
  },

  // ==================== SPECIALITY PRODUCTS ====================
  {
    id: 37,
    name: 'Koudijs Stress Mix',
    code: 'K Stress Mix',
    category: 'Speciality Products',
    units: '20kg bag',
    weightKg: 20,
    priceUgx: 141000,
    feedType: 'Supplement / Additive',
    brand: 'Koudijs',
    summary:
      'Concentrated vitamin, amino acid, and electrolyte anti-stress pack for poultry and livestock during heat, vaccination, or transport.',
    targetStage: 'All Poultry, Pigs & Calves During Stress Events',
    keySpec: 'Anti-Stress Vitamin & Electrolyte Mix • 20kg',
    inclusionOrDosage: 'Include in feed or water before/after vaccination & heat waves',
    benefits: [
      'Sustains feed intake and egg production during hot weather',
      'Accelerates recovery after vaccination, beak trimming, or relocation',
      'Boosts immune response and reduces stress-induced mortality',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.layers,
    stockStatus: 'In Stock',
    stockBags: 150,
  },
  {
    id: 38,
    name: 'Limestones',
    code: 'Limestones',
    category: 'Speciality Products',
    units: '50kg bag',
    weightKg: 50,
    priceUgx: 23000,
    feedType: 'Supplement / Additive',
    brand: 'Kaffiika',
    summary:
      'High-purity feed-grade calcium carbonate grit/powder essential for strong eggshell formation and skeletal integrity.',
    targetStage: 'Laying Hens, Breeders, Pigs & Dairy Cattle',
    keySpec: '36–38% Pure Calcium • 50kg Bag',
    inclusionOrDosage: '7% – 9% in Layer rations; 1% – 2% in Broiler/Pig rations',
    benefits: [
      'Eliminates soft-shelled and cracked eggs in laying flocks',
      'Slow-release calcium availability throughout the night when shells form',
      'Clean, screened quality free from harmful heavy metals',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.broilers,
    stockStatus: 'In Stock',
    stockBags: 890,
  },
  {
    id: 40,
    name: 'Koudijs Aflatox-binder',
    code: 'Koudatox Afla',
    category: 'Speciality Products',
    units: '25kg bag',
    weightKg: 25,
    priceUgx: 114000,
    feedType: 'Supplement / Additive',
    brand: 'Koudijs',
    summary:
      'Broad-spectrum mycotoxin and aflatoxin binder protecting poultry, pigs, and dairy cows from contaminated maize and bran.',
    targetStage: 'All Livestock & Poultry Rations',
    keySpec: 'Mycotoxin & Aflatoxin Binder • 25kg Bag',
    inclusionOrDosage: '1kg – 2.5kg per Ton of mixed feed (0.1% – 0.25%)',
    benefits: [
      'Binds aflatoxins in the digestive tract without stripping vitamins',
      'Protects liver function, immunity, and egg/milk safety',
      'Essential safeguard during humid grain storage seasons in Uganda',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.layers,
    featured: true,
    stockStatus: 'In Stock',
    stockBags: 240,
  },

  // ==================== FISH (AQUACULTURE) ====================
  {
    id: 19,
    name: 'Fish Feed, 0.5mm/40% CP',
    code: 'K0 (0.5mm)',
    category: 'Fish',
    units: '10kg bag',
    weightKg: 10,
    priceUgx: 61000,
    feedType: 'Extruded Fish Feed',
    brand: 'Koudijs',
    summary:
      'High-protein 40% Crude Protein 0.5mm micro-crumble starter for early Tilapia and Catfish fry in hatcheries and nursery ponds.',
    targetStage: 'Early Swim-Up Fry & Nursery (1g – 5g)',
    keySpec: '0.5mm Granule • 40% Crude Protein',
    inclusionOrDosage: '100% Complete Feed (6–8 feedings/day)',
    benefits: [
      '40% highly digestible protein for rapid fry survival and uniform growth',
      'Water-stable micro-granules keep nursery pond water clean',
      'Fortified with Vitamin C and immunostimulants',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.tilapia,
    stockStatus: 'In Stock',
    stockBags: 180,
  },
  {
    id: 10,
    name: 'Fish Feed, 0.8mm/40% CP',
    code: 'K1 (0.8mm)',
    category: 'Fish',
    units: '10kg bag',
    weightKg: 10,
    priceUgx: 60000,
    feedType: 'Extruded Fish Feed',
    brand: 'Koudijs',
    summary:
      '40% Crude Protein 0.8mm starter feed engineered for fingerling transition with high buoyancy and nutrient density.',
    targetStage: 'Fry to Fingerlings (5g – 15g)',
    keySpec: '0.8mm Pellet • 40% Crude Protein',
    inclusionOrDosage: '100% Complete Feed (4–6 feedings/day)',
    benefits: [
      'Uniform 0.8mm particle size minimizes size variation and cannibalism',
      'High protein digestibility for low ammonia excretion',
      'Accelerates fingerling readiness for cage or pond stocking',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.tilapia,
    featured: true,
    stockStatus: 'In Stock',
    stockBags: 260,
  },
  {
    id: 46,
    name: 'K1 (0.8 -1.2mm)',
    code: 'K1 (0.8 -1.2mm)',
    category: 'Fish',
    units: '10kg bag',
    weightKg: 10,
    priceUgx: 60000,
    feedType: 'Extruded Fish Feed',
    brand: 'Koudijs',
    summary:
      'Graded 0.8–1.2mm starter pellet bridging nursery fry to robust fingerlings with 40% crude protein.',
    targetStage: 'Fingerlings (10g – 25g)',
    keySpec: '0.8–1.2mm Pellet • 40% CP',
    inclusionOrDosage: '100% Complete Extruded Feed',
    benefits: [
      'Smooth transition between micro-crumbles and 1.5mm floating pellets',
      'Excellent water stability for cage and earthen pond culture',
      'Promotes strong skeletal development in young fingerlings',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.tilapia,
    stockStatus: 'In Stock',
    stockBags: 195,
  },
  {
    id: 36,
    name: 'K3 (1mm)',
    code: 'K3 (1mm)',
    category: 'Fish',
    units: '10kg bag',
    weightKg: 10,
    priceUgx: 56000,
    feedType: 'Extruded Fish Feed',
    brand: 'Koudijs',
    summary:
      'Precision 1.0mm floating starter pellet for growing fingerlings in ponds, tanks, and Lake Victoria cages.',
    targetStage: 'Fingerlings (15g – 35g)',
    keySpec: '1.0mm Floating Pellet • 10kg Bag',
    inclusionOrDosage: '100% Complete Floating Feed',
    benefits: [
      '100% floating extrusion lets farmers observe feeding vigor directly',
      'Low FCR and minimal pond bottom sludge accumulation',
      'High survival rate during post-stocking adaptation',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.tilapia,
    stockStatus: 'In Stock',
    stockBags: 210,
  },
  {
    id: 11,
    name: 'Fish Feed, 1.5mm/40% CP',
    code: 'KT2 (1.5m)',
    category: 'Fish',
    units: '20kg bag',
    weightKg: 20,
    priceUgx: 106000,
    feedType: 'Extruded Fish Feed',
    brand: 'Koudijs',
    summary:
      'High-energy 40% CP 1.5mm floating pellet (KT2) for juvenile Tilapia and Catfish entering rapid growth phases.',
    targetStage: 'Juveniles / Post-Fingerlings (30g – 80g)',
    keySpec: '1.5mm Floating Pellet • 40% Crude Protein',
    inclusionOrDosage: '100% Complete Floating Feed (20kg bag)',
    benefits: [
      'Maintains 40% CP to maximize early muscle frame development',
      'Superior floatability for accurate feeding in cages and ponds',
      'Reduces grow-out cycle duration by 2–3 weeks',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.tilapia,
    stockStatus: 'In Stock',
    stockBags: 240,
  },
  {
    id: 12,
    name: 'Fish Feed, 2.0mm/35% CP',
    code: 'K4 (2mm)',
    category: 'Fish',
    units: '20kg bag',
    weightKg: 20,
    priceUgx: 100000,
    feedType: 'Extruded Fish Feed',
    brand: 'Koudijs',
    summary:
      '2.0mm extruded floating grower feed with 35% Crude Protein for vigorous juvenile-to-grower Tilapia performance.',
    targetStage: 'Early Grower Fish (75g – 180g)',
    keySpec: '2.0mm Floating Pellet • 35% Crude Protein',
    inclusionOrDosage: '100% Complete Floating Feed (3–4 feedings/day)',
    benefits: [
      '35% Crude Protein perfectly matched to early grower metabolic needs',
      'High digestibility and stable water quality',
      'Strong FCR performance in both ponds and cages',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.tilapia,
    featured: true,
    stockStatus: 'In Stock',
    stockBags: 330,
  },
  {
    id: 13,
    name: 'Fish Feed, 3.0mm/30% CP',
    code: 'K5 (3mm)',
    category: 'Fish',
    units: '20kg bag',
    weightKg: 20,
    priceUgx: 94000,
    feedType: 'Extruded Fish Feed',
    brand: 'Koudijs',
    summary:
      '3.0mm floating grower ration with 30% Crude Protein for steady mid-cycle biomass gain in Tilapia and Catfish.',
    targetStage: 'Mid-Grower Fish (180g – 350g)',
    keySpec: '3.0mm Floating Pellet • 30% Crude Protein',
    inclusionOrDosage: '100% Complete Floating Feed (2–3 feedings/day)',
    benefits: [
      'Balanced protein-to-energy ratio prevents excess visceral fat',
      'Durable 3mm floating pellet resists crumbling during transport',
      'Cost-effective biomass conversion during main grow-out stage',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.tilapia,
    stockStatus: 'In Stock',
    stockBags: 390,
  },
  {
    id: 14,
    name: 'Fish Feed, 4.0mm/27% CP',
    code: 'KF6',
    category: 'Fish',
    units: '20kg bag',
    weightKg: 20,
    priceUgx: 68000,
    feedType: 'Extruded Fish Feed',
    brand: 'Kaffiika',
    summary:
      'Economical 4.0mm 27% CP finisher feed (KF6) designed for table-size Tilapia and Catfish finishing.',
    targetStage: 'Finisher Fish (350g – Harvest)',
    keySpec: '4.0mm Pellet • 27% Crude Protein',
    inclusionOrDosage: '100% Complete Finisher Feed',
    benefits: [
      'Highly competitive UGX 68,000 price per 20kg bag lowers harvest cost',
      '27% CP sustains rapid weight gain to 500g–1kg market weight',
      'Produces firm, high-quality fish fillets',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.tilapia,
    stockStatus: 'In Stock',
    stockBags: 450,
  },
  {
    id: 15,
    name: 'Fish Feed, 4.0mm/25% CP',
    code: 'K6 (4mm)',
    category: 'Fish',
    units: '20kg bag',
    weightKg: 20,
    priceUgx: 93000,
    feedType: 'Extruded Fish Feed',
    brand: 'Koudijs',
    summary:
      'Koudijs K6 4.0mm extruded floating finisher feed (25% CP) for commercial cage and pond Tilapia operations.',
    targetStage: 'Finisher Tilapia (350g – 800g+)',
    keySpec: '4.0mm Floating Pellet • 25% Crude Protein',
    inclusionOrDosage: '100% Complete Extruded Floating Feed',
    benefits: [
      'Precision Dutch extrusion guarantees >98% floatability',
      'Optimized digestible energy for heavy harvest weights',
      'Clean feeding with minimal dust or fines in the bag',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.tilapia,
    stockStatus: 'In Stock',
    stockBags: 310,
  },
  {
    id: 34,
    name: 'K7 (6mm)',
    code: 'K7 (6mm)',
    category: 'Fish',
    units: '20kg bag',
    weightKg: 20,
    priceUgx: 91000,
    feedType: 'Extruded Fish Feed',
    brand: 'Koudijs',
    summary:
      'Large 6.0mm floating pellet (K7) for jumbo Tilapia, broodstock, and large commercial Catfish.',
    targetStage: 'Jumbo Finisher & Broodstock (>600g)',
    keySpec: '6.0mm Floating Pellet • 20kg Bag',
    inclusionOrDosage: '100% Complete Floating Feed',
    benefits: [
      'Large 6mm pellet reduces energy spent by big fish during feeding',
      'Supports broodstock conditioning and egg quality',
      'High water stability and zero leaching',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.tilapia,
    stockStatus: 'In Stock',
    stockBags: 170,
  },
  {
    id: 21,
    name: 'C2',
    code: 'C2 (1mm)',
    category: 'Fish',
    units: '10kg bag',
    weightKg: 10,
    priceUgx: 59000,
    feedType: 'Extruded Fish Feed',
    brand: 'Kaffiika',
    summary:
      'Specialized 1.0mm Catfish & aquaculture starter feed (C2) formulated for fast early growth and minimal cannibalism.',
    targetStage: 'Catfish & Tilapia Fingerlings (1.0mm Stage)',
    keySpec: '1.0mm Extruded Pellet • 10kg Bag',
    inclusionOrDosage: '100% Complete Feed',
    benefits: [
      'High attractability for aggressive, uniform fingerling feeding',
      'Reduces shooter/jumper size disparity in catfish tanks',
      'High crude protein and essential fatty acids',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.tilapia,
    stockStatus: 'In Stock',
    stockBags: 210,
  },
  {
    id: 22,
    name: 'C3',
    code: 'C3 (1.5mm)',
    category: 'Fish',
    units: '20kg bag',
    weightKg: 20,
    priceUgx: 105000,
    feedType: 'Extruded Fish Feed',
    brand: 'Kaffiika',
    summary:
      '1.5mm extruded aquaculture pellet (C3) in a 20kg commercial bag for post-fingerlings and early juveniles.',
    targetStage: 'Post-Fingerlings (1.5mm Stage)',
    keySpec: '1.5mm Extruded Pellet • 20kg Bag',
    inclusionOrDosage: '100% Complete Extruded Feed',
    benefits: [
      'Rapid daily growth rate and high feed conversion efficiency',
      'Ideal buoyancy and water stability for intensive tanks and ponds',
      'Fortified with amino acids for strong skeletal growth',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.tilapia,
    stockStatus: 'In Stock',
    stockBags: 195,
  },
  {
    id: 23,
    name: 'C4',
    code: 'C4 (2mm)',
    category: 'Fish',
    units: '20kg bag',
    weightKg: 20,
    priceUgx: 101000,
    feedType: 'Extruded Fish Feed',
    brand: 'Kaffiika',
    summary:
      '2.0mm extruded grower pellet (C4) delivering high protein and palatability for growing Catfish and Tilapia.',
    targetStage: 'Juvenile Grower (2.0mm Stage)',
    keySpec: '2.0mm Extruded Pellet • 20kg Bag',
    inclusionOrDosage: '100% Complete Extruded Feed',
    benefits: [
      'Promotes uniform cohort growth in high-density aquaculture',
      'Low FCR keeps feed cost per kg of harvested fish low',
      'Excellent pellet integrity from factory to pond',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.tilapia,
    stockStatus: 'In Stock',
    stockBags: 225,
  },
  {
    id: 24,
    name: 'C5',
    code: 'C5 (3mm)',
    category: 'Fish',
    units: '20kg bag',
    weightKg: 20,
    priceUgx: 95000,
    feedType: 'Extruded Fish Feed',
    brand: 'Kaffiika',
    summary:
      '3.0mm extruded grower feed (C5) for mid-stage Catfish and Tilapia biomass expansion.',
    targetStage: 'Mid-Grower Fish (3.0mm Stage)',
    keySpec: '3.0mm Extruded Pellet • 20kg Bag',
    inclusionOrDosage: '100% Complete Extruded Feed',
    benefits: [
      'Sustains rapid daily weight gain during mid-growout',
      'High digestibility preserves dissolved oxygen levels in ponds',
      'Balanced amino acid profile for lean fillet development',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.tilapia,
    stockStatus: 'In Stock',
    stockBags: 280,
  },
  {
    id: 25,
    name: 'C6',
    code: 'C6 (4mm)',
    category: 'Fish',
    units: '20kg bag',
    weightKg: 20,
    priceUgx: 92000,
    feedType: 'Extruded Fish Feed',
    brand: 'Kaffiika',
    summary:
      '4.0mm extruded grower-finisher feed (C6) for commercial Catfish and Tilapia approaching market weight.',
    targetStage: 'Grower-Finisher Fish (4.0mm Stage)',
    keySpec: '4.0mm Extruded Pellet • 20kg Bag',
    inclusionOrDosage: '100% Complete Extruded Feed',
    benefits: [
      'High energy-to-protein balance for rapid finishing',
      'Uniform 4mm floating pellets allow visual appetite monitoring',
      'Trusted by commercial Ugandan fish farms',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.tilapia,
    stockStatus: 'In Stock',
    stockBags: 260,
  },
  {
    id: 26,
    name: 'C7',
    code: 'C7 (6mm)',
    category: 'Fish',
    units: '20kg bag',
    weightKg: 20,
    priceUgx: 90000,
    feedType: 'Extruded Fish Feed',
    brand: 'Kaffiika',
    summary:
      '6.0mm extruded finisher feed (C7) tailored for large Catfish and heavy table-size Tilapia.',
    targetStage: 'Finisher Fish (6.0mm Stage)',
    keySpec: '6.0mm Extruded Pellet • 20kg Bag',
    inclusionOrDosage: '100% Complete Extruded Feed',
    benefits: [
      'Ideal 6mm bite size for fish between 500g and 1.2kg',
      'Reduces feeding time and surface competition',
      'Economical finishing cost per kilogram of gain',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.tilapia,
    stockStatus: 'In Stock',
    stockBags: 190,
  },
  {
    id: 27,
    name: 'C8',
    code: 'C8 (8mm)',
    category: 'Fish',
    units: '20kg bag',
    weightKg: 20,
    priceUgx: 90000,
    feedType: 'Extruded Fish Feed',
    brand: 'Kaffiika',
    summary:
      '8.0mm heavy-duty extruded pellet (C8) for fast-growing African Catfish and large aquaculture broodstock.',
    targetStage: 'Large Catfish Finisher (8.0mm Stage)',
    keySpec: '8.0mm Extruded Pellet • 20kg Bag',
    inclusionOrDosage: '100% Complete Extruded Feed',
    benefits: [
      'Engineered for large-mouth African Catfish (>1kg body weight)',
      'Maximizes satiation with minimal energy expenditure',
      'Superior pellet durability and floatability',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.tilapia,
    stockStatus: 'In Stock',
    stockBags: 165,
  },
  {
    id: 28,
    name: 'C9',
    code: 'C9 (10mm)',
    category: 'Fish',
    units: '20kg bag',
    weightKg: 20,
    priceUgx: 88000,
    feedType: 'Extruded Fish Feed',
    brand: 'Kaffiika',
    summary:
      '10.0mm jumbo extruded finisher feed (C9) for heavy commercial Catfish production and smoked/fillet markets.',
    targetStage: 'Jumbo Catfish Finisher & Broodstock (10.0mm Stage)',
    keySpec: '10.0mm Jumbo Pellet • 20kg Bag',
    inclusionOrDosage: '100% Complete Extruded Feed',
    benefits: [
      'Largest 10mm pellet size for 1.5kg – 3kg+ Catfish',
      'Most economical per-kg finisher price in the C-series range',
      'Delivers firm flesh texture for regional export and local markets',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.tilapia,
    stockStatus: 'In Stock',
    stockBags: 145,
  },
  {
    id: 29,
    name: 'Catfish Powder',
    code: 'Catfish Powder',
    category: 'Fish',
    units: '10kg bag',
    weightKg: 10,
    priceUgx: 58000,
    feedType: 'Extruded Fish Feed',
    brand: 'Kaffiika',
    summary:
      'Fine nutrient-dense Catfish fry starter powder for hatchery troughs and early nursery ponds.',
    targetStage: 'Catfish Hatchery Larvae & Early Fry',
    keySpec: 'Micronized Fry Powder • 10kg Bag',
    inclusionOrDosage: '100% Complete Hatchery Fry Ration',
    benefits: [
      'Ultra-fine particle size for newly hatched catfish fry',
      'Rich in fishmeal proteins, phospholipids, and vitamins',
      'Supports high hatchery survival and rapid transition to C2/K0',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.tilapia,
    stockStatus: 'In Stock',
    stockBags: 130,
  },
  {
    id: 33,
    name: 'Tilapia Powder',
    code: 'Tilapia Powder',
    category: 'Fish',
    units: '10kg bag',
    weightKg: 10,
    priceUgx: 61000,
    feedType: 'Extruded Fish Feed',
    brand: 'Kaffiika',
    summary:
      'Specialized Tilapia hatchery & nursery starter powder formulated for swim-up fry and hapas.',
    targetStage: 'Tilapia Hatchery Fry & Hapas',
    keySpec: 'Micronized Tilapia Fry Powder • 10kg Bag',
    inclusionOrDosage: '100% Complete Fry Starter Powder',
    benefits: [
      'Slow-sinking surface dispersion allows all fry equal access',
      'High crude protein and essential lipids for early immunity',
      'Trusted by Ugandan tilapia hatcheries across Kajjansi & Jinja',
    ],
    imageUrl: KAFFIIKA_ASSETS.productUploads.tilapia,
    stockStatus: 'In Stock',
    stockBags: 155,
  },
];

export const BRANCHES: Branch[] = [
  {
    id: "hq-kampala",
    name: "Kampala Main Offices (HQ)",
    manager: "Head Office Dispatch & Technical Desk",
    phones: ["+256755247149"],
    region: "Kampala Metro",
    districtOrArea: "Kaffiika Animal Feeds Headoffice Mengo, Sentema Road, Kampala, Uganda",
    mapCoords: { x: 52, y: 66 },
    isHeadquarters: true,
  },
  {
    id: "bweyogerere-branch",
    name: "Bweyogerere Branch",
    manager: "Pedun Beatrice",
    phones: ["+256754461300"],
    region: "Kampala Metro",
    districtOrArea: "Bweyogerere",
    mapCoords: { x: 30, y: 30 },
  },
  {
    id: "kajjansi-branch",
    name: "Kajjansi Branch",
    manager: "Kato Humphreys",
    phones: ["+256706930752"],
    region: "Wakiso & Central",
    districtOrArea: "Kajjansi",
    mapCoords: { x: 45, y: 40 },
  },
  {
    id: "masaka-branch",
    name: "Masaka Branch",
    manager: "Kayale Julius",
    phones: ["+256782478743", "+256755247149"],
    region: "Masaka & Western",
    districtOrArea: "Masaka",
    mapCoords: { x: 20, y: 80 },
  },
  {
    id: "gayaza-branch",
    name: "Gayaza Branch",
    manager: "Mirember Ruth",
    phones: ["+256706234128"],
    region: "Wakiso & Central",
    districtOrArea: "Gayaza",
    mapCoords: { x: 50, y: 35 },
  },
  {
    id: "buloba-branch",
    name: "Buloba Branch",
    manager: "Kirezi Evelyne",
    phones: ["+256704703275"],
    region: "Wakiso & Central",
    districtOrArea: "Buloba",
    mapCoords: { x: 35, y: 55 },
  },
  {
    id: "entebbe-branch",
    name: "Entebbe Branch",
    manager: "Ssegane Arthur",
    phones: ["+256708087178"],
    region: "Wakiso & Central",
    districtOrArea: "Entebbe",
    mapCoords: { x: 25, y: 60 },
  },
  {
    id: "mengo-branch",
    name: "Mengo Branch",
    manager: "Namazzi Rose",
    phones: ["+256703016000"],
    region: "Kampala Metro",
    districtOrArea: "Mengo",
    mapCoords: { x: 52, y: 62 },
  },
  {
    id: "container-village-branch",
    name: "Container Village Branch",
    manager: "Ssenoga Ramula",
    phones: ["+256704707948"],
    region: "Kampala Metro",
    districtOrArea: "Container Village",
    mapCoords: { x: 55, y: 65 },
  },
  {
    id: "nateete-branch",
    name: "Nateete Branch",
    manager: "Kamulegeya Keneth",
    phones: ["+256755247149"],
    region: "Kampala Metro",
    districtOrArea: "Nateete",
    mapCoords: { x: 48, y: 60 },
  },
  {
    id: "kisenyi-branch",
    name: "Kisenyi Branch",
    manager: "Mutoni Madina",
    phones: ["+256774057916"],
    region: "Kampala Metro",
    districtOrArea: "Kisenyi",
    mapCoords: { x: 52, y: 68 },
  },
  {
    id: "wobulenzi-branch",
    name: "Wobulenzi Branch",
    manager: "Namirembe Claudius",
    phones: ["+256755247149"],
    region: "Wakiso & Central",
    districtOrArea: "Wobulenzi",
    mapCoords: { x: 55, y: 25 },
  },
  {
    id: "mbarara-branch",
    name: "Mbarara Branch",
    manager: "Komugisha Diana",
    phones: ["+256755092733", "+256776397618"],
    region: "Masaka & Western",
    districtOrArea: "Mbarara",
    mapCoords: { x: 15, y: 85 },
  },
  {
    id: "mukono-branch",
    name: "Mukono Branch",
    manager: "Nagawa Lydia",
    phones: ["+256784396486"],
    region: "Mukono & Eastern",
    districtOrArea: "Mukono",
    mapCoords: { x: 65, y: 55 },
  },
  {
    id: "seeta-branch",
    name: "Seeta Branch",
    manager: "Mawemuko Sarah Racheal",
    phones: ["+256757713690", "+256778399420"],
    region: "Mukono & Eastern",
    districtOrArea: "Seeta",
    mapCoords: { x: 68, y: 52 },
  },
  {
    id: "lugazi-branch",
    name: "Lugazi Branch",
    manager: "Ssemakula Enock",
    phones: ["+256755247149"],
    region: "Mukono & Eastern",
    districtOrArea: "Lugazi",
    mapCoords: { x: 75, y: 50 },
  },
  {
    id: "kireka-branch",
    name: "Kireka Branch",
    manager: "Lugemwa Samuel",
    phones: ["+256752716709"],
    region: "Kampala Metro",
    districtOrArea: "Kireka",
    mapCoords: { x: 60, y: 58 },
  },
  {
    id: "kalagi-branch",
    name: "Kalagi Branch",
    manager: "Nakuya Joyce Neveah",
    phones: ["+256774483630", "+256700287713"],
    region: "Mukono & Eastern",
    districtOrArea: "Kalagi",
    mapCoords: { x: 72, y: 48 },
  },
  {
    id: "jinja-branch",
    name: "Jinja Branch",
    manager: "Nanyonjo Esther",
    phones: ["+256756105300"],
    region: "Mukono & Eastern",
    districtOrArea: "Jinja",
    mapCoords: { x: 85, y: 45 },
  },
  {
    id: "misinde-branch",
    name: "Misinde Branch",
    manager: "Zalwango Ritah",
    phones: ["+256704721791"],
    region: "Mukono & Eastern",
    districtOrArea: "Misinde",
    mapCoords: { x: 70, y: 55 },
  },
  {
    id: "kayunga-branch",
    name: "Kayunga Branch",
    manager: "Namuyomba Rejece",
    phones: ["+256754461300"],
    region: "Mukono & Eastern",
    districtOrArea: "Kayunga",
    mapCoords: { x: 78, y: 40 },
  },
  {
    id: "iganga-branch",
    name: "Iganga Branch",
    manager: "Masaba Derrick",
    phones: ["+256753002361"],
    region: "Mukono & Eastern",
    districtOrArea: "Iganga",
    mapCoords: { x: 90, y: 42 },
  },
  {
    id: "mbale-branch",
    name: "Mbale Branch",
    manager: "Kizito Joshua",
    phones: ["+256704505781"],
    region: "Mukono & Eastern",
    districtOrArea: "Mbale",
    mapCoords: { x: 95, y: 35 },
  },
  {
    id: "busia-branch",
    name: "Busia Branch",
    manager: "Tumwesigye Belinda",
    phones: ["+256779835961"],
    region: "Mukono & Eastern",
    districtOrArea: "Busia",
    mapCoords: { x: 98, y: 30 },
  },
  {
    id: "nansana-branch",
    name: "Nansana Branch",
    manager: "Abenoyo Monica",
    phones: ["+256781201176", "+256754511964"],
    region: "Wakiso & Central",
    districtOrArea: "Nansana",
    mapCoords: { x: 40, y: 50 },
  },
  {
    id: "mityana-branch",
    name: "Mityana Branch",
    manager: "Allen Asiimwe",
    phones: ["+256705256729"],
    region: "Wakiso & Central",
    districtOrArea: "Mityana",
    mapCoords: { x: 35, y: 45 },
  },
  {
    id: "kyotera-branch",
    name: "Kyotera Branch",
    manager: "Nabulya Geraldine",
    phones: ["+256778530999", "+256753377947"],
    region: "Masaka & Western",
    districtOrArea: "Kyotera",
    mapCoords: { x: 22, y: 82 },
  },
  {
    id: "matuga-branch",
    name: "Matuga Branch",
    manager: "Natumanya Precious",
    phones: ["+256759360731"],
    region: "Wakiso & Central",
    districtOrArea: "Matugga",
    mapCoords: { x: 42, y: 38 },
  },
  {
    id: "wakiso-branch",
    name: "Wakiso Branch",
    manager: "Katende Swaibu",
    phones: ["+256754403799", "+256778263142"],
    region: "Wakiso & Central",
    districtOrArea: "Wakiso",
    mapCoords: { x: 38, y: 48 },
  },
  {
    id: "kawempe-branch",
    name: "Kawempe Branch",
    manager: "Nabitosi Phionah Musoke",
    phones: ["+256751843056", "+256773303671"],
    region: "Kampala Metro",
    districtOrArea: "Kawempe",
    mapCoords: { x: 50, y: 58 },
  },
  {
    id: "nabbingo-branch",
    name: "Nabbingo Branch",
    manager: "Dilly Nampijja",
    phones: ["+256703304939"],
    region: "Wakiso & Central",
    districtOrArea: "Nabbingo",
    mapCoords: { x: 32, y: 58 },
  },
  {
    id: "nakawuka-branch",
    name: "Nakawuka Branch",
    manager: "Ngabire Winnie",
    phones: ["+256740879333", "+256784848563"],
    region: "Wakiso & Central",
    districtOrArea: "Nakawuka",
    mapCoords: { x: 28, y: 72 },
  },
  {
    id: "buwama-branch",
    name: "Buwama Branch",
    manager: "Patience Acham",
    phones: ["+256705800627", "+256783397312"],
    region: "Masaka & Western",
    districtOrArea: "Buwama",
    mapCoords: { x: 30, y: 75 },
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'nanteza-milly',
    name: 'Nanteza Milly',
    role: 'Managing Director',
    email: 'nantezamilly@kaffiikafeeds.com',
    phones: ['+256 782 478 743'],
    department: 'Executive Leadership',
    bio: 'Spearheads Kaffiika Animal Feeds’ vision since 2006, building Uganda’s most trusted poultry, piggery, dairy, and aquaculture nutrition network.',
    photoUrl: 'https://kaffiikafeeds.com/public/assets/frontend/images/milly.jpg',
  },
  {
    id: 'baguma-francis',
    name: 'Baguma Francis',
    role: 'Commercial Director',
    email: 'francisbaguma@kaffiikafeeds.com',
    phones: ['0784-085-265'],
    department: 'Executive Leadership',
    bio: 'Leads strategic partnerships with Koudijs Animal Nutrition, commercial distribution, and business growth.',
    photoUrl: 'https://kaffiikafeeds.com/public/assets/frontend/images/baguma.jpg',
  },
  {
    id: 'emmanuel-sekasi',
    name: 'Emmanuel Sekasi',
    role: 'General Manager',
    email: 'esendagire@kaffiikafeeds.com',
    phones: ['0759-761-585'],
    department: 'Commercial & Operations',
    bio: 'Oversees daily supply chain reliability, quality assurance, and technical service delivery across all 30+ Kaffiika branches.',
    photoUrl: 'https://kaffiikafeeds.com/public/assets/frontend/images/emma.jpg',
  },
  {
    id: 'alex-mbonigaba',
    name: 'Alex Mbonigaba',
    role: 'Sales Manager',
    email: 'ambonigaba@kaffiikafeeds.com',
    phones: ['0755-980-160', '0775-128-296'],
    department: 'Regional Sales Management',
    bio: 'Coordinates farmer technical trainings, on-farm ration formulation support, and regional wholesale distribution.',
    photoUrl: 'https://kaffiikafeeds.com/public/assets/frontend/images/alex.png',
  },
  {
    id: 'jimmy-mugenyi',
    name: 'Jimmy Mugenyi',
    role: 'Sales Manager',
    email: 'jmugenyi@kaffiikafeeds.com',
    phones: ['0777-181-051'],
    department: 'Regional Sales Management',
    bio: 'Supports commercial poultry, piggery, and aquaculture farms with customized feeding programs and branch stock availability.',
    photoUrl: 'https://kaffiikafeeds.com/public/assets/frontend/images/Jimmy.png',
  },
  {
    id: 'senyange-john-bosco',
    name: 'Senyange Johnbosco',
    role: 'Sales Manager',
    email: 'johnbosco@kaffiikafeeds.com',
    phones: ['0702-241-761'],
    department: 'Regional Sales Management',
    bio: 'Provides direct technical sales advisory and distributor support for farmers across Central, Eastern, and Western Uganda.',
    photoUrl: 'https://kaffiikafeeds.com/public/assets/frontend/images/Ssenyange.png',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'kintu-isaac',
    name: 'Kintu isaac',
    role: 'Farmer',
    farmType: 'Pig Farm Enterprise',
    location: 'Central Uganda',
    productUsed: 'KPLC20 (Koudijs Piglet Concentrate)',
    quote:
      'I was directed to one of the kaffiika shops by a friend who has a pig farm, i bought for my pigs kplc 20 and from that time i have never looked back. Thank you kaffiika and koudijs for your feeds.',
    highlightMetric: 'KPLC 20 Piglet Success',
    photoUrl: 'https://kaffiikafeeds.com/public/assets/frontend/images/person2.jpg',
  },
  {
    id: 'rubare-claire',
    name: 'Rubare Claire',
    role: 'Farmer',
    farmType: 'Poultry Production',
    location: 'Uganda',
    productUsed: 'Kaffiika Poultry Feeds',
    quote:
      "I can't believe how far i have come in the last six months. I didn't really think these feeds would do much to my chicken because i had tried other feeds and hadn't seen much improvement in production like i have seen now.",
    highlightMetric: '6-Month Egg & Growth Surge',
    photoUrl: 'https://kaffiikafeeds.com/public/assets/frontend/images/person3.jpg',
  },
  {
    id: 'tito-okecho',
    name: 'Tito Okecho',
    role: 'Farmer',
    farmType: 'Livestock Producer',
    location: 'Uganda',
    productUsed: 'Kaffiika Animal Feeds',
    quote: 'All i want to say is thank you kaffiika animal feeds.',
    highlightMetric: 'Trusted Quality Feeds',
    photoUrl: 'https://kaffiikafeeds.com/public/assets/frontend/images/person4.jpg',
  },
];

export const SPECIES_GUIDES: SpeciesGuide[] = [
  {
    id: 'poultry',
    species: 'Poultry Farming',
    navSlug: 'poultry',
    tagline: 'From Day Old Chicks (Galdus 2.2mm) to >55g/Day Broilers & >95% Peak Layers',
    heroImage: KAFFIIKA_ASSETS.productUploads.layers,
    intro:
      'Every Poultry Farm has its own unique combinations of breed, housing, climate and management. Furthermore, every business has its own objectives. Well-balanced rations are absolutely essential if each flock is to achieve maximum yield.',
    stages: [
      {
        title: 'Day Old Chicks',
        period: 'First Week of Life (Critical Development)',
        description:
          "The first week of life is crucial for the further development of your broilers and layers. That is why we have galdus prestarter, galdus is a highly nutritious 2.2mm micro pellet prestarter for broilers and layers, with powerful innovative but purely natural characteristics to stimulate the bird's strong early development. The prestarter feed is easy to eat and digest for the chicks, assuring a vigorous start to their growth.",
        recommendedProducts: ['KBPF Galdus', 'Galdus Layer', 'C1 (Crumble)', 'UZIMA'],
        benefits: [
          'Stimulates strong early development',
          'Easy to digest',
          'Higher weight, immunity, flock uniformity and lower fcr at slaughter weight.',
        ],
        targetBenchmark: '2.2mm Micro-Pellet Prestarter',
      },
      {
        title: 'Broilers',
        period: 'Grower & Finisher Phase',
        description:
          'Modern broiler breeds can grow more than 55grams per day under optimal conditions. Broiler production focuses on lowering production costs and increasing added value. Improving technical results and reducing feed costs are the primary methods of lowering production costs.',
        recommendedProducts: ['KBC 35/30', 'KBC10', 'KBPS 20%', 'SOYA'],
        benefits: [
          'High feed efficiency',
          'Better intestinal health',
          'High liveability',
          'Better meat quality',
        ],
        targetBenchmark: '>55 Grams / Day Growth Potential',
      },
      {
        title: 'Layers',
        period: 'Peak Laying Cycle (Up to 76 Weeks)',
        description:
          "As a modern egg producer, you aim for high quality eggs that serve your customers' needs. Under optimal conditions, a modern layer produces over 95% during peak production. This means more than 310 eggs per hen over a 76-week period.",
        recommendedProducts: ['KLC 20', 'KLC 10', 'KLC 5', 'KLPF Galdus Layer', 'Limestones'],
        benefits: [
          'Better egg quality and taste',
          'Sustainable and persistent production',
          'Higher revenue due to optimal technical results',
        ],
        targetBenchmark: '>95% Peak • 310+ Eggs / 76 Weeks',
      },
    ],
  },
  {
    id: 'piggery',
    species: 'Piggery Farming',
    navSlug: 'piggery',
    tagline: 'Well-Balanced Rations for Piglets, Productive Sows & Fast Fattening',
    heroImage: KAFFIIKA_ASSETS.productUploads.knursemeal,
    intro:
      'Well-balanced rations are absolutely essential to obtain the best results, healthy livestock or high production levels. However, the specific requirements for those rations also depend on the on-the-farm conditions, and the requirements and objectives of the individual farmer.',
    stages: [
      {
        title: 'Piglets',
        period: 'Creep & Weaning Rearing Phase',
        description:
          'To ensure the best rearing results, high-quality piglet feed is required. Kaffiika provides Knursemeal, KPLC20, KPLC50, and Koudijs Romelko to guarantee high early intake and stress-free weaning.',
        recommendedProducts: ['Knursemeal', 'KPLC20', 'KPLC50', 'Koudijs Romelko'],
        benefits: ['Optimal conditions', 'Higher feed intake', 'Healthy piglets'],
        targetBenchmark: 'Vigorous Weaning & Litter Uniformity',
      },
      {
        title: 'Sows',
        period: 'Gestation & Lactation',
        description:
          'Genetic improvements have made pigs increasingly more productive. They are leaner and require different protein and energy levels.',
        recommendedProducts: ['KPSC 20/22', 'Koudijs Romelko', 'KPC 10/7,5/5'],
        benefits: [
          'More weaned piglets per year',
          'Optimal condition development',
          'Higher milk production',
        ],
        targetBenchmark: 'More Weaned Piglets / Year',
      },
      {
        title: 'Fattening',
        period: 'Grower to Finisher Market Weight',
        description:
          'As a pig farmer you want healthy animals with an optimal growth rate, a low feed intake and good quality of meat.',
        recommendedProducts: ['KPC 30/25', 'KPC 20/15', 'KPC 10/7,5/5'],
        benefits: [
          'Optimal economic result',
          'Favourable growth',
          'Good price/quality ratio',
        ],
        targetBenchmark: 'Low Feed Intake • High Meat Quality',
      },
    ],
  },
  {
    id: 'ruminants',
    species: 'Ruminants (Dairy & Beef)',
    navSlug: 'ruminants',
    tagline: 'Rearing Calves, Lactating Dairy Cows & Beef Cattle Solutions',
    heroImage: KAFFIIKA_ASSETS.productUploads.cows,
    intro:
      'Our cattle feed specialists are proactive, have an entrepreneurial spirit and strive every day to improve your business and ensure a higher return. This motivation and our on-the-farm approach guarantee that our recommendations and feed are fully tailored to your specific situation.',
    extraInstructionsTitle: 'Instructions for Milk Preparation on Milk Replacer (KMR / Koudalac)',
    extraInstructionsSteps: [
      '1. Rinse and clean buckets and treat buckets before use.',
      '2. Check on the feeding table how much milk to prepare.',
      "3. Weigh the correct quantity of Koudalac / KMR (150 grams per litre of water. Look on the bag's label for more details).",
      '4. Warm up the water to 45–50 Degrees Celsius, but never over 70 Degrees (use a thermometer).',
      '5. Add, little by little, the powdered Koudalac / KMR until the correct concentration is attained.',
      '6. Mix the milk thoroughly (stir at least 30 seconds).',
      '7. Pour the milk in the bucket at least 42 Degrees Celsius, so the temperature of the milk is correct.',
    ],
    stages: [
      {
        title: 'Rearing Calves',
        period: 'Post-Colostrum to Weaning',
        description:
          'Rearing young dairy animals is an important job on the farm. Do this successfully and it will be a strong foundation for future results. To achieve an optimal and healthy growth rate, the calves should be given the right kind of care and nutrition.',
        recommendedProducts: ['KMR', 'Koudatox Afla'],
        benefits: [
          'Sustainable dairy cows',
          'Higher lifetime production',
          'Lower rearing costs',
        ],
        targetBenchmark: '150g / Litre @ 42–50°C Preparation',
      },
      {
        title: 'Dairy Cows',
        period: 'Lactation & Transition Phase',
        description:
          'As a dairy farmer, you want the best results, the highest quality and improved performance. We have the knowledge and the feed solutions available to help you reach those goals.',
        recommendedProducts: ['K Diary C', 'Kdiary MB', 'Limestones'],
        benefits: [
          'Better performing cows during lactation phase',
          'Fewer immunity problems',
          'Healthier calves',
        ],
        targetBenchmark: 'Peak Lactation & Herd Immunity',
      },
      {
        title: 'Beef Cattle',
        period: 'Growing & Finishing Bulls/Steers',
        description:
          'To develop the best feeding solution, locally available raw materials and their prices are taken into account.',
        recommendedProducts: ['K Diary C', 'Kdiary MB', 'SOYA'],
        benefits: [
          'More intramuscular fat, so tender, tasty meat',
          'Higher growth per day',
          'Higher vitality',
        ],
        targetBenchmark: 'Higher Daily Growth & Marbling',
      },
    ],
  },
  {
    id: 'aqua',
    species: 'Aqua (Tilapia & Catfish)',
    navSlug: 'aqua',
    tagline: 'State-of-the-Art Extruded Fish Feeds Backed by Koudijs Global Expertise',
    heroImage: KAFFIIKA_ASSETS.productUploads.tilapia,
    intro:
      'Thanks to our parent company Koudijs, we have direct access to worldwide experience in fish feed. For many years already, their state-of-the-art production plants in Egypt, Vietnam and Poland have proven to produce outstanding quality fish feed that readily meets the local and export market needs in many countries.',
    stages: [
      {
        title: 'Tilapia & Catfish Hatchery / Nursery',
        period: 'Powder, 0.5mm, 0.8mm & 1.0mm Stages (40% CP)',
        description:
          'Tilapia is popular because it is an affordable, healthy and tasty dish! Natural catch has come down and the prices for fish increased, making fish farming highly profitable when started with 40% Crude Protein fry feeds.',
        recommendedProducts: [
          'Tilapia Powder',
          'Catfish Powder',
          'K0 (0.5mm)',
          'K1 (0.8mm)',
          'K1 (0.8 -1.2mm)',
          'K3 (1mm)',
          'C2 (1mm)',
        ],
        benefits: ['Quality Products', 'Low feed conversion rate', 'Higher livability'],
        targetBenchmark: '40% Crude Protein • 0.5mm – 1.0mm',
      },
      {
        title: 'Juvenile & Grower Floating Pellets',
        period: '1.5mm, 2.0mm (35% CP) & 3.0mm (30% CP)',
        description:
          'Extruded floating pellets for ponds and Lake Victoria cages that allow accurate surface feeding observation and rapid frame growth.',
        recommendedProducts: [
          'KT2 (1.5m)',
          'K4 (2mm)',
          'K5 (3mm)',
          'C3 (1.5mm)',
          'C4 (2mm)',
          'C5 (3mm)',
        ],
        benefits: ['Quality Products', 'Low feed conversion rate', 'Higher livability'],
        targetBenchmark: '30%–40% CP • 1.5mm – 3.0mm Extruded',
      },
      {
        title: 'Finisher & Jumbo Aquaculture Feeds',
        period: '4.0mm, 6.0mm, 8.0mm & 10.0mm Stages',
        description:
          'High-efficiency 25%–27% CP finisher pellets for table-size Tilapia and large African Catfish up to harvest weight.',
        recommendedProducts: [
          'KF6',
          'K6 (4mm)',
          'K7 (6mm)',
          'C6 (4mm)',
          'C7 (6mm)',
          'C8 (8mm)',
          'C9 (10mm)',
        ],
        benefits: ['Quality Products', 'Low feed conversion rate', 'Higher livability'],
        targetBenchmark: '4.0mm – 10.0mm Finisher Range',
      },
    ],
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'black-friday-sales',
    title: 'Black Friday Sales',
    date: 'Wed, Nov 2022',
    author: 'Admin',
    category: 'Seasonal Promotions',
    summary:
      'Black Friday Sales across Kaffiika Animal Feeds branches! Enjoy special discounts on poultry, piggery, dairy, and fish feeds.',
    imageUrl: 'https://kaffiikafeeds.com/public/uploads/news/post_202211161158198789.jpg',
    content: [
      'Kaffiika Animal Feeds rewards loyal Ugandan farmers with annual Black Friday Sales and seasonal bulk discounts across all our branches.',
      'Stock up on Koudijs Layer Concentrates (KLC 20, KLC 10, KLC 5), Broiler Concentrates (KBC 35/30), Piglet Concentrates (KPLC20, Knursemeal), and Extruded Tilapia & Catfish Feeds at special promotional prices.',
    ],
  },
  {
    id: 'jinja-training',
    title: 'Poultry and Piggery Training in Jinja',
    date: 'Mon, Apr 2022',
    author: 'Admin',
    category: 'Farmer Training',
    summary:
      'JINJA GET READY! For a poultry and piggery training in Jinja. FREE ENTRY at Jinja City Town Hall (9:00am). Theme: Focusing on Efficient Feeding and Modern Practices for Best Technical Results.',
    imageUrl: 'https://kaffiikafeeds.com/public/uploads/news/post_20220418163035235.jpg',
    location: 'Jinja City Town Hall • Date: 30th April 2022 • Time: 9:00am',
    contacts: ['+256 755 247149'],
    content: [
      'JINJA GET READY!!! For a poultry and piggery training in Jinja. FREE ENTRY.',
      'Theme: FOCUSING ON EFFICIENT FEEDING AND MODERN PRACTICES FOR BEST TECHNICAL RESULTS.',
      'Hosted at Jinja City Town Hall starting at 9:00am. Call +256 755 247149 for seminar inquiries and upcoming regional farmer trainings.',
    ],
  },
  {
    id: 'we-secure-the-future',
    title: 'We Secure the Future',
    date: 'Thu, Mar 2022',
    author: 'Admin',
    category: 'Koudijs Partnership',
    summary:
      'You can secure your future with Koudijs Nutritional Feeds — precision Dutch livestock nutrition available at all Kaffiika branches.',
    imageUrl: 'https://kaffiikafeeds.com/public/uploads/news/post_202203311429587258.jpg',
    content: [
      'You can secure your future with Koudijs Nutritional Feeds. As the main supplier of Koudijs products in Uganda, Kaffiika Animal Feeds empowers commercial and smallholder farmers to achieve predictable high yields.',
      'By combining Koudijs concentrates with locally available maize and maize bran, farmers dramatically reduce feed cost per kilogram of meat, milk, and eggs while maintaining international nutritional standards.',
    ],
  },
];

export interface RationPreset {
  id: string;
  title: string;
  species: 'Layers' | 'Broilers' | 'Piggery' | 'Dairy';
  stage: string;
  concentrateId: number;
  concentrateCode: string;
  concentrateRatioPct: number;
  ingredientsPer100Kg: {
    name: string;
    kg: number;
    isKaffiikaProduct?: boolean;
    productId?: number;
  }[];
  expectedFcrOrYield: string;
  notes: string;
}

export const RATION_PRESETS: RationPreset[] = [
  {
    id: 'layer-klc20',
    title: 'Commercial Layer Mash (using KLC 20%)',
    species: 'Layers',
    stage: 'Laying Hens (18 – 76 Weeks)',
    concentrateId: 4,
    concentrateCode: 'KLC 20',
    concentrateRatioPct: 20,
    ingredientsPer100Kg: [
      { name: 'KLC 20 (Koudijs Layer Concentrate 20%)', kg: 20, isKaffiikaProduct: true, productId: 4 },
      { name: 'Broken Maize (Dry, Aflatoxin-Free)', kg: 45 },
      { name: 'Maize Bran (High Quality)', kg: 27 },
      { name: 'Feed-Grade Limestones (Calcium)', kg: 8, isKaffiikaProduct: true, productId: 38 },
    ],
    expectedFcrOrYield: '>95% Peak Lay • 310+ Eggs/Hen • ~115–120g/bird/day',
    notes: 'Add 100g–200g of Koudatox Afla per 100kg of feed to protect hens against maize mycotoxins.',
  },
  {
    id: 'layer-klc10',
    title: 'Economical Layer Mash (using KLC 10% + Soya)',
    species: 'Layers',
    stage: 'Laying Hens (With On-Farm Soya)',
    concentrateId: 6,
    concentrateCode: 'KLC 10',
    concentrateRatioPct: 10,
    ingredientsPer100Kg: [
      { name: 'KLC 10 (Koudijs Layer Concentrate 10%)', kg: 10, isKaffiikaProduct: true, productId: 6 },
      { name: 'Toasted Soya Meal', kg: 14, isKaffiikaProduct: true, productId: 16 },
      { name: 'Broken Maize', kg: 45 },
      { name: 'Maize Bran', kg: 23 },
      { name: 'Feed-Grade Limestones', kg: 8, isKaffiikaProduct: true, productId: 38 },
    ],
    expectedFcrOrYield: '>95% Peak Lay • Lower Concentrate Cost per Ton',
    notes: 'Ensure Soya is properly toasted (available at Kaffiika branches in 50kg bags).',
  },
  {
    id: 'broiler-kbc35',
    title: 'High-Gain Broiler Starter (using KBC 35/30)',
    species: 'Broilers',
    stage: 'Broiler Starter (Day 10 – Day 24 after Galdus)',
    concentrateId: 2,
    concentrateCode: 'KBC 35/30',
    concentrateRatioPct: 35,
    ingredientsPer100Kg: [
      { name: 'KBC 35/30 (Koudijs Broiler Concentrate)', kg: 35, isKaffiikaProduct: true, productId: 2 },
      { name: 'Broken Maize (High Energy)', kg: 55 },
      { name: 'Quality Maize Bran', kg: 10 },
    ],
    expectedFcrOrYield: '>55g / Day Growth • 1.55 – 1.65 Target FCR',
    notes: 'Feed KBPF Galdus 2.2mm micro-pellets for Days 1–10 before switching to this starter mix.',
  },
  {
    id: 'broiler-kbc30',
    title: 'Broiler Finisher Ration (using KBC 35/30 at 30%)',
    species: 'Broilers',
    stage: 'Broiler Finisher (Day 25 – Market Weight)',
    concentrateId: 2,
    concentrateCode: 'KBC 35/30',
    concentrateRatioPct: 30,
    ingredientsPer100Kg: [
      { name: 'KBC 35/30 (Koudijs Broiler Concentrate)', kg: 30, isKaffiikaProduct: true, productId: 2 },
      { name: 'Broken Maize', kg: 58 },
      { name: 'Quality Maize Bran', kg: 12 },
    ],
    expectedFcrOrYield: '2.2kg – 2.6kg Live Weight at 5–6 Weeks',
    notes: 'Simple 3-ingredient mix requiring no extra soya meal.',
  },
  {
    id: 'pig-kplc20',
    title: 'Weaner Piglet Starter (using KPLC20)',
    species: 'Piggery',
    stage: 'Weaned Piglets (8kg – 25kg Body Weight)',
    concentrateId: 41,
    concentrateCode: 'KPLC20',
    concentrateRatioPct: 25,
    ingredientsPer100Kg: [
      { name: 'KPLC20 (Koudijs Piglet Concentrate)', kg: 25, isKaffiikaProduct: true, productId: 41 },
      { name: 'Broken Maize', kg: 50 },
      { name: 'Fine Maize Bran', kg: 25 },
    ],
    expectedFcrOrYield: 'Rapid Post-Weaning Growth & Zero Scours',
    notes: 'Can also be mixed using KPLC50 (50kg bulk pack) for larger herds.',
  },
  {
    id: 'pig-kpc3025',
    title: 'Pig Grower / Fattener (using KPC 30/25)',
    species: 'Piggery',
    stage: 'Grower & Finisher Pigs (25kg – 100kg)',
    concentrateId: 45,
    concentrateCode: 'KPC 30/25',
    concentrateRatioPct: 25,
    ingredientsPer100Kg: [
      { name: 'KPC 30/25 (Koudijs Pig Concentrate)', kg: 25, isKaffiikaProduct: true, productId: 45 },
      { name: 'Broken Maize', kg: 45 },
      { name: 'Maize Bran', kg: 30 },
    ],
    expectedFcrOrYield: '750g – 900g Daily Gain • High Lean Pork Yield',
    notes: 'For Pregnant/Nursing Sows, switch to KPSC 20/22 at 20–22% inclusion.',
  },
  {
    id: 'dairy-kdiaryc',
    title: 'High-Yield Lactating Dairy Meal (using K Diary C)',
    species: 'Dairy',
    stage: 'Lactating Dairy Cows',
    concentrateId: 8,
    concentrateCode: 'K Diary C',
    concentrateRatioPct: 25,
    ingredientsPer100Kg: [
      { name: 'Koudijs Dairy Concentrate (K Diary C)', kg: 25, isKaffiikaProduct: true, productId: 8 },
      { name: 'Maize Bran', kg: 48 },
      { name: 'Broken Maize', kg: 25 },
      { name: 'Kdiary MB (Dairy Mineral Balancer)', kg: 2, isKaffiikaProduct: true, productId: 35 },
    ],
    expectedFcrOrYield: 'Feed ~0.4–0.5kg per Liter of Milk Produced above Basal Forage',
    notes: 'Ensure cows have constant access to clean drinking water.',
  },
];

export const INITIAL_ORDERS: CustomerOrder[] = [
  {
    id: 'ord-1',
    reference: 'KAF-849201',
    customerName: 'Kintu Isaac (Wakiso Piggery)',
    customerPhone: '+256 772 419 820',
    branchId: 'wakiso',
    branchName: 'Wakiso Branch',
    deliveryMode: 'Branch Pickup',
    createdAt: '2025-02-24 09:40',
    status: 'Completed',
    items: [
      {
        productId: 41,
        productName: 'KPLC20',
        productCode: 'KPLC20',
        units: '20kg bag',
        quantity: 10,
        unitPriceUgx: 106000,
      },
      {
        productId: 45,
        productName: 'KPC 30/25',
        productCode: 'KPC 30/25',
        units: '50kg bag',
        quantity: 6,
        unitPriceUgx: 209000,
      },
    ],
    totalBags: 16,
    totalWeightKg: 500,
    totalAmountUgx: 2314000,
  },
  {
    id: 'ord-2',
    reference: 'KAF-849245',
    customerName: 'Rubare Claire Poultry Farm',
    customerPhone: '+256 704 883 112',
    branchId: 'mukono',
    branchName: 'Mukono Branch',
    deliveryMode: 'Farm Delivery',
    createdAt: '2025-02-25 14:15',
    status: 'Dispatched',
    items: [
      {
        productId: 4,
        productName: 'KLC 20',
        productCode: 'KLC 20',
        units: '50kg bag',
        quantity: 15,
        unitPriceUgx: 213000,
      },
      {
        productId: 38,
        productName: 'Limestones',
        productCode: 'Limestones',
        units: '50kg bag',
        quantity: 6,
        unitPriceUgx: 23000,
      },
    ],
    totalBags: 21,
    totalWeightKg: 1050,
    totalAmountUgx: 3333000,
  },
  {
    id: 'ord-3',
    reference: 'KAF-849310',
    customerName: 'Lake Victoria Tilapia Cages Ltd',
    customerPhone: '+256 756 105 999',
    branchId: 'jinja',
    branchName: 'Jinja Branch',
    deliveryMode: 'Farm Delivery',
    createdAt: '2025-02-26 11:05',
    status: 'Pending',
    items: [
      {
        productId: 12,
        productName: 'Fish Feed, 2.0mm/35% CP',
        productCode: 'K4 (2mm)',
        units: '20kg bag',
        quantity: 25,
        unitPriceUgx: 100000,
      },
      {
        productId: 15,
        productName: 'Fish Feed, 4.0mm/25% CP',
        productCode: 'K6 (4mm)',
        units: '20kg bag',
        quantity: 30,
        unitPriceUgx: 93000,
      },
    ],
    totalBags: 55,
    totalWeightKg: 1100,
    totalAmountUgx: 5290000,
  },
];
