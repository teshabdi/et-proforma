@@ .. @@
               <Link to="/products" className="text-foreground hover:text-primary transition-colors">
                 {t('products')}
               </Link>
               <Link to="/about" className="text-foreground hover:text-primary transition-colors">
                 {t('about')}
               </Link>
               <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
                 {t('contact')}
               </Link>
             </nav>

             {/* Right Section */}
             <div className="flex items-center space-x-4">
               {/* Language Switcher */}
               <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                   <Button variant="ghost" size="sm">
                     <Globe className="h-4 w-4 mr-2" />
                     {i18n.language === 'am' ? 'አማ' : 'EN'}
                   </Button>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent align="end">
                   <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
                     English
                   </DropdownMenuItem>
                   <DropdownMenuItem onClick={() => handleLanguageChange('am')}>
                     አማርኛ
                   </DropdownMenuItem>
                 </DropdownMenuContent>
               </DropdownMenu>

-              {/* Cart */}
-              {user && (
-                <Button 
-                  variant="ghost" 
-                  size="sm" 
-                  className="relative"
-                  onClick={() => navigate('/cart')}
-                >
-                  <ShoppingCart className="h-4 w-4" />
-                  {cartItemsCount > 0 && (
-                    <Badge 
-                      variant="destructive" 
-                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs"
-                    >
-                      {cartItemsCount}
-                    </Badge>
-                  )}
-                </Button>
-              )}
-
               {/* User Menu */}
               {user ? (
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="sm">
                       <User className="h-4 w-4 mr-2" />
                       {user.name}
                     </Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="end">
                     <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                       <LayoutDashboard className="h-4 w-4 mr-2" />
                       {t('dashboard')}
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={handleLogout}>
                       <LogOut className="h-4 w-4 mr-2" />
                       {t('logout')}
                     </DropdownMenuItem>
                   </DropdownMenuContent>
                 </DropdownMenu>
               ) : (
                 <div className="flex items-center space-x-2">
                   <Button 
                     variant="ghost" 
                     size="sm"
                     onClick={() => navigate('/login')}
                   >
                     {t('login')}
                   </Button>
                   <Button 
                     variant="default" 
                     size="sm"
                     onClick={() => navigate('/register')}
                   >
                     {t('register')}
                   </Button>
                 </div>
               )}

               {/* Mobile Menu Button */}
               <Button
                 variant="ghost"
                 size="sm"
                 className="md:hidden"
                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               >
                 {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
               </Button>
             </div>
           </div>

           {/* Mobile Menu */}
           {isMobileMenuOpen && (
             <div className="md:hidden border-t py-4">
               <nav className="flex flex-col space-y-4">
                 <Link 
                   to="/" 
                   className="text-foreground hover:text-primary transition-colors"
                   onClick={() => setIsMobileMenuOpen(false)}
                 >
                   {t('home')}
                 </Link>
-                <Link 
-                  to="/products" 
-                  className="text-foreground hover:text-primary transition-colors"
-                  onClick={() => setIsMobileMenuOpen(false)}
-                >
-                  {t('products')}
-                </Link>
                 <Link 
                   to="/about" 
                   className="text-foreground hover:text-primary transition-colors"
                   onClick={() => setIsMobileMenuOpen(false)}
                 >
                   {t('about')}
                 </Link>
                 <Link 
                   to="/contact" 
                   className="text-foreground hover:text-primary transition-colors"
                   onClick={() => setIsMobileMenuOpen(false)}
                 >
                   {t('contact')}
                 </Link>
               </nav>
             </div>
           )}
         </div>
       </header>
     );
   };

   export default Header;