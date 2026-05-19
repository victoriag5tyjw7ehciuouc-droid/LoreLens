
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppTheme, AppLanguage } from '../types';
import { IconHistory, IconSettings, IconCamera } from './Icons';
import { useSettingsStore } from '../store/useSettingsStore';

interface HomeViewProps {
  onScanStart: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
}

const APP_NAME = 'Context Lens';

// Safe Fallback Assets
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80"; // Red wall texture
const FALLBACK_CREDIT = { name: "Zhang Kaiyv", link: "https://unsplash.com/@zhangkaiyv" };

const FALLBACK_CITY_I18N: Record<AppLanguage, string> = {
  en: "Beijing",
  zh: "北京",
  ja: "北京",
  es: "Pekín",
  fr: "Pékin",
  ru: "Пекин",
  ar: "بكين"
};

// Dynamic Templates for Unknown Cities
const DYNAMIC_TEMPLATES: Record<AppLanguage, { quote: string; author: string; title: string }[]> = {
  en: [
    { quote: "The pulse of {city} is best heard in the silence between its sounds.", author: "Urban Echoes", title: "Spirit of {city}" },
    { quote: "Every corner in {city} hides a story that history books forgot to mention.", author: "Local Wisdom", title: "Hidden {city}" },
    { quote: "To know {city} is to get lost in its alleys, not its maps.", author: "The Wanderer", title: "{city} Unveiled" }
  ],
  zh: [
    { quote: "{city} 的脉搏，只有在静谧的角落才能听得最真切。", author: "城市回响", title: "{city} 掠影" },
    { quote: "每一座建筑，都是 {city} 写给时间的一封情书。", author: "建筑诗人", title: "{city} 记忆" },
    { quote: "读懂 {city} 的最好方式，是迷失在它的街巷里，而非地图上。", author: "漫游者", title: "寻找 {city}" }
  ],
  ja: [
    { quote: "{city} の鼓動は、静寂な路地裏でこそ最も鮮明に聞こえる。", author: "都市の響き", title: "{city} の心" },
    { quote: "{city} を知るには、地図ではなく、その迷路のような路地に身を委ねることだ。", author: "放浪者", title: "隠された {city}" },
    { quote: "すべての曲がり角に、{city} の語られざる物語が潜んでいる。", author: "路上の賢者", title: "{city} の秘密" }
  ],
  es: [
    { quote: "El alma de {city} se encuentra mejor en el silencio entre sus sonidos.", author: "Ecos Urbanos", title: "Espíritu de {city}" },
    { quote: "Cada rincón de {city} esconde una historia que los libros olvidaron.", author: "Sabiduría Local", title: "{city} Oculta" },
    { quote: "Para conocer {city}, hay que perderse en sus callejones, no en sus mapas.", author: "El Caminante", title: "Descubriendo {city}" }
  ],
  fr: [
    { quote: "L'âme de {city} se trouve mieux dans le silence entre ses bruits.", author: "Échos Urbains", title: "Esprit de {city}" },
    { quote: "Chaque coin de {city} cache une histoire que les livres ont oubliée.", author: "Sagesse Locale", title: "{city} Cachée" },
    { quote: "Pour connaître {city}, il faut se perdre dans ses ruelles, pas sur ses cartes.", author: "Le Promeneur", title: "Découvrir {city}" }
  ],
  ru: [
    { quote: "Пульс города {city} лучше всего слышен в тишине между его звуками.", author: "Городские эхо", title: "Дух города {city}" },
    { quote: "Каждый уголок в {city} скрывает историю, о которой забыли упомянуть учебники.", author: "Местная мудрость", title: "Скрытый {city}" },
    { quote: "Узнать {city} — значит затеряться в его переулках, а не на картах.", author: "Странник", title: "{city} без прикрас" }
  ],
  ar: [
    { quote: "يُسمع نبض {city} بوضوح في الصمت بين أصواتها.", author: "أصداء حضرية", title: "روح {city}" },
    { quote: "تخفي كل زاوية في {city} قصة نسيت كتب التاريخ ذكرها.", author: "حكمة محلية", title: "{city} المخفية" },
    { quote: "لكي تعرف {city} حقًا، عليك أن تتوه في أزقتها لا في خرائطها.", author: "المتجول", title: "اكتشاف {city}" }
  ]
};

