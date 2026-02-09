const paymentConfig = {
  whatsappNumber: "9235648119",
  upiId: "9235648119@jio",
  payeeName: "JOY The Baking School",
};

const classes = [
  {
    id: "class-1",
    title: "Professional Cake Artist Batch",
    date: "Feb 22, 2026",
    seats: 18,
    price: 14999,
    level: "Advanced",
    image: "images/product-cake.jpg",
  },
  {
    id: "class-2",
    title: "Artisan Bread & Croissant Lab",
    date: "Mar 02, 2026",
    seats: 12,
    price: 9999,
    level: "Intermediate",
    image: "images/product-cake2.jpg",
  },
  {
    id: "class-3",
    title: "Weekend Home Baker Course",
    date: "Mar 15, 2026",
    seats: 24,
    price: 6999,
    level: "Beginner",
    image: "images/product-muffin.jpg",
  },
];

const menuItems = [
  {
    id: "menu-1",
    name: "Rose Pistachio Celebration Cake",
    category: "cakes",
    price: 1450,
    image: "images/product-cake2.jpg",
  },
  {
    id: "menu-2",
    name: "Belgian Chocolate Truffle",
    category: "cakes",
    price: 1650,
    image: "images/product-cake.jpg",
  },
  {
    id: "menu-3",
    name: "Sourdough Country Loaf",
    category: "breads",
    price: 320,
    image: "images/product-cookies.jpg",
  },
  {
    id: "menu-4",
    name: "Butter Croissant",
    category: "pastries",
    price: 180,
    image: "images/product-cake2.jpg",
  },
  {
    id: "menu-5",
    name: "Vanilla Bean Cupcakes",
    category: "pastries",
    price: 420,
    image: "images/product-muffin2.jpg",
  },
  {
    id: "menu-6",
    name: "Hazelnut Espresso Cookies",
    category: "cookies",
    price: 260,
    image: "images/product-cookies.jpg",
  },
];

const reviews = [
  {
    name: "Riya Shukla",
    rating: 5,
    text: "The professional cake batch upgraded my skills fast. The studio vibes are premium.",
  },
  {
    name: "Mohit Verma",
    rating: 4,
    text: "Loved the bread lab. The techniques were practical and the faculty is supportive.",
  },
  {
    name: "Anjali Singh",
    rating: 5,
    text: "Ordered a designer cake and it was absolutely stunning. Great service!",
  },
];


const cart = [];
let orderType = "dinein";
let paymentMode = "online";

const classGrid = document.getElementById("classGrid");
const menuGrid = document.getElementById("menuGrid");
const reviewGrid = document.getElementById("reviewGrid");
const selectedClass = document.getElementById("selectedClass");
const cartCount = document.getElementById("cartCount");
const whatsappBtn = document.getElementById("whatsappBtn");
const upiPayBtn = document.getElementById("upiPayBtn");
const upiEnrollBtn = document.getElementById("upiEnrollBtn");

const cartModal = document.getElementById("cartModal");
const enrollModal = document.getElementById("enrollModal");
const contactModal = document.getElementById("contactModal");

const cartItemsEl = document.getElementById("cartItems");
const cartSubtotalEl = document.getElementById("cartSubtotal");
const cartTaxEl = document.getElementById("cartTax");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutNote = document.getElementById("checkoutNote");

const summarySubtotal = document.getElementById("summarySubtotal");
const summaryTax = document.getElementById("summaryTax");
const summaryTotal = document.getElementById("summaryTotal");
const billContent = document.getElementById("billContent");

const enrollNote = document.getElementById("enrollNote");
const contactNote = document.getElementById("contactNote");

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildUpiLink(amount, note) {
  if (!paymentConfig.upiId) return "#";
  const params = new URLSearchParams({
    pa: paymentConfig.upiId,
    pn: paymentConfig.payeeName,
    am: String(amount || 0),
    cu: "INR",
    tn: note || "JOY Payment",
  });
  return `upi://pay?${params.toString()}`;
}

function updateWhatsAppLink() {
  if (!whatsappBtn || !paymentConfig.whatsappNumber) return;
  const message =
    "Hello JOY Baking School, I want to inquire about classes, cakes, or a custom order.";
  whatsappBtn.href = `https://wa.me/${paymentConfig.whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
}

function updateUpiLinks() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Math.round(subtotal * 0.07);
  const total = subtotal + tax;
  if (upiPayBtn) {
    upiPayBtn.href = buildUpiLink(total, "JOY Bakery Order");
  }
  if (upiEnrollBtn) {
    const classInfo = classes.find((c) => c.id === selectedClass.value);
    if (classInfo) {
      upiEnrollBtn.href = buildUpiLink(
        classInfo.price,
        `Class: ${classInfo.title}`
      );
    }
  }
}

function renderClasses() {
  classGrid.innerHTML = "";
  selectedClass.innerHTML = "";
  classes.forEach((item) => {
    const card = document.createElement("div");
    card.className = "class-card";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}" />
      <div class="class-body">
        <span class="pill">${item.level}</span>
        <h3>${item.title}</h3>
        <p>Date: ${item.date}</p>
        <p>Seats left: ${item.seats}</p>
        <p><strong>${formatCurrency(item.price)}</strong></p>
        <button class="btn primary" data-enroll="${item.id}">Enroll & Pay</button>
      </div>
    `;
    classGrid.appendChild(card);

    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = `${item.title} � ${formatCurrency(item.price)}`;
    selectedClass.appendChild(option);
  });
}

