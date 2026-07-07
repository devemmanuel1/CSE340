const express = require('express');
const path = require('path');
const router = express.Router();

// Favicon route to avoid 404s from /favicon.ico
router.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'images', 'site', 'favicon-32x32.png'))
})

// Static Routes
// Set up "public" folder / subfolders for static files
router.use(express.static(path.join(__dirname, '..', 'public')));
router.use("/css", express.static(path.join(__dirname, '..', 'public', 'css')));
router.use("/js", express.static(path.join(__dirname, '..', 'public', 'js')));
router.use("/images", express.static(path.join(__dirname, '..', 'public', 'images')));

module.exports = router;