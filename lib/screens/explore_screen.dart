import 'dart:async';
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
  String _searchQuery = '';

  final List<Map<String, String>> _banners = const [
    {
      'title': 'Glow Serum Collection',
      'subtitle': 'Acheive radiant skin with organic extracts',
      'url': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800'
    },
    {
      'title': 'Summer Matte Lipsticks',
      'subtitle': 'Nourishing formulas that last all day',
      'url': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800'
    },
    {
      'title': 'Botanical Hair Therapy',
      'subtitle': 'Revitalize your locks from root to tip',
      'url': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800'
    }
  ];

  @override
  void initState() {
    super.initState();
    _startBannerTimer();
    Future.delayed(const Duration(milliseconds: 1000), () {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    });
  }

  void _startBannerTimer() {
    _timer = Timer.periodic(const Duration(seconds: 4), (timer) {
      if (_pageController.hasClients) {
        final newIndex = (_bannerIndex + 1) % _banners.length;
        _pageController.animateToPage(
          newIndex,
          duration: const Duration(milliseconds: 600),
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
    final allProducts = appState.products;

    // Filter products based on search query
    final filteredProducts = allProducts.where((p) {
      final nameMatches = p.name.toLowerCase().contains(_searchQuery.toLowerCase());
      final brandMatches = p.brand.toLowerCase().contains(_searchQuery.toLowerCase());
      final catMatches = p.category.toLowerCase().contains(_searchQuery.toLowerCase());
      return nameMatches || brandMatches || catMatches;
    }).toList();

    final featured = filteredProducts.where((p) => p.featured).toList();
    final newArrivals = filteredProducts.where((p) => p.newArrival).toList();
    final bestSellers = filteredProducts.where((p) => p.bestSeller).toList();

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        title: Text(
          'Smetik',
          style: GoogleFonts.outfit(
            fontSize: 22,
            fontWeight: FontWeight.bold,
            color: const Color(0xff845EC2),
            letterSpacing: 0.5,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none_outlined, color: Color(0xff1F2937)),
            onPressed: () {},
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: _isLoading ? _buildSkeleton() : SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Search Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Container(
                decoration: BoxDecoration(
                  color: const Color(0xffFAF9FD),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xffF3E8FF).withOpacity(0.5)),
                ),
                child: TextField(
                  onChanged: (val) {
                    setState(() {
                      _searchQuery = val;
                    });
                  },
                  decoration: const InputDecoration(
                    hintText: 'Search organic, skincare, luxury cosmetics...',
                    hintStyle: TextStyle(color: Colors.grey, fontSize: 11),
                    prefixIcon: Icon(Icons.search, color: Color(0xff845EC2), size: 18),
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),

            if (_searchQuery.isEmpty) ...[
              // Banner slider
              SizedBox(
                height: 160,
                child: PageView.builder(
                  controller: _pageController,
                  itemCount: _banners.length,
                  onPageChanged: (idx) {
                    setState(() {
                      _bannerIndex = idx;
                    });
                  },
                  itemBuilder: (context, index) {
                    final item = _banners[index];
                    return Container(
                      margin: const EdgeInsets.symmetric(horizontal: 16),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20),
                        image: DecorationImage(
                          image: NetworkImage(item['url']!),
                          fit: BoxFit.cover,
                          colorFilter: ColorFilter.mode(
                            Colors.black.withOpacity(0.35),
                            BlendMode.srcOver,
                          ),
                        ),
                      ),
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          Text(
                            item['title']!,
                            style: GoogleFonts.outfit(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            item['subtitle']!,
                            style: const TextStyle(
                              color: Color(0xffEFEFEF),
                              fontSize: 10,
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 10),
              // Dots indicator
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: _banners.asMap().entries.map((entry) {
                  return Container(
                    width: _bannerIndex == entry.key ? 14 : 5,
                    height: 5,
                    margin: const EdgeInsets.symmetric(horizontal: 2.5),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(4),
                      color: _bannerIndex == entry.key
                          ? const Color(0xff845EC2)
                          : const Color(0xffE4D8F3),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 24),
            ],

            // Featured Products horizontally scrollable
            if (featured.isNotEmpty) ...[
              _buildSectionHeader('Featured Hot Products'),
              SizedBox(
                height: 210,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  itemCount: featured.length,
                  itemBuilder: (context, index) {
                    return Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      child: ProductCard(product: featured[index], compact: true),
                    );
                  },
                ),
              ),
              const SizedBox(height: 24),
            ],

            // New Arrivals
            if (newArrivals.isNotEmpty) ...[
              _buildSectionHeader('New Arrivals'),
              SizedBox(
                height: 210,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  itemCount: newArrivals.length,
                  itemBuilder: (context, index) {
                    return Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      child: ProductCard(product: newArrivals[index], compact: true),
                    );
                  },
                ),
              ),
              const SizedBox(height: 24),
            ],

            // Best Sellers
            if (bestSellers.isNotEmpty) ...[
              _buildSectionHeader('Best Sellers'),
              SizedBox(
                height: 210,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  itemCount: bestSellers.length,
                  itemBuilder: (context, index) {
                    return Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      child: ProductCard(product: bestSellers[index], compact: true),
                    );
                  },
                ),
              ),
              const SizedBox(height: 24),
            ],

            // Fallback for search query resulting in empty state
            if (filteredProducts.isEmpty)
              Padding(
                padding: const EdgeInsets.all(40),
                child: Center(
                  child: Column(
                    children: [
                      Icon(Icons.search_off_outlined, size: 48, color: Colors.grey.shade300),
                      const SizedBox(height: 12),
                      const Text(
                        "No products found",
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.grey),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        "We couldn't find matches for '$_searchQuery'",
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 10, color: Colors.grey.shade400),
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 16, right: 16, bottom: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: GoogleFonts.outfit(
              fontSize: 13.5,
              fontWeight: FontWeight.bold,
              color: const Color(0xff1F2937),
            ),
          ),
          const Text(
            'See All',
            style: TextStyle(
              color: Color(0xff845EC2),
              fontSize: 10,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSkeleton() {
    return Shimmer.fromColors(
      baseColor: Colors.grey.shade200,
      highlightColor: Colors.grey.shade100,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Container(height: 45, decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16))),
            const SizedBox(height: 20),
            Container(height: 150, decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20))),
            const SizedBox(height: 20),
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Container(width: 100, height: 15, color: Colors.white),
              Container(width: 40, height: 15, color: Colors.white),
            ]),
            const SizedBox(height: 12),
            Row(children: [
              Expanded(child: Container(height: 140, decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)))),
              const SizedBox(width: 12),
              Expanded(child: Container(height: 140, decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)))),
            ]),
          ],
        ),
      ),
    );
  }
}

