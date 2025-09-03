import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Truck,
  DollarSign,
  User,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  line_total: number;
  product: {
    id: number;
    name: string;
    image_url?: string;
  };
}

interface Order {
  id: number;
  customer_id: number;
  supplier_id: number;
  subtotal: number;
  tax?: number;
  shipping_cost?: number;
  total: number;
  status: string;
  created_at: string;
  shipping_info?: any;
  items: OrderItem[];
  customer?: {
    user: {
      name: string;
      email: string;
    };
  };
  supplier?: {
    user: {
      name: string;
      email: string;
    };
  };
}

const Orders: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'default';
      case 'paid':
        return 'default';
      case 'shipped':
        return 'default';
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getAvailableStatuses = (currentStatus: string, userRole: string) => {
    if (userRole === 'supplier') {
      switch (currentStatus.toLowerCase()) {
        case 'pending':
          return ['approved', 'cancelled'];
        case 'approved':
        case 'paid':
          return ['shipped'];
        case 'shipped':
          return ['delivered'];
        default:
          return [];
      }
    } else {
      // Customer can only cancel pending orders
      return currentStatus.toLowerCase() === 'pending' ? ['cancelled'] : [];
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            Total: {orders.length} orders
          </Badge>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No orders yet</h3>
            <p className="text-muted-foreground">
              {user?.role === 'supplier' 
                ? "Orders from customers will appear here" 
                : "Your orders will appear here once you make a purchase"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="shadow-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      <Package className="h-5 w-5 mr-2" />
                      Order #{order.id}
                    </CardTitle>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        ETB {order.total}
                      </div>
                      {user?.role === 'supplier' && order.customer && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {order.customer.user.name}
                        </div>
                      )}
                      {user?.role === 'customer' && order.supplier && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {order.supplier.user.name}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(order.status) as any} className="flex items-center">
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </Badge>
                    {getAvailableStatuses(order.status, user?.role || '').length > 0 && (
                      <Select
                        value={order.status}
                        onValueChange={(newStatus) => handleStatusUpdate(order.id, newStatus)}
                        disabled={updatingStatus === order.id}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={order.status} disabled>
                            {order.status}
                          </SelectItem>
                          {getAvailableStatuses(order.status, user?.role || '').map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium mb-2">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-background rounded flex items-center justify-center">
                              {item.product.image_url ? (
                                <img 
                                  src={item.product.image_url} 
                                  alt={item.product.name}
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                <Package className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity} × ETB {item.unit_price}
                              </p>
                            </div>
                          </div>
                          <span className="font-medium">
                            ETB {item.line_total}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>ETB {order.subtotal}</span>
                      </div>
                      {order.tax && (
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span>ETB {order.tax}</span>
                        </div>
                      )}
                      {order.shipping_cost && (
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>ETB {order.shipping_cost}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total</span>
                        <span>ETB {order.total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  {order.shipping_info && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Shipping Information</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{order.shipping_info.fullName}</p>
                        <p>{order.shipping_info.email}</p>
                        <p>{order.shipping_info.phone}</p>
                        <p>{order.shipping_info.address}</p>
                        <p>{order.shipping_info.city}, {order.shipping_info.region}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;