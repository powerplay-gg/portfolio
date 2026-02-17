const SUPPORTED_LANGUAGES = new Set(["ru", "en"]);
const CIS_COUNTRY_CODES = new Set([
  "AM",
  "AZ",
  "BY",
  "KZ",
  "KG",
  "MD",
  "RU",
  "TJ",
  "TM",
  "UZ",
]);
const LANGUAGE_STORAGE_KEY = "site-language";

const ROUTES = {
  "/": {
    source: {
      ru: "pages/home.html",
      en: "pages-en/home.html",
    },
    title: {
      ru: "Евгений Чаплыгин - продуктовый дизайнер",
      en: "Evgeniy Chaplygin - Product Designer",
    },
    header: "home",
    scrollThreshold: 700,
  },
  "/mobile_app": {
    source: {
      ru: "pages/mobile_app.html",
      en: "pages-en/mobile_app.html",
    },
    title: {
      ru: "Кейс: Мобильное приложение LINK",
      en: "Case Study: LINK Mobile App",
    },
    header: "case",
    scrollThreshold: 500,
  },
  "/research_onboarding": {
    source: {
      ru: "pages/research_onboarding.html",
      en: "pages-en/research_onboarding.html",
    },
    title: {
      ru: "Кейс: Исследование по онбордингу",
      en: "Case Study: Onboarding Research",
    },
    header: "case",
    scrollThreshold: 500,
  },
  "/design_system": {
    source: {
      ru: "pages/design_system.html",
      en: "pages-en/design_system.html",
    },
    title: {
      ru: "Кейс: Дизайн система Youdo Business",
      en: "Case Study: YouDo Business Design System",
    },
    header: "case",
    scrollThreshold: 500,
  },
  "/new_processes": {
    source: {
      ru: "pages/new_processes.html",
      en: "pages-en/new_processes.html",
    },
    title: {
      ru: "Кейс: Новые процессы отдела дизайна",
      en: "Case Study: New Design Team Processes",
    },
    header: "case",
    scrollThreshold: 500,
  },
};

const ROUTE_ALIASES = {
  "/index.html": "/",
  "/mobile_app.html": "/mobile_app",
  "/research_onboarding.html": "/research_onboarding",
  "/design_system.html": "/design_system",
  "/new_processes.html": "/new_processes",
};

