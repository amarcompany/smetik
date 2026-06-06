import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  String _activeSkinConcern = 'Dry & Sensitive';
  int _acneFrequencyIndex = 2; // 0 - None, 1 - Rarely, 2 - Often
  bool _organicPreference = true;

  final List<String> _skinConcerns = const [
    'Dry & Sensitive',
    'Oily & Hydrated',
    'Combination Skin',
    'Normal & Clear',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        title: const Text(
          'My Profile',
          style: TextStyle(
            fontSize: 15.5,
            fontWeight: FontWeight.bold,
            color: Color(0xff1F2937),
          ),
        ),
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // User Avatar & Name header
            Row(
              children: [
                CircleAvatar(
                  radius: 30,
                  backgroundColor: const Color(0xffFAF5FF),
                  child: Text(
                    'W',
                    style: GoogleFonts.outfit(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: const Color(0xff845EC2),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Smetik Beauty Enthusiast',
                      style: GoogleFonts.outfit(
                        fontSize: 14.5,
                        fontWeight: FontWeight.bold,
                        color: const Color(0xff1F2937),
                      ),
                    ),
                    const SizedBox(height: 2),
                    const Text(
                      'wisman040@gmail.com',
                      style: TextStyle(
                        fontSize: 11,
                        color: Colors.grey,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 28),

            // 1. Beauty Skin Profile Questionnaire card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xffFAF9FD),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xff845EC2).withOpacity(0.08)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.auto_awesome, color: Color(0xff845EC2), size: 16),
                      const SizedBox(width: 6),
                      Text(
                        'Beauty & Dermal Skin Profile',
                        style: GoogleFonts.outfit(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: const Color(0xff1F2937),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  
                  // Question A
                  const Text(
                    'Active skin concern or profile:',
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: _skinConcerns.map((concern) {
                      final isSel = concern == _activeSkinConcern;
                      return GestureDetector(
                        onTap: () {
                          setState(() {
                            _activeSkinConcern = concern;
                          });
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: isSel ? const Color(0xff845EC2) : Colors.white,
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(
                              color: isSel ? Colors.transparent : const Color(0xffF3E8FF),
                            ),
                          ),
                          child: Text(
                            concern,
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                              color: isSel ? Colors.white : const Color(0xff4B5563),
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 16),

                  // Question B
                  const Text(
                    'How often do you experience irritation or acne?',
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      _buildRadioOption('Never', 0),
                      const SizedBox(width: 8),
                      _buildRadioOption('Rarely', 1),
                      const SizedBox(width: 8),
                      _buildRadioOption('Often', 2),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Question C
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Prefer organic botanical formulation?',
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey),
                      ),
                      Switch(
                        activeColor: const Color(0xff845EC2),
                        value: _organicPreference,
                        onChanged: (val) {
                          setState(() {
                            _organicPreference = val;
                          });
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 28),

            // 2. Settings list options
            Text(
              'Account Directory',
              style: GoogleFonts.outfit(
                fontSize: 12.5,
                fontWeight: FontWeight.bold,
                color: const Color(0xff1F2937),
              ),
            ),
            const SizedBox(height: 10),
            
            _buildProfileTile(Icons.history_outlined, 'My Order History', 'Track active checkout queries'),
            _buildProfileTile(Icons.location_on_outlined, 'Shipping Addresses', 'Manage home delivery configurations'),
            _buildProfileTile(Icons.credit_card_outlined, 'Payment Methods', 'Manage virtual cards or e-wallets'),
            _buildProfileTile(Icons.security_outlined, 'Account Security', 'Setup biometrics lock controls'),
            _buildProfileTile(Icons.help_outline, 'Help & Boutiques Support', 'Speak directly with our consultants via chat'),
          ],
        ),
      ),
    );
  }

  Widget _buildRadioOption(String label, int idx) {
    final isSelected = _acneFrequencyIndex == idx;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            _acneFrequencyIndex = idx;
          });
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xffEFECF6) : Colors.white,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: isSelected ? const Color(0xff845EC2) : const Color(0xffF3E8FF),
            ),
          ),
          child: Text(
            label,
            style: TextStyle(
              fontSize: 9,
              fontWeight: FontWeight.bold,
              color: isSelected ? const Color(0xff845EC2) : const Color(0xff4B5563),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildProfileTile(IconData icon, String title, String subtitle) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xffF3E8FF).withOpacity(0.4)),
      ),
      child: ListTile(
        dense: true,
        leading: Container(
          padding: const EdgeInsets.all(6),
          decoration: const BoxDecoration(
            color: Color(0xffFAF5FF),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: const Color(0xff845EC2), size: 16),
        ),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Color(0xff1F2937)),
        ),
        subtitle: Text(
          subtitle,
          style: const TextStyle(fontSize: 9, color: Colors.grey),
        ),
        trailing: const Icon(Icons.chevron_right, size: 16, color: Colors.grey),
        onTap: () {},
      ),
    );
  }
}
