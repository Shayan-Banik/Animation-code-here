
      const parallaxImages = document.querySelectorAll(".parallax-image");

      function parallaxEffect() {
        const scrolled = window.pageYOffset;

        parallaxImages.forEach((img) => {
          const speed = img.getAttribute("data-speed");
          const yPos = -(scrolled * speed);
          img.style.transform = `translateY(${yPos}px)`;
        });
      }

      // Smooth parallax on scroll
      window.addEventListener("scroll", () => {
        requestAnimationFrame(parallaxEffect);
      });

      // Add mouse movement parallax effect
      document.addEventListener("mousemove", (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        parallaxImages.forEach((img) => {
          const speed = parseFloat(img.getAttribute("data-speed"));
          const moveX = mouseX * 50 * speed;
          const moveY = mouseY * 50 * speed;

          const scrolled = window.pageYOffset;
          const yPos = -(scrolled * speed);

          img.style.transform = `translateY(${yPos}px) translateX(${moveX}px) rotateY(${
            moveX * 0.5
          }deg) rotateX(${-moveY * 0.5}deg)`;
        });
      });
      parallaxEffect();
  