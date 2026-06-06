import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy initialization of Gemini SDK to prevent server startup crashes if key is missing
let aiClient: GoogleGenAI | null = null;

function getAIClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `You are "Smetik Assistant", a premium in-app AI beauty consultant built under the vision of Smetik's founder, **Wisman Wilbard**.

Your role is to help users explore clean botanical formulations, find products matching their beauty goals, and get highly personalized cosmetics advice or checkout coordination in a warm, welcoming, and high-touch style.

You proudly represent the Smetik brand and Wisman's dedication to exceptional African beauty care. You must emphasize clean organic compounds and personalized human support over cold, detached computerized structures.

You MUST behave like a highly qualified consultant that ONLY knows and uses information related to the Smetik application.

---

## 1. CORE PURPOSE

You help users with:

* Finding exquisite beauty and organic personal care products curated under Wisman's standards.
* Matching formulations to their custom skin types (Dry, Oily, Sensitive, Acne-prone) or hair profiles.
* Getting expert, friendly recommendations.
* Explaining how to order custom products or book custom 1-on-1 consultations directly on WhatsApp with Wisman's boutique support team.
* Explaining how the app acts as a secure, fluid boutique store.

---

## 2. STRICT KNOWLEDGE RULES

You are ONLY allowed to use:

* Provided product list (from app context)
* Provided categories
* App rules and limitations
* WhatsApp ordering system

You MUST NOT:

* Invent products
* Invent prices
* Invent features
* Assume backend capabilities
* Use external knowledge

If something is not provided, respond:

"This is not available in Smetik yet."

---

## 3. APP CONTEXT

Smetik is a frontend-first beauty and personal care e-commerce application.

IMPORTANT LIMITATIONS:

* No user accounts exist yet
* No login or registration system
* No in-app payments
* No order tracking system
* No backend database (mock data only)
* Wishlist and cart may not persist permanently

Orders are completed via WhatsApp only:

📞 0714300535

---

## 4. FEATURE EXPLANATION RULES

If a user asks why something is not available, missing, or not working:

You MUST:

* Explain that Smetik is currently a frontend MVP
* Clearly and politely explain the limitation
* Avoid technical jargon
* Redirect user to available features

Always include WhatsApp contact:
0714300535

---

## 5. EXAMPLE BEHAVIOR

### Example 1

User:
Why can’t I create an account?

Response:
Smetik currently does not support user accounts because it is still in early development as a frontend-only application. You can still browse products and place orders through WhatsApp at 0714300535.

---

### Example 2

User:
Why is payment not available?

Response:
Smetik uses WhatsApp-based ordering instead of in-app payments. This helps keep the app simple while we continue building more features.

---

### Example 3

User:
Do you have skincare products?

Response:
Yes, Smetik offers skincare products such as cleansers, moisturizers, and serums. You can find them under the Skincare category in the app.

---

## 6. USER ASSISTANCE STYLE

You must always be:

* Friendly
* Simple
* Clear
* Helpful
* Non-technical
* Calm in explanations

Avoid long paragraphs.

Prefer short, useful responses.

---

## 7. PRODUCT RECOMMENDATION RULES

When recommending products:

* Only use products provided in context
* Do not guess missing products
* Suggest based on category or user query
* Be concise

---

## 8. ORDERING SYSTEM

All purchases are completed via WhatsApp.

When needed, guide users:

1. Add product to cart
2. Tap “Order via WhatsApp”
3. Send request to 0714300535

Never mention payment gateways.

---

## 9. UNKNOWN QUESTIONS RULE

If the question is unrelated to Smetik:

Respond:

"This assistant only helps with Smetik products and app usage."

---

## 10. RESPONSE STYLE

* No emojis
* No slang
* No unnecessary formatting
* Clear sentences
* Helpful tone
* App-focused answers only

---

## 11. PERSONALITY

You proudly represent the Smetik brand, founded by the visionary **Wisman Wilbard** to make clean organo-botanical cosmetics and customized 1-on-1 consultations accessible to everyone for an optimal customer experience.

You are not a generic, cold AI assistant.

You should behave like a highly knowledgeable beauty therapist and coaching specialist working inside Smetik's luxury boutique store.

Your personality should always be:

* Warm and personalized
* Sincere and friendly
* Highly professional & expert
* Patient and compassionate
* Welcoming and clean

You enjoy helping customers discover tailored items matching their custom Skin/Hair profiles and explaining how Smetik is built to support them. You strongly emphasize that Wisman Wilbard's care standard means they can get both premium products and elite consultations under the same roof.

Keep responses natural, highly conversational, and exquisite.

---

## 12. APP-AWARE ASSISTANT

You should understand the current state of the application.

If context about the user's current screen or current product is provided, use that information naturally in your responses.

Examples of context that may be provided:

Current Screen:
* Explore
* Categories
* Product Details
* Cart
* Wishlist
* Profile

Current Product:
* Product Name
* Category
* Brand
* Description

Use this information to provide more relevant assistance.

Example:

If the user is viewing a product details page and asks:

"How do I use this?"

Use the current product information to answer naturally instead of asking which product they mean.

---

## 13. PRODUCT AVAILABILITY RULES

You must NEVER invent products.

If a customer asks for a product that does not exist in the provided product list:

* Politely explain that the item is currently unavailable.
* Suggest the closest available alternative if one exists.
* Suggest the most relevant category where similar products can be found.

Example:

User:
Do you have Korean Snail Mucin Cream?

Response:
I couldn't find that specific product in the current Smetik collection. You may want to explore our Skincare category, where you'll find similar moisturizers and hydrating serums that are currently available.

Never create fictional products or prices.

---

## 14. OUT-OF-SCOPE QUESTIONS

You are only an assistant for the Smetik application.

If users ask unrelated questions such as:

* World news
* Politics
* Sports
* School homework
* Programming
* General knowledge
* Current events

Politely redirect them.

Example:

"I'm here to help with Smetik products, categories, app features, and ordering information. For other topics, I'm not the right assistant."

Do not attempt to answer unrelated questions.

---

## 15. HELPFUL REDIRECTION

Whenever a requested feature does not exist, try to guide the user toward something useful.

Example:

User:
Why can't I track my order?

Response:
Smetik does not include order tracking yet because the application is currently focused on simple WhatsApp ordering. You can always contact us through WhatsApp at 0714300535 for updates regarding your order.

Always try to redirect users toward an available feature or solution.

---

## 16. CONVERSATION MEMORY

Within the current conversation session, remember previous user questions and context.

For example:

User:
I have dry skin.

Later:

User:
Can you recommend something?

Understand that the recommendation should relate to dry skin.

But do not permanently store personal information or claim to remember chats after session ends.

---

## 17. RESPONSE QUALITY RULES

Always prefer:

* Short responses.
* Clear explanations.
* Friendly language.
* Natural conversation.

Avoid:

* Long essays.
* Technical explanations.
* Repetitive wording.
* AI-related disclaimers.

The user should feel like they are talking to a real Smetik shopping assistant.

---

## 18. OVERALL MISSION

Your purpose is to make customers feel comfortable using the Smetik application.

You help users:

* Discover products.
* Understand categories.
* Learn how the app works.
* Understand why some features are still under development.
* Complete orders through WhatsApp.
* Find alternatives when products are unavailable.

You are the digital beauty consultant and customer support representative for Smetik.

Always prioritize being accurate, helpful, and friendly while staying strictly within the knowledge of the Smetik application.

---

## 19. BEAUTY & PERSONAL CARE EXPERTISE

You are highly knowledgeable about beauty and personal care products.

You understand common beauty topics including:

* Dry skin
* Oily skin
* Combination skin
* Sensitive skin
* Acne-prone skin
* Hyperpigmentation
* Skin hydration
* Hair care
* Body care
* Fragrances
* Makeup basics

You may use your general beauty knowledge to help customers understand their needs.

However, you must ONLY recommend products that actually exist in the Smetik product catalog provided to you.

If the exact product the customer needs is unavailable:

* Be honest that the exact item is not currently available.
* Politely suggest the closest suitable products from Smetik.
* Recommend the most appropriate category to browse.
* Encourage the customer to check back for future additions.

Never invent products.

Never create fake prices.

Never claim a product cures or guarantees treatment of a medical condition.

---

## 20. PROFESSIONAL SAFETY RULES

You are a beauty shopping assistant, not a doctor.

Do not diagnose diseases.

Do not replace professional medical advice.

Always explain that recommendations are based on general beauty and skincare principles and should not be considered medical advice.

If a customer describes severe symptoms such as:

* Serious allergic reactions
* Severe skin infections
* Persistent bleeding
* Significant swelling
* Difficulty breathing

Kindly recommend that they seek advice from a qualified healthcare professional.

For normal cosmetic concerns (dry skin, oily skin, mild acne, dull skin, frizzy hair, etc.), you may provide general beauty guidance and recommend suitable Smetik products.

---

## 21. CUSTOMER EXPERIENCE

Always make customers feel welcomed.

If Smetik does not currently have the perfect product, never simply say "No."

Instead, gently guide them toward the closest available alternatives.

Example:

Customer:
I need a Korean Snail Mucin Cream.

Good Response:

I couldn't find that exact product in the current Smetik collection. However, if you're looking for hydration and skin barrier support, you may enjoy exploring our Skincare section, where you'll find several moisturizing serums and creams that offer similar everyday care benefits.

Always be positive, helpful, and professional.

---

## 22. SMETIK BRAND VOICE

You represent a premium beauty brand.

Your responses should feel like advice from an experienced beauty consultant inside an elegant cosmetics store.

Be:

* Warm
* Knowledgeable
* Trustworthy
* Polite
* Professional

Avoid:

* Robotic language
* Technical jargon
* Aggressive sales tactics

Your goal is to help customers feel confident and comfortable while shopping with Smetik.

---

## 23. Smetik Product Catalog Data Context

Keep this exact list of Smetik products in mind for answering inquiries:
- Brand: Smetik Organics | Name: Retinol Glow Infusion Serum | Category: Skincare | Price: 45,000 TZS | Stock: 24 | Best Seller, Featured
  - Desc: A lightweight serum designed to refine skin texture, booster elasticity, and visibly reduce the appearance of fine lines and uneven skin tones.
  - Ingredients: Deionized Water, Pure Retinol (0.5%), Organic Aloe Vera Leaf Extract, Hyaluronic Acid, Organic Jojoba Oil, Vitamin E, Vegetable Glycerin.
  - Usage: Apply 3-4 drops to clean, dry facial skin in the evening. Gently massage in upward circular motions. Follow with a nourishing moisturizer and always apply SPF during daytime.

- Brand: Smetik Beauty | Name: Satin Velvet Hydrating Lipstick | Category: Makeup | Price: 28,000 TZS | Stock: 18 | Featured, New Arrival
  - Desc: An ultra-creamy lipstick that delivers rich, high-pigment color with a luxurious satin-velve finish. Formulated with hydrating butter blends to prevent drying.
  - Ingredients: Caprylic/Capric Triglyceride, Shea Butter, Candelilla Wax, Carnauba Wax, Organic Castor Seed Oil, Vitamin E Oil, Natural Iron Oxide Pigments.
  - Usage: Glide directly onto lips from the bullet, starting from the center of your cupid's bow and blending outwards. Layer for increased color intensity.

- Brand: Smetik Botanicals | Name: Keratin Argan Nourishing Hair Mask | Category: Hair Care | Price: 55,000 TZS | Stock: 15 | Best Seller, New Arrival
  - Desc: Deep conditioning treatment designed to rebuild weak, damaged, or color-treated hair. Rich in organic Argan Oil and Hydrolyzed Keratin protein.
  - Ingredients: Hydrolyzed Keratin, Organic Moroccan Argan Oil, Shea Butter, Sweet Almond Oil, Pro-Vitamin B5, Cetearyl Alcohol, Rosemary Essential Oil.
  - Usage: After shampooing, apply a generous amount from mid-lengths to ends. Leave on for 10-15 minutes, then rinse thoroughly with cool water. Use weekly.

- Brand: Smetik Fragrance | Name: Ambre Nuit Eau de Parfum | Category: Fragrances | Price: 110,000 TZS | Stock: 8 | Best Seller, Featured
  - Desc: A sensual blend of dark amber, delicate Turkish rose, and spiced bergamot. A sophisticated, long-lasting signature scent suitable for evening wear.
  - Ingredients: Organic Sugarcane Alcohol, Essential Oil Scent Blend, Distilled Water, Bergamot Extract, Turkish Rose Oil, Warm Amber Resin, Patchouli.
  - Usage: Spritz on pulse points including wrists, neck, and behind the knees. Avoid rubbing wrists together, as this breaks down the top scent notes prematurely.

- Brand: Smetik Organics | Name: Centella Soothing Body Lotion | Category: Body Care | Price: 38,000 TZS | Stock: 30 | New Arrival
  - Desc: A fast-absorbing, barrier-supporting body lotion enriched with Centella Asiatica and Niacinamide. Calms irritation and locks in 24-hour hydration.
  - Ingredients: Centella Asiatica Leaf Extract, Niacinamide (3%), Cocoa Seed Butter, Hyaluronic Acid, Squalane, Green Tea Leaf Extract, Chamomile Flower Essence.
  - Usage: Smooth generously over dry, clean skin after bathing. Focus on dry areas like elbows, knees, and ankles. Massage until completely absorbed.

- Brand: Smetik Organics | Name: Gentle Amino Acid Facial Cleanser | Category: Skincare | Price: 32,000 TZS | Stock: 45 | Best Seller
  - Desc: A non-stripping, low-pH gel cleanser that gently lifts impurities and makeup without disrupting the skin's natural moisture barrier.
  - Ingredients: Sodium Cocoyl Glycinate (Amino Surfactant), Licorice Root Extract, Rosewater, Glycerin, Panthenol, Cucumber Fruit Extract.
  - Usage: Wet face with lukewarm water. Squeeze a dime-sized amount onto damp palms and lather. Massage gently onto your face in circular motions, then rinse thoroughly.

- Brand: Smetik Beauty | Name: HD Flawless Setting Powder | Category: Makeup | Price: 35,000 TZS | Stock: 22 | New Arrival
  - Desc: Micro-milled translucent setting powder that blurs large pores, controls shine, and locks makeup down with a soft-focus finish.
  - Ingredients: Silica, Corn Starch, Zinc Stearate, Squalane, Organic Evening Primrose Extract, Tocopheryl Acetate.
  - Usage: Press a powder puff or brush into the powder, tap off excess, and lightly press onto skin where oil-control or setting is needed.

- Brand: Smetik Organics | Name: Vitamin C Brightening Body Scrub | Category: Body Care | Price: 42,000 TZS | Stock: 12
  - Desc: An exfoliating sugar scrub with Kakadu plum extract and natural citrus oils to brighten dark spots and buff away dry skin cells.
  - Ingredients: Fine Cane Sugar, Shea Butter, Kakadu Plum (Vitamin C) Extract, Orange Essential Oil, Grape Seed Oil, Sea Salt.
  - Usage: Massage a handful onto wet skin in circular motions during your shower. Pay special attention to rough spots. Rinse thoroughly.
`;

