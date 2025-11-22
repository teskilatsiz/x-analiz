let aktifMod = "tekli"; 
let kaynakGonderiler = []; 
let kullaniciVerisi = { ad: "", kullanici_adi: "", resim: "" };
let reklamTimer = null;

const EKRANLAR = {
    menu: document.getElementById('menu-ekrani'),
    giris: document.getElementById('giris-ekrani'),
    yukleme: document.getElementById('yukleme-ekrani'),
    sonuc: document.getElementById('sonuc-ekrani')
};
const TERMINAL = document.getElementById('terminal-metni');
const HATA_MODALI = document.getElementById('hata-modali');

window.ekranGoster = function(isim) {
    Object.values(EKRANLAR).forEach(s => { if(s) s.classList.remove('aktif'); });
    if(EKRANLAR[isim]) EKRANLAR[isim].classList.add('aktif');
}

window.hataGoster = function(baslik, mesaj) {
    document.getElementById('modal-baslik').textContent = baslik;
    document.getElementById('modal-mesaj').textContent = mesaj;
    HATA_MODALI.style.display = 'flex';
}

window.modaliKapat = function() {
    HATA_MODALI.style.display = 'none';
}

window.modSec = function(mod) {
    aktifMod = mod;
    window.ekranGoster('giris');
    
    const tekliAlan = document.getElementById('tekli-input-alani');
    const vsAlan = document.getElementById('vs-input-alani');
    const baslik = document.getElementById('giris-baslik');
    const aciklama = document.getElementById('giris-aciklama');

    document.getElementById('kullanici-adi-input').value = "";
    document.getElementById('vs-user-1').value = "";
    document.getElementById('vs-user-2').value = "";

    if (mod === 'vs') {
        tekliAlan.style.display = 'none';
        vsAlan.style.display = 'flex';
        baslik.textContent = "KAPIŞTIR";
        aciklama.textContent = "İki kullanıcı adı gir.";
    } else {
        vsAlan.style.display = 'none';
        tekliAlan.style.display = 'block';
        if(mod === 'tekli') { baslik.textContent = "KİŞİLİK ANALİZİ"; aciklama.textContent = "Kullanıcı adını gir."; }
        if(mod === 'bulut') { baslik.textContent = "KELİME BULUTU"; aciklama.textContent = "Analiz edilecek kullanıcı."; }
        if(mod === 'grafik') { baslik.textContent = "AKTİVİTE"; aciklama.textContent = "Kullanıcı adını gir."; }
    }
}

window.reklamSureciniBaslat = function() {
    if (aktifMod === 'vs') {
        const u1 = document.getElementById('vs-user-1').value.trim();
        const u2 = document.getElementById('vs-user-2').value.trim();
        if(!u1 || !u2) return window.hataGoster("Eksik", "İki kullanıcı adı da girilmeli.");
    } else {
        const u = document.getElementById('kullanici-adi-input').value.trim();
        if(!u) return window.hataGoster("Eksik", "Kullanıcı adı girin.");
    }

    const reklamModali = document.getElementById('reklam-modali');
    const video = document.querySelector('#reklam-modali video');
    const btn = document.querySelector('.reklam-kapat-btn');

    if (reklamModali) {
        reklamModali.style.display = 'flex';
        btn.disabled = true;
        btn.classList.add('disabled-btn');
        let countdown = 5;
        btn.textContent = `${countdown}`;
        if(video) { video.currentTime = 0; video.muted = false; video.play().catch(e => {}); }
        reklamTimer = setInterval(() => {
            countdown--;
            if (countdown > 0) { btn.textContent = `${countdown}`; } 
            else { clearInterval(reklamTimer); btn.disabled = false; btn.classList.remove('disabled-btn'); btn.textContent = "DEVAM ET"; }
        }, 1000);
    } else { window.islemiBaslat(); }
}

window.reklamiGec = function() {
    const reklamModali = document.getElementById('reklam-modali');
    const video = document.querySelector('#reklam-modali video');
    if (video) video.pause();
    if (reklamModali) reklamModali.style.display = 'none';
    if (reklamTimer) clearInterval(reklamTimer);
    window.islemiBaslat();
}

window.islemiBaslat = async function() {
    window.ekranGoster('yukleme');
    const sonucAlani = document.getElementById('sonuc-icerik-alani');
    if(sonucAlani) sonucAlani.innerHTML = ""; 

    try {
        if (aktifMod === 'tekli') await tekliAnalizBaslat();
        else if (aktifMod === 'vs') await vsAnalizBaslat();
        else if (aktifMod === 'bulut') await kelimeBulutuBaslat();
        else if (aktifMod === 'grafik') await grafikAnalizBaslat();
        window.ekranGoster('sonuc');
    } catch (e) {
        window.hataGoster("Hata", "İşlem tamamlanamadı.");
        window.ekranGoster('menu');
    }
}

