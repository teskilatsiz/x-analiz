#X Profil Analizi (Teşkilatsız)

**X Profil Analizi**, yapay zeka kullanarak X kullanıcılarını derinlemesine inceleyen, karakter özelliklerini çıkaran ve görsel veriler sunan gelişmiş bir web uygulamasıdır.

![Proje Önizleme](https://i.hizliresim.com/rmvm8hy.png)

Uygulama 4 farklı analiz modu sunar:

### 1. 🧠 Kişilik Analizi (Tekli Mod)
* **Karakter Tespiti (MBTI):** Kullanıcının kişilik tipini belirler (örn: INTJ, ENFP).
* **Siyasi Görüş:** Kullanıcının politik duruşunu tek kelimeyle özetler.
* **Övgü ve Yergi (Gömme):** Yapay zeka kullanıcıyı hem över hem de mizahi bir dille eleştirir.
* **Profil Fotoğrafı:** Yüksek çözünürlüklü profil fotoğrafı gösterimi.

### 2. ⚔️ Karşılaştırma (VS Modu)
* İki farklı kullanıcıyı karşılaştırır.
* Gönderilerine dayanarak tartışmayı kimin kazanacağını, kimin daha zeki veya toksik olduğunu belirler.
* Kazananı ve sebebini eğlenceli bir dille açıklar.

### 3. ☁️ Kelime Bulutu
* Kullanıcının son tweetlerinde en sık kullandığı kelimeleri analiz eder.
* Görsel bir kelime bulutu oluşturur.

### 4. 📊 Aktivite Grafiği
* Kullanıcının tweet atma alışkanlıklarını analiz eder.
* Günün hangi saatlerinde aktif olduğunu grafiksel olarak gösterir.

---

## 🛠️ Kullanılan Teknolojiler
* **Arayüz (Frontend):** HTML5, CSS3 (Responsive/Monokrom Tasarım), JavaScript.
* **Sunucu Tarafı (Backend):** Netlify Functions (Node.js)
* **Yapay Zeka:** Pollinations.ai (OpenAI tabanlı metin analizi).
* **Veri Kaynağı:** Twitter241 API (RapidAPI).
* **Kütüphaneler:**
    * `Chart.js` (Grafikler için)
    * `WordCloud2.js` (Kelime bulutu için)
    * `Html2Canvas` (Sonuçları resim olarak indirmek için)

---

## 🚀 Kurulum ve Çalıştırma

# 🛠️ X Profil Analizi - Detaylı Kurulum Rehberi

Bu rehber, **X Profil Analizi** projesini kendi bilgisayarınızda çalıştırmak veya Netlify üzerinde ücretsiz olarak yayına almak için gereken adımları adım adım anlatır.

Bu proje **Serverless (Sunucusuz)** mimari kullandığı için standart HTML dosyaları gibi çift tıklayarak çalıştırıldığında API özellikleri (veri çekme) çalışmayacaktır.

---

## 📋 1. Gereksinimler

Başlamadan önce aşağıdakilere sahip olduğunuzdan emin olun:

1.  **GitHub Hesabı:** Projeyi yüklemek için.
2.  **Netlify Hesabı:** Projeyi ücretsiz yayınlamak ve arka plan fonksiyonlarını çalıştırmak için.
3.  **RapidAPI Hesabı:** Twitter verilerini çekmek için gerekli API anahtarını almak için.
4.  **(Opsiyonel - Yerel Test İçin):** Bilgisayarınızda [Node.js](https://nodejs.org/) yüklü olmalıdır.

---

## 🔑 2. API Anahtarının Alınması

Projenin çalışması için **Twitter241** servisine abone olmanız gerekir (Ücretsiz plan yeterlidir).

1.  [RapidAPI - Twitter241](https://rapidapi.com/davethebeast/api/twitter241/) sayfasına gidin.
2.  Giriş yapın ve **"Subscribe to Test"** butonuna tıklayın.
3.  **Basic (Free)** paketi seçin (Aylık belirli bir istek limiti ücretsizdir).
4.  Abone olduktan sonra **Endpoints** sekmesine gelin.
5.  `X-RapidAPI-Key` yazan yerdeki uzun kodu kopyalayın. Bunu birazdan kullanacağız.

---

## 🚀 3. Projeyi Netlify'a Yükleme (Önerilen Yöntem)

En kolay ve hızlı yöntem, projeyi direkt Netlify üzerinden yayınlamaktır.

### Adım A: GitHub'a Yükleme
1.  Bu proje dosyalarını (`index.html`, `style.css`, `script.js`, `netlify.toml` ve `functions` klasörü) kendi GitHub hesabınızda yeni bir "Repository" oluşturup içine yükleyin.

### Adım B: Netlify Bağlantısı
1.  [Netlify](https://app.netlify.com/) hesabınıza giriş yapın.
2.  **"Add new site"** butonuna basın ve **"Import an existing project"** seçeneğini seçin.
3.  **GitHub**'ı seçin ve az önce oluşturduğunuz repoyu bulun.

### Adım C: Ayarlar ve Dağıtım
Netlify otomatik olarak `netlify.toml` dosyasını algılayacaktır. Ancak şu ayarı yapmanız **ZORUNLUDUR**:

1.  Deploy ayarları sayfasında **"Environment variables"** (Ortam Değişkenleri) butonuna tıklayın (veya site oluştuktan sonra Ayarlar'dan gidin).
2.  **"Add a variable"** deyin.
3.  Şu bilgileri girin:
    * **Key:** `RAPID_API_KEY`
    * **Value:** *(2. adımda kopyaladığınız RapidAPI anahtarı)*
4.  **Deploy site** butonuna basın.

**Tebrikler!** Siteniz artık yayında ve API istekleri sunucu tarafında güvenli bir şekilde işleniyor.

---

## 💻 4. Bilgisayarda Çalıştırma (Localhost)

Eğer projeyi geliştirmek ve kendi bilgisayarınızda test etmek istiyorsanız:

1.  **Node.js**'in yüklü olduğundan emin olun.
2.  Netlify CLI aracını yükleyin:
    ```bash
    npm install netlify-cli -g
    ```
3.  Projeyi indirdiğiniz klasöre terminal (komut satırı) ile gelin.
4.  Netlify hesabınıza giriş yapın:
    ```bash
    netlify login
    ```
5.  Projeyi başlatın:
    ```bash
    netlify dev
    ```
    *(Bu komut yerel bir sunucu başlatacak ve functions klasörünü simüle edecektir).*

**Not:** Yerelde çalışırken API anahtarını tanıtmak için proje ana dizininde `.env` adında bir dosya oluşturup içine şunu yazmalısınız:
RAPID_API_KEY=api_anahtariniz_buraya_gelecek
*(Bu .env dosyasını GitHub'a yüklemeyin!)*
