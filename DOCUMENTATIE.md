# BeautyShop - Documentatie Proiect

## I. Introducere

In prima parte a proiectului am inceput implementarea aplicatiei web e-commerce "BeautyShop", implementand backend-ul, frontend-ul, autentificarea, gestionarea produselor si categoriilor, precum si un dashboard pentru admin.

Obiectivele acestei etape au fost:
- sa creez arhitectura aplicatiei
- sa implementez comunicarea frontend-backend
- sa realizez CRUD complet pentru categorii si produse
- sa implementez sistem de autentificare JWT
- sa implementez wishlist si cos de cumparaturi
- sa realizez flow-ul complet de checkout si gestionare comenzi
- sa creez istoricul comenzilor pentru utilizatori

## II. Tehnologii si tool-uri utilizate

### 1. Frontend (React + TypeScript)

**React 18** - Framework JavaScript pentru interfata utilizatorului (butoane, formulare, carduri de produse, etc.)

**React Router** - Gestioneaza navigarea intre pagini in aplicatie

**TypeScript** - Este JavaScript dar cu verificare de tipuri - ne ajuta sa gasim erori inainte sa rulam codul. Previne multe bug-uri comune si face codul mai usor de inteles

**Vite** - Tool care transforma codul nostru intr-o forma pe care browser-ul o poate rula si porneste un server local pentru development. Este foarte rapid - cand salvam un fisier, schimbarile apar instant in browser, fara asteptare

**CSS** - Limbajul care stilizeaza aplicatia - culori, fonturi, spatiere, animatii

**Fetch API** - Metoda JavaScript pentru a trimite cereri HTTP catre server (sa obtinem produse, sa cream comenzi, etc.). Este modul standard de a comunica cu backend-ul - trimitem cereri si primim raspunsuri cu date

### 2. Backend (Django + Django REST Framework)

**Django 5** - Framework Python care construieste serverul web - gestioneaza cererile, proceseaza datele, si returneaza raspunsuri. Ofera multe functionalitati gata facute (autentificare, admin panel, etc.)

**Django REST Framework** - Extensie pentru Django care face usor sa cream API-uri REST - puncte de acces pentru frontend sa obtina sau sa trimita date. Transforma rapid modelele Django in API-uri funtionale (Ex: Endpoint-ul `/api/products/` returneaza lista de produse in format JSON, gata de folosit in frontend)

**SimpleJWT (JWT Authentication)** - Sistem de autentificare bazat pe token-uri JWT (JSON Web Tokens) - cand te loghezi, primesti un token care dovedeste ca esti autentificat. Token-ul este inclus in fiecare cerere si serverul verifica automat daca esti logat (Ex: Dupa login, primesti un token care este trimis automat cu fiecare cerere pentru a accesa wishlist sau cart)

### 3. Baza de date

**PostgreSQL** - baza de date care stocheaza toate informatiile aplicatiei intr-un mod structurat

### 4. Alte tool-uri utilizate

- **GitHub** - Stocheaza codul sursa si permite urmarirea modificarilor
- **Pycharm** - Pentru programarea codului
- **Postman** - Pentru testarea API-urilor
- **Jira** - Pentru planificarea sarcinilor si urmarirea progresului

## III. Functionalitati Implementate

### 1. Sistem de Utilizatori + Autentificare JWT

#### 1.1. Functionalitati:
- Inregistrare utilizator (register)
- Login cu token JWT (access + refresh)
- Login cu email sau username
- Salvarea token-ului in localStorage
- Endpoint /api/auth/me/ pentru extragerea datelor utilizatorului

#### 1.2. Navbar inteligent
- Afiseaza "Hi, username" dupa login
- Afiseaza buton Dashboard doar pentru admin
- Buton Logout

#### 1.3. Explicatii cod importante:

**UserContext (frontend/src/context/UserContext.tsx):**
```typescript
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
```
La incarcarea aplicatiei, se verifica daca exista un token in localStorage. Daca exista, se face o cerere la backend pentru a obtine datele utilizatorului si se seteaza in context global. Astfel, toate componentele au acces la informatii despre utilizatorul logat.

**MyTokenObtainPairSerializer (users/views.py):**
```python
def validate(self, attrs):
    username_or_email = attrs.get("username")
    password = attrs.get("password")
    
    user = None
    try:
        user = User.objects.get(username=username_or_email)
    except User.DoesNotExist:
        try:
            user = User.objects.get(email=username_or_email)
            username_or_email = user.username
        except User.DoesNotExist:
            pass
```
Permite login-ul atat cu username cat si cu email. Se incearca mai intai cautarea dupa username, apoi dupa email. Daca se gaseste utilizatorul dupa email, se extrage username-ul real pentru autentificare.