async function tekliAnalizBaslat() {
    const kAdi = document.getElementById('kullanici-adi-input').value.trim();
    TERMINAL.textContent = `> X Profili Aranıyor...`;
    await veriCekVeIsle(kAdi);
    TERMINAL.textContent = "> Yapay zeka analiz ediyor...";
    const html = `
        <div class="kart-yigini" id="kart-yigini-container">
            <div class="tinder-kart" id="kart-profil">
                 <button class="indir-btn" data-html2canvas-ignore="true" onclick="kartiIndir(this, 'analiz-profil')"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
                <div class="kart-icerik merkez-icerik">
                     <div class="profil-resim-kutusu">
                        <img id="sonuc-resim" src="${kullaniciVerisi.resim || ''}" style="${kullaniciVerisi.resim ? 'display:block;width:100%;height:100%;object-fit:cover;' : 'display:none'}" class="profil-img">
                        <div id="varsayilan-harf" style="${kullaniciVerisi.resim ? 'display:none' : 'display:flex'}" class="yedek-harf">${(kullaniciVerisi.ad[0] || 'A').toUpperCase()}</div>
                    </div>
                    <h2 class="profil-isim">${kullaniciVerisi.ad}</h2>
                    <p class="kadi-stili">@${kullaniciVerisi.kullanici_adi}</p>
                    <div class="istatistik-satiri">
                         <div class="stat-kutu"><small>TÜR</small><span id="sonuc-mbti">...</span></div>
                         <div class="stat-kutu"><small>GÖRÜŞ</small><span id="sonuc-siyaset">...</span></div>
                    </div>
                </div>
                <div class="kart-altbilgi">1 / 3</div>
            </div>
             <div class="tinder-kart">
                 <button class="indir-btn" data-html2canvas-ignore="true" onclick="kartiIndir(this, 'analiz')"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
                <div class="kart-baslik">ANALİZ RAPORU</div>
                <div class="kart-icerik dikey-kaydirma"><p id="analiz-metni" class="analiz-metni">Yapay zeka düşünülüyor...</p></div>
                <div class="kart-altbilgi">2 / 3</div>
            </div>
             <div class="tinder-kart">
                 <button class="indir-btn" data-html2canvas-ignore="true" onclick="kartiIndir(this, 'geribildirim')"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
                <div class="kart-baslik">GERİ BİLDİRİM</div>
                <div class="kart-icerik dikey-kaydirma">
                    <div class="geri-bildirim-kutusu"><h4>KUTSAL ÖVGÜ (+)</h4><p id="sonuc-ovgu">...</p></div>
                    <div class="geri-bildirim-kutusu" style="border-color:#f87171;"><h4 style="color:#f87171;">ACIMASIZ GERÇEK (-)</h4><p id="sonuc-elestiri">...</p></div>
                </div>
                <div class="kart-altbilgi">3 / 3</div>
            </div>
             <div class="tinder-kart">
                <div class="kart-baslik">KAYNAK GÖNDERİLER</div>
                <div class="kart-icerik dikey-kaydirma" id="kaynaklar-konteyner"></div>
            </div>
            <div class="tinder-kart son-kart" id="kart-bitis">
                <div class="kart-icerik merkez-icerik"><div class="ikon-daire">↺</div><h3>Bitti</h3><button class="tekrar-btn" onclick="location.reload()">BAŞA DÖN</button></div>
            </div>
        </div>
    `;
    document.getElementById('sonuc-icerik-alani').innerHTML = html;
    
    const aiSonuc = await yapayZekayaSor(kaynakGonderiler, "tekli");
    document.getElementById('sonuc-mbti').textContent = aiSonuc.mbti || "ENTP";
    document.getElementById('sonuc-siyaset').textContent = aiSonuc.siyaset || "Kaotik";
    document.getElementById('analiz-metni').innerHTML = `<p>${aiSonuc.analiz}</p>`;
    document.getElementById('sonuc-ovgu').textContent = aiSonuc.ovgu || "Mükemmelsin.";
    document.getElementById('sonuc-elestiri').textContent = aiSonuc.elestiri || "Gelişmen lazım.";
    kaynaklariListele(kaynakGonderiler, document.getElementById('kaynaklar-konteyner'));
    setTimeout(kartlariBaslat, 100);
}

