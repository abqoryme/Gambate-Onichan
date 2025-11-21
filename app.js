        // data
        const PRODUCTS = [
            {id:1, title:'Headphone Wireless X1', price: 599000, tag:'Audio', img:'https://img.lazcdn.com/g/p/69681c185bb59a523f21041ae0fa8cf9.jpg_720x720q80.jpg', desc:'Suara jernih, nyaman dipakai seharian.'},
            {id:2, title:'Smartwatch Pro', price: 1299000, tag:'Gadget', img:'https://bimg.akulaku.net/goods/spu/6c5b4a3fa8864c61b21aadd1e0d287531583.jpg?w=726&q=80&fit=1', desc:'Pantau kesehatan dan notifikasi pintar.'},
            {id:3, title:'Kamera Mirrorless M7', price:5499000,tag:'Foto',img:'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//105/MTA-2296977/sony_sony-a-ilce-7m3-bo-black_full02.jpg',desc:'Ringan, hasil tajam untuk konten profesional.'},
            {id:4,title:'Laptop SlimBook 14"',price:8990000,tag:'Komputer',img:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60',desc:'Performa tinggi, desain elegan.'},
            {id:5,title:'Speaker Bluetooth Beat',price:299000,tag:'Audio',img:'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=60',desc:'Bass kuat, tahan air IPX5.'},
            {id:6, title:'Mouse Wireless Ergonomic', price: 150000, tag:'Aksesoris', img:'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//91/MTA-44030852/logitech_logitech_lift_mouse_ergonomic_vertical_wireless_bluetooth_silent_graphite_full01_kuz6181p.jpg', desc:'Desain nyaman untuk jari dan pergelangan.'},
            {id:7, title:'Burger', price: 15000, tag:'Makanan', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn5Tiq2wHT82rWb3MdQ8w10fiiLhEJuTUw_g&s', desc:'Daging cincang, Roti.'},
            {id:8, title:'Susu Sapi Murni', price: 20000, tag:'Minuman', img:'https://res.cloudinary.com/dk0z4ums3/image/upload/v1732948205/attached_image/susu-sapi-inilah-kandungan-nutrisi-dan-manfaatnya-bagi-kesehatan.jpg', desc:'Susu sapi minuman tinggi protein yang diperoleh langsung dari sapi perah di peternakan.'}
        ];

        // Fungsi rupiah
        const $ = id => document.getElementById(id);
        function formatIDR(n){ return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR'}).format(n); }

        // Render products
        function renderProducts(){
            const q = $('search').value.trim().toLowerCase();
            const sort = $('sort').value;
            let list = PRODUCTS.filter(p => p.title.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q));
            if(sort==='price-asc') list.sort((a,b)=>a.price-b.price);
            if(sort==='price-desc') list.sort((a,b)=>b.price-a.price);
            if (sort === 'foodstuffs') {
                // hanya tampilkan produk dengan tag "Makanan" dan "Minuman"
                list = list.filter(p => p.tag === 'Makanan' || p.tag === 'Minuman');
            }
            // popular
            const container = $('products');
            container.innerHTML = '';
            for(const p of list){
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="${p.img}" alt="${escapeHTML(p.title)}" />
                    <h4>${escapeHTML(p.title)}</h4>
                    <div style="display:flex;justify-content:space-between;align-items:center">
                        <div class="tag">${escapeHTML(p.tag)}</div>
                        <div class="price">${formatIDR(p.price)}</div>
                    </div>
                    <p class="muted" style="margin:6px 0 0 0">${short(p.desc,70)}</p>
                    <div class="price-row">
                        <button class="btn secondary" onclick="openProduct(${p.id})">Detail</button>
                        <button class="btn" onclick="addToCart(${p.id})">Tambah</button>
                    </div>
                `;
                container.appendChild(card);
            }
        }
        function short(s,n){ return s.length>n ? s.slice(0,n-1)+'…' : s; }
        function escapeHTML(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

        // Auth (client-side demo)
        function openAuth(){ $('authModal').style.display='flex'; $('authModal').ariaHidden='false'; }
        function closeAuth(){ $('authModal').style.display='none'; $('authModal').ariaHidden='true'; }
        function switchAuth(tab){
            if(tab==='login'){
                $('tab-login').classList.add('active'); $('tab-login').setAttribute('aria-selected','true');
                $('tab-register').classList.remove('active'); $('tab-register').setAttribute('aria-selected','false');
                $('loginView').style.display='block'; $('registerView').style.display='none';
            } else {
                $('tab-register').classList.add('active'); $('tab-register').setAttribute('aria-selected','true');
                $('tab-login').classList.remove('active'); $('tab-login').setAttribute('aria-selected','false');
                $('loginView').style.display='none'; $('registerView').style.display='block';
            }
        }

        function getUsers(){ return JSON.parse(localStorage.getItem('users')||'{}'); }
        function saveUsers(u){ localStorage.setItem('users',JSON.stringify(u)); }

        function doRegister(){
            const name = $('regName').value.trim();
            const email = $('regEmail').value.trim().toLowerCase();
            const p1 = $('regPassword').value;
            const p2 = $('regPassword2').value;
            if(!name||!email||!p1) return alert('Isi semua data dengan benar.');
            if(p1!==p2) return alert('Kata sandi tidak cocok.');
            const users = getUsers();
            if(users[email]) return alert('Email sudah terdaftar.');
            users[email] = {name, email, pwd: btoa(p1)}; // Demo only: base64 encoded
            saveUsers(users);
            alert('Pendaftaran berhasil. Silakan masuk.');
            switchAuth('login');
        }

        function doLogin(){
            const email = $('loginEmail').value.trim().toLowerCase();
            const pwd = $('loginPassword').value;
            const users = getUsers();
            if(!users[email] || users[email].pwd !== btoa(pwd)) return alert('Email atau kata sandi salah.');
            localStorage.setItem('currentUser', JSON.stringify(users[email]));
            closeAuth();
            updateAuthUI();
        }

        function logout(){
            localStorage.removeItem('currentUser');
            updateAuthUI();
        }

        function updateAuthUI(){
        const authArea = $('authArea');
        const welcome = $('welcome');
        const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if(user){
        authArea.innerHTML = `
            <div class="user-chip" onclick="toggleUserMenu()">
                <div class="avatar">
                    ${escapeHTML((user.name.trim()[0] || 'U').toUpperCase())}
                </div>
            </div>
            <div id="userMenu" class="user-menu">
                <div class="menu-header">
                    <strong>${escapeHTML(user.name)}</strong><br>
                    <small>${escapeHTML(user.email)}</small>
                </div>
                <button onclick="logout()">Keluar</button>
            </div>
        `;
        welcome.innerHTML = `Hallo, <strong>${escapeHTML(user.name)}</strong> silahkan dilihat-lihat produk kami yah dan jangan lupa checkout~! Terima Kasih Kak`;
    } else {
        authArea.innerHTML = `<button class="btn" onclick="openAuth()">Masuk / Daftar</button>`;
        welcome.innerHTML = 'Silakan masuk untuk melihat fitur penuh.';
    }
 }

        // Cart (simple)
        function getCart(){ return JSON.parse(localStorage.getItem('cart')||'[]'); }
        function saveCart(c){ localStorage.setItem('cart', JSON.stringify(c)); updateCartCount(); }
        function addToCart(id){
            const user = JSON.parse(localStorage.getItem('currentUser')||'null');
            if(!user){ openAuth(); alert('Silakan masuk terlebih dahulu.'); return; }
            const p = PRODUCTS.find(x=>x.id===id);
            if(!p) return;
            const cart = getCart();
            const item = cart.find(i=>i.id===id);
            if(item) item.qty++;
            else cart.push({id:p.id,title:p.title,price:p.price,qty:1});
            saveCart(cart);
            alert('Produk ditambahkan ke keranjang.');
        }
        function addToCartFromModal(){
            const id = parseInt($('productModal').dataset.productId,10);
            addToCart(id);
            closeProduct();
        }
        function openCart(){
            const cart = getCart();
            if(cart.length===0) return alert('Keranjang kosong.');
            let s = 'Isi keranjang:\\n';
            for(const it of cart) s += `${it.title} x${it.qty} — ${formatIDR(it.price*it.qty)}\\n`;
            s += '\\nTotal: ' + formatIDR(cart.reduce((a,b)=>a+b.price*b.qty,0));
            alert(s);
        }
        function clearCart(){ localStorage.removeItem('cart'); updateCartCount(); alert('Keranjang dikosongkan.'); }
        function checkout(){
            const user = JSON.parse(localStorage.getItem('currentUser')||'null');
            if(!user){ openAuth(); alert('Silakan masuk untuk checkout.'); return; }
            const cart = getCart();
            if(cart.length===0) return alert('Keranjang kosong.');
            // Demo: simple checkout simulation
            const total = cart.reduce((a,b)=>a+b.price*b.qty,0);
            clearCart();
            alert(`Checkout berhasil. Total pembayaran: ${formatIDR(total)}\\nTerima kasih, ${user.name}!`);
        }
        function updateCartCount(){
            const cart = getCart();
            const count = cart.reduce((a,b)=>a+b.qty,0);
            const el = $('cartCount');
            if(count>0){ el.style.display='block'; el.textContent = count; }
            else el.style.display='none';
        }

        // Product modal
        function openProduct(id){
            const p = PRODUCTS.find(x=>x.id===id);
            if(!p) return;
            $('pmImg').src = p.img;
            $('pmTitle').textContent = p.title;
            $('pmPrice').textContent = formatIDR(p.price);
            $('pmDesc').textContent = p.desc;
            const modal = $('productModal');
            modal.dataset.productId = id;
            modal.style.display='flex';
            modal.ariaHidden='false';
        }
        function closeProduct(){ const modal=$('productModal'); modal.style.display='none'; modal.ariaHidden='true'; }

        // Helpers
        function resetFilters(){ $('search').value=''; $('sort').value='popular'; renderProducts(); }
        function scrollToTop(e){ e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}); }

        // Init
        (function init(){
            renderProducts();
            updateAuthUI();
            document.querySelectorAll('.modal-backdrop').forEach(back=>{
                back.addEventListener('click', e=>{
                    if(e.target === back) { back.style.display='none'; back.ariaHidden='true'; }
                });
            });
            
            document.addEventListener('keydown', e=>{
                if(e.key==='Escape'){
                    document.querySelectorAll('.modal-backdrop').forEach(b=>b.style.display='none');
                    document.querySelectorAll('.modal-backdrop').forEach(b=>b.ariaHidden='true');
                }
            });
        })();
        
        // pop up profile
        function toggleUserMenu() {
  	  const menu = $('userMenu');
    menu?.classList.toggle('show');
}
    document.addEventListener("click", (e) => {
    const menu = $('userMenu');
    const chip = e.target.closest(".user-chip");
    const insideMenu = e.target.closest("#userMenu");
    if (!chip && !insideMenu && menu?.classList.contains("show")) {
        menu.classList.remove("show");
    }
    })
    document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape"){
        $('userMenu')?.classList.remove("show");
    }
    })
    let lastScrollTop = 0;
    window.addEventListener("scroll", () => {
    const menu = $('userMenu');
    if (!menu) return;
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (menu.classList.contains("show") && Math.abs(currentScroll - lastScrollTop) > 5) {
        menu.classList.remove("show");
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});


function openCartModal(){
    const modal = $('cartModal');
    modal.style.display = "flex";
    renderCartModal();
}

function closeCartModal(){
    $('cartModal').style.display = "none";
}

function renderCartModal(){
    const cart = getCart();
    const container = $('cartModalContent');
    const totalEl = $('cartTotalPrice');
    if(cart.length === 0){
        container.innerHTML = `
            <div class="muted" style="text-align:center;padding:20px">Keranjang kosong.</div>
        `;
        totalEl.innerText = "Rp0";
        return;
    }
    let html = "";
    let total = 0;
    cart.forEach((item, i)=>{
        total += item.price * item.qty;
        html += `
            <div class="cart-item">
         <div class="cart-title">${escapeHTML(item.title)}</div>
                <div class="cart-controls">
                    <button class="qty-btn" onclick="changeQty(${i}, -1)">−</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${i}, 1)">+</button>
                </div>
                <div class="cart-price">${formatIDR(item.price * item.qty)}</div>
                <button class="del-btn" onclick="removeItem(${i})">✕</button>
            </div>
        `;
    });
    container.innerHTML = html;
    totalEl.innerText = formatIDR(total);
}

function checkoutToWA(){
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    if(!user){ openAuth(); alert("Silakan masuk terlebih dahulu."); return; }
    const cart = getCart();
    if(cart.length === 0){ alert("Keranjang kosong."); return; }
    let message = `🛒 *Checkout Pesanan*\n\n👤 Nama: ${user.name}\n📩 Email: ${user.email}\n\n*Detail Barang:*\n`;
    cart.forEach(it=>{
        message += `• ${it.title} x${it.qty} = ${formatIDR(it.qty * it.price)}\n`;
    });
    const total = cart.reduce((a,b)=>a + b.price*b.qty,0);
    message += `\n💵 *Total: ${formatIDR(total)}*\n\nMohon diproses ya`;
    const waURL = `https://wa.me/6285811725174?text=${encodeURIComponent(message)}`;
    window.open(waURL, "_blank");
    localStorage.removeItem("cart");
    updateCartCount();
    closeCartModal();
}

function changeQty(index, delta){
    const cart = getCart();
    cart[index].qty += delta;
    if(cart[index].qty <= 0){
        cart.splice(index, 1);
    }
    saveCart(cart);
    updateCartCount();
    renderCartModal();
}

function removeItem(index){
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    updateCartCount();
    renderCartModal();
}

function showToast(message){
    const toast = $("toast");
    toast.innerHTML = `
        <span>${message}</span>
        <button onclick="openCartModal()">Lihat Keranjang</button>
    `;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function addToCart(id){
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    if(!user){ openAuth(); return; }
    const p = PRODUCTS.find(x => x.id === id);
    if(!p) return;
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if(item) item.qty++;
    else cart.push({id:p.id, title:p.title, price:p.price, qty:1});
    saveCart(cart);
    updateCartCount();
    showToast(`✔ Ditambahkan: <strong>${p.title}</strong>`);
}

function getCart(){ 
    return JSON.parse(localStorage.getItem('cart') || '[]'); 
}

function saveCart(c){ 
    localStorage.setItem('cart', JSON.stringify(c)); 
}

function updateCartCount(){
    const cart = getCart();
    const count = cart.reduce((a,b)=>a + b.qty, 0);
    const el = $('cartCount');
    if(count > 0){
        el.style.display = "block";
        el.textContent = count;
    } else {
        el.style.display = "none";
    }
}

function checkoutModal(){
    const cart = getCart();
    if(cart.length === 0){
        alert("Keranjang kosong.");
        return;
    }
    const total = cart.reduce((a,b)=>a + b.price * b.qty, 0);
    // Hapus cart
    localStorage.removeItem('cart');
    updateCartCount();
    $('cartModalContent').innerHTML = `
        <div style="text-align:center;padding:40px 10px">
            <h3>Checkout Berhasil!</h3>
            <p class="muted">Total pembayaran:</p>
            <p><strong>${formatIDR(total)}</strong></p>
            <p class="muted">Terima kasih telah berbelanja.</p>
        </div>
    `;
    $('cartTotalPrice').innerText = "Rp0";
}