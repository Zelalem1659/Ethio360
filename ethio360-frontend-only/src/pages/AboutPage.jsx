import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Globe, Heart, Award, Eye, Target } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Ethiopian Flag Color Watermark Background with Animation */}
      <div className="absolute inset-0 opacity-10">
        {/* Green section */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-green-400 via-green-300 to-green-200 animate-pulse"></div>
        {/* Yellow section */}
        <div className="absolute top-1/3 left-0 w-full h-1/3 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        {/* Red section */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-br from-red-400 via-red-300 to-red-200 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Soft blending overlay with animation */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/40 animate-fade-in"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30 animate-fade-in" style={{ animationDelay: '0.3s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section with Slide Up Animation */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16 animate-slide-up">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>About Ethio360°</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              Ethiopia's premier digital news platform, delivering comprehensive coverage of politics, 
              business, technology, sports, and culture from Ethiopia and around the world.
            </p>
          </div>

          {/* Mission & Vision Cards with Staggered Animation */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-gray-100 animate-slide-in-left" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center mb-4">
                <Target className="w-8 h-8 text-green-600 mr-3 animate-bounce-in" style={{ animationDelay: '0.8s' }} />
                <h2 className="text-2xl font-bold text-gray-900 animate-fade-in" style={{ animationDelay: '0.7s' }}>Our Mission</h2>
              </div>
              <p className="text-gray-700 leading-relaxed animate-fade-in" style={{ animationDelay: '0.9s' }}>
                To provide accurate, timely, and comprehensive news coverage that empowers Ethiopian 
                communities worldwide with the information they need to stay connected to their homeland 
                and make informed decisions about their future.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-gray-100 animate-slide-in-right" style={{ animationDelay: '0.8s' }}>
              <div className="flex items-center mb-4">
                <Eye className="w-8 h-8 text-yellow-600 mr-3 animate-bounce-in" style={{ animationDelay: '1s' }} />
                <h2 className="text-2xl font-bold text-gray-900 animate-fade-in" style={{ animationDelay: '0.9s' }}>Our Vision</h2>
              </div>
              <p className="text-gray-700 leading-relaxed animate-fade-in" style={{ animationDelay: '1.1s' }}>
                To become the most trusted and influential Ethiopian news platform globally, 
                fostering unity, understanding, and progress through quality journalism and 
                authentic storytelling that reflects the diverse voices of Ethiopia.
              </p>
            </div>
          </div>

          {/* About Content with Scale Animation */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-gray-100 mb-16 animate-scale-in" style={{ animationDelay: '1s' }}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 animate-fade-in" style={{ animationDelay: '1.2s' }}>Who We Are</h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              <p className="animate-fade-in" style={{ animationDelay: '1.3s' }}>
                Founded with a deep commitment to journalistic excellence, Ethio360° emerged from the 
                recognition that Ethiopia's rich history, diverse culture, and dynamic political landscape 
                deserved a news platform that could capture its complexity with nuance and integrity.
              </p>
              
              <p className="animate-fade-in" style={{ animationDelay: '1.4s' }}>
                Based in Washington DC but with deep roots in Ethiopia, our newsroom brings together 
                experienced journalists, political analysts, and cultural experts who understand both 
                the local context and global implications of Ethiopian affairs.
              </p>

              <p className="animate-fade-in" style={{ animationDelay: '1.5s' }}>
                We cover a wide range of topics including politics, economics, technology, sports, 
                culture, and diaspora affairs. Our bilingual approach ensures that news is accessible 
                to both English and Amharic-speaking audiences, bridging communities across continents.
              </p>
            </div>
          </div>

          {/* Values Section with Wave Animation */}
          <div className="mb-16 animate-fade-in" style={{ animationDelay: '1.2s' }}>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12 animate-slide-down" style={{ animationDelay: '1.4s' }}>Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center animate-float" style={{ animationDelay: '1.6s' }}>
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in" style={{ animationDelay: '1.7s' }}>
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 animate-fade-in" style={{ animationDelay: '1.8s' }}>Integrity</h3>
                <p className="text-gray-600 animate-fade-in" style={{ animationDelay: '1.9s' }}>
                  We uphold the highest standards of journalistic integrity, providing accurate, 
                  fact-based reporting without bias or agenda.
                </p>
              </div>

              <div className="text-center animate-float" style={{ animationDelay: '1.8s' }}>
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in" style={{ animationDelay: '1.9s' }}>
                  <Globe className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 animate-fade-in" style={{ animationDelay: '2s' }}>Global Perspective</h3>
                <p className="text-gray-600 animate-fade-in" style={{ animationDelay: '2.1s' }}>
                  We connect Ethiopian stories to global trends while maintaining deep respect 
                  for local context and cultural nuances.
                </p>
              </div>

              <div className="text-center animate-float" style={{ animationDelay: '2s' }}>
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in" style={{ animationDelay: '2.1s' }}>
                  <Users className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 animate-fade-in" style={{ animationDelay: '2.2s' }}>Community</h3>
                <p className="text-gray-600 animate-fade-in" style={{ animationDelay: '2.3s' }}>
                  We serve the Ethiopian diaspora and homeland communities by fostering 
                  dialogue, understanding, and connection across borders.
                </p>
              </div>
            </div>
          </div>

          {/* Editorial Standards with Slide Animation */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-gray-100 mb-16 animate-slide-up" style={{ animationDelay: '2.2s' }}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 animate-fade-in" style={{ animationDelay: '2.4s' }}>Editorial Standards</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="animate-fade-in" style={{ animationDelay: '2.5s' }}>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Independence</h3>
                <p className="text-gray-700 mb-6">
                  Our editorial decisions are made independently, free from political, 
                  commercial, or other external influences that could compromise our objectivity.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Accuracy</h3>
                <p className="text-gray-700">
                  Every story is thoroughly fact-checked and verified through multiple sources 
                  before publication. We correct errors promptly and transparently.
                </p>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '2.7s' }}>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Balance</h3>
                <p className="text-gray-700 mb-6">
                  We strive to present multiple perspectives on complex issues, ensuring 
                  that diverse voices and viewpoints are represented in our coverage.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">Accountability</h3>
                <p className="text-gray-700">
                  We hold ourselves accountable to our readers and the communities we serve, 
                  maintaining transparency in our processes and welcoming constructive feedback.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section with Bounce Animation */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-gray-100 text-center animate-bounce-in" style={{ animationDelay: '2.4s' }}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 animate-fade-in" style={{ animationDelay: '2.6s' }}>Get in Touch</h2>
            <p className="text-xl text-gray-600 mb-8 animate-fade-in" style={{ animationDelay: '2.7s' }}>
              Have a story tip, feedback, or want to collaborate? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:info@ethio360.com" 
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-all duration-300 font-semibold animate-slide-in-left hover:scale-105 transform" 
                style={{ animationDelay: '2.8s' }}
              >
                Contact Our Newsroom
              </a>
              <Link 
                to="/subscribe" 
                className="bg-yellow-600 text-white px-8 py-3 rounded-lg hover:bg-yellow-700 transition-all duration-300 font-semibold animate-slide-in-right hover:scale-105 transform"
                style={{ animationDelay: '2.9s' }}
              >
                Subscribe to Our Newsletter
              </Link>
            </div>
          </div>

          {/* Back to Home with Fade Animation */}
          <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '3s' }}>
            <Link 
              to="/" 
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors hover:scale-105 transform duration-300"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;