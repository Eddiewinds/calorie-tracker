# CalTrack — Vanilla Calorie & Macro Tracker

A lightweight, feature-rich daily calorie and macronutrient tracking web application built with **100% vanilla HTML, CSS, and JavaScript**.

- **No frameworks or build tools** (no React, Vue, Vite, or Webpack)
- **No external dependencies** (no CDNs, no external icon packs, no Tailwind)
- **No CSS variables** (strict standard vanilla CSS styling)
- **No backend required** — all data persists locally in the browser via `localStorage`

---

## Features

- **Daily Calorie Balance Dashboard**:
  - Live equation: $\text{Target} - \text{Food} + \text{Burned (Exercise)} = \text{Net Intake}$
  - SVG circular progress ring indicating remaining calories or overage.
  - Streak tracking counter (🔥) for consecutive logging days.

- **Macronutrient Tracking**:
  - Protein, Carbohydrate, and Fat tracking against custom targets.
  - Visual color-coded progress bars and real-time calorie contribution calculations.
  - Built-in macro split presets: Balanced (40C/30P/30F), High Protein (30C/40P/30F), or Low Carb/Keto (10C/25P/65F).

- **Categorized Meals & Workouts**:
  - Log entries for **Breakfast**, **Lunch**, **Dinner**, **Snacks & Drinks**, and active **Exercise**.
  - Edit, delete, and portion adjustment controls for each item.

- **Common Foods Library**:
  - Searchable library of 25 staple whole foods with pre-verified calories and macros.
  - One-click addition directly into any meal category.

- **Mifflin-St Jeor BMR & TDEE Calculator**:
  - Built-in calculator that calculates Total Daily Energy Expenditure based on sex, age, weight, height, activity level, and weight goal (loss, maintenance, lean bulk).

- **7-Day Trend Chart**:
  - HTML5 Canvas bar chart tracking your net daily calories vs. target line across the week.

- **Water Hydration Tracker**:
  - Interactive 8-glass water counter (2,000ml / 2.5L daily target).

- **Data Management**:
  - Export all logs and settings to a JSON backup file.
  - Restore / import data from backup.
  - Pre-load realistic 7-day sample data for testing.

---

## Getting Started

No installation or web server is required.

1. Clone the repository:
   ```bash
   git clone https://github.com/Eddiewinds/calorie-tracker.git
   ```
2. Open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).

---

## File Structure

```
├── index.html       # Semantic HTML5 application structure
├── styles.css       # Responsive vanilla CSS styling (dark UI theme)
├── app.js           # State management, LocalStorage, math, and Canvas rendering
└── README.md        # Documentation
```
