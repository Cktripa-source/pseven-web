import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  ShoppingBag, 
  Briefcase, 
  Heart, 
  Shirt, 
  Laptop, 
  Phone, 
  Headphones,
  Monitor,
  Clock,
  Users,
  Star,
  ChevronDown,
  ArrowRight
} from 'lucide-react';

// Import a valid background image


const AboutPage = () => {
  // State to track which sections are visible
  const [visibleSections, setVisibleSections] = useState({
    story: false,
    services: false,
    technology: false,
    stats: false,
    cta: false
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setVisibleSections({
        story: scrollY > 200,
        services: scrollY > 600,
        technology: scrollY > 1000,
        stats: scrollY > 1400,
        cta: scrollY > 1800
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Define services
  const services = [
    { icon: <Camera size={32} />, title: "Photography", description: "Professional photography for events and branding." },
    { icon: <ShoppingBag size={32} />, title: "E-Commerce", description: "Your go-to marketplace for quality electronics." },
    { icon: <Briefcase size={32} />, title: "Employment", description: "Connecting talents with meaningful opportunities." },
    { icon: <Heart size={32} />, title: "Wedding Planning", description: "Custom wedding solutions tailored to you." },
    { icon: <Laptop size={32} />, title: "Tech Solutions", description: "Providing cutting-edge gadgets and support." },
    { icon: <Shirt size={32} />, title: "Custom Apparel", description: "Designing personalized apparel for all occasions." },
  ];

  // Define statistics
  const stats = [
    { icon: <Users size={32} />, value: "10K+", label: "Happy Customers" },
    { icon: <Star size={32} />, value: "4.8/5", label: "Average Rating" },
    { icon: <Briefcase size={32} />, value: "500+", label: "Job Placements" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-green-50 to-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('./images/logo.png')] opacity-5" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-4xl font-bold mb-6  text-green-600">
            Pseven
            <span className="text-gray-800"> Rwanda</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            At the intersection of technology and lifestyle, we've created a unique ecosystem where innovation meets everyday needs. Our comprehensive range of services and products is designed to enhance both your digital and personal life experiences.
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-10 h-10 text-green-600" />
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className={`animate-section py-20 bg-white transition-all duration-1000 ${
        visibleSections.story ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-gray-800">Our Journey</h2>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                Founded in 2015, our company emerged from a vision to bridge the gap between cutting-edge technology and everyday lifestyle needs. What began as a modest electronics store has evolved into a comprehensive service provider, touching various aspects of our customers' lives. Through years of dedication and innovation, we've built a reputation for excellence in both the technical and creative domains.
              </p>
              <p>
                Our evolution has been driven by a deep understanding of how technology integrates with modern lifestyles. We recognized early on that today's consumers need more than just products – they seek complete solutions that enhance their daily experiences. This insight led us to expand our services beyond traditional retail, incorporating creative services like professional photography, custom apparel design, and comprehensive wedding planning.
              </p>
              <p>
                Today, we stand as a testament to the power of adaptive innovation. Our business model uniquely combines retail excellence with creative services, supported by a growing employment platform that connects talented individuals with meaningful opportunities. This holistic approach allows us to serve not just as a provider, but as a true partner in our customers' journey toward a more connected and fulfilled lifestyle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className={`animate-section py-20 bg-green-50 transition-all duration-1000 ${
        visibleSections.services ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-8 text-gray-800">
              Comprehensive <span className="text-green-600">Solutions</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Our diverse range of services represents our commitment to meeting the multifaceted needs of modern life. We believe in creating seamless experiences that integrate technology with lifestyle services, providing solutions that are both innovative and practical. Each service line is carefully crafted to deliver maximum value while maintaining the highest standards of quality and customer satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <div className="text-green-600">{service.icon}</div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                <button className="flex items-center text-green-600 hover:text-green-700 transition-colors duration-300">
                  Learn More <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className={`animate-section py-20 bg-white transition-all duration-1000 ${
        visibleSections.technology ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-gray-800">Technology & Innovation</h2>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                In today's rapidly evolving digital landscape, staying at the forefront of technology is not just an advantage – it's a necessity. Our commitment to technological excellence is reflected in our carefully curated selection of electronic devices and digital solutions. We partner with leading manufacturers and brands to bring you the latest innovations, ensuring that our offerings always represent the cutting edge of technological advancement.
              </p>
              <p>
                Our approach to technology goes beyond mere retail. We understand that each piece of technology represents a gateway to enhanced productivity, creativity, or entertainment. This is why our tech offerings are complemented by expert consultation services, ensuring that you not only get the best products but also the knowledge and support to maximize their potential in your specific context.
              </p>
              <p>
                We take pride in our ability to bridge the gap between complex technology and practical application. Our team of experts stays continuously updated with the latest technological trends and developments, allowing us to provide informed recommendations and support that align with your needs and goals. Whether you're a professional seeking high-performance equipment or a casual user looking for reliable everyday devices, our technology solutions are tailored to enhance your digital experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Context */}
      <section id="stats" className={`animate-section py-20 bg-green-50 transition-all duration-1000 ${
        visibleSections.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-8 text-gray-800">Our Impact</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Numbers tell only part of our story, but they reflect our commitment to excellence and the trust our community has placed in us. Over the years, we've grown not just in size but in our ability to positively impact the lives of our customers and employees. Each statistic represents countless stories of successful collaborations, satisfied customers, and meaningful contributions to our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <div className="text-green-600">{stat.icon}</div>
                </div>
                <div className="text-4xl font-bold mb-2 text-gray-800">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action with Detail */}
      <section id="cta" className={`animate-section py-20 bg-white transition-all duration-1000 ${
        visibleSections.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              Begin Your <span className="text-green-600">Journey</span> With Us
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Whether you're looking to upgrade your technology, capture life's precious moments, or embark on a new career path, we're here to help you achieve your goals. Our team of experts is ready to provide personalized solutions that align with your unique needs and aspirations. Take the first step towards a more connected and enriched lifestyle by reaching out to us today.
            </p>
            <button 
              className="px-8 py-4 bg-green-600 text-white rounded-full text-lg font-medium hover:bg-green-700 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
 
export default AboutPage;
