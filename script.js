
const starterMenu = [
  { id: 1, name: "Veg Sandwich", price: 40, stock: 15, active: true },
  { id: 2, name: "Masala Dosa", price: 60, stock: 10, active: true },
  { id: 3, name: "Veg Fried Rice", price: 80, stock: 0, active: true },
  { id: 4, name: "Karak Tea", price: 15, stock: 25, active: true }
];

let menu = JSON.parse(localStorage.getItem("canteenMenu") || "null")
  || starterMenu;
let editingId = null;

const form = document.getElementById("menuForm");
const nameInput = document.getElementById("foodName");
const priceInput = document.getElementById("foodPrice");
const stockInput = document.getElementById("foodStock");
const searchInput = document.getElementById("search");

function saveMenu() {
  localStorage.setItem("canteenMenu", JSON.stringify(menu));
}

function renderMenu() {
  const list = document.getElementById("menuList");
  const query = searchInput.value.trim().toLowerCase();
  list.replaceChildren();

  menu.filter(item => item.name.toLowerCase().includes(query))
    .forEach(item => {
      const card = document.createElement("article");
      card.className = "food-card";

      const title = document.createElement("h3");
      title.textContent = item.name;

      const price = document.createElement("p");
      price.textContent = `Price: ₹${item.price.toFixed(2)}`;

      const stock = document.createElement("p");
      stock.textContent = `Stock: ${item.stock}`;

      const status = document.createElement("p");
      status.className = "status " +
        (item.active && item.stock > 0 ? "available" : "unavailable");
      status.textContent = item.active && item.stock > 0
        ? "Available" : "Unavailable";

      const actions = document.createElement("div");
      actions.className = "actions";

      const edit = document.createElement("button");
      edit.textContent = "Edit";
      edit.addEventListener("click", () => editFood(item.id));

      const toggle = document.createElement("button");
      toggle.textContent = item.active ? "Disable" : "Enable";
      toggle.addEventListener("click", () => {
        item.active = !item.active;
        saveMenu();
        renderMenu();
      });

      const remove = document.createElement("button");
      remove.textContent = "Delete";
      remove.addEventListener("click", () => {
        menu = menu.filter(food => food.id !== item.id);
        saveMenu();
        renderMenu();
      });

      actions.append(edit, toggle, remove);
      card.append(title, price, stock, status, actions);
      list.append(card);
    });
}

function editFood(id) {
  const item = menu.find(food => food.id === id);
  if (!item) return;

  editingId = id;
  nameInput.value = item.name;
  priceInput.value = item.price;
  stockInput.value = item.stock;
  document.getElementById("saveButton").textContent = "Update Food";
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const price = Number(priceInput.value);
  const stock = Number(stockInput.value);

  if (!name || !Number.isFinite(price) || price <= 0 ||
      !Number.isInteger(stock) || stock < 0) {
    document.getElementById("message").textContent =
      "Enter a valid name, positive price and non-negative stock.";
    return;
  }

  if (editingId !== null) {
    const item = menu.find(food => food.id === editingId);
    if (item) Object.assign(item, { name, price, stock });
    editingId = null;
    document.getElementById("saveButton").textContent = "Add Food";
  } else {
    menu.push({
      id: Date.now(),
      name,
      price,
      stock,
      active: true
    });
  }

  saveMenu();
  form.reset();
  document.getElementById("message").textContent = "Menu saved successfully.";
  renderMenu();
});

searchInput.addEventListener("input", renderMenu);
renderMenu();
