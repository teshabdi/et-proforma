import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, RegisterData } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Users, Building2 } from 'lucide-react';

const Register: React.FC = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'customer' | 'supplier' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    phone_number: '',
    industry: '',
    business_name: '',
    business_type: '',
    document: undefined
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: fileInput.files?.[0] || undefined
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast({
        title: t('error'),
        description: "Please select a role",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const registerData: RegisterData = {
        ...formData,
        role: selectedRole,
      };
      
      await register(registerData);
      toast({
        title: t('success'),
        description: "Account created successfully!",
      });
      navigate('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed";
      toast({
        title: t('error'),
        description: message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-card px-4 py-8">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('createAccount')}</h1>
            <p className="text-muted-foreground">Choose your account type to get started</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Customer Registration Card */}
            <Card 
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-primary/50"
              onClick={() => setSelectedRole('customer')}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">{t('customer')}</CardTitle>
                <CardDescription className="text-sm">
                  Buy products and create RFQs (Request for Quotations)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Browse and purchase products
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Create Request for Quotations
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Manage orders and payments
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Chat with suppliers
                  </div>
                </div>
                <Button className="w-full mt-4" size="lg">
                  Register as Customer
                </Button>
              </CardContent>
            </Card>

            {/* Supplier Registration Card */}
            <Card 
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-primary/50"
              onClick={() => setSelectedRole('supplier')}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">{t('supplier')}</CardTitle>
                <CardDescription className="text-sm">
                  Sell products and respond to RFQs from customers
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    List and manage products
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Respond to RFQs
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Manage orders and inventory
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Chat with customers
                  </div>
                </div>
                <Button className="w-full mt-4" size="lg">
                  Register as Supplier
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {t('alreadyHaveAccount')}{' '}
              <Link 
                to="/login" 
                className="text-primary hover:underline font-medium"
              >
                {t('signIn')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-card px-4 py-8">
      <Card className="w-full max-w-lg shadow-elegant">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            {selectedRole === 'customer' ? (
              <Users className="h-6 w-6 text-primary-foreground" />
            ) : (
              <Building2 className="h-6 w-6 text-primary-foreground" />
            )}
          </div>
          <CardTitle className="text-2xl">
            Register as {selectedRole === 'customer' ? 'Customer' : 'Supplier'}
          </CardTitle>
          <CardDescription>
            Fill in your details to create your account
          </CardDescription>
          <Button 
            variant="ghost" 
            onClick={() => setSelectedRole(null)}
            className="text-sm mt-2"
          >
            ← Change account type
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {selectedRole === 'customer' ? (
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  name="industry"
                  type="text"
                  required
                  value={formData.industry}
                  onChange={handleInputChange}
                  placeholder="Enter your industry"
                />
              </div>
            ) : (
              <>
                <div>
                  <Label htmlFor="business_name">Business Name</Label>
                  <Input
                    id="business_name"
                    name="business_name"
                    type="text"
                    required
                    value={formData.business_name}
                    onChange={handleInputChange}
                    placeholder="Enter your business name"
                  />
                </div>
                <div>
                  <Label htmlFor="business_type">Business Type</Label>
                  <Input
                    id="business_type"
                    name="business_type"
                    type="text"
                    required
                    value={formData.business_type}
                    onChange={handleInputChange}
                    placeholder="Enter your business type"
                  />
                </div>
                <div>
                  <Label htmlFor="document">Document</Label>
                  <Input
                    id="document"
                    name="document"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleInputChange}
                    className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload business registration or license document
                  </p>
                </div>
              </>
            )}

            <div>
              <Label htmlFor="phone_number">Contact Number</Label>
              <Input
                id="phone_number"
                name="phone_number"
                type="tel"
                required
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="+251-XXX-XXXXXX"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              size="lg"
            >
              {loading ? t('loading') : `Register as ${selectedRole === 'customer' ? 'Customer' : 'Supplier'}`}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t('alreadyHaveAccount')}{' '}
              <Link 
                to="/login" 
                className="text-primary hover:underline font-medium"
              >
                {t('signIn')}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;