const appRoot = document.getElementById("app");
const mainHeader = document.getElementById("main-header");
let headerScrollThreshold = 500;
let lightboxBound = false;
let lightboxNodes = null;
const PAGE_TRANSITION_MS = 500;
const LIGHTBOX_TRANSITION_MS = 500;
let currentLanguage = "ru";
let hasRenderedOnce = false;
let isNavigating = false;

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const HEADER_TEMPLATES = {
  ru: {
    home: `
      <a href="/" data-spa-link class="header-index">
        <p class="bold-24">Евгений Чаплыгин</p>
      </a>
      <div class="header-links-index">
        <a href="https://t.me/chaplygin_evgeniy" target="_blank" class="header-link-tg" rel="noreferrer">
          <img src="/img/telegram-s.svg" alt="telegram" />
        </a>
        <a href="https://www.linkedin.com/in/evgeniychaplygin/" target="_blank" class="header-link-li" rel="noreferrer">
          <img src="/img/linkedin-s.svg" alt="linkedin" />
        </a>
        <a href="mailto:chaplygindesign@gmail.com" target="_blank" class="header-link-mail" rel="noreferrer">
          <img src="/img/mail-s.svg" alt="mail" />
        </a>
        <a href="/img/CV Евгений Чаплыгин.pdf" target="_blank" class="header-link-cv" rel="noreferrer">
          <p class="extrabold-24">CV</p>
          <img src="/img/externalpage-s.svg" alt="ext" />
        </a>
      </div>
    `,
    case: `
      <a href="/" data-spa-link class="header-index">
        <img src="/img/back.svg" alt="back" />
        <p class="bold-24" style="color: var(--header-back-text-color)">Назад</p>
      </a>
      <div class="header-links-case">
        <a href="https://t.me/chaplygin_evgeniy" target="_blank" class="header-link-tg" rel="noreferrer">
          <img src="/img/telegram-s.svg" alt="telegram" />
        </a>
        <a href="https://www.linkedin.com/in/evgeniychaplygin/" target="_blank" class="header-link-li" rel="noreferrer">
          <img src="/img/linkedin-s.svg" alt="linkedin" />
        </a>
        <a href="mailto:chaplygindesign@gmail.com" target="_blank" class="header-link-mail" rel="noreferrer">
          <img src="/img/mail-s.svg" alt="mail" />
        </a>
        <a href="/img/CV Евгений Чаплыгин.pdf" target="_blank" class="header-link-cv" rel="noreferrer">
          <p class="extrabold-24">CV</p>
          <img src="/img/externalpage-s.svg" alt="ext" />
        </a>
      </div>
    `,
    notFound: "Страница не найдена",
    loadError: "Ошибка загрузки контента",
  },
  en: {
    home: `
      <a href="/" data-spa-link class="header-index">
        <p class="bold-24">Evgeniy Chaplygin</p>
      </a>
      <div class="header-links-index">
        <a href="https://t.me/chaplygin_evgeniy" target="_blank" class="header-link-tg" rel="noreferrer">
          <img src="/img/telegram-s.svg" alt="telegram" />
        </a>
        <a href="https://www.linkedin.com/in/evgeniychaplygin/" target="_blank" class="header-link-li" rel="noreferrer">
          <img src="/img/linkedin-s.svg" alt="linkedin" />
        </a>
        <a href="mailto:chaplygindesign@gmail.com" target="_blank" class="header-link-mail" rel="noreferrer">
          <img src="/img/mail-s.svg" alt="mail" />
        </a>
        <a href="/img/CV Евгений Чаплыгин.pdf" target="_blank" class="header-link-cv" rel="noreferrer">
          <p class="extrabold-24">CV</p>
          <img src="/img/externalpage-s.svg" alt="ext" />
        </a>
      </div>
    `,
    case: `
      <a href="/" data-spa-link class="header-index">
        <img src="/img/back.svg" alt="back" />
        <p class="bold-24" style="color: var(--header-back-text-color)">Back</p>
      </a>
      <div class="header-links-case">
        <a href="https://t.me/chaplygin_evgeniy" target="_blank" class="header-link-tg" rel="noreferrer">
          <img src="/img/telegram-s.svg" alt="telegram" />
        </a>
        <a href="https://www.linkedin.com/in/evgeniychaplygin/" target="_blank" class="header-link-li" rel="noreferrer">
          <img src="/img/linkedin-s.svg" alt="linkedin" />
        </a>
        <a href="mailto:chaplygindesign@gmail.com" target="_blank" class="header-link-mail" rel="noreferrer">
          <img src="/img/mail-s.svg" alt="mail" />
        </a>
        <a href="/img/CV Евгений Чаплыгин.pdf" target="_blank" class="header-link-cv" rel="noreferrer">
          <p class="extrabold-24">CV</p>
          <img src="/img/externalpage-s.svg" alt="ext" />
        </a>
      </div>
    `,
    notFound: "Page not found",
    loadError: "Failed to load content",
  },
};

function normalizePath(pathname) {
  const sanitizedPath =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  if (sanitizedPath in ROUTES) return sanitizedPath;
  if (sanitizedPath in ROUTE_ALIASES) return ROUTE_ALIASES[sanitizedPath];
  if (pathname in ROUTES) return pathname;
  if (pathname in ROUTE_ALIASES) return ROUTE_ALIASES[pathname];
  return pathname;
}

function getLocalizedField(field) {
  if (typeof field === "string") {
    return field;
  }

  return field[currentLanguage] || field.ru || Object.values(field)[0];
}

function getHeaderPack() {
  return HEADER_TEMPLATES[currentLanguage] || HEADER_TEMPLATES.ru;
}

