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
      description: "Questions about SmartCommute features and services"
    },
    {
      icon: Building2,
      title: "City Partnerships",
      description: "Interested in implementing SmartCommute in your city"
    },
    {
      icon: MessageSquare,
      title: "Technical Support",
      description: "Need help with the app or reporting issues"
    }
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Get in Touch
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Contact{" "}
            <span className="gradient-primary bg-clip-text text-transparent">
              SmartCommute
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about SmartCommute? Want to implement it in your city? 
            We'd love to hear from you and help transform public transport together.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Send us a Message</h2>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
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
                  className="w-full gradient-primary" 
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
              <h3 className="text-xl font-semibold mb-4">Why Choose SmartCommute?</h3>
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
              Common questions about SmartCommute implementation and features
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-3">How does SmartCommute work in small cities?</h3>
              <p className="text-muted-foreground">
                SmartCommute is specifically designed for tier-2 and tier-3 cities. We work with 
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
              <h3 className="font-semibold text-lg mb-3">Is SmartCommute free for passengers?</h3>
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