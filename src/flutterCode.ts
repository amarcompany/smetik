export interface FlutterFile {
  name: string;
  path: string;
  language: string;
  content: string;
}

export const FLUTTER_CODE_FILES: FlutterFile[] = [
  {
    name: 'pubspec.yaml',
    path: 'pubspec.yaml',
    language: 'yaml',
    content: `name: smetik_app
description: A Smetik Beauty & Personal Care Marketplace Flutter Frontend.
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.5
  google_fonts: ^6.1.0
  url_launcher: ^6.2.1
  provider: ^6.0.5
  shimmer: ^3.0.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.1

flutter:
  uses-material-design: true
  assets:
    - assets/banners/
    - assets/products/
`
  },
  {
    name: 'main.dart',
    path: 'lib/main.dart',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'providers/app_state.dart';
import 'screens/main_navigation.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => AppState(),
      child: const SmetikApp(),
    ),
  );
}

class SmetikApp extends StatelessWidget {
  const SmetikApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Smetik',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        scaffoldBackgroundColor: Colors.white,
        primaryColor: const Color(0xff845EC2),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xff845EC2),
          primary: const Color(0xff845EC2),
          secondary: const Color(0xff8963C8),
          tertiary: const Color(0xff7C57BA),
          surface: Colors.white,
        ),
        textTheme: GoogleFonts.outfitTextTheme(
          Theme.of(context).textTheme,
        ).copyWith(
          // For Smetik brand word mark we use Playwrite GB J style
          displayLarge: GoogleFonts.playwriteGbj(
            fontWeight: FontWeight.w400,
            color: const Color(0xff845EC2),
          ),
        ),
      ),
      home: const MainNavigation(),
    );
  }
}
`
  },
  {
    name: 'product.dart',
    path: 'lib/models/product.dart',
    language: 'dart',
    content: `class Product {
  final String id;
  final String name;
  final String brand;
  final String category;
  final double price;
  final double rating;
  final String description;
  final String ingredients;
  final String usage;
  final List<String> images;
  final int stock;
  final bool featured;
  final bool newArrival;
  final bool bestSeller;

  Product({
    required this.id,
    required this.name,
    required this.brand,
    required this.category,
    required this.price,
    required this.rating,
    required this.description,
    required this.ingredients,
    required this.usage,
    required this.images,
    required this.stock,
    this.featured = false,
    this.newArrival = false,
    this.bestSeller = false,
  });

  Product copyWith({
    String? name,
    String? brand,
    String? category,
    double? price,
    String? description,
    String? ingredients,
    String? usage,
    List<String>? images,
    int? stock,
  }) {
    return Product(
      id: id,
      name: name ?? this.name,
      brand: brand ?? this.brand,
      category: category ?? this.category,
      price: price ?? this.price,
      rating: rating,
      description: description ?? this.description,
      ingredients: ingredients ?? this.ingredients,
      usage: usage ?? this.usage,
      images: images ?? this.images,
      stock: stock ?? this.stock,
      featured: featured,
      newArrival: newArrival,
      bestSeller: bestSeller,
    );
  }
}
`
  },
  {
    name: 'app_state.dart',
    path: 'lib/providers/app_state.dart',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
import '../models/product.dart';

class AppState extends ChangeNotifier {
  final List<String> _wishlist = [];
  final Map<String, int> _cart = {}; // Product ID -> Quantity
  List<Product> _products = [];

  AppState() {
    _initMockProducts();
  }

  List<Product> get products => _products;
  List<String> get wishlist => _wishlist;
  Map<String, int> get cart => _cart;

  void toggleWishlist(String productId) {
    if (_wishlist.contains(productId)) {
      _wishlist.remove(productId);
    } else {
      _wishlist.add(productId);
    }
    notifyListeners();
  }

  bool isWishlisted(String productId) {
    return _wishlist.contains(productId);
  }

  void addToCart(String productId) {
    _cart[productId] = (_cart[productId] ?? 0) + 1;
    notifyListeners();
  }

  void removeOneFromCart(String productId) {
    if (!_cart.containsKey(productId)) return;
    if (_cart[productId] == 1) {
      _cart.remove(productId);
    } else {
      _cart[productId] = _cart[productId]! - 1;
    }
    notifyListeners();
  }

  void removeFromCartCompletely(String productId) {
    _cart.remove(productId);
    notifyListeners();
  }

  void clearCart() {
    _cart.clear();
    notifyListeners();
  }

  double getCartTotal() {
    double total = 0;
    _cart.forEach((id, qty) {
      final prod = _products.firstWhere((p) => p.id == id);
      total += prod.price * qty;
    });
    return total;
  }

  // Admin Management APIs
  void addProduct(Product product) {
    _products.add(product);
    notifyListeners();
  }

  void updateProduct(Product product) {
    final idx = _products.indexWhere((p) => p.id == product.id);
    if (idx != -1) {
      _products[idx] = product;
      notifyListeners();
    }
  }

  void deleteProduct(String id) {
    _products.removeWhere((p) => p.id == id);
    _wishlist.remove(id);
    _cart.remove(id);
    notifyListeners();
  }

  void _initMockProducts() {
    _products = [
      Product(
        id: 'prod1',
        name: 'Retinol Glow Infusion Serum',
        brand: 'Smetik Organics',
        category: 'Skincare',
        price: 45000,
        rating: 4.8,
        description: 'A lightweight serum designed to refine skin texture...',
        ingredients: 'Deionized Water, Pure Retinol (0.5%), Organic Aloe...',
        usage: 'Apply 3-4 drops to clean, dry facial skin in the evening...',
        images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'],
        stock: 24,
        featured: true,
        bestSeller: true,
      ),
      Product(
        id: 'prod2',
        name: 'Satin Velvet Hydrating Lipstick',
        brand: 'Smetik Beauty',
        category: 'Makeup',
        price: 28000,
        rating: 4.6,
        description: 'An ultra-creamy lipstick that delivers rich color...',
        ingredients: 'Shea Butter, Candelilla Wax, Carnauba Wax...',
        usage: 'Glide directly onto lips from the bullet...',
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600'],
        stock: 18,
        featured: true,
        newArrival: true,
      ),
    ];
  }
}
`
  },
  {
    name: 'main_navigation.dart',
    path: 'lib/screens/main_navigation.dart',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
import 'explore_screen.dart';
import 'categories_screen.dart';
import 'cart_screen.dart';
import 'wishlist_screen.dart';
import 'profile_screen.dart';

class MainNavigation extends StatefulWidget {
  const MainNavigation({super.key});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    ExploreScreen(),
    CategoriesScreen(),
    CartScreen(),
    WishlistScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        type: BottomNavigationBarType.fixed,
        backgroundColor: Colors.white,
        selectedItemColor: const Color(0xff845EC2),
        unselectedItemColor: Colors.grey.shade400,
        showUnselectedLabels: true,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.search_outlined), label: 'Explore'),
          BottomNavigationBarItem(icon: Icon(Icons.grid_view_outlined), label: 'Categories'),
          BottomNavigationBarItem(icon: Icon(Icons.shopping_cart_outlined), label: 'Cart'),
          BottomNavigationBarItem(icon: Icon(Icons.favorite_outline), label: 'Wishlist'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Profile'),
        ],
      ),
    );
  }
}
`
  },
  {
    name: 'explore_screen.dart',
    path: 'lib/screens/explore_screen.dart',
    language: 'dart',
    content: `import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:shimmer/shimmer.dart';
