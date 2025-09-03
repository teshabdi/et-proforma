@@ .. @@
 import React, { useState } from 'react';
-import { useNavigate } from 'react-router-dom';
 import { useTranslation } from 'react-i18next';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Separator } from '@/components/ui/separator';
 import { CreditCard, ArrowRight, Shield } from 'lucide-react';
 import { useCart } from '@/contexts/CartContext';
 import { useAuth } from '@/contexts/AuthContext';
 import { useToast } from '@/hooks/use-toast';
+import { useNavigate } from 'react-router-dom';
 import api from '@/lib/api';

 const Checkout: React.FC = () => {
   const { t } = useTranslation();
   const { user } = useAuth();
   const { items, getTotal, clearCart } = useCart();
   const { toast } = useToast();
   const navigate = useNavigate();
   const [loading, setLoading] = useState(false);
   const [shippingInfo, setShippingInfo] = useState({
     fullName: user?.name || '',
     email: user?.email || '',
     phone: '',
     address: '',
     city: '',
     region: '',
     shippingCost: 0,
   });
 }

@@ .. @@
   if (items.length === 0) {
     return (
     )
   }
-      <div className="container mx-auto px-4 py-8">
-        <div className="text-center">
+      <div className="space-y-6">
+        <h1 className="text-2xl font-bold">Checkout</h1>
+        <Card className="shadow-card">
+          <CardContent className="p-12 text-center">
-          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
-          <Button onClick={() => navigate('/products')}>
+            <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
+            <p className="text-muted-foreground mb-6">
+              Add some products to your cart before checkout
+            </p>
+            <Button onClick={() => navigate('/dashboard/products')}>
             Continue Shopping
           </Button>
-        </div>
+          </CardContent>
+        </Card>
       </div>
     );
   }

   return (
-    <div className="container mx-auto px-4 py-8">
-      <div className="mb-8">
+    <div className="space-y-6">
+      <div>
         <h1 className="text-3xl font-bold mb-2">Checkout</h1>
         <p className="text-muted-foreground">Complete your order</p>
       </div>

       <form onSubmit={handleCheckout}>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
             <Card className="shadow-card">
               <CardHeader>
                 <CardTitle>Shipping Information</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
@@ .. @@
                 </div>
               </CardContent>
             </Card>
           </div>
         </div>
       </form>
     </div>
   );
 };

 export default Checkout;