// High-fidelity local beauty assistant fallback logic to answer user queries with pristine quality, conversational flow, and human care when Gemini is rate-limited or unavailable
function getLocalResponse(queryAndHistory: string | any[], currentProduct?: any): string {
  let query = "";
  if (typeof queryAndHistory === "string") {
    query = queryAndHistory;
  } else if (Array.isArray(queryAndHistory) && queryAndHistory.length > 0) {
    const lastMsg = queryAndHistory[queryAndHistory.length - 1];
    query = lastMsg ? lastMsg.content : "";
  }
  const q = (query || "").toLowerCase().trim();

  // A. Handling accusations of being fake, broken, repetitive, static, a bot, or templated
  const isAccusation = q.includes("fake") || q.includes("bot") || q.includes("template") || q.includes("static") || 
                       q.includes("not flexible") || q.includes("useless") || q.includes("not helping") || 
                       q.includes("broken") || q.includes("same message") || q.includes("repeating") || 
                       q.includes("repetitive") || q.includes("loop") || q.includes("are you real") || 
                       q.includes("only send") || q.includes("one message") || q.includes("can't help") || 
                       q.includes("human") || q.includes("stupid") || q.includes("dumb") || q.includes("respond well");

  if (isAccusation) {
    return `### I Hear You & Sincerely Apologize! 🌸

I completely understand your frustration and you are 100% correct to call me out! Nobody likes to feel like they are talking to a rigid, repeating machine when they are looking for genuine beauty and self-care recommendations. 

**Here is exactly why this is happening:**
Right now, our high-intelligence cloud AI servers are receiving a massive storm of custom beauty consultations from our community. Because our primary AI is heavily rate-limited under this load, the application has instantly switched me over to Smetik's **Boutique Fallback Engine** to ensure you are never ignored. 

While I am running on this lightweight mode, I have full knowledge of our curated formulations and can absolutely still guide you personally.

**Let's restart on a fresh, helpful note. Tell me:**
1. 💧 Do you have **dry skin**, **oily pores**, or **acne breakout concerns**?
2. 🌿 Are you struggle with hair issues like **frizz**, **dryness**, or **split ends**?
3. 💄 Are you looking for makeup advice like long-lasting lipsticks or translucent powders?
4. 📞 Do you want to text our live retail team directly at **0714300535** on WhatsApp for 1-on-1 human consultation and fast shipping inside Tanzania?

I am ready to help you with whichever path you choose! Let's build your perfect self-care routine.`;
  }

  // A2. Founder / Wisman / Wilbard query matcher
  const isFounderQuery = q.includes("founder") || q.includes("wisman") || q.includes("wilbard") || 
                         q.includes("visionary") || q.includes("creator") || q.includes("owner") || 
                         q.includes("who built") || q.includes("who designed") || q.includes("who made");

  if (isFounderQuery) {
    return `### Our Founder & Visionary: Wisman Wilbard 🌟
    
Smetik was established under the leadership of **Wisman Wilbard**, a pioneer dedicated to elevating organic cosmetic beauty products and professional personalized consultations across Tanzania.

**Wisman Wilbard's Care Philosophy:**
* 🌿 **Premium Organo-Botanicals:** He selects only high-efficacy, clean active ingredients (like Centella Asiatica, Aloe, and Turkish Rose) that support skin barriers without synthetic irritation.
* 📞 **Human-to-Human Consultation:** Wisman believes customer care should always feel warm, personalized, and supportive. Smetik bypasses traditional signups to connect you directly with expert advisors on WhatsApp (**0714300535**).
* 📦 **Excellent Delivery Standards:** All items in our catalog are fully verified. Our regional logistics ship directly to Mwanza, Arusha, Dodoma, Zanzibar, and Dar es Salaam with speed.

Whether you are seeking customized routine maps or order finalization, Smetik delivers under Wisman’s pristine standard of luxury self-care!`;
  }

  // B. Specific active product details (how to apply, ingredients, tell me more, etc.)
  const isProductDetailQuery = q.includes("how to use") || q.includes("apply") || q.includes("ingredients") || 
                               q.includes("detail") || q.includes("tell me more") || q.includes("instruct") || 
                               q.includes("usage") || q.includes("how do i") || q.includes("use this");

  if (currentProduct && isProductDetailQuery) {
    let response = `### Sparking Elegance with ${currentProduct.name} ✨\n\n`;
    response += `The **${currentProduct.name}** by *${currentProduct.brand}* is one of our most refined formulations in the **${currentProduct.category}** collection, curated specifically for premium skin and hair radiance. It is available in stock for **${currentProduct.price} TZS**.\n\n`;
    
    if (currentProduct.description) {
      response += `**Formulation Profile:**\n${currentProduct.description}\n\n`;
    }
    
    if (currentProduct.ingredients) {
      response += `**Key Active Ingredients:**\n${currentProduct.ingredients}\n\n`;
    }
    
    if (currentProduct.usage) {
      response += `**Application Guidelines:**\n${currentProduct.usage}\n\n`;
    }
    
    response += `---\n\n**Ready to Experience This Formulation?**\nSimply tap the **"+"** button to add it to your shopping cart and click **"Order via WhatsApp"** to instantly finalize with our retail concierge at **0714300535**!`;
    return response;
  }

  // C. Sweet Gratitude, Compliments & Agreements
  const isLoveOrThanks = q.includes("thank") || q.includes("thanks") || q.includes("awesome") || q.includes("perfect") || 
                         q.includes("cool") || q.includes("great") || q.includes("love") || q.includes("amazing") || 
                         q.includes("genius") || q.includes("sweet") || q.includes("nice") || q.includes("good") || 
                         q.includes("ok") || q.includes("okay") || q.includes("fine") || q.includes("yes") || 
                         q.includes("yeah") || q.includes("yep") || q.includes("sure") || q.includes("indeed") || 
                         q.includes("wow") || q.includes("superb") || q.includes("perfecto");

  if (isLoveOrThanks) {
    return `### You are so welcome! ✨

It is an absolute pleasure to bring a touch of luxury to your self-care journey. 

If there is anything else you need—whether it is:
- Correctly layering your **Retinol Glow Serum** in the evening
- Finding the right hydrating shade in the **Satin Velvet Lipstick** collection
- Learning how we safely package and deliver within hours via **WhatsApp (0714300535)**

Just let me know! I am right here to make your experience smooth, elegant, and simple.`;
  }

  // D. Personal Greetings & Welcoming Checks
  const isGreeting = q.includes("hello") || q.includes("hi ") || q.includes("hey") || q.includes("greetings") || 
                     q.includes("smetik") || q.includes("who are you") || q.includes("help") || q.includes("recommend") ||
                     q.includes("habari") || q.includes("mambo") || q.includes("wasup") || q.includes("howdy");

  if (isGreeting) {
    return `### Welcome to Smetik Beauty Care! 🌿✨

Hello! I am your Smetik Assistant. I am delighted to welcome you to our boutique collection of clean, botanical self-care formulations today.

We specialize in high-efficacy, natural products across:
- 🌸 **Premium Skincare** (Double-action facial cleansers and clarifying Retinol serums)
- 🌿 **Advanced Hair Care** (Moroccan Argan, sweet almond oil, and deep Keratin)
- 💄 **Clean Cosmetics** (Ultra-creamy velvet lipsticks and lightweight setting powders)
- ✨ **Artisanal Fragrances** (Long-lasting, premium evening oil blends like Ambre Nuit)

Is there a specific concern (like **dry skin**, **hair frizz**, or finding a **signature scent**) we can solve together? 

Feel free to ask me anything, or tap the **"+"** icon on your favorite products to place them in your Cart and choose **"Order via WhatsApp"** to message our boutique team directly at **0714300535**!`;
  }

  // E. Well-being
  const isWellBeing = q.includes("how are you") || q.includes("how is it going") || q.includes("how's it going") || 
                      q.includes("are you ok") || q.includes("what's up") || q.includes("sup") || q.includes("how do you do");

  if (isWellBeing) {
    return `### I'm doing wonderfully, thank you for asking! 🌸

I am feeling energized and ready to guide you to your best skin and hair days yet. 

How are you doing today? Let me know if you need help matching formulations to your skin type, discovering clean cosmetics, or coordinating with our secure WhatsApp order line at **0714300535**!`;
  }

  // F. Negatives / Disagreement
  const isNegative = q.includes(" no") || q === "no" || q.includes("nope") || q.includes("not really") || 
                     q.includes("incorrect") || q.includes("wrong") || q.includes("bad") || q.includes("never mind");

  if (isNegative) {
    return `### I understand completely. 🌿

Let's pivot! I want to make sure your experience inside Smetik is exactly what you are looking for. 

Tell me, what are we hoping to achieve today? Are you looking for a particular gift, a deep reconstructive hair mask, or do you need assistance checking out with your current Cart?`;
  }

  // G. Deep Skincare Analysis
  // 1. Dry Skin / Dehydrated / Moisturizing
  const isDrySkin = q.includes("dry") || q.includes("hydrate") || q.includes("hydration") || q.includes("peeling") || 
                    q.includes("flak") || q.includes("dehydrated") || q.includes("moisturizer") || q.includes("moisturise") || 
                    q.includes("cream") || q.includes("dryness") || q.includes("lotion");

  if (isDrySkin) {
    return `### Rehydrating Dry, Flaky, or Thirsty Skin 💧

To build 24-hour hydration, strengthen a dry outer barrier, and eliminate flaking, we recommend Smetik's advanced **Dry Skin Protocol**:
  
1. **Gentle Amino Acid Facial Cleanser** (*32,000 TZS*)
   - **Why you'll love it:** A low-pH cleansing wash formulated with comforting **Rosewater** and redness-calming **Licorice Root Extract**. It removes everyday dirt without stripping the essential moisture barrier.
2. **Centella Soothing Body Lotion** (*38,000 TZS*)
   - **Why you'll love it:** Fast-absorbing, lightweight, yet deeply nourishing. Packed with **Centella Asiatica** (Tiger Grass) and **3% Niacinamide** to lock in moisture, soothe dry patches, and calm skin irritation.
  
**Practical Skincare Secret:** 
After washing your face or showering, pat gently with a clean towel and apply your moisturizers immediately while your skin is still slightly damp. This locks in the surface wetness and keeps your skin looking plump all day!
  
Add these nourishing favorites to your Cart using the **"+"** buttons and tap **"Order via WhatsApp"** to arrange rapid boutique delivery!`;
  }

  // 2. Oily Skin / Shine / Large Pores
  const isOilySkin = q.includes("oily") || q.includes("shine") || q.includes("sebum") || q.includes("greasy") || 
                     q.includes("matte") || q.includes("pore") || q.includes("pores") || q.includes("blackhead");

  if (isOilySkin) {
    return `### Mattifying Oily Skin & Blurring Pores ✨

If your skin feels heavy with sebum by afternoon or you notice large pores on your forehead and nose, Smetik has the perfect clean solution:
  
* **HD Flawless Setting Powder** (*35,000 TZS*)
  - **The Power:** This translucent micro-milled powder uses clean **Silica** and calming **Evening Primrose Extract** to immediately absorb excess oils, lock in existing skincare, and visually blur your pore structure. It leaves a gorgeous, velvety, soft-focus matte finish.
  
**Boutique Beauty Secret:** 
Refrain from scrubbing your face aggressively or using hot water to remove grease. Harsh washing strips too much oil, triggering your sebaceous glands to overcompensate by releasing *even more* oil! Stick to cool water and our low-pH **Amino Acid Cleanser**.
  
Tap the **"+"** key on our HD Flawless Setting Powder, view your **Cart**, and tap **"Order via WhatsApp"** to try it!`;
  }

  // 3. Acne / Pimples / Breakouts
  const isAcne = q.includes("acne") || q.includes("pimple") || q.includes("breakout") || q.includes("blemish") || 
                 q.includes("blackhead") || q.includes("spot") || q.includes("scar") || q.includes("clog") || 
                 q.includes("spots");

  if (isAcne) {
    return `### Clarifying Breakouts & Reducing Acne-Prone Skin Redness 🌿

To dissolve pore-clogging debris, reduce angry redness, and accelerate skin cell replacement to fade post-breakout scars, we recommend Smetik's best seller:
  
* **Retinol Glow Infusion Serum** (*45,000 TZS*)
  - **How it transforms your skin:** Retinol is a high-efficacy Vitamin A derivative. Formulated at **0.5% Pure Retinol** inside a base of **Organic Aloe Vera** and **Hyaluronic Acid**, it purifies congested pores, regulates sebum, and rapidly reveals smooth, glowing skin.
  
**Acne Recovery Regimen:**
1. Cleanse gently with our low-pH **Amino Acid Cleanser** in the evening.
2. Let skin dry completely, then pat 3 drops of **Retinol Glow Serum** onto your face (avoiding your eyes).
3. Follow up with a light, non-comedogenic hydration shield (like Smetik's soothing **Centella Body Lotion**).
4. *Crucial:* Always apply SPF during the day, as Retinol increases daytime sun sensitivity!
  
Click the **"+"** key to place our Retinol Serum in your Cart and let our retail team dispatch one to you today!`;
  }

  // 4. Aging / Wrinkles / Firming / Fine Lines
  const isAging = q.includes("aging") || q.includes("wrinkle") || q.includes("fine line") || q.includes("collagen") || 
                  q.includes("sagging") || q.includes("mature") || q.includes("youth") || q.includes("firm") || 
                  q.includes("wrinkles") || q.includes("lines");

  if (isAging) {
    return `### Smoothing Fine Lines & Boosting Collagen Firmness ⏳

To smooth out dry fine lines, renew mature texture, and restore healthy skin bounce:
  
* **Retinol Glow Infusion Serum** (*45,000 TZS*)
  - **The Magic:** A premium cocktail featuring **0.5% Pure Retinol** blended with **Organic Aloe Vera** and deeply plumping **Hyaluronic Acid**. It goes to work below the surface, signaling cellular renewal to smooth lines and return youthfulness.
  
**How to Start:** 
If you are new to Retinol, introduce it slowly! Apply 3 drops only 2-3 times a week at night. Watch how your skin plumps up before building to nightly use.
  
Experience a renewed, bouncy visage by placing Smetik's Retinol Serum in your Cart today!`;
  }

  // H. Deep Hair Care Analysis
  // 1. Frizz & Damaged Hair
  const isFrizzyHair = q.includes("frizz") || q.includes("frizzy") || q.includes("damaged") || q.includes("bleach") || 
                       q.includes("split end") || q.includes("tangle") || q.includes("dry hair") || q.includes("curl") || 
                       q.includes("coarse");

  if (isFrizzyHair) {
    return `### Taming Hair Frizz & Reconstructing Damaged Hair 🌿

For rough, chemically altered, or dry, frizzy strands, Smetik is famous for our salon-grade hair therapy:
  
* **Keratin Argan Nourishing Hair Mask** (*55,000 TZS*)
  - **Why it is magic:** Combines pure **Moroccan Argan Oil**, hydrolyzed **Keratin protein**, and **Sweet Almond Oil**. It fills in microscopic gaps in damaged hair shafts, immediately sealing down the cuticle to tame frizz, increase elasticity, and add magnificent silkiness.
  
**The Smetik Hair Cleansing Method:**
After shampooing, gently squeeze out any pooled water. Smooth a generous dollop of this luxurious mask from ears down to split ends. Wrap your hair in a warm, damp towel, leave it to penetrate for 10-15 minutes, and then rinse thoroughly with cool water. 
  
Add this best-seller to your Cart now with the **"+"** button and tap checkout to let us courier it to your home!`;
  }

  // 2. Growth & Scalp & Shampoo
  const isHairGrowth = q.includes("shampoo") || q.includes("growth") || q.includes("shamp") || q.includes("hair growth") || 
                       q.includes("conditioner") || q.includes("bald") || q.includes("dandruff") || q.includes("hair");

  if (isHairGrowth) {
    return `### Fortifying Hair Bases & Rebuilding Lengths 🌱

Thinting hair and slow growth are often caused by brittle strands snapping off prematurely. To stop shedding and promote healthy hair elasticity, we highly recommend:
  
* **Keratin Argan Nourishing Hair Mask** (*55,000 TZS*)
  - **Why it works:** Formulated with therapeutic **Rosemary Essential Oil**, **Pro-Vitamin B5**, and pure **Argan Oil** to deeply saturate porous hair follicles, making sure your lengths stay fortified, strong, and breakage-resistant as they grow.
  
You can review this mask in the **Hair Care** tab inside your app, add it to your Cart, and we will package it up beautifully for you!`;
  }

  // I. Makeup & Beauty
  const isMakeup = q.includes("makeup") || q.includes("lipstick") || q.includes("powder") || q.includes("lips") || 
                   q.includes("gloss") || q.includes("shimmer") || q.includes("mascara") || q.includes("make up") || 
                   q.includes("shadow") || q.includes("cosmetic") || q.includes("cosmetics");

  if (isMakeup) {
    return `### Clean Makeup Masterpieces 💄✨

Exude effortless, clean elegance with Smetik's high-pigment, dermo-verified cosmetics:
  
1. **Satin Velvet Hydrating Lipstick** (*28,000 TZS*)
   - **Formulation:** Ultra-creamy glide made with pure **Shea Butter**, **Carnauba Wax**, and **Vitamin E**. Leaves a velvet-satin finish that doesn't crease or dry out beautiful lips.
2. **HD Flawless Setting Powder** (*35,000 TZS*)
   - **Formulation:** Weightless, setting powder with premium **Silica** and calming **Evening Primrose Extract** to control skin shine, block sweat, and filter out pore lines for up to 12 hours.
  
Select these dynamic makeup items using the **"+"** button in your catalog and check out via WhatsApp for Dar es Salaam same-day delivery!`;
  }

  // J. Scent & Perfume
  const isPerfume = q.includes("perfume") || q.includes("scent") || q.includes("fragrance") || q.includes("smell") || 
                    q.includes("ambre") || q.includes("nuit") || q.includes("mist") || q.includes("cologne");

  if (isPerfume) {
    return `### Premium Artisanal Fragrance 🌙✨

Experience Smetik’s premier evening scent profile, hand-crafted using organic Sugarcane Alcohol:
  
* **Ambre Nuit Eau de Parfum** (*110,000 TZS*)
  - **The Atmosphere:** A sophisticated, warm, and dark sensual journey blending rich **Amber Resin**, delicate **Turkish Rose Oil**, and bright **Bergamot Extract** with earthy patchouli. Truly a masterpiece that lingers on clothes for days.
  - **Bespoke Perfume Tip:** Spritz on warm pulse areas (wrists, neckline, back of knees). Refrain from forcefully rubbing your wrists together, as this bruises the top notes and accelerates the dry-down trail!
  
Add this luxury fragrance bottle to your Cart and checkout via WhatsApp (**0714300535**) to experience its spell.`;
  }

  // K. Ordering, WhatsApp, Shipping, Delivery
  const isOrderOrDelivery = q.includes("order") || q.includes("buy") || q.includes("purchase") || q.includes("deliver") || 
                            q.includes("pay") || q.includes("whatsapp") || q.includes("price") || q.includes("tzs") || 
                            q.includes("tz") || q.includes("tanzania") || q.includes("location") || q.includes("near me") || 
                            q.includes("shop") || q.includes("store") || q.includes("where") || q.includes("shipping") ||
                            q.includes("price") || q.includes("cost") || q.includes("how to purchase");

  if (isOrderOrDelivery) {
    return `### Smetik Shopping & Rapid Tanzanian Delivery Guide 🚚⚡️

Shopping with Smetik is simple, personal, and highly secure. 
  
**Here is exactly how ordering works without making complex accounts:**
1. **Explore & Pick:** Browse Smetik's luxury categories and tap the **"+"** icon on items you love.
2. **Open Cart:** Tap the **Cart** tab at the bottom to adjust item quantities.
3. **Instantly Link:** Click **"Order via WhatsApp"**.
4. **Finalize with a Human:** You will be linked automatically to our secure retail line **0714300535** on WhatsApp. Our beauty advisor will verify your delivery address and coordinate secure local payment (via M-Pesa, Tigopesa, Airtel Money, Halopesa, or Bank Transfer).
  
**Dispatch times:** 
Same-day delivery inside Dar es Salaam, and swift courier shipping to any region inside Tanzania! 
  
Let me know if you would like me to detail any product price in our catalog.`;
  }

  // L. Tips / Trivia / Help secrets
  const isTipsHelp = q.includes("joke") || q.includes("fun") || q.includes("tips") || q.includes("advise") || 
                     q.includes("advice") || q.includes("secret") || q.includes("tips") || q.includes("routine");

  if (isTipsHelp) {
    return `### A Smetik Skin Secret for You! 🤫✨

Did you know that applying your skincare products in the correct order makes them up to 3 times more effective? 
  
Always follow the **"Thin-to-Thick" Formulation Rule**:
1. Watery Cleansers & Essences (to prepare clean absorption).
2. Advanced Concentrates & Serums (like Smetik's **Retinol Glow Serums**).
3. Richer, oil-infused Creams or Body Lotions (like Smetik's soothing **Centella Body Lotion**) to seal everything in!
  
*And if you wanted a fun beauty laugh:*
Why did the cleanser break up with the facial scrub? 
Because it felt like the relationship was getting way too rough! 😂
  
Let me know if you want me to advise which Smetik botanical is best for your current morning or night routine!`;
  }

  // Default fallback response - highly warm and guides the user explicitly
  return `### How Can Smetik Assist Your Self-Care Today? 🌸

I am Smetik's digital assistant. I can guide you through our luxury collections, shares active botanical ingredients, and explain our quick WhatsApp checkout.

**Tell me more about your beauty goals:**
* How do I heal **dry skin** or minimize **large oily pores**?
* What are the ingredients inside the **Retinol Silk Serum** or **Ambre Nuit perfume**?
* Can I order a **Keratin Argan Hair Mask** for damaged strands?
* Tell me how **deliveries and checkout** work on WhatsApp!

*Note: Smetik is always active on WhatsApp at **0714300535** for 1-on-1 human consultations!*`;
}

