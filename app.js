/* ==========================================
   PRODUCT DATA + STORAGE
========================================== */

const STORAGE_KEY = "productAdvertisementProducts";

const defaultProducts = [
    {
        id: "default-1",
        name: "Dell Laptop",
        category: "Laptop",
        price: 85000,
        description: "Core i5 Laptop for students.",
        image: "https://picsum.photos/300/200?random=1",
        contact: "+92-321-1234567"
    },
    {
        id: "default-2",
        name: "HP Laptop",
        category: "Laptop",
        price: 95000,
        description: "Core i7 Laptop.",
        image: "https://picsum.photos/300/200?random=2",
        contact: "+92-321-1234567"
    },
    {
        id: "default-3",
        name: "Samsung Phone",
        category: "Phone",
        price: 45000,
        description: "Android smartphone.",
        image: "https://picsum.photos/300/200?random=3",
        contact: "+92-321-1234567"
    },
    {
        id: "default-4",
        name: "iPhone",
        category: "Phone",
        price: 100000,
        description: "Apple smartphone.",
        image: "https://picsum.photos/300/200?random=4",
        contact: "+92-321-1234567"
    },
    {
        id: "default-5",
        name: "Smart Watch",
        category: "Watch",
        price: 12000,
        description: "Digital smartwatch.",
        image: "https://picsum.photos/300/200?random=5",
        contact: "+92-321-1234567"
    },
    {
        id: "default-6",
        name: "Headphones",
        category: "Accessories",
        price: 3500,
        description: "Wireless headphones.",
        image: "https://picsum.photos/300/200?random=6",
        contact: "+92-321-1234567"
    },
    {
        id: "default-7",
        name: "Keyboard",
        category: "Accessories",
        price: 2500,
        description: "USB keyboard.",
        image: "https://picsum.photos/300/200?random=7",
        contact: "+92-321-1234567"
    },
    {
        id: "default-8",
        name: "Mouse",
        category: "Accessories",
        price: 1200,
        description: "Optical mouse.",
        image: "https://picsum.photos/300/200?random=8",
        contact: "+92-321-1234567"
    },
    {
        id: "default-9",
        name: "Gaming Laptop",
        category: "Laptop",
        price: 99000,
        description: "Laptop for gaming.",
        image: "https://picsum.photos/300/200?random=9",
        contact: "+92-321-1234567"
    },
    {
        id: "default-10",
        name: "Digital Watch",
        category: "Watch",
        price: 4500,
        description: "Simple digital watch.",
        image: "https://picsum.photos/300/200?random=10",
        contact: "+92-321-1234567"
    }
];

let products = loadProducts();

/* ==========================================
   DOM REFERENCES
========================================== */

const productContainer = document.getElementById("productContainer");
const resultCount = document.getElementById("resultCount");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const priceSelect = document.getElementById("price");
const productForm = document.getElementById("productForm");
const formMessage = document.getElementById("formMessage");
const productCategory = document.getElementById("productCategory");
const productPrice = document.getElementById("productPrice");

/* ==========================================
   INITIALISE
========================================== */

document.addEventListener("DOMContentLoaded", init);

function init() {
    displayProducts(products);
    setupEventListeners();
}

/* ==========================================
   LOCAL STORAGE
========================================== */

function loadProducts() {
    try {
        const savedProducts = localStorage.getItem(STORAGE_KEY);

        if (!savedProducts) {
            return [...defaultProducts];
        }

        const parsedProducts = JSON.parse(savedProducts);

        return Array.isArray(parsedProducts) && parsedProducts.length > 0
            ? parsedProducts
            : [...defaultProducts];
    } catch (error) {
        console.error("Could not load saved products:", error);
        return [...defaultProducts];
    }
}

function saveProducts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

/* ==========================================
   DISPLAY PRODUCTS
========================================== */

