import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      "home": "Home",
      "products": "Products",
      "about": "About Us",
      "contact": "Contact",
      "login": "Login",
      "register": "Register",
      "logout": "Logout",
      "dashboard": "Dashboard",
      "cart": "Cart",
      
      // Authentication
      "email": "Email",
      "password": "Password",
      "confirmPassword": "Confirm Password",
      "fullName": "Full Name",
      "companyName": "Company Name",
      "phoneNumber": "Phone Number",
      "selectRole": "Select Role",
      "customer": "Customer",
      "supplier": "Supplier",
      "createAccount": "Create Account",
      "signIn": "Sign In",
      "alreadyHaveAccount": "Already have an account?",
      "dontHaveAccount": "Don't have an account?",
      
      // Landing Page
      "heroTitle": "Connect. Trade. Grow.",
      "heroSubtitle": "The premier B2B marketplace connecting customers and suppliers across Ethiopia",
      "getStarted": "Get Started",
      "learnMore": "Learn More",
      "featuredProducts": "Featured Products",
      "viewAllProducts": "View All Products",
      
      // Dashboard
      "welcome": "Welcome",
      "orders": "Orders",
      "rfqs": "RFQs",
      "dashboardProducts": "Products",
      "messages": "Messages",
      "notifications": "Notifications",
      "profile": "Profile",
      
      // Cart & Checkout
      "addToCart": "Add to Cart",
      "viewCart": "View Cart",
      "checkout": "Checkout",
      "total": "Total",
      "quantity": "Quantity",
      
      // General
      "loading": "Loading...",
      "error": "Error",
      "success": "Success",
      "save": "Save",
      "cancel": "Cancel",
      "submit": "Submit",
      "search": "Search",
      "filter": "Filter"
    }
  },
  am: {
    translation: {
      // Navigation
      "home": "መነሻ",
      "products": "ምርቶች",
      "about": "ስለ እኛ",
      "contact": "ያግኙን",
      "login": "ግባ",
      "register": "ተመዝገብ",
      "logout": "ውጣ",
      "dashboard": "ዳሽቦርድ",
      "cart": "ቅልቦት",
      
      // Authentication
      "email": "ኢሜይል",
      "password": "የመግቢያ ቁልፍ",
      "confirmPassword": "የመግቢያ ቁልፍ አረጋግጥ",
      "fullName": "ሙሉ ስም",
      "companyName": "የድርጅት ስም",
      "phoneNumber": "ስልክ ቁጥር",
      "selectRole": "ሚና ይምረጡ",
      "customer": "ቤተተሳደብ",
      "supplier": "አቅራቢ",
      "createAccount": "መለያ ፍጠር",
      "signIn": "ግባ",
      "alreadyHaveAccount": "መለያ አለዎት?",
      "dontHaveAccount": "መለያ የለዎትም?",
      
      // Landing Page
      "heroTitle": "ተገናኙ. ንግድ ይስሩ. ያድጉ።",
      "heroSubtitle": "በኢትዮጵያ ውስጥ ደንበኞችን እና አቅራቢዎችን የሚያገናኝ ዋነኛ የንግድ መንገድ",
      "getStarted": "ይጀምሩ",
      "learnMore": "ተጨማሪ ይወቁ",
      "featuredProducts": "ተመራጭ ምርቶች",
      "viewAllProducts": "ሁሉንም ምርቶች ይመልከቱ",
      
      // Dashboard
      "welcome": "እንኳን በደህና መጡ",
      "orders": "ትዕዛዞች",
      "rfqs": "የዋጋ ጥያቄዎች",
      "dashboardProducts": "ምርቶች",
      "messages": "መልእክቶች",
      "notifications": "ማሳወቂያዎች",
      "profile": "መገለጫ",
      
      // Cart & Checkout
      "addToCart": "ወደ ቅልቦት ይጨምሩ",
      "viewCart": "ቅልቦት ይመልከቱ",
      "checkout": "ክፈል",
      "total": "ጠቅላላ",
      "quantity": "መጠን",
      
      // General
      "loading": "እየተጠራቀመ...",
      "error": "ስህተት",
      "success": "ተሳክቷል",
      "save": "አስቀምጥ",
      "cancel": "ሰርዝ",
      "submit": "ላክ",
      "search": "ፈልግ",
      "filter": "አጥራ"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;