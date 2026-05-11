import { useState, useEffect } from "react";

const MENU = [
  { id: 1, name: "Espresso", price: 3.50, category: "Coffee", emoji: "☕" },
  { id: 2, name: "Latte", price: 5.00, category: "Coffee", emoji: "🥛" },
  { id: 3, name: "Cappuccino", price: 4.75, category: "Coffee", emoji: "☕" },
  { id: 4, name: "Cold Brew", price: 5.50, category: "Coffee", emoji: "🧊" },
  { id: 5, name: "Matcha Latte", price: 5.25, category: "Tea", emoji: "🍵" },
  { id: 6, name: "Chai Latte", price: 4.75, category: "Tea", emoji: "🫖" },
  { id: 7, name: "Earl Grey", price: 3.75, category: "Tea", emoji: "🫖" },
  { id: 8, name: "Croissant", price: 4.00, category: "Food", emoji: "🥐" },
  { id: 9, name: "Avocado Toast", price: 9.50, category: "Food", emoji: "🥑" },
  { id: 10, name: "Bagel", price: 5.00, category: "Food", emoji: "🥯" },
  { id: 11, name: "Muffin", price: 3.50, category: "Food", emoji: "🧁" },
  { id: 12, name: "Sparkling Water", price: 2.50, category: "Drinks", emoji: "💧" },
  { id: 13, name: "OJ", price: 4.00, category: "Drinks", emoji: "🍊" },
  { id: 14, name: "Lemonade", price: 3.75, category: "Drinks", emoji: "🍋" },
];

const CATEGORIES = ["All", "Coffee", "Tea", "Food", "Drinks"];
const TAX_RATE = 0.0875;

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

