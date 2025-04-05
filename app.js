// LocalStorage Key
const STORAGE_KEY = 'h8k_orders';
let currentOrder = JSON.parse(localStorage.getItem('currentOrder')) || {};

// Step 1: Select Item
function selectItem(itemName) {
  currentOrder.item = itemName;
  localStorage.setItem('currentOrder', JSON.stringify(currentOrder));
  window.location.href = 'amount.html';
}

// Step 2: Select Amount
function selectAmount(count, price) {
  currentOrder.count = count;
  currentOrder.price = price;
  localStorage.setItem('currentOrder', JSON.stringify(currentOrder));
  window.location.href = 'name.html';
}

// Step 3: Save Name
function saveName() {
  const name = document.getElementById('nameInput').value;
  if (name.trim() === '') return alert("Please enter a name.");
  currentOrder.name = name;
  localStorage.setItem('currentOrder', JSON.stringify(currentOrder));
  window.location.href = 'delivery.html';
}

// Step 4: Submit Final Order
function submitOrder() {
  const delivery = document.getElementById('deliveryInput').value;
  if (delivery.trim() === '') return alert("Please enter delivery info.");
  currentOrder.delivery = delivery;

  let orders = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  orders.push(currentOrder);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));

  // Clear working order
  localStorage.removeItem('currentOrder');
  localStorage.setItem('lastOrder', JSON.stringify(currentOrder));

  window.location.href = 'thanks.html';
}

// Thank You page renderer
window.onload = function () {
  const summaryBox = document.getElementById('summaryBox');
  if (summaryBox) {
    const order = JSON.parse(localStorage.getItem('lastOrder'));
    if (order) {
      summaryBox.innerText = formatOrder(order);
    }
  }

  const adminContainer = document.getElementById('ordersContainer');
  if (adminContainer) {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    orders.forEach((order, index) => {
      const box = document.createElement('div');
      box.className = 'orderBox';
      box.innerText = formatOrder(order);
      const btn = document.createElement('button');
      btn.innerText = 'Completed';
      btn.onclick = () => {
        removeOrder(index);
      };
      box.appendChild(btn);
      adminContainer.appendChild(box);
    });
  }
}

// Admin login logic
function checkAdminPassword() {
  const pass = document.getElementById('adminPass').value;
  if (pass === "Harold&Kevin") {
    window.location.href = 'admin.html';
  } else {
    alert("Incorrect password.");
  }
}

// Format order nicely
function formatOrder(order) {
  return `Name: ${order.name}
Amount owed: $${order.price}
Item: ${order.count} ${order.item}s
When & Where: ${order.delivery}`;
}

// Remove an order
function removeOrder(index) {
  let orders = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  orders.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  window.location.reload();
}