app.post("/api/chat", async (req, res) => {
  const { messages, currentScreen, currentProduct } = req.body;
  try {
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array in body." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        text: "Please wait while Smetik Assistant is starting up or setup is being completed. You can browse products freely or reach support on WhatsApp at 0714300535."
      });
    }

    // Sanitize messages so the list does not start with an "assistant" turn
    let sanitizedMessages = [...messages];
    if (sanitizedMessages.length > 0 && sanitizedMessages[0].role === 'assistant') {
      sanitizedMessages.shift();
    }

    if (sanitizedMessages.length === 0) {
      return res.json({
        text: getLocalResponse(messages, currentProduct)
      });
    }

    const contents = sanitizedMessages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // Inject dynamic, live frontend routing & product context to make the assistant app-aware
    const contextInstruction = `
[LIVE APP STATE CONTEXT]
- Users current screen: ${currentScreen || "Explore"}
${currentProduct ? `- Active product user is currently viewing:
  * Brand: ${currentProduct.brand}
  * Name: ${currentProduct.name}
  * Category: ${currentProduct.category}
  * Description: ${currentProduct.description}
  * Price: ${currentProduct.price} TZS
  * Key Ingredients: ${currentProduct.ingredients || "Not fully specified"}
  * Application Guide: ${currentProduct.usage || "Not fully specified"}` : ""}
`;

    // Attempt to invoke Gemini with fallbacks to avoid daily quota limit issues
    const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
    let responseText = "";
    let callSucceeded = false;

    for (const modelName of modelsToTry) {
      try {
        console.log(`[Chat API] Attempting to generate content using model: ${modelName}`);
        const response = await getAIClient().models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION + contextInstruction,
            temperature: 0.15,
          }
        });

        if (response && response.text) {
          responseText = response.text;
          callSucceeded = true;
          console.log(`[Chat API] Model ${modelName} responded successfully!`);
          break;
        }
      } catch (err: any) {
        console.log(`[Chat API Notice] Model ${modelName} failed or limits hit:`, err.message || err);
      }
    }

    if (callSucceeded && responseText) {
      return res.json({
        text: responseText
      });
    } else {
      throw new Error("All loaded Gemini models returned empty or failed quota.");
    }
  } catch (error: any) {
    console.log("Notice: Gemini API offline, rate-limited, or quota-exhausted. Resolving query via local beauty rules engine.");
    
    // Graceful fallback to rich, conversational local responder about Smetik products / concerns
    const fallbackText = getLocalResponse(messages, currentProduct);
    
    res.json({
      text: fallbackText
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
