import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, MapPin, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <section className="py-20 relative overflow-hidden bg-white/80 backdrop-blur-sm" role="banner" aria-labelledby="hero-title">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <span className="text-4xl mr-4 hover:scale-110 transition-transform duration-300">🚌</span>
            <div className="text-2xl animate-pulse">🔄</div>
            <span className="text-4xl ml-4 hover:scale-110 transition-transform duration-300">📱</span>
          </div>
          
          <h1 id="hero-title" className="text-5xl font-bold mb-6 text-slate-800">
            {t('heroTitle')}
          </h1>
          <p id="hero-subtitle" className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto font-medium">
            {t('heroSubtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8" role="group" aria-label="Action buttons">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-900 hover:to-slate-800 shadow-xl hover:shadow-2xl hover:scale-105 px-8 py-3 rounded-full transition-all duration-500"
              onClick={() => navigate('/features')}
              aria-describedby="hero-subtitle"
            >
              {t('startYatra')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-3 rounded-full border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-orange-300 transition-all duration-300"
              onClick={() => navigate('/features')}
            >
              {t('learnMore')}
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-slate-600" role="list" aria-label="Key features">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-slate-800 mr-2"></div>
              {t('liveTracking')}
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-orange-600 mr-2"></div>
              {t('routePlanning')}
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-600 mr-2"></div>
              {t('ecoFriendly')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;