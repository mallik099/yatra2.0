import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Car, Factory, Wind } from "lucide-react";

const PollutionReduction = () => {
  const pollutionStats = [
    {
      icon: Car,
      stat: "35%",
      title: "Fewer Cars on Roads",
      description: "Each bus replaces 35+ private vehicles, dramatically reducing emissions"
    },
    {
      icon: Factory,
      stat: "25%",
      title: "Lower CO2 Emissions",
      description: "Smart routing cuts carbon dioxide emissions by optimizing bus routes"
    },
    {
      icon: Wind,
      stat: "40%",
      title: "Cleaner Air Quality",
      description: "Reduced vehicle emissions lead to measurably cleaner city air"
    },
    {
      icon: Leaf,
      stat: "50%",
      title: "Green Commute Adoption",
      description: "More commuters choosing eco-friendly public transport options"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-64 h-64 bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="mb-6">
            <span className="text-6xl animate-bounce">🌱</span>
          </div>
          <Badge variant="outline" className="mb-6 bg-green-100 border-green-300 text-green-800 px-4 py-2 text-sm font-semibold">
            Environmental Impact
          </Badge>
          <h2 className="text-4xl font-bold mb-6 text-slate-800">
            Fighting Air Pollution{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              One Bus at a Time
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium">
            Every time you choose the bus over a private vehicle, you're actively reducing air pollution 
            and helping create cleaner, healthier cities for everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pollutionStats.map((stat, index) => {
            const colors = ['bg-green-600', 'bg-emerald-600', 'bg-green-700', 'bg-emerald-500'];
            return (
              <Card key={index} className="p-8 text-center bg-white/90 backdrop-blur-sm border-green-200 hover:shadow-2xl hover:border-green-300 hover:bg-white transition-all duration-500 group hover:-translate-y-3">
                <div className={`w-14 h-14 ${colors[index]} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                  {stat.stat}
                </div>
                <h3 className="font-bold text-xl mb-4 text-slate-800">{stat.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">{stat.description}</p>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-200">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            🌍 Your Daily Impact
          </h3>
          <p className="text-lg text-slate-600 mb-6">
            By using Yatra to choose public transport, you prevent approximately{" "}
            <span className="font-bold text-green-600">2.3 kg of CO2</span> emissions per day
          </p>
          <div className="flex justify-center items-center space-x-8 text-sm text-slate-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
              <span>Cleaner Air</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-emerald-600 rounded-full mr-2"></div>
              <span>Less Traffic</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Healthier Cities</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PollutionReduction;