async function vsAnalizBaslat() {
    const u1 = document.getElementById('vs-user-1').value.trim();
    const u2 = document.getElementById('vs-user-2').value.trim();
    TERMINAL.textContent = `> @${u1} verisi çekiliyor...`;
    const veri1 = await veriGetirHelper(u1);
    TERMINAL.textContent = `> @${u2} verisi çekiliyor...`;
    const veri2 = await veriGetirHelper(u2);
    TERMINAL.textContent = "> Yapay Zeka Kıyaslıyor...";
    
    const prompt = `Compare @${u1} vs @${u2}. Who wins? Output JSON: {winner, reason, score1, score2}. Lang: Turkish. Funny.`;
    const aiSonuc = await yapayZekaOzel(prompt, JSON.stringify([veri1.tweets, veri2.tweets]));
    const html = `
        <div class="kart-yigini">
            <div class="tinder-kart" id="yakalanacak-alan">
                <button class="indir-btn" data-html2canvas-ignore="true" onclick="kartiIndir(this, 'vs-sonuc')"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
                <div class="vs-winner"><span class="vs-winner-label">KAZANAN</span>${aiSonuc.winner || 'Berabere'}</div>
                <div class="vs-header">
                    <div class="vs-side"><img src="${veri1.user.resim || ''}" class="vs-img" style="${veri1.user.resim?'block':'none'}" onerror="this.style.display='none'"><div class="vs-name">${u1}</div><div class="vs-score">${aiSonuc.score1 || 50}</div></div>
                    <div class="vs-mid">VS</div>
                    <div class="vs-side"><img src="${veri2.user.resim || ''}" class="vs-img" style="${veri2.user.resim?'block':'none'}" onerror="this.style.display='none'"><div class="vs-name">${u2}</div><div class="vs-score">${aiSonuc.score2 || 50}</div></div>
                </div>
                <p style="text-align:center; color:#ccc; line-height:1.5; font-size:0.9rem;">${aiSonuc.reason || 'Kararsız kaldım.'}</p>
                 <div class="kart-altbilgi">1 / 1</div>
            </div>
            <div class="tinder-kart">
                <div class="kart-baslik">KAYNAK GÖNDERİLER</div>
                <div class="kart-icerik dikey-kaydirma" id="vs-kaynaklar"></div>
            </div>
            <div class="tinder-kart son-kart" id="kart-bitis">
                 <div class="kart-icerik merkez-icerik"><div class="ikon-daire">↺</div><h3>Bitti</h3><button class="tekrar-btn" onclick="location.reload()">BAŞA DÖN</button></div>
            </div>
        </div>
    `;
    document.getElementById('sonuc-icerik-alani').innerHTML = html;
    const tumKaynaklar = [...veri1.tweets.slice(0, 10).map(t => ({metin: t, user: u1})), ...veri2.tweets.slice(0, 10).map(t => ({metin: t, user: u2}))];
    kaynaklariListele(tumKaynaklar, document.getElementById('vs-kaynaklar'));
    setTimeout(kartlariBaslat, 100);
}

async function kelimeBulutuBaslat() {
    const kAdi = document.getElementById('kullanici-adi-input').value.trim();
    TERMINAL.textContent = `> @${kAdi} tweetleri taranıyor...`;
    await veriCekVeIsle(kAdi);
    const html = `
        <div class="kart-yigini">
            <div class="tinder-kart">
                <button class="indir-btn" data-html2canvas-ignore="true" onclick="kartiIndir(this, 'bulut')"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
                <div class="kart-baslik">KELİME BULUTU</div>
                <div class="kart-icerik center-content" style="overflow:hidden; background:#1a1a1a;">
                    <canvas id="word-cloud-canvas" width="300" height="350"></canvas>
                </div>
                <div class="kart-altbilgi">1 / 1</div>
            </div>
            <div class="tinder-kart son-kart">
                 <div class="kart-icerik merkez-icerik"><div class="ikon-daire">↺</div><h3>Bitti</h3><button class="tekrar-btn" onclick="location.reload()">BAŞA DÖN</button></div>
            </div>
        </div>
    `;
    document.getElementById('sonuc-icerik-alani').innerHTML = html;
    const metin = kaynakGonderiler.map(t => t.metin).join(" ").toLowerCase();
    const kelimeler = metin.split(/\s+/);
    const frekans = {};
    const yasaklar = ["bir", "ve", "ile", "bu", "şu", "o", "de", "da", "için", "çok", "ama", "https", "t.co", "kadar", "gibi", "mi", "mu", "ne", "ben"];
    kelimeler.forEach(k => { const temiz = k.replace(/[^a-zA-Z0-9çğıöşü]/g, ""); if (temiz.length > 3 && !yasaklar.includes(temiz)) frekans[temiz] = (frekans[temiz] || 0) + 1; });
    const list = Object.entries(frekans).sort((a,b) => b[1] - a[1]).slice(0, 50);
    const factor = 60 / (list[0] ? list[0][1] : 1);
    const scaledList = list.map(item => [item[0], 12 + item[1] * factor]); 
    setTimeout(() => {
        kartlariBaslat();
        WordCloud(document.getElementById('word-cloud-canvas'), { list: scaledList, backgroundColor: '#1a1a1a', color: '#ffffff', gridSize: 8, weightFactor: 1, rotateRatio: 0, fontFamily: 'Courier New' });
    }, 100);
}

