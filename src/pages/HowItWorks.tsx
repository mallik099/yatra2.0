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
      description: "Launch SmartCommute on your mobile device or visit our website from any browser.",
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
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Simple Process
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            How{" "}
            <span className="gradient-primary bg-clip-text text-transparent">
              SmartCommute
            </span>{" "}
            Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
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
                
                <Card className="p-8 transition-smooth hover:shadow-glow hover:-translate-y-1">
                  <div className="grid md:grid-cols-3 gap-8 items-center">
                    {/* Step Number & Icon */}
                    <div className="flex items-center space-x-6 md:justify-start justify-center">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-lg">
                          {step.step}
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-primary/10">
                        <step.icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="md:col-span-2">
                      <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                      <p className="text-muted-foreground text-lg mb-4">{step.description}</p>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-success mr-2 flex-shrink-0" />
                            <span className="text-sm">{detail}</span>
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
        <section className="mb-20 bg-transport-bg rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center bg-transport-card transition-smooth hover:shadow-md">
                <feature.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Technology Behind It */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Technology Behind SmartCommute</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced algorithms and real-time data processing make accurate predictions possible
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8">
              <h3 className="text-xl font-semibold mb-4">GPS & IoT Integration</h3>
              <p className="text-muted-foreground mb-4">
                Real-time GPS tracking combined with IoT sensors on buses provides 
                accurate location data and passenger count information.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-3"></div>
                  <span className="text-sm">30-second update intervals</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-3"></div>
                  <span className="text-sm">99.5% GPS accuracy</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-3"></div>
                  <span className="text-sm">Real-time passenger counting</span>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <h3 className="text-xl font-semibold mb-4">AI-Powered Predictions</h3>
              <p className="text-muted-foreground mb-4">
                Machine learning algorithms analyze traffic patterns, weather conditions, 
                and historical data to provide accurate arrival predictions.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-secondary mr-3"></div>
                  <span className="text-sm">Traffic pattern analysis</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-secondary mr-3"></div>
                  <span className="text-sm">Weather impact modeling</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-secondary mr-3"></div>
                  <span className="text-sm">Historical data learning</span>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center gradient-hero rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of smart commuters who have already upgraded their 
            public transport experience with SmartCommute.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="shadow-glow">
              <Download className="mr-2 h-5 w-5" />
              Download App
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Try Web Version
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowItWorks;