import 'package:flutter/material.dart';
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
      final prod = _products.firstWhere((p) => p.id == id, orElse: () => Product(
        id: id,
        name: 'Unknown Product',
        brand: 'Generic',
        category: 'Personal Care',
        price: 0,
        rating: 4.0,
        description: '',
        ingredients: '',
        usage: '',
        images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300'],
        stock: 0,
      ));
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
        description: 'A lightweight serum designed to refine skin texture, booster elasticity, and visibly reduce the appearance of fine lines and uneven skin tones.',
        ingredients: 'Deionized Water, Pure Retinol (0.5%), Organic Aloe Vera Leaf Extract, Hyaluronic Acid, Organic Jojoba Oil, Vitamin E, Vegetable Glycerin.',
        usage: 'Apply 3-4 drops to clean, dry facial skin in the evening. Gently massage in upward circular motions. Follow with a nourishing moisturizer and always apply SPF during daytime.',
        images: [
          'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=600'
        ],
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
        description: 'An ultra-creamy lipstick that delivers rich, high-pigment color with a luxurious satin-velve finish. Formulated with hydrating butter blends to prevent drying.',
        ingredients: 'Caprylic/Capric Triglyceride, Shea Butter, Candelilla Wax, Carnauba Wax, Organic Castor Seed Oil, Vitamin E Oil, Natural Iron Oxide Pigments.',
        usage: 'Glide directly onto lips from the bullet, starting from the center of your cupid\'s bow and blending outwards. Layer for increased color intensity.',
        images: [
          'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600'
        ],
        stock: 18,
        featured: true,
        newArrival: true,
      ),
      Product(
        id: 'prod3',
        name: 'Keratin Argan Nourishing Hair Mask',
        brand: 'Smetik Botanicals',
        category: 'Hair Care',
        price: 55000,
        rating: 4.9,
        description: 'Deep conditioning treatment designed to rebuild weak, damaged, or color-treated hair. Rich in organic Argan Oil and Hydrolyzed Keratin protein.',
        ingredients: 'Hydrolyzed Keratin, Organic Moroccan Argan Oil, Shea Butter, Sweet Almond Oil, Pro-Vitamin B5, Cetearyl Alcohol, Rosemary Essential Oil.',
        usage: 'After shampooing, apply a generous amount from mid-lengths to ends. Leave on for 10-15 minutes, then rinse thoroughly with cool water. Use weekly.',
        images: [
          'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1527799863830-4735b7a7f64d?auto=format&fit=crop&q=80&w=600'
        ],
        stock: 15,
        newArrival: true,
        bestSeller: true,
      ),
      Product(
        id: 'prod4',
        name: 'Ambre Nuit Eau de Parfum',
        brand: 'Smetik Fragrance',
        category: 'Fragrances',
        price: 110000,
        rating: 4.7,
        description: 'A sensual blend of dark amber, delicate Turkish rose, and spiced bergamot. A sophisticated, long-lasting signature scent suitable for evening wear.',
        ingredients: 'Organic Sugarcane Alcohol, Essential Oil Scent Blend, Distilled Water, Bergamot Extract, Turkish Rose Oil, Warm Amber Resin, Patchouli.',
        usage: 'Spritz on pulse points including wrists, neck, and behind the knees. Avoid rubbing wrists together, as this breaks down the top scent notes prematurely.',
        images: [
          'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600'
        ],
        stock: 8,
        featured: true,
        bestSeller: true,
      ),
      Product(
        id: 'prod5',
        name: 'Centella Soothing Body Lotion',
        brand: 'Smetik Organics',
        category: 'Body Care',
        price: 38000,
        rating: 4.5,
        description: 'A fast-absorbing, barrier-supporting body lotion enriched with Centella Asiatica and Niacinamide. Calms irritation and locks in 24-hour hydration.',
        ingredients: 'Centella Asiatica Leaf Extract, Niacinamide (3%), Cocoa Seed Butter, Hyaluronic Acid, Squalane, Green Tea Leaf Extract, Chamomile Flower Essence.',
        usage: 'Smooth generously over dry, clean skin after bathing. Focus on dry areas like elbows, knees, and ankles. Massage until completely absorbed.',
        images: [
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=600'
        ],
        stock: 30,
        newArrival: true,
      ),
      Product(
        id: 'prod6',
        name: 'Gentle Amino Acid Facial Cleanser',
        brand: 'Smetik Organics',
        category: 'Skincare',
        price: 32000,
        rating: 4.7,
        description: 'A non-stripping, low-pH gel cleanser that gently lifts impurities and makeup without disrupting the skin\'s natural moisture barrier.',
        ingredients: 'Sodium Cocoyl Glycinate (Amino Surfactant), Licorice Root Extract, Rosewater, Glycerin, Panthenol, Cucumber Fruit Extract.',
        usage: 'Wet face with lukewarm water. Squeeze a dime-sized amount onto damp palms and lather. Massage gently onto your face in circular motions, then rinse thoroughly.',
        images: [
          'https://images.unsplash.com/photo-1556229174-5e42a09e45af?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=600'
        ],
        stock: 45,
        bestSeller: true,
      ),
      Product(
        id: 'prod7',
        name: 'HD Flawless Setting Powder',
        brand: 'Smetik Beauty',
        category: 'Makeup',
        price: 35000,
        rating: 4.4,
        description: 'Micro-milled translucent setting powder that blurs large pores, controls shine, and locks makeup down with a soft-focus finish.',
        ingredients: 'Silica, Corn Starch, Zinc Stearate, Squalane, Organic Evening Primrose Extract, Tocopheryl Acetate.',
        usage: 'Press a powder puff or brush into the powder, tap off excess, and lightly press onto skin where oil-control or setting is needed.',
        images: [
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1503236111867-0c7fbe374825?auto=format&fit=crop&q=80&w=600'
        ],
        stock: 22,
        newArrival: true,
      ),
      Product(
        id: 'prod8',
        name: 'Vitamin C Brightening Body Scrub',
        brand: 'Smetik Organics',
        category: 'Body Care',
        price: 42000,
        rating: 4.6,
        description: 'An exfoliating sugar scrub with Kakadu plum extract and natural citrus oils to brighten dark spots and buff away dry skin cells.',
        ingredients: 'Fine Cane Sugar, Shea Butter, Kakadu Plum (Vitamin C) Extract, Orange Essential Oil, Grape Seed Oil, Sea Salt.',
        usage: 'Massage a handful onto wet skin in circular motions during your shower. Pay special attention to rough spots. Rinse thoroughly.',
        images: [
          'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600'
        ],
        stock: 12,
      )
    ];
  }
}