import '../providers/app_state.dart';
import '../widgets/product_card.dart';

class ExploreScreen extends StatefulWidget {
  const ExploreScreen({super.key});

  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  final PageController _pageController = PageController();
  int _bannerIndex = 0;
  Timer? _timer;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _startBannerTimer();
    // Simulate initial skeleton shimmer load
    Future.delayed(const Duration(milliseconds: 1200), () {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    });
  }

  void _startBannerTimer() {
    _timer = Timer.periodic(const Duration(seconds: 5), (timer) {
      if (_pageController.hasClients) {
        final newIndex = (_bannerIndex + 1) % 3;
        _pageController.animateToPage(
          newIndex,
          duration: const Duration(milliseconds: 500),
          curve: Curves.easeInOut,
        );
        setState(() {
          _bannerIndex = newIndex;
        });
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);
    
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Text(
          'Smetik',
          style: GoogleFonts.playwriteGbj(
            fontSize: 22,
            fontWeight: FontWeight.w400,
            color: const Color(0xff845EC2),
          ),
        ),
      ),
      body: _isLoading ? _buildSkeleton() : SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Search Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: TextField(
                decoration: InputDecoration(
                  hintText: 'Search skincare, makeup...',
                  prefixIcon: const Icon(Icons.search),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                  filled: true,
                  fillColor: const Color(0xffFAF9FF),
                ),
              ),
            ),
            const SizedBox(height: 16),
            
            // Auto Sliding Banner
            SizedBox(
              height: 180,
              child: PageView(
                controller: _pageController,
                onPageChanged: (idx) {
                  setState(() {
                    _bannerIndex = idx;
                  });
                },
                children: [
                  _buildBannerItem('Glow Serum Collection', 'Organic Glow', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800'),
                  _buildBannerItem('Velvet Lipsticks', 'Lasting Finish', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800'),
                  _buildBannerItem('Botanical Therapy', 'Strong Locks', 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800'),
                ],
              ),
            ),
            
            // Categories & Horizontal Lists ...
          ],
        ),
      ),
    );
  }

  Widget _buildBannerItem(String title, String subtitle, String url) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        image: DecorationImage(image: NetworkImage(url), fit: BoxFit.cover),
      ),
    );
  }

  Widget _buildSkeleton() {
    return Shimmer.fromColors(
      baseColor: Colors.grey.shade200,
      highlightColor: Colors.grey.shade100,
      child: Container(/* Shimmer elements matching outline */),
    );
  }
}
`
  }
];
