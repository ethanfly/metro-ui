/* =====================================================================
   METRO UI — Interactions
   ===================================================================== */
(function () {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     1. TILE ENTRANCE STAGGER — assign each tile its animation index.
     ------------------------------------------------------------------ */
  function staggerTiles() {
    $$(".tile-group.is-animated").forEach((group) => {
      $$(".tile", group).forEach((tile, i) => tile.style.setProperty("--i", i));
    });
  }

  /* ------------------------------------------------------------------
     2. LIVE TILES — flip the face stack on an interval, swapping content
        into the hidden face so the flip always reveals something fresh.
     ------------------------------------------------------------------ */
  const liveTiles = [];

  function registerLiveTiles() {
    $$(".tile.live").forEach((tile) => {
      const faces = $$(".tile-face", tile);
      if (faces.length < 2) return;
      liveTiles.push({ tile, faces, index: 0, interval: 4200 });
    });
  }

  function startLiveTiles() {
    if (prefersReduced) return;
    liveTiles.forEach((t) => {
      t.timer = setInterval(() => flipLiveTile(t), t.interval);
    });
  }

  function flipLiveTile(t) {
    t.index = (t.index + 1) % t.faces.length;
    const nextFace = t.faces[t.index];
    // Swap fresh content into the face we're about to reveal (if it has a
    // data source via a custom attribute hook).
    const src = nextFace.getAttribute("data-src");
    if (src && window.metroLiveSources && window.metroLiveSources[src]) {
      nextFace.innerHTML = window.metroLiveSources[src]();
    }
    // Peek tiles slide; standard live tiles 3D-flip.
    if (t.tile.classList.contains("peek")) {
      t.tile.classList.toggle("is-shifted", t.index % 2 === 1);
    } else {
      t.tile.classList.toggle("is-flipped", t.index % 2 === 1);
    }
  }

  // Expose live content sources for tiles that opt into data-driven refresh.
  window.metroLiveSources = window.metroLiveSources || {};

  /* ------------------------------------------------------------------
     3. CLOCK LIVE TILE — ticks every second, updates the time face.
     ------------------------------------------------------------------ */
  function startClocks() {
    const clocks = $$("[data-live-clock]");
    if (!clocks.length) return;
    const tick = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      const date = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
      clocks.forEach((el) => {
        if (el.dataset.liveClock === "time") el.textContent = `${h}:${m}`;
        else if (el.dataset.liveClock === "seconds") el.textContent = `${h}:${m}:${s}`;
        else if (el.dataset.liveClock === "date") el.textContent = date;
      });
    };
    tick();
    if (!prefersReduced) setInterval(tick, 1000);
  }

  /* ------------------------------------------------------------------
     4. COUNTER LIVE TILE — climbs toward a target, flips to show it.
     ------------------------------------------------------------------ */
  function startCounters() {
    $$("[data-counter]").forEach((el) => {
      const target = parseInt(el.dataset.counter, 10) || 0;
      let cur = 0;
      const step = Math.max(1, Math.round(target / 80));
      const interval = setInterval(() => {
        cur = Math.min(target, cur + step);
        el.textContent = cur.toLocaleString();
        if (cur >= target) clearInterval(interval);
      }, 24);
    });
  }

  /* ------------------------------------------------------------------
     5. PIVOT — switch active panel + slide the underline indicator.
     ------------------------------------------------------------------ */
  function initPivots() {
    $$(".pivot").forEach((pivot) => {
      const headers = $$(".pivot-header", pivot);
      const panels  = $$(".pivot-panel", pivot);
      let indicator = $(".pivot-indicator", pivot);
      if (!indicator) {
        indicator = document.createElement("span");
        indicator.className = "pivot-indicator";
        $(".pivot-headers", pivot).appendChild(indicator);
      }
      const moveIndicator = (header) => {
        indicator.style.left  = header.offsetLeft + "px";
        indicator.style.width = header.offsetWidth + "px";
      };
      headers.forEach((h, i) => {
        h.addEventListener("click", () => {
          headers.forEach((x) => x.classList.remove("is-active"));
          panels.forEach((p) => p.classList.remove("is-active"));
          h.classList.add("is-active");
          panels[i].classList.add("is-active");
          moveIndicator(h);
        });
      });
      // Initialize to the active header (or the first).
      const active = headers.find((h) => h.classList.contains("is-active")) || headers[0];
      if (active) {
        active.classList.add("is-active");
        panels[headers.indexOf(active)]?.classList.add("is-active");
        requestAnimationFrame(() => moveIndicator(active));
      }
      window.addEventListener("resize", () => {
        const a = headers.find((h) => h.classList.contains("is-active"));
        if (a) moveIndicator(a);
      });
    });
  }

  /* ------------------------------------------------------------------
     6. APP BAR — toggle with button, right-click, or swipe-up.
     ------------------------------------------------------------------ */
  function initAppBar() {
    const appbar = $("#appbar");
    const trigger = $("[data-appbar-trigger]");
    if (!appbar) return;
    const toggle = () => appbar.classList.toggle("is-open");
    if (trigger) trigger.addEventListener("click", (e) => { e.preventDefault(); toggle(); });
    document.addEventListener("contextmenu", (e) => {
      // Right-click anywhere toggles the app bar — classic Windows 8 gesture.
      // Don't hijack context menus on form fields.
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || e.target.closest(".no-appbar")) return;
      e.preventDefault();
      toggle();
    });
    $$("[data-appbar-close]", appbar).forEach((b) => b.addEventListener("click", () => appbar.classList.remove("is-open")));
    // Clicking the empty app bar closes it.
    appbar.addEventListener("click", (e) => {
      if (e.target === appbar || e.target.classList.contains("appbar-spacer")) appbar.classList.remove("is-open");
    });
  }

  /* ------------------------------------------------------------------
     7. FLYOUTS + DIALOGS — declarative open/close via data attributes.
     ------------------------------------------------------------------ */
  function initOverlays() {
    const openTarget = (id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const scrim = $(`[data-scrim-for="${id}"]`) || ensureScrim(el);
      el.classList.add("is-open");
      if (scrim) scrim.classList.add("is-open");
    };
    const closeTarget = (id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.remove("is-open");
      $$(`[data-scrim-for="${id}"]`).forEach((s) => s.classList.remove("is-open"));
    };

    const ensureScrim = (el) => {
      const scrim = document.createElement("div");
      scrim.className = "scrim";
      scrim.setAttribute("data-scrim-for", el.id);
      document.body.appendChild(scrim);
      scrim.addEventListener("click", () => closeTarget(el.id));
      return scrim;
    };

    $$("[data-open]").forEach((btn) =>
      btn.addEventListener("click", () => openTarget(btn.dataset.open))
    );
    $$("[data-close]").forEach((btn) =>
      btn.addEventListener("click", () => closeTarget(btn.dataset.close))
    );
    // Esc closes any open overlay.
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") $$(".flyout.is-open, .dialog.is-open").forEach((el) => {
        el.classList.remove("is-open");
        $$(`[data-scrim-for="${el.id}"]`).forEach((s) => s.classList.remove("is-open"));
      });
    });
  }

  /* ------------------------------------------------------------------
     8. SEARCH BOX — clear button visibility + live filter.
     ------------------------------------------------------------------ */
  function initSearch() {
    $$(".search").forEach((box) => {
      const input = $("input", box);
      const clear = $(".clear", box);
      if (!input) return;
      const sync = () => box.classList.toggle("has-value", input.value.length > 0);
      input.addEventListener("input", sync);
      if (clear) clear.addEventListener("click", () => { input.value = ""; input.focus(); sync(); });
      sync();
    });
  }

  /* ------------------------------------------------------------------
     9. THEME SWITCH — light/dark, persisted to localStorage.
     ------------------------------------------------------------------ */
  function initTheme() {
    const root = document.documentElement;
    const stored = localStorage.getItem("metro-theme");
    if (stored) root.setAttribute("data-theme", stored);
    $$("[data-theme-toggle]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        if (next === "dark") root.setAttribute("data-theme", "dark");
        else root.removeAttribute("data-theme");
        localStorage.setItem("metro-theme", next);
      })
    );
  }

  /* ------------------------------------------------------------------
     10. PROGRESS DEMO — animate a determinate bar on demand.
     ------------------------------------------------------------------ */
  function initProgress() {
    $$("[data-progress-run]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const bar = $("#" + btn.dataset.progressRun + " .bar");
        if (!bar) return;
        bar.style.transition = "none"; bar.style.width = "0%";
        requestAnimationFrame(() => {
          bar.style.transition = ""; bar.style.width = "100%";
        });
      });
    });
  }

  /* ------------------------------------------------------------------
     11. NAV — smooth scroll + active rail highlight on scroll.
     ------------------------------------------------------------------ */
  function initNav() {
    $$("[data-nav]").forEach((link) => {
      link.addEventListener("click", (e) => {
        const target = document.getElementById(link.dataset.nav);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
        }
      });
    });
    const sections = $$("[data-section]");
    const links = $$(".rail-link[data-nav]");
    if (!sections.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) =>
          l.classList.toggle("is-active", l.dataset.nav === entry.target.id)
        );
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach((s) => io.observe(s));
  }

  /* ------------------------------------------------------------------
     12. REVEAL ON SCROLL — fade sections in.
     ------------------------------------------------------------------ */
  function initReveal() {
    if (prefersReduced) { $$(".reveal").forEach((el) => el.classList.add("is-shown")); return; }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-shown"); obs.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    $$(".reveal").forEach((el) => io.observe(el));
  }

  /* ------------------------------------------------------------------
     13. TOAST/STATUS TILE — randomize live status updates.
     ------------------------------------------------------------------ */
  function startLiveTicker() {
    const ticker = $("[data-ticker]");
    if (!ticker || prefersReduced) return;
    const items = (ticker.dataset.tickerItems || "").split("|").filter(Boolean);
    if (items.length < 2) return;
    let i = 0;
    setInterval(() => {
      i = (i + 1) % items.length;
      const span = document.createElement("span");
      span.className = "flip-num";
      span.textContent = items[i];
      ticker.replaceChildren(span);
    }, 3500);
  }

  /* ------------------------------------------------------------------
     14. DROPDOWN MENUS — toggle open/close, click outside to close.
     ------------------------------------------------------------------ */
  function initDropdowns() {
    $$(".dropdown").forEach((dropdown) => {
      const trigger = $(".dropdown-trigger", dropdown);
      if (!trigger) return;

      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("is-open");
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".dropdown")) {
        $$(".dropdown.is-open").forEach((d) => d.classList.remove("is-open"));
      }
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        $$(".dropdown.is-open").forEach((d) => d.classList.remove("is-open"));
      }
    });
  }

  /* ------------------------------------------------------------------
     15. TAG INPUT — add tags on Enter, remove on click.
     ------------------------------------------------------------------ */
  function initTagInputs() {
    $$(".tag-input").forEach((container) => {
      const input = $("input", container);
      if (!input) return;

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && input.value.trim()) {
          e.preventDefault();
          const tag = document.createElement("span");
          tag.className = "tag";
          tag.innerHTML = `${input.value.trim()} <button class="tag-remove"><svg class="glyph sm"><use href="#i-error"/></svg></button>`;
          container.insertBefore(tag, input);
          input.value = "";

          // Add remove handler
          tag.querySelector(".tag-remove").addEventListener("click", () => {
            tag.remove();
          });
        }
      });
    });

    // Remove tags on click
    $$(".tag-remove").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        btn.closest(".tag").remove();
      });
    });
  }

  /* ------------------------------------------------------------------
     16. NUMBER INPUT — increment/decrement buttons.
     ------------------------------------------------------------------ */
  function initNumberInputs() {
    $$(".number-input").forEach((container) => {
      const input = $("input", container);
      const btns = $$("button", container);
      if (!input || btns.length < 2) return;

      const min = parseFloat(input.min) || -Infinity;
      const max = parseFloat(input.max) || Infinity;
      const step = parseFloat(input.step) || 1;

      btns[0].addEventListener("click", () => {
        const val = parseFloat(input.value) || 0;
        const newVal = Math.max(min, val - step);
        input.value = newVal;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });

      btns[1].addEventListener("click", () => {
        const val = parseFloat(input.value) || 0;
        const newVal = Math.min(max, val + step);
        input.value = newVal;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
    });
  }

  /* ------------------------------------------------------------------
     17. CHARACTER COUNTER — update count on input.
     ------------------------------------------------------------------ */
  function initCharCounters() {
    $$(".textarea-with-counter").forEach((textarea) => {
      const counter = textarea.parentNode.querySelector(".char-count span");
      if (!counter) return;

      const updateCount = () => {
        counter.textContent = textarea.value.length;
      };

      textarea.addEventListener("input", updateCount);
      updateCount();
    });
  }

  /* ------------------------------------------------------------------
     18. RATING — click to set rating.
     ------------------------------------------------------------------ */
  function initRatings() {
    $$(".rating:not(.rating--readonly)").forEach((container) => {
      const stars = $$(".rating-star", container);

      stars.forEach((star, index) => {
        star.addEventListener("click", () => {
          stars.forEach((s, i) => {
            s.classList.toggle("is-filled", i <= index);
          });
        });
      });
    });
  }

  /* ------------------------------------------------------------------
     19. FILE UPLOAD — drag & drop + click to browse.
     ------------------------------------------------------------------ */
  function initFileUploads() {
    $$(".file-upload").forEach((container) => {
      const input = $("input[type='file']", container);
      if (!input) return;

      container.addEventListener("click", () => input.click());

      container.addEventListener("dragover", (e) => {
        e.preventDefault();
        container.classList.add("is-dragover");
      });

      container.addEventListener("dragleave", () => {
        container.classList.remove("is-dragover");
      });

      container.addEventListener("drop", (e) => {
        e.preventDefault();
        container.classList.remove("is-dragover");
        input.files = e.dataTransfer.files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
    });
  }

  /* ------------------------------------------------------------------
     20. COLOR PICKER — select color on click.
     ------------------------------------------------------------------ */
  function initColorPickers() {
    $$(".color-picker").forEach((container) => {
      $$(".color-swatch", container).forEach((swatch) => {
        swatch.addEventListener("click", () => {
          $$(".color-swatch", container).forEach((s) => s.classList.remove("is-selected"));
          swatch.classList.add("is-selected");
        });
      });
    });
  }

  /* ------------------------------------------------------------------
     21. TOAST NOTIFICATIONS — programmatic API.
     ------------------------------------------------------------------ */
  window.metroToast = function(options = {}) {
    const {
      title = "Notification",
      message = "",
      type = "info",
      duration = 4000,
    } = options;

    // Create container if not exists
    let container = $(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    // Create toast
    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <svg class="glyph"><use href="#i-${type === 'success' ? 'success' : type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'info'}"/></svg>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-message">${message}</div>` : ""}
      </div>
      <button class="toast-close"><svg class="glyph sm"><use href="#i-error"/></svg></button>
    `;

    container.appendChild(toast);

    // Close handler
    const close = () => {
      toast.classList.add("is-closing");
      setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector(".toast-close").addEventListener("click", close);

    // Auto-close
    if (duration > 0) {
      setTimeout(close, duration);
    }

    return { close };
  };

  /* ------------------------------------------------------------------
     22. CUSTOM SELECT DROPDOWN — fully custom single-select dropdown.
     ------------------------------------------------------------------ */
  function initMetroSelects() {
    const allSelects = $$("[data-metro-select]:not([data-cascade])");

    allSelects.forEach((select) => {
      const trigger = $(".metro-select-trigger", select);
      const panel = $(".metro-select-panel", select);
      const options = $$(".metro-option:not(.metro-option-group)", select);
      const searchInput = $(".metro-select-search input", select);

      if (!trigger || !panel) return;

      // Toggle dropdown
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const wasOpen = select.classList.contains("is-open");

        // Close all other dropdowns
        $$("[data-metro-select].is-open, [data-metro-multi].is-open, [data-cascade].is-open").forEach((s) => {
          if (s !== select) s.classList.remove("is-open");
        });

        select.classList.toggle("is-open", !wasOpen);

        // Focus search input if exists
        if (!wasOpen && searchInput) {
          setTimeout(() => searchInput.focus(), 100);
        }
      });

      // Select option
      options.forEach((option) => {
        option.addEventListener("click", () => {
          // Remove selected state from all
          options.forEach((o) => o.classList.remove("is-selected"));

          // Add selected to clicked option
          option.classList.add("is-selected");

          // Update trigger text
          const placeholder = $(".placeholder", trigger);
          const leadIcon = $(".lead-icon", trigger);
          const text = option.textContent.trim();

          if (placeholder) {
            placeholder.textContent = text;
            placeholder.classList.remove("placeholder");
          } else {
            // Find or create text node
            const textNode = trigger.childNodes[trigger.childNodes.length - 1];
            if (textNode.nodeType === 3) {
              textNode.textContent = text;
            } else {
              // Create text node
              const span = document.createElement("span");
              span.textContent = text;
              trigger.insertBefore(span, $(".metro-select-arrow", trigger));
            }
          }

          // Close dropdown
          select.classList.remove("is-open");

          // Reset search
          if (searchInput) {
            searchInput.value = "";
            options.forEach((o) => o.style.display = "");
          }
        });
      });

      // Search filter
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          const query = e.target.value.toLowerCase();
          options.forEach((option) => {
            const text = option.textContent.toLowerCase();
            option.style.display = text.includes(query) ? "" : "none";
          });

          // Show empty state if no matches
          const emptyState = $(".metro-select-empty", select);
          const visibleOptions = options.filter((o) => o.style.display !== "none");

          if (visibleOptions.length === 0) {
            if (!emptyState) {
              const empty = document.createElement("div");
              empty.className = "metro-select-empty";
              empty.textContent = "No matches found";
              panel.appendChild(empty);
            }
          } else if (emptyState) {
            emptyState.remove();
          }
        });

        // Prevent dropdown close when clicking search
        searchInput.addEventListener("click", (e) => e.stopPropagation());
      }
    });

    // Close all dropdowns on outside click
    document.addEventListener("click", () => {
      $$("[data-metro-select].is-open, [data-metro-multi].is-open, [data-cascade].is-open").forEach((s) => {
        s.classList.remove("is-open");
      });
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        $$("[data-metro-select].is-open, [data-metro-multi].is-open, [data-cascade].is-open").forEach((s) => {
          s.classList.remove("is-open");
        });
      }
    });
  }

  /* ------------------------------------------------------------------
     23. MULTI-SELECT DROPDOWN — multiple selection with tags.
     ------------------------------------------------------------------ */
  function initMetroMultiSelects() {
    $$("[data-metro-multi]").forEach((select) => {
      const trigger = $(".metro-select-trigger", select);
      const panel = $(".metro-select-panel", select);
      const options = $$(".metro-option", select);
      const tagsContainer = $(".selected-tags", trigger);
      const searchInput = $(".metro-select-search input", select);

      if (!trigger || !panel || !tagsContainer) return;

      // Toggle dropdown
      trigger.addEventListener("click", (e) => {
        if (e.target.closest(".tag-x")) return; // Don't toggle on tag remove
        e.stopPropagation();
        const wasOpen = select.classList.contains("is-open");

        // Close all other dropdowns
        $$("[data-metro-select].is-open, [data-metro-multi].is-open, [data-cascade].is-open").forEach((s) => {
          if (s !== select) s.classList.remove("is-open");
        });

        select.classList.toggle("is-open", !wasOpen);

        // Focus search input if exists
        if (!wasOpen && searchInput) {
          setTimeout(() => searchInput.focus(), 100);
        }
      });

      // Select/deselect option
      options.forEach((option) => {
        option.addEventListener("click", (e) => {
          e.stopPropagation();
          const isSelected = option.classList.contains("is-selected");
          const value = option.getAttribute("data-value");
          const text = option.textContent.trim();

          if (isSelected) {
            // Deselect
            option.classList.remove("is-selected");
            const tag = tagsContainer.querySelector(`[data-value="${value}"]`);
            if (tag) tag.remove();
          } else {
            // Select
            option.classList.add("is-selected");

            // Create tag
            const tag = document.createElement("span");
            tag.className = "metro-select-tag";
            tag.setAttribute("data-value", value);
            tag.innerHTML = `
              ${text}
              <button class="tag-x" type="button">×</button>
            `;

            // Remove tag on click
            tag.querySelector(".tag-x").addEventListener("click", (e) => {
              e.stopPropagation();
              option.classList.remove("is-selected");
              tag.remove();
            });

            tagsContainer.appendChild(tag);
          }
        });
      });

      // Search filter
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          const query = e.target.value.toLowerCase();
          options.forEach((option) => {
            const text = option.textContent.toLowerCase();
            option.style.display = text.includes(query) ? "" : "none";
          });
        });

        // Prevent dropdown close when clicking search
        searchInput.addEventListener("click", (e) => e.stopPropagation());
      }

      // Prevent dropdown close when clicking tags
      tagsContainer.addEventListener("click", (e) => e.stopPropagation());
    });
  }

  /* ------------------------------------------------------------------
     24. CASCADING SELECT — dependent dropdowns.
     ------------------------------------------------------------------ */
  function initCascadeSelects() {
    const cascadeData = {
      US: [
        { value: "nyc", text: "New York" },
        { value: "la", text: "Los Angeles" },
        { value: "chi", text: "Chicago" }
      ],
      CN: [
        { value: "bj", text: "北京" },
        { value: "sh", text: "上海" },
        { value: "gz", text: "广州" }
      ],
      JP: [
        { value: "tk", text: "東京" },
        { value: "os", text: "大阪" },
        { value: "ky", text: "京都" }
      ]
    };

    // Bind trigger click (open/close) for ALL cascade selects
    $$("[data-cascade]").forEach((select) => {
      const trigger = $(".metro-select-trigger", select);
      if (!trigger) return;
      // Save original placeholder HTML for cascade resets
      const phSpan = trigger.querySelector(".placeholder");
      if (phSpan) select._placeholderHTML = phSpan.innerHTML;

      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const wasOpen = select.classList.contains("is-open");
        // Close all other dropdowns
        $$("[data-metro-select].is-open, [data-metro-multi].is-open, [data-cascade].is-open").forEach((s) => {
          if (s !== select) s.classList.remove("is-open");
        });
        select.classList.toggle("is-open", !wasOpen);
      });
    });

    // Bind parent (country) option clicks
    $$("[data-cascade]").forEach((select) => {
      const cascadeType = select.getAttribute("data-cascade");
      const parentType = select.getAttribute("data-cascade-parent");

      if (cascadeType === "country") {
        const options = $$(".metro-option", select);

        options.forEach((option) => {
          option.addEventListener("click", () => {
            const cascadeValue = option.getAttribute("data-cascade");

            // Update selected state in parent
            options.forEach((o) => o.classList.remove("is-selected"));
            option.classList.add("is-selected");

            // Update parent trigger text
            const trigger = $(".metro-select-trigger", select);
            const textSpan = trigger ? trigger.querySelector("span:not(.metro-select-arrow)") : null;
            if (textSpan) {
              textSpan.textContent = option.textContent.trim();
              textSpan.classList.remove("placeholder");
            }

            // Close parent dropdown
            select.classList.remove("is-open");

            // Find child (city) select
            const childSelect = document.querySelector(`[data-cascade-parent="${cascadeType}"]`);
            if (!childSelect) return;

            const panel = $(".metro-select-panel", childSelect);
            if (!panel) return;

            // Reset child trigger text back to placeholder
            const childTrigger = $(".metro-select-trigger", childSelect);
            const childTextSpan = childTrigger ? childTrigger.querySelector(".placeholder, span:not(.metro-select-arrow)") : null;
            if (childTextSpan) {
              // Restore saved original HTML if available
              if (childSelect._placeholderHTML) {
                childTextSpan.innerHTML = childSelect._placeholderHTML;
              }
              childTextSpan.classList.add("placeholder");
            }

            // Get cities for selected country
            const cities = cascadeData[cascadeValue] || [];

            // Update child options
            panel.innerHTML = cities.map(city => `
              <div class="metro-option" data-value="${city.value}">${city.text}</div>
            `).join("");

            // Initialize new options
            $$(".metro-option", panel).forEach((newOption) => {
              newOption.addEventListener("click", () => {
                // Update child trigger text
                const childTrigger = $(".metro-select-trigger", childSelect);
                const childTextSpan = childTrigger ? childTrigger.querySelector("span:not(.metro-select-arrow)") : null;
                if (childTextSpan) {
                  childTextSpan.textContent = newOption.textContent.trim();
                  childTextSpan.classList.remove("placeholder");
                }

                // Update selected state
                $$(".metro-option", panel).forEach((o) => o.classList.remove("is-selected"));
                newOption.classList.add("is-selected");

                // Close child dropdown
                childSelect.classList.remove("is-open");
              });
            });
          });
        });
      }
    });
  }


  /* ------------------------------------------------------------------
     25. MENU BAR — application menu with nested submenus.
     ------------------------------------------------------------------ */
  function initMenuBars() {
    $$(".menubar").forEach((menubar) => {
      const items = $$(".menubar-item", menubar);

      // Hover to open/close menus
      items.forEach((item) => {
        let timeout;

        item.addEventListener("mouseenter", () => {
          clearTimeout(timeout);
          // Close all other open menus in this menubar
          items.forEach((i) => i !== item && i.classList.remove("is-active"));
          // Open this menu
          if ($(".menubar-menu", item)) {
            item.classList.add("is-active");
          }
        });

        item.addEventListener("mouseleave", () => {
          timeout = setTimeout(() => {
            item.classList.remove("is-active");
          }, 100);
        });

        // Click to toggle (for touch devices)
        item.addEventListener("click", (e) => {
          e.stopPropagation();
          const isActive = item.classList.contains("is-active");
          items.forEach((i) => i.classList.remove("is-active"));
          if (!isActive && $(".menubar-menu", item)) {
            item.classList.add("is-active");
          }
        });
      });

      // Close on click outside
      document.addEventListener("click", (e) => {
        if (!menubar.contains(e.target)) {
          items.forEach((i) => i.classList.remove("is-active"));
        }
      });

      // Close on Escape
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          items.forEach((i) => i.classList.remove("is-active"));
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     26. i18n — Language switching (English/Chinese).
     ------------------------------------------------------------------ */
  function initI18n() {
    // Initialize language from localStorage or default to 'en'
    const savedLang = localStorage.getItem("metro-lang");
    if (savedLang && (savedLang === "en" || savedLang === "zh")) {
      document.documentElement.setAttribute("lang", savedLang);
    }

    // Bind language toggle buttons
    $$("[data-lang-toggle]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const currentLang = document.documentElement.getAttribute("lang") || "en";
        const newLang = currentLang === "en" ? "zh" : "en";
        document.documentElement.setAttribute("lang", newLang);
        localStorage.setItem("metro-lang", newLang);
      });
    });
  }
  /* ------------------------------------------------------------------
     Boot.
     ------------------------------------------------------------------ */
  function init() {
    staggerTiles();
    registerLiveTiles();
    startClocks();
    initPivots();
    initAppBar();
    initOverlays();
    initSearch();
    initTheme();
    initProgress();
    initNav();
    initReveal();
    initDropdowns();
    initTagInputs();
    initNumberInputs();
    initCharCounters();
    initRatings();
    initFileUploads();
    initColorPickers();
    initMetroSelects();
    initMetroMultiSelects();
    initCascadeSelects();
    initMenuBars();
    initI18n();
    startCounters();
    startLiveTicker();
    // Defer live-tile flipping so the entrance animation plays first.
    setTimeout(startLiveTiles, 1200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();