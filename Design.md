# Screenwriter Pro Architecture & Path Index

## Application Structure
- `src/App.tsx`: Central application state, keyboard shortcuts, disk persistence, and navigation controller.
- `src/components/Header.tsx`: Top bar containing screenplay title, focus mode, and utility actions.
- `src/components/TitlePageModal.tsx`: Script creation modal and metadata editor with empty defaults and discreet placeholder hints.
- `src/components/ScreenplayEditor.tsx`: Main pagination and script canvas supporting industry-standard screenplay formatting.
- `src/components/SluglineAutocomplete.tsx`: Commercial-grade floating autocomplete dropdown for Scene Headings (prefixes, locations, times of day).
- `src/lib/sluglinePredictor.ts`: Slugline parser, predictive text engine, location history extractor, and Smart Compose ghost text calculator.
- `src/components/NavigatorSidePanel.tsx`: Scenes, shots, arcs, story bibles, and statistics drawer.
- `src/components/TableReadModal.tsx`: Multi-voice playback and script rehearsal audio engine.
- `src/components/SettingsModal.tsx`: Preferences and environment configurations.
- `src/components/production/`: Production schedule, call sheets, and logistics modules.
