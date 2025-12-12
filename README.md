# Movie Recommendation System

A full-stack web application that allows users to browse movies, TV shows, and upcoming releases, and curate a personal watchlist.

## 📋 Features
- **Browse Media:** View lists of movies, TV shows, and upcoming releases.
- **Personal Watchlist:** Add/Remove items to a saved list.
- **Track Status:** Mark items as "Plan to Watch", "Watching", or "Watched".
- **Rate Content:** Give a 1-5 star rating to items in your watchlist.
- **Authentication:** Secure login via Clerk.
- **Responsive UI:** Interactive card animations and dark mode aesthetic.


## 🏗 Architecture
This project follows a **MERN Stack** (MongoDB, Express, React, Node.js) architecture.

### System Flow
1. **Client (React):** Handles UI, animations, and user interaction.
2. **Auth (Clerk):** Manages user sessions and identity.
3. **API (Express):** RESTful endpoints (`/movies`, `/watchlist`, `/tv`, `/upcoming`) that process requests.
4. **Database (MongoDB):** Stores movie data and user watchlists.

### Architecture Diagram

    User[User] -->|Interacts| Client[React Frontend]
    Client -->|Auth Request| Clerk[Clerk Authentication]
    Client -->|API Requests| Server[Node/Express Backend]
    
    Backend Services
    Server -->|Read/Write| DB[(MongoDB Atlas)]
    Server -->|Fetch Metadata| ExternalAPI[External Movie APIs]
    
    Clerk -->|Token| Client
    Client -->|Authorized Request + Token| Server