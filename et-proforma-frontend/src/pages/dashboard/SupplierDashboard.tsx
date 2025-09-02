import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Package, 
  FileText, 
  DollarSign, 
  TrendingUp,
  Eye,
  Edit,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

interface Product {
  id: number;
  name: string;
  price: number;
  status?: string;
  created_at: string;
  description?: string;
  stock?: number;
  category?: string;
  image?: string;
}

interface RFQ {
  id: number;
  title: string;
  status: string;
  created_at: string;
  budget: number;
}

interface Order {
  id: number;
  status: string;
  total: number;
  created_at: string;
}

const SupplierDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [rfqs, setRFQs] = useState<RFQ[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [responseForm, setResponseForm] = useState<{ rfqId: number | null; price: string; quantity: string; message: string }>({
    rfqId: null,
    price: '',
    quantity: '',
    message: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsResponse, rfqsResponse, ordersResponse] = await Promise.all([
        api.get('/supplier/products'),
        api.get('/supplier/rfqs'),
        api.get('/supplier/orders')
      ]);
      
      setProducts(productsResponse.data.data || []);
      setRFQs(rfqsResponse.data.data || []);
      setOrders(ordersResponse.data.data || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const response = await api.put(`/products/${editingProduct.id}`, editingProduct);
      setProducts(products.map(p => p.id === editingProduct.id ? response.data : p));
      setEditingProduct(null);
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await api.delete(`/products/${productId}`);
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleRFQResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseForm.rfqId) return;

    try {
      const response = await api.post(`/rfqs/${responseForm.rfqId}/responses`, {
        price: parseFloat(responseForm.price),
        quantity: parseInt(responseForm.quantity),
        message: responseForm.message
      });
      setResponseForm({ rfqId: null, price: '', quantity: '', message: '' });
      fetchDashboardData(); // Refresh RFQs
    } catch (error) {
      console.error('Failed to submit RFQ response:', error);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'open':
        return 'warning';
      case 'active':
      case 'completed':
      case 'delivered':
        return 'default';
      case 'inactive':
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'open':
        return <Clock className="h-4 w-4" />;
      case 'active':
      case 'completed':
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'inactive':
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const totalRevenue = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.total, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-primary rounded-lg p-6 text-primary-foreground">
        <h1 className="text-2xl font-bold mb-2">
          {t('welcome')}, {user?.name}!
        </h1>
        <p className="opacity-90">
          Manage your products, respond to RFQs, and grow your business
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open RFQs</p>
                <p className="text-2xl font-bold">{rfqs.filter(r => r.status === 'open').length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">ETB {totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Orders</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status !== 'delivered').length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Products */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              My Products
            </CardTitle>
            <Button size="sm" onClick={() => window.location.href = '/dashboard/add-product'}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No products yet</p>
                <p className="text-sm">Add your first product to start selling</p>
              </div>
            ) : (
              <div className="space-y-4">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(product.status)}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ETB {product.price} | Stock: {product.stock}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusColor(product.status) as any}>
                        {product.status || 'Active'}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {editingProduct && (
              <div className="mt-6 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Edit Product</h3>
                <form onSubmit={handleUpdateProduct} className="space-y-4">
                  <Input
                    placeholder="Product Name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  />
                  <Textarea
                    placeholder="Description"
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                  />
                  <Input
                    type="number"
                    placeholder="Stock"
                    value={editingProduct.stock || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                  />
                  <Input
                    placeholder="Category"
                    value={editingProduct.category || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  />
                  <div className="flex space-x-2">
                    <Button type="submit">Save</Button>
                    <Button variant="outline" onClick={() => setEditingProduct(null)}>Cancel</Button>
                  </div>
                </form>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available RFQs */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Available RFQs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rfqs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No RFQs available</p>
                <p className="text-sm">Check back later for new opportunities</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rfqs.filter(rfq => rfq.status === 'open').slice(0, 5).map((rfq) => (
                  <div key={rfq.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{rfq.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Budget: ETB {rfq.budget}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="default">Open</Badge>
                        <Button variant="ghost" size="sm" onClick={() => setResponseForm({ ...responseForm, rfqId: rfq.id })}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {responseForm.rfqId === rfq.id && (
                      <form onSubmit={handleRFQResponse} className="mt-4 space-y-4">
                        <Input
                          type="number"
                          placeholder="Your Price"
                          value={responseForm.price}
                          onChange={(e) => setResponseForm({ ...responseForm, price: e.target.value })}
                        />
                        <Input
                          type="number"
                          placeholder="Quantity"
                          value={responseForm.quantity}
                          onChange={(e) => setResponseForm({ ...responseForm, quantity: e.target.value })}
                        />
                        <Textarea
                          placeholder="Message"
                          value={responseForm.message}
                          onChange={(e) => setResponseForm({ ...responseForm, message: e.target.value })}
                        />
                        <div className="flex space-x-2">
                          <Button type="submit">Submit Response</Button>
                          <Button variant="outline" onClick={() => setResponseForm({ rfqId: null, price: '', quantity: '', message: '' })}>
                            Cancel
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col" onClick={() => window.location.href = '/dashboard/add-product'}>
              <Plus className="h-6 w-6 mb-2" />
              Add Product
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => window.location.href = '/dashboard/rfqs'}>
              <FileText className="h-6 w-6 mb-2" />
              RFQs
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => window.location.href = '/dashboard/messages'}>
              <Package className="h-6 w-6 mb-2" />
              Messages
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => window.location.href = '/dashboard/notifications'}>
              <TrendingUp className="h-6 w-6 mb-2" />
              Notifications
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierDashboard;