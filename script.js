
// =========================
// MUSIC DATA
// =========================

// Add your own MP3 files inside the music folder.
// Add your own album covers inside the images folder.

const songs = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "Luna",
    album: "Night Vibes",
    cover: "image/cover1.png",
    src: "music/song1.mp3"
  },
  {
    id: 2,
    title: "Ocean Waves",
    artist: "The Coast",
    album: "Ocean",
    cover: "image/cover2.png",
    src: "music/song2.mp3"
  },
  {
    id: 3,
    title: "Golden Hour",
    artist: "Sunset",
    album: "Golden",
    cover: "image/cover3.png",
    src: "music/song3.mp3"
  },
  {
    id: 4,
    title: "Lost In Space",
    artist: "Cosmos",
    album: "Space",
    cover: "image/cover4.png",
    src: "music/song4.mp3"
  },
  {
    id: 5,
    title: "City Lights",
    artist: "Neon",
    album: "Urban",
    cover: "image/cover5.png",
    src: "music/song5.mp3"
  },
  {
    id: 6,
    title: "Rainy Mood",
    artist: "Cloud",
    album: "Rain",
    cover: "image/cover6.png",
    src: "music/song6.mp3"
  },
  {
    id: 7,
    title: "Summer Drive",
    artist: "Waves",
    album: "Summer",
    cover: "image/cover7.png",
    src: "music/song7.mp3"
  },
  {
    id: 8,
    title: "Dreamscape",
    artist: "Echo",
    album: "Dreams",
    cover: "image/cover8.png",
    src: "music/song8.mp3"
  }
];

// =========================
// DOM ELEMENTS
// =========================

const audio = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");

const progressBar = document.getElementById("progressBar");
const volumeBar = document.getElementById("volumeBar");

const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");
const playerCover = document.getElementById("playerCover");
const likeBtn = document.getElementById("likeBtn");

const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const searchGrid = document.getElementById("searchGrid");
const emptyMessage = document.getElementById("emptyMessage");

const recentGrid = document.getElementById("recentGrid");
const madeGrid = document.getElementById("madeGrid");

const playAllBtn = document.getElementById("playAllBtn");

// =========================
// PLAYER STATE
// =========================

let currentIndex = -1;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

const likedSongs = new Set();

audio.volume = 0.7;

// =========================
// FORMAT TIME
// =========================

