import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  MapPin, 
  Bell, 
  Route,
  Download,
  Search,
  Navigation,
  CheckCircle,
  ArrowRight,
  Users,
  Clock
} from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      icon: Smartphone,
      title: "Open App or Website",
      description: "Launch Yatra on your mobile device or visit our website from any browser.",
      details: ["Available on Android & iOS", "Progressive web app", "Works on any device", "Instant access"]
    },
    {
      step: "02", 
      icon: Search,
      title: "Find Your Route",
      description: "Search for your desired bus route or select from your saved favorites.",
      details: ["Route search by number", "Destination-based search", "Nearby stops finder", "Saved favorites"]
    },
    {
      step: "03",
      icon: MapPin,
      title: "Track Your Bus",
      description: "See real-time bus location on the map with accurate arrival predictions.",
      details: ["Live GPS tracking", "Interactive map view", "Multiple bus tracking", "Offline map support"]
    },
    {
      step: "04",
      icon: Bell,
      title: "Get Smart Updates",
      description: "Receive notifications about arrivals, delays, and optimal departure times.",
      details: ["Arrival notifications", "Delay alerts", "Departure reminders", "Custom preferences"]
    },
    {
      step: "05",
      icon: Route,
      title: "Travel with Confidence",
      description: "Board your bus on time and enjoy a stress-free, predictable journey.",
      details: ["On-time boarding", "Crowd level info", "Alternative suggestions", "Journey feedback"]
    }
  ];

  const features = [
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Live tracking every 30 seconds"
    },
    {
      icon: Users,
      title: "Crowd Information",
      description: "See bus capacity before boarding"
    },
    {
      icon: Navigation,
      title: "Smart Routing",
      description: "AI-powered route optimization"
    },
    {
      icon: Bell,
      title: "Personalized Alerts",
      description: "Customizable notification preferences"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50 relative overflow-hidden py-16">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-blue-400/15 to-orange-400/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-gradient-to-r from-orange-400/15 to-slate-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-slate-600/10 to-orange-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-slate-500/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-slate-400/8 to-blue-400/8 rounded-full blur-3xl animate-spin-slow"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/30">
          <div className="mb-6">
            <span className="text-6xl animate-bounce">🎯</span>
          </div>
          <Badge variant="outline" className="mb-6 bg-gradient-to-r from-slate-100 to-orange-100 border-orange-300 text-slate-800 px-4 py-2 text-sm font-semibold">
            Simple Process
          </Badge>
          <h1 className="text-5xl sm:text-6xl font-bold mb-8 text-slate-800">
            How{" "}
            <span className="bg-gradient-to-r from-slate-800 to-orange-600 bg-clip-text text-transparent">
              Yatra
            </span>{" "}
            Works
          </h1>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto font-medium leading-relaxed">
            Transform your commute in just 5 simple steps. From tracking your bus 
            to boarding with confidence, we make public transport predictable.
          </p>
        </div>

        {/* Step-by-step Process */}
        <div className="mb-20">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-20 w-0.5 h-16 bg-gradient-to-b from-primary to-secondary opacity-30 hidden md:block"></div>
                )}
                
                <Card className="p-10 bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-2xl hover:border-orange-200 hover:bg-white transition-all duration-500 group hover:-translate-y-3">
                  <div className="grid md:grid-cols-3 gap-8 items-center">
                    {/* Step Number & Icon */}
                    <div className="flex items-center space-x-6 md:justify-start justify-center">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-700 flex items-center justify-center text-white font-bold text-xl shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          {step.step}
                        </div>
                      </div>
                      <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-100 to-orange-200 group-hover:scale-110 transition-all duration-500 shadow-lg">
                        <step.icon className="h-8 w-8 text-orange-700" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="md:col-span-2">
                      <h3 className="text-3xl font-bold mb-4 text-slate-800">{step.title}</h3>
                      <p className="text-slate-600 text-lg mb-6 font-medium leading-relaxed">{step.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center bg-blue-50 p-3 rounded-xl border border-blue-200">
                            <CheckCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                            <span className="text-sm font-medium text-slate-700">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <section className="mb-24 bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 rounded-3xl p-12 shadow-2xl border border-slate-200/50">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <span className="text-white text-2xl">🔍</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Key Features</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const colors = ['bg-slate-800', 'bg-orange-600', 'bg-slate-700', 'bg-orange-500'];
              return (
                <Card key={index} className="p-8 text-center bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-2xl hover:border-orange-200 hover:bg-white transition-all duration-500 group hover:-translate-y-3">
                  <div className={`w-14 h-14 ${colors[index]} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-slate-800">{feature.title}</h3>
                  <p className="text-slate-600 text-sm font-medium">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Technology Behind It */}
        <section className="mb-24 bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/30">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <span className="text-white text-2xl">📊</span>
            </div>
            <h2 className="text-4xl font-bold mb-6 text-slate-800">The Technology Behind Yatra</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium">
              Advanced algorithms and real-time data processing make accurate predictions possible
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-10 bg-gradient-to-br from-blue-50/90 to-slate-50/90 backdrop-blur-sm border-blue-200 hover:shadow-2xl hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-slate-50 transition-all duration-500 group hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800">GPS & IoT Integration</h3>
              <p className="text-slate-600 mb-6 font-medium leading-relaxed">
                Real-time GPS tracking combined with IoT sensors on buses provides 
                accurate location data and passenger count information.
              </p>
              <div className="space-y-3">
                <div className="flex items-center bg-blue-100 p-3 rounded-xl">
                  <div className="w-3 h-3 rounded-full bg-blue-600 mr-3"></div>
                  <span className="text-sm font-medium text-slate-700">30-second update intervals</span>
                </div>
                <div className="flex items-center bg-blue-100 p-3 rounded-xl">
                  <div className="w-3 h-3 rounded-full bg-blue-600 mr-3"></div>
                  <span className="text-sm font-medium text-slate-700">99.5% GPS accuracy</span>
                </div>
                <div className="flex items-center bg-blue-100 p-3 rounded-xl">
                  <div className="w-3 h-3 rounded-full bg-blue-600 mr-3"></div>
                  <span className="text-sm font-medium text-slate-700">Real-time passenger counting</span>
                </div>
              </div>
            </Card>

            <Card className="p-10 bg-gradient-to-br from-orange-50/90 to-slate-50/90 backdrop-blur-sm border-orange-200 hover:shadow-2xl hover:border-orange-300 hover:bg-gradient-to-br hover:from-orange-50 hover:to-slate-50 transition-all duration-500 group hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                <span className="text-white text-lg">🤖</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800">AI-Powered Predictions</h3>
              <p className="text-slate-600 mb-6 font-medium leading-relaxed">
                Machine learning algorithms analyze traffic patterns, weather conditions, 
                and historical data to provide accurate arrival predictions.
              </p>
              <div className="space-y-3">
                <div className="flex items-center bg-orange-100 p-3 rounded-xl">
                  <div className="w-3 h-3 rounded-full bg-orange-600 mr-3"></div>
                  <span className="text-sm font-medium text-slate-700">Traffic pattern analysis</span>
                </div>
                <div className="flex items-center bg-orange-100 p-3 rounded-xl">
                  <div className="w-3 h-3 rounded-full bg-orange-600 mr-3"></div>
                  <span className="text-sm font-medium text-slate-700">Weather impact modeling</span>
                </div>
                <div className="flex items-center bg-orange-100 p-3 rounded-xl">
                  <div className="w-3 h-3 rounded-full bg-orange-600 mr-3"></div>
                  <span className="text-sm font-medium text-slate-700">Historical data learning</span>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900/20 via-transparent to-blue-900/20"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>
          
          <div className="relative z-10">
            <div className="mb-6">
              <span className="text-6xl animate-bounce">🎯</span>
            </div>
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white via-orange-200 to-white bg-clip-text text-transparent">Ready to Get Started?</h2>
            <p className="text-slate-300 text-xl mb-10 max-w-3xl mx-auto font-medium">
              Join thousands of smart commuters who have already upgraded their 
              public transport experience with Yatra.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-700 hover:to-orange-600 px-8 py-4 text-lg font-semibold transition-all duration-500 rounded-full shadow-xl hover:shadow-2xl hover:scale-105">
                <Download className="mr-3 h-5 w-5" />
                Download App
              </Button>
              <Button size="lg" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-slate-800 px-8 py-4 text-lg font-semibold transition-all duration-500 rounded-full">
                Try Web Version
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowItWorks;