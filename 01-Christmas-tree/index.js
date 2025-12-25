
MorphSVGPlugin.convertToPath("polygon");

var xmlns = "http://www.w3.org/2000/svg",
  xlinkns = "http://www.w3.org/1999/xlink",
  select = (s) => document.querySelector(s),
  selectAll = (s) => document.querySelectorAll(s),
  pContainer = select(".pContainer"),
  mainSVG = select(".mainSVG"),
  star = select("#star"),
  sparkle = select(".sparkle"),
  showParticle = true,
  particleColorArray = [
    "#E8F6F8",
    "#ACE8F8",
    "#F6FBFE",
    "#A2CBDC",
    "#B74551",
    "#5DBA72",
    "#910B28",
    "#910B28",
    "#446D39"
  ],
  particleTypeArray = ["#star", "#circ", "#cross", "#heart"],
  particlePool = [],
  particleCount = 0,
  numParticles = 201;

gsap.set("svg", { visibility: "visible" });

gsap.set(sparkle, {
  transformOrigin: "50% 50%",
  y: -100
});

const getSVGPoints = (path) => {
  let arr = [];
  let rawPath = MotionPathPlugin.getRawPath(path)[0];
  rawPath.forEach((el, i) => {
    if (i % 2) {
      arr.push({
        x: rawPath[i * 2],
        y: rawPath[i * 2 + 1]
      });
    }
  });
  return arr;
};

let treePath = getSVGPoints(".treePath");
let treeBottomPath = getSVGPoints(".treeBottomPath");

var mainTl = gsap.timeline(),
  starTl;

function flicker(p) {
  gsap.killTweensOf(p, { opacity: true });
  gsap.fromTo(
    p,
    { opacity: 1 },
    { duration: 0.07, opacity: Math.random(), repeat: -1 }
  );
}

function createParticles() {
  let i = numParticles;
  while (--i > -1) {
    let p = select(
      particleTypeArray[i % particleTypeArray.length]
    ).cloneNode(true);

    mainSVG.appendChild(p);
    p.setAttribute(
      "fill",
      particleColorArray[i % particleColorArray.length]
    );
    p.setAttribute("class", "particle");
    particlePool.push(p);

    gsap.set(p, {
      x: -100,
      y: -100,
      transformOrigin: "50% 50%"
    });
  }
}

let getScale = gsap.utils.random(0.5, 3, 0.001, true);

function playParticle() {
  if (!showParticle) return;

  let p = particlePool[particleCount];

  gsap.set(p, {
    x: gsap.getProperty(".pContainer", "x"),
    y: gsap.getProperty(".pContainer", "y"),
    scale: getScale()
  });

  gsap.to(p, {
    duration: gsap.utils.random(0.6, 6),
    physics2D: {
      velocity: gsap.utils.random(-23, 23),
      angle: gsap.utils.random(-180, 180),
      gravity: gsap.utils.random(-6, 50)
    },
    scale: 0,
    rotation: gsap.utils.random(-123, 360),
    ease: "power1",
    onStart: flicker,
    onStartParams: [p]
  });

  particleCount = (particleCount + 1) % numParticles;
}

function drawStar() {
  starTl = gsap.timeline({ onUpdate: playParticle });

  starTl
    .to(".pContainer, .sparkle", {
      duration: 6,
      motionPath: { path: ".treePath" },
      ease: "linear"
    })
    .to(".pContainer, .sparkle", {
      duration: 1,
      onStart: () => (showParticle = false),
      x: treeBottomPath[0].x,
      y: treeBottomPath[0].y
    })
    .to(".pContainer, .sparkle", {
      duration: 2,
      onStart: () => (showParticle = true),
      motionPath: { path: ".treeBottomPath" },
      ease: "linear"
    })
    .from(".treeBottomMask", {
      duration: 2,
      drawSVG: "0% 0%",
      stroke: "#FFF"
    });
}

createParticles();
drawStar();

/* MAIN TREE TIMELINE */
mainTl
  .from([".treePathMask", ".treePotMask"], {
    drawSVG: "0% 0%",
    stroke: "#FFF",
    stagger: 6,
    duration: gsap.utils.wrap([6, 1, 2]),
    ease: "linear"
  })
  .from(".treeStar", {
    duration: 3,
    scaleY: 0,
    scaleX: 0.15,
    transformOrigin: "50% 50%",
    ease: "elastic(1,0.5)"
  }, "-=4")
  .to(".sparkle", {
    duration: 3,
    opacity: 0
  })
  .to(".treeStarOutline", {
    duration: 1,
    opacity: 1
  })

  /* ✅ H1 APPEARS AT THE END */
  .to("h1", {
    duration: 1.5,
    opacity: 1,
    y: 0,
    ease: "power3.out"
  });

mainTl.add(starTl, 0);
gsap.globalTimeline.timeScale(1.5);
