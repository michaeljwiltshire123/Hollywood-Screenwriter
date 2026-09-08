# Screenwriter Pro Architecture & Path Index

## Application Structure
- `src/App.tsx`: Central application state, keyboard shortcuts, disk persistence, and navigation controller.
- `src/components/Header.tsx`: Top bar containing screenplay title, focus mode, and utility actions.
- `src/components/TitlePageModal.tsx`: Script creation modal and metadata editor with empty defaults and discreet placeholder hints.
- `src/components/ScreenplayEditor.tsx`: Main pagination and script canvas supporting industry-standard screenplay formatting, predictive element flow, Alt+letter shortcuts (Alt+S/A/C/D/T), and bi-directional Tab format cycling (Tab right, Alt+Tab / Shift+Tab left).
- `src/components/FormattingToolbar.tsx`: Format selector bar with clean element counter, format buttons, and format helper button.
- `src/components/FormatShortcutsHelp.tsx`: Hoverable and focusable keyboard guide (`[i]`) detailing Tab cycling and browser-safe Shift+Alt shortcuts.
- `src/lib/screenplayShortcuts.ts`: Centralised shortcut definitions and browser-safe keyboard event resolver (Shift+Alt+Letter, Alt+1..8).
- `src/components/SluglineAutocomplete.tsx`: Minimalist light-mode floating autocomplete dropdown for Scene Headings (prefixes, locations, times of day).
- `src/components/CharacterAutocomplete.tsx`: Minimalist light-mode floating autocomplete dropdown for character name suggestions.
- `src/lib/sluglinePredictor.ts`: Slugline parser, predictive text engine, location history extractor, and Smart Compose ghost text calculator.
- `src/components/NavigatorSidePanel.tsx`: Scenes, shots, arcs, story bibles, and statistics drawer. Includes sticky non-overlapping fullscreen controls positioned cleanly with dual-header clearance (top-28) below both the main header and formatting toolbar.
- `src/components/TableReadModal.tsx`: Multi-voice playback and script rehearsal audio engine offset safely with dual-header clearance (top-28).
- `src/components/SettingsModal.tsx`: Preferences and environment configurations.
- `src/lib/gameCooldownManager.ts`: 10-minute focus sprint timer and session storage persistence to regulate break games.
- `src/components/GameLockoutModal.tsx`: Focus sprint notification modal displaying live cooldown countdown when games are temporarily blocked.
- `src/components/production/`: Production schedule, call sheets, and logistics modules with bounded dual-header clearance (top-28).
