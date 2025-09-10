import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, MapPin, Users, ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative py-20 sm:py-28 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Problem Statement */}
          <div className="mb-8">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-destructive/10 text-destructive border border-destructive/20 mb-4">
              Problem in Small Cities
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Tired of{" "}
              <span className="gradient-primary bg-clip-text text-transparent">
                Unreliable Bus Schedules?
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Small cities and tier-2 towns struggle with unpredictable public transport. 
              No real-time tracking means wasted time, overcrowding, and frustrated commuters.
            </p>
          </div>

          {/* Problem Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center border-destructive/20 bg-destructive/5">
              <Clock className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Wasted Time</h3>
              <p className="text-sm text-muted-foreground">
                Hours spent waiting with no arrival information
              </p>
            </Card>
            <Card className="p-6 text-center border-destructive/20 bg-destructive/5">
              <Users className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Overcrowding</h3>
              <p className="text-sm text-muted-foreground">
                Unpredictable schedules lead to passenger bunching
              </p>
            </Card>
            <Card className="p-6 text-center border-destructive/20 bg-destructive/5">
              <MapPin className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Zero visibility into bus locations and delays
              </p>
            </Card>
          </div>

          {/* Solution */}
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Meet{" "}
              <span className="gradient-primary bg-clip-text text-transparent">
                SmartCommute
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Real-time bus tracking and smart notifications that transform 
              public transport in smaller cities. Know exactly when your bus arrives.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gradient-primary shadow-glow">
                Try SmartCommute
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                Learn How It Works
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;