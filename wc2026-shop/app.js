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
const headerCartButton = document.querySelector("header .relative");
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

// Mobile cart elements (created dynamically)
let mobileCartOverlay = null;
let mobileCartDrawer = null;
let mobileCartItemsContainer = null;
let mobileCartBadge = null;
let mobileSubtotalValueEl = null;
let mobileTotalValueEl = null;
let mobileWhatsappBtn = null;

function createMobileCart() {
  if (mobileCartDrawer) return;

  mobileCartOverlay = document.createElement("div");
  mobileCartOverlay.style.cssText =
    "position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:60;display:none;";
  mobileCartOverlay.addEventListener("click", closeMobileCart);

  mobileCartDrawer = document.createElement("div");
  mobileCartDrawer.style.cssText =
    "position:fixed;left:0;right:0;bottom:0;max-height:85vh;background:#ffffff;z-index:70;transform:translateY(100%);transition:transform 0.25s ease;display:flex;flex-direction:column;border-top-left-radius:16px;border-top-right-radius:16px;box-shadow:0 -10px 30px rgba(0,0,0,0.2);";

  const desktopButtonHtml = whatsappBtn?.innerHTML || "Finalizar compra por WhatsApp";

  mobileCartDrawer.innerHTML = `
    <div class="p-lg border-b border-surface-variant flex justify-between items-center">
      <div class="flex items-center gap-sm">
        <h2 class="font-headline-lg text-[24px] text-on-surface">Your Cart</h2>
        <span class="bg-secondary-container text-on-secondary-fixed font-label-bold px-sm py-unit rounded-full text-[12px]" data-cart-count>0 Items</span>
      </div>
      <button aria-label="Close cart" data-mobile-cart-close class="material-symbols-outlined text-[24px] text-on-surface">close</button>
    </div>
    <div class="flex-1 overflow-y-auto p-md space-y-md divide-y divide-surface-variant" data-cart-items></div>
    <div class="p-lg bg-surface-container-low border-t border-surface-variant">
      <div class="flex justify-between items-center mb-sm">
        <span class="font-body-md text-on-surface-variant">Subtotal</span>
        <span class="font-label-bold text-on-surface" data-cart-subtotal>$0.00</span>
      </div>
      <div class="flex justify-between items-center mb-md pb-md border-b border-outline-variant">
        <span class="font-body-md text-on-surface-variant">Shipping</span>
        <span class="font-label-bold text-primary">Calculated in WhatsApp</span>
      </div>
      <div class="flex justify-between items-end mb-lg">
        <span class="font-headline-md text-[20px] text-on-surface">Total</span>
        <span class="font-headline-lg text-[28px] text-primary-container" data-cart-total>$0.00</span>
      </div>
      <button class="w-full bg-[#25D366] text-white font-label-bold py-md rounded-lg flex justify-center items-center gap-sm hover:opacity-90 transition-opacity shadow-[0_4px_12px_rgba(37,211,102,0.3)] active:scale-95 duration-150" data-cart-whatsapp>
        ${desktopButtonHtml}
      </button>
    </div>
  `;

  document.body.appendChild(mobileCartOverlay);
  document.body.appendChild(mobileCartDrawer);

  mobileCartItemsContainer = mobileCartDrawer.querySelector("[data-cart-items]");
  mobileCartBadge = mobileCartDrawer.querySelector("[data-cart-count]");
  mobileSubtotalValueEl = mobileCartDrawer.querySelector("[data-cart-subtotal]");
  mobileTotalValueEl = mobileCartDrawer.querySelector("[data-cart-total]");
  mobileWhatsappBtn = mobileCartDrawer.querySelector("[data-cart-whatsapp]");

  const closeBtn = mobileCartDrawer.querySelector("[data-mobile-cart-close]");
  closeBtn?.addEventListener("click", closeMobileCart);

  mobileWhatsappBtn?.addEventListener("click", handleCheckout);
  mobileCartItemsContainer?.addEventListener("click", handleQtyClick);
}

function openMobileCart() {
  createMobileCart();
  if (!mobileCartDrawer || !mobileCartOverlay) return;
  mobileCartOverlay.style.display = "block";
  mobileCartDrawer.style.transform = "translateY(0)";
  document.body.style.overflow = "hidden";
}

function closeMobileCart() {
  if (!mobileCartDrawer || !mobileCartOverlay) return;
  mobileCartDrawer.style.transform = "translateY(100%)";
  mobileCartOverlay.style.display = "none";
  document.body.style.overflow = "";
}

function handleQtyClick(e) {
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
}

function handleCheckout() {
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
}

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

    if (window.innerWidth < 1280) {
      openMobileCart();
    }
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

  if (mobileCartBadge) mobileCartBadge.textContent = `${totalItems} Items`;
  if (mobileSubtotalValueEl) mobileSubtotalValueEl.textContent = formatCurrency(subtotal);
  if (mobileTotalValueEl) mobileTotalValueEl.textContent = formatCurrency(subtotal);

  const itemsHtml = cart
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

  if (cartItemsContainer) cartItemsContainer.innerHTML = itemsHtml;
  if (mobileCartItemsContainer) mobileCartItemsContainer.innerHTML = itemsHtml;
}

// Manejo de cantidades (delegación de eventos)
cartItemsContainer?.addEventListener("click", handleQtyClick);

// Checkout WhatsApp (desktop)
whatsappBtn?.addEventListener("click", handleCheckout);

// Abrir carrito en mobile al tocar el icono
headerCartButton?.addEventListener("click", () => {
  if (window.innerWidth < 1280) {
    openMobileCart();
  }
});

// Inicializa UI
updateCartUI();
