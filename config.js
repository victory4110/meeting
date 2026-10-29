// ============================================================
//  MEETING REGISTRATION & PROGRAM — EDIT THIS FILE ONLY
// ============================================================
//  Each new meeting:
//  1. Replace formUrl with the new Google Form link.
//  2. Place new flyer/pamphlet images in this folder and update
//     pamphletPages below.
//  3. Update title, theme, or dates as needed.
//
//  The printed QR code NEVER changes because it points to this page.
//
//  Last updated: 2026-10-29
// ============================================================

window.MEETING = {
  // --- Event Branding & Information ---
  organization: "House to House Prayer Ministries INC. Youth Fellowship",
  tag: "NYC'26",
  title: "FLAMES OF FIRE",
  subtitle: "Hebrews 1:7 — \"God Burn in Us and Through Us\"",
  dates: "Oct 30 – Nov 1",
  venue: "House to House Prayer Ministries, H/Q, Ogbomoso",
  note: "Welcome! Choose an option below to register or view the meeting program:",

  // --- 1. REGISTRATION FORM (Paste Google Form link here) ---
  formUrl: "https://forms.gle/x3utH64s1AqgWsK87",
  formButtonText: "Register for Meeting",
  formDescription: "Complete the online registration form",

  // --- 2. MEETING PROGRAM / PAMPHLET ---
  pamphletButtonText: "View Meeting Program",
  pamphletDescription: "Order of service, schedule & ministers",
  pamphletUrl: "program-cover.jpg", // primary default link (cover first)
  pamphletPages: [
    {
      title: "Cover, Ministers & Hymn",
      subtitle: "Ministers, Welcome Message & 'Give Us O Lord, Thine Unction'",
      file: "program-cover.jpg"
    },
    {
      title: "Order of Programme",
      subtitle: "Day 1 (Oct 30) — Day 3 (Nov 1) Schedule",
      file: "program-schedule.png"
    }
  ]
};