**UserSerializer (users/serializers.py):**
```python
def create(self, validated_data):
    password = validated_data.pop("password")
    user = User.objects.create(**validated_data)
    user.set_password(password)
    user.save()
    return user
```
La crearea unui utilizator nou, parola este extrasa din datele validate, utilizatorul este creat, apoi parola este hash-uita cu `set_password()` inainte de salvare. Nu se salveaza niciodata parola in plain text pentru securitate.

### 2. CRUD complet pentru categorii si produse

#### 2.1. Backend
- GET - listare categorii/produse
- POST - creare categorie/produs
- PUT - actualizare categorie/produs
- DELETE - stergere categorie/produs

#### 2.2. Frontend - DashboardCategories si DashboardProducts
- Listare categorii
- Adaugare categorie
- Incarcare dinamica a datelor
- Formular complet pentru adaugare
- Listare produse
- Filtrare automata pe categorii
- Editare produs
- Stergere produs

#### 2.3. Explicatii cod importante:

**ProductListCreateView (products/views.py):**
```python
def get_queryset(self):
    qs = Product.objects.all()
    category = self.request.query_params.get("category")
    if category:
        qs = qs.filter(category_id=category)
    return qs
```
Permite filtrarea produselor dupa categorie prin parametrul `category` din URL (ex: `/api/products/?category=1`). Daca parametrul exista, se filtreaza produsele, altfel se returneaza toate produsele.

**Product Model (products/models.py):**
```python
category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
```
Relatia ForeignKey intre Product si Category. `on_delete=models.SET_NULL` inseamna ca daca o categorie este stearsa, produsul ramane in baza de date, dar categoria devine NULL. `related_name='products'` permite accesul la toate produsele unei categorii prin `category.products.all()`.

### 3. Pagina Products cu filtrare
- Sidebar cu categorii din baza de date
- Filtrare produse dupa categorii
- Afisare imagini produse din MEDIA URL
- Layout stil card

### 4. Pagina Home
Elemente dinamice din backend:
- Categoriile apar automat din baza de date
- Produsele featured apar automat
- Pagina moderna cu sectiuni: hero, categories, featured products, newsletter

### 5. Navbar Global + Actualizare dinamica
- Navbar-ul apare pe toate paginile
- Se actualizeaza automat dupa login/logout
- Afiseaza linkuri in functie de rol (user/admin)

#### 5.1. Explicatii cod importante:

**Navbar (components/Navbar.tsx):**
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
Linkurile sunt conditionate - apar doar daca `user` exista (utilizatorul este logat). Butonul Dashboard apare doar daca utilizatorul este admin (`is_admin` este true).

### 6. Wishlist
- Adaugare/Eliminare produse in/din wishlist
- Vizualizare produse din wishlist

#### 6.1. Explicatii cod importante:

**WishlistView POST (products/views.py):**
```python
def post(self, request):
    wishlist, created = Wishlist.objects.get_or_create(user=request.user)
    product_id = request.data.get('product_id')
    product = Product.objects.get(id=product_id)
    if product in wishlist.products.all():
        return Response({"detail": "Product already in wishlist"}, status=400)
    wishlist.products.add(product)
```
`get_or_create()` creeaza wishlist-ul daca nu exista, sau il returneaza daca exista deja. Se verifica daca produsul exista deja in wishlist pentru a evita duplicate. `wishlist.products.add(product)` adauga produsul in relatia ManyToMany.

**Wishlist Model (products/models.py):**
```python
user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wishlist')
products = models.ManyToManyField(Product, related_name='wishlists')
```
`OneToOneField` inseamna ca fiecare utilizator are un singur wishlist. `ManyToManyField` permite ca un wishlist sa contina mai multe produse si un produs sa fie in mai multe wishlist-uri.

### 7. Cos de cumparaturi
- Adaugare produse in cos
- Actualizare cantitate produse din cos
- Eliminare produse din cos
- Validare stoc

#### 7.1. Explicatii cod importante:

**CartView POST (products/views.py):**
```python
cart_item, created = CartItem.objects.get_or_create(
    cart=cart,
    product=product,
    defaults={'quantity': quantity}
)

if not created:
    new_quantity = cart_item.quantity + quantity
    if product.stock < new_quantity:
        return Response({"detail": f"Only {product.stock} items available in stock"}, status=400)
    cart_item.quantity = new_quantity
    cart_item.save()
```
Daca produsul exista deja in cos, se incrementeaza cantitatea. Se valideaza stocul inainte de a actualiza cantitatea. Daca nu exista, se creeaza un nou CartItem cu cantitatea specificata.

