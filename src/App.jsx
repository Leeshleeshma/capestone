import React, { useState, useMemo } from "react";
import useSWR from "swr";
import "./App.css";
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const fetcher = (url) => fetch(url).then((res) => res.json());

// Media Card Component
const MediaCard = ({ media, onToggleSave, onUpdate, activeTab }) => {
  return (
    <div className="media-card">
      <div className="card-image">
        {media.poster ? (
          <img
            src={media.poster}
            alt={media.name}
            className="poster-img"
          />
        ) : (
          <img
            src="https://variety.com/wp-content/uploads/2023/04/featured_AI_production.jpg?w=1000&h=563&crop=1"
            alt="No Poster Available"
            className="poster-img"
          />
        )}
      </div>

      <div className="card-content">
        <h2>{media.name}</h2>
        <div className="card-meta">
          <span>{media.year}</span> • <span>{media.genre}</span>
        </div>

        {/* Only show rating/status controls on saved tab */}
        {activeTab === "saved" && media.isSaved && (
        <div className="watchlist-controls">

          <div className="control-group">
            <label className="control-label">Status</label>
            <select
              className="control-select"
              value={media.status}
              onChange={(e) => onUpdate(media, { status: e.target.value })}
            >
              <option value="Plan to Watch">Plan to Watch</option>
              <option value="Watching">Watching</option>
              <option value="Watched">Watched</option>
            </select>
          </div>

          <div className="control-group">
            <label className="control-label">Rating</label>
            <div className="rating-wrapper">
              <input
                type="number"
                min={0}
                max={5}
                className="rating-input"
                value={media.rating || 0}
                onChange={(e) =>
                  onUpdate(media, { rating: parseInt(e.target.value) })
                }
              />
              <span className="rating-outof">/ 5</span>
            </div>
          </div>

        </div>
      )}

      </div>

      {/* Watchlist button */}
      <div className="card-actions">
        <button
          className={`btn btn-save ${media.isSaved ? "active" : ""}`}
          onClick={() => onToggleSave(media)}
        >
          {media.isSaved ? "In Watchlist" : "+ Watchlist"}
        </button>
      </div>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: movies } = useSWR("http://localhost:5050/movies", fetcher);
  const { data: watchlist, mutate: mutateWatchlist } = useSWR(
    "http://localhost:5050/watchlist",
    fetcher
  );
  const { data: tvData } = useSWR("http://localhost:5050/tv", fetcher);

  const { data: upcomingData } = useSWR(
    "http://localhost:5050/upcoming",
    fetcher
  );

  // --------------------------
  // Normalize TV API Response
  // --------------------------
  const tvList = useMemo(() => {
    if (!tvData?.results) return [];

    return tvData.results.map((show) => ({
      _id: show.id,
      name: show.name || show.original_name,
      year: show.first_air_date ? show.first_air_date.slice(0, 4) : "N/A",
      genre: "TV Show",
      rating: show.vote_average,
      isSaved: false,
    }));
  }, [tvData]);


// --------------------------
// Normalize Upcoming API Response
// --------------------------
const upcomingList = useMemo(() => {
  if (!upcomingData?.releases) return [];

  return upcomingData.releases.map((movie) => ({
    _id: movie.id,
    name: movie.title || movie.original_title || "Untitled",
    genre: movie.source_release_date || "TBA",
    poster: movie.poster_url,
    isSaved: false
  }));
}, [upcomingData]);



  // --------------------------
  // Merge Movies + Watchlist
  // --------------------------
  const mediaList = useMemo(() => {
    if (!movies) return [];

    return movies.map((movie) => {
      const match = watchlist?.find((w) => w.name === movie.name);

      return match
        ? {
            ...movie,
            isSaved: true,
            watchlistId: match._id,
            rating: match.rating,
            status: match.status,
          }
        : {
            ...movie,
            isSaved: false,
            rating: 0,
            status: "Plan to Watch",
          };
    });
  }, [movies, watchlist]);

  // --------------------------
  // Add / Remove Watchlist
  // --------------------------
  const toggleSave = async (media) => {
    try {
      if (!media.isSaved) {
        const res = await fetch("http://localhost:5050/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: media.name,
            year: media.year,
            genre: media.genre,
            poster: media.poster,
            rating: media.rating,
            status: media.status,
          }),
        });

        const saved = await res.json();
        mutateWatchlist([...watchlist, { ...media, _id: saved.insertedId }], false);
      } else {
        await fetch(`http://localhost:5050/watchlist/${media.watchlistId}`, {
          method: "DELETE",
        });

        mutateWatchlist(
          watchlist.filter((w) => w._id !== media.watchlistId),
          false
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --------------------------
  // Update Saved Movie Status
  // --------------------------
  const updateWatchlist = async (media, updates) => {
    try {
      await fetch(`http://localhost:5050/watchlist/${media.watchlistId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      mutateWatchlist(
        watchlist.map((w) =>
          w._id === media.watchlistId ? { ...w, ...updates } : w
        ),
        false
      );
    } catch (err) {
      console.error(err);
    }
  };

  // --------------------------
  // Handle Active Tab Filtering
  // --------------------------
  const filteredMedia = useMemo(() => {
    if (activeTab === "tv") return tvList;

    if (activeTab === "upcoming") return upcomingList;

    const list = mediaList.filter((item) => {
      const searchMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const tabMatch =
        activeTab === "all"
          ? true
          : activeTab === "saved"
          ? item.isSaved
          : true;

      return searchMatch && tabMatch;
    });

    return list;
  }, [mediaList, tvList, upcomingList, searchTerm, activeTab]);

  return (
    <div className="App">
      <header>
        <h1>Media Recommender</h1>
        <p>Curate your entertainment feed</p>
        <div className="auth-buttons">
          <SignedOut>
            <SignInButton />
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      {/* Search + Tabs */}
      <div className="controls">
        <input 
          name="Search"
          type="text"
          aria-label="Search"
          placeholder="Search..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            Movies
          </button>

          <button
            className={`tab-btn ${activeTab === "saved" ? "active" : ""}`}
            onClick={() => setActiveTab("saved")}
          >
            Watchlist ({watchlist?.length || 0})
          </button>

          <button
            className={`tab-btn ${activeTab === "tv" ? "active" : ""}`}
            onClick={() => setActiveTab("tv")}
          >
            TV
          </button>

          <button
            className={`tab-btn ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </button>
        </div>
      </div>
        <div class="firefly-container">
          {Array.from({ length: 15 }).map((_, i) => (
            <div class="firefly" key={i}></div>
          ))}
        </div>
      {/* Grid */}
      <div className="media-grid">
        {filteredMedia.length > 0 ? (
          filteredMedia.map((media) => (
            <MediaCard
              key={media._id || media.name}
              media={media}
              onToggleSave={toggleSave}
              onUpdate={updateWatchlist}
              activeTab={activeTab}
            />
          ))
        ) : (
          <div className="empty-message">No items found.</div>
        )}
      </div>
    </div>
  );
}

export default App;



