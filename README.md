# SCC0219 – Milestone 1 - An Online Store

**Authors**:  
Eduardo Pereira De Luna Freire, 14567304  
Laura Fernandes Camargos, 13692334  
Sandy da Costa Dutra, 12544570  

---

## Project Description
JUKEBOX is a vinyl/CD e-commerce platform with customer and admin interfaces, designed to meet the specified requirements through the following implementations:

### System Architecture
- **Frontend**: React.js (responsive UI for desktop/mobile)
- **Backend**: Node.js (REST API)
- **Database**: MongoDB (stores users, products)

### Directory Structure
```
.
├── backend                                 # Backend repository (server-side code)
│   ├── src                                 # Main source code for the backend
│   │   ├── controllers                     # Contains the business logic for handling HTTP requests (e.g., authController.js, productController.js)
│   │   ├── models                          # Mongoose schemas and models for MongoDB collections (e.g., User.js, Product.js, Cart.js, Order.js)
│   │   ├── routes                          # Defines API endpoints and maps them to controller functions (e.g., authRoutes.js, productRoutes.js, userRoutes.js, orderRoutes.js, cartRoutes.js)
│   │   └── middlewares                     # Middleware functions for request processing (e.g., authMiddleware.js for authentication and admin authorization)
│   ├── server.js                           # Entry point of the backend application (configures Express, MongoDB connection, mounts routes)
│   ├── seed.js                             # Script to populate the database with initial/sample data
│   ├── .env                                # Environment variables file (e.g., MONGO_URI, JWT_SECRET, PORT)
│   └── package.json                        # Metadata and dependencies for the backend project
├── frontend                                # Frontend repository (React client-side application)
│   ├── public                              # Static assets served directly by the web server (e.g., index.html, favicon, unbundled images)
│   │   └── images                          # Publicly accessible images
│   ├── src                                 # Main source code for the React application
│   │   ├── components                      # Reusable React components (e.g., Header, Footer, ProductCard, UI elements)
│   │   ├── assets                          # Static assets like icons or local images that are bundled by Vite
│   │   ├── pages                           # Main React components representing different views or pages of the application (e.g., Home.jsx, Login.jsx, MyAccount.jsx, AdminDashboard.jsx)
│   │   ├── css                             # CSS files for styling the React application
│   │   ├── mockdata                        # Mock data used for development or testing (e.g., temporary product lists)
│   │   ├── utils                           # Utility functions and helper modules (e.g., data formatting, constant definitions)
│   │   ├── hooks                           # Custom React Hooks for reusable stateful logic (e.g., useAuth.js, useCart.js, useFavorites.js)
│   │   ├── main.jsx                        # The entry point for the React application (mounts the App component to the DOM)
│   │   └── App.jsx                         # Main application component, typically defining routing (React Router configuration)
│   ├── index.html                          # The main HTML file that serves as the entry point for the web browser
│   └── package.json                        # Metadata and dependencies for the frontend project
└── milestone-1                             # Folder for initial static prototypes or project planning documents from early stages
```
### Functionalities

#### User Management
- **Admins**:
  - Access admin dashboard
  - CRUD operations via API endpoints (`POST /api/products`, etc.)
- **Customers**:
  - Signup/login with email validation
  - Profile management (edit address/phone)
  - Purchase products
  - Save favorites

#### Product Catalog
- Product cards display:
  - Cover art, type, price, stock status
- Filters:
  - By genre, alphabetical order

#### Shopping Flow
- **Cart System**:
  - Local storage for guest users; Synchronized to DB after login
  - Real-time stock validation at checkout
- **Checkout**:
  - Credit card/PIX payment processing
  - Stock updates: `quantity_in_stock -= ordered_quantity`
  - The user can see previous orders on the user page

---

## Requirements

### User Types
- **Administrators**:
  - Manage other administrators, customers, and products.
  - Predefined account: `admin` (password: `admin`).
  - Required data: name, ID, phone, email.
  
- **Customers**:
  - Purchase vinyl records, CDs, and accessories.
  - Required data: name, ID, address, phone, email.

### Product Management
- **Products** include vinyl records, CDs, and accessories (player and support).
- **Required product data**: name, ID, photo, description, price, stock quantity, sold quantity.
- **CRUD operations**: Administrators can Create, Read, Update, and Delete products.

### Sales Functionality
- Shopping cart system with product selection and quantity adjustment.
- Credit/Debit card and PIX payment.
- Automatic stock update after purchase:
  - Decrease `stock quantity`.
  - Increase `sold quantity`.

### Unique Feature
- **Favorite Page**: 
  - Users can save products to a personalized favorites list
  - Syncs across devices when logged in

