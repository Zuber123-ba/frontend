import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../conetxt/language-context';
import { getText } from '../../utils/languageUtils';

const HeroSection = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-yellow-50/50 dark:from-gray-900 dark:to-gray-800/50 -z-20" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="md:w-1/2 space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
              {getText('hero.title', language)}
              <span className="bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">
                {getText('Khanakhazana', language)}
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 md:max-w-lg">
              {getText('hero.subtitle', language)}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/Signup')}
                className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {getText('hero.getStarted', language)}
              </button>
              
              <button 
                onClick={() => navigate('/Membership')}
                className="px-8 py-4 text-lg font-semibold text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all duration-300 flex items-center gap-2"
              >
                {getText('hero.viewPlans', language)}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Benefits Grid */}
            <div className="mt-8 flex items-center text-sm text-gray-500">
              <span className="mr-2">✓</span> {getText('hero.benefits.noCommitments', language)}
              <span className="mx-4">|</span>
              <span className="mr-2">✓</span> {getText('hero.benefits.easyRefunds', language)}
              <span className="mx-4">|</span>
              <span className="mr-2">✓</span> {getText('hero.benefits.multiLocation', language)}
            </div>
            </div>

          {/* Image Section */}
          <div className="md:w-1/2 relative">
            {/* Floating Container */}
            <div className="relative z-10 animate-float">
              <img
                src="/bg.jpg"
                alt="Delicious meal spread"
                className="rounded-2xl shadow-2xl border-8 border-white dark:border-gray-800 transform rotate-2"
              />
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -left-6 w-full h-full bg-green-500/10 rounded-2xl -z-10 rotate-3" />
            <div className="absolute top-6 right-6 w-3/4 h-3/4 bg-yellow-500/10 rounded-2xl -z-10 -rotate-3" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;