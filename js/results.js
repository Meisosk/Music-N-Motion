(async () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting){
            entry.target.classList.add("show")
        }
    })
})
const hiddenElements = document.querySelectorAll(".hidden-container")
hiddenElements.forEach((el) => observer.observe(el))

  const instructions = localStorage.getItem("instructions");
  const instructionDiv = document.querySelector(".workoutDiscr");
  instructionDiv.innerText += instructions;
  const workoutName = document.getElementById("workout-name");
  const typeOfWorkout = localStorage.getItem("name");
  let workoutTypeToPage = " ";
  workoutTypeToPage += typeOfWorkout.replace(/_/g, " ");
  workoutName.innerText += workoutTypeToPage;
  const equipment = document.getElementById("equipment");
  const typeOfEquipment = localStorage.getItem("equipment");
  let equipmentToPage = " ";
  equipmentToPage += typeOfEquipment
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toLocaleUpperCase());
  equipment.innerText += equipmentToPage;

  const category = localStorage.getItem("category");
  const iframe = document.querySelector("iframe");

  const token =
    "BQCOgV_cES4de3Rc7HsJA1G6947e3ZFGcwzBP-vHPc_mlfeFfa9CZ8y9Z7eN6UkxiL0gW2O1D30SGUb5dytz8TScdUblv43A401auERBKgbk5_zoWqVIM4ZkSa-NTq5pnxv4FPSKDgzGkFXmPsZLlnRnXj_Y-mL0uYRaMzn3xxuSF88N8-4cAPgyNT2A_KQ32JwgRhq3bJpznI3nlDWNsGWmuA8-9C7nY1-UH3RF0wNdP0xpDekMnLIap_eaQ0pSzacqjeOIXoth6-ImsJIed0KH";
  async function fetchWebApi(endpoint, method, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method,
      body: JSON.stringify(body),
    });

    return await res.json();
  }

  async function getTracksByGenre(genre) {
    const response = await fetchWebApi(
      `v1/search?q=genre:${encodeURIComponent(genre)}&type=track&limit=10`,
      "GET"
    );

    return response.tracks.items.map((item) => item.uri);
  }

  async function createPlaylist(tracksUri) {
    const { id: user_id } = await fetchWebApi("v1/me", "GET");

    const playlist = await fetchWebApi(
      `v1/users/${user_id}/playlists`,
      "POST",
      {
        name: "Your recommendation workout playlist ",
        description:
          "Playlist created by the tutorial on developer.spotify.com",
        public: false,
      }
    );
    await fetchWebApi(
      `v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(",")}`,
      "POST"
    );

    return playlist;
  }

  let genre = "";

  if (category == "olympic_weightlifting") {
    genre = "metalcore";
  } else if (category == "cardio") {
    genre = "power";
  } else if (category == "ploymetrics") {
    genre = "workout";
  } else if (category == "powerlifting") {
    genre = "heavy-metal";
  } else if (category == "strength") {
    genre = "punk-rock";
  } else if (category == "stretching") {
    genre = "dance";
  } else if (category == "strongman") {
    genre = "death-metal";
  } else {
    genre = "power-pop";
  }

  const tracksUri = await getTracksByGenre(genre);
  const createdPlaylist = await createPlaylist(tracksUri);
  iframe.src = `https://open.spotify.com/embed/playlist/${createdPlaylist.id}?utm_source=generator&theme=0`;
})();

class StopWatch {
  constructor() {
    this.startTime = 0;
    this.elapsedTime = 0;
    this.intervalId = null;
    this.hrs = 0;
    this.mins = 0;
    this.secs = 0;
    this.paused = true;
  }

  start() {
    if (this.paused) {
      this.paused = false;
      this.startTime = Date.now() - this.elapsedTime;
      this.intervalId = setInterval(() => this.updateTime(), 75);
    }
  }

  pause() {
    if (!this.paused) {
      this.paused = true;
      this.elapsedTime = Date.now() - this.startTime;
      clearInterval(this.intervalId);
    }
  }

  reset() {
    clearInterval(this.intervalId);
    this.paused = true;
    this.elapsedTime = 0;
    this.startTime = 0;
    this.hrs = 0;
    this.mins = 0;
    this.secs = 0;
    this.updateDisplay();
  }

  updateTime() {
    this.elapsedTime = Date.now() - this.startTime;
    this.secs = Math.floor((this.elapsedTime / 1000) % 60);
    this.mins = Math.floor((this.elapsedTime / (1000 * 60)) % 60);
    this.hrs = Math.floor((this.elapsedTime / (1000 * 60 * 60)) % 60);
    this.updateDisplay();
  }

  updateDisplay() {
    this.secs = this.pad(this.secs);
    this.mins = this.pad(this.mins);
    this.hrs = this.pad(this.hrs);
    const timeDisplay = document.querySelector("#timeDisplay");
    timeDisplay.textContent = `${this.hrs}:${this.mins}:${this.secs}`;
  }

  pad(unit) {
    return unit.toString().padStart(2, "0");
  }
}

const stopWatch = new StopWatch();
const startBtn = document.querySelector("#startBtn");
const pauseBtn = document.querySelector("#pauseBtn");
const resetBtn = document.querySelector("#resetBtn");

startBtn.addEventListener("click", () => stopWatch.start());
pauseBtn.addEventListener("click", () => stopWatch.pause());
resetBtn.addEventListener("click", () => stopWatch.reset());
