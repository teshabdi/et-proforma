@@ .. @@
           <Button onClick={() => navigate('/products')}>
             Start Shopping
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
-                <Button variant="outline" className="w-full" disabled>
-                  {t('viewDetails')}
+                <Button 
+                  variant="outline" 
+                  className="w-full"
+                  onClick={() => navigate('/dashboard/products')}
+                >
+                  View in Dashboard
                 </Button>
               )}
             </CardContent>
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
+              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
             >
               {t('learnMore')}
             </Button>
           </div>
         </div>
       </section>

@@ .. @@
           <div className="flex justify-between items-center mb-12">
             <div>
               <h2 className="text-3xl md:text-4xl font-bold mb-4">
                 {t('featuredProducts')}
               </h2>
               <p className="text-lg text-muted-foreground">
                 {t('discoverQualityProducts')}
               </p>
             </div>
-            <Button variant="outline" asChild>
-              <Link to="/products">
-                {t('viewAllProducts')}
-                <ArrowRight className="ml-2 h-4 w-4" />
-              </Link>
-            </Button>
+            {user && (
+              <Button variant="outline" asChild>
+                <Link to="/dashboard/products">
+                  {t('viewAllProducts')}
+                  <ArrowRight className="ml-2 h-4 w-4" />
+                </Link>
+              </Button>
+            )}
           </div>
           {renderProductsSection()}
         </div>
       </section>