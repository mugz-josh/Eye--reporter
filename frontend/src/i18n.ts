import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { translateText, getLanguageCode } from "./services/translationService";

const resources = {
  en: {
    translation: {
      "hero.title": "Empower Your Voice, Drive Change in Your Community",
      "hero.description":
        "Report corruption and issues requiring government intervention. Join thousands making Africa more transparent.",
      "nav.features": "Features",
      "nav.howItWorks": "How It Works",
      "nav.impact": "Impact",
      login: "Login",
      getStarted: "Get Started",
      trustedBy: "Trusted by 10,000+ Citizens",
      secureAnonymous: "Secure & Anonymous",
      realTimeTracking: "Real-time Tracking",
      communityDriven: "Community Driven",
      activeCitizens: "Active Citizens",
      reportsSubmitted: "Reports Submitted",
      issuesResolved: "Issues Resolved",
      simpleProcess: "Simple, Transparent Process",
      createAccount: "Create Account",
      submitReport: "Submit Report",
      trackProgress: "Track Progress",
      seeChange: "See Change",
      twoWays: "Two Ways to Make a Difference",
      redFlagReports: "Red-Flag Reports",
      interventionRequests: "Intervention Requests",
      redFlagDesc:
        "Report corruption, bribery, embezzlement, and misconduct by public officials.",
      interventionDesc:
        "Report broken roads, faulty streetlights, understocked hospitals.",
      anonymousReporting: "Anonymous reporting option",
      uploadEvidence: "Upload evidence (photos, videos)",
      trackStatus: "Track investigation status",
      preciseMapping: "Precise location mapping",
      visualDoc: "Visual documentation",
      resolutionUpdates: "Resolution updates",
      "process.step1.desc": "Create an account securely",
      "process.step2.desc": "Submit your report with evidence",
      "process.step3.desc": "Track progress in real time",
      "process.step4.desc": "Get notified when action is taken",
      "hero.badge": "Trusted by 10,000+ Citizens",
      "learnMore": "Learn More",
      "stats.subtitle": "Together, we're building more transparent and accountable communities",
      "process.subtitle": "From report to resolution in four easy steps",
      "process.step1.detail": "Sign up with your email and create a secure account",
      "process.step2.detail": "Describe the issue, add location, and upload evidence",
      "process.step3.detail": "Monitor your report status from draft to resolution",
      "process.step4.detail": "Get notified when authorities take action",
      "reportTypes.subtitle": "Whether it's corruption or broken infrastructure, your voice matters",
      "testimonials.title": "What Our Users Say",
      "testimonials.subtitle": "Hear from citizens who have made a difference",
      "testimonial1.quote": "iReporter helped me report corruption in my local government. The process was secure and anonymous, and I saw real change.",
      "testimonial1.name": "Sarah Johnson",
      "testimonial1.role": "Community Activist",
      "testimonial2.quote": "Reporting infrastructure issues has never been easier. The app's location mapping and tracking features are fantastic.",
      "testimonial2.name": "Michael Chen",
      "testimonial2.role": "Local Resident",
      "testimonial3.quote": "As a journalist, iReporter has been invaluable for gathering citizen reports and holding authorities accountable.",
      "testimonial3.name": "Amina Okafor",
      "testimonial3.role": "Investigative Journalist",
      "recentSuccess": "Recent Success Stories",
      "seeChangeCommunity": "See how your reports are making a difference in communities across Africa",
      "resolved": "Resolved",
      "redFlagReport": "Red-Flag Report",
      "interventionRequest": "Intervention Request",
      "healthcareIssue": "Healthcare Issue",
      "story1.title": "Corruption in Local Government",
      "story1.desc": "A citizen reported embezzlement of public funds by local officials. The report led to a full investigation, recovery of stolen funds, and prosecution of those involved.",
      "fundsRecovered": "Funds Recovered",
      "officialsCharged": "Officials Charged",
      "daysToResolution": "Days to Resolution",
      "story2.title": "Broken Street Lights Fixed",
      "story2.desc": "Community members reported non-functional street lights affecting safety. Authorities responded within 48 hours, repairing 15 lights and improving neighborhood security.",
      "lightsRepaired": "Lights Repaired",
      "responseTime": "Response Time",
      "citizensBenefited": "Citizens Benefited",
      "story3.title": "Hospital Equipment Restored",
      "story3.desc": "Reports of malfunctioning medical equipment in a public hospital led to immediate repairs and restocking of essential supplies, improving healthcare delivery.",
      "equipmentFixed": "Equipment Fixed",
      "patientsHelped": "Patients Helped",
      "viewAllStories": "View All Success Stories",
      "trustedPartners": "Trusted Partners",
      "workingTogether": "Working together to build transparent communities",
      "getApp": "Get the App",
      "appDesc": "Download our mobile app for on-the-go reporting and tracking",
      "downloadOnThe": "Download on the",
      "appStore": "App Store",
      "getItOn": "Get it on",
      "googlePlay": "Google Play",
      "readyToMakeDifference": "Ready to Make a Difference?",
      "joinThousands": "Join thousands of citizens making Africa more transparent and accountable",
      "createAccountBtn": "Create Account",
      "loginBtn": "Login",
      "partner1": "Transparency International",
      "partner2": "Amnesty International",
      "partner3": "United Nations",
      "partner4": "African Union",
      "partner5": "World Bank",
      "partner6": "Local Governments",
      "story1.location": "Lagos, Nigeria",
      "story2.location": "Nairobi, Kenya",
      "story3.location": "Accra, Ghana",
    },
  },

  sw: {
    translation: {
      "hero.title": "Ipe Sauti Yako Nguvu, Endesha Mabadiliko Katika Jamii Yako",
      "hero.description":
        "Ripoti rushwa na masuala mengine yanayohitaji kuingilia kati kwa serikali moja kwa moja kwa mamlaka husika.",
      login: "Ingia",
      getStarted: "Anza",
      "process.step1.desc": "Unda akaunti salama",
      "process.step2.desc": "Wasilisha ripoti yako pamoja na ushahidi",
      "process.step3.desc": "Fuatilia maendeleo kwa wakati halisi",
      "process.step4.desc": "Pata taarifa hatua inapochukuliwa",
    },
  },

  lg: {
    translation: {
      "hero.title": "Twala Eddoboozi Lyo, Leta Enkyukakyuka Mu Kitundu Kyo",
      "hero.description":
        "Langa obulyake n’ebizibu ebirala ebyetaaga okuddukanyizibwa gavumenti.",
      login: "Yingira",
      getStarted: "Tandika",
    },
  },

  rn: {
    translation: {
      "hero.title":
        "Ha Amajwi Yawe Amandla, Hindura Umuryango Wawe",
      "hero.description":
        "Menyesha ruswa n'ibindi bibazo bisaba kwitabwaho na leta.",
      login: "Injira",
      getStarted: "Tangira",
    },
  },

  xog: {
    translation: {
      "hero.title": "Wa Eddoboozi Lyo Amaanyi, Leta Enkyukakyuka",
      "hero.description":
        "Langa obubbi n’ebizibu ebirala ebyetaaga obuyambi bwa gavumenti.",
      login: "Yingira",
      getStarted: "Tandika",
    },
  },

  ar: {
    translation: {
      "hero.title": "امنح صوتك القوة واصنع التغيير في مجتمعك",
      "hero.description":
        "أبلغ عن الفساد وأي قضايا أخرى تتطلب تدخل الحكومة مباشرة.",
      login: "تسجيل الدخول",
      getStarted: "ابدأ الآن",
    },
  },

  pt: {
    translation: {
      "hero.title":
        "Dê Poder à Sua Voz e Promova Mudanças na Sua Comunidade",
      "hero.description":
        "Reporte corrupção e outros problemas que exigem intervenção governamental.",
      login: "Entrar",
      getStarted: "Começar",
    },
  },

  zu: {
    translation: {
      "hero.title":
        "Nikeza Amandla Izwi Lakho, Yenza Ushintsho Emphakathini Wakho",
      "hero.description":
        "Bika inkohlakalo nanoma yiziphi ezinye izinkinga ezidinga ukungenelela kukahulumeni ngqo kuziphathimandla.",
      "nav.features": "Izici",
      "nav.howItWorks": "Kusebenza Kanjani",
      "nav.impact": "Umthelela",
      login: "Ngena",
      getStarted: "Qala",
      trustedBy: "Kuthembekile ngabantu abangaphezu kuka-10,000",
      secureAnonymous: "Kuphephile Futhi Akubonakali",
      realTimeTracking: "Ukuthungatha Ngesikhathi Sangempela",
      communityDriven: "Iqhutshwa Umphakathi",
      activeCitizens: "Izakhamizi Ezisebenzayo",
      reportsSubmitted: "Imibiko Ethunyelwe",
      issuesResolved: "Izinkinga Ezixazululiwe",
      simpleProcess: "Inqubo Elula Futhi Esobala",
      createAccount: "Dala I-Akhawunti",
      submitReport: "Thumela Umbiko",
      trackProgress: "Landela Inqubekela Phambili",
      seeChange: "Bona Ushintsho",
      twoWays: "Izindlela Ezimbili Zokwenza Umehluko",
      redFlagReports: "Imibiko Yefulegi Elibomvu",
      interventionRequests: "Izicelo Zokungenelela",
      redFlagDesc:
        "Bika izehlakalo zenkohlakalo, ukufumbathisa, ukweba imali, nezinye izindlela zokungaziphathi kahle.",
      interventionDesc:
        "Bika izinkinga zengqalasizinda njengemigwaqo ephukile noma izakhiwo zomphakathi ezilimele.",
      anonymousReporting: "Inketho yokubika ngokungaziwa",
      uploadEvidence: "Layisha ubufakazi",
      trackStatus: "Landela isimo sophenyo",
      preciseMapping: "Ukudweba imephu ngokunembile",
      visualDoc: "Imibhalo ebonakalayo",
      resolutionUpdates: "Izibuyekezo zokuxazulula",
      "process.step1.desc":
        "Bhalisa nge-imeyili yakho futhi udale i-akhawunti ephephile",
      "process.step2.desc":
        "Chaza inkinga bese ulayisha ubufakazi",
      "process.step3.desc":
        "Qapha isimo sombiko wakho kusukela ekuqaleni kuya ekuxazululweni",
      "process.step4.desc":
        "Thola isaziso lapho iziphathimandla zithatha isinyathelo",
    },
  },

  fr: {
    translation: {
      "hero.title": "Donnez du Pouvoir à Votre Voix, Créez le Changement dans Votre Communauté",
      "hero.description":
        "Signalez la corruption et d'autres problèmes nécessitant une intervention gouvernementale directement aux autorités.",
      login: "Se connecter",
      getStarted: "Commencer",
      "partner1": "Transparency International",
      "partner2": "Amnesty International",
      "partner3": "Nations Unies",
      "partner4": "Union Africaine",
      "partner5": "Banque Mondiale",
      "partner6": "Gouvernements Locaux",
      "story1.location": "Lagos, Nigéria",
      "story2.location": "Nairobi, Kenya",
      "story3.location": "Accra, Ghana",
    },
  },

  yo: {
    translation: {
      "hero.title": "Fun Agbara si Ohùn Rẹ, Ṣe Iyipada ni Agbegbe Rẹ",
      "hero.description":
        "Ròyìn ìwà ìbàjẹ́ àti àwọn ìṣòro mìíràn tí ó nílò ìdásìlẹ̀ ìjọba tààràtàà sí àwọn aláṣẹ.",
      login: "Wọlé",
      getStarted: "Bẹ̀rẹ̀",
      "partner1": "Transparency International",
      "partner2": "Amnesty International",
      "partner3": "United Nations",
      "partner4": "African Union",
      "partner5": "World Bank",
      "partner6": "Local Governments",
      "story1.location": "Lagos, Nigeria",
      "story2.location": "Nairobi, Kenya",
      "story3.location": "Accra, Ghana",
    },
  },

  am: {
    translation: {
      "hero.title": "ቃል አስተሳሪ ለመስጠት እና በማህበረሰብ አለም ለመለወጥ",
      "hero.description":
        "ምክክር እና ሌሎች ችግሮች የሚያስፈልጉ በቀጥታ ለሥልጣናት ሪፖርት ያድርጉ።",
      login: "ግባ",
      getStarted: "ጀምር",
      "partner1": "Transparency International",
      "partner2": "Amnesty International",
      "partner3": "United Nations",
      "partner4": "African Union",
      "partner5": "World Bank",
      "partner6": "Local Governments",
      "story1.location": "ላጎስ፣ ናይጀሪያ",
      "story2.location": "ናይሮቢ፣ ኬንያ",
      "story3.location": "አክራ፣ ጋና",
    },
  },

  ha: {
    translation: {
      "hero.title": "Ba da Murya ga Muryar ku, Ka canza Yanayin Ku",
      "hero.description":
        "Kai rahoton cin hanci da sauran batutuwa da ke bukatar sa baki daga gwamnati kai tsaye ga hukuma.",
      login: "Shiga",
      getStarted: "Fara",
      "partner1": "Transparency International",
      "partner2": "Amnesty International",
      "partner3": "Majalisar Dinkin Duniya",
      "partner4": "Tarayyar Afirka",
      "partner5": "Bankin Duniya",
      "partner6": "Gwamnatocin Gida",
      "story1.location": "Lagos, Nigeria",
      "story2.location": "Nairobi, Kenya",
      "story3.location": "Accra, Ghana",
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    missingKeyHandler: async (lngs, ns, key, fallbackValue) => {
      // Try to translate missing keys using the API
      const targetLang = lngs[0];
      if (targetLang !== 'en') {
        try {
          const translated = await translateText(fallbackValue, getLanguageCode(targetLang));
          // Add the translated key to resources for future use
          if (!resources[targetLang]) {
            resources[targetLang] = { translation: {} };
          }
          if (!resources[targetLang].translation) {
            resources[targetLang].translation = {};
          }
          resources[targetLang].translation[key] = translated;
          return translated;
        } catch (error) {
          console.error('Translation failed:', error);
          return fallbackValue;
        }
      }
      return fallbackValue;
    },
  });

export default i18n;
