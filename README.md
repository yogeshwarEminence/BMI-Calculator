# BMI Calculator (React + Vite)

A modern, responsive BMI (Body Mass Index) Calculator built with **React 18**,
**Vite**, and **Chart.js**. All data is persisted entirely in the browser's
**Local Storage** — no backend, no database required.

## ✨ Features

- **BMI Calculator Form** — Name, Age, Gender, Height (cm), Weight (kg)
- **BMI Calculation** — `BMI = weight (kg) / (height (m))²`
- **Categorization** — Underweight / Normal / Overweight / Obese
- **Local Storage Persistence** — records survive page refresh
- **Full CRUD** — Create, Edit, Delete, Delete All
- **Search & Filter** — by name, BMI category
- **Sorting** — by date or BMI value (ascending/descending)
- **Dashboard** — total records, average BMI, category counts
- **Charts (Chart.js)** — category distribution doughnut chart + BMI trend line chart
- **Export** — CSV export and PDF report download
- **Dark / Light Mode** — toggle with persisted preference
- **Responsive, mobile-friendly UI** with modern card-based design
- **Form validation, error handling, loading states**

## 🗂 Project Structure

```
bmi-calculator/
├── index.html
├── package.json
├── vite.config.js
├── .eslintrc.cjs
├── .gitignore
├── README.md
└── src/
    ├── main.jsx                # App entry point
    ├── App.jsx                 # Root component
    ├── components/
    │   ├── Navbar.jsx
    │   ├── BMIForm.jsx
    │   ├── BMIResult.jsx
    │   ├── BMIHistory.jsx
    │   ├── Dashboard.jsx
    │   ├── Charts.jsx
    │   ├── ConfirmModal.jsx
    │   └── Toast.jsx
    ├── context/
    │   ├── BMIContext.jsx       # Global BMI records state (CRUD)
    │   └── ThemeContext.jsx     # Dark/Light mode state
    ├── hooks/
    │   ├── useLocalStorage.js   # Generic localStorage-backed state hook
    │   └── useToast.js          # Toast notification hook
    ├── utils/
    │   └── bmiUtils.js          # BMI calculation, validation, CSV export, stats
    └── styles/
        ├── index.css            # Global tokens, reset, layout, buttons, forms
        ├── Navbar.css
        ├── BMIForm.css
        ├── BMIResult.css
        ├── Dashboard.css
        ├── BMIHistory.css
        └── Charts.css
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ and npm v9+

### Installation

```bash
# 1. Clone or extract the project
cd bmi-calculator

# 2. Install dependencies
npm install
```

### Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
```

This generates an optimized production build in the `dist/` folder.

### Preview the production build locally

```bash
npm run preview
```

### Lint the code

```bash
npm run lint
```

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `react`, `react-dom` | Core React library |
| `chart.js`, `react-chartjs-2` | Charts (doughnut + line) |
| `jspdf`, `jspdf-autotable` | PDF report generation |
| `vite`, `@vitejs/plugin-react` | Build tool & dev server |
| `gh-pages` | GitHub Pages deployment helper |

## 🧮 BMI Formula & Categories

```
BMI = weight (kg) / (height (m))²
```

| BMI Range | Category |
|---|---|
| < 18.5 | Underweight |
| 18.5 – 24.9 | Normal Weight |
| 25 – 29.9 | Overweight |
| ≥ 30 | Obese |

## 💾 Data Storage

All BMI records and the theme preference are stored in the browser's
`localStorage` under the keys:

- `bmi_records` — array of BMI record objects
- `bmi_theme` — `"light"` or `"dark"`

No data ever leaves the browser. To reset all data, use the **Delete All**
button or clear your browser's site storage for this app.

---

## ☁️ Deployment

### Option 1: Deploy to GitHub Pages

1. **Update `package.json`**

   Set the `homepage` field to your GitHub Pages URL:

   ```json
   "homepage": "https://<your-username>.github.io/<repo-name>"
   ```

2. **Update `vite.config.js`** (already configured with relative `base: './'`,
   which works for most GitHub Pages setups). If deploying to a project page
   (e.g. `https://username.github.io/repo-name/`), you can alternatively set:

   ```js
   export default defineConfig({
     plugins: [react()],
     base: '/<repo-name>/',
   })
   ```

3. **Install `gh-pages`** (already included in `devDependencies`):

   ```bash
   npm install
   ```

4. **Initialize git and push to GitHub** (if not already done):

   ```bash
   git init
   git add .
   git commit -m "Initial commit: BMI Calculator"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

5. **Deploy**:

   ```bash
   npm run deploy
   ```

   This runs `predeploy` (build) automatically, then publishes the `dist/`
   folder to the `gh-pages` branch.

6. **Enable GitHub Pages** in your repository settings:
   - Go to **Settings → Pages**
   - Set **Source** to the `gh-pages` branch, root folder
   - Your app will be live at `https://<your-username>.github.io/<repo-name>/`

---

### Option 2: Deploy to AWS EC2 with Nginx

#### 1. Build the project locally

```bash
npm run build
```

This creates a `dist/` folder containing the static production build.

#### 2. Launch an EC2 instance

- Launch an Ubuntu 22.04 LTS EC2 instance (t2.micro is sufficient for static hosting).
- Open inbound ports **22 (SSH)**, **80 (HTTP)**, and **443 (HTTPS, optional)** in
  the security group.

#### 3. Connect to your instance

```bash
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>
```

#### 4. Install Nginx on the server

```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

#### 5. Copy the build files to the server

From your local machine:

```bash
scp -i your-key.pem -r dist/* ubuntu@<EC2_PUBLIC_IP>:/home/ubuntu/bmi-app
```

#### 6. Move files to the Nginx web root

On the EC2 instance:

```bash
sudo rm -rf /var/www/html/*
sudo mv /home/ubuntu/bmi-app/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html
```

#### 7. Configure Nginx (optional, for SPA routing)

Edit `/etc/nginx/sites-available/default`:

```nginx
server {
    listen 80;
    server_name _;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### 8. Restart Nginx

```bash
sudo nginx -t          # test config
sudo systemctl restart nginx
```

#### 9. Access your app

Open `http://<EC2_PUBLIC_IP>` in your browser. The BMI Calculator should now
be live.

#### Optional: Enable HTTPS with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 🛠 Tech Stack Summary

- **React 18** (Functional Components + Hooks)
- **Vite 5** (build tool & dev server)
- **Chart.js / react-chartjs-2** (data visualization)
- **jsPDF / jspdf-autotable** (PDF export)
- **Browser Local Storage** (data persistence — no backend/database)
- **Vanilla CSS** with CSS custom properties for theming (Dark/Light mode)

## 📄 License

This project is provided as-is for educational and demonstration purposes.
