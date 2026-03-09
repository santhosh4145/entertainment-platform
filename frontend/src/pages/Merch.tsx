import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Flame,
  ShoppingBag,
  ShoppingCart,
  ArrowLeft,
  Package,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/CartStore";

interface MerchItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  stock: number;
  image_url: string | null;
}

const CATEGORIES = ["All", "Clothing", "Accessories", "Music"];

const CATEGORY_ICONS: Record<string, string> = {
  Clothing: "👕",
  Accessories: "🧢",
  Music: "🎵",
};

export default function Merch() {
  const { addItem, items: cartItems, removeItem, totalItems, totalPrice } = useCartStore();
  const { isLoggedIn } = useAuthStore();

  const [merchItems, setMerchItems] = useState<MerchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [showCart, setShowCart] = useState(false);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/merch/")
      .then((res) => setMerchItems(res.data))
      .catch((err) => console.error("Failed to load merch:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems =
    filter === "All" ? merchItems : merchItems.filter((i) => i.category === filter);

  const handleAddToCart = (item: MerchItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
      category: item.category,
      quantity: 1,
    });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleCheckout = async () => {
    if (checkoutLoading || cartItems.length === 0) return;
    setCheckoutLoading(true);

    try {
      const response = await fetch("http://localhost:8000/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Failed to create checkout session: ${response.status}`);
      }

      const data = await response.json();

      if (!data.url) {
        throw new Error("No checkout URL provided from server");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Checkout failed — please try again or contact support.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        body { font-family: 'DM Sans', sans-serif; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes slideIn { from { transform:translateX(100%); } to { transform:translateX(0); } }
        .slide-in { animation: slideIn 0.3s cubic-bezier(0.16,1,0.3,1); }
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500" />
            <span className="font-display text-2xl tracking-wider">HOTBOX</span>
            <span className="font-display text-2xl tracking-wider text-red-500">UNDERGROUND</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>

            <button
              onClick={() => setShowCart(true)}
              className="relative flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 rounded-full px-4 h-9 text-sm transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="font-sans">Cart</span>
              {totalItems() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 rounded-full text-xs flex items-center justify-center font-bold">
                  {totalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {showCart && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setShowCart(false)} />
          <div className="w-full max-w-md bg-[#0f0f0f] border-l border-white/5 slide-in flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-display text-3xl tracking-wide">YOUR CART</h2>
              <button onClick={() => setShowCart(false)} className="text-white/40 hover:text-white text-2xl">
                ×
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
                <ShoppingBag className="w-12 h-12 text-white/20" />
                <p className="text-white/40 text-sm">Your cart is empty</p>
                <Button
                  onClick={() => setShowCart(false)}
                  className="bg-red-600 hover:bg-red-500 rounded-full px-6 font-sans text-sm"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-xl p-4"
                    >
                      <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-xl shrink-0">
                        {CATEGORY_ICONS[item.category || ""] || "🛍️"}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-sans font-medium text-sm text-white truncate">{item.name}</p>
                        <p className="text-white/40 text-xs">
                          ${item.price} × {item.quantity}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-2 h-8">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                removeItem(item.id);
                                addItem({ ...item, quantity: item.quantity - 1 });
                              } else {
                                removeItem(item.id);
                              }
                            }}
                            className="text-white/70 hover:text-white text-lg px-1"
                          >
                            −
                          </button>
                          <span className="font-display text-base w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => addItem({ ...item, quantity: item.quantity + 1 })}
                            className="text-white/70 hover:text-white text-lg px-1"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-display text-xl">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-white/40 hover:text-red-400 transition-colors text-xl ml-1"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white/50 text-sm">Total</span>
                    <span className="font-display text-3xl text-red-400">
                      ${totalPrice().toFixed(2)}
                    </span>
                  </div>

                  {!isLoggedIn() ? (
                    <Link to="/login">
                      <Button className="w-full bg-red-600 hover:bg-red-500 rounded-xl h-11 font-sans text-sm">
                        Sign In to Checkout
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      onClick={handleCheckout}
                      disabled={checkoutLoading || cartItems.length === 0}
                      className="w-full bg-red-600 hover:bg-red-500 rounded-xl h-11 font-sans text-sm disabled:opacity-50"
                    >
                      {checkoutLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Checkout — $${totalPrice().toFixed(2)}`
                      )}
                    </Button>
                  )}

                  <p className="text-white/20 text-xs text-center mt-3">
                    Secure payment via Stripe
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-24">
        <div className="mb-12">
          <p className="text-red-500 text-xs tracking-widest uppercase mb-3">Official Store</p>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <h1 className="font-display text-6xl md:text-8xl tracking-wide">THE SHOP</h1>
            <p className="text-white/40 text-sm max-w-xs leading-relaxed">
              Exclusive merch, limited drops, official gear. Rep the underground.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 h-8 rounded-full text-xs tracking-wide transition-all border ${
                  filter === cat
                    ? "bg-red-600 border-red-600 text-white"
                    : "bg-transparent border-white/10 text-white/40 hover:border-white/30 hover:text-white"
                }`}
              >
                {cat !== "All" && CATEGORY_ICONS[cat] ? CATEGORY_ICONS[cat] + " " : ""}
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-48 gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredItems.map((item, i) => (
              <div
                key={item.id}
                className="fade-up group bg-white/[0.02] border border-white/5 hover:border-red-500/20 rounded-2xl overflow-hidden transition-all duration-300"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="aspect-square bg-gradient-to-br from-red-950/30 to-black flex items-center justify-center border-b border-white/5 relative overflow-hidden">
                  <span className="text-6xl">{CATEGORY_ICONS[item.category] || "🛍️"}</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {item.stock < 30 && (
                    <Badge className="absolute top-3 right-3 bg-red-600/80 text-white border-0 text-xs">
                      Low Stock
                    </Badge>
                  )}
                </div>

                <div className="p-5">
                  <Badge className="bg-white/5 text-white/40 border-white/10 text-xs mb-3">
                    {item.category}
                  </Badge>
                  <h3 className="font-sans font-medium text-white text-sm mb-1 leading-tight">{item.name}</h3>
                  <p className="text-white/30 text-xs mb-4 leading-relaxed line-clamp-2">
                    {item.description || "No description available"}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="font-display text-2xl text-white">${item.price}</span>
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className={`rounded-full px-4 h-8 text-xs font-sans transition-all ${
                        addedId === item.id
                          ? "bg-green-600 hover:bg-green-600"
                          : "bg-red-600 hover:bg-red-500"
                      }`}
                    >
                      {addedId === item.id ? "✓ Added" : "Add to Cart"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-24 border border-white/5 rounded-2xl">
            <Package className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/40 text-sm">No items in this category yet</p>
          </div>
        )}
      </div>
    </div>
  );
}