### Technical Requirements
- Accessibility compliance (screen reader support, high contrast).
- Responsive design (mobile, tablet, desktop).
- Reasonable response times for all operations.

---

### Data to be Stored on Server
#### 1. User Data
```
# Administrators
- id: string (UUID)
- email: string (unique)
- password_hash: string
- name: string
- phone: string

# Customers
- id: string (UUID)
- email: string (unique)
- password_hash: string
- name: string
- CEP: {
    street: string
    city: string
    state: string
    zip_code: string
  }
- phone: string
- favorite_products: [product_id] (array)
```
#### 2. Product Catalog
```
- id: string (UUID)
- sku: string (unique)
- name: string
- type: enum ['vinyl', 'cd', 'accessory']
- price: float
- description: text
- stock_quantity: integer
- sold_quantity: integer (default: 0)
- images: [url] (array)
- metadata: {
    artist: string
    release_year: integer
    genre: string
    condition: enum ['new', 'used']
  }
```
#### 3. Unique Feature
```
user_favorites: {
  user_id: string
  product_ids: [string] (array)
  updated_at: timestamp
}
```
#### 4. Order Management
```
- id: string (UUID)
- user_id: string (reference)
- items: [{
    product_id: string
    quantity: integer
    unit_price: float
  }]
- payment_method: enum ['credit_card', 'pix']
- payment_status: enum ['pending', 'completed', 'failed']
- total_amount: float
- created_at: timestamp
```
### Navigation Diagram
![User Flow Mockup](assets/diagram.png)

