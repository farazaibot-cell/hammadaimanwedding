const config = {
    couple: {
        names: "Hammad\n&\nAiman",
        fullName1: "Hammad Nawaz",
        fullName2: "Aiman Fatima"
    },
    copy: {
        // Shown only on the "barat" and "full" editions (see js/main.js), matching
        // the physical card set where this blessing accompanies the Barat card.
        blessing: "In the name of Allah\nThe Most Beneficent, The Most Merciful.\n\nO Allah, guide this marriage to the best of understandings, happiness, prosperity & success\n- Ameen.",
        closing: "With Best Compliments:\n\nDr. Rehan Jamil\nFaraz Arshad\nBilal Nawaz\nDaniyal Nawaz"
    },
    // Master list of all possible events. Each event carries its own invitation
    // card(s) (transcribed from the physical cards), shown only when that event
    // is included in the current link edition - see allowedEvents in js/main.js.
    events: {
        "ijtema": {
            id: "ijtema",
            title: "Ijtema",
            date: "20th December 2026",
            time: "7:30 PM", // Standardized time format
            targetDate: "2026-12-20T19:30:00+05:30",
            venueTitle: "Ijtema",
            venueName: "Community Hall, Palm Spring Apartments",
            venueAddress: "PS Group, Flat 9B, New Tangra Rd, Near Beijing Restaurant, Kolkata",
            mapLink: "#",
            cards: [
                {
                    type: "invitation",
                    body: "Mrs. Farah Naz\ncordially invites you to join us for\n\n**Ijtema**\n\nInsha Allah\n\non 20th December 2026\nafter Namaz-e-Asr / Maghrib\n\nfollowed by dinner\n\nat\nCommunity Hall, Palm Spring\nPS Group, Kolkata"
                }
            ]
        },
        "barat": {
            id: "barat",
            title: "Barat",
            date: "23rd December 2026",
            time: "7:30 PM",
            targetDate: "2026-12-23T19:30:00+05:30",
            venueTitle: "Barat",
            venueName: "Myrah Banquet",
            venueAddress: "Prasad Square, 164, AJC Bose Rd, Entally, Kolkata",
            mapLink: "https://maps.app.goo.gl/placeholder_wedding",
            cards: [
                {
                    type: "programme",
                    label: "Programme",
                    body: "**Barat**\nInsha Allah\n\nBarat\nfrom Palm Spring\n\nDate: 23rd December 2026\n\nVenue: Myrah Banquet\nPrasad Square\n\nTime: 7:30 PM\n\nfollowed by dinner"
                }
            ]
        },
        "walima": {
            id: "walima",
            title: "Walima",
            date: "24th December 2026",
            time: "8:00 PM", // Standardized time format
            targetDate: "2026-12-24T20:00:00+05:30",
            venueTitle: "Walima",
            venueName: "Celebration Banquet",
            venueAddress: "6th floor, Aurora Waterfront Ncsm Guest House, GN Block, Sector V, Bidhannagar, Kolkata, West Bengal 700091",
            mapLink: "https://maps.app.goo.gl/placeholder_reception",
            cards: [
                {
                    type: "invitation",
                    body: "In the name of Allah\nThe Most Beneficent, The Most Merciful.\n\nBegum (Late) Haji Shahnawaz Akhtar\nrequests the pleasure of your company on the auspicious occasion of Walima of her son\n\n**Hammad Nawaz**\n(S/O. Mrs. & Haji (Late) Shahnawaz Akhtar)\n\nwith\n\n**Aiman Fatima**\n(D/O Mrs. Shahin Fatima & Late Arif Ahmad)"
                },
                {
                    // showCompliments renders config.copy.closing as a bottom-right
                    // block on this card (see js/main.js), matching where that
                    // block sits on the physical programme card.
                    type: "programme",
                    label: "Programme",
                    body: "**Walima**\nInsha Allah\n\nDate: 24th December 2026\n\nVenue: Celebration Banquet\n\nfollowed by dinner",
                    showCompliments: true
                }
            ]
        }
    }
};
