"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Scissors, Sparkles, Coffee, Utensils, BedDouble, Home, Pill,
  Dumbbell, Shirt, Smartphone, ShoppingCart, WashingMachine,
  Star, MapPin, Phone, MessageCircle, Navigation, Heart, Search,
  ArrowLeft, Clock, BadgeCheck, ChevronRight, Plus, Check, X,
  Upload, Building2, Crosshair, Share2, Sun, Moon, Map as MapIcon,
  List, SlidersHorizontal, Flame, TrendingUp, Clock3, Zap, Tag,
  ChevronLeft,
} from "lucide-react";
import {
  BUSINESSES, CATEGORIES, USER_LOCATION, distanceKm, formatDistance,
  walkingTime, DEALS, getTrending, isNewThisWeek, APP_STATS,
  type Business, type Category, type Review,
} from "@/lib/businesses";
import { MiniMap } from "@/components/mini-map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type View =
  | { name: "home" }
  | { name: "category"; category: Category | "all" }
  | { name: "detail"; id: string }
  | { name: "register" }
  | { name: "favorites" };

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  scissors: Scissors,
  sparkles: Sparkles,
  coffee: Coffee,
  utensils: Utensils,
  bed: BedDouble,
  home: Home,
  pill: Pill,
  dumbbell: Dumbbell,
  shirt: Shirt,
  smartphone: Smartphone,
  "shopping-cart": ShoppingCart,
  "washing-machine": WashingMachine,
};

const HERO_BG = "https://images.unsplash.com/photo-1580303362024-cb692356c84d?w=1600&q=80";

// localStorage helpers — use lazy initializer to read once on mount without cascading renders
function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [val, setVal] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw) as T;
    } catch { /* ignore */ }
    return initial;
  });
  const set = (v: T) => {
    setVal(v);
    try { window.localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignore */ }
  };
  return [val, set];
}

export default function AkebabiApp() {
  const [view, setView] = useState<View>({ name: "home" });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useLocalStorage<boolean>("akebabi_dark", false);
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage<string[]>("akebabi_recent", []);
  const [welcomed, setWelcomed] = useLocalStorage<boolean>("akebabi_welcomed", false);
  const [reviewMap, setReviewMap] = useState<Record<string, Review[]>>({});
  const { toast } = useToast();

  // Apply dark mode class
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", darkMode);
    }
  }, [darkMode]);

  // Scroll to top on view change
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [view]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast({ title: "Removed from favorites" });
      } else {
        next.add(id);
        toast({ title: "Added to favorites", description: "Tap the heart icon to view favorites." });
      }
      return next;
    });
  };

  const markViewed = (id: string) => {
    setRecentlyViewed((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, 8);
      return next;
    });
  };

  const goToDetail = (id: string) => {
    markViewed(id);
    setView({ name: "detail", id });
  };

  const addReview = (businessId: string, review: Review) => {
    setReviewMap((prev) => ({
      ...prev,
      [businessId]: [review, ...(prev[businessId] ?? [])],
    }));
  };

  // Filter businesses by search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return BUSINESSES.filter((b) => {
      const catLabel = CATEGORIES.find((c) => c.id === b.category)?.label.toLowerCase() ?? "";
      return (
        b.name.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.subCity.toLowerCase().includes(q) ||
        b.area.toLowerCase().includes(q) ||
        catLabel.includes(q)
      );
    });
  }, [searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        onHome={() => setView({ name: "home" })}
        onFavorites={() => setView({ name: "favorites" })}
        favoritesCount={favorites.size}
        searchQuery={searchQuery}
        onSearch={(q) => {
          setSearchQuery(q);
          if (q.trim() && view.name !== "category") {
            setView({ name: "category", category: "all" });
          }
        }}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(!darkMode)}
      />

      <main className="flex-1 pb-20 md:pb-12">
        {view.name === "home" && (
          <HomeView
            onCategory={(c) => setView({ name: "category", category: c })}
            onBusinessClick={goToDetail}
            onRegister={() => setView({ name: "register" })}
            searchResults={searchResults}
            searchQuery={searchQuery}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            recentlyViewed={recentlyViewed}
          />
        )}

        {view.name === "category" && (
          <CategoryView
            category={view.category}
            onBack={() => setView({ name: "home" })}
            onBusinessClick={goToDetail}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            onCategoryChange={(c) => setView({ name: "category", category: c })}
          />
        )}

        {view.name === "detail" && (
          <DetailView
            business={BUSINESSES.find((b) => b.id === view.id)!}
            extraReviews={reviewMap[view.id] ?? []}
            onAddReview={(r) => addReview(view.id, r)}
            onBack={() => setView({ name: "category", category: "all" })}
            isFavorite={favorites.has(view.id)}
            onToggleFavorite={() => toggleFavorite(view.id)}
          />
        )}

        {view.name === "register" && (
          <RegisterView onBack={() => setView({ name: "home" })} />
        )}

        {view.name === "favorites" && (
          <FavoritesView
            businesses={BUSINESSES.filter((b) => favorites.has(b.id))}
            onBack={() => setView({ name: "home" })}
            onBusinessClick={goToDetail}
            onExploreMore={() => setView({ name: "home" })}
          />
        )}
      </main>

      {/* Mobile bottom nav */}
      <BottomNav
        view={view}
        onHome={() => setView({ name: "home" })}
        onSearch={() => setView({ name: "category", category: "all" })}
        onRegister={() => setView({ name: "register" })}
        onFavorites={() => setView({ name: "favorites" })}
        favoritesCount={favorites.size}
      />

      {/* Welcome onboarding modal (first visit only) */}
      {!welcomed && (
        <WelcomeModal onDone={() => setWelcomed(true)} />
      )}
    </div>
  );
}