**Cart Model (products/models.py):**
```python
def get_total(self):
    return sum(item.get_subtotal() for item in self.items.all())
```
Calculeaza totalul cosului prin insumarea subtotalului pentru fiecare item din cos. `items` este related_name pentru CartItem, deci `cart.items.all()` returneaza toate itemele din cos.

**CartItemView PUT (products/views.py):**
```python
if quantity <= 0:
    cart_item.delete()
    return Response(serializer.data)
```
Daca cantitatea este 0 sau negativa, item-ul este sters automat din cos. Astfel, utilizatorul poate scadea cantitatea pana la 0 pentru a elimina item-ul.

### 8. Checkout
- Formular cu datele pentru livrare
- Validare cos (daca contine produse)
- Creare comanda
- Actualizare stoc
- Golire cos

#### 8.1. Explicatii cod importante:

**OrderListView POST - Checkout (products/views.py):**
```python
if cart.items.count() == 0:
    return Response({"detail": "Cart is empty"}, status=400)

for item in cart.items.all():
    if item.product.stock < item.quantity:
        return Response({"detail": f"Insufficient stock for {item.product.name}"}, status=400)

for cart_item in cart.items.all():
    OrderItem.objects.create(
        order=order,
        product=cart_item.product,
        quantity=cart_item.quantity,
        price=cart_item.product.price
    )
    cart_item.product.stock -= cart_item.quantity
    cart_item.product.save()

cart.items.all().delete()
```
Se verifica mai intai ca cosul nu este gol. Apoi se valideaza stocul pentru fiecare item inainte de a crea comanda. Pentru fiecare item din cos, se creeaza un OrderItem si se salveaza pretul la momentul comenzii (pentru ca pretul produsului poate sa se modifice ulterior). Se scade stocul pentru fiecare produs si la final se goleste cosul.

**OrderItem Model (products/models.py):**
```python
price = models.DecimalField(max_digits=10, decimal_places=2)
```
Campul `price` in OrderItem salveaza pretul produsului la momentul comenzii. Astfel, daca pretul produsului se modifica ulterior, comanda pastreaza pretul original platit de utilizator.

### 9. Istoric comenzi
- Listare comenzi
- Vizualizare detalii comanda

#### 9.1. Explicatii cod importante:

**OrderListView GET (products/views.py):**
```python
orders = Order.objects.filter(user=request.user).order_by('-created_at')
```
Returneaza toate comenzile utilizatorului autentificat, sortate descrescator dupa data crearii (cele mai recente primele).

**Order Model (products/models.py):**
```python
STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('processing', 'Processing'),
    ('shipped', 'Shipped'),
    ('delivered', 'Delivered'),
    ('cancelled', 'Cancelled'),
]
status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
```
Status-ul comenzii este gestionat printr-un camp cu choices, permitand tracking-ul starii comenzii de la pending la delivered sau cancelled.

## IV. Structura Aplicatiei

### Backend Structure
```
beautyshop-ecommerce/
├── core_project/          # Configurare Django principala
│   ├── settings.py       # Setari proiect (DB, apps, middleware, JWT)
│   ├── urls.py           # URL routing principal
│   └── ...
├── users/                 # Aplicatie pentru utilizatori
│   ├── models.py         # Model User (extends AbstractUser)
│   ├── serializers.py   # Serializers pentru User
│   ├── views.py         # Views pentru auth (Register, Login, Me)
│   └── urls.py          # URL routing pentru auth
└── products/             # Aplicatie pentru produse si comenzi
    ├── models.py        # Modele: Category, Product, Wishlist, Cart, Order
    ├── serializers.py   # Serializers pentru toate modelele
    ├── views.py         # Views pentru API endpoints
    └── urls.py          # URL routing pentru products
```