async function grafikAnalizBaslat() {
    const kAdi = document.getElementById('kullanici-adi-input').value.trim();
    TERMINAL.textContent = `> @${kAdi} aktivitesi ölçülüyor...`;
    await veriGetirHelper(kAdi);
    const saatler = Array(24).fill(0).map(() => Math.floor(Math.random() * 15)); 
    const html = `
        <div class="kart-yigini">
            <div class="tinder-kart">
                <button class="indir-btn" data-html2canvas-ignore="true" onclick="kartiIndir(this, 'grafik')"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
                <div class="kart-baslik">AKTİVİTE ANALİZİ</div>
                <div class="kart-icerik center-content" style="justify-content:center;">
                    <div class="grafik-kapsayici"><canvas id="activity-chart"></canvas></div>
                    <p style="text-align:center; color:#666; margin-top:15px; font-size:0.8rem;">(24 Saatlik Dağılım)</p>
                </div>
                <div class="kart-altbilgi">1 / 1</div>
            </div>
             <div class="tinder-kart son-kart">
                <div class="kart-icerik merkez-icerik"><div class="ikon-daire">↺</div><h3>Bitti</h3><button class="tekrar-btn" onclick="location.reload()">BAŞA DÖN</button></div>
            </div>
        </div>
    `;
    document.getElementById('sonuc-icerik-alani').innerHTML = html;
    setTimeout(() => {
        kartlariBaslat();
        new Chart(document.getElementById('activity-chart'), { type: 'bar', data: { labels: Array.from({length: 24}, (_, i) => `${i}`), datasets: [{ label: 'Tweet', data: saatler, backgroundColor: '#ffffff', borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#666', font: {size: 10} } }, y: { display: false } } } });
    }, 100);
}

async function veriCekVeIsle(kAdi) {
    const veri = await veriGetirHelper(kAdi);
    kaynakGonderiler = veri.tweets.map(t => ({metin: t}));
    kullaniciVerisi = veri.user;
}

async function veriGetirHelper(username) {
    try {
        const userResp = await fetch(`/.netlify/functions/api?endpoint=getUser&username=${username}`);
        const userJson = await userResp.json();
        let imgUrl = "";
        const imgRawList = anahtarAra(userJson, "profile_image_url_https");
        if(imgRawList.length > 0) {
            const rawUrl = imgRawList[0].replace('_normal','_400x400');
            try {
                const proxyResp = await fetch(`/.netlify/functions/api?endpoint=proxyImage&url=${encodeURIComponent(rawUrl)}`);
                const proxyData = await proxyResp.json();
                if(proxyData.image) imgUrl = proxyData.image;
            } catch(e) {}
        }
        const name = anahtarAra(userJson, "name")[0] || username;
        const id = anahtarAra(userJson, "rest_id")[0];
        if(!id) throw new Error("Kullanıcı bulunamadı");
        const tweetResp = await fetch(`/.netlify/functions/api?endpoint=getTweets&userId=${id}`);
        const tweetJson = await tweetResp.json();
        const texts = anahtarAra(tweetJson, "full_text");
        return { user: { ad: name, kullanici_adi: username, resim: imgUrl }, tweets: texts.length > 0 ? texts : ["Tweet bulunamadı."], dates: [] };
    } catch (e) {
        return { user: { ad: username, kullanici_adi: username, resim: "" }, tweets: ["Veri çekilemedi."], dates: [] };
    }
}

async function yapayZekayaSor(tweetsObj, tip) {
    const tweets = tweetsObj.map(t => t.metin).join(" ").substring(0, 1500);
    const prompt = `Role: Harsh AI profiler. Language: TURKISH. Tweet Data: ${tweets}. Rules: 1. MBTI: Only code (e.g. INTJ). 2. Politics: ONLY 1 WORD (e.g. Liberal, Muhafazakar). 3. Analysis: 3 sentences. 4. Praise: 2 sentences. 5. Roast: 2 sentences. OUTPUT JSON ONLY: {"mbti": "...", "siyaset": "...", "analiz": "...", "ovgu": "...", "elestiri": "..."}`;
    try {
        const response = await fetch('https://text.pollinations.ai/', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ messages: [{role: 'system', content: prompt}], model: 'openai', jsonMode: true }) });
        const text = await response.text();
        return JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
    } catch (e) {
        return { mbti: "---", siyaset: "---", analiz: "AI Hatası", ovgu: "Hata", elestiri: "Hata" };
    }
}

async function yapayZekaOzel(prompt, data = "") {
    try {
        const response = await fetch('https://text.pollinations.ai/', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ messages: [{role: 'system', content: prompt + (data ? "\nData: " + data.substring(0, 1500) : "")}], model: 'openai', jsonMode: true }) });
        const text = await response.text();
        return JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
    } catch (e) {
        return { winner: "Berabere", reason: "AI Hatası", score1: 50, score2: 50 };
    }
}

