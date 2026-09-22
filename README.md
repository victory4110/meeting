# Meeting Registration QR

One permanent QR code for meeting registration. Print it once. When the next
meeting comes, you change **one line** and the same QR keeps working.

```
   QR code  ──►  https://victory4110.github.io/meeting/  ──►  the current Google Form
                          (config.js holds the link)
```

Live page: **https://victory4110.github.io/meeting/**

---

## For every new meeting (30 seconds)

1. Open `config.js` in this repo and click the pencil (edit) icon.
2. Replace the link inside `formUrl` with the new Google Form link. Commit.

   ```js
   formUrl: "https://forms.gle/xxxxxxxxxxx",
   ```

3. Optionally update `title` so the page names the right meeting.

That is it. **The printed QR still works.**

## Where the QR is

| File | Use |
| --- | --- |
| `out/registration-qr.png` | 2048px image. Slides, WhatsApp, email, posters. |
| `out/registration-qr.svg` | Vector. Scales to any size without blurring. |
| `out/registration-qr-poster.html` | A4 "Scan to register" poster. Open and print. |

Download these from GitHub on any device, including your phone.

## The files

| File | Purpose |
| --- | --- |
| `config.js` | **The only file you edit.** Holds the Google Form link. |
| `index.html` | The page the QR opens. Forwards to the form. Do not edit. |
| `out/` | The QR images and the printable poster. |
| `make-qr.mjs` | Rebuilds the QR images. `npm run qr` |
| `verify-qr.mjs` | Decodes the QR images and proves they point where they should. `npm run verify` |
| `test.mjs` | Full end-to-end check of the page and the QR. `npm test` |
| `serve.mjs` | Preview the page locally. `npm run serve` |

## How the page behaves

Someone scans the QR. They see the FLAMES OF FIRE card with a spinner for about
a second, then land on the Google Form automatically. If the redirect is blocked,
there is a large button they can tap instead. Either way they reach the form.

## Rebuilding the QR

```bash
npm install
npm run qr -- https://victory4110.github.io/meeting/ --name=registration-qr
npm test
```

## Why this design

A QR code cannot be edited after it is printed. It is just a picture of a web
address. So the QR points at a page you control, and that page holds the link
that changes. Put the moving part behind the fixed part.
