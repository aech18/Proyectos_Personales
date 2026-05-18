// Estado del carrito
let cart = [];

// Helpers
const formatCurrency = (value) => `$${value.toFixed(2)}`;
const parsePrice = (text) => parseFloat(text.replace(/[^0-9.]/g, "")) || 0;

// Selectores base
const addButtons = Array.from(document.querySelectorAll("button")).filter((btn) => {
  const icon = btn.querySelector(".material-symbols-outlined");
  return icon && icon.textContent.trim() === "add_shopping_cart";
});

const headerCartBadge = document.querySelector("header .relative span.absolute");
const aside = document.querySelector("aside");
const cartItemsContainer = aside?.querySelector(
  ".flex-1.overflow-y-auto.p-md.space-y-md.divide-y.divide-surface-variant"
);
const cartHeaderBadge = aside?.querySelector(".p-lg.border-b span");
const summarySection = aside?.querySelector(".p-lg.bg-surface-container-low");
const summaryRows = summarySection?.querySelectorAll(".flex.justify-between");
const subtotalValueEl = summaryRows?.[0]?.querySelectorAll("span")?.[1];
const totalValueEl = summaryRows?.[2]?.querySelectorAll("span")?.[1];
const whatsappBtn = summarySection?.querySelector("button");

// Agregar al carrito
addButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest("article");
    if (!card) return;

    const name = card.querySelector("h3")?.textContent.trim() || "Producto";
    const priceText = card.querySelector(".text-primary-container")?.textContent || "$0.00";
    const price = parsePrice(priceText);
    const image = card.querySelector("img")?.getAttribute("src") || "";

    const existing = cart.find((item) => item.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, image, qty: 1 });
    }

    updateCartUI();
  });
});

// Render y UI
function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (headerCartBadge) headerCartBadge.textContent = totalItems;
  if (cartHeaderBadge) cartHeaderBadge.textContent = `${totalItems} Items`;
  if (subtotalValueEl) subtotalValueEl.textContent = formatCurrency(subtotal);
  if (totalValueEl) totalValueEl.textContent = formatCurrency(subtotal);

  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = cart
    .map(
      (item) => `
      <div class="flex gap-sm pt-md first:pt-0" data-item="${item.name}">
        <div class="w-16 h-16 bg-surface-container rounded flex-shrink-0">
          <img alt="${item.name}" class="w-full h-full object-contain p-1" src="${item.image}" />
        </div>
        <div class="flex-1">
          <h4 class="font-label-bold text-on-surface">${item.name}</h4>
          <p class="font-label-sm text-on-surface-variant">Size: M</p>
          <div class="flex justify-between items-center mt-1">
            <span class="font-headline-md text-[16px] text-primary-container">${formatCurrency(item.price)}</span>
            <div class="flex items-center gap-2 border border-outline-variant rounded px-2">
              <span class="material-symbols-outlined text-[16px] cursor-pointer hover:text-error" data-action="decrease" data-name="${item.name}">remove</span>
              <span class="font-label-bold text-sm">${item.qty}</span>
              <span class="material-symbols-outlined text-[16px] cursor-pointer hover:text-primary" data-action="increase" data-name="${item.name}">add</span>
            </div>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

// Manejo de cantidades (delegación de eventos)
cartItemsContainer?.addEventListener("click", (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;

  const action = target.getAttribute("data-action");
  const name = target.getAttribute("data-name");
  if (!action || !name) return;

  const item = cart.find((i) => i.name === name);
  if (!item) return;

  if (action === "increase") item.qty += 1;
  if (action === "decrease") item.qty -= 1;

  if (item.qty <= 0) {
    cart = cart.filter((i) => i.name !== name);
  }

  updateCartUI();
});

// Checkout WhatsApp
whatsappBtn?.addEventListener("click", () => {
  if (cart.length === 0) return;

  const lines = cart.map(
    (item) => `${item.qty}x ${item.name} - ${formatCurrency(item.price * item.qty)}`
  );

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const message = ["Pedido WC2026 Shop:", ...lines, `Total: ${formatCurrency(total)}`].join("\n");

  window.open(
    "https://wa.me/584124328899?text=" + encodeURIComponent(message),
    "_blank"
  );
});

// Inicializa UI
updateCartUI();
