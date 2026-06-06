class Product {
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
