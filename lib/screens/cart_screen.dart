import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/product.dart';
import '../providers/app_state.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  void _triggerWhatsAppCheckout(BuildContext context, AppState appState) async {
    if (appState.cart.isEmpty) return;

    final StringBuffer buffer = StringBuffer();
    buffer.writeln("🌸 *SMETIK ORDER INQUIRY* 🌸");
    buffer.writeln("Hi Smetik! I would like to purchase these products:\n");

    double total = 0;
    appState.cart.forEach((id, q) {
      final prod = appState.products.firstWhere((p) => p.id == id);
      final itemTotal = prod.price * q;
      total += itemTotal;
      buffer.writeln("• *${prod.name}*");
      buffer.writeln("  _Qty: $q x Rp ${prod.price.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (match) => '${match[1]}.')}_");
      buffer.writeln("  _Total: Rp ${itemTotal.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (match) => '${match[1]}.')}_\n");
    });

    buffer.writeln("----------------------------");
    buffer.writeln("*Total Bill: Rp ${total.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (match) => '${match[1]}.')}*");
    buffer.writeln("\nPlease assist me with complete delivery address and payments. Thank you!");

    final encodedMessage = Uri.encodeComponent(buffer.toString());
    final url = "https://wa.me/628123456789?text=$encodedMessage";

    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Could not trigger WhatsApp. Copied list to clipboard!')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);
    final cartItems = appState.cart;
    final subtotal = appState.getCartTotal();
    final shipping = subtotal > 0 ? 10000.0 : 0.0;
    final total = subtotal + shipping;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        title: const Text(
          'Shopping Cart',
          style: TextStyle(
            fontSize: 15.5,
            fontWeight: FontWeight.bold,
            color: Color(0xff1F2937),
          ),
        ),
        actions: [
          if (cartItems.isNotEmpty)
            TextButton(
              onPressed: () {
                appState.clearCart();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Cart cleared successfully!')),
                );
              },
              child: const Text(
                'Clear',
                style: TextStyle(
                  color: Color(0xff845EC2),
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
        ],
      ),
      body: cartItems.isEmpty
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(40),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: const Color(0xffFAF9FD),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.shopping_bag_outlined,
                        size: 40,
                        color: Color(0xff845EC2),
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Your cart is currently empty',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                        color: Color(0xff374151),
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Explore our premium beauty, organic skincare, and cosmetics products to fill your cart!',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 10,
                        color: Colors.grey,
                      ),
                    ),
                  ],
                ),
              ),
            )
          : Column(
              children: [
                // Cart items list
                Expanded(
                  child: ListView.separated(
                    physics: const BouncingScrollPhysics(),
                    padding: const EdgeInsets.all(16),
                    itemCount: cartItems.length,
                    separatorBuilder: (context, index) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final productId = cartItems.keys.elementAt(index);
                      final qty = cartItems[productId]!;
                      final prod = appState.products.firstWhere(
                        (p) => p.id == productId,
                        orElse: () => Product(
                          id: productId,
                          name: 'Unknown item',
                          brand: 'Generic',
                          category: 'None',
                          price: 0,
                          rating: 0,
                          description: '',
                          ingredients: '',
                          usage: '',
                          images: [],
                          stock: 0,
                        ),
                      );

                      return Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xffF3E8FF).withOpacity(0.5)),
                        ),
                        child: Row(
                          children: [
                            // Thumbnail
                            Container(
                              width: 64,
                              height: 64,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(12),
                                image: DecorationImage(
                                  image: NetworkImage(
                                    prod.images.isNotEmpty ? prod.images[0] : 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150',
                                  ),
                                  fit: BoxFit.cover,
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            // Details
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    prod.brand.toUpperCase(),
                                    style: const TextStyle(
                                      color: Color(0xff845EC2),
                                      fontSize: 7.5,
                                      fontWeight: FontWeight.bold,
                                      letterSpacing: 0.8,
                                    ),
                                  ),
                                  const SizedBox(height: 1.5),
                                  Text(
                                    prod.name,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      color: Color(0xff1F2937),
                                      fontSize: 11.5,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'Rp ${prod.price.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (match) => '${match[1]}.')}',
                                    style: const TextStyle(
                                      color: Color(0xff1F2937),
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            // Stepper & Delete controls
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                IconButton(
                                  padding: EdgeInsets.zero,
                                  constraints: const BoxConstraints(),
                                  icon: const Icon(Icons.delete_outline, color: Colors.grey, size: 16),
                                  onPressed: () {
                                    appState.removeFromCartCompletely(prod.id);
                                  },
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    GestureDetector(
                                      onTap: () => appState.removeOneFromCart(prod.id),
                                      child: Container(
                                        padding: const EdgeInsets.all(3),
                                        decoration: BoxDecoration(
                                          border: Border.all(color: Colors.grey.shade300),
                                          shape: BoxShape.circle,
                                        ),
                                        child: const Icon(Icons.remove, size: 10, color: Color(0xff4B5563)),
                                      ),
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.symmetric(horizontal: 8),
                                      child: Text(
                                        qty.toString(),
                                        style: const TextStyle(
                                          fontSize: 11.5,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                    GestureDetector(
                                      onTap: () {
                                        if (qty < prod.stock) {
                                          appState.addToCart(prod.id);
                                        }
                                      },
                                      child: Container(
                                        padding: const EdgeInsets.all(3),
                                        decoration: BoxDecoration(
                                          border: Border.all(color: Colors.grey.shade300),
                                          shape: BoxShape.circle,
                                        ),
                                        child: const Icon(Icons.add, size: 10, color: Color(0xff4B5563)),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
                
                // Bottom summary checkout
                Container(
                  padding: const EdgeInsets.all(20),
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
                  child: Column(
                    children: [
                      _buildSummaryRow(
                        'Subtotal',
                        'Rp ${subtotal.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (match) => '${match[1]}.')}',
                      ),
                      const SizedBox(height: 8),
                      _buildSummaryRow(
                        'Est. Delivery Fee',
                        'Rp ${shipping.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (match) => '${match[1]}.')}',
                      ),
                      const Divider(height: 24, color: Color(0xffF3E8FF)),
                      _buildSummaryRow(
                        'Total Bill',
                        'Rp ${total.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (match) => '${match[1]}.')}',
                        isTotal: true,
                      ),
                      const SizedBox(height: 16),
                      // Checkout Button
                      GestureDetector(
                        onTap: () => _triggerWhatsAppCheckout(context, appState),
                        child: Container(
                          height: 48,
                          decoration: BoxDecoration(
                            color: const Color(0xff845EC2),
                            borderRadius: BorderRadius.circular(16),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xff845EC2).withOpacity(0.15),
                                blurRadius: 12,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          alignment: Alignment.center,
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: const [
                              Icon(Icons.support_agent, color: Colors.white, size: 18),
                              SizedBox(width: 8),
                              Text(
                                "PROCEED VIA WHATSAPP",
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 1.0,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildSummaryRow(String label, String value, {bool isTotal = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: isTotal ? 12 : 11,
            fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
            color: isTotal ? const Color(0xff1F2937) : Colors.grey.shade500,
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: isTotal ? 13 : 11,
            fontWeight: isTotal ? FontWeight.bold : FontWeight.bold,
            color: isTotal ? const Color(0xff845EC2) : const Color(0xff1F2937),
          ),
        ),
      ],
    );
  }
}
