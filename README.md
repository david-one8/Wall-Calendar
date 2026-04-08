# Interactive Wall Calendar

A polished, responsive wall-calendar web app built with React, TypeScript, Vite, and Tailwind CSS. It combines a seasonal calendar layout with date-range selection, per-day notes, light and dark themes, animated month transitions, and browser-based persistence.

![React](https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-0F172A?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![date-fns](https://img.shields.io/badge/date--fns-3-770C56?style=for-the-badge&logo=datefns&logoColor=white)
![License](https://img.shields.io/badge/License-Private-5B4636?style=for-the-badge)

## Overview

This application is designed to feel like a modern digital wall calendar rather than a plain date grid. It includes:

- A large monthly calendar view
- Seasonal hero artwork for every month
- Date-range selection with live preview
- A side notes panel linked to the selected date
- Theme switching between light and dark mode
- Local persistence using `localStorage`
- Responsive layouts for desktop and mobile

The app is entirely frontend-based and does not require a backend or database.

## Features

### Calendar experience

- Monthly calendar grid with Sunday-to-Saturday layout
- Previous month and next month navigation
- Quick `Today` button to jump back to the current month
- Current day highlighting
- Weekend styling
- Holiday highlighting for built-in US holiday dates
- Tiny note indicator dot on days that already contain notes
- Support for out-of-month leading and trailing days in the grid

### Date-range selection

- Click one date to start a range
- Hover over dates to preview the range before completing it
- Click a second date to complete the range
- Reverse selections are handled automatically
- Distinct styling for:
  - Range start
  - Range end
  - In-between days
- A range summary bar showing:
  - Selected start and end dates
  - Total number of days in the range
  - Clear action to reset the selection

### Notes system

- Notes are attached to a specific selected date
- A dedicated notes panel sits beside the calendar on large screens
- Empty-state guidance helps users understand where to write a note
- A visible composer section with label and textarea
- Multiple soft note color options
- Enter key support for quick save
- Delete action for removing notes
- Notes display the selected date inside each note card

### Visual design

- Modern paper-card calendar layout
- Seasonal month hero images for all 12 months
- Month-specific mood text overlays
- Light and dark theme support
- Theme-aware surface, border, and shadow styling
- Decorative background glows and subtle texture
- Rounded cards and elevated panels for a premium UI feel

### Motion and interaction

- Animated month flip transition
- Animated hero image cross-fade between months
- Hover lift effect for day cells
- Fade/slide animation for range indicator
- Entry animation for new notes

### Persistence

- Notes are stored in browser `localStorage` under `calendar-notes`
- Theme preference is stored in browser `localStorage` under `theme`
- Notes remain available after refresh as long as the same browser storage is retained

### Routing

- `/` renders the main wall calendar experience
- A fallback `404` page handles unmatched routes

## Built-In Holiday Support

The app currently highlights these built-in dates:

- New Year's Day
- Valentine's Day
- Independence Day
- Halloween
- Veterans Day
- Christmas Day
- New Year's Eve

These are defined as fixed month-day values in the utility layer.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- date-fns
- Lucide React
- Radix Slot
- class-variance-authority
- clsx
- tailwind-merge

## Project Structure

```text
wall-calendar/
├─ public/
│  └─ favicon.svg
├─ src/
│  ├─ assets/
│  │  ├─ calendar-january.jpg
│  │  ├─ calendar-february.jpg
│  │  ├─ calendar-march.jpg
│  │  ├─ calendar-april.jpg
│  │  ├─ calendar-may.jpg
│  │  ├─ calendar-june.jpg
│  │  ├─ calendar-july.jpg
│  │  ├─ calendar-august.jpg
│  │  ├─ calendar-september.jpg
│  │  ├─ calendar-october.jpg
│  │  ├─ calendar-november.jpg
│  │  └─ calendar-december.jpg
│  ├─ components/
│  │  ├─ ui/
│  │  │  └─ button.tsx
│  │  ├─ CalendarGrid.tsx
│  │  ├─ CalendarHeader.tsx
│  │  ├─ CalendarHeroImage.tsx
│  │  ├─ CalendarNotes.tsx
│  │  ├─ CalendarSpiral.tsx
│  │  ├─ RangeIndicator.tsx
│  │  ├─ ThemeToggle.tsx
│  │  └─ WallCalendar.tsx
│  ├─ lib/
│  │  ├─ calendar-utils.ts
│  │  └─ utils.ts
│  ├─ pages/
│  │  ├─ Index.tsx
│  │  └─ NotFound.tsx
│  ├─ App.tsx
│  ├─ index.css
│  ├─ main.tsx
│  └─ vite-env.d.ts
├─ components.json
├─ eslint.config.js
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.ts
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts
```

## Component Guide

### Core application

- `src/components/WallCalendar.tsx`
  - Orchestrates the full calendar experience
  - Manages current month, selected date, range state, note state, hover state, and animation state

### Calendar UI

- `src/components/CalendarHeader.tsx`
  - Displays month/year
  - Includes previous, next, today, and theme-toggle controls

- `src/components/CalendarHeroImage.tsx`
  - Displays month-specific hero imagery
  - Cross-fades between the previous and current month image
  - Shows month-specific mood text

- `src/components/CalendarGrid.tsx`
  - Renders weekday labels and day cells
  - Handles range styles, today styles, holiday styles, and note dots

- `src/components/RangeIndicator.tsx`
  - Displays the current selected range and total day count
  - Provides a clear/reset action

- `src/components/CalendarSpiral.tsx`
  - Adds decorative wall-calendar spiral rings at the top

### Notes UI

- `src/components/CalendarNotes.tsx`
  - Displays the selected date
  - Lists notes for that date
  - Supports creating and deleting notes
  - Includes note color selection and empty-state guidance

### Theme

- `src/components/ThemeToggle.tsx`
  - Toggles between light and dark themes
  - Saves the current theme in `localStorage`

### Utilities

- `src/lib/calendar-utils.ts`
  - Generates the day grid for each month
  - Detects today, weekends, holidays, and date ranges
  - Loads and saves notes
  - Exports date helpers and note color presets

- `src/lib/utils.ts`
  - Provides utility helpers used across UI classes

## User Flow

1. Open the app.
2. Browse to a month using the header controls.
3. Click a day to select it and start a date range.
4. Hover other days to preview the range.
5. Click another day to finish the range.
6. Use the notes panel to write a note for the currently selected date.
7. Choose a note color and press `Enter` or use the add button.
8. Switch themes anytime with the theme toggle.

## Styling and Design System

The application uses a custom calendar-themed design language rather than a default dashboard look. Highlights include:

- Custom HSL theme tokens
- Dedicated calendar color variables
- Theme-specific shadows and surface borders
- Display typography for headings and sans-serif typography for UI text
- Responsive spacing and rounded panel geometry
- Shared button patterns through the UI button component

Most of the visual system lives in `src/index.css` and `tailwind.config.ts`.

## Local Persistence Details

This project stores data only in the browser:

- `calendar-notes`
  - Array of saved notes
  - Each note contains:
    - `id`
    - `date`
    - `text`
    - `color`

- `theme`
  - Either `light` or `dark`

No API calls or server storage are used.

## Getting Started

### Prerequisites

- Node.js 18 or later recommended
- npm

### Installation

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Lint the project

```bash
npm run lint
```

## Available Scripts

- `npm run dev` - Start the Vite development server
- `npm run build` - Create a production build
- `npm run build:dev` - Create a development-mode build
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint

## Responsive Behavior

- On large screens, the calendar and notes panel are shown side by side
- On smaller screens, the layout stacks vertically
- Typography, spacing, and labels adapt across breakpoints
- Decorative background elements are reduced on small screens for clarity

## Accessibility and UX Notes

- Buttons use clear iconography and labels
- Theme toggle uses an accessible `aria-label`
- Notes input uses descriptive placeholders and labels
- The `404` page provides a path back to the home screen

## Customization Ideas

This project is a strong base for extending into a more full-featured planner. Possible additions include:

- Recurring notes or reminders
- More holiday sets by region
- Drag-based range selection
- Export to PDF or image
- Event categories and filters
- Backend sync or user authentication

## Summary

Interactive Wall Calendar is a visually rich monthly planner focused on clarity, atmosphere, and ease of use. It already includes month navigation, date-range selection, per-day notes, local persistence, seasonal imagery, responsive design, and light/dark theming in a clean single-page React application.
