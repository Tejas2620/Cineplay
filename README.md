# 🎬 Cineplay

**Cineplay** is a modern, feature-rich web application for movie and TV lovers. Discover trending and popular content, search for your favorites, explore cast and crew details, and (coming soon) track your watchlist—all in a beautiful, lightning-fast interface.

---

## 🚀 Features

- **Trending & Popular:** Instantly browse what's hot in movies and TV.
- **Advanced Search:** Find movies, TV shows, and people with smart filters.
- **Detailed Info:** Dive deep into cast, crew, reviews, recommendations, and more.
- **People Profiles:** Explore biographies, career highlights, and images of actors and creators.
- **Watchlist & Tracking:** _(Coming soon)_ Save titles to your watchlist and mark them as watched.
- **Responsive Design:** Enjoy Cineplay on desktop, tablet, or mobile.
- **Google OAuth:** _(Coming soon)_ Secure login to sync your watchlist across devices.
- **Beautiful UI:** Crafted with Tailwind CSS, custom gradients, and smooth animations.

---

## 🖼️ Screenshots

![Home Page](https://raw.githubusercontent.com/Tejas2620/Cineplay/main/screenshots/home.png)
![Movie Details](https://raw.githubusercontent.com/Tejas2620/Cineplay/main/screenshots/details.png)
![Search](https://raw.githubusercontent.com/Tejas2620/Cineplay/main/screenshots/search.png)

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **API:** [TMDB](https://www.themoviedb.org/) (The Movie Database)
- **Auth:** Firebase (Google OAuth)
- **Deployment:** Vercel

---

## 📦 Installation

1. **Clone the repo:**

   ```bash
   git clone https://github.com/Tejas2620/Cineplay.git
   cd Cineplay
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up TMDB API key:**

   - Create a `.env` file in the root:
     ```
     VITE_TMDB_API_KEY=your_tmdb_api_key
     ```
   - [Get your TMDB API key here](https://www.themoviedb.org/settings/api).

4. **(Optional) Set up Firebase for Google OAuth:**

   - Create a Firebase project and enable Google Sign-In.
   - Add your Firebase config to `src/utils/firebase.js`.

5. **Run locally:**
   ```bash
   npm run dev
   ```

---

## 🌐 Deployment

Cineplay is ready for instant deployment on [Vercel](https://vercel.com/):

- Push your code to GitHub.
- Import your repo on Vercel.
- Add your TMDB API key in Vercel's environment variables.
- Add a `vercel.json` file for SPA routing:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/" }]
  }
  ```

---

## ✨ Contributing

Pull requests, issues, and suggestions are welcome!
Check out the [issues](https://github.com/Tejas2620/Cineplay/issues) or open a PR.

---

## 📧 Contact

- **Email:** cineplay.contact.handclasp297@slmails.com
- **GitHub Issues:** [Open an issue](https://github.com/Tejas2620/Cineplay/issues)

---

## 📝 License

Movie and TV data provided by [TMDB](https://www.themoviedb.org/).

---

## 🙏 Credits

- [TMDB](https://www.themoviedb.org/) for the amazing API.
- [React](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), [Firebase](https://firebase.google.com/).
- All contributors and users!

---

> **Cineplay** is built for learning, experimentation, and fun.
> Enjoy exploring the world of movies
