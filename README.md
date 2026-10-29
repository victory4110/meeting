# Meeting Registration QR

One permanent QR code for meeting registration. Print it once. When the next
meeting comes, you change **one line** and the same QR keeps working.

```
   QR code  ──►  https://victory4110.github.io/meeting/  ──►  https://flames-of-fire.vercel.app
                          (config.js holds the link)
```

Live page: **https://flames-of-fire.vercel.app**

---

## For every new meeting (30 seconds)

1. Open `config.js` in this repo and click the pencil (edit) icon.
2. Replace `formUrl` with the new Google Form link.
3. Replace the pamphlet picture file (`program-schedule.png`, `program-cover.jpg`) or set `pamphletUrl` in `config.js`.
4. Update `title`, `dates`, or `venue` if needed. Commit.

That is it. **The printed QR code keeps working.**

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
| `config.js` | **The main file you edit.** Holds the Google Form link, pamphlet files, and event info. |
| `index.html` | The mobile portal page opened by the QR code. Presents options to register or view the program. |
| `program-schedule.png` | Inside spread with the Day 1–3 schedule and welcome address. |
| `program-cover.jpg` | Outer spread with the ministers, theme flyer, and fellowship hymn. |
| `out/` | The QR images and the printable poster. |
| `make-qr.mjs` | Rebuilds the QR images. `npm run qr` |
| `verify-qr.mjs` | Decodes the QR images and proves they point where they should. `npm run verify` |
| `test.mjs` | Full end-to-end check of the page and the QR. `npm test` |
| `serve.mjs` | Preview the page locally. `npm run serve` |

## How the page behaves

When someone scans the QR code on the flyer or poster, they land on the **NYC'26 FLAMES OF FIRE Meeting Portal** and are presented with two options:
1. **Register for Meeting**: Tapping opens the online Google Form.
2. **View Meeting Program**: Tapping opens an interactive full-screen viewer with tabs to read both the **Order of Programme** (Day 1–3 schedule) and the **Cover, Ministers & Hymn**. Visitors can also open or download the full-resolution images.

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
