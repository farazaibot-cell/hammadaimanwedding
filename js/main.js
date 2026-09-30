document.addEventListener("DOMContentLoaded", () => {
    // =====================================
    // 1. Populate Content from Config
    // =====================================
    document.title = `${config.couple.names} - Wedding Invitation`;
    
    document.getElementById("hero-names").textContent = config.couple.names;
    
    document.getElementById("blessing-text").textContent = config.copy.opening;
    // **name** markers become highlighted spans (e.g. the couple's names in the invitation)
    document.getElementById("invitation-text").innerHTML = config.copy.invitationText
        .replace(/\*\*(.+?)\*\*/g, '<span class="highlight-name">$1</span>');
    document.getElementById("closing-content").textContent = config.copy.closing;

    // Determine which events to show based on URL parameter
    // Examples: ?invite=walima, ?invite=barat, ?invite=barat-walima
    const urlParams = new URLSearchParams(window.location.search);
    const inviteType = urlParams.get('invite') || 'full'; 

    let allowedEvents = ['ijtema', 'barat', 'walima']; // default to all
    if (inviteType === 'walima') {
        allowedEvents = ['walima'];
    } else if (inviteType === 'barat') {
        allowedEvents = ['barat'];
    } else if (inviteType === 'barat-walima') {
        allowedEvents = ['barat', 'walima'];
    }

    // Sort to maintain chronological order
    const orderedKeys = ['ijtema', 'barat', 'walima'];
    allowedEvents.sort((a, b) => orderedKeys.indexOf(a) - orderedKeys.indexOf(b));

    // Set Hero Date & Countdown Target to their FIRST event
    const firstEvent = config.events[allowedEvents[0]];
    document.getElementById("hero-date").textContent = firstEvent.date;
    window.countdownTargetDate = new Date(firstEvent.targetDate).getTime();

    // Populate Schedule
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

    // Populate Venues
    const venuesContainer = document.getElementById("venues-container");
    allowedEvents.forEach(eventId => {
        const venue = config.events[eventId];
        const card = document.createElement("div");
        card.className = "venue-card";
        card.innerHTML = `
            <h3>${venue.venueTitle}</h3>
            <h4>${venue.venueName}</h4>
            <p>${venue.venueAddress}</p>
            <a href="${venue.mapLink}" target="_blank" rel="noopener noreferrer" class="btn-map">Open in Maps</a>
        `;
        venuesContainer.appendChild(card);
    });

    // =====================================
    // 2. Music
    // =====================================
    const bgMusic = document.getElementById("bg-music");
    const musicToggle = document.getElementById("music-toggle");
    const iconPlay = document.getElementById("icon-play");
    const iconPause = document.getElementById("icon-pause");

    let isPlaying = false;

    // Reveal the cards straight away, like the reference site - no envelope to open
    observeElements();

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
