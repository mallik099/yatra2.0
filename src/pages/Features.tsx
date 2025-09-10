import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Smartphone, 
  Clock, 
  Bell, 
  Users, 
  MapPin,
  Zap,
  Shield,
  Wifi,
  Battery,
  Navigation,
  Search,
  Plus
} from "lucide-react";

const Features = () => {
  const coreFeatures = [
    {
      icon: Smartphone,
      title: "Real-time Bus Tracking",
      description: "Track your bus live on an interactive map with GPS precision. See exactly where it is and which direction it's heading.",
      benefits: ["Live GPS updates", "Interactive map view", "Multi-route support", "Offline map caching"]
    },
    {
      icon: Clock,
      title: "Estimated Arrival Times",
      description: "Get accurate arrival predictions based on real traffic conditions, weather, and historical data patterns.",
      benefits: ["Traffic-aware ETAs", "Weather adjustments", "Historical accuracy", "Route optimization"]
    },
    {
      icon: Bell,
      title: "Smart Notifications & Alerts",
      description: "Receive intelligent notifications about delays, route changes, and optimal departure times from your location.",
      benefits: ["Delay notifications", "Route change alerts", "Departure reminders", "Custom preferences"]
    },
    {
      icon: Users,
      title: "Reduced Waiting & Crowding",
      description: "See real-time bus capacity and get suggestions for less crowded alternatives to optimize your journey.",
      benefits: ["Capacity indicators", "Alternative suggestions", "Crowd predictions", "Peak hour insights"]
    }
  ];

  const additionalFeatures = [
    {
      icon: MapPin,
      title: "Stop Finder",
      description: "Locate nearby bus stops with walking directions"
    },
    {
      icon: Navigation,
      title: "Route Planning",
      description: "Plan multi-stop journeys with transfer guidance"
    },
    {
      icon: Zap,
      title: "Quick Actions",
      description: "Save favorite routes and stops for instant access"
    },
    {
      icon: Shield,
      title: "Safety Features",
      description: "Emergency contacts and safe stop recommendations"
    },
    {
      icon: Wifi,
      title: "Offline Mode",
      description: "Core features work even without internet connection"
    },
    {
      icon: Battery,
      title: "Battery Optimized",
      description: "Efficient background updates to preserve battery life"
    }
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Feature Overview
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Powerful Features for{" "}
            <span className="gradient-primary bg-clip-text text-transparent">
              Smart Commuting
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover how SmartCommute transforms unreliable public transport into 
            a predictable, efficient, and stress-free experience.
          </p>
        </div>

        {/* Core Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Real-time Bus Tracking */}
            <Card className="p-8 transition-smooth hover:shadow-glow hover:-translate-y-1">
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Smartphone className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-3">Real-time Bus Tracking</h3>
                  <p className="text-muted-foreground mb-4">Track your bus live on an interactive map with GPS precision. See exactly where it is and which direction it's heading.</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {["Live GPS updates", "Interactive map view", "Multi-route support", "Offline map caching"].map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center text-sm">
                        <div className="w-2 h-2 rounded-full bg-success mr-2"></div>
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4 bg-muted/30 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bus-number">Bus Number</Label>
                    <Input id="bus-number" placeholder="Enter bus number (e.g., DL1PC7777)" />
                  </div>
                  <div>
                    <Label htmlFor="route">Route</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select route" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="route-1">Route 1: Connaught Place - AIIMS</SelectItem>
                        <SelectItem value="route-2">Route 2: Karol Bagh - India Gate</SelectItem>
                        <SelectItem value="route-3">Route 3: Lajpat Nagar - Red Fort</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Track Bus
                </Button>
              </div>
            </Card>

            {/* Estimated Arrival Times */}
            <Card className="p-8 transition-smooth hover:shadow-glow hover:-translate-y-1">
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-3">Estimated Arrival Times</h3>
                  <p className="text-muted-foreground mb-4">Get accurate arrival predictions based on real traffic conditions, weather, and historical data patterns.</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {["Traffic-aware ETAs", "Weather adjustments", "Historical accuracy", "Route optimization"].map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center text-sm">
                        <div className="w-2 h-2 rounded-full bg-success mr-2"></div>
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4 bg-muted/30 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="from-stop">From Stop</Label>
                    <Input id="from-stop" placeholder="Current location" />
                  </div>
                  <div>
                    <Label htmlFor="to-stop">To Stop</Label>
                    <Input id="to-stop" placeholder="Destination" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="departure-time">Preferred Departure Time</Label>
                  <Input id="departure-time" type="time" />
                </div>
                <Button className="w-full">
                  <Clock className="h-4 w-4 mr-2" />
                  Get ETA
                </Button>
              </div>
            </Card>

            {/* Smart Notifications & Alerts */}
            <Card className="p-8 transition-smooth hover:shadow-glow hover:-translate-y-1">
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Bell className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-3">Smart Notifications & Alerts</h3>
                  <p className="text-muted-foreground mb-4">Receive intelligent notifications about delays, route changes, and optimal departure times from your location.</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {["Delay notifications", "Route change alerts", "Departure reminders", "Custom preferences"].map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center text-sm">
                        <div className="w-2 h-2 rounded-full bg-success mr-2"></div>
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4 bg-muted/30 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="delay-alerts">Delay Alerts</Label>
                    <Switch id="delay-alerts" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="departure-reminders">Departure Reminders</Label>
                    <Switch id="departure-reminders" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="route-changes">Route Change Alerts</Label>
                    <Switch id="route-changes" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="reminder-time">Reminder Time (minutes before)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">
                  <Bell className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </Card>

            {/* Reduced Waiting & Crowding */}
            <Card className="p-8 transition-smooth hover:shadow-glow hover:-translate-y-1">
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-3">Reduced Waiting & Crowding</h3>
                  <p className="text-muted-foreground mb-4">See real-time bus capacity and get suggestions for less crowded alternatives to optimize your journey.</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {["Capacity indicators", "Alternative suggestions", "Crowd predictions", "Peak hour insights"].map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center text-sm">
                        <div className="w-2 h-2 rounded-full bg-success mr-2"></div>
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4 bg-muted/30 rounded-lg p-4">
                <div>
                  <Label htmlFor="comfort-level">Preferred Comfort Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select comfort level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any capacity</SelectItem>
                      <SelectItem value="comfortable">Comfortable (60% capacity)</SelectItem>
                      <SelectItem value="spacious">Spacious (40% capacity)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="alternative-routes">Show Alternative Routes</Label>
                  <Switch id="alternative-routes" />
                </div>
                <Button className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Find Less Crowded Bus
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Additional Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stop Finder */}
            <Card className="p-6 transition-smooth hover:shadow-md hover:-translate-y-1">
              <MapPin className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Stop Finder</h3>
              <p className="text-muted-foreground text-sm mb-4">Locate nearby bus stops with walking directions</p>
              <div className="space-y-3">
                <Input placeholder="Search location or landmark" />
                <Button size="sm" className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  Find Stops
                </Button>
              </div>
            </Card>

            {/* Route Planning */}
            <Card className="p-6 transition-smooth hover:shadow-md hover:-translate-y-1">
              <Navigation className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Route Planning</h3>
              <p className="text-muted-foreground text-sm mb-4">Plan multi-stop journeys with transfer guidance</p>
              <div className="space-y-3">
                <Input placeholder="Starting point" />
                <Input placeholder="Destination" />
                <Button size="sm" className="w-full">
                  <Navigation className="h-4 w-4 mr-2" />
                  Plan Route
                </Button>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 transition-smooth hover:shadow-md hover:-translate-y-1">
              <Zap className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Quick Actions</h3>
              <p className="text-muted-foreground text-sm mb-4">Save favorite routes and stops for instant access</p>
              <div className="space-y-3">
                <Input placeholder="Route name (e.g., Home to Office)" />
                <Button size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Favorite
                </Button>
              </div>
            </Card>

            {/* Safety Features */}
            <Card className="p-6 transition-smooth hover:shadow-md hover:-translate-y-1">
              <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Safety Features</h3>
              <p className="text-muted-foreground text-sm mb-4">Emergency contacts and safe stop recommendations</p>
              <div className="space-y-3">
                <Input placeholder="Emergency contact number" />
                <div className="flex items-center justify-between">
                  <Label htmlFor="share-location" className="text-sm">Share Live Location</Label>
                  <Switch id="share-location" />
                </div>
              </div>
            </Card>

            {/* Offline Mode */}
            <Card className="p-6 transition-smooth hover:shadow-md hover:-translate-y-1">
              <Wifi className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Offline Mode</h3>
              <p className="text-muted-foreground text-sm mb-4">Core features work even without internet connection</p>
              <div className="space-y-3">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Download maps for..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current area</SelectItem>
                    <SelectItem value="home">Home area</SelectItem>
                    <SelectItem value="work">Work area</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" className="w-full">
                  <Wifi className="h-4 w-4 mr-2" />
                  Download Offline Data
                </Button>
              </div>
            </Card>

            {/* Battery Optimized */}
            <Card className="p-6 transition-smooth hover:shadow-md hover:-translate-y-1">
              <Battery className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Battery Optimized</h3>
              <p className="text-muted-foreground text-sm mb-4">Efficient background updates to preserve battery life</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="power-save" className="text-sm">Power Save Mode</Label>
                  <Switch id="power-save" />
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Update frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="real-time">Real-time</SelectItem>
                    <SelectItem value="30s">Every 30 seconds</SelectItem>
                    <SelectItem value="1m">Every minute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="bg-transport-bg rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">
            SmartCommute vs Traditional Transport
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-destructive">Traditional Public Transport</h3>
              <div className="space-y-3">
                {[
                  "No real-time information",
                  "Unpredictable arrival times",
                  "Manual schedule checking",
                  "Overcrowding surprises",
                  "No capacity information",
                  "Limited route planning"
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-destructive mr-3"></div>
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-success">With SmartCommute</h3>
              <div className="space-y-3">
                {[
                  "Live GPS tracking",
                  "Accurate arrival predictions",
                  "Automated smart notifications",
                  "Crowd level indicators",
                  "Real-time capacity updates",
                  "Intelligent route optimization"
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-success mr-3"></div>
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;