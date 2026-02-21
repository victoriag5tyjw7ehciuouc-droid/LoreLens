

export interface DecipherResult {
  title: string;
  essence: string;
  mirrorInsight: string;
  philosophy: string;
  quickAction: string;
  mapUri?: string; // URL from Google Maps grounding
}

export interface HistoryItem extends DecipherResult {
  id: string;
  timestamp: number;
  thumbnail?: string; // Base64 thumbnail string
  location?: {
    lat: number;
    lng: number;
  };
}

export interface DailyRecapResult {
  journal: string; // The poetic summary
  score: number; // The Resonance Score (0-100)
  mood: string; // Single word mood
  tags: string[];
  philosophicalTake: string; // e.g., "You focus on stillness..."
  archetype: string; // e.g., "The Socratic Observer"
}

export enum ViewState {
  CAMERA = 'CAMERA',
  HISTORY = 'HISTORY',
  SETTINGS = 'SETTINGS',
  MAP = 'MAP'
}

export type AppTheme = 'dark' | 'light';
export type AppFontSize = 'small' | 'medium' | 'large';
export type AppLanguage = 'en' | 'zh' | 'ja' | 'es' | 'fr';

export const TRANSLATIONS = {
  en: {
    greeting: {
      morning: "Good morning",
      afternoon: "Good afternoon",
      evening: "Good evening"
    },
    home: {
      localInsight: "Local Insight",
      scan: "Scan to Decipher",
      photoBy: "Photo by",
      on: "on"
    },
    settings: {
      title: "Settings",
      language: "Language",
      appearance: "Appearance",
      preferences: "Preferences",
      data: "Data",
      midnight: "Midnight",
      porcelain: "Porcelain",
      saveGallery: "Save Photos to Gallery",
      highResAudio: "High-Res Audio",
      highResDesc: "Enable \"Read Aloud\" button in results",
      clearHistory: "Clear History",
      confirmClear: "Tap again to Confirm",
      itemsInStorage: "items in storage"
    },
    result: {
      essence: "The Essence",
      mirror: "Mirror Insight",
      philosophy: "Philosophy",
      action: "Try this",
      share: "Copied to clipboard",
      shareError: "Unable to share"
    },
    history: {
      title: "My Discoveries",
      empty: "No discoveries yet.",
      emptySub: "Go capture something!",
      recapButton: "Resonance Review",
      dailyJournal: "The Axis Map",
      writing: "Calculating resonance...",
      noItemsToday: "No discoveries found for today.",
      curiosityScore: "Resonance Score",
      mood: "Mood"
    },
    map: {
      title: "Discovery Map",
      openMaps: "Open in Google Maps"
    }
  },
  zh: {
    greeting: {
      morning: "早上好",
      afternoon: "下午好",
      evening: "晚上好"
    },
    home: {
      localInsight: "本地洞察",
      scan: "扫描解读",
      photoBy: "摄影师",
      on: "来自"
    },
    settings: {
      title: "设置",
      language: "语言",
      appearance: "外观",
      preferences: "偏好",
      data: "数据",
      midnight: "深邃黑",
      porcelain: "陶瓷白",
      saveGallery: "保存照片到相册",
      highResAudio: "高清语音朗读",
      highResDesc: "在结果页启用“朗读”按钮",
      clearHistory: "清除历史记录",
      confirmClear: "再次点击确认",
      itemsInStorage: "个项目已存储"
    },
    result: {
      essence: "本质",
      mirror: "镜像洞察",
      philosophy: "文化逻辑",
      action: "试一试",
      share: "已复制到剪贴板",
      shareError: "分享失败"
    },
    history: {
      title: "我的发现",
      empty: "暂无发现",
      emptySub: "去探索一下吧！",
      recapButton: "共鸣回顾",
      dailyJournal: "时空轴线",
      writing: "正在计算文化共鸣...",
      noItemsToday: "今天还没有新的发现哦。",
      curiosityScore: "共鸣指数",
      mood: "今日心情"
    },
    map: {
      title: "发现地图",
      openMaps: "在 Google Maps 打开"
    }
  },
  ja: {
    greeting: {
      morning: "おはようございます",
      afternoon: "こんにちは",
      evening: "こんばんは"
    },
    home: {
      localInsight: "ローカルインサイト",
      scan: "スキャンして解読",
      photoBy: "写真:",
      on: "提供:"
    },
    settings: {
      title: "設定",
      language: "言語",
      appearance: "外観",
      preferences: "設定",
      data: "データ",
      midnight: "ミッドナイト",
      porcelain: "ポーセリン",
      saveGallery: "写真をギャラリーに保存",
      highResAudio: "高音質オーディオ",
      highResDesc: "結果で「読み上げ」を有効にする",
      clearHistory: "履歴を消去",
      confirmClear: "もう一度タップして確認",
      itemsInStorage: "件のアイテム"
    },
    result: {
      essence: "本質",
      mirror: "比較洞察",
      philosophy: "哲学的背景",
      action: "試してみよう",
      share: "クリップボードにコピーしました",
      shareError: "共有できません"
    },
    history: {
      title: "発見したこと",
      empty: "まだ発見はありません",
      emptySub: "何か撮ってみましょう！",
      recapButton: "共鳴レビュー",
      dailyJournal: "時間の軸",
      writing: "共鳴を計算中...",
      noItemsToday: "今日の発見はまだありません。",
      curiosityScore: "共鳴スコア",
      mood: "気分"
    },
    map: {
      title: "発見マップ",
      openMaps: "Google Mapsで開く"
    }
  },
  es: {
    greeting: {
      morning: "Buenos días",
      afternoon: "Buenas tardes",
      evening: "Buenas noches"
    },
    home: {
      localInsight: "Visión Local",
      scan: "Escanear",
      photoBy: "Foto de",
      on: "en"
    },
    settings: {
      title: "Ajustes",
      language: "Idioma",
      appearance: "Apariencia",
      preferences: "Preferencias",
      data: "Datos",
      midnight: "Medianoche",
      porcelain: "Porcelana",
      saveGallery: "Guardar fotos",
      highResAudio: "Audio Alta Res",
      highResDesc: "Activar \"Leer en voz alta\"",
      clearHistory: "Borrar historial",
      confirmClear: "Toca de nuevo para confirmar",
      itemsInStorage: "elementos guardados"
    },
    result: {
      essence: "La Esencia",
      mirror: "Espejo Cultural",
      philosophy: "Filosofía",
      action: "Prueba esto",
      share: "Copiado al portapapeles",
      shareError: "No se pudo compartir"
    },
    history: {
      title: "Mis Descubrimientos",
      empty: "Sin descubrimientos.",
      emptySub: "¡Ve a capturar algo!",
      recapButton: "Resonancia",
      dailyJournal: "El Eje",
      writing: "Calculando resonancia...",
      noItemsToday: "No hay descubrimientos hoy.",
      curiosityScore: "Puntaje de Resonancia",
      mood: "Estado de ánimo"
    },
    map: {
      title: "Mapa de Hallazgos",
      openMaps: "Abrir en Google Maps"
    }
  },
  fr: {
    greeting: {
      morning: "Bonjour",
      afternoon: "Bonne après-midi",
      evening: "Bonsoir"
    },
    home: {
      localInsight: "Aperçu Local",
      scan: "Scanner",
      photoBy: "Photo par",
      on: "sur"
    },
    settings: {
      title: "Paramètres",
      language: "Langue",
      appearance: "Apparence",
      preferences: "Préférences",
      data: "Données",
      midnight: "Minuit",
      porcelain: "Porcelaine",
      saveGallery: "Enregistrer les photos",
      highResAudio: "Audio Haute Rés",
      highResDesc: "Activer la lecture à voix haute",
      clearHistory: "Effacer l'historique",
      confirmClear: "Appuyez à nouveau pour confirmer",
      itemsInStorage: "éléments stockés"
    },
    result: {
      essence: "L'Essence",
      mirror: "Miroir Culturel",
      philosophy: "Philosophie",
      action: "Essayez ceci",
      share: "Copié dans le presse-papiers",
      shareError: "Impossible de partager"
    },
    history: {
      title: "Mes Découvertes",
      empty: "Aucune découverte.",
      emptySub: "Allez capturer quelque chose !",
      recapButton: "Résonance",
      dailyJournal: "L'Axe du Temps",
      writing: "Calcul de la résonance...",
      noItemsToday: "Aucune découverte aujourd'hui.",
      curiosityScore: "Score de Résonance",
      mood: "Humeur"
    },
    map: {
      title: "Carte des Découvertes",
      openMaps: "Ouvrir dans Google Maps"
    }
  }
};