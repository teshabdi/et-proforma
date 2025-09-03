@@ .. @@
 import React, { useState } from 'react';
-import { useNavigate } from 'react-router-dom';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Textarea } from '@/components/ui/textarea';
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
-import { ArrowLeft, Package, Image as ImageIcon } from 'lucide-react';
+import { Package, Image as ImageIcon } from 'lucide-react';
 import { useToast } from '@/hooks/use-toast';
 import { useAuth } from '@/contexts/AuthContext';
+import { useNavigate } from 'react-router-dom';
 import api from '@/lib/api';

 interface ProductData {
   name: string;
   description: string;
   price: string;
   stock: string;
-  category: string; // Added category field
+  category: string;
   image: File | null;
 }

 const AddProduct: React.FC = () => {
   const navigate = useNavigate();
   const { toast } = useToast();
   const { user } = useAuth();
   const [loading, setLoading] = useState(false);
   const [preview, setPreview] = useState<string | null>(null);

-  // Sample categories (you might fetch these from the backend)
-  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Toys']; // Adjust as needed
+  const categories = [
+    'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Toys',
+    'Food & Beverages', 'Health & Beauty', 'Sports & Outdoors',
+    'Automotive', 'Industrial', 'Office Supplies', 'Construction'
+  ];

   const [formData, setFormData] = useState<ProductData>({
     name: '',
     description: '',
     price: '',
     stock: '',
-    category: '', // Initialize category
+    category: '',
     image: null,
   });

   if (user?.role !== 'supplier') {
     return (
-      <div className="container mx-auto px-4 py-8 text-center">
+      <div className="text-center py-12">
         <h2 className="text-2xl font-bold mb-4">Unauthorized</h2>
         <p className="text-muted-foreground">
           Only suppliers can add products.
         </p>
         <Button onClick={() => navigate('/dashboard')} className="mt-4">
           Go Back
         </Button>
       </div>
     );
   }

@@ .. @@
       productFormData.append('description', formData.description);
       productFormData.append('price', formData.price);
       productFormData.append('stock', formData.stock);
-      productFormData.append('category', formData.category); // Add category to FormData
+      productFormData.append('category', formData.category);

       if (formData.image) {
         productFormData.append('image', formData.image);
       }

       await api.post('/products', productFormData, {
         headers: { 'Content-Type': 'multipart/form-data' },
       });

       toast({
         title: 'Success',
         description: 'Product added successfully',
       });

       navigate('/dashboard');
     } catch (error: any) {
       const errors = error.response?.data?.errors;
       if (errors) {
         Object.values(errors).forEach((msg: any) => {
           toast({
             title: 'Validation Error',
-            description: msg[0] as string, // Laravel returns errors as arrays
+            description: msg[0] as string,
             variant: 'destructive',
           });
         });
       } else {
         toast({
           title: 'Error',
           description: error.response?.data?.message || 'Failed to add product',
           variant: 'destructive',
         });
       }
     } finally {
       setLoading(false);
     }
   };

   return (
-    <div className="container mx-auto px-4 py-8 max-w-2xl">
-      <div className="mb-6">
-        <Button
-          variant="ghost"
-          onClick={() => navigate('/dashboard')}
-          className="mb-4"
-        >
-          <ArrowLeft className="h-4 w-4 mr-2" />
-          Back to Dashboard
-        </Button>
+    <div className="max-w-2xl mx-auto space-y-6">
+      <div>
         <h1 className="text-3xl font-bold">Add New Product</h1>
         <p className="text-muted-foreground">Create a new product listing</p>
       </div>

       <Card>
         <CardHeader>
           <CardTitle className="flex items-center">
             <Package className="h-5 w-5 mr-2" />
             Product Details
           </CardTitle>
         </CardHeader>
         <CardContent>
           <form onSubmit={handleSubmit} className="space-y-6">
@@ .. @@
             <div className="flex gap-4">
               <Button
                 type="button"
                 variant="outline"
                 onClick={() => navigate('/dashboard')}
                 className="flex-1"
               >
                 Cancel
               </Button>
               <Button
                 type="submit"
                 disabled={loading}
                 className="flex-1"
               >
                 {loading ? 'Adding Product...' : 'Add Product'}
               </Button>
             </div>
           </form>
         </CardContent>
       </Card>
     </div>
   );
 };

 export default AddProduct;