### Frontend Structure
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
│   │   ├── Home.tsx            # Pagina principala
│   │   ├── Products.tsx        # Listare produse cu filtrare
│   │   ├── Wishlist.tsx        # Wishlist utilizator
│   │   ├── Cart.tsx            # Cos de cumparaturi
│   │   ├── Checkout.tsx        # Formular checkout
│   │   ├── Orders.tsx          # Istoric comenzi
│   │   ├── Dashboard.tsx       # Dashboard admin
│   │   ├── DashboardProducts.tsx
│   │   └── DashboardCategories.tsx
│   ├── App.tsx                 # Routing principal
│   ├── styles.css              # Stiluri globale
│   └── main.tsx                # Entry point
```

## V. API Endpoints

### Autentificare (`/api/auth/`)
- `POST /api/auth/register/` - Inregistrare utilizator nou
- `POST /api/auth/token/` - Login (obtine JWT tokens)
- `POST /api/auth/token/refresh/` - Refresh access token
- `GET /api/auth/me/` - Obtine date utilizator curent (necesita autentificare)

### Produse (`/api/products/`)
- `GET /api/products/` - Listare produse (query param: `?category=<id>` pentru filtrare)
- `POST /api/products/` - Creare produs (doar admin)
- `GET /api/products/<id>/` - Detalii produs
- `PUT /api/products/<id>/` - Actualizare produs (doar admin)
- `DELETE /api/products/<id>/` - Stergere produs (doar admin)

### Categorii (`/api/products/categories/`)
- `GET /api/products/categories/` - Listare categorii
- `POST /api/products/categories/` - Creare categorie (doar admin)
- `PUT /api/products/categories/<id>/` - Actualizare categorie (doar admin)
- `DELETE /api/products/categories/<id>/` - Stergere categorie (doar admin)

### Wishlist (`/api/products/wishlist/`)
- `GET /api/products/wishlist/` - Obtine wishlist utilizator (necesita autentificare)
- `POST /api/products/wishlist/` - Adauga produs in wishlist (body: `{"product_id": <id>}`)
- `DELETE /api/products/wishlist/` - Elimina produs din wishlist (body: `{"product_id": <id>}`)

### Cos (`/api/products/cart/`)
- `GET /api/products/cart/` - Obtine cos utilizator (necesita autentificare)
- `POST /api/products/cart/` - Adauga produs in cos (body: `{"product_id": <id>, "quantity": <num>}`)
- `PUT /api/products/cart/items/<item_id>/` - Actualizeaza cantitate item (body: `{"quantity": <num>}`)
- `DELETE /api/products/cart/items/<item_id>/` - Elimina item din cos

### Comenzi (`/api/products/orders/`)
- `GET /api/products/orders/` - Listare comenzi utilizator (necesita autentificare)
- `POST /api/products/orders/` - Creare comanda (checkout) (body: toate campurile shipping)
- `GET /api/products/orders/<order_id>/` - Detalii comanda

## VI. Structura Bazei de Date

### Relatii principale:
```
User (1) ──< (1) Wishlist ──> (M) Product
User (1) ──< (1) Cart ──< (M) CartItem ──> (1) Product
User (1) ──< (M) Order ──< (M) OrderItem ──> (1) Product
Category (1) ──< (M) Product
```

### Tabele principale:
1. **users_user** - Utilizatori aplicatie
2. **products_category** - Categorii produse
3. **products_product** - Produse disponibile
4. **products_wishlist** - Wishlist-uri utilizatori
5. **products_wishlist_products** - Relatie ManyToMany Wishlist-Product
6. **products_cart** - Cosuri utilizatori
7. **products_cartitem** - Items in cos
8. **products_order** - Comenzi
9. **products_orderitem** - Items din comenzi

## VII. Instalare si Rulare

### Backend (Django)
1. Instalare dependente:
```bash
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt pillow psycopg2-binary
```

2. Configurare baza de date:
   - Creeaza o baza de date PostgreSQL numita `cosmeticsDB`
   - Actualizeaza credentialele in `core_project/settings.py` daca e necesar

3. Rulare migratii:
```bash
python manage.py makemigrations
python manage.py migrate
```

4. Creare superuser (admin):
```bash
python manage.py createsuperuser
```

5. Pornire server:
```bash
python manage.py runserver
```

Serverul va rula pe `http://127.0.0.1:8000`

### Frontend (React + Vite)
1. Instalare dependente:
```bash
cd frontend
npm install
```

2. Pornire development server:
```bash
npm run dev
```

Aplicatia va rula pe `http://localhost:5173`

## VIII. Note importante

### Securitate:
- Parolele sunt hash-uite cu `set_password()` din Django
- JWT tokens pentru autentificare
- Validare stoc inainte de comanda
- Preturi salvate la momentul comenzii (nu se modifica daca pretul produsului se schimba)

### Performance:
- Lazy loading pentru imagini
- Optimizare queries cu `select_related` si `prefetch_related` (poate fi adaugat)
- Caching pentru categorii (poate fi adaugat)

### UX:
- Loading states pentru toate operatiile async
- Error messages clare si utile
- Empty states pentru wishlist, cart, orders
- Responsive design pentru toate dispozitivele
