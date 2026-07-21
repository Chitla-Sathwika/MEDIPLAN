import { GoogleGenerativeAI } from '@google/generative-ai';

const getMockExplanation = (language: 'en' | 'hi' | 'te') => {
  if (language === 'hi') {
    return {
      meaning: "यह एक सिम्युलेटेड मेडिकल रिपोर्ट विश्लेषण है (जेमिनी एपीआई कुंजी कॉन्फ़िगर नहीं है)।",
      purpose: "सिम्युलेटेड लैब चेकअप या प्रिस्क्रिप्शन विश्लेषण।",
      warnings: "बिना डॉक्टर की सलाह के कोई दवा न लें।",
      abnormalValues: "जेमिनी एपीआई कुंजी के बिना असामान्य मूल्यों का निर्धारण नहीं किया जा सका।",
      lifestyleAdvice: "स्वस्थ संतुलित आहार लें और खूब पानी पिएं।",
      disclaimer: "यह एक सिम्युलेटेड प्रतिक्रिया है। लाइव एआई स्पष्टीकरण के लिए कृपया बैकएंड .env में GEMINI_API_KEY को कॉन्फ़िगर करें।"
    };
  }
  
  if (language === 'te') {
    return {
      meaning: "ఇది ఒక సిమ్యులేటెడ్ మెడికల్ రిపోర్ట్ విశ్లేషణ (జెమిని API కీ కాన్ఫిగర్ చేయబడలేదు).",
      purpose: "సిమ్యులేటెడ్ ల్యాబ్ చెకప్ లేదా ప్రిస్క్రిప్షన్ విశ్లేషణ.",
      warnings: "వైద్యుని సలహా లేకుండా మందులు వాడకండి.",
      abnormalValues: "జెమిని API కీ లేకుండా అసాధారణ విలువలను గుర్తించడం సాధ్యం కాలేదు.",
      lifestyleAdvice: "ఆరోగ్యకరమైన సమతుల్య ఆహారం తీసుకోండి మరియు పుష్కలంగా నీరు త్రాగాలి.",
      disclaimer: "ఇది ఒక సిమ్యులేటెడ్ ప్రతిస్పందన. లైవ్ AI వివరణ కోసం దయచేసి బ్యాకెండ్ .env లో GEMINI_API_KEY ని కాన్ఫిగర్ చేయండి."
    };
  }

  return {
    meaning: "This is a simulated medical report breakdown (Gemini API key is not configured in .env).",
    purpose: "Simulated laboratory checkup or prescription analysis.",
    warnings: "Do not take unprescribed medicine. Consult your physician immediately.",
    abnormalValues: "No real abnormal values could be determined without Gemini API configuration.",
    lifestyleAdvice: "Maintain a healthy balanced diet, exercise regularly, and drink plenty of water.",
    disclaimer: "This is a simulated placeholder response. Please configure GEMINI_API_KEY in the backend .env file to enable live AI explanation."
  };
};

export const explainReportWithAI = async (
  text: string,
  reportType: 'prescription' | 'lab_report' | 'bill',
  language: 'en' | 'hi' | 'te' = 'en'
): Promise<any> => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.startsWith('your_gemini_api_key')) {
    console.warn('[Gemini Service] GEMINI_API_KEY is not set. Returning fallback mock response.');
    return getMockExplanation(language);
  }

  try {
    const ai = new GoogleGenerativeAI(apiKey);
    
    // Using gemini-1.5-flash as it is fast and supports JSON output
    const model = ai.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const langName = language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English';

    const prompt = `
      You are an expert medical translation and healthcare assistant.
      Your task is to analyze the following OCR-extracted text from a medical ${reportType} and explain it in clear, simple language suitable for a patient who has no medical background.
      
      You MUST write your entire response, all explanations, and all values in the ${langName} language.
      
      Do not provide a formal medical diagnosis or treat this as clinical advice. Always remind the patient to consult a doctor.

      TEXT TO ANALYZE:
      """
      ${text}
      """

      You must return a JSON object with the following keys, populated with content in ${langName}:
      {
        "meaning": "A brief summary of what this report/bill/prescription indicates.",
        "purpose": "Why these tests were ordered or why these medicines were prescribed.",
        "warnings": "Safety precautions, red flags, important warnings, or drug instructions.",
        "abnormalValues": "Highlights of any values that seem high, low, abnormal, or significant charges on bills.",
        "lifestyleAdvice": "Simple, actionable dietary, physical, or preventative lifestyle advice based on the findings.",
        "disclaimer": "A professional disclaimer stating that this AI output is for informational purposes only and they must consult their doctor."
      }
    `;

    console.log(`Sending prompt to Gemini API in ${langName} mode...`);
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const responseText = result.response.text();
    console.log('Gemini API response received.');
    
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // If Gemini fails, fallback to mock instead of crashing the process
    return getMockExplanation(language);
  }
};