function normalizeLanguage(lang) {
  if (!lang) return null;
  const normalized = String(lang).trim().toLowerCase();
  return SUPPORTED_LANGUAGES.has(normalized) ? normalized : null;
}

function getLanguageFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return normalizeLanguage(params.get("lang"));
}

function getLanguageFromStorage() {
  return normalizeLanguage(localStorage.getItem(LANGUAGE_STORAGE_KEY));
}

function getLanguageFromBrowser() {
  const locales = [navigator.language, ...(navigator.languages || [])].filter(Boolean);
  for (const locale of locales) {
    const short = String(locale).toLowerCase().slice(0, 2);
    if (short === "ru") return "ru";
    if (short === "en") return "en";
  }
  return "en";
}

async function getLanguageFromIp() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1800);

  try {
    const response = await fetch("https://ipapi.co/json/", {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const countryCode = String(data.country_code || "").toUpperCase();
    if (!countryCode) {
      return null;
    }

    return CIS_COUNTRY_CODES.has(countryCode) ? "ru" : "en";
  } catch (_) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function resolveInitialLanguage() {
  const fromUrl = getLanguageFromUrl();
  if (fromUrl) return fromUrl;

  const fromIp = await getLanguageFromIp();
  if (fromIp) return fromIp;

  return getLanguageFromBrowser();
}

function applyLanguage(lang, { persist = true } = {}) {
  const normalized = normalizeLanguage(lang) || "ru";
  currentLanguage = normalized;
  document.documentElement.lang = normalized;

  if (persist) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
  }
}

function renderHeader(type, threshold) {
  const pack = getHeaderPack();
  const headerContent = type === "case" ? pack.case : pack.home;
  mainHeader.innerHTML = headerContent;
  headerScrollThreshold = threshold;
  mainHeader.classList.remove(
    "header-route-enter",
    "header-route-enter-active",
    "header-route-leave"
  );
  handleHeaderVisibility();
}

function handleHeaderVisibility() {
  if (window.scrollY > headerScrollThreshold) {
    mainHeader.classList.add("visible");
  } else {
    mainHeader.classList.remove("visible");
  }
}

function refreshLightbox() {
  if (lightboxBound) return;
  lightboxBound = true;

  appRoot.addEventListener("click", (event) => {
    const lightboxLink = event.target.closest("a.lightbox[href]");
    if (!lightboxLink) return;

    event.preventDefault();
    event.stopPropagation();
    openLightbox(lightboxLink.getAttribute("href"));
  });
}

function buildLightboxNodes(imageSrc) {
  const overlay = document.createElement("div");
  overlay.className = "sl-overlay";

  const wrapper = document.createElement("div");
  wrapper.className = "sl-wrapper custom-sl-wrapper";

  const imageBox = document.createElement("div");
  imageBox.className = "sl-image";

  const image = document.createElement("img");
  image.src = imageSrc;
  image.alt = "";

  imageBox.appendChild(image);
  wrapper.appendChild(imageBox);

  return { overlay, wrapper, imageBox, image };
}

function fitLightboxImage(imageBox, imageElement) {
  const viewportWidth = window.innerWidth * 0.9;
  const viewportHeight = window.innerHeight * 0.9;
  const imageWidth = imageElement.naturalWidth || viewportWidth;
  const imageHeight = imageElement.naturalHeight || viewportHeight;
  const ratio = Math.min(viewportWidth / imageWidth, viewportHeight / imageHeight, 1);

  imageBox.style.width = `${Math.round(imageWidth * ratio)}px`;
  imageBox.style.left = "50%";
  imageBox.style.top = "50%";
}

function destroyLightboxNodes(nodes) {
  if (!nodes) return;

  if (nodes.resizeHandler) {
    window.removeEventListener("resize", nodes.resizeHandler);
  }
  if (nodes.keydownHandler) {
    document.removeEventListener("keydown", nodes.keydownHandler);
  }

  if (nodes.overlay && nodes.overlay.parentNode) {
    nodes.overlay.remove();
  }
  if (nodes.wrapper && nodes.wrapper.parentNode) {
    nodes.wrapper.remove();
  }

  document.body.classList.remove("hidden-scroll");
}

function closeLightbox() {
  if (!lightboxNodes) return;

  const currentNodes = lightboxNodes;
  if (currentNodes.isClosing) return;

  currentNodes.isClosing = true;
  const { overlay, wrapper } = currentNodes;
  overlay.classList.remove("is-open");
  wrapper.classList.remove("is-open");

  window.setTimeout(() => {
    if (lightboxNodes !== currentNodes) return;
    destroyLightboxNodes(currentNodes);
    lightboxNodes = null;
  }, LIGHTBOX_TRANSITION_MS);
}

function openLightbox(imageSrc) {
  if (!imageSrc) return;

  if (lightboxNodes) {
    destroyLightboxNodes(lightboxNodes);
    lightboxNodes = null;
  }

  const nodes = buildLightboxNodes(imageSrc);
  lightboxNodes = nodes;

  const { overlay, wrapper, imageBox, image } = nodes;

  overlay.addEventListener("click", closeLightbox);
  wrapper.addEventListener("click", (event) => {
    if (!event.target.closest(".sl-image")) {
      closeLightbox();
    }
  });

  const keydownHandler = (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  };

  document.addEventListener("keydown", keydownHandler);
  nodes.keydownHandler = keydownHandler;

  image.addEventListener("load", () => {
    fitLightboxImage(imageBox, image);
  });

  if (image.complete) {
    fitLightboxImage(imageBox, image);
  }

  image.addEventListener("error", closeLightbox, { once: true });

  overlay.style.display = "block";
  wrapper.style.display = "block";
  document.body.appendChild(overlay);
  document.body.appendChild(wrapper);
  document.body.classList.add("hidden-scroll");

  requestAnimationFrame(() => {
    overlay.classList.add("is-open");
    wrapper.classList.add("is-open");
  });

  const resizeHandler = () => {
    if (!lightboxNodes) return;
    fitLightboxImage(imageBox, image);
  };

  nodes.resizeHandler = resizeHandler;
  window.addEventListener("resize", resizeHandler);
}

function markInternalLinks(container) {
  const links = container.querySelectorAll("a[href]");
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return;
    }

    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) {
      return;
    }

    const normalized = normalizePath(url.pathname);
    if (ROUTES[normalized]) {
      link.setAttribute("href", normalized);
      link.setAttribute("data-spa-link", "");
    }
  });
}

