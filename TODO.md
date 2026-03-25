# Scroll Reveal Animation System

## Plan Progress

### 1. Create ScrollReveal component [x]
   - Reusable wrapper with opacity/scale/blur animation
   - Supports stagger for multiple children

### 2. Update Gallery.js [ ]
   - Enhance existing heading animations (add scale/blur)
   - Wrap gallery images container with ScrollReveal

### 3. Update Venue.js [ ]
   - Add scale 1.05->1 and blur 8px->0px to all motion elements

### 4. Update BalAagrah.js [ ]
   - Enhance variants with scale/blur
   - Wrap child images with ScrollReveal

### 5. Check additional components [ ]
   - Hero.js, CelebrationTeam.js, EventsTimeline.js, Presak.js

### 6. Test animations [ ]
   - npm start in client/
   - browser_action to verify scroll reveals
   - Check mobile perf

### 7. Performance optimization [ ]
   - Ensure smooth 60fps
   - No layout thrashing

**Next Step:** Create ScrollReveal.js
