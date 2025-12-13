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


### API Documentation

1. ## Movies Resource
    Get All Movies
    Request Format: /movies

    Request Type: GET

    Returned Data Format: JSON

    Description: Retrieves the list of movies available in the local database.

    Example Request: /movies

Example Response:

JSON

[
  {
    "_id": "6939ad2537dc8ba276ac39ac",
    "name": "The Walking Dead",
    "year": 2021,
    "genre": "Horror",
    "poster": "https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/e29ec367-0fc5-44f6-b4a5-4172f55632fb/compose?aspectRatio=1.78&format=webp&width=1200"
  }
]

2. ## Watchlist Resource
    # Get All Watchlist Items
    Request Format: /watchlist

    Request Type: GET

    Returned Data Format: JSON

    Description: Retrieves all media items currently saved in the user's watchlist.

    Example Request: /watchlist

Example Response:

JSON

[
  {
    "_id": "6578a9b1c2d3e4f5g6h7i8j9",
    "name": "Inception",
    "year": "2010",
    "genre": "Sci-Fi",
    "poster": "https://image.tmdb.org/t/p/w500/...jpg",
    "status": "Plan to Watch",
    "rating": 0
  },
  {
    "_id": "6578a9b1c2d3e4f5g6h7i8k0",
    "name": "Breaking Bad",
    "year": "2008",
    "genre": "TV Show",
    "poster": "https://image.tmdb.org/t/p/w500/...jpg",
    "status": "Watching",
    "rating": 5
  }
]
Error Handling:

Possible 500 errors:

Returns {"error": "Internal Server Error"} (or standard Express error dump) if the database connection fails.

# Add to Watchlist
Request Format: /watchlist

Request Type: POST

Returned Data Format: JSON

Description: Adds a new media item to the database.

Example Request:

JSON

{
    "_id": "693aede83c7e28359e149772",
    "name": "Breaking Bad",
    "year": 2008,
    "genre": "Drama",
    "poster": "https://theactionhospital.com/wp-content/uploads/2013/10/breaking-bad-background-hd-wallpaper.png",
    "status": "Watching",
    "rating": 2
  }
Example Response:

JSON

{
  "acknowledged": true,
  "insertedId": "6578b123c4d5e6f7g8h9i0j1"
}

Error Handling:

Possible 500 errors:

Returns Error adding record text if the database insertion fails.

# Update Watchlist Item
Request Format: /watchlist/:id

Request Type: PUT

Returned Data Format: JSON

Description: Updates the status or rating of a specific watchlist item identified by its ID.

Example Request: /watchlist/6578b123c4d5e6f7g8h9i0j1

JSON

{
  "status": "Watched",
  "rating": 5
}
Example Response:

JSON

{
  "acknowledged": true,
  "modifiedCount": 1,
  "upsertedId": null,
  "upsertedCount": 0,
  "matchedCount": 1
}
Error Handling:

Possible 500 errors:

Returns Error updating record text if the update operation fails.

# Delete from Watchlist
Request Format: /watchlist/:id

Request Type: DELETE

Returned Data Format: JSON

Description: Removes an item from the watchlist by its ID.

Example Request: /watchlist/6578b123c4d5e6f7g8h9i0j1

Example Response:

JSON

{
  "acknowledged": true,
  "deletedCount": 1
}
Error Handling:

Possible 500 errors:

Returns Error deleting record text if the delete operation fails.

3. ## External Data Resources
# Get Rated TV Shows (TMDB API)
    Request Format: /tv

    Request Type: GET

    Returned Data Format: JSON

    Description: Sends a request to The Movie Database (TMDB) API to fetch a list of TV shows.

    Example Request: /tv

Example Response:

JSON

{
  "page": 1,
  "results": [
    {
      "id": 1399,
      "name": "Game of Thrones",
      "vote_average": 8.4,
      "first_air_date": "2011-04-17"
    }
  ],
  "total_pages": 100
}
Error Handling:

Possible 500 errors:

Returns {"error": "Failed to fetch Rated TV shows"} if the TMDB API call fails.

4. ## Get Upcoming Releases (Watchmode Proxy)
    Request Format: /upcoming

    Request Type: GET

    Returned Data Format: JSON

    Description: Sends a request to the Watchmode API to fetch upcoming media releases.

    Example Request: /upcoming

Example Response:

JSON

{
  "releases": [
    {
      "id": 101,
      "title": "Dune: Part Two",
      "source_release_date": "2024-03-01",
      "poster_url": "https://..."
    }
  ]
}
Error Handling:

Possible 500 errors:

Returns {"error": "Failed to fetch Upcoming releases"} if the Watchmode API call fails.


### Deployment Guide (GCP + Firebase)

# Backend Deployment (Google Cloud Run)
Prerequisites:

Ensure your backend folder has a package.json with a start script (e.g., "start": "node server.js").

Ensure your server.js listens on process.env.PORT (Cloud Run sets this automatically).

Steps:

Initialize gcloud: Open your terminal in your backend directory.

Commands for glcoud:

gcloud auth login
gcloud config set project YOUR_PROJECT_ID

gcloud run deploy media-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated

2. # Frontend Deployment (Firebase Hosting)

Steps:

Install Firebase Tools:

npm install -g firebase-tools
Login and Initialize: Open your terminal in your frontend directory.

Login into firebase and select your GCP project

firebase login
firebase init hosting
Project Setup: Choose "Add Firebase to an existing Google Cloud Platform project" and select the GCP project ID you used for the backend.

Public Directory: Type dist (since Vite builds to dist).

Single Page App: Type y (Yes).

GitHub Deploys: n (No).

Configure Environment Variables

Build the Application: Generate the production build of your React app.

npm run build

Deploy:
firebase deploy --only hosting


