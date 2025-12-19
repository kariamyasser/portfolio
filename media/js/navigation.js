/**
 * Interactive Resume Navigation System
 * Pixel-by-pixel horizontal scrolling with parallax background
 */

class ResumeNavigation {
  constructor() {
    // Spaceship position (percentage)
    this.spaceshipX = 5;
    this.spaceshipY = 45;

    // Movement speed (percentage per frame)
    this.moveSpeed = 0.8;
    this.mobileScrollSpeed = 1.5;

    // Scroll position (pixels)
    this.scrollX = 0;
    this.maxScrollX = 500; // 600vw - 100vw = 500vw

    // Boundaries
    this.minX = 5;
    this.maxX = 90;
    this.minY = 10;
    this.maxY = 85;

    // Key states
    this.keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
    };

    // Button press states (for mobile)
    this.buttonPressed = {
      left: false,
      right: false,
    };

    this.container = document.getElementById("sections-container");
    this.background = document.getElementById("background-layer");
    this.spaceship = document.getElementById("space-ship");
    this.prevButton = document.getElementById("nav-prev");
    this.nextButton = document.getElementById("nav-next");
    this.audioPlayer = document.getElementById("player");
    this.audioButton = document.getElementById("audio-player-button");

    this.animationFrame = null;

    this.init();
  }

  init() {
    // Set initial spaceship position
    this.updateSpaceshipPosition();

    // Set initial scroll
    this.updateScroll();

    // Event listeners
    this.attachEventListeners();

    // Prevent default scroll behavior
    this.preventDefaultScroll();

    // Handle window resize
    this.handleResize();

    // Start animation loop
    this.startAnimationLoop();
  }

  attachEventListeners() {
    // Keyboard navigation - keydown
    document.addEventListener("keydown", (e) => this.handleKeyDown(e));

    // Keyboard navigation - keyup
    document.addEventListener("keyup", (e) => this.handleKeyUp(e));

    // Mobile button navigation - HOLD TO SCROLL
    if (this.prevButton) {
      // Mouse events
      this.prevButton.addEventListener("mousedown", (e) => {
        e.preventDefault();
        this.buttonPressed.left = true;
      });
      this.prevButton.addEventListener("mouseup", () => {
        this.buttonPressed.left = false;
      });
      this.prevButton.addEventListener("mouseleave", () => {
        this.buttonPressed.left = false;
      });

      // Touch events
      this.prevButton.addEventListener(
        "touchstart",
        (e) => {
          e.preventDefault();
          this.buttonPressed.left = true;
        },
        { passive: false }
      );
      this.prevButton.addEventListener("touchend", () => {
        this.buttonPressed.left = false;
      });
      this.prevButton.addEventListener("touchcancel", () => {
        this.buttonPressed.left = false;
      });
    }

    if (this.nextButton) {
      // Mouse events
      this.nextButton.addEventListener("mousedown", (e) => {
        e.preventDefault();
        this.buttonPressed.right = true;
      });
      this.nextButton.addEventListener("mouseup", () => {
        this.buttonPressed.right = false;
      });
      this.nextButton.addEventListener("mouseleave", () => {
        this.buttonPressed.right = false;
      });

      // Touch events
      this.nextButton.addEventListener(
        "touchstart",
        (e) => {
          e.preventDefault();
          this.buttonPressed.right = true;
        },
        { passive: false }
      );
      this.nextButton.addEventListener("touchend", () => {
        this.buttonPressed.right = false;
      });
      this.nextButton.addEventListener("touchcancel", () => {
        this.buttonPressed.right = false;
      });
    }

    // Audio player
    if (this.audioButton) {
      this.audioButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleAudio();
      });
    }

    // Touch swipe navigation (mobile)
    this.attachSwipeListeners();

    // Window resize
    window.addEventListener("resize", () => this.handleResize());
  }

  toggleAudio() {
    if (!this.audioPlayer) {
      console.error("Audio player not found");
      return;
    }

    const icon = this.audioButton.querySelector("i");

    if (this.audioPlayer.paused) {
      const playPromise = this.audioPlayer.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio playing");
            if (icon) icon.className = "fa fa-pause";
          })
          .catch((err) => {
            console.error("Audio play failed:", err);
            // Try user interaction workaround
            alert("Click OK to enable audio");
            this.audioPlayer
              .play()
              .then(() => {
                if (icon) icon.className = "fa fa-pause";
              })
              .catch((e) => console.error("Still failed:", e));
          });
      }
    } else {
      this.audioPlayer.pause();
      console.log("Audio paused");
      if (icon) icon.className = "fa fa-play";
    }
  }

  preventDefaultScroll() {
    // Prevent mouse wheel scroll
    window.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
      },
      { passive: false }
    );

    // Prevent touchpad scroll
    window.addEventListener(
      "touchmove",
      (e) => {
        if (e.target.closest(".section")) {
          e.preventDefault();
        }
      },
      { passive: false }
    );

    // Prevent arrow key default scroll
    window.addEventListener(
      "keydown",
      (e) => {
        if (
          ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(
            e.code
          )
        ) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
  }

  handleKeyDown(e) {
    if (this.keys.hasOwnProperty(e.code)) {
      this.keys[e.code] = true;
    }
  }

  handleKeyUp(e) {
    if (this.keys.hasOwnProperty(e.code)) {
      this.keys[e.code] = false;
    }
  }

  startAnimationLoop() {
    const animate = () => {
      this.updateMovement();
      this.animationFrame = requestAnimationFrame(animate);
    };
    animate();
  }

  updateMovement() {
    let moved = false;
    const isMobile = window.innerWidth <= 768;

    // Desktop keyboard controls
    if (!isMobile) {
      if (this.keys.ArrowUp) {
        this.spaceshipY -= this.moveSpeed;
        this.spaceshipY = Math.max(this.spaceshipY, this.minY);
        moved = true;
      }
      if (this.keys.ArrowDown) {
        this.spaceshipY += this.moveSpeed;
        this.spaceshipY = Math.min(this.spaceshipY, this.maxY);
        moved = true;
      }
      if (this.keys.ArrowLeft) {
        this.spaceshipX -= this.moveSpeed;
        // this.spaceshipY -= this.moveSpeed * 0.3;

        this.spaceshipX = Math.max(this.spaceshipX, this.minX);
        this.spaceshipY = Math.max(this.spaceshipY, this.minY);

        this.scrollX -= window.innerWidth * (this.moveSpeed / 100);
        this.scrollX = Math.max(this.scrollX, 0);

        this.spaceship.style.transform = "rotate(270deg)";
        moved = true;
      }
      if (this.keys.ArrowRight) {
        this.spaceshipX += this.moveSpeed;
        //  this.spaceshipY -= this.moveSpeed * 0.3;

        this.spaceshipX = Math.min(this.spaceshipX, this.maxX);
        this.spaceshipY = Math.max(this.spaceshipY, this.minY);

        this.scrollX += window.innerWidth * (this.moveSpeed / 100);
        this.scrollX = Math.min(
          this.scrollX,
          (window.innerWidth * this.maxScrollX) / 100
        );

        this.spaceship.style.transform = "rotate(90deg)";
        moved = true;
      }
    }

    // Mobile button controls
    if (this.buttonPressed.left) {
      this.scrollX -= window.innerWidth * (this.mobileScrollSpeed / 100);
      this.scrollX = Math.max(this.scrollX, 0);

      if (isMobile) {
        this.spaceship.style.transform = "translate(-50%, -50%) rotate(270deg)";
      }

      moved = true;
    }

    if (this.buttonPressed.right) {
      this.scrollX += window.innerWidth * (this.mobileScrollSpeed / 100);
      this.scrollX = Math.min(
        this.scrollX,
        (window.innerWidth * this.maxScrollX) / 100
      );

      if (isMobile) {
        this.spaceship.style.transform = "translate(-50%, -50%) rotate(90deg)";
      }

      moved = true;
    }

    if (moved) {
      this.updateSpaceshipPosition();
      this.updateScroll();
      this.updateButtonStates();
    }
  }

  updateSpaceshipPosition() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      this.spaceship.style.left = "50%";
      this.spaceship.style.top = "50%";

      // Preserve rotation or set default
      if (!this.buttonPressed.left && !this.buttonPressed.right) {
        // Get current rotation or default to 90deg
        const currentTransform = this.spaceship.style.transform;
        if (
          !currentTransform ||
          currentTransform === "" ||
          currentTransform === "translate(-50%, -50%)"
        ) {
          this.spaceship.style.transform =
            "translate(-50%, -50%) rotate(90deg)";
        }
      }
    } else {
      this.spaceship.style.left = `${this.spaceshipX}%`;
      this.spaceship.style.top = `${this.spaceshipY}%`;

      // Preserve rotation or set default
      const currentTransform = this.spaceship.style.transform;
      if (!currentTransform || currentTransform === "") {
        this.spaceship.style.transform = "rotate(90deg)";
      }
    }
  }

  updateScroll() {
    // Calculate scroll in vw
    const scrollVw = (this.scrollX / window.innerWidth) * 100;

    // Move sections container
    this.container.style.transform = `translateX(-${scrollVw}vw)`;

    // Move background layer (parallax effect - slower movement)
    const backgroundScrollVw = scrollVw * 0.5;
    this.background.style.transform = `translateX(-${backgroundScrollVw}vw)`;

    // Update star particles with scroll position
    if (window.starSystem) {
      window.starSystem.updateScroll(this.scrollX);
    }
  }

  updateButtonStates() {
    if (this.prevButton) {
      if (this.scrollX <= 0) {
        this.prevButton.classList.add("disabled");
      } else {
        this.prevButton.classList.remove("disabled");
      }
    }

    if (this.nextButton) {
      if (this.scrollX >= (window.innerWidth * this.maxScrollX) / 100) {
        this.nextButton.classList.add("disabled");
      } else {
        this.nextButton.classList.remove("disabled");
      }
    }
  }

  attachSwipeListeners() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let isSwiping = false;

    document.addEventListener(
      "touchstart",
      (e) => {
        if (
          e.target.closest(".nav-button") ||
          e.target.closest("#audio-player-button")
        ) {
          return;
        }

        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        isSwiping = true;
      },
      { passive: true }
    );

    document.addEventListener(
      "touchmove",
      (e) => {
        if (!isSwiping) return;

        if (
          e.target.closest(".nav-button") ||
          e.target.closest("#audio-player-button")
        ) {
          return;
        }

        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;

        const deltaX = touchStartX - touchEndX;
        const deltaY = touchStartY - touchEndY;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
          this.scrollX += deltaX * 2;
          this.scrollX = Math.max(
            0,
            Math.min(this.scrollX, (window.innerWidth * this.maxScrollX) / 100)
          );

          this.updateScroll();
          this.updateButtonStates();

          touchStartX = touchEndX;
          touchStartY = touchEndY;
        }
      },
      { passive: true }
    );

    document.addEventListener(
      "touchend",
      (e) => {
        if (!isSwiping) return;

        if (
          e.target.closest(".nav-button") ||
          e.target.closest("#audio-player-button")
        ) {
          return;
        }

        isSwiping = false;

        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
          this.spaceship.style.transform =
            "translate(-50%, -50%) rotate(90deg)";
        }
      },
      { passive: true }
    );
  }

  handleResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.updateScroll();
      this.updateSpaceshipPosition();
      this.updateButtonStates();
    }, 250);
  }
}

// Initialize navigation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.resumeNav = new ResumeNavigation();
  });
} else {
  window.resumeNav = new ResumeNavigation();
}