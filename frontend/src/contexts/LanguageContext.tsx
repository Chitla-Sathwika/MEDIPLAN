import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'hi' | 'te';

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

export const translations: Translations = {
  // Navigation
  appName: { en: 'MediPlain', hi: 'मेडीप्लेन', te: 'మెడిప్లైన్' },
  home: { en: 'Home', hi: 'होम', te: 'హోమ్' },
  search: { en: 'Search', hi: 'खोजें', te: 'శోధన' },
  upload: { en: 'Analyze Reports', hi: 'रिपोर्ट विश्लेषण', te: 'రిపోర్ట్ విశ్లేషణ' },
  history: { en: 'History', hi: 'इतिहास', te: 'చరిత్ర' },
  bookmarks: { en: 'Bookmarks', hi: 'बुकमार्क', te: 'బుక్‌మార్క్‌లు' },
  profile: { en: 'Profile', hi: 'प्रोफ़ाइल', te: 'ప్రొఫైల్' },
  adminPanel: { en: 'Admin Panel', hi: 'एडमिन पैनल', te: 'అడ్మిన్ ప్యానెల్' },
  logout: { en: 'Logout', hi: 'लॉगआउट', te: 'లాగ్అవుట్' },
  login: { en: 'Login', hi: 'लॉगिन', te: 'లాగిన్' },
  signup: { en: 'Sign Up', hi: 'साइन अप', te: 'సైన్ అప్' },

  // General Buttons / Labels
  submit: { en: 'Submit', hi: 'जमा करें', te: 'సమర్పించు' },
  cancel: { en: 'Cancel', hi: 'रद्द करें', te: 'రద్దు చేయి' },
  loading: { en: 'Loading...', hi: 'लोड हो रहा है...', te: 'లోడ్ అవుతోంది...' },
  save: { en: 'Save Changes', hi: 'बदलाव सहेजें', te: 'మార్పులను సేవ్ చేయి' },
  darkMode: { en: 'Dark Mode', hi: 'डार्क मोड', te: 'డార్క్ మోడ్' },
  lightMode: { en: 'Light Mode', hi: 'लाइट मोड', te: 'లైట్ మోడ్' },
  language: { en: 'Language', hi: 'भाषा', te: 'భాష' },
  welcome: { en: 'Welcome back', hi: 'आपका स्वागत है', te: 'స్వాగతం' },

  // Home Page
  searchPlaceholder: { 
    en: 'Search medicines, medical tests, or diseases...', 
    hi: 'दवाएं, मेडिकल टेस्ट, या बीमारियों की खोज करें...', 
    te: 'మందులు, వైద్య పరీక్షలు లేదా వ్యాధుల కోసం వెతకండి...' 
  },
  voiceSearchTooltip: { 
    en: 'Search by voice', 
    hi: 'आवाज से खोजें', 
    te: 'వాయిస్ ద్వారా శోధించండి' 
  },
  heroTitle: {
    en: 'Understand Your Health in Simple Words',
    hi: 'अपने स्वास्थ्य को सरल शब्दों में समझें',
    te: 'మీ ఆరోగ్యాన్ని సులభమైన మాటల్లో అర్థం చేసుకోండి'
  },
  heroSubtitle: {
    en: 'MediPlain translates complicated medical jargon, prescriptions, and lab reports into clear information in Hindi, Telugu, and English.',
    hi: 'मेडीप्लेन जटिल मेडिकल शब्दावली, नुस्खे (प्रिस्क्रिप्शन) और लैब रिपोर्ट को हिंदी, तेलुगु और अंग्रेजी में सरल भाषा में समझाता है।',
    te: 'మెడిప్లైన్ క్లిష్టమైన వైద్య పదాలు, ప్రిస్క్రిప్షన్లు మరియు ల్యాబ్ నివేదికలను హిందీ, తెలుగు మరియు ఇంగ్లీష్ లో సులభంగా వివరిస్తుంది.'
  },
  featureOCRTitle: { en: 'Scan Medical Reports', hi: 'मेडिकल रिपोर्ट स्कैन करें', te: 'వైద్య నివేదికలను స్కాన్ చేయండి' },
  featureOCRDesc: { 
    en: 'Upload bills, prescriptions, or laboratory documents. Extract details using OCR and let AI break down the values.', 
    hi: 'बिल, नुस्खे या प्रयोगशाला के दस्तावेज अपलोड करें। ओसीआर का उपयोग कर विवरण निकालें और एआई से सरल अर्थ समझें।', 
    te: 'బిల్లులు, ప్రిస్క్రిప్షన్లు లేదా ల్యాబ్ పత్రాలను అప్‌లోడ్ చేయండి. OCR ద్వారా వివరాలను సేకరించి AI ద్వారా అర్థం చేసుకోండి.' 
  },
  featureSearchTitle: { en: 'Intelligent Health Directory', hi: 'बुद्धिमान स्वास्थ्य निर्देशिका', te: 'తెలివైన ఆరోగ్య సూచిక' },
  featureSearchDesc: {
    en: 'Search thousands of medicines, diagnostic tests, and diseases with full multi-language translations and voice read-outs.',
    hi: 'हजारों दवाओं, नैदानिक परीक्षणों और बीमारियों की पूरी बहुभाषी अनुवादों और आवाज के साथ खोजें।',
    te: 'వేలాది మందులు, పరీక్షలు మరియు వ్యాధుల గురించి పూర్తి బహుభాషా అనువాదాలు మరియు వాయిస్ అవుట్‌పుట్‌తో శోధించండి.'
  },
  featureVoiceTitle: { en: 'Voice Enabled Support', hi: 'आवाज सहायता', te: 'వాయిస్ మద్దతు' },
  featureVoiceDesc: {
    en: 'Speak to search in your native tongue, and read the AI breakdown aloud using high-fidelity text-to-speech.',
    hi: 'अपनी मातृभाषा में बोलकर खोजें, और उच्च गुणवत्ता वाले टेक्स्ट-टू-स्पीच का उपयोग करके एआई विश्लेषण को जोर से सुनें।',
    te: 'మీ మాతృభాషలో మాట్లాడి శోధించండి మరియు అధిక నాణ్యత గల టెక్స్ట్-టు-స్పీచ్ ఉపయోగించి వివరణను వినండి.'
  },

  // OCR Upload Page
  uploadTitle: { en: 'Upload Health Documents', hi: 'स्वास्थ्य दस्तावेज अपलोड करें', te: 'ఆరోగ్య పత్రాలను అప్‌లోడ్ చేయండి' },
  uploadSubtitle: { 
    en: 'Select prescription receipts, laboratory panels, or clinic bills. Supported formats: PNG, JPG, JPEG.', 
    hi: 'नुस्खे की रसीदें, प्रयोगशाला रिपोर्ट या क्लिनिक बिल चुनें। समर्थित प्रारूप: PNG, JPG, JPEG.', 
    te: 'ప్రిస్క్రిప్షన్ రశీదులు, ల్యాబ్ రిపోర్టులు లేదా క్లినిక్ బిల్లులను ఎంచుకోండి. మద్దతు ఉన్న ఫార్మాట్లు: PNG, JPG, JPEG.' 
  },
  dragDropText: { 
    en: 'Drag and drop your image file here, or click to browse', 
    hi: 'अपनी छवि फ़ाइल को यहाँ खींचें और छोड़ें, या ब्राउज़ करने के लिए क्लिक करें', 
    te: 'మీ ఇమేజ్ ఫైల్‌ను ఇక్కడకు డ్రాగ్ చేసి వదలండి లేదా బ్రౌజ్ చేయడానికి క్లిక్ చేయండి' 
  },
  selectReportType: { en: 'Select Document Type', hi: 'दस्तावेज प्रकार चुनें', te: 'పత్రం రకాన్ని ఎంచుకోండి' },
  prescription: { en: 'Doctor Prescription', hi: 'डॉक्टर का पर्चा', te: 'వైద్యుని ప్రిస్క్రిప్షన్' },
  labReport: { en: 'Laboratory Report', hi: 'प्रयोगशाला रिपोर्ट', te: 'ల్యాబ్ రిపోర్ట్' },
  bill: { en: 'Hospital/Medical Bill', hi: 'अस्पताल/मेडिकल बिल', te: 'హాస్పిటల్/మెడికల్ బిల్లు' },
  analyzeBtn: { en: 'Extract & Explain Report', hi: 'रिपोर्ट निकालें और समझाएं', te: 'వివరాలు సేకరించి వివరించు' },
  ocrProcessing: { en: 'Processing OCR & AI explanation...', hi: 'ओसीआर और एआई विश्लेषण चल रहा है...', te: 'OCR మరియు AI వివరణ ప్రక్రియ జరుగుతోంది...' },

  // Explanation Page
  reportAnalysisResult: { en: 'Medical Report AI Analysis', hi: 'मेडिकल रिपोर्ट एआई विश्लेषण', te: 'వైద్య నిवेదిక AI విశ్లేషణ' },
  detectedItemsTitle: { en: 'Identified Health Entities', hi: 'पहचाने गए स्वास्थ्य विवरण', te: 'గుర్తించబడిన ఆరోగ్య అంశాలు' },
  detectedMedicines: { en: 'Detected Medicines', hi: 'पहचानी गई दवाएं', te: 'గుర్తించబడిన మందులు' },
  detectedTests: { en: 'Detected Medical Tests', hi: 'पहचाने गए मेडिकल टेस्ट', te: 'గుర్తించబడిన వైద్య పరీక్షలు' },
  detectedDiseases: { en: 'Detected Diseases', hi: 'पहचानी गई बीमारियां', te: 'గుర్తించబడిన వ్యాధులు' },
  readAloud: { en: 'Read Explanation Aloud', hi: 'विश्लेषण बोलकर सुनें', te: 'వివరణను బిగ్గరగా వినండి' },
  stopReading: { en: 'Stop Voice', hi: 'आवाज रोकें', te: 'ఆపండి' },
  aiMeaning: { en: 'Meaning & Summary', hi: 'अर्थ और सारांश', te: 'అర్థం & సారాంశం' },
  aiPurpose: { en: 'Purpose / Clinical Reasons', hi: 'उद्देश्य / नैदानिक कारण', te: 'ఉద్దేశ్యం / క్లినికల్ కారణాలు' },
  aiWarnings: { en: 'Precautions & Warnings', hi: 'सावधानियां और चेतावनी', te: 'జాగ్రత్తలు & హెచ్చరికలు' },
  aiAbnormal: { en: 'Abnormal Values / Important Charges', hi: 'असामान्य मूल्य / महत्वपूर्ण शुल्क', te: 'అసాధారణ విలువలు / ముఖ్యమైన ఛార్జీలు' },
  aiLifestyle: { en: 'Dietary & Lifestyle Advice', hi: 'आहार और जीवनशैली सलाह', te: 'ఆహారం & జీవనశైలి సలహా' },
  aiDisclaimer: { en: 'Medical Disclaimer', hi: 'चिकित्सा अस्वीकरण', te: 'వైద్య నిరాకరణ' },

  // Detail Pages
  prescriptionRequired: { en: 'Prescription Required', hi: 'पर्चे की आवश्यकता है', te: 'ప్రిస్క్రిప్షన్ అవసరం' },
  otc: { en: 'Over the Counter (OTC)', hi: 'बिना पर्चे की दवा (OTC)', te: 'ఓవర్ ది కౌంటర్ (OTC)' },
  genericName: { en: 'Generic Chemical Name', hi: 'जेनेरिक रासायनिक नाम', te: 'జెనెరిక్ రసాయన నామం' },
  brandName: { en: 'Common Brand Names', hi: 'आम ब्रांड नाम', te: 'సాధారణ బ్రాండ్ పేర్లు' },
  strength: { en: 'Strength Available', hi: 'उपलब्ध ताकत', te: 'లభ్యమయ్యే మోతాదు' },
  dosage: { en: 'Standard Dosage', hi: 'मानक खुराक', te: 'సాధారణ మోతాదు' },
  uses: { en: 'Clinical Uses', hi: 'नैदानिक उपयोग', te: 'వైద్య ఉపయోగాలు' },
  sideEffects: { en: 'Possible Side Effects', hi: 'संभावित दुष्प्रभाव', te: 'దుష్ప్రభావాలు' },
  warnings: { en: 'Critical Warnings', hi: 'महत्वपूर्ण चेतावनी', te: 'ముఖ్యమైన హెచ్చరికలు' },
  precautions: { en: 'Special Precautions', hi: 'विशेष सावधानियां', te: 'ప్రత్యేక జాగ్రత్తలు' },
  storage: { en: 'Storage Conditions', hi: 'भंडारण की स्थिति', te: 'నిల్వ పరిస్థితులు' },
  manufacturer: { en: 'Manufacturer', hi: 'निर्माता', te: 'తయారీదారు' },
  category: { en: 'Medical Category', hi: 'चिकित्सा श्रेणी', te: 'వైద్య వర్గం' },

  purposeTest: { en: 'Test Purpose', hi: 'परीक्षण का उद्देश्य', te: 'పరీక్ష ఉద్దేశ్యం' },
  sampleType: { en: 'Required Sample Type', hi: 'आवश्यक नमूना प्रकार', te: 'అవసరమైన నమూనా రకం' },
  normalRange: { en: 'Reference Normal Range', hi: 'सामान्य सीमा संदर्भ', te: 'సాధారణ పరిమితి' },
  highMeaning: { en: 'Meaning of High Values', hi: 'उच्च मूल्यों का अर्थ', te: 'అధిక విలువల అర్థం' },
  lowMeaning: { en: 'Meaning of Low Values', hi: 'कम मूल्यों का अर्थ', te: 'తక్కువ విలువల అర్థం' },
  preparation: { en: 'Patient Preparation', hi: 'रोगी की तैयारी (जैसे उपवास)', te: 'పరీక్షకు సిద్ధపడటం' },

  symptoms: { en: 'Common Symptoms', hi: 'सामान्य लक्षण', te: 'సాధారణ లక్షణాలు' },
  causes: { en: 'Primary Causes', hi: 'प्राथमिक कारण', te: 'ముఖ్య కారణాలు' },
  riskFactors: { en: 'Key Risk Factors', hi: 'प्रमुख जोखिम कारक', te: 'ప్రమాద కారకాలు' },
  diagnosis: { en: 'Diagnostic Methods', hi: 'निदान के तरीके', te: 'వ్యాధి నిర్ధారణ పద్ధతులు' },
  treatment: { en: 'Treatment Options', hi: 'उपचार के विकल्प', te: 'చికిత్స పద్ధతులు' },
  prevention: { en: 'Prevention Methods', hi: 'बचाव के तरीके', te: 'నివారణ చర్యలు' },
  emergencySymptoms: { en: 'Emergency Red Flags', hi: 'आपातकालीन चेतावनी संकेत', te: 'అత్యవసర లక్షణాలు' },

  // Bookmarks & Search History
  noBookmarks: { en: 'You have not bookmarked anything yet.', hi: 'आपने अभी तक कुछ भी बुकमार्क नहीं किया है।', te: 'మీరు ఇంకా దేనినీ బుక్‌మార్క్ చేయలేదు.' },
  noHistory: { en: 'Search history is empty.', hi: 'खोज इतिहास खाली है।', te: 'శోధన చరిత్ర ఖాళీగా ఉంది.' },
  clearHistoryBtn: { en: 'Clear History', hi: 'इतिहास साफ़ करें', te: 'చరిత్రను క్లియర్ చేయి' }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    return saved === 'en' || saved === 'hi' || saved === 'te' ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      // Fallback to key name if translation is missing
      return key;
    }
    return translation[language] || translation['en'] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