function renderMenu(filter = "all") {
  menuGrid.innerHTML = "";
  menuItems
    .filter((item) => filter === "all" || item.category === filter)
    .forEach((item) => {
      const card = document.createElement("div");
      card.className = "menu-card";
      card.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <div class="menu-body">
          <span class="pill">${item.category.toUpperCase()}</span>
          <h3>${item.name}</h3>
          <p><strong>${formatCurrency(item.price)}</strong></p>
          <button class="btn outline" data-add="${item.id}">Add to Cart</button>
        </div>
      `;
      menuGrid.appendChild(card);
    });
}

function renderReviews() {
  reviewGrid.innerHTML = "";
  reviews.forEach((review) => {
    const card = document.createElement("div");
    card.className = "review-card";
    card.innerHTML = `
      <h3>${review.name}</h3>
      <p>${"?".repeat(review.rating)}${"?".repeat(5 - review.rating)}</p>
      <p>${review.text}</p>
    `;
    reviewGrid.appendChild(card);
  });
}

function updateCart() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  cartItemsEl.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-line">
        <strong>${item.name}</strong>
        <span>${item.qty} � ${formatCurrency(item.price)}</span>
      </div>
    `
    )
    .join("");
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Math.round(subtotal * 0.07);
  const total = subtotal + tax;
  cartSubtotalEl.textContent = formatCurrency(subtotal);
  cartTaxEl.textContent = formatCurrency(tax);
  cartTotalEl.textContent = formatCurrency(total);
  summarySubtotal.textContent = formatCurrency(subtotal);
  summaryTax.textContent = formatCurrency(tax);
  summaryTotal.textContent = formatCurrency(total);
  updateUpiLinks();
}

function openModal(modal) {
  modal.classList.add("show");
}

function closeModal(modal) {
  modal.classList.remove("show");
}

function generateBillSummary() {
  if (!cart.length) {
    billContent.textContent = "Add items to cart to see your bill summary.";
    return;
  }
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Math.round(subtotal * 0.07);
  const total = subtotal + tax;
  billContent.innerHTML = `
    <p>Order type: <strong>${orderType}</strong></p>
    <p>Payment mode: <strong>${paymentMode}</strong></p>
    <p>Items:</p>
    <ul>
      ${cart
        .map((item) => `<li>${item.name} (${item.qty})</li>`)
        .join("")}
    </ul>
    <p>Subtotal: ${formatCurrency(subtotal)}</p>
    <p>Tax & Packaging: ${formatCurrency(tax)}</p>
    <p class="total">Total: ${formatCurrency(total)}</p>
  `;
}

renderClasses();
renderMenu();
renderReviews();
updateCart();
updateWhatsAppLink();
updateUpiLinks();
selectedClass.addEventListener("change", updateUpiLinks);

menuGrid.addEventListener("click", (event) => {
  const addId = event.target.dataset.add;
  if (!addId) return;
  const item = menuItems.find((i) => i.id === addId);
  const existing = cart.find((c) => c.id === addId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCart();
});

classGrid.addEventListener("click", (event) => {
  const enrollId = event.target.dataset.enroll;
  if (!enrollId) return;
  selectedClass.value = enrollId;
  updateUpiLinks();
  openModal(enrollModal);
});

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    renderMenu(button.dataset.filter);
  });
});

document.querySelectorAll(".toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.parentElement;
    group.querySelectorAll(".toggle").forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    if (button.dataset.order) orderType = button.dataset.order;
    if (button.dataset.payment) paymentMode = button.dataset.payment;
  });
});

const enrollButtons = ["openEnroll", "heroEnroll", "openEnroll2"].map((id) => document.getElementById(id));

enrollButtons.forEach((btn) => {
  btn.addEventListener("click", () => openModal(enrollModal));
});

document.getElementById("openCart").addEventListener("click", () => openModal(cartModal));

document.getElementById("heroMenu").addEventListener("click", () => {
  document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("openContact").addEventListener("click", () => openModal(contactModal));

document.querySelectorAll(".close").forEach((button) => {
  button.addEventListener("click", () => closeModal(document.getElementById(button.dataset.close)));
});

window.addEventListener("click", (event) => {
  [cartModal, enrollModal, contactModal].forEach((modal) => {
    if (event.target === modal) closeModal(modal);
  });
});

document.getElementById("enrollForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const classInfo = classes.find((c) => c.id === selectedClass.value);
  const enrollPaymentMode = document.getElementById("paymentMode").value;
  enrollNote.textContent = `Enrollment confirmed for ${classInfo.title}. Payment: ${enrollPaymentMode}.`;
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!cart.length) {
    checkoutNote.textContent = "Your cart is empty. Add items to proceed.";
    return;
  }
  checkoutNote.textContent = `Payment initiated via ${paymentMode}. You will receive a confirmation message.`;
});

document.getElementById("reviewForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("reviewName").value.trim();
  const rating = parseInt(document.getElementById("reviewRating").value, 10);
  const text = document.getElementById("reviewText").value.trim();
  if (!name || !text) return;
  reviews.unshift({ name, rating, text });
  renderReviews();
  event.target.reset();
});

document.getElementById("contactForm").addEventListener("submit", (event) => {
  event.preventDefault();
  contactNote.textContent = "Thanks! We will reach out within 24 hours.";
  event.target.reset();
});

document.getElementById("placeOrder").addEventListener("click", generateBillSummary);



