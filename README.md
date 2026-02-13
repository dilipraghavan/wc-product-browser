# WooCommerce Product Browser

A Next.js frontend application for browsing WooCommerce products via a headless REST API. This project serves as a portfolio piece to demonstrate proficiency in React, Next.js, TypeScript, server-side rendering, and headless e-commerce architecture.

## Features

- **Server-Side Rendering (SSR):** Product pages are rendered on the server for optimal SEO and fast initial page loads using Next.js 14 App Router.

- **Product Browsing:** Full product grid with responsive design, category filtering, price sorting, and pagination. Product detail pages show images, descriptions, attributes, and related products.

- **Search Functionality:** Real-time product search with dedicated results page and pagination support.

- **JWT Authentication:** Secure login system that stores tokens in localStorage. Automatic token handling for authenticated API requests.

- **Wishlist System:** Add and remove products from wishlist with real-time UI updates. Wishlist count displays in header and syncs across pages.

- **Responsive Design:** Mobile-first design using Tailwind CSS. Works seamlessly on desktop, tablet, and mobile devices.

---

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Setup

1. **Clone the Repository:** Clone the project from GitHub to your local machine.

   ```bash
   git clone https://github.com/dilipraghavan/wc-product-browser.git
   ```

2. **Install Dependencies:** Navigate into the cloned folder and install the required packages.

   ```bash
   cd wc-product-browser
   npm install
   ```

3. **Configure Environment:** Create a `.env.local` file in the root directory with your API URL.

   ```
   NEXT_PUBLIC_API_URL=https://techvault.wpshiftstudio.com/wp-json/wc-headless/v1
   ```

4. **Run Development Server:** Start the local development server.

   ```bash
   npm run dev
   ```

5. **Open Browser:** Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## Project Structure

```
wc-product-browser/
├── app/
│   ├── layout.tsx          # Root layout with header and footer
│   ├── page.tsx            # Homepage with product grid
│   ├── products/[id]/      # Product detail page
│   ├── search/             # Search results page
│   ├── wishlist/           # User wishlist page
│   ├── login/              # Authentication page
│   ├── account/            # User account page
│   └── cart/               # Cart placeholder page
├── components/
│   ├── Header.tsx          # Navigation with search and wishlist count
│   ├── ProductGrid.tsx     # Product card grid layout
│   ├── ProductCard.tsx     # Individual product card
│   ├── FilterSidebar.tsx   # Category and sort filters
│   ├── Pagination.tsx      # Page navigation
│   └── AddToWishlistButton.tsx  # Wishlist toggle button
├── lib/
│   ├── api.ts              # API client with auth handling
│   └── types.ts            # TypeScript type definitions
└── .env.local              # Environment configuration
```

---

## Usage

### Browsing Products

1. **Home Page:** View all products in a responsive grid layout.
2. **Filter Products:** Use the sidebar to filter by category or show only sale items.
3. **Sort Products:** Change sort order by date, price, or name.
4. **Pagination:** Navigate through product pages using the pagination controls.

### Product Details

1. **Click Product:** Click any product card to view full details.
2. **View Images:** Browse product images in the gallery.
3. **Related Products:** Scroll down to see related product recommendations.

### Wishlist

1. **Login Required:** Log in to use wishlist functionality.
2. **Add to Wishlist:** Click the heart icon on any product detail page.
3. **View Wishlist:** Click the heart icon in the header to view your saved items.
4. **Remove Items:** Click the X button on wishlist items to remove them.

### Authentication

1. **Login:** Click the user icon in the header and enter your WordPress credentials.
2. **Account:** View your account details and logout option.
3. **Session:** Tokens are stored locally and persist across browser sessions.

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Add the environment variable `NEXT_PUBLIC_API_URL`.
4. Deploy.

### Other Platforms

Build the production version:

```bash
npm run build
npm start
```

---

## Live Demo

- **Frontend App:** [wc-product-browser.vercel.app](https://wc-product-browser.vercel.app)

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Authentication:** JWT (stored in localStorage)
- **Deployment:** Vercel

---

## Contributing

We welcome contributions! If you have a bug fix or a new feature, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes following a clear and concise commit message format.
4. Push your branch to your forked repository.
5. Submit a pull request.

---

## License

This project is licensed under the MIT License.
