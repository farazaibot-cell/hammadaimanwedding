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
        closing: "With best compliments from all relatives and friends"
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
            mapLink: "https://share.google/yLj2hS1xujwpTZUh4",
            cards: [
                {
                    type: "invitation",
                    body: "Mrs. Farah Naz\ncordially invites you to join us for\n\n**Ijtema**\nInsha Allah\non 20th December 2026\nTime: 7:30 PM (after Namaz-e-Maghrib)\n\n__followed by dinner__\n\nat Community Hall, Palm Spring\nPS Group, Kolkata"
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
            mapLink: "https://share.google/eqG40KCgWDRZpAHOS",
            cards: [
                {
                    type: "programme",
                    label: "Programme",
                    body: "**Barat**\nInsha Allah\n\nBarat\nfrom Palm Spring\n\nDate: 23rd December 2026\nVenue: Myrah Banquet, Prasad Square\nTime: 7:30 PM\n\n__followed by dinner__"
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
            mapLink: "https://share.google/MrHb02o1rq696AcRD",
            cards: [
                {
                    type: "invitation",
                    body: "In the name of Allah\nThe Most Beneficent, The Most Merciful.\n\nBegum (Late) Haji Shahnawaz Akhtar\nMG 6/32 KDA Colony Jajmau Kanpur\nrequests the pleasure of your company on the\nauspicious occasion of Walima of her son\n\n**Hammad Nawaz**\n(S/O. Mrs. & Haji (Late) Shahnawaz Akhtar)\n\nwith\n\n**Aiman Fatima**\n(D/O Mrs. Shahin Fatima & Late Arif Ahmad)"
                },
                {
                    // showCompliments renders config.copy.closing as a bottom-right
                    // block on this card (see js/main.js), matching where that
                    // block sits on the physical programme card.
                    type: "programme",
                    label: "Programme",
                    body: "**Walima**\nInsha Allah\n\nDate: 24th December 2026\nVenue: Celebration Banquet, Aurora Waterfront Ncsm Guest House, GN Block, Sector V, Bidhannagar, Kolkata, West Bengal 700091\nTime: 8:00 PM\n\n__followed by dinner__",
                    showCompliments: true
                }
            ]
        }
    }
};
