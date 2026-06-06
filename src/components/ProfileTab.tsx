import React, { useState, useEffect } from 'react';
import { Settings, HelpCircle, Info, ChevronRight, Key, ArrowLeft, Sparkles, Heart, Leaf, Save, Sparkle, User, Smartphone, BadgePercent } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
// @ts-ignore
import avatarPlaceholder from '../assets/images/smetik_avatar_placeholder_1780694939503.png';

interface ProfileTabProps {
  onOpenAdmin: () => void;
  onShowNotification: (msg: string) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ onOpenAdmin, onShowNotification }) => {
  const [activeView, setActiveView] = useState<string | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');

  // BEAUTY PROFILE STATE (Local Storage synchronized)
  const [skinType, setSkinType] = useState('Oily');
  const [hairConcern, setHairConcern] = useState('Frizzy');
  const [avatarOption, setAvatarOption] = useState('Guest Shopper');

  useEffect(() => {
    const savedSkin = localStorage.getItem('smetik_skin_type');
    const savedHair = localStorage.getItem('smetik_hair_concern');
    const savedRole = localStorage.getItem('smetik_user_role');
    if (savedSkin) setSkinType(savedSkin);
    if (savedHair) setHairConcern(savedHair);
    if (savedRole) setAvatarOption(savedRole);
  }, []);

  const secretAdminCode = '1337';

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode.trim() === secretAdminCode) {
      onOpenAdmin();
      setShowAdminLogin(false);
      setAdminPasscode('');
      onShowNotification('Admin authorization successful!');
    } else {
      onShowNotification('Invalid admin passcode. Access denied.');
    }
  };

  const handleSaveProfile = () => {
    localStorage.setItem('smetik_skin_type', skinType);
    localStorage.setItem('smetik_hair_concern', hairConcern);
    localStorage.setItem('smetik_user_role', avatarOption);
    onShowNotification('Beauty Consultation Profile updated successfully! ✨');
    setActiveView(null);
  };

  const openWhatsAppConsultation = () => {
    const text = `Hello Smetik, I would like a custom beauty consultation. My skin type is *${skinType}* and my primary hair concern is *${hairConcern}*. I am seeking recommendations from Wisman Wilbard's curated formulations.`;
    window.open(`https://wa.me/255714300535?text=${encodeURIComponent(text)}`, '_blank');
  };

  // 1. DETAIL VIEW RENDERER (IN-PAGE MULTI-SCREEN SYSTEM)
  if (activeView) {
    return (
      <div id="redefined-detail-view" className="p-4 pb-20 flex flex-col h-full bg-white select-none animate-fade-in overflow-y-auto">
        <button
          onClick={() => setActiveView(null)}
          className="self-start flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-primary transition-colors py-2 px-3 border border-gray-100 rounded-xl mb-6 bg-gray-50/50 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Profile</span>
        </button>

        {/* 1A. FOUNDER'S VISION */}
        {activeView === 'founders-vision' && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#F3C5FF]/45 flex items-center justify-center text-[#845EC2]">
                <Sparkles size={22} className="animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black tracking-widest text-[#845EC2] uppercase">Visionary Founder</span>
                <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-wide leading-none">
                  Wisman Wilbard
                </h3>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 italic text-xs leading-relaxed text-gray-600 relative my-1">
              "We believe that clean, botanical beauty should never feel computerized or cold. Smetik is built on the standard of high-quality formulations paired with sincere, personalized human consultation to help you achieve your ultimate self-care confidence."
              <span className="block mt-2.5 font-bold text-primary not-italic text-[10px]">— Wisman Wilbard</span>
            </div>

            <div className="flex flex-col gap-4 text-xs text-gray-600 leading-relaxed">
              <h4 className="font-extrabold text-[#845EC2] text-xs uppercase tracking-wider">The Smetik Standard</h4>
              <p>
                Smetik was built by **Wisman Wilbard** to solve representing African beauty consumers seeking clean, organic compounds and custom-tailored cosmetic consultations. Wisman envisions a high-touch marketplace where you are guided by scientific expertise rather than rigid algorithms.
              </p>
              
              <div className="flex flex-col gap-3 mt-2">
                <div className="border border-gray-100 p-3.5 rounded-2xl bg-white shadow-soft flex gap-2.5">
                  <Leaf className="text-green-500 shrink-0 mt-0.5" size={14} />
                  <div>
                    <h5 className="font-bold text-gray-800 text-xs text-left">Clean Botanicals</h5>
                    <p className="text-[10px] text-gray-400 mt-1">Every lipstick, cream, or hair mask is dermatologically checked, pure and rich in nourishing active botanical ingredients.</p>
                  </div>
                </div>

                <div className="border border-gray-100 p-3.5 rounded-2xl bg-white shadow-soft flex gap-2.5">
                  <HelpCircle className="text-indigo-500 shrink-0 mt-0.5" size={14} />
                  <div>
                    <h5 className="font-bold text-gray-800 text-xs text-left">Custom consultations</h5>
                    <p className="text-[10px] text-gray-400 mt-1">Wisman's team of boutique consultants analyzes your personal skin mapping profile to correctly suggest morning and night formulations.</p>
                  </div>
                </div>

                <div className="border border-gray-100 p-3.5 rounded-2xl bg-white shadow-soft flex gap-2.5">
                  <WhatsAppIcon className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                  <div>
                    <h5 className="font-bold text-gray-800 text-xs text-left">Order on Demand</h5>
                    <p className="text-[10px] text-gray-400 mt-1">Avoid logins, passes, or automated ticketing. Link straight to a human for rapid local delivery across Tanzania.</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={openWhatsAppConsultation}
              className="mt-4 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-soft"
            >
              <WhatsAppIcon size={14} />
              <span>Message Wisman's Concierge</span>
            </button>
          </div>
        )}

        {/* 1B. BEAUTY PROFILE */}
        {activeView === 'beauty-profile' && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black tracking-widest text-[#845EC2] uppercase">Interactive Setup</span>
                <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-wide leading-none">
                  Your Beauty Profile
                </h3>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-normal mb-1">
              Select your individual concerns below. This customized mapping is securely saved locally and enables Smetik's AI or human team to suggest precise botanical cocktails.
            </p>

            <div className="flex flex-col gap-4">
              {/* Profile Type */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Skin Type Mapping</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Dry/Dehydrated', 'Oily/Shine-prone', 'Acne & Breakouts', 'Normal/Balanced'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSkinType(type)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                        skinType === type 
                          ? 'border-primary bg-[#F3C5FF]/10 text-primary font-bold' 
                          : 'border-gray-200 hover:bg-gray-50 text-gray-650'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair Concerns */}
              <div className="flex flex-col gap-1.5 text-left mt-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Primary Hair Care Focus</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Frizz & Dryness', 'Hair Growth/Loss', 'Damage/Color Care', 'Nourishment & Silk'].map((concern) => (
                    <button
                      key={concern}
                      onClick={() => setHairConcern(concern)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                        hairConcern === concern 
                          ? 'border-primary bg-[#F3C5FF]/10 text-primary font-bold' 
                          : 'border-gray-200 hover:bg-gray-50 text-gray-650'
                      }`}
                    >
                      {concern}
                    </button>
                  ))}
                </div>
              </div>

              {/* User Experience Level */}
              <div className="flex flex-col gap-1.5 text-left mt-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Shopper Tier Profile</label>
                <select
                  value={avatarOption}
                  onChange={(e) => setAvatarOption(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-xs text-gray-700 font-semibold py-2.5 px-3 rounded-xl focus:outline-none focus:border-primary"
                >
                  <option value="Guest Shopper">🌸 Guest Shopper</option>
                  <option value="Skincare Enthusiast">✨ Skincare Enthusiast</option>
                  <option value="Elite Beauty Collector">👑 Elite Beauty Collector</option>
                  <option value="Smetik Loyalty VIP">💎 Smetik Loyalty VIP</option>
                </select>
              </div>

              <div className="flex gap-2.5 mt-5">
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 py-3 bg-primary hover:bg-dark-accent text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-transform active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer shadow-soft border-0"
                  style={{ backgroundColor: '#845EC2' }}
                >
                  <Save size={13} />
                  <span>Save Profile</span>
                </button>

                <button
                  onClick={openWhatsAppConsultation}
                  className="flex-1 py-3 border border-emerald-400 hover:bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-white"
                >
                  <WhatsAppIcon size={13} />
                  <span>Consult Expert</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 1C. INGREDIENTS PLEDGE */}
        {activeView === 'ingredients-pledge' && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Leaf size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black tracking-widest text-[#845EC2] uppercase">Formulations Pledge</span>
                <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-wide leading-none">
                  Pure Clean Actives
                </h3>
              </div>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed text-left">
              Smetik formulations prioritize clean, active ingredients that maintain and reinforce your natural ecosystem. Under **Wisman Wilbard’s guidelines**, we reject harsh parabens, toxic sulfates, and micro-particles.
            </p>

            <div className="flex flex-col gap-3">
              {[
                { name: 'Centella Asiatica', benefit: 'Known as Tiger Grass, is a powerful antioxidant that accelerates skin soothing and reduces red spots.' },
                { name: '0.5% Pure Retinol', benefit: 'A high-impact Vitamin A derivative curated inside comforting Aloe Vera to refit skin pores safely at night.' },
                { name: 'Organic Argan & Keratin', benefit: 'Sourced from Moroccan orchards to drench weak hair in lipids and seal frayed frizzy ends.' },
                { name: 'Micro-milled Silica & Primrose', benefit: 'Gives our cosmetics a weightless, pore-blurring matte setting finish without clogging oils.' }
              ].map((ing) => (
                <div key={ing.name} className="border border-gray-150 p-3 rounded-2xl bg-[#FAFAFC] text-left">
                  <span className="text-xs font-extrabold text-gray-800 flex items-center gap-1.5">
                    <Sparkle size={10} className="text-primary mt-0.5 animate-spin-slow" />
                    {ing.name}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1 leading-normal pl-3">{ing.benefit}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 1D. FAQ / SUPPORT */}
        {activeView === 'faq-support' && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                <HelpCircle size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black tracking-widest text-[#845EC2] uppercase">Help Desk</span>
                <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-wide leading-none">
                  FAQ & Support
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-left">
              {[
                { q: "How do I place an order?", a: "Browse our collections, add desired products to your Cart by tapping '+', then click 'Order via WhatsApp'. This instantly connects you to our retail team to confirm delivery!" },
                { q: "Is there local delivery in Tanzania?", a: "Absolutely! We support same-day dispatch and physical courier shipping to any region inside Tanzania (Arusha, Mwanza, Dodoma, Zanzibar, etc.)." },
                { q: "Will I get expert consultative skincare advice?", a: "Yes. Smetik is centered on personalized consulting. Wisman Wilbard's active beauticians will consult with you on WhatsApp to build your morning/evening skin regimen." }
              ].map((item, idx) => (
                <div key={idx} className="border border-gray-100 p-4 rounded-2xl bg-white shadow-soft">
                  <span className="text-xs font-extrabold text-gray-700 leading-tight block">
                    Q: {item.q}
                  </span>
                  <span className="text-[10px] text-gray-400 leading-normal block mt-1.5">
                    {item.a}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 1E. HOW TO ORDER */}
        {activeView === 'how-to-order' && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Smartphone size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black tracking-widest text-[#845EC2] uppercase">Seamless Booking</span>
                <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-wide leading-none">
                  How To Order
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-left">
              <p className="text-xs text-gray-400 leading-normal pl-1">
                Ordering Smetik's formulations is simple, ultra-fast, and entirely password-free. Follow these direct steps:
              </p>

              {[
                { s: "1", t: "Catalog Selection", d: "Explore categorized formulations and add items to your personal Cart." },
                { s: "2", t: "Click WhatsApp Booking", d: "Review quantity, adjust settings in your cart, and click 'Order via WhatsApp'." },
                { s: "3", t: "Delivery & Payment Confirmation", d: "Our team answers, logs your Tanzanian regional address (M-Pesa, Tigopesa, Halopesa accepted), and ships instantly!" }
              ].map((step) => (
                <div key={step.s} className="flex gap-3 items-start border border-gray-100 p-3.5 rounded-2xl bg-white shadow-soft">
                  <div className="w-5 h-5 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center font-mono select-none shrink-0" style={{ color: '#845EC2' }}>
                    {step.s}
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-800 text-xs">{step.t}</h5>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-normal">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. ADMIN LOGIN VIEW
  if (showAdminLogin) {
    return (
      <div id="admin-login-view" className="p-6 flex flex-col h-full bg-white animate-fade-in">
        <button
          onClick={() => setShowAdminLogin(false)}
          className="self-start w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50 active:scale-95 transition-all text-gray-600 cursor-pointer mb-6"
        >
          <ArrowLeft size={16} />
        </button>

        <div className="max-w-xs mx-auto w-full flex flex-col items-center text-center py-6">
          <div className="w-14 h-14 rounded-full bg-[#F3C5FF]/20 flex items-center justify-center text-primary mb-4">
            <Key size={22} />
          </div>
          <h3 className="text-sm font-extrabold text-gray-800 uppercase tracking-widest mb-1">
            Administrative Access
          </h3>
          <p className="text-[10px] text-gray-400 leading-normal max-w-[220px] mb-6">
            Enter secret 4-digit code to access administrative inventory lists (Try <strong className="text-primary">1337</strong>).
          </p>

          <form onSubmit={handleAdminSubmit} className="w-full flex flex-col gap-4">
            <input
              type="password"
              pattern="\d*"
              maxLength={6}
              placeholder="••••"
              value={adminPasscode}
              onChange={(e) => setAdminPasscode(e.target.value)}
              className="w-full text-center border border-gray-200 rounded-xl py-2.5 px-3 text-sm font-bold tracking-widest focus:outline-none focus:border-primary text-gray-700 bg-gray-50"
              required
              autoFocus
            />

            <button
              type="submit"
              className="w-full py-2.5 bg-primary hover:bg-dark-accent text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm transition-transform active:scale-98 cursor-pointer"
              style={{ backgroundColor: '#845EC2' }}
            >
              Authorize
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 3. MAIN PROFILE VIEW
  return (
    <div id="profile-redefined-view" className="p-4 pb-20 flex flex-col gap-6 h-full overflow-y-auto bg-white animate-fade-in relative">
      {/* 1. Profile Header */}
      <div className="flex flex-col items-center text-center py-4 gap-3">
        <div 
          className="w-16 h-16 rounded-full overflow-hidden shadow-sm border border-primary/20 flex items-center justify-center select-none animate-fade-in bg-[#F3C5FF]/20"
        >
          <img 
            src={avatarPlaceholder} 
            alt="Guest User Profile" 
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col">
          <h2 className="text-base font-extrabold text-gray-800 tracking-tight leading-none">
            {skinType} Mapping Guest
          </h2>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1.5 bg-[#F3C5FF]/15 text-[#845EC2] px-2.5 py-1 rounded-full select-none leading-none">
            {avatarOption}
          </span>
        </div>
      </div>

      {/* 2. Interactive Settings */}
      <div className="flex flex-col gap-2">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1.5 flex items-center gap-1 leading-none">
          <Settings size={10} className="text-primary mt-0.5" />
          Individual Preferences
        </span>
        <div className="border border-gray-100 rounded-2xl divide-y divide-gray-50 overflow-hidden shadow-soft">
          {[
            { name: 'Beauty Profile', sub: `Skin Type: ${skinType} | Hair Care focus: ${hairConcern}`, view: 'beauty-profile' },
          ].map((item) => (
            <div
              key={item.name}
              onClick={() => setActiveView(item.view)}
              className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-secondary-surface transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-700">{item.name}</span>
                <span className="text-[9px] text-gray-400 leading-none mt-0.5">{item.sub}</span>
              </div>
              <ChevronRight size={13} className="text-gray-350" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. About Smetik (Founder Focused) */}
      <div className="flex flex-col gap-2">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1.5 flex items-center gap-1 leading-none">
          <Info size={10} className="text-primary mt-0.5" />
          About Smetik Beauty
        </span>
        <div className="border border-gray-100 rounded-2xl divide-y divide-gray-50 overflow-hidden shadow-soft">
          {[
            { name: "Founder's Vision", sub: 'Wisman Wilbard’s story, standards & philosophy', view: 'founders-vision' },
            { name: 'Pure Clean Actives Pledge', sub: 'Understand our botanical ingredient values', view: 'ingredients-pledge' },
            { name: 'Contact WhatsApp Line', sub: 'Order helper, support, & boutique care direct: 0714300535' }
          ].map((item) => (
            <div
              key={item.name}
              onClick={() => {
                if (item.name === 'Contact WhatsApp Line') {
                  window.open(`https://wa.me/255714300535?text=Hello%20Smetik%20Support`, '_blank');
                } else if (item.view) {
                  setActiveView(item.view);
                }
              }}
              className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-secondary-surface transition-colors/all"
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-700">{item.name}</span>
                <span className="text-[9px] text-gray-400 leading-none mt-0.5 block leading-normal">{item.sub}</span>
              </div>
              {item.name === 'Contact WhatsApp Line' ? (
                <WhatsAppIcon size={14} className="text-[#845EC2] shrink-0 ml-1" />
              ) : (
                <ChevronRight size={13} className="text-gray-300 shrink-0 ml-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Customer Support Helper */}
      <div className="flex flex-col gap-2">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pl-1.5 flex items-center gap-1 leading-none">
          <HelpCircle size={10} className="text-primary mt-0.5" />
          Shopping Guidance FAQ
        </span>
        <div className="border border-gray-100 rounded-2xl divide-y divide-gray-50 overflow-hidden shadow-soft">
          {[
            { name: 'FAQ & Support Hub', sub: 'Common questions on orders or delivery', view: 'faq-support' },
            { name: 'How to Order Step-by-Step', sub: 'Simple secure booking via WhatsApp', view: 'how-to-order' }
          ].map((item) => (
            <div
              key={item.name}
              onClick={() => item.view && setActiveView(item.view)}
              className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-secondary-surface transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-700">{item.name}</span>
                <span className="text-[9px] text-gray-400 leading-none mt-0.5">{item.sub}</span>
              </div>
              <ChevronRight size={13} className="text-gray-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Hidden Admin panel gateway */}
      <div className="mt-2 border border-dashed border-gray-200 rounded-3xl p-3 flex items-center justify-between bg-[#FAFAFC] hover:bg-[#F3C5FF]/5 transition-colors cursor-pointer select-none"
           onClick={() => {
             setShowAdminLogin(true);
             setAdminPasscode('');
           }}>
        <div className="flex items-center gap-2">
          <Key size={13} className="text-gray-400" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-600">Admin Gateway</span>
            <span className="text-[9px] text-gray-400">Inventory and store catalog controller</span>
          </div>
        </div>
        <ChevronRight size={13} className="text-gray-400" />
      </div>

      <div className="text-center text-[9px] text-gray-300 font-mono py-2 select-none">
        SMETIK Platform. v2.1.0 • Designed for Wisman Wilbard
      </div>
    </div>
  );
};