const INSIGHTS_DB = [
    {
        city: "Beijing",
        items: [
            {
                quote: "Roof guardians watch over the city's soul, not just its rain.",
                author: "A Cultural Note",
                title: "Forbidden City Roofs",
                keywords: "forbidden city roof detail"
            },
            {
                quote: "In the Hutongs, silence speaks louder than the bustle of the main roads.",
                author: "Urban Echoes",
                title: "Hutong Life",
                keywords: "beijing hutong street"
            },
            {
                quote: "The Red Wall reflects not just history, but the endurance of memory.",
                author: "History Whisperer",
                title: "Imperial Walls",
                keywords: "forbidden city red wall"
            }
        ]
    },
    {
        city: "Shanghai",
        items: [
             {
                quote: "Where the past meets the future across the river bend.",
                author: "The Bund",
                title: "Lujiazui Skyline",
                keywords: "shanghai tower skyline"
            },
            {
                quote: "Lilong lanes weave stories of a golden era.",
                author: "Old City",
                title: "Xintiandi",
                keywords: "shanghai old street brick"
            }
        ]
    },
    {
        city: "Xi'an",
        items: [
            {
                quote: "Silent soldiers guarding an emperor's eternal dream.",
                author: "Terracotta Warriors",
                title: "Qin Dynasty",
                keywords: "terracotta warriors close up"
            }
        ]
    }
];

// Fallback if no location found at all
const DEFAULT_INSIGHTS = [
    {
        quote: "Tea is drunk to forget the din of the world.",
        author: "T'ien Yi-heng",
        title: "Tea Culture",
        keywords: "chinese tea ceremony pouring"
    }
];

