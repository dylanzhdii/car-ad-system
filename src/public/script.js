let token = null;
let userRole = null;

async function register() {
  const mobile = document.getElementById('mobile').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  const response = await fetch('/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, password, role }),
  });
  const data = await response.json();
  alert(JSON.stringify(data));
}

async function login() {
  const mobile = document.getElementById('mobile').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, password }),
  });
  const data = await response.json();
  if (data.token) {
    token = data.token;
    userRole = data.role;
    document.getElementById('auth').style.display = 'none';
    if (userRole === 'system_user') {
      document.getElementById('create-ad').style.display = 'block';
      document.getElementById('create-transaction').style.display = 'block';
    }
    searchAds();
  } else {
    alert(data.error);
  }
}

async function createAd() {
  const car_id = document.getElementById('car_id').value;
  const price = document.getElementById('price').value;
  const user_id = (await (await fetch('/api/users/me', {
    headers: { 'Authorization': `Bearer ${token}` },
  })).json()).user_id;

  const response = await fetch('/api/ads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ car_id, user_id, price }),
  });
  const data = await response.json();
  alert(JSON.stringify(data));
  searchAds();
}

async function createTransaction() {
  const car_id = document.getElementById('t_car_id').value;
  const buyer_id = document.getElementById('buyer_id').value;
  const seller_id = document.getElementById('seller_id').value;
  const price = document.getElementById('t_price').value;
  const status = document.getElementById('status').value;

  const response = await fetch('/api/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ car_id, buyer_id, seller_id, price, status }),
  });
  const data = await response.json();
  alert(JSON.stringify(data));
}

async function searchAds() {
  const params = new URLSearchParams({
    min_price: document.getElementById('min_price').value,
    max_price: document.getElementById('max_price').value,
    brand: document.getElementById('brand').value,
    color: document.getElementById('color').value,
    condition: document.getElementById('condition').value,
  });

  const response = await fetch(`/api/ads/search?${params}`);
  const ads = await response.json();
  const adsDiv = document.getElementById('ads');
  adsDiv.innerHTML = '<h2>آگهی‌ها</h2>';
  ads.forEach(ad => {
    const adDiv = document.createElement('div');
    adDiv.className = 'ad';
    adDiv.innerHTML = `
      <p>برند: ${ad.brand_name}</p>
      <p>مدل: ${ad.model}</p>
      <p>رنگ: ${ad.color}</p>
      <p>وضعیت: ${ad.condition}</p>
      <p>قیمت: ${ad.price}</p>
      <p>تصاویر: ${ad.images.join(', ')}</p>
      <button onclick="showRelated(${ad.ad_id})">خودروهای مرتبط</button>
      ${userRole === 'admin' || userRole === 'superuser' ? `<button onclick="deleteAd(${ad.ad_id})">حذف</button>` : ''}
    `;
    adsDiv.appendChild(adDiv);
  });
}

async function showRelated(ad_id) {
  const response = await fetch(`/api/ads/${ad_id}/related`);
  const related = await response.json();
  alert(JSON.stringify(related));
}

async function deleteAd(ad_id) {
  const response = await fetch(`/api/ads/${ad_id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  alert(JSON.stringify(data));
  searchAds();
}