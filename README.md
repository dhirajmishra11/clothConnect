
# clothConnect
The clothConnect is a platform aimed at bridging the gap between donors and those in need. We believe in the power of community and collaboration to bring about meaningful change.

# ClothConnect

ClothConnect is a next-generation platform that bridges the gap between **donors**, **NGOs**, and **administrators**, making clothing donations seamless, transparent, and impactful. Whether you're an individual looking to donate clothes, an NGO managing collections, or an admin overseeing the process, ClothConnect ensures efficiency and collaboration to drive positive change.

---

## 🚀 **Features**

### **👕 Donors**
- Effortlessly donate clothes via a user-friendly interface.
- Track your donation status in real-time.
- Get updates on how your donation is making a difference.

### **🏢 NGOs**
- Manage incoming donations efficiently.
- Schedule pickups and handle collections seamlessly.
- Maintain records and analytics for better outreach.

### **📊 Admins**
- Oversee users, NGOs, and donation transactions.
- Ensure smooth operations with built-in analytics and insights.
- Manage platform-wide settings and permissions.

---

## 🔧 **Getting Started**

Follow these steps to set up the project on your local machine.

### **1️⃣ Clone the Repository**

```bash
git clone https://github.com/dhirajmishra11/clothConnect.git
cd clothconnect
```

---

### **2️⃣ Configure Environment Variables**

Create `.env` files in both the `frontend` and `backend` directories with the necessary configuration.

#### **Backend `.env`**

```plaintext
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
PORT=5000
```

#### **Frontend `.env`**

```plaintext
VITE_API_BASE_URL=http://localhost:5000
```

---

### **3️⃣ Install Dependencies**

#### **Backend**

```bash
cd backend
npm install
```

#### **Frontend**

```bash
cd frontend
npm install
```

---

### **4️⃣ Start the Application**

#### **Backend**

```bash
cd backend
npm start
```

The backend runs on **`http://localhost:5000`**.

#### **Frontend**

```bash
cd frontend
npm run dev
```

The frontend runs on **`http://localhost:5173`**.

---

## 📂 **Project Structure**

### **🛠 Backend**

```
backend/
├── controllers/       # API business logic
├── middleware/        # Authentication & validation middleware
├── models/            # Mongoose models
├── routes/            # API route handlers
├── scripts/           # Utility scripts (e.g., seedNGOs.js)
├── server.js          # Backend entry point
└── config/            # Database and server configuration
```

### **🎨 Frontend**

```
frontend/
├── public/            # Static assets
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page-level components
│   ├── store/         # Redux state management
│   ├── utils/         # Helper functions
│   ├── App.jsx        # Main application component
│   ├── main.jsx       # Frontend entry point
├── vite.config.js     # Vite configuration
└── package.json       # Frontend dependencies
```

---

## 🏗 **Contributing**

We welcome contributions! To get started:

1. **Fork the repository** on GitHub.
2. **Create a new branch** for your feature:
   ```bash
   git checkout -b feature-name
   ```
3. **Make your changes** and commit:
   ```bash
   git commit -m "Add feature-name"
   ```
4. **Push to your fork**:
   ```bash
   git push origin feature-name
   ```
5. **Submit a pull request** for review.

---

## 📜 **License**

This project is licensed under the **MIT License**. See the [`LICENSE`](./LICENSE) file for details.

---

## 📞 **Contact**

For any questions, issues, or feedback, feel free to reach out:

- 📧 **Email**: support@clothconnect.com
- 📱 **Phone**: +91 91579 65117
- 🌐 **Website**: [ClothConnect](https://clothconnect.com)

---

Made with ❤️ by the ClothConnect Team. Together, let's make a difference! 🌍


