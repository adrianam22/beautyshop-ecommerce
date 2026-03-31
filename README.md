# BeautyShop - E-Commerce Platform

## 📋 Cuprins

1. [Tehnologii Utilizate](#tehnologii-utilizate)
2. [Funcționalități Implementate](#funcționalități-implementate)
3. [Arhitectură Backend](#arhitectură-backend)
4. [Arhitectură Frontend](#arhitectură-frontend)
5. [Instrucțiuni de Instalare și Rulare](#instrucțiuni-de-instalare-și-rulare)
6. [API Endpoints](#api-endpoints)
7. [Structura Bazei de Date](#structura-bazei-de-date)

---

## 🛠️ Tehnologii Utilizate

### Frontend (Partea Vizibilă a Aplicației)

- **React 18+** 
  - Ce face: Framework JavaScript care construiește interfața utilizatorului (butoane, formulare, carduri de produse, etc.)
  - De ce îl folosim: Ne permite să creăm pagini interactive și dinamice, unde conținutul se actualizează automat fără să reîncărcăm pagina completă
  - Exemplu: Când adaugi un produs în coș, se actualizează automat numărul de produse fără refresh

- **TypeScript**
  - Ce face: Este JavaScript dar cu verificare de tipuri - ne ajută să găsim erori înainte să rulăm codul
  - De ce îl folosim: Previne multe bug-uri comune și face codul mai ușor de înțeles și întreținut
  - Exemplu: Dacă încercăm să folosim un număr ca și cum ar fi text, TypeScript ne avertizează imediat

- **Vite**
  - Ce face: Tool care transformă codul nostru într-o formă pe care browser-ul o poate rula și pornește un server local pentru development
  - De ce îl folosim: Este foarte rapid - când salvăm un fișier, schimbările apar instant în browser, fără așteptare
  - Exemplu: Scriem cod, salvăm, și imediat vedem rezultatul în browser

- **React Router DOM**
  - Ce face: Gestionează navigarea între pagini în aplicația noastră (de la Home la Products, la Cart, etc.)
  - De ce îl folosim: Permite să avem multiple "pagini" într-o singură aplicație React, fără să reîncărcăm tot site-ul
  - Exemplu: Când dai click pe "Products" în navbar, te duce la pagina de produse fără refresh complet

- **CSS3**
  - Ce face: Limbajul care stilizează aplicația - culori, fonturi, spațiere, animații
  - De ce îl folosim: Creează interfața frumoasă și modernă cu tema Navy + Gold
  - Exemplu: Toate cardurile de produse au aceeași formă, culori și efecte hover datorită CSS-ului

- **Context API**
  - Ce face: Un sistem care păstrează informații despre utilizatorul logat și le face disponibile în toată aplicația
  - De ce îl folosim: Ne permite să știm dacă utilizatorul este logat în orice componentă, fără să trebuiască să transmitem date prin multe componente
  - Exemplu: Navbar-ul știe automat dacă utilizatorul este logat și afișează linkurile corespunzătoare

- **Fetch API**
  - Ce face: Metodă JavaScript pentru a trimite cereri HTTP către server (să obținem produse, să creăm comenzi, etc.)
  - De ce îl folosim: Este modul standard de a comunica cu backend-ul - trimitem cereri și primim răspunsuri cu date
  - Exemplu: Când apasăm "Add to Cart", trimitem o cerere la server să adauge produsul în coș

### Backend (Partea Invizibilă - Serverul)

- **Django 5.2**
  - Ce face: Framework Python care construiește serverul web - gestionează cererile, procesează datele, și returnează răspunsuri
  - De ce îl folosim: Este foarte puternic și oferă multe funcționalități gata făcute (autentificare, admin panel, etc.)
  - Exemplu: Când utilizatorul se înregistrează, Django procesează datele, salvează utilizatorul în baza de date și returnează un răspuns

- **Django REST Framework (DRF)**
  - Ce face: Extensie pentru Django care face ușor să creăm API-uri REST - puncte de acces pentru frontend să obțină sau să trimită date
  - De ce îl folosim: Transformă rapid modelele Django în API-uri funcționale, cu serializare automată a datelor
  - Exemplu: Endpoint-ul `/api/products/` returnează lista de produse în format JSON, gata de folosit în frontend

- **SimpleJWT**
  - Ce face: Sistem de autentificare bazat pe token-uri JWT (JSON Web Tokens) - când te loghezi, primești un token care dovedește că ești autentificat
  - De ce îl folosim: Este sigur și modern - token-ul este inclus în fiecare cerere și serverul verifică automat dacă ești logat
  - Exemplu: După login, primești un token care este trimis automat cu fiecare cerere pentru a accesa wishlist sau cart

- **PostgreSQL**
  - Ce face: Baza de date relațională - stochează toate datele aplicației (utilizatori, produse, comenzi) într-un mod organizat
  - De ce îl folosim: Este robust, sigur și suportă relații complexe între date (utilizator → comenzi → produse)
  - Exemplu: Toate produsele, utilizatorii și comenzile sunt salvate în PostgreSQL și pot fi interogate rapid

- **Pillow**
  - Ce face: Librărie Python pentru procesarea imaginilor - redimensionare, optimizare, validare
  - De ce îl folosim: Ne permite să uploadăm imagini pentru produse și să le procesăm automat (redimensionare, validare format)
  - Exemplu: Când admin-ul încarcă o imagine pentru un produs, Pillow verifică că este o imagine validă și o salvează corect

### Baza de Date

- **PostgreSQL**
  - Ce face: Baza de date principală care stochează toate informațiile aplicației într-un mod structurat
  - De ce îl folosim: Este foarte fiabil, suportă relații complexe între tabele și este perfect pentru aplicații e-commerce
  - Exemplu: Stochează utilizatori, produse, comenzi și relațiile dintre ele (care utilizator a comandat ce produse)

- **Django ORM (Object-Relational Mapping)**
  - Ce face: Transformă codul Python în interogări SQL și invers - ne permite să lucrăm cu baza de date folosind Python în loc de SQL direct
  - De ce îl folosim: Face codul mult mai simplu și mai ușor de înțeles - în loc de SQL complex, scriem `Product.objects.all()`
  - Exemplu: `Product.objects.filter(category_id=1)` devine automat SQL-ul corespunzător pentru a găsi produsele dintr-o categorie

---

## ✨ Funcționalități Implementate

### 1. Autentificare și Autorizare

- ✅ **Înregistrare utilizator** - Creare cont nou cu validare parolă
- ✅ **Login** - Autentificare cu email sau username
- ✅ **JWT Authentication** - Token-based authentication pentru securitate
- ✅ **User Context** - Menținere starea utilizatorului logat în aplicație
- ✅ **Protected Routes** - Rute protejate pentru utilizatori autentificați

### 2. Gestionare Produse și Categorii

- ✅ **Listare produse** - Afișare toate produsele disponibile
- ✅ **Filtrare după categorie** - Filtrare produse pe categorii
- ✅ **Detalii produs** - Vizualizare informații complete despre produs
- ✅ **Dashboard Admin** - Interfață administrativă pentru:
  - Creare/Editare/Ștergere produse
  - Creare/Editare/Ștergere categorii
  - Upload imagini produse
  - Gestionare stoc

### 3. Wishlist (Lista de Favorite)

- ✅ **Adăugare în wishlist** - Salvare produse favorite
- ✅ **Eliminare din wishlist** - Ștergere produse din favorite
- ✅ **Vizualizare wishlist** - Pagină dedicată cu toate produsele favorite
- ✅ **Add to Cart din wishlist** - Adăugare rapidă în coș din wishlist

### 4. Coș de Cumpărături (Shopping Cart)

- ✅ **Adăugare în coș** - Adăugare produse în coș cu validare stoc
- ✅ **Actualizare cantitate** - Modificare cantitate produse (increment/decrement)
- ✅ **Ștergere item** - Eliminare produs din coș
- ✅ **Calculare total** - Calculare automată subtotal și total
- ✅ **Validare stoc** - Verificare disponibilitate înainte de adăugare

### 5. Checkout (Flow de Cumpărare)

- ✅ **Formular date livrare** - Colectare informații pentru livrare:
  - Nume complet
  - Email
  - Telefon
  - Adresă completă
  - Oraș și cod poștal
  - Țară
- ✅ **Validare coș** - Verificare că coșul nu este gol
- ✅ **Creare comandă** - Generare comandă cu toate detaliile
- ✅ **Actualizare stoc** - Scădere automată stoc după comandă
- ✅ **Golire coș** - Ștergere automată produse din coș după comandă

### 6. Istoric Comenzi

- ✅ **Listare comenzi** - Afișare toate comenzile utilizatorului
- ✅ **Detalii comandă** - Vizualizare informații complete:
  - Status comandă (pending, processing, shipped, delivered, cancelled)
  - Produse comandate cu cantități și prețuri
  - Adresă de livrare
  - Total comandă
  - Data și ora comenzii

### 7. Interfață Utilizator

- ✅ **Design modern** - Tema Navy + Gold consistentă în toată aplicația
- ✅ **Responsive Design** - Optimizat pentru desktop, tablet și mobile
- ✅ **Navbar inteligent** - Linkuri dinamice bazate pe starea autentificării
- ✅ **Empty States** - Mesaje clare când nu există date
- ✅ **Loading States** - Indicatori de încărcare pentru o experiență mai bună
- ✅ **Error Handling** - Mesaje de eroare clare și utile

---

## 🏗️ Arhitectură Backend

### Structura Proiectului

```
beautyshop-ecommerce/
├── core_project/          # Configurare Django principală
│   ├── settings.py       # Setări proiect (DB, apps, middleware)
│   ├── urls.py           # URL routing principal
│   └── ...
├── users/                 # Aplicație pentru utilizatori
│   ├── models.py         # Model User (extends AbstractUser)
│   ├── serializers.py   # Serializers pentru User
│   ├── views.py         # Views pentru auth (Register, Login, Me)
│   └── urls.py          # URL routing pentru auth
└── products/             # Aplicație pentru produse și comenzi
    ├── models.py        # Modele: Category, Product, Wishlist, Cart, Order
    ├── serializers.py   # Serializers pentru toate modelele
    ├── views.py         # Views pentru API endpoints
    └── urls.py          # URL routing pentru products
```

### Modele de Date

#### 1. User (users/models.py)

```python
class User(AbstractUser):
    is_client = models.BooleanField(default=True)
```

**Explicație:** Extinde `AbstractUser` din Django pentru a adăuga câmpuri custom. `is_client` marchează utilizatorii obișnuiți (nu admini).

#### 2. Category (products/models.py)

```python
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
```

**Explicație:** Categorii pentru organizarea produselor. Fiecare categorie are un nume unic.

#### 3. Product (products/models.py)

```python
class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    specifications = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    supplier = models.CharField(max_length=200, blank=True)
    delivery_method = models.CharField(max_length=200, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)
```

**Explicație:** 
- `price` - Preț produs (DecimalField pentru precizie)
- `stock` - Cantitate disponibilă în stoc
- `category` - ForeignKey către Category (SET_NULL pentru a păstra produsul dacă categoria e ștearsă)
- `image` - Upload imagine produs

#### 4. Wishlist (products/models.py)

```python
class Wishlist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wishlist')
    products = models.ManyToManyField(Product, related_name='wishlists')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

**Explicație:**
- `OneToOneField` - Fiecare utilizator are un singur wishlist
- `ManyToManyField` - Un wishlist poate conține mai multe produse
- `related_name='wishlist'` - Permite accesul `user.wishlist` din User
- `related_name='wishlists'` - Permite accesul `product.wishlists.all()` pentru a vedea cine are produsul în wishlist

#### 5. Cart și CartItem (products/models.py)

```python
class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_total(self):
        return sum(item.get_subtotal() for item in self.items.all())

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def get_subtotal(self):
        return self.product.price * self.quantity
```

**Explicație:**
- `Cart` - Un coș per utilizator (OneToOneField)
- `CartItem` - Produse individuale în coș cu cantități
- `get_total()` - Calculează suma tuturor itemelor din coș
- `get_subtotal()` - Calculează subtotalul pentru un item (preț × cantitate)
- `related_name='items'` - Permite `cart.items.all()` pentru a accesa toate itemele

#### 6. Order și OrderItem (products/models.py)

```python
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Shipping information
    shipping_name = models.CharField(max_length=200)
    shipping_email = models.EmailField()
    shipping_phone = models.CharField(max_length=20)
    shipping_address = models.TextField()
    shipping_city = models.CharField(max_length=100)
    shipping_postal_code = models.CharField(max_length=20)
    shipping_country = models.CharField(max_length=100, default='Romania')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Price at time of order

    def get_subtotal(self):
        return self.price * self.quantity
```

**Explicație:**
- `Order` - Comandă cu status și informații de livrare
- `OrderItem` - Produse din comandă cu prețul la momentul comenzii
- `price` în OrderItem - Salvează prețul la momentul comenzii (nu se schimbă dacă prețul produsului se modifică ulterior)
- `status` - Tracking al stării comenzii prin choices
- `related_name='orders'` - Permite `user.orders.all()` pentru a vedea toate comenzile utilizatorului

### Serializers

#### UserSerializer (users/serializers.py)

```python
class UserSerializer(serializers.ModelSerializer):
    is_admin = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'password', 'is_admin')
        extra_kwargs = {
            'password': {'write_only': True, 'required': True}
        }

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create(**validated_data)
        user.set_password(password)  # Hash-uiește parola
        user.save()
        return user
```

**Explicație:**
- `write_only=True` - Parola nu este returnată în răspuns (securitate)
- `validators=[validate_password]` - Validare parolă conform regulilor Django
- `set_password()` - Hash-uiește parola înainte de salvare (nu se salvează în plain text)

#### CartItemSerializer și CartSerializer (products/serializers.py)

```python
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'subtotal']

    def get_subtotal(self, obj):
        return obj.get_subtotal()
```

**Explicație:**
- `product` - Serializer complet pentru citire (read_only)
- `product_id` - ID pentru scriere (write_only) - trimitem doar ID-ul la POST/PUT
- `subtotal` - Calculat dinamic prin `get_subtotal()`

### Views și Logic

#### WishlistView (products/views.py)

```python
class WishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wishlist, created = Wishlist.objects.get_or_create(user=request.user)
        serializer = WishlistSerializer(wishlist)
        return Response(serializer.data)

    def post(self, request):
        wishlist, created = Wishlist.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        
        try:
            product = Product.objects.get(id=product_id)
            if product in wishlist.products.all():
                return Response({"detail": "Product already in wishlist"}, status=400)
            wishlist.products.add(product)
            serializer = WishlistSerializer(wishlist)
            return Response(serializer.data, status=201)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found"}, status=404)
```

**Explicație:**
- `get_or_create()` - Creează wishlist dacă nu există, altfel îl returnează
- `wishlist.products.add(product)` - Adaugă produs în ManyToMany relationship
- Verificare dacă produsul există deja în wishlist pentru a evita duplicate

#### CartView - POST (products/views.py)

```python
def post(self, request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))
    
    try:
        product = Product.objects.get(id=product_id)
        
        # Check stock
        if product.stock < quantity:
            return Response(
                {"detail": f"Only {product.stock} items available in stock"},
                status=400
            )
        
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            new_quantity = cart_item.quantity + quantity
            if product.stock < new_quantity:
                return Response(
                    {"detail": f"Only {product.stock} items available in stock"},
                    status=400
                )
            cart_item.quantity = new_quantity
            cart_item.save()
        
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=201)
```

**Explicație:**
- Validare stoc înainte de adăugare
- `get_or_create()` - Dacă produsul există deja în coș, crește cantitatea
- Dacă nu există, creează un nou CartItem
- Verificare stoc și pentru cazul când se adaugă la o cantitate existentă

#### OrderListView - POST (Checkout) (products/views.py)

```python
def post(self, request):
    cart = get_object_or_404(Cart, user=request.user)
    
    if cart.items.count() == 0:
        return Response({"detail": "Cart is empty"}, status=400)
    
    # Validate stock for all items
    for item in cart.items.all():
        if item.product.stock < item.quantity:
            return Response(
                {"detail": f"Insufficient stock for {item.product.name}"},
                status=400
            )
    
    # Calculate total
    total = cart.get_total()
    
    # Create order
    order = Order.objects.create(
        user=request.user,
        total=total,
        shipping_name=request.data.get('shipping_name'),
        # ... alte câmpuri shipping
    )
    
    # Create order items and update stock
    for cart_item in cart.items.all():
        OrderItem.objects.create(
            order=order,
            product=cart_item.product,
            quantity=cart_item.quantity,
            price=cart_item.product.price
        )
        # Update stock
        cart_item.product.stock -= cart_item.quantity
        cart_item.product.save()
    
    # Clear cart
    cart.items.all().delete()
    
    serializer = OrderSerializer(order)
    return Response(serializer.data, status=201)
```

**Explicație:**
- Verificare că coșul nu este gol
- Validare stoc pentru toate itemele înainte de creare comandă
- Creare Order cu datele de livrare
- Creare OrderItem pentru fiecare produs din coș
- **Salvare preț la momentul comenzii** - `price=cart_item.product.price`
- Scădere stoc pentru fiecare produs
- Golire coș după comandă reușită

#### MyTokenObtainPairSerializer - Login cu Email (users/views.py)

```python
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username_or_email = attrs.get("username")
        password = attrs.get("password")

        # Try to find user by username first
        user = None
        try:
            user = User.objects.get(username=username_or_email)
        except User.DoesNotExist:
            # If not found, try to find by email
            try:
                user = User.objects.get(email=username_or_email)
                username_or_email = user.username
            except User.DoesNotExist:
                pass

        # Authenticate with the found username
        if user:
            credentials = {
                'username': username_or_email,
                'password': password
            }
            user = authenticate(**credentials)

        if not user:
            raise exceptions.AuthenticationFailed(
                'No active account found with the given credentials',
                'no_active_account',
            )

        refresh = self.get_token(user)
        data = {}
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        data['username'] = user.username
        data['email'] = user.email
        data['first_name'] = user.first_name or ""
        data['is_admin'] = user.is_staff
        return data
```

**Explicație:**
- Permite login cu email sau username
- Caută mai întâi după username, apoi după email
- Dacă găsește user după email, folosește username-ul real pentru autentificare
- Returnează token-uri JWT + date utilizator în răspuns

---

## 🎨 Arhitectură Frontend

### Structura Proiectului

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.tsx          # Layout principal
│   │   └── Navbar.tsx          # Navbar cu linkuri dinamice
│   ├── context/
│   │   └── UserContext.tsx     # Context pentru user authentication
│   ├── pages/
│   │   ├── Auth.tsx            # Login/Register
│   │   ├── Home.tsx            # Pagina principală
│   │   ├── Products.tsx        # Listare produse cu filtrare
│   │   ├── Categories.tsx       # Listare categorii
│   │   ├── Wishlist.tsx        # Wishlist utilizator
│   │   ├── Cart.tsx            # Coș de cumpărături
│   │   ├── Checkout.tsx        # Formular checkout
│   │   ├── Orders.tsx          # Istoric comenzi
│   │   ├── Dashboard.tsx        # Dashboard admin
│   │   ├── DashboardProducts.tsx
│   │   └── DashboardCategories.tsx
│   ├── App.tsx                 # Routing principal
│   ├── styles.css              # Stiluri globale
│   └── main.tsx                # Entry point
```

### Componente Principale

#### 1. UserContext (context/UserContext.tsx)

```typescript
export const UserContext = createContext<any>(null);

export function UserProvider({ children }: any) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return;

    fetch("http://127.0.0.1:8000/api/auth/me/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
```

**Explicație:**
- Context global pentru starea utilizatorului
- La încărcare, verifică dacă există token și încarcă datele user-ului
- Toate componentele pot accesa `user` prin `useContext(UserContext)`

#### 2. Navbar (components/Navbar.tsx)

```typescript
{user && (
  <>
    <Link to="/wishlist">❤️ Wishlist</Link>
    <Link to="/cart">🛒 Cart</Link>
    <Link to="/orders">📦 Orders</Link>
  </>
)}

{user?.is_admin && (
  <Link to="/dashboard">Dashboard</Link>
)}
```

**Explicație:**
- Linkuri condiționate - apar doar dacă `user` există
- Dashboard apare doar pentru admini (`user.is_admin`)

#### 3. Products Page (pages/Products.tsx)

**State Management:**
```typescript
const [wishlistProductIds, setWishlistProductIds] = useState<number[]>([]);
```

**Load Wishlist:**
```typescript
function loadWishlist() {
  const token = localStorage.getItem("access");
  if (!token) return;

  fetch("http://127.0.0.1:8000/api/products/wishlist/", {
    headers: { Authorization: "Bearer " + token },
  })
    .then((r) => r.json())
    .then((data) => {
      const ids = data.products?.map((p: any) => p.id) || [];
      setWishlistProductIds(ids);
    });
}
```

**Add to Wishlist:**
```typescript
function addToWishlist(productId: number) {
  const token = localStorage.getItem("access");
  if (!token) {
    alert("Please login to add products to wishlist");
    return;
  }

  fetch("http://127.0.0.1:8000/api/products/wishlist/", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ product_id: productId }),
  })
    .then(() => {
      setWishlistProductIds([...wishlistProductIds, productId]);
    });
}
```

**Explicație:**
- `wishlistProductIds` - Listă de ID-uri pentru a marca produsele din wishlist
- La încărcare, se sincronizează cu backend-ul
- La adăugare, se actualizează state-ul local pentru feedback instant

#### 4. Cart Page (pages/Cart.tsx)

**Update Quantity:**
```typescript
function updateQuantity(itemId: number, newQuantity: number) {
  fetch(`http://127.0.0.1:8000/api/products/cart/items/${itemId}/`, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantity: newQuantity }),
  }).then(() => {
    loadCart(); // Reîncarcă coșul pentru a vedea modificările
  });
}
```

**Explicație:**
- PUT request pentru actualizare cantitate
- După actualizare, se reîncarcă coșul pentru a obține totalul actualizat
- Dacă `quantity <= 0`, backend-ul șterge automat item-ul

#### 5. Checkout Page (pages/Checkout.tsx)

**Pre-fill User Data:**
```typescript
useEffect(() => {
  loadCart();
  
  if (token) {
    fetch("http://127.0.0.1:8000/api/auth/me/", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => r.json())
      .then((data) => {
        setForm({
          ...form,
          shipping_name: data.first_name + " " + (data.last_name || ""),
          shipping_email: data.email || "",
        });
      });
  }
}, []);
```

**Submit Order:**
```typescript
function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  
  fetch("http://127.0.0.1:8000/api/products/orders/", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  })
    .then((r) => r.json())
    .then(() => {
      alert("Order placed successfully!");
      navigate("/orders");
    });
}
```

**Explicație:**
- Pre-completează formularul cu datele utilizatorului logat
- La submit, trimite toate datele de livrare către backend
- După comandă reușită, redirect către Orders

#### 6. Auth Page (pages/Auth.tsx)

**Register:**
```typescript
const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  const username = email.split('@')[0]; // Generate username from email

  const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      email: email,
      password: password,
      first_name: name,
    }),
  });

  if (response.ok) {
    setIsLogin(true); // Switch to login tab
    alert("Account created successfully! Please login.");
  } else {
    const data = await response.json();
    setError(data.detail || data.username?.[0] || "Error creating account.");
  }
};
```

**Login:**
```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const response = await fetch("http://127.0.0.1:8000/api/auth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: email, // Backend accepts email or username
      password: password,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    window.location.href = "/"; // Reload to update UserContext
  }
};
```

**Explicație:**
- Register generează username din email (partea dinainte de @)
- Login acceptă email complet (backend-ul găsește user-ul după email)
- Token-urile sunt salvate în localStorage
- Redirect după login pentru a actualiza UserContext

---

## 🚀 Instrucțiuni de Instalare și Rulare

### Backend (Django)

1. **Instalare dependențe:**
```bash
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt pillow psycopg2-binary
```

2. **Configurare baza de date:**
   - Creează o bază de date PostgreSQL numită `cosmeticsDB`
   - Actualizează credențialele în `core_project/settings.py` dacă e necesar

3. **Rulare migrații:**
```bash
python manage.py makemigrations
python manage.py migrate
```

4. **Creare superuser (admin):**
```bash
python manage.py createsuperuser
```

5. **Pornire server:**
```bash
python manage.py runserver
```

Serverul va rula pe `http://127.0.0.1:8000`

