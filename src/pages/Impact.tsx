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
      stat: "35%",
      title: "Reduction in Private Vehicle Use",
      description: "Reliable bus tracking encourages more people to choose pollution-free public transport"
    },
    {
      stat: "25%",
      title: "Lower Carbon Emissions",
      description: "Smart routing and reduced idle time significantly cut harmful CO2 emissions"
    },
    {
      stat: "45%",
      title: "Less Air Pollution",
      description: "Fewer private vehicles on roads means cleaner air and healthier communities"
    },
    {
      stat: "30%",
      title: "Fuel Efficiency Improvement",
      description: "Optimized bus routes reduce fuel consumption and environmental impact"
    }
  ];

  const additionalEnvironmentalBenefits = [
    {
      icon: Leaf,
      title: "CO2 Reduction",
      stat: "2.5 tons",
      description: "Average CO2 saved per commuter annually by switching to public transport"
    },
    {
      icon: Car,
      title: "Traffic Congestion",
      stat: "40% less",
      description: "Reduced traffic jams lead to lower emissions from idling vehicles"
    },
    {
      icon: Heart,
      title: "Air Quality Index",
      stat: "20% better",
      description: "Improved air quality in cities with higher public transport adoption"
    },
    {
      icon: TrendingUp,
      title: "Green Energy",
      stat: "15% more",
      description: "Increased adoption of electric and CNG buses through better utilization"
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
            <span className="text-6xl animate-bounce">🚍</span>
          </div>
          <Badge variant="outline" className="mb-6 bg-gradient-to-r from-slate-100 to-orange-100 border-orange-300 text-slate-800 px-4 py-2 text-sm font-semibold">
            Real-World Impact
          </Badge>
          <h1 className="text-5xl sm:text-6xl font-bold mb-8 text-slate-800">
            Transforming Communities{" "}
            <span className="bg-gradient-to-r from-slate-800 to-orange-600 bg-clip-text text-transparent">
              One Journey at a Time
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto font-medium leading-relaxed">
            See how Yatra reduces pollution, cuts emissions, and creates positive environmental change 
            for commuters, transport authorities, and communities in small cities and tier-2 towns.
          </p>
        </div>

        {/* Commuter Benefits */}
        <section className="mb-24 bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/30">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-6 text-slate-800">Benefits for Commuters</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium">
              Transform your daily commute from a source of stress into a predictable, 
              efficient part of your routine.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {commuterBenefits.map((benefit, index) => {
              const colors = ['bg-slate-800', 'bg-orange-600', 'bg-slate-700', 'bg-orange-500'];
              return (
                <Card key={index} className="p-8 text-center bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-2xl hover:border-orange-200 hover:bg-white transition-all duration-500 group hover:-translate-y-3">
                  <div className={`w-14 h-14 ${colors[index]} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <benefit.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-orange-600 bg-clip-text text-transparent mb-3">{benefit.stat}</div>
                  <h3 className="font-bold text-xl mb-4 text-slate-800">{benefit.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Authority Benefits */}
        <section className="mb-24 bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 rounded-3xl p-12 shadow-2xl border border-slate-200/50">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-6 text-slate-800">Benefits for Transport Authorities</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium">
              Empower your transport department with data-driven insights and 
              improved operational efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {authorityBenefits.map((benefit, index) => {
              const colors = ['bg-slate-800', 'bg-orange-600', 'bg-slate-700', 'bg-orange-500'];
              return (
                <Card key={index} className="p-8 bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-2xl hover:border-orange-200 hover:bg-white transition-all duration-500 group hover:-translate-y-2">
                  <div className="flex items-start space-x-6">
                    <div className={`p-4 rounded-2xl ${colors[index]} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                      <benefit.icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-3 text-slate-800">{benefit.title}</h3>
                      <p className="text-slate-600 leading-relaxed font-medium">{benefit.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Environmental Impact */}
        <section className="mb-24 bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/30">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-6 text-slate-800">
              Pollution Reduction &{" "}
              <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                Environmental Impact
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium">
              Fighting air pollution and creating cleaner cities through smarter public transportation 
              that reduces harmful emissions and protects our environment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {environmentalImpact.map((impact, index) => {
              const colors = ['bg-green-600', 'bg-emerald-600', 'bg-green-700', 'bg-emerald-500'];
              return (
                <Card key={index} className="p-8 text-center bg-gradient-to-br from-green-50/90 to-emerald-50/90 backdrop-blur-sm border-green-200 hover:shadow-2xl hover:border-green-300 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition-all duration-500 group hover:-translate-y-3">
                  <div className={`w-12 h-12 ${colors[index]} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">{impact.stat}</div>
                  <h3 className="font-bold text-lg mb-4 text-slate-800">{impact.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">{impact.description}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Success Stories */}
        <section className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900/20 via-transparent to-blue-900/20"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>
          
          <div className="text-center mb-12 relative z-10">
            <div className="mb-6">
              <span className="text-6xl animate-bounce">🏅</span>
            </div>
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white via-orange-200 to-white bg-clip-text text-transparent">Success Stories</h2>
            <p className="text-slate-300 max-w-3xl mx-auto text-xl font-medium">
              Real results from cities that have implemented Yatra
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl font-bold mb-3 bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">Nashik</div>
              <div className="text-slate-300 mb-4 text-lg font-medium">Maharashtra</div>
              <div className="text-slate-200 font-medium">
                40% increase in bus ridership after implementing Yatra
              </div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">Mysore</div>
              <div className="text-slate-300 mb-4 text-lg font-medium">Karnataka</div>
              <div className="text-slate-200 font-medium">
                50% reduction in passenger complaints about unreliable schedules
              </div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl font-bold mb-3 bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">Coimbatore</div>
              <div className="text-slate-300 mb-4 text-lg font-medium">Tamil Nadu</div>
              <div className="text-slate-200 font-medium">
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