// =================================================================
// Header
// =================================================================
function Header({
  onHome, onFavorites, favoritesCount, searchQuery, onSearch, darkMode, onToggleDark,
}: {
  onHome: () => void;
  onFavorites: () => void;
  favoritesCount: number;
  searchQuery: string;
  onSearch: (q: string) => void;
  darkMode: boolean;
  onToggleDark: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 sm:gap-3">
        <button onClick={onHome} className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <MapPin className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-serif font-black text-lg text-foreground group-hover:text-primary transition-colors">
              Akebabi
            </span>
            <span className="text-[10px] text-muted-foreground font-medium tracking-wide">
              አካባቢ · Addis Ababa
            </span>
          </div>
        </button>

        <div className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9 pr-3 h-10 bg-card border-border focus-visible:border-primary"
            />
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleDark}
          className="text-muted-foreground hover:text-primary flex-shrink-0"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onFavorites}
          className="relative text-muted-foreground hover:text-primary flex-shrink-0"
          aria-label="Favorites"
        >
          <Heart className="w-5 h-5" />
          {favoritesCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
              {favoritesCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}

// =================================================================
// Home View
// =================================================================
function HomeView({
  onCategory, onBusinessClick, onRegister, searchResults, searchQuery,
  favorites, onToggleFavorite, recentlyViewed,
}: {
  onCategory: (c: Category | "all") => void;
  onBusinessClick: (id: string) => void;
  onRegister: () => void;
  searchResults: Business[];
  searchQuery: string;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  recentlyViewed: string[];
}) {
  const featured = BUSINESSES.filter((b) => b.featured);
  const nearYou = [...BUSINESSES]
    .map((b) => ({
      b,
      d: distanceKm(USER_LOCATION.lat, USER_LOCATION.lng, b.lat, b.lng),
    }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 8);
  const trending = getTrending(5);
  const dealsWithBiz = DEALS.map((d) => ({
    deal: d,
    business: BUSINESSES.find((b) => b.id === d.businessId)!,
  })).filter((x) => x.business);
  const recentBusinesses = recentlyViewed
    .map((id) => BUSINESSES.find((b) => b.id === id))
    .filter((b): b is Business => b !== undefined)
    .slice(0, 6);

  // Show search results when query is active
  if (searchQuery.trim() && searchResults.length > 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-4">
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">
          {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for &quot;{searchQuery}&quot;
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {searchResults.map((b) => (
            <BusinessCard
              key={b.id}
              business={b}
              onClick={() => onBusinessClick(b.id)}
              isFavorite={favorites.has(b.id)}
              onToggleFavorite={() => onToggleFavorite(b.id)}
            />
          ))}
        </div>
      </div>
    );
  }
  if (searchQuery.trim() && searchResults.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
          <Search className="w-7 h-7 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No results for &quot;{searchQuery}&quot;</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Try a different keyword, or browse by category below.
        </p>
        <Button onClick={() => onCategory("all")} variant="outline">
          Browse all businesses
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-6">
      {/* Hero with background image */}
      <section className="relative rounded-xl overflow-hidden border border-border">
        <div className="absolute inset-0">
          <img
            src={HERO_BG}
            alt="Addis Ababa skyline"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/60 to-accent/40" />
        </div>
        <div className="relative p-5 sm:p-6 text-primary-foreground">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-medium mb-2 opacity-90">
                <Crosshair className="w-3 h-3" />
                <span>BOLE · NEAR AFRICA JUNCTION</span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-black leading-tight drop-shadow-sm">
                Find the best near you.
              </h1>
              <p className="text-sm opacity-90 mt-1">
                አቅራቢያዎ ላይ የሚገኙ ምርጥ ንግዶችን ይፈልጉ።
              </p>
            </div>
            <Button
              onClick={onRegister}
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md"
            >
              <Plus className="w-4 h-4 mr-1" /> List your business
            </Button>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 sm:gap-6 mt-4 pt-4 border-t border-white/20">
            <Stat label="Businesses" value={APP_STATS.businesses} />
            <Stat label="Sub-cities" value={APP_STATS.subCities} />
            <Stat label="Categories" value={APP_STATS.categories} />
            <Stat label="Reviews" value={`${(APP_STATS.totalReviews / 1000).toFixed(1)}k+`} />
          </div>
        </div>
      </section>

      {/* Hot Deals */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground tracking-wide flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-primary" />
            HOT DEALS THIS WEEK
          </h2>
          <span className="text-xs text-muted-foreground">{dealsWithBiz.length} active</span>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
          {dealsWithBiz.map(({ deal, business }) => (
            <DealCard
              key={deal.businessId}
              deal={deal}
              business={business}
              onClick={() => onBusinessClick(business.id)}
            />
          ))}
        </div>
      </section>

      {/* Categories grid */}
      <section>
        <h2 className="text-sm font-bold text-foreground mb-3 tracking-wide">CATEGORIES</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.icon] ?? Sparkles;
            const count = BUSINESSES.filter((b) => b.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => onCategory(cat.id)}
                className="group flex flex-col items-center justify-center p-3 rounded-xl bg-card border border-border hover:border-primary hover:shadow-sm hover:-translate-y-0.5 transition-all aspect-square"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110 flex items-center justify-center mb-1.5 transition-all">
                  <Icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <span className="text-xs font-semibold text-foreground">{cat.label}</span>
                <span className="text-[10px] text-muted-foreground">{count} listed</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured strip */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground tracking-wide flex items-center gap-1.5">
            <BadgeCheck className="w-4 h-4 text-accent" />
            FEATURED THIS WEEK
          </h2>
          <button
            onClick={() => onCategory("all")}
            className="text-xs font-medium text-primary hover:underline flex items-center"
          >
            See all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
          {featured.map((b) => (
            <FeaturedCard key={b.id} business={b} onClick={() => onBusinessClick(b.id)} />
          ))}
        </div>
      </section>

      {/* Trending */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground tracking-wide flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-primary" />
            TRENDING NOW
          </h2>
          <span className="text-xs text-muted-foreground">Based on reviews &amp; ratings</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {trending.slice(0, 4).map((b, i) => (
            <TrendingCard
              key={b.id}
              business={b}
              rank={i + 1}
              onClick={() => onBusinessClick(b.id)}
              isFavorite={favorites.has(b.id)}
              onToggleFavorite={() => onToggleFavorite(b.id)}
            />
          ))}
        </div>
      </section>

      {/* Near you */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground tracking-wide flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-primary" />
            NEAR YOU
          </h2>
          <button
            onClick={() => onCategory("all")}
            className="text-xs font-medium text-primary hover:underline flex items-center"
          >
            View map <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {nearYou.map(({ b, d }) => (
            <BusinessCard
              key={b.id}
              business={b}
              distance={d}
              onClick={() => onBusinessClick(b.id)}
              isFavorite={favorites.has(b.id)}
              onToggleFavorite={() => onToggleFavorite(b.id)}
            />
          ))}
        </div>
      </section>

      {/* Recently viewed */}
      {recentBusinesses.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground tracking-wide flex items-center gap-1.5">
              <Clock3 className="w-4 h-4 text-primary" />
              RECENTLY VIEWED
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
            {recentBusinesses.map((b) => (
              <button
                key={b.id}
                onClick={() => onBusinessClick(b.id)}
                className="flex-shrink-0 w-32 text-left group"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-1.5">
                  <img
                    src={b.photos[0]}
                    alt={b.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="text-xs font-semibold line-clamp-1">{b.name}</h3>
                <p className="text-[10px] text-muted-foreground line-clamp-1">{b.subCity}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* List-your-business CTA */}
      <section className="relative rounded-xl border border-dashed border-border bg-gradient-to-br from-card to-background p-5 sm:p-6 text-center overflow-hidden">
        <Building2 className="w-10 h-10 mx-auto text-primary mb-2" />
        <h3 className="font-serif text-lg font-bold mb-1">Own a business in Addis?</h3>
        <p className="text-sm text-muted-foreground mb-3 max-w-md mx-auto">
          List it free in 10 minutes. Get discovered by customers near you.
        </p>
        <Button onClick={onRegister} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-1" /> List your business
        </Button>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="font-serif text-xl sm:text-2xl font-black">{value}</div>
      <div className="text-[10px] uppercase tracking-wide opacity-80">{label}</div>
    </div>
  );
}

// =================================================================
// Deal card
// =================================================================
function DealCard({
  deal, business, onClick,
}: {
  deal: { title: string; description: string; discount: string; validUntil: string; validUntilDays: number };
  business: Business;
  onClick: () => void;
}) {
  const urgent = deal.validUntilDays <= 3;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
      className="flex-shrink-0 w-64 text-left rounded-xl overflow-hidden border border-border bg-card hover:shadow-md transition-shadow group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative h-24 bg-muted">
        <img src={business.photos[0]} alt={business.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-2 left-2">
          <Badge className="bg-primary text-primary-foreground hover:bg-primary gap-0.5">
            <Tag className="w-3 h-3" /> {deal.discount}
          </Badge>
        </div>
        <div className="absolute bottom-2 left-2 right-2">
          <p className="text-xs font-bold text-white line-clamp-1 drop-shadow">{business.name}</p>
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-sm text-foreground line-clamp-1">{deal.title}</h4>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{deal.description}</p>
        <div className={`text-[10px] font-semibold mt-2 flex items-center gap-0.5 ${urgent ? "text-primary" : "text-muted-foreground"}`}>
          {urgent && <Zap className="w-3 h-3 fill-current" />}
          {deal.validUntil}
        </div>
      </div>
    </div>
  );
}

// =================================================================
// Featured horizontal card
// =================================================================
function FeaturedCard({ business, onClick }: { business: Business; onClick: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
      className="flex-shrink-0 w-64 text-left rounded-xl overflow-hidden border border-border bg-card hover:shadow-md transition-shadow group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative h-32 bg-muted">
        <img src={business.photos[0]} alt={business.name} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2">
          <Badge className="bg-accent text-accent-foreground hover:bg-accent gap-1">
            <BadgeCheck className="w-3 h-3" /> FEATURED
          </Badge>
        </div>
        {isNewThisWeek(business.id) && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-primary text-primary-foreground hover:bg-primary gap-0.5 text-[9px]">
              <Sparkles className="w-2.5 h-2.5" /> NEW
            </Badge>
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-1">
          <h3 className="font-semibold text-sm text-foreground line-clamp-1">{business.name}</h3>
          <div className="flex items-center gap-0.5 text-xs">
            <Star className="w-3 h-3 fill-accent text-accent" />
            <span className="font-semibold">{business.rating}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{business.area} · {business.subCity}</p>
      </div>
    </div>
  );
}

// =================================================================
// Trending card (with rank number)
// =================================================================
function TrendingCard({
  business, rank, onClick, isFavorite, onToggleFavorite,
}: {
  business: Business;
  rank: number;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <Card className="p-0 overflow-hidden border-border hover:border-primary/40 hover:shadow-sm transition-all group">
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
        className="flex w-full text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <div className="relative w-28 h-28 flex-shrink-0 bg-muted">
          <img src={business.photos[0]} alt={business.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-sm">
            {rank}
          </div>
        </div>
        <div className="flex-1 p-3 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-semibold text-sm text-foreground line-clamp-1">{business.name}</h3>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
              className="flex-shrink-0 -m-1 p-1"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary"}`} />
            </button>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            <Star className="w-3 h-3 fill-accent text-accent" />
            <span className="font-semibold">{business.rating}</span>
            <span className="text-muted-foreground">({business.reviewCount} reviews)</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{business.description}</p>
        </div>
      </div>
    </Card>
  );
}

// =================================================================
// Business card (vertical)
// =================================================================
function BusinessCard({
  business, distance, onClick, isFavorite, onToggleFavorite,
}: {
  business: Business;
  distance?: number;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const catLabel = CATEGORIES.find((c) => c.id === business.category)?.label;
  return (
    <Card className="p-0 overflow-hidden border-border hover:border-primary/40 hover:shadow-sm transition-all group">
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
        className="flex w-full text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        <div className="w-28 h-28 flex-shrink-0 bg-muted relative">
          <img src={business.photos[0]} alt={business.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          {business.verified && (
            <div className="absolute top-1 left-1">
              <Badge className="bg-primary/90 text-primary-foreground hover:bg-primary/90 gap-0.5 px-1 py-0 text-[9px]">
                <BadgeCheck className="w-2.5 h-2.5" /> VERIFIED
              </Badge>
            </div>
          )}
          {isNewThisWeek(business.id) && (
            <div className="absolute bottom-1 left-1">
              <Badge className="bg-accent text-accent-foreground hover:bg-accent gap-0.5 px-1 py-0 text-[9px]">
                <Sparkles className="w-2.5 h-2.5" /> NEW
              </Badge>
            </div>
          )}
        </div>
        <div className="flex-1 p-3 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-semibold text-sm text-foreground line-clamp-1">{business.name}</h3>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
              className="flex-shrink-0 -m-1 p-1"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary"}`} />
            </button>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            <Star className="w-3 h-3 fill-accent text-accent" />
            <span className="font-semibold text-foreground">{business.rating}</span>
            <span className="text-muted-foreground">({business.reviewCount})</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{catLabel}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            <MapPin className="w-3 h-3 inline -mt-0.5 mr-0.5" />
            {business.area}, {business.subCity}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${business.openNow ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"}`}>
              {business.openNow ? "OPEN NOW" : "CLOSED"}
            </span>
            {distance !== undefined && (
              <span className="text-[10px] text-muted-foreground font-medium">
                {formatDistance(distance)} · {walkingTime(distance)}
              </span>
            )}
            <span className="text-[10px] text-muted-foreground">{"$".repeat(business.priceLevel)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// =================================================================
// Category / Search results view — with Map toggle
// =================================================================
function CategoryView({
  category, onBack, onBusinessClick, favorites, onToggleFavorite, searchQuery, onSearch, onCategoryChange,
}: {
  category: Category | "all";
  onBack: () => void;
  onBusinessClick: (id: string) => void;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  searchQuery: string;
  onSearch: (q: string) => void;
  onCategoryChange: (c: Category | "all") => void;
}) {
  const [sortBy, setSortBy] = useState<"distance" | "rating">("distance");
  const [filterOpen, setFilterOpen] = useState<"all" | "open" | "verified">("all");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = BUSINESSES.slice();
    if (category !== "all") list = list.filter((b) => b.category === category);
    if (filterOpen === "open") list = list.filter((b) => b.openNow);
    if (filterOpen === "verified") list = list.filter((b) => b.verified);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((b) =>
        b.name.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.subCity.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      const da = distanceKm(USER_LOCATION.lat, USER_LOCATION.lng, a.lat, a.lng);
      const db = distanceKm(USER_LOCATION.lat, USER_LOCATION.lng, b.lat, b.lng);
      return da - db;
    });
    return list;
  }, [category, sortBy, filterOpen, searchQuery]);

  const catLabel = category === "all" ? "All businesses" : CATEGORIES.find((c) => c.id === category)?.label;
  const catAmharic = category === "all" ? "ሁሉም ንግዶች" : CATEGORIES.find((c) => c.id === category)?.amharic;

  return (
    <div className="max-w-5xl mx-auto px-4 py-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-3">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex items-baseline justify-between mb-1">
        <h1 className="font-serif text-2xl font-bold text-foreground">{catLabel}</h1>
        <span className="text-xs text-muted-foreground">{filtered.length} found</span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">{catAmharic} · Near you</p>

      {/* Filter chips + view toggle */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
          {[
            { id: "all" as const, label: "All" },
            { id: "open" as const, label: "Open now" },
            { id: "verified" as const, label: "Verified" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterOpen(f.id)}
              className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                filterOpen === f.id
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-card border-border text-muted-foreground hover:border-primary"
              }`}
            >
              {f.label}
            </button>
          ))}
          <button
            onClick={() => setSortBy(sortBy === "distance" ? "rating" : "distance")}
            className="flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border border-border bg-card text-muted-foreground hover:border-primary flex items-center gap-1"
          >
            <SlidersHorizontal className="w-3 h-3" />
            {sortBy === "distance" ? "Distance" : "Rating"}
          </button>
        </div>
        {/* Map/List toggle */}
        <div className="flex-shrink-0 flex rounded-lg border border-border bg-card overflow-hidden">
          <button
            onClick={() => setViewMode("list")}
            className={`px-2.5 py-1.5 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`px-2.5 py-1.5 ${viewMode === "map" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            aria-label="Map view"
          >
            <MapIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick category picker */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide -mx-4 px-4">
        <button
          onClick={() => onCategoryChange("all")}
          className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border ${
            category === "all" ? "bg-accent border-accent text-accent-foreground" : "bg-card border-border text-muted-foreground"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => { onSearch(""); onCategoryChange(c.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border ${
              category === c.id ? "bg-accent border-accent text-accent-foreground" : "bg-card border-border text-muted-foreground"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">No businesses match your filters.</p>
        </div>
      ) : viewMode === "map" ? (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Map */}
          <div className="rounded-xl overflow-hidden border border-border bg-card sticky top-20 self-start">
            <MiniMap
              businesses={filtered}
              selectedId={selectedId}
              onSelect={(id) => setSelectedId(id)}
              className="aspect-[400/460] max-h-[500px]"
            />
          </div>
          {/* List (scrollable, syncs with map) */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-soft pr-1">
            {filtered.map((b) => {
              const d = distanceKm(USER_LOCATION.lat, USER_LOCATION.lng, b.lat, b.lng);
              return (
                <div
                  key={b.id}
                  className={selectedId === b.id ? "ring-2 ring-primary rounded-xl" : ""}
                >
                  <BusinessCard
                    business={b}
                    distance={d}
                    onClick={() => onBusinessClick(b.id)}
                    isFavorite={favorites.has(b.id)}
                    onToggleFavorite={() => onToggleFavorite(b.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((b) => {
            const d = distanceKm(USER_LOCATION.lat, USER_LOCATION.lng, b.lat, b.lng);
            return (
              <BusinessCard
                key={b.id}
                business={b}
                distance={d}
                onClick={() => onBusinessClick(b.id)}
                isFavorite={favorites.has(b.id)}
                onToggleFavorite={() => onToggleFavorite(b.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// =================================================================
// Detail view
// =================================================================
function DetailView({
  business, extraReviews, onAddReview, onBack, isFavorite, onToggleFavorite,
}: {
  business: Business;
  extraReviews: Review[];
  onAddReview: (r: Review) => void;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const [activePhoto, setActivePhoto] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const catLabel = CATEGORIES.find((c) => c.id === business.category);
  const d = distanceKm(USER_LOCATION.lat, USER_LOCATION.lng, business.lat, business.lng);
  const allReviews = [...extraReviews, ...business.reviews];
  const deal = DEALS.find((x) => x.businessId === business.id);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `Check out ${business.name} on Akebabi — ${business.rating}★ rated ${catLabel?.label.toLowerCase()} in ${business.subCity}, Addis Ababa.`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: business.name, text, url });
      } catch { /* user cancelled */ }
    } else {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
      window.open(waUrl, "_blank");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero photo */}
      <div className="relative aspect-[4/3] md:aspect-[16/9] bg-muted">
        <img src={business.photos[activePhoto]} alt={business.name} className="w-full h-full object-cover" />
        <button
          onClick={onBack}
          className="absolute top-3 left-3 w-9 h-9 rounded-full bg-background/95 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-background"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-background/95 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-background"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleFavorite}
            className="w-9 h-9 rounded-full bg-background/95 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-background"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-primary text-primary" : "text-foreground"}`} />
          </button>
        </div>
        {business.featured && (
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-accent text-accent-foreground hover:bg-accent gap-1">
              <BadgeCheck className="w-3 h-3" /> FEATURED
            </Badge>
          </div>
        )}
      </div>

      {/* Photo thumbnails */}
      {business.photos.length > 1 && (
        <div className="flex gap-1.5 px-4 pt-3">
          {business.photos.map((p, i) => (
            <button
              key={i}
              onClick={() => setActivePhoto(i)}
              className={`w-14 h-14 rounded-md overflow-hidden border-2 transition-colors ${i === activePhoto ? "border-primary" : "border-transparent"}`}
            >
              <img src={p} alt={`${business.name} photo ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="px-4 py-5 space-y-5">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-serif text-2xl font-black text-foreground leading-tight">{business.name}</h1>
            {business.verified && <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0" />}
            {isNewThisWeek(business.id) && (
              <Badge className="bg-accent text-accent-foreground hover:bg-accent gap-0.5 text-[10px]">
                <Sparkles className="w-2.5 h-2.5" /> NEW
              </Badge>
            )}
          </div>
          <div className="flex items-center flex-wrap gap-2 text-sm">
            <span className="bg-muted text-foreground text-xs font-medium px-2 py-0.5 rounded">{catLabel?.label}</span>
            <span className="flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 fill-accent text-accent" />
              <span className="font-semibold">{business.rating}</span>
              <span className="text-muted-foreground">({business.reviewCount} reviews)</span>
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{"$".repeat(business.priceLevel)}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{business.description}</p>
        </div>

        {/* Deal banner (if exists) */}
        {deal && (
          <div className="relative rounded-lg bg-gradient-to-r from-primary to-accent/80 text-primary-foreground p-4 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <Tag className="w-full h-full" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                <Flame className="w-3.5 h-3.5" />
                {deal.discount} · {deal.title}
              </div>
              <p className="text-xs opacity-90 leading-relaxed mb-2">{deal.description}</p>
              <p className="text-[10px] font-semibold flex items-center gap-0.5">
                {deal.validUntilDays <= 3 && <Zap className="w-3 h-3 fill-current" />}
                {deal.validUntil}
              </p>
            </div>
          </div>
        )}

        {/* Location & hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-card border border-border">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground">Location</p>
              <p className="text-xs text-muted-foreground">{business.area}, {business.subCity}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{formatDistance(d)} away · {walkingTime(d)}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-card border border-border">
            <Clock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground">Hours</p>
              <p className="text-xs text-muted-foreground">{business.hours}</p>
              <p className={`text-xs mt-0.5 font-semibold ${business.openNow ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {business.openNow ? "● Open now" : "● Closed"}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <a href={`tel:${business.phone}`} className="flex flex-col items-center gap-1 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <Phone className="w-5 h-5" />
            <span className="text-xs font-semibold">Call</span>
          </a>
          {business.whatsapp && (
            <a
              href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-card border border-border hover:border-emerald-500 hover:text-emerald-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs font-semibold">WhatsApp</span>
            </a>
          )}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${business.lat},${business.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 p-3 rounded-lg bg-card border border-border hover:border-primary hover:text-primary transition-colors"
          >
            <Navigation className="w-5 h-5" />
            <span className="text-xs font-semibold">Directions</span>
          </a>
          <button
            onClick={onToggleFavorite}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors ${
              isFavorite ? "bg-primary/10 border-primary text-primary" : "bg-card border-border hover:border-primary"
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-primary" : ""}`} />
            <span className="text-xs font-semibold">{isFavorite ? "Saved" : "Save"}</span>
          </button>
        </div>

        {/* Share row */}
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share this business
        </button>

        <Separator />

        {/* Reviews */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-lg font-bold">
              Reviews
              <span className="text-xs text-muted-foreground font-normal ml-2">{business.reviewCount + extraReviews.length} total</span>
            </h2>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setShowReviewModal(true)}>
              <Plus className="w-3 h-3 mr-1" /> Write a review
            </Button>
          </div>
          <div className="space-y-3">
            {allReviews.map((r, i) => (
              <div key={i} className="p-3 rounded-lg bg-card border border-border">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">
                      {r.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{r.author}</p>
                      <p className="text-[10px] text-muted-foreground">{r.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3 h-3 ${s <= r.rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review modal */}
      <ReviewModal
        open={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        businessName={business.name}
        onSubmit={(review) => {
          onAddReview(review);
          setShowReviewModal(false);
        }}
      />
    </div>
  );
}

// =================================================================
// Review modal — working star picker
// =================================================================
function ReviewModal({
  open, onClose, businessName, onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  businessName: string;
  onSubmit: (r: Review) => void;
}) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!text.trim()) {
      toast({ title: "Please write a few words", variant: "destructive" });
      return;
    }
    onSubmit({
      author: author.trim() || "Anonymous",
      rating,
      text: text.trim(),
      date: "Just now",
    });
    toast({ title: "Review posted!", description: "Thank you for sharing your experience." });
    setRating(5); setHover(0); setAuthor(""); setText("");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Write a review</DialogTitle>
          <DialogDescription>
            Share your experience at {businessName}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {/* Star picker */}
          <div>
            <label className="text-xs font-semibold text-foreground">Your rating</label>
            <div className="flex gap-1 mt-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  className="p-1"
                  aria-label={`${s} star${s > 1 ? "s" : ""}`}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      s <= (hover || rating)
                        ? "fill-accent text-accent"
                        : "text-muted-foreground/30 hover:text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm font-semibold self-center">
                {["", "Terrible", "Poor", "OK", "Good", "Excellent"][hover || rating]}
              </span>
            </div>
          </div>
          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-foreground">Your name (optional)</label>
            <Input
              placeholder="Anonymous"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="mt-1"
              maxLength={30}
            />
          </div>
          {/* Review text */}
          <div>
            <label className="text-xs font-semibold text-foreground">Your review</label>
            <textarea
              placeholder="What did you like? What could be better?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={500}
              className="mt-1 w-full min-h-24 px-3 py-2 text-sm rounded-md border border-border bg-card focus:outline-none focus:border-primary resize-none"
            />
            <p className="text-[10px] text-muted-foreground text-right mt-0.5">{text.length}/500</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button onClick={handleSubmit} className="flex-1 bg-primary hover:bg-primary/90">
              Post review
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// =================================================================
// Welcome onboarding modal (first visit)
// =================================================================
function WelcomeModal({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const slides = [
    {
      icon: <MapIcon className="w-12 h-12 text-primary" />,
      title: "Discover near you",
      amharic: "በአቅራቢያዎ ያሉ ንግዶችን ይፈልጉ",
      desc: "Find barber shops, cafes, hotels, and more — all sorted by walking distance from where you are right now.",
    },
    {
      icon: <BadgeCheck className="w-12 h-12 text-accent" />,
      title: "Real photos, real reviews",
      amharic: "እውነተኛ ፎቶዎች፣ እውነተኛ ግምገማዎች",
      desc: "Every business has real photos, working phone numbers, and honest reviews from people in Addis Ababa.",
    },
    {
      icon: <Building2 className="w-12 h-12 text-primary" />,
      title: "List your business free",
      amharic: "ንግድዎን ነፃ ያስገቡ",
      desc: "Own a shop? List it in 10 minutes, upload photos, and start getting discovered by customers nearby.",
    },
  ];

  return (
    <Dialog open={true} onOpenChange={(o) => !o && onDone()}>
      <DialogContent className="sm:max-w-md text-center">
        <div className="pt-4 pb-2">
          <div className="flex justify-center mb-4">{slides[step].icon}</div>
          <h2 className="font-serif text-xl font-black text-foreground">{slides[step].title}</h2>
          <p className="text-xs text-muted-foreground mt-1 font-amharic" style={{ fontFamily: "var(--font-noto-ethiopic), sans-serif" }}>
            {slides[step].amharic}
          </p>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{slides[step].desc}</p>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 my-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-primary" : "w-1.5 bg-muted"}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onDone} className="flex-1">Skip</Button>
          {step < slides.length - 1 ? (
            <Button onClick={() => setStep(step + 1)} className="flex-1">Next</Button>
          ) : (
            <Button onClick={onDone} className="flex-1 bg-primary hover:bg-primary/90">Get started</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// =================================================================
// Register view (simulated multi-step)
// =================================================================
function RegisterView({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("");
  const [hours, setHours] = useState("");
  const { toast } = useToast();

  const handleSendOtp = () => {
    if (phone.length < 10) {
      toast({ title: "Invalid number", description: "Please enter a valid phone number.", variant: "destructive" });
      return;
    }
    toast({ title: "OTP sent", description: "Use 1234 for this demo." });
    setStep(2);
  };
  const handleVerifyOtp = () => {
    if (otp !== "1234") {
      toast({ title: "Wrong code", description: "Try 1234 for the demo.", variant: "destructive" });
      return;
    }
    setStep(3);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-3">
        <ArrowLeft className="w-4 h-4" /> Back to home
      </button>
      <h1 className="font-serif text-2xl font-black mb-1">List your business</h1>
      <p className="text-sm text-muted-foreground mb-4">Free · Takes about 10 minutes</p>

      <div className="flex items-center gap-1 mb-6">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`flex-1 h-1.5 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold mb-1">What&apos;s your phone number?</h2>
            <p className="text-xs text-muted-foreground">We&apos;ll send you a verification code via SMS.</p>
          </div>
          <Input type="tel" placeholder="+251 9XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-12 text-base" />
          <Button onClick={handleSendOtp} className="w-full h-12" disabled={phone.length < 10}>Send verification code</Button>
          <p className="text-[11px] text-center text-muted-foreground">By continuing you agree to our Terms and Privacy Policy.</p>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold mb-1">Enter the code</h2>
            <p className="text-xs text-muted-foreground">Sent to {phone}. <button className="text-primary underline" onClick={() => setStep(1)}>Change number</button></p>
          </div>
          <Input
            type="text"
            placeholder="1234"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
            className="h-14 text-center text-2xl tracking-[0.5em] font-bold"
            inputMode="numeric"
          />
          <Button onClick={handleVerifyOtp} className="w-full h-12" disabled={otp.length !== 4}>Verify</Button>
          <p className="text-[11px] text-center text-muted-foreground">Demo tip: use <span className="font-bold">1234</span> as the code.</p>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold mb-1">Tell us about your business</h2>
            <p className="text-xs text-muted-foreground">Customers will see this on your listing.</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground">Business name</label>
            <Input placeholder="e.g. Bole Cuts Barbershop" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground">Category</label>
            <div className="grid grid-cols-3 gap-1.5 mt-1">
              {CATEGORIES.slice(0, 12).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`text-xs px-2 py-2 rounded-md border transition-colors ${
                    category === c.id ? "bg-primary border-primary text-primary-foreground" : "bg-card border-border hover:border-primary"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground">Description</label>
            <textarea
              placeholder="What makes your business special?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={140}
              className="mt-1 w-full min-h-20 px-3 py-2 text-sm rounded-md border border-border bg-card focus:outline-none focus:border-primary resize-none"
            />
            <p className="text-[10px] text-muted-foreground text-right mt-0.5">{description.length}/140</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-foreground">Area</label>
              <Input placeholder="e.g. Africa Junction" value={area} onChange={(e) => setArea(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">Sub-city</label>
              <select value={hours} onChange={(e) => setHours(e.target.value)} className="mt-1 w-full h-10 px-3 text-sm rounded-md border border-border bg-card focus:outline-none focus:border-primary">
                <option value="">Select...</option>
                <option>Bole</option><option>Piassa</option><option>Mekanisa</option><option>Megenagna</option>
                <option>Kazanchis</option><option>Sarbet</option><option>22 Mazoria</option><option>Merkato</option>
              </select>
            </div>
          </div>
          <Button onClick={() => setStep(4)} className="w-full h-12" disabled={!businessName || !category || !area}>Continue</Button>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold mb-1">Add photos</h2>
            <p className="text-xs text-muted-foreground">Up to 3 photos on the free plan.</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <button key={i} type="button" className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                <Upload className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-medium">Upload</span>
              </button>
            ))}
          </div>
          <Button
            onClick={() => {
              toast({ title: "🎉 Listing published!", description: `${businessName} is now live on Akebabi.` });
              setTimeout(onBack, 1500);
            }}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700"
          >
            <Check className="w-4 h-4 mr-1" /> Publish my listing
          </Button>
        </div>
      )}
    </div>
  );
}

// =================================================================
// Favorites view
// =================================================================
function FavoritesView({
  businesses, onBack, onBusinessClick, onExploreMore,
}: {
  businesses: Business[];
  onBack: () => void;
  onBusinessClick: (id: string) => void;
  onExploreMore: () => void;
}) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-3">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="font-serif text-2xl font-black mb-1">Your favorites</h1>
      <p className="text-sm text-muted-foreground mb-4">{businesses.length} saved business{businesses.length !== 1 ? "es" : ""}</p>
      {businesses.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
            <Heart className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-1">No favorites yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Tap the heart icon on any business to save it here.</p>
          <Button onClick={onExploreMore}>Explore businesses</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {businesses.map((b) => {
            const d = distanceKm(USER_LOCATION.lat, USER_LOCATION.lng, b.lat, b.lng);
            return (
              <BusinessCard
                key={b.id}
                business={b}
                distance={d}
                onClick={() => onBusinessClick(b.id)}
                isFavorite={true}
                onToggleFavorite={() => {}}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// =================================================================
// Bottom navigation (mobile-first)
// =================================================================
function BottomNav({
  view, onHome, onSearch, onRegister, onFavorites, favoritesCount,
}: {
  view: View;
  onHome: () => void;
  onSearch: () => void;
  onRegister: () => void;
  onFavorites: () => void;
  favoritesCount: number;
}) {
  const isActive = (target: "home" | "search" | "favorites") => {
    if (target === "home") return view.name === "home" || view.name === "detail";
    if (target === "search") return view.name === "category";
    if (target === "favorites") return view.name === "favorites";
    return false;
  };
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur-md border-t border-border">
      <div className="grid grid-cols-4 h-14">
        <button onClick={onHome} className={`flex flex-col items-center justify-center gap-0.5 ${isActive("home") ? "text-primary" : "text-muted-foreground"}`}>
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Home</span>
        </button>
        <button onClick={onSearch} className={`flex flex-col items-center justify-center gap-0.5 ${isActive("search") ? "text-primary" : "text-muted-foreground"}`}>
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Browse</span>
        </button>
        <button onClick={onRegister} className={`flex flex-col items-center justify-center gap-0.5 ${view.name === "register" ? "text-primary" : "text-muted-foreground"}`}>
          <Plus className="w-5 h-5" />
          <span className="text-[10px] font-semibold">List</span>
        </button>
        <button onClick={onFavorites} className={`relative flex flex-col items-center justify-center gap-0.5 ${isActive("favorites") ? "text-primary" : "text-muted-foreground"}`}>
          <Heart className="w-5 h-5" />
          {favoritesCount > 0 && (
            <span className="absolute top-1 right-4 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[9px] font-bold flex items-center justify-center">
              {favoritesCount}
            </span>
          )}
          <span className="text-[10px] font-semibold">Saved</span>
        </button>
      </div>
    </nav>
  );
}