function displayProducts(productList) {
    productContainer.replaceChildren();

    resultCount.textContent =
        `Showing ${productList.length} of ${products.length} products`;

    if (productList.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "empty-state";

        const message = document.createElement("p");
        message.textContent = "No products match your search.";

        emptyState.append(message);
        productContainer.append(emptyState);
        return;
    }

    const fragment = document.createDocumentFragment();

    productList.forEach((product) => {
        const card = document.createElement("article");
        card.className = "product";
        card.dataset.id = product.id;

        const image = document.createElement("img");
        image.src = isSafeImageUrl(product.image)
            ? product.image
            : "https://picsum.photos/300/200?random=100";
        image.alt = product.name;
        image.loading = "lazy";

        const title = document.createElement("h3");
        title.textContent = product.name;

        const category = document.createElement("p");
        category.innerHTML = "<b>Category:</b> ";
        category.append(document.createTextNode(product.category));

        const price = document.createElement("p");
        price.innerHTML = "<b>Price:</b> ";
        price.append(document.createTextNode(formatPrice(product.price)));

        const description = document.createElement("p");
        description.textContent = product.description;

        const contactButton = document.createElement("button");
        contactButton.type = "button";
        contactButton.dataset.action = "contact";
        contactButton.textContent = "Contact Seller";

        card.append(
            image,
            title,
            category,
            price,
            description,
            contactButton
        );

        fragment.append(card);
    });

    productContainer.append(fragment);
}

/* ==========================================
   SEARCH + FILTER
========================================== */

function filterProducts() {
    const searchText = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;
    const price = priceSelect.value;

    const filtered = products.filter((product) => {
        const searchMatch =
            product.name.toLowerCase().includes(searchText);

        const categoryMatch =
            category === "All" ||
            product.category === category;

        const priceMatch =
            price === "All" ||
            product.price <= Number(price);

        return searchMatch && categoryMatch && priceMatch;
    });

    displayProducts(filtered);
}

function debounce(callback, delay) {
    let timeoutId;

    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => callback(...args), delay);
    };
}

/* ==========================================
   EVENT LISTENERS
========================================== */

function setupEventListeners() {
    searchInput.addEventListener(
        "input",
        debounce(filterProducts, 250)
    );

    categorySelect.addEventListener("change", filterProducts);
    priceSelect.addEventListener("change", filterProducts);

    productContainer.addEventListener("click", handleProductClick);
    productForm.addEventListener("submit", handleProductSubmit);
}

/* ==========================================
   CONTACT SELLER
========================================== */

function handleProductClick(event) {
    const button = event.target.closest("[data-action='contact']");

    if (!button) {
        return;
    }

    const card = button.closest(".product");

    if (!card) {
        return;
    }

    const product = products.find(
        (item) => item.id === card.dataset.id
    );

    if (!product) {
        return;
    }

    const message = document.createElement("p");
    message.textContent =
        `Seller contact for ${product.name}: ${product.contact}`;

    message.className = "form-message success";

    card.querySelector(".seller-message")?.remove();
    message.classList.add("seller-message");
    card.append(message);
}

/* ==========================================
   POST PRODUCT FORM
========================================== */

function handleProductSubmit(event) {
    event.preventDefault();
    clearFormMessage();

    const formData = new FormData(productForm);

    const name = formData.get("productName").trim();
    const category = formData.get("productCategory");
    const price = Number(formData.get("productPrice"));
    const description = formData.get("productDescription").trim();
    const image = formData.get("productImage").trim();
    const contact = formData.get("contactNumber").trim();

    if (
        !name ||
        !category ||
        !description ||
        !contact ||
        !Number.isFinite(price) ||
        price < 0
    ) {
        showFormMessage(
            "Please enter valid information in all required fields.",
            "error"
        );
        return;
    }

    if (image && !isSafeImageUrl(image)) {
        showFormMessage(
            "Please enter a valid HTTP or HTTPS image URL.",
            "error"
        );
        return;
    }

    const newProduct = {
        id: createId(),
        name,
        category,
        price,
        description,
        image: image || "https://picsum.photos/300/200?random=200",
        contact
    };

    products.push(newProduct);
    saveProducts();
    productForm.reset();

    displayProducts(products);

    showFormMessage(
        `${name} was posted successfully and saved on this device.`,
        "success"
    );
}

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
}

function clearFormMessage() {
    formMessage.textContent = "";
    formMessage.className = "form-message";
}

/* ==========================================
   HELPERS
========================================== */

function formatPrice(price) {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0
    }).format(price);
}

function isSafeImageUrl(value) {
    try {
        const url = new URL(value);

        return (
            url.protocol === "https:" ||
            url.protocol === "http:"
        );
    } catch {
        return false;
    }
}

function createId() {
    if (window.crypto?.randomUUID) {
        return window.crypto.randomUUID();
    }

    return `product-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
