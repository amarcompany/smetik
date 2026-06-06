import 'package:flutter/material.dart';
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
          displayLarge: GoogleFonts.outfit(
            fontWeight: FontWeight.bold,
            color: const Color(0xff845EC2),
          ),
        ),
      ),
      home: const MainNavigation(),
    );
  }
}
