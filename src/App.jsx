import React, { useState, useMemo } from "react";
import useSWR from "swr";
import "./App.css";

const fetcher = (url) => fetch(url).then((res) => res.json());

// Media Card
const MediaCard = ({ media, onToggleSave, onUpdate, activeTab }) => {
  return (
    <div className="media-card">
      <div className="card-image">
        <span>🎬</span>
      </div>

      <div className="card-content">
        <h3>{media.name}</h3>
        <div className="card-meta">
          <span>{media.year}</span> • <span>{media.genre}</span>
        </div>

        {activeTab === "saved" && media.isSaved && (
          <div className="watchlist-controls">
            <label>
              Status:
              <select
                value={media.status}
                onChange={(e) => onUpdate(media, { status: e.target.value })}
              >
                <option value="Plan to Watch">Plan to Watch</option>
                <option value="Watching">Watching</option>
                <option value="Watched">Watched</option>
              </select>
            </label>

            <label>
              Rating:
              <input
                type="number"
                min={0}
                max={5}
                value={media.rating || 0}
                onChange={(e) =>
                  onUpdate(media, { rating: parseInt(e.target.value) })
                }
              />
            </label>
          </div>
        )}
      </div>

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

  // Merge movies with watchlist flags
  const mediaList = useMemo(() => {
    if (!movies) return [];
    return movies.map((movie) => {
      const match = watchlist?.find((w) => w.name === movie.name);
      return match
        ? { ...movie, isSaved: true, watchlistId: match._id, rating: match.rating, status: match.status }
        : { ...movie, isSaved: false, rating: 0, status: "Plan to Watch" };
    });
  }, [movies, watchlist]);

  // Add / Remove from watchlist
  const toggleSave = async (media) => {
    try {
      if (!media.isSaved) {
        // Add
        const res = await fetch("http://localhost:5050/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: media.name,
            year: media.year,
            genre: media.genre,
            rating: media.rating,
            status: media.status,
          }),
        });
        const saved = await res.json();
        mutateWatchlist([...watchlist, { ...media, _id: saved.insertedId }], false);
      } else {
        // Remove
        await fetch(`http://localhost:5050/watchlist/${media.watchlistId}`, { method: "DELETE" });
        mutateWatchlist(watchlist.filter((w) => w._id !== media.watchlistId), false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update rating or status
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

  // Filtered media
  const filteredMedia = useMemo(() => {
    return mediaList.filter((item) => {
      const searchMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const tabMatch = activeTab === "all" ? true : activeTab === "saved" ? item.isSaved : true;
      return searchMatch && tabMatch;
    });
  }, [mediaList, searchTerm, activeTab]);

  return (
    <div className="App">
      <header>
        <h1>Media Recommender</h1>
        <p>Curate your entertainment feed</p>
      </header>

      <div className="controls">
        <input
          type="text"
          placeholder="Search movies..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            Discover All
          </button>
          <button
            className={`tab-btn ${activeTab === "saved" ? "active" : ""}`}
            onClick={() => setActiveTab("saved")}
          >
            Watchlist ({watchlist?.length || 0})
          </button>
        </div>
      </div>

      <div className="media-grid">
        {filteredMedia.length > 0 ? (
        filteredMedia.map((media) => (
          <MediaCard
            key={media._id || media.name}
            media={media}
            onToggleSave={toggleSave}
            onUpdate={updateWatchlist}
            activeTab={activeTab} // <-- pass activeTab here
          />
        ))
        ) : (
        <div className="empty-message">No movies found.</div>
        )}

      </div>
    </div>
  );
}

export default App;


