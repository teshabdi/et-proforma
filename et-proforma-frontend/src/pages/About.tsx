import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  Target, 
  Award, 
  Globe, 
  TrendingUp, 
  Shield,
  Handshake,
  CheckCircle
} from 'lucide-react';

const About: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Trusted Network",
      description: "Connect with verified suppliers and reliable customers worldwide"
    },
    {
      icon: <Shield className="h-6 w-6" />,  
      title: "Secure Trading",
      description: "Advanced security measures to protect your business transactions"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Growth Focused",
      description: "Tools and insights to help your business grow and succeed"
    },
    {
      icon: <Handshake className="h-6 w-6" />,
      title: "Partnership",
      description: "Building long-term partnerships between suppliers and customers"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Users" },
    { number: "500+", label: "Verified Suppliers" },
    { number: "50+", label: "Countries" },
    { number: "99.9%", label: "Uptime" }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About MarketTrade</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Connecting businesses worldwide through a trusted B2B marketplace platform. 
          We facilitate seamless trade relationships between suppliers and customers globally.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <Card className="shadow-card">
          <CardContent className="p-8">
            <div className="flex items-center mb-4">
              <Target className="h-8 w-8 text-primary mr-3" />
              <h2 className="text-2xl font-bold">Our Mission</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              To democratize global trade by providing a secure, efficient, and user-friendly 
              platform that connects businesses of all sizes. We strive to eliminate barriers 
              in international commerce and create opportunities for growth and prosperity.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-8">
            <div className="flex items-center mb-4">
              <Globe className="h-8 w-8 text-primary mr-3" />
              <h2 className="text-2xl font-bold">Our Vision</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              To become the world's most trusted B2B marketplace, where businesses can 
              discover new opportunities, build lasting partnerships, and achieve sustainable 
              growth through innovative technology and exceptional service.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose MarketTrade?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-card text-center">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  <div className="text-primary">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-primary rounded-lg p-8 mb-16">
        <h2 className="text-3xl font-bold text-center text-primary-foreground mb-12">
          Our Impact
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-primary-foreground mb-2">
                {stat.number}
              </div>
              <div className="text-primary-foreground/80">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Integrity</h3>
            <p className="text-muted-foreground">
              We conduct business with honesty, transparency, and ethical practices 
              in every interaction.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Excellence</h3>
            <p className="text-muted-foreground">
              We strive for excellence in our platform, services, and customer 
              experience at every touchpoint.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Community</h3>
            <p className="text-muted-foreground">
              We believe in building a strong community where businesses support 
              and grow with each other.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-muted rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Ready to Join MarketTrade?</h2>
        <p className="text-muted-foreground mb-6">
          Start your journey with us today and discover new business opportunities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/register" 
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Get Started
          </a>
          <a 
            href="/contact" 
            className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-md hover:bg-muted transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;