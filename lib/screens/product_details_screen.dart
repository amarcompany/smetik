import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/product.dart';
import '../providers/app_state.dart';

class ProductDetailsScreen extends StatefulWidget {
  final Product product;

  const ProductDetailsScreen({
    super.key,
    required this.product,
  });

  @override
  State<ProductDetailsScreen> createState() => _ProductDetailsScreenState();
}

class _ProductDetailsScreenState extends State<ProductDetailsScreen> {
  int _activeImageIndex = 0;
  int _quantity = 1;

  void _triggerWhatsAppCheckout() async {
    final message = "Hello Smetik! I would love to order:\n"
        "- ${widget.product.name} (QTY: $_quantity)\n"
        "Brand: ${widget.product.brand}\n"
        "Price: Rp ${widget.product.price.toStringAsFixed(0)}\n"
        "Please let me know how to complete the payment! Thank you.";
    
    final encodedMessage = Uri.encodeComponent(message);
    final url = "https://wa.me/628123456789?text=$encodedMessage";
    
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Could not open WhatsApp. Link copied to clipboard!')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);
    final isWish = appState.isWishlisted(widget.product.id);

    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          // Scrolling content
          SingleChildScrollView(
            padding: const EdgeInsets.only(bottom: 100),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top image gallery with page indicator
                Stack(
                  children: [
                    SizedBox(
                      height: 380,
                      child: PageView.builder(
                        itemCount: widget.product.images.isNotEmpty ? widget.product.images.length : 1,
                        onPageChanged: (idx) {
                          setState(() {
                            _activeImageIndex = idx;
                          });
                        },
                        itemBuilder: (context, index) {
                          return Hero(
                            tag: 'product_img_${widget.product.id}_grid',
                            child: Image.network(
                              widget.product.images.isNotEmpty ? widget.product.images[index] : 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600',
                              fit: BoxFit.cover,
                            ),
                          );
                        },
                      ),
                    ),
                    // Back button & Wishlist Header line
                    Positioned(
                      top: MediaQuery.of(context).padding.top + 10,
                      left: 16,
                      right: 16,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          GestureDetector(
                            onTap: () => Navigator.pop(context),
                            child: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: const BoxDecoration(
                                color: Colors.white,
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.arrow_back, color: Color(0xff1F2937), size: 18),
                            ),
                          ),
                          GestureDetector(
                            onTap: () {
                              appState.toggleWishlist(widget.product.id);
                            },
                            child: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: const BoxDecoration(
                                color: Colors.white,
                                shape: BoxShape.circle,
                              ),
                              child: Icon(
                                isWish ? Icons.favorite : Icons.favorite_border,
                                color: isWish ? const Color(0xffFF6F91) : Colors.grey.shade600,
                                size: 18,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    // Indicators
                    if (widget.product.images.length > 1)
                      Positioned(
                        bottom: 16,
                        left: 0,
                        right: 0,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: widget.product.images.asMap().entries.map((entry) {
                            return Container(
                              width: 6,
                              height: 6,
                              margin: const EdgeInsets.symmetric(horizontal: 3),
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: _activeImageIndex == entry.key
                                    ? const Color(0xff845EC2)
                                    : Colors.white.withOpacity(0.5),
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                  ],
                ),
                
                // Detailed Information
                Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Brand
                      Text(
                        widget.product.brand.toUpperCase(),
                        style: const TextStyle(
                          color: Color(0xff845EC2),
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 2.0,
                        ),
                      ),
                      const SizedBox(height: 6),
                      // Title
                      Text(
                        widget.product.name,
                        style: const TextStyle(
                          color: Color(0xff1F2937),
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          height: 1.25,
                        ),
                      ),
                      const SizedBox(height: 8),
                      // Rating & Category row
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: const Color(0xffFAF5FF),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              widget.product.category,
                              style: const TextStyle(
                                color: Color(0xff845EC2),
                                fontSize: 9.5,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Row(
                            children: [
                              const Icon(Icons.star, color: Color(0xffFBBF24), size: 12),
                              const SizedBox(width: 2),
                              Text(
                                widget.product.rating.toString(),
                                style: const TextStyle(
                                  color: Color(0xff4B5563),
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                          const Spacer(),
                          Text(
                            'Stock: ${widget.product.stock}',
                            style: TextStyle(
                              color: widget.product.stock < 10 ? Colors.red : Colors.grey.shade500,
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      const Divider(height: 32, color: Color(0xffF3E8FF)),
                      
                      // Quantity selector
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'SELECT QUANTITY',
                            style: TextStyle(
                              color: Color(0xff9CA3AF),
                              fontSize: 9.5,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 0.8,
                            ),
                          ),
                          Row(
                            children: [
                              GestureDetector(
                                onTap: () {
                                  if (_quantity > 1) {
                                    setState(() {
                                      _quantity--;
                                    });
                                  }
                                },
                                child: Container(
                                  padding: const EdgeInsets.all(4),
                                  decoration: BoxDecoration(
                                    border: Border.all(color: Colors.grey.shade300),
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(Icons.remove, size: 15, color: Color(0xff4B5563)),
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 14),
                                child: Text(
                                  _quantity.toString(),
                                  style: const TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              GestureDetector(
                                onTap: () {
                                  if (_quantity < widget.product.stock) {
                                    setState(() {
                                      _quantity++;
                                    });
                                  }
                                },
                                child: Container(
                                  padding: const EdgeInsets.all(4),
                                  decoration: BoxDecoration(
                                    border: Border.all(color: Colors.grey.shade300),
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(Icons.add, size: 15, color: Color(0xff4B5563)),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // Description accordion sections
                      _buildAccordion('Description', widget.product.description),
                      const SizedBox(height: 12),
                      _buildAccordion('Key Ingredients', widget.product.ingredients),
                      const SizedBox(height: 12),
                      _buildAccordion('Usage Instructions', widget.product.usage),
                    ],
                  ),
                ),
              ],
            ),
          ),
          
          // Bottom Bar for static button interface
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.04),
                    blurRadius: 10,
                    offset: const Offset(0, -4),
                  ),
                ],
              ),
              child: SafeArea(
                child: Row(
                  children: [
                    // WhatsApp Checkout
                    GestureDetector(
                      onTap: _triggerWhatsAppCheckout,
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: const Color(0xffE8FDF0),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xff22C55E).withOpacity(0.2)),
                        ),
                        child: const Icon(Icons.support_agent_outlined, color: Color(0xff22C55E), size: 20),
                      ),
                    ),
                    const SizedBox(width: 12),
                    // Total & Add action
                    Expanded(
                      child: GestureDetector(
                        onTap: () {
                          for (int i = 0; i < _quantity; i++) {
                            appState.addToCart(widget.product.id);
                          }
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('Added $_quantity item(s) to Cart!'),
                              duration: const Duration(seconds: 2),
                            ),
                          );
                        },
                        child: Container(
                          height: 48,
                          decoration: BoxDecoration(
                            color: const Color(0xff845EC2),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            'ADD TO CART • Rp ${(widget.product.price * _quantity).toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (match) => '${match[1]}.')}',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.0,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAccordion(String title, String content) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xffFAF9FC),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xffF3E8FF).withOpacity(0.3)),
      ),
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          iconColor: const Color(0xff845EC2),
          collapsedIconColor: Colors.grey.shade400,
          title: Text(
            title,
            style: const TextStyle(
              fontSize: 10.5,
              fontWeight: FontWeight.bold,
              color: Color(0xff1F2937),
              letterSpacing: 0.5,
            ),
          ),
          childrenPadding: const EdgeInsets.only(left: 16, right: 16, bottom: 16),
          expandedAlignment: Alignment.topLeft,
          children: [
            Text(
              content,
              style: TextStyle(
                fontSize: 11,
                color: Colors.grey.shade600,
                height: 1.5,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
