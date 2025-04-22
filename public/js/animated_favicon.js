// List of frame URLs (replace with actual paths to your PNG frames)
const frames = [
  "assets/favicon/favicon_1.png",
  "assets/favicon/favicon_2.png",
  "assets/favicon/favicon_3.png",
  "assets/favicon/favicon_4.png",
  "assets/favicon/favicon_5.png",
  "assets/favicon/favicon_6.png",
  "assets/favicon/favicon_7.png",
  "assets/favicon/favicon_8.png",
];

let currentFrame = 0;

function updateFavicon() {
  const favicon =
    document.querySelector("link[rel='icon']") ||
    document.createElement("link");
  favicon.rel = "icon";
  favicon.href = frames[currentFrame]; // Set to the current frame
  document.head.appendChild(favicon);

  currentFrame = (currentFrame + 1) % frames.length; // Loop back to first frame
}

// Change favicon every 100ms (adjust speed as needed)
//setInterval(updateFavicon, 100);
