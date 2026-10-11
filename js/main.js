document.addEventListener("DOMContentLoaded", () => {
    // =====================================
    // 1. Populate Content from Config
    // =====================================
    document.title = `${config.couple.names} - Wedding Invitation`;

    document.getElementById("hero-names").textContent = config.couple.names;

    // Turns **bold** markers into highlighted spans (e.g. the couple's names)
    function formatCardText(raw) {
        return raw.replace(/\*\*(.+?)\*\*/g, '<span class="highlight-name">$1</span>');
    }

    // Four link editions, matching the physical card set:
    //   ?invite=barat  -> blessing + Barat programme card
    //   ?invite=ijtema -> Ijtema invitation card only
    //   ?invite=walima -> Walima invitation + programme cards
    //   (no param, or ?invite=full) -> everything, in chronological order
    const urlParams = new URLSearchParams(window.location.search);
    const inviteType = urlParams.get('invite') || 'full';

    let allowedEvents = ['ijtema', 'barat', 'walima']; // default to all
    let showBlessing = true;
    if (inviteType === 'walima') {
        allowedEvents = ['walima'];
        showBlessing = false;
    } else if (inviteType === 'barat') {
        allowedEvents = ['barat'];
        showBlessing = true;
    } else if (inviteType === 'ijtema') {
        allowedEvents = ['ijtema'];
        showBlessing = false;
    }

    // Sort to maintain chronological order
    const orderedKeys = ['ijtema', 'barat', 'walima'];
    allowedEvents.sort((a, b) => orderedKeys.indexOf(a) - orderedKeys.indexOf(b));

    if (showBlessing) {
        document.getElementById("blessing-text").textContent = config.copy.blessing;
    } else {
        document.getElementById("blessing-section").remove();
    }

    // "With Best Compliments" doesn't apply to the Ijtema-only edition.
    if (inviteType === 'ijtema') {
        document.getElementById("closing-section").remove();
    } else {
        document.getElementById("closing-content").textContent = config.copy.closing;
    }

    // Build one invitation/programme card per entry in each included event's
    // `cards` array, and inject them right after the countdown section.
    const cardsHTML = allowedEvents.map(eventId => {
        const event = config.events[eventId];
        return (event.cards || []).map(card => `
            <section class="formal-invitation card-${eventId} card-type-${card.type} section-animate">
                <div class="section-scroll">
                    ${card.label ? `<p class="programme-label">${card.label}</p>` : ''}
                    <div class="invitation-text">${formatCardText(card.body)}</div>
                    ${card.showCompliments ? `<div class="card-compliments">${formatCardText(config.copy.closing)}</div>` : ''}
                </div>
            </section>
        `).join('');
    }).join('');
    document.getElementById("countdown-section").insertAdjacentHTML('afterend', cardsHTML);

    // Set Countdown Target to the FIRST included event
    const firstEvent = config.events[allowedEvents[0]];
    window.countdownTargetDate = new Date(firstEvent.targetDate).getTime();

    // "Wedding Day" on the Hero always means the Nikah/Barat date specifically,
    // consistently on every edition - even Ijtema-only/Walima-only - not
    // whichever single event that particular link happens to be for. The
    // countdown further down still targets that edition's own event.
    document.getElementById("hero-date").textContent = config.events.barat.date;

    // Schedule only makes sense when more than one event is on this edition -
    // a single-event link already states its own date/time on its card, so
    // the Schedule section (which lists every included event) is dropped
    // entirely rather than showing a redundant one-line list.
    const isSingleEvent = allowedEvents.length === 1;
    if (isSingleEvent) {
        document.getElementById("schedule-section").remove();
    } else {
        const timeline = document.getElementById("timeline");
        allowedEvents.forEach(eventId => {
            const event = config.events[eventId];
            const item = document.createElement("div");
            item.className = "timeline-item";
            item.innerHTML = `
                <div class="timeline-time">${event.time}</div>
                <div class="timeline-node"></div>
                <div class="timeline-title">${event.title}<br><small style="font-size:0.9rem; opacity:0.8; font-family: var(--font-sans);">${event.date}</small></div>
            `;
            timeline.appendChild(item);
        });
    }

    // Populate Venues - single-event editions get an embedded map too (no
    // API key needed, Google's plain "output=embed" query form), since
    // there's just the one card and the extra room reads as sparse without it.
    const venuesContainer = document.getElementById("venues-container");
    allowedEvents.forEach(eventId => {
        const venue = config.events[eventId];
        const card = document.createElement("div");
        card.className = "venue-card";
        const mapQuery = encodeURIComponent(`${venue.venueName}, ${venue.venueAddress}`);
        card.innerHTML = `
            <h3>${venue.venueTitle}</h3>
            <h4>${venue.venueName}</h4>
            <p>${venue.venueAddress}</p>
            ${isSingleEvent ? `<iframe class="venue-map" src="https://maps.google.com/maps?q=${mapQuery}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="${venue.venueTitle} location"></iframe>` : ''}
            <a href="${venue.mapLink}" target="_blank" rel="noopener noreferrer" class="btn-map">Open in Maps</a>
        `;
        venuesContainer.appendChild(card);
    });

    // =====================================
    // 2. Gatefold & Music
    // =====================================
    const envScreen = document.getElementById("envelope-screen");

    const bgMusic = document.getElementById("bg-music");
    const musicToggle = document.getElementById("music-toggle");
    const iconPlay = document.getElementById("icon-play");
    const iconPause = document.getElementById("icon-pause");

    let isPlaying = false;

    function openEnvelope() {
        if (envScreen.classList.contains("hidden") || envScreen.classList.contains("is-open")) return;

        // Swing the doors open
        envScreen.classList.add("is-open");

        // Let the card fade/rise in as the doors swing apart
        setTimeout(() => {
            observeElements();
        }, 500);

        // Fully remove the overlay once the doors have finished swinging
        setTimeout(() => {
            envScreen.classList.add("hidden");
            // This is a real user gesture (tap/scroll), so autoplay should be allowed
            bgMusic.play().then(() => {
                isPlaying = true;
                iconPlay.style.display = 'none';
                iconPause.style.display = 'block';
            }).catch(() => {
                isPlaying = false;
                iconPlay.style.display = 'block';
                iconPause.style.display = 'none';
            });
        }, 2100);
    }

    envScreen.addEventListener("click", openEnvelope);
    envScreen.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openEnvelope();
        }
    });
    envScreen.addEventListener("wheel", openEnvelope);
    envScreen.addEventListener("touchmove", openEnvelope);

    musicToggle.addEventListener("click", () => {
        if (isPlaying) {
            bgMusic.pause();
            iconPlay.style.display = 'block';
            iconPause.style.display = 'none';
        } else {
            bgMusic.play();
            iconPlay.style.display = 'none';
            iconPause.style.display = 'block';
        }
        isPlaying = !isPlaying;
    });

    // =====================================
    // 3. Scroll Animations
    // =====================================
    function observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.section-animate').forEach(sec => {
            observer.observe(sec);
        });
    }

    // =====================================
    // 4. Countdown Timer
    // =====================================
    const targetDate = window.countdownTargetDate;
    
    const elDays = document.getElementById("cd-days");
    const elHours = document.getElementById("cd-hours");
    const elMins = document.getElementById("cd-mins");
    const elSecs = document.getElementById("cd-secs");

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            elDays.textContent = "00";
            elHours.textContent = "00";
            elMins.textContent = "00";
            elSecs.textContent = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        elDays.textContent = days.toString().padStart(2, '0');
        elHours.textContent = hours.toString().padStart(2, '0');
        elMins.textContent = minutes.toString().padStart(2, '0');
        elSecs.textContent = seconds.toString().padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // =====================================
    // 5. RSVP Modal & Form Logic
    // =====================================
    const modal = document.getElementById("rsvp-modal");
    const openRsvpBtn = document.getElementById("open-rsvp-modal");
    const closeRsvpBtn = document.querySelector(".close-modal");
    const form = document.getElementById("rsvp-form");
    const radios = document.querySelectorAll('input[name="attending"]');
    const attendingOnlyFields = document.querySelectorAll(".attending-only");
    
    // Open modal
    openRsvpBtn.addEventListener("click", () => {
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        document.getElementById("guest-name").focus();
        document.body.style.overflow = "hidden"; // prevent background scroll
    });

    // Close modal
    function closeModal() {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        openRsvpBtn.focus();
    }

    closeRsvpBtn.addEventListener("click", closeModal);
    
    // Close on escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            closeModal();
        }
    });

    // Close on click outside
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Toggle fields based on attendance
    radios.forEach(radio => {
        radio.addEventListener("change", (e) => {
            if (e.target.value === "yes") {
                attendingOnlyFields.forEach(f => f.style.display = "block");
                document.getElementById("guest-count").setAttribute("required", "true");
            } else {
                attendingOnlyFields.forEach(f => f.style.display = "none");
                document.getElementById("guest-count").removeAttribute("required");
            }
        });
    });

    // Handle Form Submission (simulated for now, backend instructions in README)
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById("submit-rsvp-btn");
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        // Simulate network request
        setTimeout(() => {
            form.classList.add("hidden");
            document.getElementById("rsvp-success").classList.remove("hidden");
            
            // To actually connect to Google Sheets, you would do a fetch() to the Apps Script URL here.
            // Example:
            // const formData = new FormData(form);
            // fetch('YOUR_APPS_SCRIPT_URL', { method: 'POST', body: formData })
            //   .then(...)
            
        }, 1500);
    });
});
