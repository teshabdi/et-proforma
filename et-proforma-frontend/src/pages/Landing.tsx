import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/api';
import { 
  ShoppingCart, 
  Users, 
  Globe, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string;
  image_url: string | null; // ✅ use full image URL
  supplier: {
    id: number;
    user: {
      name: string;
    };
  } | null;
}

const Landing: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      setProducts(response.data.data || response.data || []);
    } catch (error: any) {
      console.error('Failed to fetch products:', error);
      toast({
        title: t('error'),
        description: t('failedToFetchProducts'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: number) => {
    if (!user) {
      toast({
        title: t('authRequired'),
        description: t('pleaseLoginToAddToCart'),
        variant: 'destructive'
      });
      return;
    }
    if (user.role !== 'customer') {
      toast({
        title: t('accessDenied'),
        description: t('onlyCustomersCanAddToCart'),
        variant: 'destructive'
      });
      return;
    }

    try {
      await addToCart(productId, 1);
      toast({
        title: t('addedToCart'),
        description: t('productAddedSuccessfully'),
      });
    } catch {
      toast({
        title: t('error'),
        description: t('failedToAddToCart'),
        variant: 'destructive'
      });
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/contact-us', contactForm);
      toast({
        title: t('messageSent'),
        description: t('thankYouForMessage'),
      });
      setContactForm({ name: '', email: '', message: '' });
    } catch {
      toast({
        title: t('error'),
        description: t('failedToSendMessage'),
        variant: 'destructive'
      });
    }
  };

  const renderProductsSection = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={`skeleton-${i}`} className="animate-pulse">
              <CardHeader className="p-0">
                <div className="h-48 bg-muted rounded-t-lg"></div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-4"></div>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">{t('noProductsFound')}</h3>
          <p>{t('noProductsAvailable')}</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/products">{t('exploreAllProducts')}</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.slice(0, 8).map((product) => (
          <Card key={product.id} className="shadow-card hover:shadow-lg transition-shadow border-2 border-primary/10">
            <CardHeader className="p-0">
              <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover rounded-t-lg"
                    onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                  />
                ) : (
                  <div className="text-muted-foreground">
                    <ShoppingCart className="h-12 w-12" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-2 line-clamp-1">{product.name}</CardTitle>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {product.description || t('noDescription')}
              </p>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                <span className="text-lg font-bold text-primary">
                  ETB {product.price}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {t('supplier')}: {product.supplier?.user?.name || t('unknown')}
              </p>
              <Badge className={product.stock > 0 ? "bg-primary" : "bg-red-500"}>
                {product.stock > 0 ? t('available') : t('outOfStock')}
              </Badge>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              {user?.role === 'customer' ? (
                <Button 
                  className="w-full" 
                  onClick={() => handleAddToCart(product.id)}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {t('addToCart')}
                </Button>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  {t('viewDetails')}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t('heroTitle')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              variant="secondary" 
              size="lg" 
              className="text-primary font-semibold"
              asChild
            >
              <Link to="/register">
                {t('getStarted')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/10"
            >
              {t('learnMore')}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('whyChooseMarketTrade')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('featuresSubtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center shadow-card">
              <CardHeader>
                <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>{t('globalNetwork')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('globalNetworkDesc')}
                </p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-card">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>{t('secureTransactions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('secureTransactionsDesc')}
                </p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-card">
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>{t('fastEfficient')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('fastEfficientDesc')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="products" className="py-16 px-4 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('featuredProducts')}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t('discoverQualityProducts')}
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/products">
                {t('viewAllProducts')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {renderProductsSection()}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 px-4 bg-gradient-card">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              {t('aboutMarketTrade')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {t('aboutMarketTradeDesc')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">10,000+</h3>
                <p className="text-muted-foreground">{t('activeUsers')}</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">50,000+</h3>
                <p className="text-muted-foreground">{t('successfulTransactions')}</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">100+</h3>
                <p className="text-muted-foreground">{t('citiesCovered')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('getInTouch')}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t('contactSubtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>{t('sendMessage')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <Input
                      placeholder={t('yourName')}
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                    <Input
                      type="email"
                      placeholder={t('yourEmail')}
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                    <Textarea
                      placeholder={t('yourMessage')}
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      required
                    />
                    <Button type="submit" className="w-full">
                      {t('sendMessage')}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-6">{t('contactInformation')}</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Mail className="h-6 w-6 text-primary" />
                      <div>
                        <p className="font-medium">{t('email')}</p>
                        <p className="text-muted-foreground">info@markettrade.et</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Phone className="h-6 w-6 text-primary" />
                      <div>
                        <p className="font-medium">{t('phone')}</p>
                        <p className="text-muted-foreground">+251-11-XXX-XXXX</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <MapPin className="h-6 w-6 text-primary" />
                      <div>
                        <p className="font-medium">{t('address')}</p>
                        <p className="text-muted-foreground">Addis Ababa, Ethiopia</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4">{t('businessHours')}</h4>
                  <div className="space-y-2 text-muted-foreground">
                    <p>{t('mondayFriday')}</p>
                    <p>{t('saturday')}</p>
                    <p>{t('sunday')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
