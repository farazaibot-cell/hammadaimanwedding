document.addEventListener("DOMContentLoaded", () => {
    // =====================================
    // 1. Populate Content from Config
    // =====================================
    document.title = `${config.couple.names} - Wedding Invitation`;

    document.getElementById("hero-names").textContent = config.couple.names;

    // Turns **name** markers into the decorative gold-script style (couple's
    // names etc.), and __text__ markers into plain bold emphasis (no font/
    // color change) for things like "followed by dinner" that just need
    // weight, not to read as a name.
    function formatCardText(raw) {
        return raw
            .replace(/\*\*(.+?)\*\*/g, '<span class="highlight-name">$1</span>')
            .replace(/__(.+?)__/g, '<span class="text-bold">$1</span>');
    }

    // Four link editions, matching the physical card set, reachable via a
    // clean path (e.g. /ijtema/, set by that folder's own index.html through
    // window.__inviteOverride) or the older ?invite= query param:
    //   ijtema -> Ijtema invitation card only
    //   barat  -> blessing + Barat programme card
    //   walima -> Walima invitation + programme cards
    //   full   -> everything, in chronological order
    // No recognized type at all (bare domain, or a stripped/garbled query
    // string) intentionally does NOT fall back to "full" - that would let
    // anyone holding a single-event link see every event's details just by
    // editing the URL. Instead it shows a neutral landing with no event
    // content, and only an explicit "full" link (shared deliberately with
    // close family) unlocks the combined view.
    const urlParams = new URLSearchParams(window.location.search);
    const rawInvite = window.__inviteOverride || urlParams.get('invite');
    const validTypes = ['ijtema', 'barat', 'walima', 'full'];
    const isGenericLanding = !validTypes.includes(rawInvite);

    if (isGenericLanding) {
        document.getElementById("blessing-section").remove();
        document.getElementById("countdown-section").remove();
        document.getElementById("schedule-section").remove();
        document.querySelector(".location").remove();
        document.getElementById("closing-section").remove();
        document.getElementById("hero-label").remove();
        document.querySelector(".scroll-indicator").remove();
        document.getElementById("generic-message").hidden = false;
    } else {
        const inviteType = rawInvite;

        let allowedEvents = ['ijtema', 'barat', 'walima']; // default to all (full)
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

        // Hero label/date: Ijtema and Walima single-event editions are named
        // after their own event (no generic "Wedding Day"), each showing its
        // own date. Barat (single-event) keeps "Wedding Day" + the date. The
        // full edition (all three cards) is just "Wedding" with no date at
        // all - with three different dates already shown further down on
        // each card, a single date up top read as contradictory.
        if (inviteType === 'ijtema') {
            document.getElementById("hero-label").textContent = "Ijtema";
            document.getElementById("hero-date").textContent = config.events.ijtema.date;
        } else if (inviteType === 'walima') {
            document.getElementById("hero-label").textContent = "Walima";
            document.getElementById("hero-date").textContent = config.events.walima.date;
        } else if (inviteType === 'barat') {
            document.getElementById("hero-date").textContent = config.events.barat.date;
        } else {
            document.getElementById("hero-label").textContent = "Wedding";
            document.getElementById("hero-date").remove();
        }

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
    }

    // =====================================
    // 2. Gatefold & Music
    // =====================================
    const envScreen = document.getElementById("envelope-screen");

    const bgMusic = document.getElementById("bg-music");
    const musicToggle = document.getElementById("music-toggle");
    const iconPlay = document.getElementById("icon-play");
    const iconPause = document.getElementById("icon-pause");

    let isPlaying = false;

    // Shared by openEnvelope() and the touchstart "unlock" below - calling
    // play() on an already-playing/already-attempted element is harmless,
    // so both can safely call this without coordinating.
    function tryPlayMusic() {
        bgMusic.play().then(() => {
            isPlaying = true;
            iconPlay.style.display = 'none';
            iconPause.style.display = 'block';
        }).catch(() => {
            isPlaying = false;
            iconPlay.style.display = 'block';
            iconPause.style.display = 'none';
        });
    }

    function openEnvelope() {
        if (envScreen.classList.contains("hidden") || envScreen.classList.contains("is-open")) return;

        // Swing the doors open
        envScreen.classList.add("is-open");

        // Start playback synchronously, in the same tick as the user's
        // gesture - browsers only honor audio-with-sound autoplay as a
        // direct response to input. Call it from inside a setTimeout (as
        // this used to) and the "direct response" window has closed by the
        // time it fires, so play() silently rejects and music never starts.
        tryPlayMusic();

        // Let the card fade/rise in as the doors swing apart
        setTimeout(() => {
            observeElements();
        }, 500);

        // Fully remove the overlay once the doors have finished swinging
        setTimeout(() => {
            envScreen.classList.add("hidden");
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

    // iOS Safari doesn't count scroll/swipe as a valid gesture for starting
    // audio-with-sound - only a discrete tap does. But the very first finger
    // contact (touchstart) IS a discrete tap-like event, before the browser
    // has decided the gesture is actually a scroll - so firing here, ahead
    // of the touchmove that actually opens the doors, gets the music
    // started even when someone opens by swiping rather than tapping.
    envScreen.addEventListener("touchstart", tryPlayMusic, { once: true });

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
    // 4. Countdown Timer (no countdown-section on the generic landing)
    // =====================================
    if (!isGenericLanding) {
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
    }
});
