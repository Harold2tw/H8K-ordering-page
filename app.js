// Get Firebase Firestore via global window from HTML
const db = window.db;
const { collection, addDoc, getDocs, deleteDoc, doc } = window.firestoreFns;

const ORDER_COLLECTION = "orders";

// ----- ORDER FLOW FUNCTIONS -----

function selectItem(item) {
  localStorage.setItem("selectedItem", item);
  window.location.href = "amount.html";
}

function selectAmount(amount, price) {
  localStorage.setItem("selectedAmount", amount);
  localStorage.setItem("selectedPrice", price);
  window.location.href = "name.html";
}

function saveName() {
  const name = document.getElementById("nameInput").value;
  localStorage.setItem("customerName", name);
  window.location.href = "delivery.html";
}

async function submitOrder() {
  const item = localStorage.getItem("selectedItem");
  const amount = localStorage.getItem("selectedAmount");
  const price = localStorage.getItem("selectedPrice");
  const name = localStorage.getItem("customerName");
  const delivery = document.getElementById("deliveryInput").value;

  const order = {
    item,
    amount,
    price,
    name,
    delivery,
    timestamp: new Date().toISOString()
  };

  try {
    await addDoc(collection(db, ORDER_COLLECTION), order);
    localStorage.setItem("lastOrder", JSON.stringify(order));
    window.location.href = "thanks.html";
  } catch (e) {
    alert("Failed to submit order: " + e.message);
  }
}

// ----- ADMIN FUNCTIONS -----

async function loadOrders() {
  const container = document.getElementById("ordersContainer");
  if (!container) return;

  const snapshot = await getDocs(collection(db, ORDER_COLLECTION));
  container.innerHTML = "";

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const orderBox = document.createElement("div");
    orderBox.className = "order-box";
    orderBox.innerHTML = `
      <strong>${data.name}</strong><br>
      Item: ${data.item}<br>
      Amount: ${data.amount}<br>
      Price: $${data.price}<br>
      Delivery: ${data.delivery}<br>
      <button onclick="deleteOrder('${docSnap.id}')">Completed</button>
    `;
    container.appendChild(orderBox);
  });
}

async function deleteOrder(id) {
  try {
    await deleteDoc(doc(db, ORDER_COLLECTION, id));
    loadOrders(); // refresh the list
  } catch (e) {
    alert("Failed to delete order: " + e.message);
  }
}

// ----- THANK YOU PAGE LOAD -----

window.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("thanks.html")) {
    const box = document.getElementById("summaryBox");
    const order = JSON.parse(localStorage.getItem("lastOrder"));
    if (box && order) {
      box.innerHTML = `
        <p><strong>${order.name}</strong>, thank you for ordering!</p>
        <p>Item: ${order.item}</p>
        <p>Amount: ${order.amount}</p>
        <p>Total: $${order.price}</p>
        <p>Delivery: ${order.delivery}</p>
      `;
    }
  }

  if (window.location.pathname.includes("admin.html")) {
    loadOrders();
  }
});

// ----- ADMIN LOGIN -----

function checkAdminPassword() {
  const input = document.getElementById("adminPass").value;
  if (input === "Harold&Kevin") {
    window.location.href = "admin.html";
  }
}