### Frontend (React + Vite)

1. **Instalare dependențe:**
```bash
cd frontend
npm install
```

2. **Pornire development server:**
```bash
npm run dev
```

Aplicația va rula pe `http://localhost:5173`

---

## 📡 API Endpoints

### Autentificare (`/api/auth/`)

- `POST /api/auth/register/` - Înregistrare utilizator nou
- `POST /api/auth/token/` - Login (obține JWT tokens)
- `POST /api/auth/token/refresh/` - Refresh access token
- `GET /api/auth/me/` - Obține date utilizator curent (necesită autentificare)

### Produse (`/api/products/`)

- `GET /api/products/` - Listare produse (query param: `?category=<id>` pentru filtrare)
- `POST /api/products/` - Creare produs (doar admin)
- `GET /api/products/<id>/` - Detalii produs
- `PUT /api/products/<id>/` - Actualizare produs (doar admin)
- `DELETE /api/products/<id>/` - Ștergere produs (doar admin)

### Categorii (`/api/products/categories/`)

- `GET /api/products/categories/` - Listare categorii
- `POST /api/products/categories/` - Creare categorie (doar admin)
- `PUT /api/products/categories/<id>/` - Actualizare categorie (doar admin)
- `DELETE /api/products/categories/<id>/` - Ștergere categorie (doar admin)

