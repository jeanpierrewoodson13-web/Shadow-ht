// ============ NAVIGATION ============
function showPage(pageName) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));

  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => btn.classList.remove('active-nav'));

  const selectedPage = document.getElementById(pageName);
  if (selectedPage) {
    selectedPage.classList.add('active');
  }

  const activeBtn = Array.from(navBtns).find(btn => 
    btn.textContent.toLowerCase().includes(pageName) ||
    btn.onclick.toString().includes(`'${pageName}'`)
  );
  if (activeBtn) {
    activeBtn.classList.add('active-nav');
  }

  if (pageName === 'shop') {
    loadShopProducts();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============ BOUTIQUE ============
const products = [
  {
    id: 1,
    name: '110 Diamants 💎',
    price: 160,
    description: 'Pack classique pour débuter',
    icon: '💎'
  },
  {
    id: 2,
    name: 'Abonnement Semaine',
    price: 400,
    description: '7 jours d\'accès complet',
    icon: '📅'
  },
  {
    id: 3,
    name: 'Abonnement Mois',
    price: 1800,
    description: '30 jours illimitées',
    icon: '📆'
  }
];

function loadShopProducts() {
  const shopContainer = document.getElementById('shopContainer');
  shopContainer.innerHTML = '';

  const productGrid = document.createElement('div');
  productGrid.className = 'product-grid';

  products.forEach((product, index) => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.style.animationDelay = (index * 0.1) + 's';
    productCard.innerHTML = `
      <div>${product.icon}</div>
      <h4>${product.name}</h4>
      <p>${product.description}</p>
      <div class="price">${product.price} Goud</div>
      <input type="text" class="input-field" placeholder="ID Free Fire" data-id="fireId-${product.id}">
      <input type="text" class="input-field" placeholder="ID NatCash" data-id="natcash-${product.id}">
      <button class="btn btn-primary" onclick="buyProduct(${product.id})">🛒 Acheter</button>
    `;
    productGrid.appendChild(productCard);
  });

  shopContainer.appendChild(productGrid);
}

function buyProduct(productId) {
  const product = products.find(p => p.id === productId);
  const fireId = document.querySelector(`input[data-id="fireId-${productId}"]`).value.trim();
  const natcashId = document.querySelector(`input[data-id="natcash-${productId}"]`).value.trim();

  if (!fireId) {
    showError('❌ Veuillez entrer votre ID Free Fire');
    return;
  }
  if (!natcashId) {
    showError('❌ Veuillez entrer votre ID NatCash');
    return;
  }

  const confirmMessage = `
✅ COMMANDE CONFIRMÉE!

📦 Produit: ${product.name}
💰 Montant: ${product.price} Goud
🔑 ID FF: ${fireId}
💳 ID NatCash: ${natcashId}

⏳ Votre commande est en cours de traitement...
📱 Vérification NatCash en cours...

Vous recevrez une confirmation par WhatsApp!`;

  alert(confirmMessage);

  document.querySelector(`input[data-id="fireId-${productId}"]`).value = '';
  document.querySelector(`input[data-id="natcash-${productId}"]`).value = '';
}

// ============ LIVRAISON (API) ============

async function getCoordinates(address) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)},Haiti&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'ShadowHTApp/1.0'
        }
      }
    );

    if (!response.ok) throw new Error('Erreur API');

    const data = await response.json();
    if (data.length === 0) {
      throw new Error('Localité non trouvée');
    }

    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
      name: data[0].display_name
    };
  } catch (error) {
    console.error('Erreur:', error);
    throw new Error('Impossible de récupérer les coordonnées');
  }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function estimateDeliveryTime(distance) {
  let days = Math.ceil(distance / 60);
  if (days < 1) days = 1;
  if (days > 3) days = 3;
  return days;
}

async function calculateDelivery() {
  const fromAddress = document.getElementById('fromAddress').value.trim();
  const toAddress = document.getElementById('toAddress').value.trim();
  const resultDiv = document.getElementById('deliveryResult');

  if (!fromAddress || !toAddress) {
    showError('Veuillez remplir les deux champs');
    return;
  }

  resultDiv.innerHTML = '⏳ Calcul en cours...';
  resultDiv.classList.add('show');

  try {
    const from = await getCoordinates(fromAddress);
    const to = await getCoordinates(toAddress);

    const distance = calculateDistance(from.latitude, from.longitude, to.latitude, to.longitude);
    const days = estimateDeliveryTime(distance);
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + days);

    resultDiv.innerHTML = `
      <h4>📊 Résultats du calcul</h4>
      <p><strong>De:</strong> ${from.name}</p>
      <p><strong>Vers:</strong> ${to.name}</p>
      <p><strong>Distance:</strong> <strong style="color: #4da3ff;">${distance.toFixed(2)} km</strong></p>
      <p><strong>Temps estimé:</strong> <strong style="color: #25d366;">${days} jour${days > 1 ? 's' : ''}</strong></p>
      <p><strong>Date de livraison:</strong> ${deliveryDate.toLocaleDateString('fr-FR')}</p>
      <p style="margin-top: 15px; color: #25d366;">
        ✅ Livraison gratuite partout en Haïti!
      </p>
    `;
    resultDiv.classList.add('success');
    resultDiv.classList.remove('error');

    showTracking(days);
  } catch (error) {
    console.error('Erreur:', error);
    resultDiv.innerHTML = `<p style="color: #ff8888;">❌ ${error.message}</p>`;
    resultDiv.classList.add('error');
    resultDiv.classList.remove('success');
  }
}

function showTracking(days) {
  const trackingCard = document.getElementById('trackingCard');
  const trackingInfo = document.getElementById('trackingInfo');

  const statuses = [
    { label: '✓ Commande confirmée', status: 'done' },
    { label: '✓ Paiement vérifiée', status: 'done' },
    { label: '✓ En préparation', status: 'done' },
    { label: '→ En transit', status: 'pending' },
    { label: '→ Livraison en cours', status: 'pending' },
    { label: '→ Livrée', status: 'pending' }
  ];

  trackingInfo.innerHTML = statuses.map(s => `
    <div class="tracking-step">
      <div class="status ${s.status === 'pending' ? 'pending' : ''}"></div>
      <div class="label">${s.label}</div>
    </div>
  `).join('');

  trackingCard.style.display = 'block';
}

// ============ MESSAGES ============
function showError(message) {
  const resultDiv = document.createElement('div');
  resultDiv.className = 'result error show';
  resultDiv.innerHTML = `<p>${message}</p>`;

  const currentPage = document.querySelector('.page.active');
  const existingError = currentPage.querySelector('.result.error');
  if (existingError) existingError.remove();
  currentPage.appendChild(resultDiv);

  setTimeout(() => resultDiv.remove(), 5000);
}

// ============ INITIALISATION ============
document.addEventListener('DOMContentLoaded', function () {
  console.log('✅ ShadowHT App chargée avec succès!');
  console.log('🚀 Prêt à servir vos recharges Free Fire!');
});
