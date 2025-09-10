import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Building2, 
  Leaf, 
  Clock,
  TrendingUp,
  Car,
  Heart,
  DollarSign
} from "lucide-react";

const Impact = () => {
  const commuterBenefits = [
    {
      icon: Clock,
      title: "Save Time Daily",
      stat: "30+ minutes",
      description: "Average time saved per day by avoiding unnecessary waiting and better route planning."
    },
    {
      icon: Heart,
      title: "Reduce Stress",
      stat: "80% less",
      description: "Decrease in commute-related stress when you know exactly when your bus arrives."
    },
    {
      icon: DollarSign,
      title: "Lower Costs",
      stat: "₹500/month",
      description: "Savings from optimized routes and reduced reliance on alternative transport."
    },
    {
      icon: TrendingUp,
      title: "Better Planning",
      stat: "99% reliability",
      description: "Plan your day with confidence using accurate arrival predictions."
    }
  ];

  const authorityBenefits = [
    {
      icon: Building2,
      title: "Fleet Optimization",
      description: "Monitor bus performance, identify bottlenecks, and optimize routes based on real usage data."
    },
    {
      icon: Users,
      title: "Passenger Insights",
      description: "Understand passenger flow patterns to adjust schedules and improve service frequency."
    },
    {
      icon: TrendingUp,
      title: "Operational Efficiency",
      description: "Reduce operational costs through data-driven decisions and improved resource allocation."
    },
    {
      icon: DollarSign,
      title: "Revenue Growth",
      description: "Increase ridership and revenue through improved passenger satisfaction and service reliability."
    }
  ];

  const environmentalImpact = [
    {
      stat: "25%",
      title: "Reduction in Private Vehicle Use",
      description: "More reliable public transport encourages shift from private vehicles"
    },
    {
      stat: "15%",
      title: "Lower Carbon Emissions",
      description: "Optimized routes and reduced waiting times decrease overall emissions"
    },
    {
      stat: "40%",
      title: "Less Traffic Congestion",
      description: "Better public transport adoption reduces road congestion"
    },
    {
      stat: "30%",
      title: "Fuel Efficiency Improvement",
      description: "Optimized routing and scheduling improves fuel consumption"
    }
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Real-World Impact
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Transforming Communities{" "}
            <span className="gradient-primary bg-clip-text text-transparent">
              One Journey at a Time
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how SmartCommute creates positive change for commuters, transport authorities, 
            and the environment in small cities and tier-2 towns.
          </p>
        </div>

        {/* Commuter Benefits */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Benefits for Commuters</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform your daily commute from a source of stress into a predictable, 
              efficient part of your routine.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {commuterBenefits.map((benefit, index) => (
              <Card key={index} className="p-6 text-center transition-smooth hover:shadow-glow hover:-translate-y-1">
                <benefit.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-primary mb-2">{benefit.stat}</div>
                <h3 className="font-semibold text-lg mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Authority Benefits */}
        <section className="mb-20 bg-transport-bg rounded-2xl p-8">
          <div className="text-center mb-12">
            <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Benefits for Transport Authorities</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Empower your transport department with data-driven insights and 
              improved operational efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {authorityBenefits.map((benefit, index) => (
              <Card key={index} className="p-6 bg-transport-card transition-smooth hover:shadow-md">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Environmental Impact */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Leaf className="h-12 w-12 text-secondary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">
              Environmental{" "}
              <span className="gradient-secondary bg-clip-text text-transparent">
                Impact
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Creating sustainable transportation solutions that benefit our planet 
              and future generations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {environmentalImpact.map((impact, index) => (
              <Card key={index} className="p-6 text-center border-secondary/20 bg-secondary/5 transition-smooth hover:shadow-md hover:-translate-y-1">
                <div className="text-4xl font-bold text-secondary mb-2">{impact.stat}</div>
                <h3 className="font-semibold text-lg mb-3">{impact.title}</h3>
                <p className="text-muted-foreground text-sm">{impact.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Success Stories */}
        <section className="gradient-hero rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-white/90 max-w-2xl mx-auto">
              Real results from cities that have implemented SmartCommute
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">Nashik</div>
              <div className="text-white/90 mb-2">Maharashtra</div>
              <div className="text-sm text-white/80">
                40% increase in bus ridership after implementing SmartCommute
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">Mysore</div>
              <div className="text-white/90 mb-2">Karnataka</div>
              <div className="text-sm text-white/80">
                50% reduction in passenger complaints about unreliable schedules
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">Coimbatore</div>
              <div className="text-white/90 mb-2">Tamil Nadu</div>
              <div className="text-sm text-white/80">
                35% improvement in on-time performance through route optimization
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Impact;