### Wishlist (`/api/products/wishlist/`)

- `GET /api/products/wishlist/` - Obține wishlist utilizator (necesită autentificare)
- `POST /api/products/wishlist/` - Adaugă produs în wishlist (body: `{"product_id": <id>}`)
- `DELETE /api/products/wishlist/` - Elimină produs din wishlist (body: `{"product_id": <id>}`)

### Coș (`/api/products/cart/`)

- `GET /api/products/cart/` - Obține coș utilizator (necesită autentificare)
- `POST /api/products/cart/` - Adaugă produs în coș (body: `{"product_id": <id>, "quantity": <num>`)
- `PUT /api/products/cart/items/<item_id>/` - Actualizează cantitate item (body: `{"quantity": <num>`)
- `DELETE /api/products/cart/items/<item_id>/` - Elimină item din coș

### Comenzi (`/api/products/orders/`)

- `GET /api/products/orders/` - Listare comenzi utilizator (necesită autentificare)
- `POST /api/products/orders/` - Creare comandă (checkout) (body: toate câmpurile shipping)
- `GET /api/products/orders/<order_id>/` - Detalii comandă

---

## 🗄️ Structura Bazei de Date

### Diagramă Relații

```
User (1) ──< (1) Wishlist ──> (M) Product
User (1) ──< (1) Cart ──< (M) CartItem ──> (1) Product
User (1) ──< (M) Order ──< (M) OrderItem ──> (1) Product
Category (1) ──< (M) Product
```

