import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Instagram,
  MessageCircle,
  Clock,
  Menu,
  X,
  Star,
  Globe,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // Agora, ao invés de direcionar para o WhatsApp, os botões de "Solicitar Demonstração" redirecionam para o formulário do Google.
  const handleDemoRequest = () => {
    window.open("https://forms.gle/LYj8wuZzbvjup1Vi8", "_blank");
  };

  const sendMessageToAI = async (message: string) => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_GOOGLE_AI_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful assistant for BeautyBook, a custom scheduling system for beauty salons and clinics. Your main goal is to guide users to schedule a demo of our customized scheduling system. Always be friendly and professional. The demo can be scheduled via our form here: https://forms.gle/LYj8wuZzbvjup1Vi8. Here's the user's message: ${message}

Key points to mention:
- We create fully customized scheduling systems
- Each system is tailored to the specific needs of the salon/clinic
- We offer complete training and support
- The system can be integrated with Google Calendar and Instagram

If the user shows interest, encourage them to schedule a demo through our form.

Current user message: ${message}`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from AI API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error calling AI API:', error);
      const errorMessage = language === 'pt' 
        ? "Desculpe, estou com dificuldades de conexão no momento. Por favor, tente novamente mais tarde ou acesse nosso formulário para agendar sua demonstração: https://forms.gle/LYj8wuZzbvjup1Vi8"
        : language === 'es'
        ? "Lo siento, estoy teniendo dificultades de conexión en este momento. Por favor, inténtelo de nuevo más tarde o acceda a nuestro formulario para programar su demostración: https://forms.gle/LYj8wuZzbvjup1Vi8"
        : "Sorry, I'm having connection difficulties at the moment. Please try again later or access our form to schedule your demonstration: https://forms.gle/LYj8wuZzbvjup1Vi8";
      
      return errorMessage;
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    setChatMessages(prev => [...prev, { text: currentMessage, isUser: true }]);
    setCurrentMessage('');

    const aiResponse = await sendMessageToAI(currentMessage);
    setChatMessages(prev => [...prev, { text: aiResponse, isUser: false }]);
  };

  useEffect(() => {
    if (showChat && chatMessages.length === 0) {
      const welcomeMessage = language === 'pt' 
        ? "Olá! 👋 Sou o assistente virtual do BeautyBook. Estou aqui para ajudar você a descobrir como nosso sistema de agendamento personalizado pode transformar seu negócio. Gostaria de agendar uma demonstração gratuita?"
        : language === 'es'
        ? "¡Hola! 👋 Soy el asistente virtual de BeautyBook. Estoy aquí para ayudarte a descubrir cómo nuestro sistema de programación personalizado puede transformar tu negocio. ¿Te gustaría programar una demostración gratuita?"
        : "Hello! 👋 I'm BeautyBook's virtual assistant. I'm here to help you discover how our custom scheduling system can transform your business. Would you like to schedule a free demonstration?";
      
      setChatMessages([{ text: welcomeMessage, isUser: false }]);
    }
  }, [showChat, language]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="fixed w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <span className="text-2xl font-bold text-gray-800 dark:text-white">BeautyBook</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">{t('features')}</a>
              <a href="#benefits" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">{t('benefits')}</a>
              <a href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">{t('testimonials')}</a>
              
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  <Globe className="h-5 w-5" />
                  <span className="uppercase">{language}</span>
                </button>
                
                {showLanguageMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2">
                    <button
                      onClick={() => { setLanguage('pt'); setShowLanguageMenu(false); }}
                      className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700"
                    >
                      Português
                    </button>
                    <button
                      onClick={() => { setLanguage('en'); setShowLanguageMenu(false); }}
                      className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700"
                    >
                      English
                    </button>
                    <button
                      onClick={() => { setLanguage('es'); setShowLanguageMenu(false); }}
                      className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700"
                    >
                      Español
                    </button>
                  </div>
                )}
              </div>

              <motion.button 
                onClick={handleDemoRequest}
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(128, 90, 213, 0.8)" }}
                className="bg-purple-600 text-white px-6 py-2 rounded-full transition-colors"
              >
                {t('scheduleDemo')}
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-600 dark:text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </nav>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col p-4 space-y-4">
                <a href="#features" className="text-gray-600 dark:text-gray-300">{t('features')}</a>
                <a href="#benefits" className="text-gray-600 dark:text-gray-300">{t('benefits')}</a>
                <a href="#testimonials" className="text-gray-600 dark:text-gray-300">{t('testimonials')}</a>
                
                {/* Mobile Language Selector */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <button
                    onClick={() => setLanguage('pt')}
                    className="block w-full py-2 text-left text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    Português
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className="block w-full py-2 text-left text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('es')}
                    className="block w-full py-2 text-left text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    Español
                  </button>
                </div>

                <motion.button 
                  onClick={handleDemoRequest}
                  whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(128, 90, 213, 0.8)" }}
                  className="bg-purple-600 text-white px-6 py-2 rounded-full"
                >
                  {t('scheduleDemo')}
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section with Animated Entrance */}
      <motion.section 
        className="pt-32 pb-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                {t('heroTitle')}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                {t('heroSubtitle')}
              </p>
              <motion.button 
                onClick={handleDemoRequest}
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgba(128, 90, 213, 0.8)" }}
                className="bg-purple-600 text-white px-8 py-3 rounded-full transition-colors"
              >
                {t('scheduleDemo')}
              </motion.button>
            </div>
            <motion.div 
              className="md:w-1/2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src="https://i.imgur.com/9KRog7u.png"
                alt="Custom salon management system"
                className="rounded-lg shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Customization Section */}
      <motion.section 
        className="py-20 bg-purple-50 dark:bg-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t('customTitle')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('customSubtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('customFeaturesTitle')}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <Check className="h-5 w-5 text-purple-600 mr-2" />
                  {t('customFeature1')}
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <Check className="h-5 w-5 text-purple-600 mr-2" />
                  {t('customFeature2')}
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <Check className="h-5 w-5 text-purple-600 mr-2" />
                  {t('customFeature3')}
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('supportTitle')}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <Check className="h-5 w-5 text-purple-600 mr-2" />
                  {t('supportFeature1')}
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <Check className="h-5 w-5 text-purple-600 mr-2" />
                  {t('supportFeature2')}
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <Check className="h-5 w-5 text-purple-600 mr-2" />
                  {t('supportFeature3')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ➤ NOVO: Seção de Resultados Reais (Prova Social & Transformação) */}
      <motion.section 
        className="py-20 bg-white dark:bg-gray-900"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Resultados Reais
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
            Conheça os números que comprovam a transformação que o BeautyBook pode proporcionar.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <motion.div 
              className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">+35%</h3>
              <p className="text-gray-600 dark:text-gray-300">Aumento médio nas reservas.</p>
            </motion.div>
            <motion.div 
              className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">+20h</h3>
              <p className="text-gray-600 dark:text-gray-300">Economia mensal de tempo na gestão.</p>
            </motion.div>
            <motion.div 
              className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">99%</h3>
              <p className="text-gray-600 dark:text-gray-300">Taxa de satisfação dos nossos clientes.</p>
            </motion.div>
          </div>
          <motion.button 
            onClick={handleDemoRequest}
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgba(128, 90, 213, 0.8)" }}
            className="bg-purple-600 text-white px-8 py-3 rounded-full transition-colors"
          >
            Descubra como transformar seu negócio
          </motion.button>
        </div>
      </motion.section>

      {/* Exemplo de Site Section */}
      <motion.section 
        className="py-20 bg-gray-50 dark:bg-gray-800"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Veja um Exemplo de Site
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Confira um exemplo real de site desenvolvido por nós para que você possa ter uma ideia melhor do nosso serviço.
          </p>
          <motion.a
            href="https://sabrinamainardo.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgba(128, 90, 213, 0.8)" }}
            className="inline-block bg-purple-600 text-white px-8 py-3 rounded-full transition-colors"
          >
            Visualizar Exemplo
          </motion.a>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section 
        id="benefits" 
        className="py-20 bg-white dark:bg-gray-900"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            {t('benefitsTitle')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              <Calendar className="h-12 w-12 text-purple-600 dark:text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('googleSync')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('googleSyncDesc')}</p>
            </motion.div>
            <motion.div 
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              <Instagram className="h-12 w-12 text-purple-600 dark:text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('instagramFeed')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('instagramFeedDesc')}</p>
            </motion.div>
            <motion.div 
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              <Clock className="h-12 w-12 text-purple-600 dark:text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('scheduling247')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('scheduling247Desc')}</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Steps Section */}
      <motion.section 
        className="py-20 bg-gray-50 dark:bg-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            {t('stepsTitle')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: t('step1Title'),
                description: t('step1Desc')
              },
              {
                step: 2,
                title: t('step2Title'),
                description: t('step2Desc')
              },
              {
                step: 3,
                title: t('step3Title'),
                description: t('step3Desc')
              }
            ].map((item) => (
              <motion.div 
                key={item.step}
                className="flex flex-col items-center text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 bg-purple-600 dark:bg-purple-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        id="testimonials" 
        className="py-20 bg-white dark:bg-gray-900"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            {t('testimonialsTitle')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: t('testimonial1Name'),
                role: t('testimonial1Role'),
                text: t('testimonial1Text')
              },
              {
                name: t('testimonial2Name'),
                role: t('testimonial2Role'),
                text: t('testimonial2Text')
              },
              {
                name: t('testimonial3Name'),
                role: t('testimonial3Role'),
                text: t('testimonial3Text')
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index} 
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
                whileHover={{ scale: 1.02, boxShadow: "0px 0px 10px rgba(0,0,0,0.15)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{testimonial.text}</p>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ➤ NOVO: Seção de Perguntas Frequentes (FAQ) com design melhorado */}
      <motion.section 
        id="faq" 
        className="py-20 bg-gray-100 dark:bg-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            Perguntas Frequentes
          </h2>
          <div className="space-y-8 max-w-3xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Como o BeautyBook pode ajudar meu salão?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Nosso sistema personalizado integra reservas online, gerenciamento de agenda e integração com Google Calendar e Instagram – tudo para aumentar sua eficiência e atrair mais clientes.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">O sistema é realmente customizável?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sim! Cada solução é desenvolvida especificamente para atender às necessidades do seu salão ou clínica, garantindo uma experiência única para você e seus clientes.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">E se eu tiver dúvidas ou precisar de suporte?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Oferecemos treinamento completo e suporte contínuo para que você nunca se sinta sozinho na implementação e no uso do nosso sistema.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ➤ NOVO: Seção Call-to-Action com urgência e escassez */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-purple-600 to-pink-500 text-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Transforme seu negócio hoje!
          </h2>
          <p className="text-xl mb-8">
            Vagas limitadas! Agende sua demonstração gratuita e descubra como nosso sistema de agendamento personalizado pode revolucionar seu salão ou clínica.
          </p>
          <motion.button 
            onClick={handleDemoRequest}
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgba(255,255,255,0.8)" }}
            className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold transition-colors"
          >
            Agendar Demonstração
          </motion.button>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <span className="text-xl font-bold text-gray-800 dark:text-white">BeautyBook</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-purple-600">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} BeautyBook. {t('allRightsReserved')}
          </div>
        </div>
      </footer>

      {/* Chat Button */}
      <motion.button
        onClick={() => setShowChat(!showChat)}
        whileHover={{ scale: 1.1, boxShadow: "0px 0px 12px rgba(128, 90, 213, 0.8)" }}
        className="fixed bottom-4 right-4 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>

      {/* Chat Widget */}
      {showChat && (
        <motion.div 
          className="fixed bottom-20 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white">{t('chatSupport')}</h3>
              <button onClick={() => setShowChat(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="p-4 h-80 overflow-y-auto">
            <div className="space-y-4">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.isUser
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t('typeMessage')}
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <motion.button
                onClick={handleSendMessage}
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(128, 90, 213, 0.8)" }}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default App;