**Interactive prototype:** [Open in Figma](https://www.figma.com/proto/mmj99fQmk14IlVF0oD9eUB/Milestone-1?node-id=39-297&t=mGflpH7v4lGAqHeQ-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=39%3A297)  

Note: the admin pages are not reachable by the prototype, here's the pages:

![Admin view home page](assets/admin-page-home.png)

![Admin view product page](assets/admin-page-product.png)
  
---

## Comments About the Code
The HTML structure is organized hierarchically, dividing the website into main sections (header, content, footer). The header and footer are shared between all the pages. For the home page, we added two sections, a "what's new" section that is comprised of a carrousel to show new realeses, and a "products" section, where we display all products. The products are organized in a grid. For the Vinyl, CD and Accessories page, we created a similar grid to the home page, and we created a sidebar where we can choose which genre we want to browse. For the register page, we created a form where the user introduces their information.

---

## Test Plan
*Planned approach:*
- **Backend**: Postman tests for API routes (users, products)
- **Frontend**: Manual testing of site functionalities
- **Integration**: Manual testing of checkout flow
- **User login**: Manual testing of user interactions

---

## Test Results
### Sign in and Register to your Account
#### Frontend

Starting from the Home Page, click on the profile icon.

![image](https://github.com/user-attachments/assets/6e227545-0e5d-4956-bb78-ae82d4597622)

If you are not logged in, it will take you to the login page.

![image](https://github.com/user-attachments/assets/0c0b8d0d-48c7-4f2b-a416-9c2268acad3f)

Then, if you already have a log in, you need to type your email and password. If not, you need to click on "Sign Up" that will take you to the Register page.

![image](https://github.com/user-attachments/assets/fcce75c6-a220-4d41-a1b0-23f80c82c89b)

If you have made a mistake, it will show the following message:

![image](https://github.com/user-attachments/assets/6eaff204-349c-42e8-bf3b-5652e9349712)

If you don't fill all the spaces, it will warn you:

![image](https://github.com/user-attachments/assets/55d03e7a-b770-4290-92a7-7e7c79ce89fa)

If everything goes well, an alert will appear:

![image](https://github.com/user-attachments/assets/adfdfc96-e41f-4397-917a-9437b5d001d1)

In the case you don't have a Log In and need to go to the Register Page, all you have to do is fill in the information asked in the boxes and click on "Register":

![image](https://github.com/user-attachments/assets/98f5e22d-23c0-4332-a3ed-08a6b47412ec)

#### Backend

Registering a new user:

![image](https://github.com/user-attachments/assets/70dfe411-fb2c-40f1-ba12-23c74cbb436d)

Here, we are registering as an admin. The only difference between an admin and an user is the "@jukebox.com" in the email address. Now that we are registered as an admin and have recieved a token, we can access the admin functions such as requesting the users:

![image](https://github.com/user-attachments/assets/24c2f8b4-d303-4d4a-96c8-7ef8007acf50)

We need to add an Authorization key in the Header in order to have access to this information, as you may see in the image above.

---

### Editting Account information

#### Frontend

Starting from the "My Account" page, click on "Edit Profile":

![image](https://github.com/user-attachments/assets/82d06289-97f2-4033-b925-589f0ddf1cc3)

You may change and add any information you wish, then, click on "Update Profile":

![image](https://github.com/user-attachments/assets/5dbae245-1b89-4e07-b6b9-cfc357a52ce0)
![image](https://github.com/user-attachments/assets/ed495b0e-a212-4570-b7c1-457a6f96a307)

#### Backend

Updating user infromation (also requires the user token), here is also how you add and update address:

![image](https://github.com/user-attachments/assets/c21f1b9b-1092-464c-bdca-7399702f508e)

---

### Purchasing an item
#### Frontend

Starting from the Home Page and logged in to your user account, choose an item to purchase.

![image](https://github.com/user-attachments/assets/c925eaba-f6bf-481f-97ee-57b21cb2c97b)

Clicking it will lead to the item's page. Then, you need to click "Add to cart".

![image](https://github.com/user-attachments/assets/5329603e-81a8-4bc2-a581-55a8d2b3cfaa)

This will lead you to the cart page. Here, you can choose the quantity and review the price. You may also add more products or remove added items.

![image](https://github.com/user-attachments/assets/c590597d-8adc-4baa-9543-5de746389384)

If you are happy with how your cart is looking, clicking on the "Buy Shopping Cart" button will lead you to the checkout page, where you can review your purchase, select an address and how you wish to pay:

![image](https://github.com/user-attachments/assets/c2d0f273-912d-44b3-9697-cc2c1390605a)

If you already have an adress saved, you may select it. If not, you may click on "Add new address". Doing so will open this tab, where you can enter the information and click on "Add Address"

![image](https://github.com/user-attachments/assets/bf02ac4e-c932-4f13-96b4-7cfc816a9d14)

The same process follows for your payment options:

![image](https://github.com/user-attachments/assets/93a0673c-3a03-44f0-b482-e866701799ba)

Clicking "Finish Purchase" will complete the purchase and this pop up will appear:

![image](https://github.com/user-attachments/assets/b3792a22-853f-46f6-82c2-025fab0a8146)

After you purchase an item, the amount left in stock will change.

![image](https://github.com/user-attachments/assets/73ba2903-96f2-4263-8822-fda4527653ac)

You can also check your orders on the "My Account" page:

![image](https://github.com/user-attachments/assets/b1294948-6a15-4021-b669-704ccc5eb96a)

#### Backend

Adding a product to the cart (keep in mind you must be logged in to an user account):

![image](https://github.com/user-attachments/assets/92b0cda1-3193-4c40-90b3-0b565bba1a5c)

Changing quantity of an item in the cart:

![image](https://github.com/user-attachments/assets/d770000b-009d-48f1-9a3d-e5d141581da7)

Removing an item from the cart:

![image](https://github.com/user-attachments/assets/44701e7f-897d-498b-8584-c802cb37fe81)

Clearing the cart:

![image](https://github.com/user-attachments/assets/1f0ce91d-773e-45ae-9dca-f42648560b03)

Adding payment method:

![image](https://github.com/user-attachments/assets/6f68c989-25e9-4f08-93e7-faefbd9fc490)

Removing payment method:

![image](https://github.com/user-attachments/assets/fdb1f8a4-beea-4c27-90ae-4757a90f0afc)

Completing your order:

![image](https://github.com/user-attachments/assets/566c91c3-4b98-4e60-972d-061152eedc44)

Checking your orders:

![image](https://github.com/user-attachments/assets/424024df-a71a-422d-903a-f54311ea9de3)

---

### Favoriting an item (Special Functionality)
#### Frontend

Starting from the Home Page, choose an item to favorite.

![image](https://github.com/user-attachments/assets/c925eaba-f6bf-481f-97ee-57b21cb2c97b)

In the item page, click on the heart button.

![image](https://github.com/user-attachments/assets/75820086-4956-42ae-9cf1-f9b9aaa1b037)

This will add the item to your favorite page. You may add as many items as you wish.

![image](https://github.com/user-attachments/assets/9834f283-5d03-436d-b4e3-e29569f269dc)

#### Backend

Favoriting an item:

![image](https://github.com/user-attachments/assets/25e0c297-72fb-431b-b514-573677e1c1f1)

Fetching an user's favorite items:

![image](https://github.com/user-attachments/assets/c2aae49e-cc72-4cad-beec-1fe2e8362f56)

Removing a favorite item:

![image](https://github.com/user-attachments/assets/4384a1ab-ce40-47ce-9cc6-88f464638e33)

---

### Viewing, updating and deleting orders (Admin function)
#### Frontend

If you are logged in as an admin, you will have special functionalities that can be accessed through this button:

![image](https://github.com/user-attachments/assets/b5bd666d-492a-447f-8e7c-33e74060edbf)

This will take you to the Admin page, where you can click on "View All Orders":

![image](https://github.com/user-attachments/assets/f87b42b0-58c2-4d08-97f1-eb1fd477b468)

Here, a list with all orders that have been made will be available, if you click on an order, the details will apper. You can also click on the trash button to remove an order or on the pencil button to update one:

![image](https://github.com/user-attachments/assets/382a48dd-3884-4ec4-b8d0-bd36c952fbc3)

If you click on the pencil button, you may update payment status and delivery status. This is what you will be shown:

![image](https://github.com/user-attachments/assets/a24886dc-3c52-47c3-a522-e7df8ac52a98)

#### Backend

Updating an order:

![image](https://github.com/user-attachments/assets/19fd98a7-1203-4b23-a33e-14e85d0f42b8)

Removing an order:

![image](https://github.com/user-attachments/assets/851c9d66-a17a-4249-94d7-bf27b6d5a158)

---

### Managing Users (Admin function)
#### Frontend

From the Admin Page, click on "Manage Users":

![image](https://github.com/user-attachments/assets/f87b42b0-58c2-4d08-97f1-eb1fd477b468)

A list with all users will apper, on the "Actions" column, you may remove or update user information:

![image](https://github.com/user-attachments/assets/33bb33bc-335f-47f3-ad7c-95e9c20cb8ce)

If you click on the pencil button, these are the options you will be shown. The only one you are not able to alter is the email, since that is how we identify and login the user:

![image](https://github.com/user-attachments/assets/5eb49d2e-8dd4-407c-b9c7-7a814f40516f)

#### Backend

Through the backend, you may alter whatever user information you will, this was implemented as so in order to ease future applications:

![image](https://github.com/user-attachments/assets/2b0e238e-6d44-4468-9099-c49bd9205ccf)

Removing an user:

![image](https://github.com/user-attachments/assets/93481d83-3ba3-4d53-b8b5-d4a5e215522f)

---

### Managing Products (Admin function)
#### Frontend

As an admin, you may also add, remove and update products, this is done from the Admin page, by clicking on the "Manage Products" button:

![image](https://github.com/user-attachments/assets/f87b42b0-58c2-4d08-97f1-eb1fd477b468)

This is the page you will be shown, with a list of all products and an "Add New Product" button:

![image](https://github.com/user-attachments/assets/4742087c-f4b2-4872-93ec-a18c0b3b39d3)

If you wish to add a new product, all you have to do is fill in the following information and click on "Add Product":

![image](https://github.com/user-attachments/assets/566aa48a-4ce1-4ead-90f2-42e429b9f596)

To update or remove a product, you have to locate it on the list and use either the trash or the pencil button. This is what clicking on the pencil button looks like:

![image](https://github.com/user-attachments/assets/27977f31-ed35-4c2d-b3f1-ae1598ea69b6)

You may alter whatever information you wish from this menu.

#### Backend

Creating a new product:

![image](https://github.com/user-attachments/assets/aa8eaeca-a187-4f9a-bc59-297dbd2c50b3)

Updating a product:

![image](https://github.com/user-attachments/assets/a97500e7-1a25-410a-a156-fb7e1cbd25ae)

Removing a product:

![image](https://github.com/user-attachments/assets/ebe4ae2b-3d93-4c47-9fe5-d1efea62d844)

---

## How to run

### First, clone the repository

```bash
git clone https://github.com/sandycdutra/jukebox-scc0219.git
cd .\jukebox-scc0219\frontend\
````

### Install the dependencies

```bash
npm install
````

### Run the project on the terminal

```bash
npm run dev
````

### It's similar for the backend:

```bash
cd ..
cd \backend\
npm install
node seed.js
npm run dev
````

### On the mongoDB's '\bin' directory open 2 terminals

#### First run:

```bash
.\mongod.exe --dbpath 'your/data/path'
````

#### In the other terminal run:

```bash
.\mongosh.exe
````

### The interface is running at http://localhost:5173/, and the database at the 27017 port (mongoBD's default port)
---

## ADMIN and functionalities

- To create an admin user you have to register with an @jukebox.com e-mail
- After logging with the admin account you can:
    - Check, edit and delete all the orders of the users
    - Check, edit and delete users
    - Check, edit and delete products
- The admin can't buy products or add products to favorites (project decision)
