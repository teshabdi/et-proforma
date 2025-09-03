@@ .. @@
 import { BrowserRouter, Routes, Route } from "react-router-dom";
 import { AuthProvider } from "@/contexts/AuthContext";
 import { CartProvider } from "@/contexts/CartContext";
-import Header from "@/components/layout/Header";
-import Footer from "@/components/layout/Footer";
+import DashboardLayout from "@/components/layout/DashboardLayout";
 import Landing from "./pages/Landing";
 import Login from "./pages/auth/Login";
 import Register from "./pages/auth/Register";
-import CustomerDashboard from "./pages/dashboard/CustomerDashboard";
-import SupplierDashboard from "./pages/dashboard/SupplierDashboard";
-import Cart from "./pages/Cart";
-import Products from "./pages/Products";
+import CustomerDashboard from "./pages/dashboard/CustomerDashboard"; 
+import SupplierDashboard from "./pages/dashboard/SupplierDashboard";
+import Products from "./pages/dashboard/Products";
+import DashboardCart from "./pages/dashboard/DashboardCart";
+import Orders from "./pages/dashboard/Orders";
 import About from "./pages/About";
 import Contact from "./pages/Contact";
 import NotFound from "./pages/NotFound";
 import AddProduct from "./pages/dashboard/AddProduct";
 import RFQs from "./pages/dashboard/RFQs";
 import Messages from "./pages/dashboard/Messages";
 import Notifications from "./pages/dashboard/Notifications";
 import Checkout from "./pages/dashboard/Checkout";
+import Header from "@/components/layout/Header";
+import Footer from "@/components/layout/Footer";
 import { useAuth } from "@/contexts/AuthContext";

 const queryClient = new QueryClient();

 const DashboardRouter = () => {
   const { user } = useAuth();
   
   if (!user) return <NotFound />;
   
   return user.role === 'customer' ? <CustomerDashboard /> : <SupplierDashboard />;
 };

 const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
   <div className="min-h-screen flex flex-col">
     <Header />
     <main className="flex-1">
       {children}
     </main>
     <Footer />
   </div>
 );

 const App = () => (
   <QueryClientProvider client={queryClient}>
     <TooltipProvider>
       <AuthProvider>
         <CartProvider>
           <Toaster />
           <Sonner />
           <BrowserRouter>
             <Routes>
               <Route path="/" element={
                 <AppLayout>
                   <Landing />
                 </AppLayout>
               } />
               <Route path="/login" element={
                 <AppLayout>
                   <Login />
                 </AppLayout>
               } />
               <Route path="/register" element={
                 <AppLayout>
                   <Register />
                 </AppLayout>
               } />
-              <Route path="/cart" element={
-                <AppLayout>
-                  <Cart />
-                </AppLayout>
-              } />
-              <Route path="/products" element={
-                <AppLayout>
-                  <Products />
-                </AppLayout>
-              } />
               <Route path="/about" element={
                 <AppLayout>
                   <About />
                 </AppLayout>
               } />
               <Route path="/contact" element={
                 <AppLayout>
                   <Contact />
                 </AppLayout>
               } />
-              <Route path="/dashboard" element={
-                <AppLayout>
-                  <div className="container mx-auto px-4 py-8">
-                    <DashboardRouter />
-                  </div>
-                </AppLayout>
-              } />
-              <Route path="/dashboard/add-product" element={
-                <AppLayout>
-                  <AddProduct />
-                </AppLayout>
-              } />
-              <Route path="/dashboard/rfqs" element={
-                <AppLayout>
-                  <div className="container mx-auto px-4 py-8">
-                    <RFQs />
-                  </div>
-                </AppLayout>
-              } />
-              <Route path="/dashboard/messages" element={
-                <AppLayout>
-                  <div className="container mx-auto px-4 py-8">
-                    <Messages />
-                  </div>
-                </AppLayout>
-              } />
-              <Route path="/dashboard/notifications" element={
-                <AppLayout>
-                  <div className="container mx-auto px-4 py-8">
-                    <Notifications />
-                  </div>
-                </AppLayout>
-              } />
-              <Route path="/checkout" element={
-                <AppLayout>
-                  <Checkout />
-                </AppLayout>
-              } />
+              
+              {/* Dashboard Routes with Sidebar Layout */}
+              <Route path="/dashboard" element={<DashboardLayout />}>
+                <Route index element={<DashboardRouter />} />
+                <Route path="products" element={<Products />} />
+                <Route path="add-product" element={<AddProduct />} />
+                <Route path="cart" element={<DashboardCart />} />
+                <Route path="orders" element={<Orders />} />
+                <Route path="rfqs" element={<RFQs />} />
+                <Route path="messages" element={<Messages />} />
+                <Route path="notifications" element={<Notifications />} />
+                <Route path="checkout" element={<Checkout />} />
+              </Route>
+              
               {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
               <Route path="*" element={<NotFound />} />
             </Routes>
           </BrowserRouter>
         </CartProvider>
       </AuthProvider>
     </TooltipProvider>
   </QueryClientProvider>
 );

 export default App;