### Tabele Principale

1. **users_user** - Utilizatori aplicație
2. **products_category** - Categorii produse
3. **products_product** - Produse disponibile
4. **products_wishlist** - Wishlist-uri utilizatori
5. **products_wishlist_products** - Relație ManyToMany Wishlist-Product
6. **products_cart** - Coșuri utilizatori
7. **products_cartitem** - Items în coș
8. **products_order** - Comenzi
9. **products_orderitem** - Items din comenzi

---

## 🎨 Design și Stilizare

### Tema Culori

- **Navy (Primary):** `#0a1a33`, `#14284d` - Fundaluri, text principal
- **Gold (Accent):** `#d4af37`, `#f4c430` - Butoane, highlights, gradient-uri
- **White:** `#ffffff` - Carduri, fundaluri
- **Gray:** `#f8f9fa`, `#e9ecef` - Fundaluri secundare, borduri

### Componente Stilizate

- **Card-uri:** Border radius 16-20px, shadow subtil, hover effects
- **Butoane:** Gradient gold, hover cu transform translateY
- **Input-uri:** Border focus gold, shadow la focus
- **Badge-uri:** Status colorat pentru comenzi (pending, shipped, etc.)
- **Empty States:** Iconițe mari, mesaje clare, call-to-action buttons

---

