import Hero from "@/components/Hero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Smartphone, 
  Clock, 
  Bell, 
  Users, 
  ArrowRight,
  CheckCircle,
  Star
} from "lucide-react";

const Home = () => {
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
      title: "Crowd Management",
      description: "See bus capacity levels to avoid overcrowded rides and plan better."
    }
  ];

  const benefits = [
    "Save 30+ minutes daily on average",
    "Reduce waiting stress by 80%",
    "Never miss your bus again",
    "Plan your day with confidence"
  ];

  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Features Section */}
      <section className="py-20 bg-transport-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Smart Features for{" "}
              <span className="gradient-primary bg-clip-text text-transparent">
                Modern Commuting
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              SmartCommute brings big-city transportation technology to smaller communities, 
              making every journey predictable and stress-free.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center transition-smooth hover:shadow-glow hover:-translate-y-1 bg-transport-card">
                <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Transform Your{" "}
                <span className="gradient-secondary bg-clip-text text-transparent">
                  Daily Commute
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of commuters who have already upgraded their 
                public transport experience with SmartCommute.
              </p>
              
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-success mr-3 flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button size="lg" className="gradient-primary">
                Start Your Smart Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="bg-transport-bg rounded-2xl p-8">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-warning fill-current" />
                  ))}
                </div>
                <blockquote className="text-lg italic mb-4">
                  "SmartCommute has completely changed how I travel. No more guessing when the bus will arrive!"
                </blockquote>
                <div className="text-sm text-muted-foreground">
                  - Sarah K., Daily Commuter
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">10k+</div>
                  <div className="text-sm text-muted-foreground">Happy Users</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Cities Served</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">99%</div>
                  <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Revolutionize Your Commute?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join the smart commuting revolution. Download SmartCommute today 
            and never wait in uncertainty again.
          </p>
          <Button size="lg" variant="secondary" className="shadow-glow">
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;