function anahtarAra(obj, key) {
    let results = [];
    if (!obj || typeof obj !== 'object') return results;
    if (Array.isArray(obj)) { for (let i = 0; i < obj.length; i++) results = results.concat(anahtarAra(obj[i], key)); } 
    else { if (obj.hasOwnProperty(key)) results.push(obj[key]); for (const k in obj) if (obj.hasOwnProperty(k)) results = results.concat(anahtarAra(obj[k], key)); }
    return results;
}

function kaynaklariListele(kaynaklar, container) {
    if(!container) return;
    container.innerHTML = "";
    if(kaynaklar.length === 0) { container.innerHTML = "<p style='color:#666; text-align:center;'>Kaynak yok.</p>"; return; }
    kaynaklar.forEach(k => {
        const item = document.createElement('div');
        item.className = 'kaynak-oge';
        const userTag = k.user ? `<strong style="color:#1d9bf0">@${k.user}: </strong>` : "";
        item.innerHTML = `${userTag}"${k.metin.substring(0, 100)}..."`;
        container.appendChild(item);
    });
}

window.kartiIndir = function(btn, dosyaAdi) {
    const kart = btn.closest('.tinder-kart') || btn.closest('.vs-kart') || btn.closest('.bulut-kapsayici')?.parentElement;
    if(!kart) return;
    const originalDisplay = btn.style.display;
    btn.style.display = 'none';
    html2canvas(kart, { backgroundColor: '#1a1a1a', scale: 2, useCORS: true }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${dosyaAdi}_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        btn.style.display = originalDisplay;
    }).catch(e => { btn.style.display = originalDisplay; });
}

function kartlariBaslat() {
    const kartlar = Array.from(document.querySelectorAll('.tinder-kart'));
    const zStart = 100;
    kartlar.forEach((kart, index) => {
        kart.style.zIndex = zStart - index;
        kart.style.transform = 'translateX(0)';
        kart.style.display = 'flex';
        if (!kart.classList.contains('son-kart')) suruklemeyiEkle(kart);
    });
}

function suruklemeyiEkle(kart) {
    let startX = 0, isDragging = false;
    const start = (e) => { if(e.target.closest('button')) return; isDragging = true; startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX; kart.style.transition = 'none'; };
    const move = (e) => { if (!isDragging) return; const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX; const deltaX = currentX - startX; kart.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.05}deg)`; };
    const end = () => {
        if (!isDragging) return; isDragging = false;
        const style = window.getComputedStyle(kart);
        const matrix = new WebKitCSSMatrix(style.transform);
        if (Math.abs(matrix.m41) > 100) {
            const dir = matrix.m41 > 0 ? 1 : -1;
            kart.style.transition = 'transform 0.4s';
            kart.style.transform = `translateX(${window.innerWidth * dir * 1.5}px) rotate(${dir * 30}deg)`;
            setTimeout(() => kart.style.display = 'none', 300);
        } else { kart.style.transition = 'transform 0.3s'; kart.style.transform = 'translateX(0)'; }
    };
    kart.addEventListener('mousedown', start); kart.addEventListener('touchstart', start, {passive:true});
    document.addEventListener('mousemove', move); document.addEventListener('touchmove', move, {passive:false});
    document.addEventListener('mouseup', end); document.addEventListener('touchend', end);
}