## 📝 Note Importante

1. **Securitate:**
   - Parolele sunt hash-uite cu `set_password()` din Django
   - JWT tokens pentru autentificare
   - Validare stoc înainte de comandă
   - Prețuri salvate la momentul comenzii (nu se modifică dacă prețul produsului se schimbă)

2. **Performance:**
   - Lazy loading pentru imagini
   - Optimizare queries cu `select_related` și `prefetch_related` (poate fi adăugat)
   - Caching pentru categorii (poate fi adăugat)

3. **UX:**
   - Loading states pentru toate operațiile async
   - Error messages clare și utile
   - Empty states pentru wishlist, cart, orders
   - Responsive design pentru toate dispozitivele

---

## 🔄 Flow-uri Principale

### Flow de Cumpărare

1. Utilizator navighează la **Products**
2. Adaugă produse în **Cart** sau **Wishlist**
3. Accesează **Cart** pentru a vedea produsele
4. Actualizează cantități dacă e necesar
5. Apasă **"Proceed to Checkout"**
6. Completează formularul de **Checkout** cu datele de livrare
7. Plasează comanda → Backend creează Order, scade stoc, golește cart
8. Redirect către **Orders** pentru a vedea comanda

### Flow Wishlist

1. Utilizator adaugă produse în **Wishlist** din pagina Products
2. Accesează pagina **Wishlist** pentru a vedea toate favoritele
3. Poate adăuga direct în **Cart** din wishlist
4. Poate elimina produse din wishlist

---

## 🐛 Troubleshooting

### Parola nu se salvează corect
- Verifică că folosești `set_password()` în serializer
- Verifică că parola este inclusă în `fields` din serializer

### Login nu funcționează
- Verifică că backend-ul acceptă email sau username
- Verifică că token-urile sunt salvate corect în localStorage

### Erori 500 la Wishlist/Cart/Orders
- Verifică că migrațiile au fost rulate: `python manage.py migrate`
- Verifică că utilizatorul este autentificat (token valid)

### Imagini nu se încarcă
- Verifică că `MEDIA_URL` și `MEDIA_ROOT` sunt configurate corect
- Verifică că folderul `media/product_images/` există

---

## 📚 Resurse Suplimentare

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Dezvoltat cu ❤️ pentru BeautyShop E-Commerce Platform**
