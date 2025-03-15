document.addEventListener("click", () => {
  const elem = document.getElementById("game-container");
  if (!document.fullscreenElement) {
    elem
      .requestFullscreen()
      .catch((err) => console.error("Fullscreen error:", err));
  }
});
