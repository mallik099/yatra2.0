import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageSquare,
  Users,
  Building2,
  CheckCircle
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent Successfully!",
      description: "We'll get back to you within 24 hours.",
    });
    
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "support@smartcommute.com",
      description: "Send us an email anytime"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+91 9876543210",
      description: "Mon-Fri, 9AM-6PM IST"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "Tech Hub, Bangalore, India",
      description: "Our headquarters"
    },
    {
      icon: Clock,
      title: "Response Time",
      content: "Within 24 hours",
      description: "Average response time"
    }
  ];

  const inquiryTypes = [
    {
      icon: Users,
      title: "General Inquiries",
      description: "Questions about Yatra features and services"
    },
    {
      icon: Building2,
      title: "City Partnerships",
      description: "Interested in implementing Yatra in your city"
    },
    {
      icon: MessageSquare,
      title: "Technical Support",
      description: "Need help with the app or reporting issues"
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
        <div className="text-center mb-16 bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/30">
          <div className="mb-6">
            <span className="text-6xl animate-bounce">📞</span>
          </div>
          <Badge variant="outline" className="mb-6 bg-gradient-to-r from-slate-100 to-orange-100 border-orange-300 text-slate-800 px-4 py-2 text-sm font-semibold">
            Get in Touch
          </Badge>
          <h1 className="text-5xl sm:text-6xl font-bold mb-8 text-slate-800">
            Contact{" "}
            <span className="bg-gradient-to-r from-slate-800 to-orange-600 bg-clip-text text-transparent">
              Yatra
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto font-medium leading-relaxed">
            Have questions about Yatra? Want to implement it in your city? 
            We'd love to hear from you and help transform public transport together.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 bg-white/90 backdrop-blur-sm border-slate-200 shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-500">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white text-xl">✉️</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-800">Send us a Message</h2>
                    <p className="text-slate-600 font-medium">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="What is this regarding?"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more about your inquiry..."
                    className="min-h-[120px]"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-900 hover:to-slate-800 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <info.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{info.title}</div>
                      <div className="text-primary font-medium">{info.content}</div>
                      <div className="text-sm text-muted-foreground">{info.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Inquiry Types */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">What can we help with?</h3>
              <div className="space-y-4">
                {inquiryTypes.map((type, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <type.icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{type.title}</div>
                      <div className="text-sm text-muted-foreground">{type.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Facts */}
            <Card className="p-6 bg-transport-bg">
              <h3 className="text-xl font-semibold mb-4">Why Choose Yatra?</h3>
              <div className="space-y-3">
                {[
                  "Serving 50+ cities across India",
                  "10,000+ daily active users",
                  "99% prediction accuracy",
                  "24/7 customer support"
                ].map((fact, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-3 flex-shrink-0" />
                    <span className="text-sm">{fact}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Common questions about Yatra implementation and features
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-3">How does Yatra work in small cities?</h3>
              <p className="text-muted-foreground">
                Yatra is specifically designed for tier-2 and tier-3 cities. We work with 
                local transport authorities to install GPS devices on buses and provide real-time 
                tracking without requiring expensive infrastructure.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-3">What's the implementation timeline?</h3>
              <p className="text-muted-foreground">
                Typically 3-6 months from initial contact to full deployment. This includes 
                hardware installation, system setup, testing, and staff training.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-3">Is Yatra free for passengers?</h3>
              <p className="text-muted-foreground">
                Yes! The app and website are completely free for passengers. Cities typically 
                pay a subscription fee for the tracking infrastructure and management dashboard.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-3">How accurate are the predictions?</h3>
              <p className="text-muted-foreground">
                Our AI algorithms achieve 99% accuracy in normal conditions. Predictions account 
                for traffic, weather, and historical patterns to provide reliable arrival times.
              </p>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;