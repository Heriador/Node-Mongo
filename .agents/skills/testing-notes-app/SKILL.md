---
name: testing-notes-app
description: End-to-end testing for the Node-Mongo Notes app. Use when verifying CRUD operations, authentication, flash messages, or middleware changes.
---

# Testing the Notes App

## Prerequisites

- MongoDB running locally (or a remote URI)
- Node.js installed
- A `.env` file with `MONGODB_URI` and `PORT`

## Local MongoDB Setup

If MongoDB is not installed:
```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.org/apt/debian bookworm/mongodb-org/7.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update -qq && sudo apt-get install -y -qq mongodb-org
```

Start MongoDB:
```bash
sudo mkdir -p /data/db && sudo chown mongodb:mongodb /data/db
sudo mongod --dbpath /data/db --fork --logpath /var/log/mongod.log
```

## App Setup

```bash
npm install
printf 'MONGODB_URI=mongodb://localhost:27017/notesapp\nPORT=4000\n' > .env
node src/index.js &
```

Verify: `curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/` should return `200`.

## Key Testing Flows

### 1. Full CRUD Flow (most important)
1. Register at `/signup` (name, email, password, confirm_password)
2. Login at `/signin` (email, password) → redirects to `/notes`
3. Create note at `/notes/add` (title, description) → green flash on `/notes`
4. Edit note via pencil icon → pre-filled form, save → green flash
5. Delete note via red Delete button → green flash, no cards
6. Logout via Notes dropdown → green flash on `/signin`

### 2. Auth Middleware
- Access `/notes` while logged out → red flash "Not Authenticated, Log in firts" on `/signin`
- This also applies to `/notes/add`, `/notes/edit/:id`

### 3. Error Paths
- Duplicate email signup → red flash "The email is already on use." on `/signup`
- Short password (< 4 chars) → inline errors on signup form (no redirect)
- Password mismatch → inline errors on signup form

## Flash Message Verification

- Success messages: green `alert-success` banner with `succes_msg` (note: typo is intentional in the codebase)
- Error messages: red `alert-danger` banner with `error_msg`
- Messages appear at top of page via `partials/messages.hbs`

## Notes

- The app uses ESM modules (`"type": "module"` in package.json)
- Mongoose deprecation warnings about `strictQuery` and `punycode` are expected and harmless
- No lint/test/build scripts are configured in the repo
- The navbar links use `/Notes/add` (capital N) in the template but routes are `/notes/add` (lowercase) — Express handles this case-insensitively

## Devin Secrets Needed

No secrets required for local testing. For remote MongoDB, a `MONGODB_URI` secret would be needed.