function rewriteRelativeResourcePaths(container) {
  const resourceAttrs = ["src", "href", "data", "poster"];
  const selectors = resourceAttrs.map((attr) => `[${attr}]`).join(",");
  const nodes = container.querySelectorAll(selectors);

  nodes.forEach((node) => {
    resourceAttrs.forEach((attr) => {
      const value = node.getAttribute(attr);
      if (!value) return;

      if (
        value.startsWith("/") ||
        value.startsWith("#") ||
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("mailto:") ||
        value.startsWith("tel:") ||
        value.startsWith("javascript:")
      ) {
        return;
      }

      node.setAttribute(attr, `/${value.replace(/^\.\//, "")}`);
    });
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function initLiquidGlassHeader() {
  const frame = mainHeader;
  if (!frame || frame.dataset.liquidGlassInitialized === "true") return;

  const SVG_NS = "http://www.w3.org/2000/svg";
  const XLINK_NS = "http://www.w3.org/1999/xlink";
  const filterId = "liquid-glass-filter";
  const defsId = "liquid-glass-defs";
  const refractionSamples = 127;

  const supportsBackdropSvg =
    CSS.supports("backdrop-filter", "url(#test)") ||
    CSS.supports("-webkit-backdrop-filter", "url(#test)");

  if (!supportsBackdropSvg) {
    frame.classList.add("liquid-glass-header--fallback");
    frame.dataset.liquidGlassInitialized = "true";
    return;
  }

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const smoothstep = (edge0, edge1, x) => {
    const t = clamp((x - edge0) / Math.max(edge1 - edge0, 0.000001), 0, 1);
    return t * t * (3 - 2 * t);
  };

  const roundRectSdf = (x, y, width, height, radius) => {
    const px = x - width / 2;
    const py = y - height / 2;
    const bx = width / 2 - radius;
    const by = height / 2 - radius;
    const qx = Math.abs(px) - bx;
    const qy = Math.abs(py) - by;
    const ox = Math.max(qx, 0);
    const oy = Math.max(qy, 0);
    const outsideDistance = Math.hypot(ox, oy);
    const insideDistance = Math.min(Math.max(qx, qy), 0);
    return outsideDistance + insideDistance - radius;
  };

  const surfaceHeight = (distanceFromBorder) => {
    const x = clamp(distanceFromBorder, 0, 1);
    return Math.pow(Math.max(0, 1 - Math.pow(1 - x, 4)), 0.25);
  };

  const surfaceDerivative = (distanceFromBorder) => {
    const delta = 0.001;
    const x1 = clamp(distanceFromBorder - delta, 0, 1);
    const x2 = clamp(distanceFromBorder + delta, 0, 1);
    return (surfaceHeight(x2) - surfaceHeight(x1)) / Math.max(x2 - x1, 0.000001);
  };

  const precomputeRefraction = ({
    sampleCount,
    refractiveIndex,
    thickness,
  }) => {
    const magnitudes = new Array(sampleCount + 1).fill(0);
    let maximumDisplacement = 0;

    for (let i = 0; i <= sampleCount; i += 1) {
      const borderDistance = i / sampleCount;
      const slope = surfaceDerivative(borderDistance);
      const normalX = -slope;
      const normalY = 1;
      const normalLength = Math.hypot(normalX, normalY) || 1;
      const normalizedNormalY = normalY / normalLength;
      const incidence = Math.acos(clamp(normalizedNormalY, -1, 1));
      const refracted = Math.asin(
        clamp((1 / refractiveIndex) * Math.sin(incidence), -1, 1)
      );
      const deviation = incidence - refracted;
      const displacement = Math.max(0, Math.tan(deviation) * thickness);

      magnitudes[i] = displacement;
      maximumDisplacement = Math.max(maximumDisplacement, displacement);
    }

    const normalizedMagnitudes =
      maximumDisplacement > 0
        ? magnitudes.map((magnitude) => magnitude / maximumDisplacement)
        : magnitudes;

    return { normalizedMagnitudes, maximumDisplacement };
  };

  const toByte = (value) => clamp(Math.round(value), 0, 255);

  const createDataCanvas = (width, height) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    return { canvas, context };
  };

  const setSvgHref = (node, href) => {
    node.setAttribute("href", href);
    node.setAttributeNS(XLINK_NS, "xlink:href", href);
  };

  const ensureSvgFilter = () => {
    let svg = document.getElementById(defsId);
    if (!svg) {
      svg = document.createElementNS(SVG_NS, "svg");
      svg.setAttribute("id", defsId);
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("focusable", "false");
      svg.style.position = "fixed";
      svg.style.width = "0";
      svg.style.height = "0";
      svg.style.pointerEvents = "none";
      svg.style.zIndex = "-1";
      const defs = document.createElementNS(SVG_NS, "defs");
      svg.appendChild(defs);
      document.body.appendChild(svg);
    }

    const defs = svg.querySelector("defs");
    let filter = document.getElementById(filterId);

    if (!filter && defs) {
      filter = document.createElementNS(SVG_NS, "filter");
      filter.setAttribute("id", filterId);
      filter.setAttribute("color-interpolation-filters", "sRGB");
      defs.appendChild(filter);

      const displacementImage = document.createElementNS(SVG_NS, "feImage");
      displacementImage.setAttribute("id", `${filterId}-displacement-image`);
      displacementImage.setAttribute("result", "displacement_map");
      displacementImage.setAttribute("preserveAspectRatio", "none");

      const specularImage = document.createElementNS(SVG_NS, "feImage");
      specularImage.setAttribute("id", `${filterId}-specular-image`);
      specularImage.setAttribute("result", "specular_map");
      specularImage.setAttribute("preserveAspectRatio", "none");

      const displacement = document.createElementNS(
        SVG_NS,
        "feDisplacementMap"
      );
      displacement.setAttribute("id", `${filterId}-displacement`);
      displacement.setAttribute("in", "SourceGraphic");
      displacement.setAttribute("in2", "displacement_map");
      displacement.setAttribute("xChannelSelector", "R");
      displacement.setAttribute("yChannelSelector", "G");
      displacement.setAttribute("result", "refracted");

      const blend = document.createElementNS(SVG_NS, "feBlend");
      blend.setAttribute("mode", "screen");
      blend.setAttribute("in", "refracted");
      blend.setAttribute("in2", "specular_map");

      filter.appendChild(displacementImage);
      filter.appendChild(displacement);
      filter.appendChild(specularImage);
      filter.appendChild(blend);
    }

    return filter;
  };

  const filter = ensureSvgFilter();
  if (!filter) {
    frame.classList.add("liquid-glass-header--fallback");
    frame.dataset.liquidGlassInitialized = "true";
    return;
  }

  const displacementImage = document.getElementById(
    `${filterId}-displacement-image`
  );
  const specularImage = document.getElementById(`${filterId}-specular-image`);
  const displacementNode = document.getElementById(`${filterId}-displacement`);

  if (!displacementImage || !specularImage || !displacementNode) {
    frame.classList.add("liquid-glass-header--fallback");
    frame.dataset.liquidGlassInitialized = "true";
    return;
  }

  const rebuildFilterMaps = () => {
    const rect = frame.getBoundingClientRect();
    const width = Math.max(2, Math.round(rect.width));
    const height = Math.max(2, Math.round(rect.height));
    const computedStyle = window.getComputedStyle(frame);
    const declaredRadius = parseFloat(computedStyle.borderTopLeftRadius) || 0;
    const maxRadius = Math.min(width, height) / 2;
    const borderRadius = clamp(declaredRadius || height / 2, 0, maxRadius);
    const bezelWidth = Math.max(7, Math.min(height * 0.46, 32));

    const refraction = precomputeRefraction({
      sampleCount: refractionSamples,
      refractiveIndex: 1.5,
      thickness: bezelWidth * 1.75,
    });

    const displacementScale = refraction.maximumDisplacement * 1.2;
    const specularOpacity = 0.6;
    const specularSaturation = 8;
    const lightAngle = (-60 * Math.PI) / 180;
    const lightDirection = {
      x: Math.cos(lightAngle) * 0.72,
      y: Math.sin(lightAngle) * 0.72,
      z: 0.62,
    };

    const displacementCanvas = createDataCanvas(width, height);
    const specularCanvas = createDataCanvas(width, height);

    if (!displacementCanvas.context || !specularCanvas.context) return;

    const displacementImageData = displacementCanvas.context.createImageData(
      width,
      height
    );
    const specularImageData = specularCanvas.context.createImageData(
      width,
      height
    );

    const displacementData = displacementImageData.data;
    const specularData = specularImageData.data;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const pixelIndex = (y * width + x) * 4;
        const sx = x + 0.5;
        const sy = y + 0.5;
        const sdf = roundRectSdf(sx, sy, width, height, borderRadius);

        let red = 128;
        let green = 128;
        let blue = 128;
        let alpha = 255;
        let specAlpha = 0;

        if (sdf <= 0) {
          const distanceToBorder = -sdf;
          const normalizedBorderDistance = clamp(
            distanceToBorder / bezelWidth,
            0,
            1
          );

          if (normalizedBorderDistance < 1) {
            const sampleIndex = Math.round(
              normalizedBorderDistance * refractionSamples
            );
            const normalizedMagnitude =
              refraction.normalizedMagnitudes[sampleIndex] || 0;

            const gradientX =
              roundRectSdf(sx + 1, sy, width, height, borderRadius) -
              roundRectSdf(sx - 1, sy, width, height, borderRadius);
            const gradientY =
              roundRectSdf(sx, sy + 1, width, height, borderRadius) -
              roundRectSdf(sx, sy - 1, width, height, borderRadius);
            const gradientLength = Math.hypot(gradientX, gradientY) || 1;

            const inwardX = -gradientX / gradientLength;
            const inwardY = -gradientY / gradientLength;
            const edgeAggression =
              0.82 + Math.pow(1 - normalizedBorderDistance, 0.65) * 0.38;
            const encodedX = inwardX * normalizedMagnitude * edgeAggression;
            const encodedY = inwardY * normalizedMagnitude * edgeAggression;

            red = 128 + encodedX * 127;
            green = 128 + encodedY * 127;
            alpha = 255;

            const edgeMask =
              1 - smoothstep(0.08, 1, normalizedBorderDistance);
            const slope = surfaceDerivative(normalizedBorderDistance) * 1.45;
            const normalX = -inwardX * slope;
            const normalY = -inwardY * slope;
            const normalZ = 1;
            const normalLength = Math.hypot(normalX, normalY, normalZ) || 1;

            const nx = normalX / normalLength;
            const ny = normalY / normalLength;
            const nz = normalZ / normalLength;
            const lightDot = Math.max(
              0,
              nx * lightDirection.x + ny * lightDirection.y + nz * lightDirection.z
            );

            const rimSpecular =
              Math.pow(lightDot, specularSaturation) *
              edgeMask *
              specularOpacity;
            const topGlow =
              Math.pow(
                Math.max(0, 1 - (sy / height) * 1.2 - Math.abs((sx / width) - 0.5)),
                2
              ) * 0.18;
            specAlpha = clamp((rimSpecular + topGlow) * 255, 0, 255);
          }
        }

        displacementData[pixelIndex] = toByte(red);
        displacementData[pixelIndex + 1] = toByte(green);
        displacementData[pixelIndex + 2] = toByte(blue);
        displacementData[pixelIndex + 3] = toByte(alpha);

        specularData[pixelIndex] = 240;
        specularData[pixelIndex + 1] = 248;
        specularData[pixelIndex + 2] = 255;
        specularData[pixelIndex + 3] = toByte(specAlpha);
      }
    }

    displacementCanvas.context.putImageData(displacementImageData, 0, 0);
    specularCanvas.context.putImageData(specularImageData, 0, 0);

    const displacementDataUrl = displacementCanvas.canvas.toDataURL("image/png");
    const specularDataUrl = specularCanvas.canvas.toDataURL("image/png");

    filter.setAttribute("filterUnits", "userSpaceOnUse");
    filter.setAttribute("primitiveUnits", "userSpaceOnUse");
    filter.setAttribute("x", "0");
    filter.setAttribute("y", "0");
    filter.setAttribute("width", String(width));
    filter.setAttribute("height", String(height));

    const filterNodes = [displacementImage, specularImage];
    filterNodes.forEach((node) => {
      node.setAttribute("x", "0");
      node.setAttribute("y", "0");
      node.setAttribute("width", String(width));
      node.setAttribute("height", String(height));
    });

    setSvgHref(displacementImage, displacementDataUrl);
    setSvgHref(specularImage, specularDataUrl);
    displacementNode.setAttribute("scale", displacementScale.toFixed(2));
  };

  rebuildFilterMaps();

  if (typeof ResizeObserver === "function") {
    const observer = new ResizeObserver(() => {
      rebuildFilterMaps();
    });
    observer.observe(frame);
  } else {
    window.addEventListener("resize", rebuildFilterMaps);
  }

  frame.dataset.liquidGlassInitialized = "true";
}