function getTime() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function POS() {
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState("All");
  const [orderNum, setOrderNum] = useState(1042);
  const [screen, setScreen] = useState("pos"); // pos | checkout | receipt
  const [payMethod, setPayMethod] = useState(null);
  const [time, setTime] = useState(getTime());
  const [notification, setNotification] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setTime(getTime()), 10000);
    return () => clearInterval(t);
  }, []);

  const filtered = category === "All" ? MENU : MENU.filter(i => i.category === category);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  function addItem(item) {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
    notify(`${item.emoji} ${item.name} added`);
  }

  function removeItem(id) {
    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing.qty === 1) return prev.filter(i => i.id !== id);
      return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i);
    });
  }

  function notify(msg) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 1800);
  }

  function handleCheckout() {
    if (cart.length === 0) return;
    setScreen("checkout");
    setPayMethod(null);
  }

  function handlePay(method) {
    setPayMethod(method);
    setTimeout(() => {
      setCompletedOrder({ cart, subtotal, tax, total, orderNum, method });
      setOrderNum(n => n + 1);
      setCart([]);
      setScreen("receipt");
    }, 800);
  }

  function newOrder() {
    setScreen("pos");
    setPayMethod(null);
    setCompletedOrder(null);
  }

  return (
    <div style={{
      fontFamily: "'DM Mono', 'Courier New', monospace",
      background: "#0f0e0d",
      minHeight: "100vh",
      color: "#f5f0e8",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      {/* Top Bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 24px",
        background: "#1a1916",
        borderBottom: "1px solid #2a2926",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            background: "#c8a96e",
            color: "#0f0e0d",
            fontWeight: 700,
            fontSize: 13,
            padding: "4px 10px",
            letterSpacing: 2,
          }}>BREW</div>
          <span style={{ color: "#6b6560", fontSize: 12, letterSpacing: 1 }}>POINT OF SALE</span>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <span style={{ color: "#6b6560", fontSize: 12 }}>ORDER #{orderNum}</span>
          <span style={{ color: "#c8a96e", fontSize: 12, letterSpacing: 1 }}>{time}</span>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div style={{
          position: "fixed",
          top: 70,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#c8a96e",
          color: "#0f0e0d",
          padding: "8px 20px",
          fontSize: 13,
          fontWeight: 600,
          zIndex: 100,
          letterSpacing: 0.5,
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}>{notification}</div>
      )}

      {/* Main Content */}
      {screen === "pos" && (
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Menu Panel */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Category Tabs */}
            <div style={{
              display: "flex",
              gap: 0,
              padding: "16px 20px",
              borderBottom: "1px solid #2a2926",
              flexShrink: 0,
            }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)} style={{
                  padding: "8px 18px",
                  background: category === cat ? "#c8a96e" : "transparent",
                  color: category === cat ? "#0f0e0d" : "#6b6560",
                  border: "1px solid " + (category === cat ? "#c8a96e" : "#2a2926"),
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: "inherit",
                  letterSpacing: 1,
                  fontWeight: category === cat ? 700 : 400,
                  transition: "all 0.15s",
                  marginRight: -1,
                }}>{cat.toUpperCase()}</button>
              ))}
            </div>

            {/* Menu Grid */}
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: 12,
              alignContent: "start",
            }}>
              {filtered.map(item => (
                <button key={item.id} onClick={() => addItem(item)} style={{
                  background: "#1a1916",
                  border: "1px solid #2a2926",
                  color: "#f5f0e8",
                  padding: "18px 12px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                  transition: "all 0.12s",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  position: "relative",
                  overflow: "hidden",
                }}>
                  <span style={{ fontSize: 28 }}>{item.emoji}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#f5f0e8", lineHeight: 1.2 }}>{item.name}</span>
                  <span style={{ fontSize: 14, color: "#c8a96e", fontWeight: 700 }}>{formatCurrency(item.price)}</span>
                  <div style={{
                    position: "absolute",
                    top: 8, right: 8,
                    background: "#2a2926",
                    color: "#6b6560",
                    fontSize: 10,
                    padding: "2px 6px",
                    letterSpacing: 0.5,
                  }}>{item.category}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Cart Panel */}
          <div style={{
            width: 320,
            background: "#1a1916",
            borderLeft: "1px solid #2a2926",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}>
            <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid #2a2926" }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: "#6b6560" }}>CURRENT ORDER</div>
            </div>

            {/* Cart Items */}
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", color: "#3a3835", padding: "40px 20px", fontSize: 13 }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>☕</div>
                  No items yet
                </div>
              ) : cart.map(item => (
                <div key={item.id} style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 20px",
                  borderBottom: "1px solid #23221f",
                  gap: 10,
                }}>
                  <span style={{ fontSize: 18 }}>{item.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#f5f0e8" }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "#6b6560" }}>{formatCurrency(item.price)} each</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button onClick={() => removeItem(item.id)} style={{
                      background: "#2a2926", border: "none", color: "#c8a96e",
                      width: 24, height: 24, cursor: "pointer", fontFamily: "inherit",
                      fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>−</button>
                    <span style={{ fontSize: 14, minWidth: 16, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => addItem(item)} style={{
                      background: "#2a2926", border: "none", color: "#c8a96e",
                      width: 24, height: 24, cursor: "pointer", fontFamily: "inherit",
                      fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>+</button>
                  </div>
                  <div style={{ fontSize: 13, color: "#c8a96e", minWidth: 52, textAlign: "right", fontWeight: 700 }}>
                    {formatCurrency(item.price * item.qty)}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div style={{ borderTop: "1px solid #2a2926", padding: "16px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#6b6560", fontSize: 12 }}>Subtotal</span>
                <span style={{ fontSize: 13 }}>{formatCurrency(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ color: "#6b6560", fontSize: 12 }}>Tax (8.75%)</span>
                <span style={{ fontSize: 13 }}>{formatCurrency(tax)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, paddingTop: 12, borderTop: "1px solid #2a2926" }}>
                <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: 1 }}>TOTAL</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: "#c8a96e" }}>{formatCurrency(total)}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setCart([])} style={{
                  flex: 1,
                  padding: "12px",
                  background: "transparent",
                  border: "1px solid #3a3835",
                  color: "#6b6560",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 12,
                  letterSpacing: 1,
                }}>CLEAR</button>
                <button onClick={handleCheckout} style={{
                  flex: 2,
                  padding: "12px",
                  background: cart.length ? "#c8a96e" : "#2a2926",
                  border: "none",
                  color: cart.length ? "#0f0e0d" : "#4a4845",
                  cursor: cart.length ? "pointer" : "not-allowed",
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 1,
                }}>CHARGE {cart.length ? formatCurrency(total) : ""}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Screen */}
      {screen === "checkout" && (
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 32,
          padding: 40,
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#6b6560", marginBottom: 8 }}>TOTAL DUE</div>
            <div style={{ fontSize: 64, fontWeight: 700, color: "#c8a96e", letterSpacing: -2 }}>{formatCurrency(total)}</div>
          </div>

          <div style={{ fontSize: 13, color: "#6b6560", letterSpacing: 2 }}>SELECT PAYMENT METHOD</div>

          <div style={{ display: "flex", gap: 16 }}>
            {[
              { label: "CARD", icon: "💳", method: "card" },
              { label: "CASH", icon: "💵", method: "cash" },
              { label: "TAP", icon: "📱", method: "tap" },
            ].map(({ label, icon, method }) => (
              <button key={method} onClick={() => handlePay(method)} style={{
                width: 140,
                height: 140,
                background: payMethod === method ? "#c8a96e" : "#1a1916",
                border: "1px solid " + (payMethod === method ? "#c8a96e" : "#2a2926"),
                color: payMethod === method ? "#0f0e0d" : "#f5f0e8",
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                transition: "all 0.15s",
              }}>
                <span style={{ fontSize: 36 }}>{icon}</span>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>{label}</span>
              </button>
            ))}
          </div>

          <button onClick={() => setScreen("pos")} style={{
            padding: "10px 24px",
            background: "transparent",
            border: "1px solid #3a3835",
            color: "#6b6560",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 12,
            letterSpacing: 1,
            marginTop: 8,
          }}>← BACK</button>
        </div>
      )}

      {/* Receipt Screen */}
      {screen === "receipt" && completedOrder && (
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
        }}>
          <div style={{
            background: "#f5f0e8",
            color: "#0f0e0d",
            width: 320,
            padding: "32px 28px",
            fontFamily: "'DM Mono', 'Courier New', monospace",
          }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 3, marginBottom: 4 }}>BREW POS</div>
              <div style={{ fontSize: 11, color: "#6b6560", letterSpacing: 1 }}>ORDER #{completedOrder.orderNum}</div>
              <div style={{ fontSize: 11, color: "#6b6560" }}>{new Date().toLocaleString()}</div>
            </div>

            <div style={{ borderTop: "1px dashed #ccc", borderBottom: "1px dashed #ccc", padding: "14px 0", marginBottom: 14 }}>
              {completedOrder.cart.map(item => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                  <span>{item.qty}x {item.name}</span>
                  <span>{formatCurrency(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 13, marginBottom: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Subtotal</span><span>{formatCurrency(completedOrder.subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Tax</span><span>{formatCurrency(completedOrder.tax)}</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16, marginTop: 10, paddingTop: 10, borderTop: "1px solid #ccc" }}>
              <span>TOTAL</span><span>{formatCurrency(completedOrder.total)}</span>
            </div>

            <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#6b6560" }}>
              Paid via {completedOrder.method.toUpperCase()} ✓
            </div>

            <div style={{ textAlign: "center", marginTop: 16, fontSize: 12 }}>Thank you! ☕</div>

            <button onClick={newOrder} style={{
              width: "100%",
              marginTop: 24,
              padding: "14px",
              background: "#0f0e0d",
              border: "none",
              color: "#c8a96e",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 2,
            }}>NEW ORDER</button>
          </div>
        </div>
      )}
    </div>
  );
}
