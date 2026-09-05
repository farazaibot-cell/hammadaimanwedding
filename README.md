# Digital Wedding Invitation

A single-page, scroll-based digital wedding invitation built with clean HTML, CSS, and vanilla JS. It is mobile-first, lightweight, and easy to deploy.

## Quick Start (Local Preview)

To view the site locally on your machine, open your terminal, navigate to this folder, and run:
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your web browser.

---

## 1. How to Edit Content

All the text content (names, dates, schedule, venues, etc.) is managed in a single file to make editing easy.

1. Open `js/config.js` in any text editor.
2. Edit the values inside the `config` object. 
3. Note: The `countdownTarget` requires a specific ISO date format (e.g., `2026-12-22T19:30:00+05:30`) to calculate the countdown accurately.
4. Save the file and refresh your browser.

## 2. How to Swap Images & Music

The placeholders are located in the `assets/` folder. Replace them with your own files while keeping the same filenames, or update the references in `index.html` and `css/style.css`.

- **Background Music:** Replace `assets/music/bgm.mp3` with your chosen royalty-free track. Ensure it's in `.mp3` format for best browser compatibility.
- **Backgrounds/Graphics:** To add the swan graphic or floral arches, you can apply them as background images to `.hero` and `.arch-frame` in `css/style.css`, or insert `<img>` tags directly into `index.html`.
- **Favicons:** Replace `assets/images/favicon.png` and `apple-touch-icon.png` with your own icons.
- **Open Graph (WhatsApp Link Preview):** Replace `assets/images/og-image.jpg` with a beautiful landscape photo of the couple. This is the image that appears when you share the link on WhatsApp.

## 3. How to Wire Up the RSVP Backend (Google Sheets)

We are using Google Sheets via Apps Script because it's free, handles up to 500 guests easily, and requires no third-party accounts.

**Step 1: Set up the Google Sheet**
1. Go to Google Sheets and create a new blank spreadsheet. Name it "Wedding RSVPs".
2. In the first row, add these exact headers in columns A through F:
   `Timestamp`, `name`, `attending`, `guests`, `children`

**Step 2: Add the Apps Script**
1. In the menu, click **Extensions > Apps Script**.
2. Delete any code in the editor and paste the following:

```javascript
const sheetName = 'Sheet1';
const scriptProp = PropertiesService.getScriptProperties();

function initialSetup () {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', activeSpreadsheet.getId());
}

function doPost (e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    const sheet = doc.getSheetByName(sheetName);

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const nextRow = sheet.getLastRow() + 1;

    const newRow = headers.map(function(header) {
      if (header === 'Timestamp') {
        return new Date();
      } else {
        return e.parameter[header];
      }
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

3. Click the **Run** button (it will ask for permissions, grant them). Run `initialSetup`.

**Step 3: Deploy the Script**
1. Click the blue **Deploy** button > **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Under "Execute as", select **Me**.
4. Under "Who has access", select **Anyone**.
5. Click **Deploy**.
6. Copy the **Web app URL**.

**Step 4: Connect it to your website**
1. Open `js/main.js`.
2. Scroll to the bottom where the RSVP form submission logic is (`// Handle Form Submission`).
3. Replace the simulated `setTimeout` block with the actual fetch code using your copied URL:

```javascript
const formData = new FormData(form);
fetch('YOUR_COPIED_WEB_APP_URL_HERE', { 
    method: 'POST', 
    body: formData 
})
.then(response => response.json())
.then(data => {
    form.classList.add("hidden");
    document.getElementById("rsvp-success").classList.remove("hidden");
})
.catch(error => {
    document.getElementById("rsvp-error").classList.remove("hidden");
});
```

## 4. How to Deploy (Custom Domain Setup)

Since you want a custom domain and a free host, **GitHub Pages** or **Netlify** are the best options. Here is how to do it with Netlify, which makes custom domains very easy.

1. Create a free account at [Netlify](https://app.netlify.com/).
2. Drag and drop this entire `wedding-invitation` folder into the Netlify "Sites" dashboard. It will deploy instantly.
3. Once deployed, click on **Domain Management** in your Netlify dashboard.
4. Click **Add custom domain** and type the domain you bought (or plan to buy).
5. Netlify will provide you with DNS records (usually a CNAME or A records).
6. Log in to where you bought your domain (GoDaddy, Namecheap, etc.) and update the DNS records to point to Netlify as instructed.
7. Wait a few minutes (up to a few hours) for the DNS to propagate, and your site will be live on your custom domain with automatic free SSL/HTTPS!
