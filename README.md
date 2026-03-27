# Chacha Wedding

A cinematic wedding invitation platform built with React, Node.js, Express, MongoDB, Socket.IO, and Cloudinary.

This project combines two experiences in one app:

- A personalized guest-facing invitation at `/invite/:guestId`
- An authenticated admin dashboard for managing guests, content, gallery assets, and invitation delivery

The current codebase includes a substantial visual refresh across the guest experience and admin UI, plus upgraded invitation export flows with personalized PDF output and QR-enabled invite links.

## Highlights

- Personalized invitation links per guest using `guestId`
- Cinematic entry sequence and premium invitation presentation
- Admin dashboard for guest management, RSVP monitoring, content updates, and image uploads
- Live updates through Socket.IO for guest and settings changes
- RSVP capture and status tracking
- Public content/settings API used to drive the invitation dynamically
- Cloudinary-backed image uploads for gallery/content assets
- Printable personalized invitation PDF export
- PDF export includes:
  - guest-specific greeting
  - personal invitation link
  - QR code for that link
  - guest-name-based print title for easier PDF saving

## Current UI State

The current frontend is no longer a default CRA-style app. It has been heavily customized around a dark luxury wedding aesthetic.

Recent work reflected in the repository includes:

- stronger global design tokens and reusable visual primitives in `client/src/index.css`
- richer hero/invitation composition and refined countdown treatment
- upgraded section styling for events, venue, gallery, RSVP, promo, and popup surfaces
- improved `Preshak` presentation with a more ceremonial portrait-card layout
- refreshed admin login and dashboard visuals to better match the public site
- redesigned invitation PDF export in the guest admin list

## Tech Stack

### Frontend

- React 19
- React Router 7
- Framer Motion
- Tailwind CSS
- Axios
- Socket.IO client
- Lucide icons

### Backend

- Node.js
- Express 5
- MongoDB with Mongoose
- JWT authentication
- Socket.IO
- Cloudinary + Multer for uploads
- Helmet
- Express Rate Limit
- Express Validator

## Repository Structure

```text
chacha_wedding/
├─ client/                       # React frontend
│  ├─ public/
│  └─ src/
│     ├─ components/
│     │  ├─ admin/              # Admin dashboard screens
│     │  └─ ...                 # Invitation sections and animation components
│     ├─ context/               # Settings/socket context providers
│     ├─ App.js
│     └─ index.css              # Core design system and utility classes
├─ server/                       # Express backend
│  ├─ config/
│  ├─ controllers/
│  ├─ middleware/
│  ├─ models/
│  ├─ routes/
│  └─ server.js
└─ README.md
```

## Main Product Flows

### 1. Guest Invitation Flow

Guests open a unique URL such as:

```text
/invite/<guestId>
```

That page can render:

- personalized greeting
- animated cinematic entry
- hero and countdown
- event timeline
- venue information
- gallery
- celebration team
- `Bal Aagrah`
- `Preshak`
- RSVP section
- promotional/CTA sections

Most of this content is driven from settings loaded from `/api/content`.

### 2. Admin Flow

Admins can:

- sign in via `/admin/login`
- access `/admin/dashboard`
- add, edit, search, and delete guests
- copy invite links
- share invites over WhatsApp
- export personalized invite PDFs
- view RSVP and location grouping
- update wedding content/settings
- manage uploaded images

## API Overview

### Public routes

- `GET /` - health check
- `GET /api/content` - fetch public invitation settings/content
- `GET /api/guests/:guestId` - fetch guest details for invite page
- `POST /api/rsvp/:guestId` - submit RSVP
- `POST /api/guests/notify-open` - track invite open event

### Protected routes

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/guests`
- `POST /api/guests`
- `PUT /api/guests/:id`
- `DELETE /api/guests/:id`
- `GET /api/guests/locations`
- `POST /api/content`
- `POST /api/settings`
- `POST /api/upload`

Protected routes require `x-auth-token`.

## Data Model Snapshot

### Guest

Guest records currently include:

- `name`
- `family`
- `honorific`
- `guestId`
- `specialMessage`
- `location`
- `rsvpStatus`
- `rsvpDate`
- `guestCount`
- timestamps

### Setting

Settings are stored as key-value documents and assembled into a single object on read. This allows the frontend invitation structure to be configured dynamically.

## Environment Variables

Create `server/.env` with values like:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_ORIGIN=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Optional client env:

```env
REACT_APP_SERVER_URL=http://localhost:5001
```

Notes:

- The frontend already uses CRA proxying to `http://localhost:5001`
- `REACT_APP_SERVER_URL` is useful when frontend and backend are deployed separately

## Local Development

### Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### Start the backend

```bash
cd server
npm run dev
```

or

```bash
cd server
npm start
```

### Start the frontend

```bash
cd client
npm start
```

Frontend default:

- `http://localhost:3000`

Backend default:

- `http://localhost:5001`

## Production Build

```bash
cd client
npm run build
```

## Invitation PDF Export

The admin guest list contains a PDF export action for each guest.

Current PDF behavior:

- renders a styled invitation layout in a print window
- includes guest-specific naming
- includes the guest’s personal invite URL
- includes a QR code for the same URL
- uses a title like `Invitation-Guest-Name` to improve browser PDF save naming

Implementation currently lives in:

- `client/src/components/admin/GuestList.js`

## Important Frontend Files

- `client/src/index.css`
  - design tokens, premium background treatment, reusable panels, buttons, section shells
- `client/src/components/PersonalizedGreeting.js`
  - guest-facing invitation shell
- `client/src/components/Hero.js`
  - main landing hero and countdown
- `client/src/components/BalAagrah.js`
  - child invitation section
- `client/src/components/Presak.js`
  - sender/host section
- `client/src/components/admin/Dashboard.js`
  - admin overview shell
- `client/src/components/admin/GuestList.js`
  - guest CRUD, sharing, PDF export

## Important Backend Files

- `server/server.js`
  - bootstraps Express, Socket.IO, security middleware, routes
- `server/controllers/guestController.js`
  - guest management and RSVP-related logic
- `server/controllers/settingController.js`
  - dynamic invitation content/settings persistence
- `server/controllers/uploadController.js`
  - Cloudinary-backed uploads
- `server/models/guest.js`
  - guest schema
- `server/models/setting.js`
  - settings key-value schema

## Security/Operational Notes

- Helmet is enabled
- API rate limiting is applied under `/api/`
- JWT auth is used for admin-only routes
- `.env` files and build artifacts are ignored by git

## Known Notes

- The repository currently contains a large set of UI changes already in the working tree
- There is no meaningful automated test suite configured yet
- A full production build was attempted during earlier work, but not completed as part of this README update turn

## Suggested Next Improvements

- add automated tests for guest CRUD and RSVP flows
- move print/PDF generation to a dedicated template utility or server-generated document pipeline
- add deployment instructions for frontend/backend hosting
- document seed/admin bootstrap behavior in more detail
- replace browser-print PDF generation with deterministic PDF rendering if brand consistency becomes critical