export const HomeView: React.FC<HomeViewProps> = ({ 
  onScanStart, 
  onOpenHistory, 
  onOpenSettings
}) => {
  const { t } = useTranslation();
  const { theme, language } = useSettingsStore();
  const isDark = theme === 'dark';
  
  const [greeting, setGreeting] = useState('');
  
  // Location State
  const [locationName, setLocationName] = useState('Beijing');
  const [currentCity, setCurrentCity] = useState('Beijing');
  const [currentDistrict, setCurrentDistrict] = useState('');
  
  // Content State
  const [insight, setInsight] = useState(INSIGHTS_DB[0].items[0]);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [photoCredit, setPhotoCredit] = useState<{name: string, link: string} | null>(null);

  // Helper: Get Time Context
  const getTimeContext = (): { timeQuery: string } => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { timeQuery: "morning light" };
    if (hour >= 12 && hour < 17) return { timeQuery: "sunny afternoon" };
    if (hour >= 17 && hour < 20) return { timeQuery: "sunset golden hour" };
    return { timeQuery: "night neon street" };
  };

  const fetchUnsplashPhoto = async (query: string): Promise<boolean> => {
      // 1. 定义缓存的 Key 和有效期 (这里设为 2 小时)
      const CACHE_KEY = `lorelens_img_${query}`;
      const CACHE_EXPIRY = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

      try {
          // 2. 检查本地缓存
          const cachedData = localStorage.getItem(CACHE_KEY);
          if (cachedData) {
              const { url, credit, timestamp } = JSON.parse(cachedData);
              if (Date.now() - timestamp < CACHE_EXPIRY) {
                  setCurrentImage(url);
                  setPhotoCredit(credit);
                  return true;
              }
          }

          // 3. 【核心修复】换回你最开始用的强大的 /search/photos 接口！
          // 请求前 15 张高度匹配的图片 (per_page=15)
          const response = await fetch(`/api/unsplash?query=${encodeURIComponent(query)}`);
          
          if (response.status === 403 || response.status === 429) {
             console.warn("Unsplash API Rate Limit Exceeded");
             return false;
          }
          
          if (!response.ok) return false;

          const data = await response.json();
          
          // 4. 【实现随机性】只要搜到了图片，我们就在结果数组里随机抽选一张
          if (data && data.results && data.results.length > 0) {
              const randomIndex = Math.floor(Math.random() * data.results.length);
              const photo = data.results[randomIndex];

              const url = photo.urls.regular;
              const credit = {
                  name: photo.user.name,
                  link: photo.user.links.html
              };

              setCurrentImage(url);
              setPhotoCredit(credit);
              
              // 5. 将这轮抽中的图片和信息存入缓存，锁死 2 小时
              localStorage.setItem(CACHE_KEY, JSON.stringify({
                  url,
                  credit,
                  timestamp: Date.now()
              }));

              // 触发下载统计 (完全符合你发的 API Guidelines 规范)
              if (photo.links?.download_location) {
                  fetch('/api/unsplash/download', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ url: photo.links.download_location })
                  }).catch(() => {});
              }
              return true;
          }
      } catch (error) {
          console.warn("Unsplash API failed", error);
      }
      return false;
  };

  // Logic to load content
  const loadContextContent = async (displayCity: string, displayDistrict: string = "", searchCity: string = "", searchDistrict: string = "") => {
      const finalSearchCity = searchCity || displayCity;
      const finalSearchDistrict = searchDistrict || displayDistrict;

      const cleanDisplayCity = displayCity.replace(/(City|Shi)$/i, '').trim();
      const cleanSearchCity = finalSearchCity.replace(/(City|Shi)$/i, '').trim();
      const timeCtx = getTimeContext();
      
      let displayLocationName = cleanDisplayCity;
      if (cleanDisplayCity === 'Beijing') {
          displayLocationName = FALLBACK_CITY_I18N[language];
      }

      // 1. Check Curated DB
      const cityData = INSIGHTS_DB.find(c => cleanSearchCity.includes(c.city) || c.city.includes(cleanSearchCity));
      
      let searchQuery = "";
      
      if (cityData) {
          // Use DB Content
          const selected = cityData.items[Math.floor(Math.random() * cityData.items.length)];
          
          if (language !== 'en') {
              const langTemplates = DYNAMIC_TEMPLATES[language] || DYNAMIC_TEMPLATES['en'];
              const template = langTemplates[Math.floor(Math.random() * langTemplates.length)];
              setInsight({
                  quote: template.quote.replace(/{city}/g, displayLocationName),
                  author: template.author,
                  title: template.title.replace(/{city}/g, displayLocationName),
                  keywords: selected.keywords
              });
          } else {
              setInsight(selected);
          }
          // Append time context to DB keywords for variety
          searchQuery = `${selected.keywords} ${timeCtx.timeQuery}`;
      } else {
          // Use Dynamic Fallback
          const langTemplates = DYNAMIC_TEMPLATES[language] || DYNAMIC_TEMPLATES['en'];
          const template = langTemplates[Math.floor(Math.random() * langTemplates.length)];
          
          setInsight({
              quote: template.quote.replace(/{city}/g, displayLocationName),
              author: template.author,
              title: template.title.replace(/{city}/g, displayLocationName),
              keywords: "" 
          });

          // Dynamic Search: "Singapore downtown night neon street aesthetic"
          searchQuery = `${cleanSearchCity} ${finalSearchDistrict} ${timeCtx.timeQuery} aesthetic street architecture`;
      }

      // 2. Fetch Image (Only if image hasn't been loaded for this specific context, or strictly rely on new fetch)
      // Note: We intentionally re-fetch to match the time of day if the user refreshes or moves.
      const success = await fetchUnsplashPhoto(searchQuery);
      if (!success) {
          // Fallback search with less specific terms
          const broadQuery = `${cleanSearchCity} ${timeCtx.timeQuery} architecture`;
          const retrySuccess = await fetchUnsplashPhoto(broadQuery);
          if (!retrySuccess) {
              setCurrentImage(FALLBACK_IMAGE);
              setPhotoCredit(FALLBACK_CREDIT);
          }
      }
  };

  // Initial Load & Geolocation
  useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                // 1. 核心修复：同时请求两种语言的地理位置
                // localizedData 用于右上角完美显示，englishData 用于 Unsplash 精确搜索！
                const [localizedData, englishData] = await Promise.all([
                    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=12&addressdetails=1&accept-language=${language}`).then(res => res.json()),
                    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=12&addressdetails=1&accept-language=en`).then(res => res.json())
                ]);
                
                // 解析用于【显示】的本地化名称
                const locAddress = localizedData.address || {};
                const displayCity = locAddress.city || locAddress.town || locAddress.village || "Beijing";
                const displayDistrict = language === 'en' 
                    ? (locAddress.suburb || locAddress.district || "").replace(/(District|New Area|County|Qu)$/i, '').trim() 
                    : (locAddress.suburb || locAddress.district || "");

                // 解析用于【搜索】的纯英文名称
                const enAddress = englishData.address || {};
                const searchCity = enAddress.city || enAddress.town || enAddress.village || "Beijing";
                const searchDistrict = (enAddress.suburb || enAddress.district || "").replace(/(District|New Area|County|Qu)$/i, '').trim();

                setCurrentCity(displayCity);
                setCurrentDistrict(displayDistrict);

                // 根据语言习惯拼接显示的地理位置
                let formattedLocation = displayCity;
                if (displayDistrict) {
                    if (language === 'ar') formattedLocation = `${displayDistrict}، ${displayCity}`;
                    else if (language === 'zh' || language === 'ja') formattedLocation = `${displayCity}${displayDistrict}`;
                    else formattedLocation = `${displayCity}, ${displayDistrict}`;
                }
                setLocationName(formattedLocation);
                
                // 2. 关键修复：把用于搜索的纯英文名 (searchCity) 传给加载函数！
                loadContextContent(displayCity, displayDistrict, searchCity, searchDistrict);
            } catch (e) {
                console.warn("Geocoding failed", e);
                setCurrentCity("Beijing");
                loadContextContent("Beijing", "", "Beijing", "");
            }
        }, (err) => {
             console.warn("Location permission denied", err);
             setCurrentCity("Beijing");
             loadContextContent("Beijing", "", "Beijing", "");
        }, { enableHighAccuracy: true });
    } else {
        setCurrentCity("Beijing");
        loadContextContent("Beijing", "", "Beijing", "");
    }
  }, [language]); 

  // Refresh greeting and insight text when Language changes
  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? t('greeting.morning') : hour < 18 ? t('greeting.afternoon') : t('greeting.evening'));
    
    // Re-run insight generation (only for the text part if possible, but here we just re-run the whole lightweight logic)
    // We only re-run content loader if we have a city set, to avoid overwriting with defaults prematurely
    if (currentCity) {
         // To avoid re-fetching image constantly on language switch, we could separate text logic. 
         // But for simplicity, we just re-run. The browser caches the image URL usually if it's the same query result, 
         // but unsplash randomizes. 
         // Optimization: Only update text if it's a dynamic template.
         const cleanCity = currentCity.replace(/(City|Shi)$/i, '').trim();
         const cityData = INSIGHTS_DB.find(c => cleanCity.includes(c.city) || c.city.includes(cleanCity));
         
         let displayLocationName = cleanCity;
         if (cleanCity === 'Beijing' || cleanCity === 'بكين' || cleanCity === 'Пекин' || cleanCity === 'Pekín' || cleanCity === 'Pékin' || cleanCity === '北京') {
             displayLocationName = FALLBACK_CITY_I18N[language];
         } else {
             // If Nominatim gave us English while we requested another language, format it gracefully anyway
         }
         
         if (!cityData || language !== 'en') {
             // It is dynamic, so we MUST update the text to match new language
             const langTemplates = DYNAMIC_TEMPLATES[language] || DYNAMIC_TEMPLATES['en'];
             const template = langTemplates[Math.floor(Math.random() * langTemplates.length)];
             setInsight({
                  quote: template.quote.replace(/{city}/g, displayLocationName),
                  author: template.author,
                  title: template.title.replace(/{city}/g, displayLocationName),
                  keywords: insight.keywords || "" 
             });
         } else {
             // English and cityData exists
             const selected = cityData.items[Math.floor(Math.random() * cityData.items.length)];
             setInsight(selected);
         }
         
         // Fix locationName title above
         if (currentCity.includes('Beijing') || currentCity === 'بكين' || currentCity === 'Пекин' || currentCity === 'Pekín' || currentCity === 'Pékin' || currentCity === '北京') {
             // We want to translate "Beijing" within the location name if it exists, without losing the district.
             // Usually locationName might be "Chaoyang District, Beijing" or "Beijing, Chaoyang District"
             // But if we only have the city, we can just use the fallback.
             setLocationName(prev => {
                 return prev.replace(/(Beijing|بكين|Пекин|Pekín|Pékin|北京)/g, FALLBACK_CITY_I18N[language] || FALLBACK_CITY_I18N['en']);
             });
         }
    }
  }, [language, currentCity]);

  // Styles
  const cardBg = isDark ? 'bg-[#1c1c1e]/80 border-white/20' : 'bg-white/80 border-gray-200';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className="absolute inset-0 z-20 overflow-hidden">
        {/* Dynamic Blurred Background Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
            {currentImage && (
                <img 
                    src={currentImage} 
                    alt="Background" 
                    className="w-full h-full object-cover filter blur-[20px] scale-110 transition-all duration-1000 ease-in-out opacity-50"
                />
            )}
            {/* Contrast Overlay */}
            <div className={`absolute inset-0 transition-colors duration-700 ${isDark ? 'bg-black/60' : 'bg-white/60'}`} />
        </div>

      {/* Content Layer */}
      <div className="absolute inset-0 z-10 overflow-y-auto no-scrollbar">
        <div className="min-h-full flex flex-col justify-between">
            {/* Top Header */}
            <div className="pt-12 px-6 animate-fade-in-up shrink-0">
            <h1 className={`text-3xl font-light tracking-tight ${textMain}`}>
                {greeting}
            </h1>
            <div className="flex items-center gap-2 mt-1 opacity-80">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className={`text-sm font-medium truncate max-w-[200px] ${textMain}`}>{locationName}</span>
            </div>
            </div>

            {/* Center: Daily Insight Card */}
            <div className="flex-1 flex items-center justify-center p-4 w-full max-w-md mx-auto my-2 shrink-0">
            <div className={`w-full rounded-[2rem] border shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02] animate-fade-in-up delay-100 ${cardBg} backdrop-blur-md relative`}>
                {/* Card Image */}
                <div className="h-52 bg-gray-900 relative overflow-hidden group">
                    {currentImage && (
                        <img 
                            src={currentImage}
                            alt="Local Context" 
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                        />
                    )}
                    <div className="absolute top-4 start-4 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                        <span className="text-xs font-bold text-white tracking-wider uppercase">{t('home.localInsight')}</span>
                    </div>
                    
                    {/* Unsplash Attribution */}
                    {photoCredit && (
                        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex justify-end z-10">
                            <span className="text-[10px] text-white/70 font-light tracking-wide">
                                {t('home.photoBy')} <a href={`${photoCredit.link}?utm_source=${APP_NAME}&utm_medium=referral`} target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">{photoCredit.name}</a> {t('home.on')} <a href={`https://unsplash.com/?utm_source=${APP_NAME}&utm_medium=referral`} target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">Unsplash</a>
                            </span>
                        </div>
                    )}
                </div>

                {/* Card Content */}
                <div className="p-5">
                    <div className="flex gap-4 mb-3">
                        <div className={`w-1 h-12 rounded-full ${isDark ? 'bg-indigo-500' : 'bg-indigo-600'}`}></div>
                        <p className={`text-lg font-serif italic leading-relaxed ${textMain}`}>
                            "{insight.quote}"
                        </p>
                    </div>
                    <div className="flex justify-end">
                        <span className={`text-xs font-bold uppercase tracking-widest opacity-50 ${textSub}`}>— {insight.author}</span>
                    </div>
                </div>
            </div>
            </div>

            {/* Bottom Controls */}
            <div className="pb-8 pt-4 px-8 flex items-center justify-between animate-fade-in-up delay-200 shrink-0">
            <button 
                onClick={onOpenHistory}
                className={`p-4 rounded-full transition-all active:scale-90 border backdrop-blur-md shadow-lg ${isDark ? 'bg-black/20 border-white/10 text-white hover:bg-black/40' : 'bg-white/40 border-white/40 text-gray-900 hover:bg-white/60'}`}
            >
                <IconHistory className="w-6 h-6" />
            </button>

            <div className="relative group flex flex-col items-center">
                <button 
                    onClick={onScanStart}
                    className="w-20 h-20 rounded-full border-[3px] border-white/40 flex items-center justify-center bg-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-90 transition-all duration-300 group-hover:border-white/80"
                >
                    <IconCamera className="w-8 h-8 text-white" />
                </button>
                <span className="absolute -bottom-8 text-xs font-medium tracking-widest uppercase text-white/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('home.scan')}
                </span>
            </div>

            <button 
                onClick={onOpenSettings}
                className={`p-4 rounded-full transition-all active:scale-90 border backdrop-blur-md shadow-lg ${isDark ? 'bg-black/20 border-white/10 text-white hover:bg-black/40' : 'bg-white/40 border-white/40 text-gray-900 hover:bg-white/60'}`}
            >
                <IconSettings className="w-6 h-6" />
            </button>
            </div>
        </div>
      </div>
    </div>
  );
}