function jumpToTopInstant() {
  const previousScrollBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = "auto";
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  document.documentElement.style.scrollBehavior = previousScrollBehavior;
}

function buildPageNode(contentHtml, animateIn) {
  const page = document.createElement("div");
  page.className = "route-page";

  if (animateIn) {
    page.classList.add("route-enter");
  }

  page.innerHTML = contentHtml;
  return page;
}

async function animatePageExit() {
  const currentPage = appRoot.querySelector(".route-page");
  const isHeaderVisible = mainHeader.classList.contains("visible");

  if (!currentPage) return;

  currentPage.classList.add("route-leave");
  if (isHeaderVisible) {
    mainHeader.classList.add("header-route-leave");
  }
  await wait(PAGE_TRANSITION_MS);
}

async function animatePageEnter(pageNode) {
  const hasPageEnter = pageNode.classList.contains("route-enter");
  if (!hasPageEnter) return;

  requestAnimationFrame(() => {
    pageNode.classList.add("route-enter-active");
  });

  await wait(PAGE_TRANSITION_MS);
  pageNode.classList.remove("route-enter", "route-enter-active");
  mainHeader.classList.remove("header-route-leave");
}

async function loadRoute(pathname, { replace = false } = {}) {
  if (isNavigating) return;
  isNavigating = true;

  const normalizedPath = normalizePath(pathname);
  const route = ROUTES[normalizedPath] || ROUTES["/"];
  const targetPath = ROUTES[normalizedPath] ? normalizedPath : "/";

  if (window.location.pathname !== targetPath) {
    if (replace) {
      history.replaceState({}, "", targetPath);
    } else {
      history.pushState({}, "", targetPath);
    }
  }

  try {
    const routeSource = getLocalizedField(route.source);
    const response = await fetch(routeSource, { cache: "no-store" });
    const pack = getHeaderPack();
    let contentHtml = `<div class="content"><p class="h2">${pack.notFound}</p></div>`;
    let title = pack.notFound;
    let headerType = "home";
    let headerThreshold = 700;

    if (response.ok) {
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const content = doc.querySelector(".content");

      if (content) {
        contentHtml = content.outerHTML;
        title = getLocalizedField(route.title);
        headerType = route.header;
        headerThreshold = route.scrollThreshold;
      } else {
        contentHtml = `<div class="content"><p class="h2">${pack.loadError}</p></div>`;
        title = pack.loadError;
      }
    }

    if (hasRenderedOnce) {
      await animatePageExit();
    }

    appRoot.innerHTML = "";
    const nextPage = buildPageNode(contentHtml, true);
    appRoot.appendChild(nextPage);

    jumpToTopInstant();
    mainHeader.classList.remove(
      "visible",
      "header-route-enter",
      "header-route-enter-active",
      "header-route-leave"
    );
    rewriteRelativeResourcePaths(appRoot);
    markInternalLinks(appRoot);
    renderHeader(headerType, headerThreshold);
    document.title = title;
    refreshLightbox();

    await animatePageEnter(nextPage);

    hasRenderedOnce = true;
  } finally {
    isNavigating = false;
  }
}

function tryRestoreRedirectedPath() {
  const redirectedPath = sessionStorage.getItem("spa-redirect");
  if (!redirectedPath) return;

  sessionStorage.removeItem("spa-redirect");
  const url = new URL(redirectedPath, window.location.origin);
  history.replaceState(
    {},
    "",
    `${normalizePath(url.pathname)}${url.search}${url.hash}`
  );
}

window.addEventListener("scroll", handleHeaderVisibility);
window.addEventListener("popstate", () => {
  loadRoute(window.location.pathname, { replace: true });
});

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");
  if (!link) return;

  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  const href = link.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return;
  }

  const url = new URL(href, window.location.origin);
  if (url.origin !== window.location.origin) {
    return;
  }

  const normalized = normalizePath(url.pathname);
  if (!ROUTES[normalized]) {
    return;
  }

  event.preventDefault();
  loadRoute(normalized);
});

async function bootstrap() {
  initLiquidGlassHeader();
  tryRestoreRedirectedPath();
  const detectedLanguage = await resolveInitialLanguage();
  applyLanguage(detectedLanguage, { persist: false });
  loadRoute(window.location.pathname, { replace: true });
}

bootstrap();