function formatTime(seconds) {

  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

// =========================
// CREATE MUSIC CARDS
// =========================

function createMusicCard(song) {

  const card = document.createElement("article");
  card.className = "music-card";

  card.innerHTML = `
    <div class="cover-wrapper">
      <img src="${song.cover}" alt="${song.title} album cover" loading="lazy">

      <button class="card-play-btn" aria-label="Play ${song.title}">
        ▶
      </button>
    </div>

    <h3>${song.title}</h3>
    <p>${song.artist} • ${song.album}</p>
  `;

  const playCardBtn = card.querySelector(".card-play-btn");

  playCardBtn.addEventListener("click", (event) => {

    event.stopPropagation();

    playSong(song.id);

  });

  card.addEventListener("click", () => {

    playSong(song.id);

  });

  return card;
}

// =========================
// RENDER MUSIC
// =========================

function renderSongs() {

  recentGrid.innerHTML = "";
  madeGrid.innerHTML = "";

  songs.slice(0, 4).forEach(song => {
    recentGrid.appendChild(createMusicCard(song));
  });

  songs.slice(4, 8).forEach(song => {
    madeGrid.appendChild(createMusicCard(song));
  });

}

renderSongs();

// =========================
// PLAY SONG
// =========================

function playSong(id) {

  const index = songs.findIndex(song => song.id === id);

  if (index === -1) return;

  currentIndex = index;

  const song = songs[currentIndex];

  audio.src = song.src;

  playerTitle.textContent = song.title;
  playerArtist.textContent = song.artist;
  playerCover.src = song.cover;

  audio.play()
    .then(() => {

      isPlaying = true;
      updatePlayButton();

    })
    .catch(error => {

      isPlaying = false;
      updatePlayButton();

      console.warn(
        "Playback could not start. Check the music file path.",
        error
      );

    });

  updateLikeButton();

}

// =========================
// PLAY / PAUSE
// =========================

function togglePlay() {

  if (currentIndex === -1) {

    playSong(songs[0].id);
    return;

  }

  if (audio.paused) {

    audio.play()
      .then(() => {

        isPlaying = true;
        updatePlayButton();

      })
      .catch(error => {

        console.warn("Unable to play audio:", error);

      });

  } else {

    audio.pause();

    isPlaying = false;

    updatePlayButton();

  }

}

function updatePlayButton() {

  playBtn.textContent = isPlaying ? "Ⅱ" : "▶";

  playBtn.setAttribute(
    "aria-label",
    isPlaying ? "Pause" : "Play"
  );

}

playBtn.addEventListener("click", togglePlay);

// =========================
// NEXT SONG
// =========================

function nextSong() {

  if (songs.length === 0) return;

  if (isShuffle) {

    let randomIndex;

    do {

      randomIndex = Math.floor(Math.random() * songs.length);

    } while (songs.length > 1 && randomIndex === currentIndex);

    currentIndex = randomIndex;

  } else {

    currentIndex = (currentIndex + 1) % songs.length;

  }

  playSong(songs[currentIndex].id);

}

nextBtn.addEventListener("click", nextSong);

// =========================
// PREVIOUS SONG
// =========================

function previousSong() {

  if (songs.length === 0) return;

  if (audio.currentTime > 3) {

    audio.currentTime = 0;
    return;

  }

  currentIndex =
    (currentIndex - 1 + songs.length) % songs.length;

  playSong(songs[currentIndex].id);

}

prevBtn.addEventListener("click", previousSong);

// =========================
// SHUFFLE
// =========================

shuffleBtn.addEventListener("click", () => {

  isShuffle = !isShuffle;

  shuffleBtn.style.color = isShuffle
    ? "#1ed760"
    : "#bdbdbd";

});

// =========================
// REPEAT
// =========================

repeatBtn.addEventListener("click", () => {

  isRepeat = !isRepeat;

  repeatBtn.style.color = isRepeat
    ? "#1ed760"
    : "#bdbdbd";

});

// =========================
// AUTO NEXT / REPEAT
// =========================

audio.addEventListener("ended", () => {

  if (isRepeat) {

    audio.currentTime = 0;

    audio.play();

  } else {

    nextSong();

  }

});

// =========================
// PROGRESS BAR
// =========================

audio.addEventListener("loadedmetadata", () => {

  progressBar.value = 0;

  durationEl.textContent = formatTime(audio.duration);

});

audio.addEventListener("timeupdate", () => {

  if (!audio.duration) return;

  const progress =
    (audio.currentTime / audio.duration) * 100;

  progressBar.value = progress;

  currentTimeEl.textContent =
    formatTime(audio.currentTime);

});

progressBar.addEventListener("input", () => {

  if (!audio.duration) return;

  audio.currentTime =
    (progressBar.value / 100) * audio.duration;

});

// =========================
// VOLUME CONTROL
// =========================

volumeBar.addEventListener("input", () => {

  audio.volume = Number(volumeBar.value);

});

// =========================
// LIKE BUTTON
// =========================

function updateLikeButton() {

  if (currentIndex === -1) {

    likeBtn.textContent = "♡";
    likeBtn.classList.remove("liked");

    return;

  }

  const song = songs[currentIndex];

  const liked = likedSongs.has(song.id);

  likeBtn.textContent = liked ? "♥" : "♡";

  likeBtn.classList.toggle("liked", liked);

}

likeBtn.addEventListener("click", () => {

  if (currentIndex === -1) return;

  const songId = songs[currentIndex].id;

  if (likedSongs.has(songId)) {

    likedSongs.delete(songId);

  } else {

    likedSongs.add(songId);

  }

  updateLikeButton();

});

// =========================
// SEARCH
// =========================

function performSearch(query) {

  const searchTerm = query.trim().toLowerCase();

  if (searchTerm === "") {

    searchResults.classList.add("hidden");

    return;

  }

  const results = songs.filter(song => {

    return (
      song.title.toLowerCase().includes(searchTerm) ||
      song.artist.toLowerCase().includes(searchTerm) ||
      song.album.toLowerCase().includes(searchTerm)
    );

  });

  searchResults.classList.remove("hidden");

  searchGrid.innerHTML = "";

  emptyMessage.classList.toggle(
    "hidden",
    results.length > 0
  );

  results.forEach(song => {

    searchGrid.appendChild(createMusicCard(song));

  });

}

searchInput.addEventListener("input", () => {

  performSearch(searchInput.value);

});

// =========================
// SEARCH NAVIGATION
// =========================

document.getElementById("searchNav")
  .addEventListener("click", (event) => {

    event.preventDefault();

    searchInput.focus();

    searchInput.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  });

// =========================
// PLAY ALL
// =========================

playAllBtn.addEventListener("click", () => {

  if (songs.length === 0) return;

  if (currentIndex === -1) {

    playSong(songs[0].id);

  } else {

    togglePlay();

  }

});

// =========================
// LOGIN DEMO
// =========================

document.getElementById("loginBtn")
  .addEventListener("click", () => {

    alert(
      "Login is a demo feature. Connect a backend to implement real authentication."
    );

  });

// =========================
// CREATE PLAYLIST DEMO
// =========================

document.getElementById("createPlaylistBtn")
  .addEventListener("click", () => {

    const playlistName = prompt("Enter playlist name:");

    if (!playlistName || !playlistName.trim()) return;

    const playlistList = document.getElementById("playlistList");

    const playlist = document.createElement("p");

    playlist.className = "playlist-item";

    playlist.textContent = playlistName.trim();

    playlistList.appendChild(playlist);

  });

// =========================
// SHOW ALL BUTTONS
// =========================

document.querySelectorAll(".show-all-btn")
  .forEach(button => {

    button.addEventListener("click", () => {

      const section = button.dataset.section;

      if (section === "recent") {

        recentGrid.innerHTML = "";

        songs.forEach(song => {

          recentGrid.appendChild(createMusicCard(song));

        });

      }

      if (section === "made") {

        madeGrid.innerHTML = "";

        songs.forEach(song => {

          madeGrid.appendChild(createMusicCard(song));

        });

      }

    });

  });

// =========================
// BACK / FORWARD DEMO
// =========================

document.getElementById("backBtn")
  .addEventListener("click", () => {

    window.history.back();

  });

document.getElementById("forwardBtn")
  .addEventListener("click", () => {

    window.history.forward();

  });

// Initial button state
updatePlayButton();