import Hero from "@/components/Hero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Smartphone, 
  Clock, 
  Bell, 
  Users, 
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: Smartphone,
      title: "Real-time Bus Tracking",
      description: "See exactly where your bus is on an interactive map with live GPS updates."
    },
    {
      icon: Clock,
      title: "Accurate Arrival Times",
      description: "Get precise ETAs based on real traffic conditions and bus locations."
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Receive alerts for delays, route changes, and when to leave for your stop."
    },
    {
      icon: Users,
      title: "Eco-Smart Commuting",
      description: "Choose greener transport options and reduce your carbon footprint with every ride."
    }
  ];

  const benefits = [
    "Save 30+ minutes daily on average",
    "Never miss your bus again",
    "Reduce waiting time at stops",
    "Plan your commute with confidence"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-orange-400/10 to-slate-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-slate-400/5 to-blue-400/5 rounded-full blur-3xl animate-spin-slow"></div>
      <Hero />
      
      {/* Features Section */}
      <section className="py-24 bg-white/80 backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Why Choose Yatra?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">
              Professional bus tracking technology designed for reliable, eco-friendly commuting
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const colors = ['bg-slate-800', 'bg-orange-600', 'bg-slate-700', 'bg-orange-500'];
              return (
                <Card key={index} className="p-8 text-center bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-2xl hover:border-orange-200 hover:bg-white transition-all duration-500 group hover:-translate-y-2">
                  <div className={`w-14 h-14 ${colors[index]} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-4 text-slate-800">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-50/20 via-transparent to-slate-50/20"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-slate-800 mb-12">
              Transform Your Daily Commute
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center p-6 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl hover:shadow-xl hover:border-orange-300 hover:bg-white transition-all duration-500 hover:-translate-y-1 group">
                  <div className="p-2 rounded-full bg-gradient-to-r from-orange-600 to-orange-500 mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-slate-800 font-semibold">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 px-10 py-4 text-lg font-semibold transition-all duration-500 rounded-full shadow-xl hover:shadow-2xl hover:scale-105"
                onClick={() => navigate('/app')}
              >
                🚌 Passenger App
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 px-10 py-4 text-lg font-semibold transition-all duration-500 rounded-full shadow-xl hover:shadow-2xl hover:scale-105"
                onClick={() => navigate('/driver')}
              >
                🚗 Driver Dashboard
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-slate-300 hover:border-slate-400 px-10 py-4 text-lg font-semibold transition-all duration-500 rounded-full shadow-lg hover:shadow-xl hover:scale-105"
                onClick={() => navigate('/admin')}
              >
                ⚙️ Admin Panel
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/20 via-transparent to-blue-900/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-slate-300 mb-12 max-w-2xl mx-auto text-lg">
            Join thousands of commuters using Yatra for smarter, greener, stress-free travel.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-700 hover:to-orange-600 px-10 py-4 text-lg font-semibold transition-all duration-500 rounded-full shadow-xl hover:shadow-2xl hover:scale-105"
              onClick={() => navigate('/app')}
            >
              🚌 Track Buses Now
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-8 text-slate-400">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium">10k+ Users</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                <span className="text-sm font-medium">99% Accuracy</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                <span className="text-sm font-medium">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;