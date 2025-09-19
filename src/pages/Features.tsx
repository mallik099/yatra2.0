import YatraMap from "@/components/YatraMap";
import QuickActions from "@/components/Features/QuickActions";
import InteractiveFeatures from "@/components/Features/InteractiveFeatures";

const Features = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-blue-400/15 to-orange-400/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-gradient-to-r from-orange-400/15 to-slate-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-slate-600/10 to-orange-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-slate-500/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-slate-400/8 to-blue-400/8 rounded-full blur-3xl animate-spin-slow"></div>
      {/* Enhanced Header */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/25 via-transparent to-blue-900/25"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-40 h-40 bg-orange-500/15 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-500/15 rounded-full blur-2xl animate-pulse delay-500"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-orange-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/4 right-1/3 w-36 h-36 bg-slate-500/10 rounded-full blur-2xl animate-pulse delay-1500"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="mb-6">
            <span className="text-6xl animate-bounce">🚌</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-white via-orange-200 to-white bg-clip-text text-transparent animate-pulse">
            Yatra Features
          </h1>
          <p className="text-slate-200 max-w-3xl mx-auto text-xl font-medium">
            Professional bus tracking system with advanced real-time capabilities
          </p>
          <div className="flex justify-center mt-8 space-x-4">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-200"></div>
            <div className="w-3 h-3 bg-slate-400 rounded-full animate-pulse delay-400"></div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid gap-12">
          <div className="bg-gradient-to-br from-white/95 to-yellow-50/90 backdrop-blur-sm border border-yellow-200/50 rounded-2xl p-8 shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] hover:border-yellow-300 hover:bg-gradient-to-br hover:from-white hover:to-yellow-50/30 transition-all duration-700 group hover:-translate-y-3">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 via-yellow-400 to-amber-400 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 shadow-xl group-hover:shadow-2xl">
                <span className="text-white text-2xl animate-pulse">🗺️</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-800 group-hover:text-yellow-600 transition-colors duration-700 group-hover:scale-105">Live Bus Tracking Map</h2>
            </div>
            <div className="h-96 rounded-xl overflow-hidden">
              <YatraMap />
            </div>
          </div>

          <div className="bg-gradient-to-br from-white/95 to-orange-50/90 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-8 shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] hover:border-orange-300 hover:bg-gradient-to-br hover:from-white hover:to-orange-50/50 transition-all duration-700 group hover:-translate-y-3">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 via-orange-500 to-orange-400 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-700 shadow-xl group-hover:shadow-2xl">
                <span className="text-white text-2xl animate-pulse">🔧</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors duration-700 group-hover:scale-105">Interactive Features</h2>
            </div>
            <InteractiveFeatures />
          </div>

          <div className="bg-gradient-to-br from-white/95 to-slate-50/90 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-8 shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] hover:border-orange-300 hover:bg-gradient-to-br hover:from-white hover:to-slate-50/50 transition-all duration-700 group hover:-translate-y-3">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 shadow-xl group-hover:shadow-2xl">
                <span className="text-white text-2xl animate-pulse">⚡</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-800 group-hover:text-yellow-600 transition-colors duration-700 group-hover:scale-105">Quick Actions</h2>
            </div>
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;