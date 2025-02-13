import React, { useState, useEffect } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Clock, 
  Globe, 
  CheckCircle,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  User,
  MessageSquare,
  FileText
} from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900 md:mt-32">
      {/* Hero Section with Particle Effect */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-500/5 animate-pulse" />
        <div className="container mx-auto px-6 py-20 text-center relative">
          <h1 className="text-6xl font-bold mb-4 animate-fade-in text-gray-800">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
          <div className="mt-8 flex items-center justify-center space-x-6 text-gray-600">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>{currentTime}</span>
            </div>
            <div className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              <span>24/7 Support Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 
          hover:border-gray-500/50 transition-all duration-300 w-full">
            <h2 className="text-3xl font-bold mb-8 flex items-center text-gray-800">
              Send Message
              <Send className="w-6 h-6 ml-2 text-gray-500" />
            </h2>

            {submitted && (
              <div className="bg-gray-50 border border-gray-500 text-gray-700 p-4 rounded-lg mb-6 flex items-center animate-fade-in">
                <CheckCircle className="w-5 h-5 mr-2" />
                Message sent successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-gray-700 font-medium">Name</label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 pl-12 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-gray-700 font-medium">Email</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-3 pl-12 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-700 font-medium">Subject</label>
                <div className="relative">
                  <FileText className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full p-3 pl-12 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                    placeholder="How can we help?"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-700 font-medium">Message</label>
                <div className="relative">
                  <MessageSquare className="w-5 h-5 absolute left-3 top-4 text-gray-400" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full p-3 pl-12 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all resize-none"
                    placeholder="Your message here..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-950 hover:bg-gray-900 text-white font-bold py-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
              >
                Send Message
                <Send className="w-5 h-5 ml-2" />
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-12 text-gray-800">Contact Information</h2>

            <div className="grid gap-8">
              {[
                { icon: Phone, title: "Call Us", content: "+1 (555) 123-4567", sub: "Monday to Friday, 9am - 6pm" },
                { icon: Mail, title: "Email Us", content: "support@example.com", sub: "We'll respond within 24 hours" },
                { icon: MapPin, title: "Visit Us", content: "123 Innovation Street", sub: "New York, NY 10012" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-6 p-6 rounded-xl bg-white shadow-lg border border-gray-100 hover:border-gray-500/50 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gray-500 text-white flex items-center justify-center rounded-full">
                    <item.icon size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{item.title}</h3>
                    <p className="text-gray-600 font-medium">{item.content}</p>
                    <p className="text-gray-500 text-sm mt-1">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="mt-12">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Connect With Us</h3>
              <div className="flex space-x-2">
                {[
                  { name: "Twitter", icon: Twitter },
                  { name: "LinkedIn", icon: Linkedin },
                  { name: "Facebook", icon: Facebook },
                  { name: "Instagram", icon: Instagram }
                ].map((platform) => (
                  <button
                    key={platform.name}
                    className="px-4 py-2 bg-white rounded-full border border-gray-200 hover:border-gray-500/50 transition-all duration-300 flex items-center space-x-2 hover:bg-gray-50"
                  >
                    <platform.icon className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-600">{platform.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="w-full h-96 mt-16 relative overflow-hidden rounded-t-3xl">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20 pointer-events-none z-10" />
        <iframe
          title="Location Map"
          className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
          frameBorder="0"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d989.6122008536961!2d29.26929477118369!3d-1.6604392456186574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dd07e09f544a85%3A0xa25ffde906649d6!2sKARUKOGO-Gisenyi!5e1!3m2!1sen!2srw!4v1739458966631!5m2!1sen!2srw"
        />
      </div>
    </div>
  );
};

export default ContactPage;