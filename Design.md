# Screenwriter Pro Architecture & Path Index

## Application Structure
- `src/App.tsx`: Central application state, keyboard shortcuts, disk persistence, and navigation controller.
- `src/components/Header.tsx`: Top bar coordinating screenplay title, navigation drawer, focus mode, and responsive layout.
- `src/components/header/NavigatorToggle.tsx`: Prominent two-line toggle button for Navigator & Production Tools.
- `src/components/header/ScriptTitleEditor.tsx`: Screenplay title display and click-to-edit input with responsive constraints.
- `src/components/header/PomodoroWidget.tsx`: Pomodoro break game trigger, countdown timer, and settings menu.
- `src/components/header/ExportMenu.tsx`: Export dropdown providing pure PDF document generation, Word Docx, .screenplay project outputs, and direct script printing.
- `src/lib/pdf/exportScreenplayPdf.ts`: Pure vector text PDF screenplay compiler generating letter-format industry-standard documents with title page and running headers.
- `src/lib/pdf/pdfTitlePage.ts`: Title page formatting engine rendering centered title block, author credentials, contact, date, and draft colour.
- `src/lib/pdf/pdfElementRenderer.ts`: Screenplay element formatting rules, margin offsets, uppercase transforms, and orphan prevention rules.
- `src/lib/printScript.ts`: Direct script printing trigger compiling and printing isolated screenplay documents without app buttons.
- `src/lib/print/printScriptDocument.ts`: Standalone iframe printing pipeline ensuring crisp, reliable physical printer dispatch.
- `src/lib/print/generateScriptHtml.ts`: Standalone HTML generator compiling title page and screenplay body into pure screenplay format.
- `src/lib/print/printStyles.ts`: Print stylesheet bundler combining page layout and element typography styles.
- `src/lib/print/printPageStyles.ts`: Page size, 1-inch margins, Courier font, and title page centering layout.
- `src/lib/print/printElementStyles.ts`: Screenplay element indentation, margins, dialogue widths, and orphan prevention rules.
- `src/components/header/ImportProjectMenu.tsx`: Open file, import script, new blank script, and sample loader.
- `src/components/header/MainBarQuickActions.tsx`: Main bar quick buttons for Table Read, Revision History, and Title Page.
- `src/components/header/HeaderActionButtons.tsx`: Action controller organizing header actions and responsive toolgroups.
- `src/components/TitlePageModal.tsx`: Script creation modal and metadata editor with empty defaults and discreet placeholder hints.
- `src/components/title_page/StartupOptionsGrid.tsx`: Startup options grid with prominent action buttons and bordered metadata editor button.
- `src/components/title_page/StartupOptionCards.tsx`: 3-card launchpad for starting a new script, loading files, and opening samples.
- `src/components/title_page/TitlePageForm.tsx`: Dedicated form container for script title, author, date, and draft colour metadata.
- `src/components/title_page/TitlePageFormFields.tsx`: Inputs and text areas for title page attributes.
- `src/components/title_page/useTitlePageModalState.ts`: Custom hook managing modal phases, draft states, and form submissions.
- `src/components/ScreenplayEditor.tsx`: Main pagination and script canvas supporting industry-standard screenplay formatting, predictive element flow, Alt+letter shortcuts (Alt+S/A/C/D/T), and bi-directional Tab format cycling (Tab right, Alt+Tab / Shift+Tab left).
- `src/components/FormattingToolbar.tsx`: Format selector bar with clean element counter, format buttons, format helper button, and docked Open and Export action menus.
- `src/components/format_bar/FormatBarOpenMenu.tsx`: Dedicated Open menu in the formatting toolbar providing quick project open, import, new script, and sample loader.
- `src/components/format_bar/FormatBarExportMenu.tsx`: Dedicated Export menu in the formatting toolbar providing PDF, Word Docx, project save, and script printing.
- `src/components/FormatShortcutsHelp.tsx`: Hoverable and focusable keyboard guide (`[i]`) detailing Tab cycling and browser-safe Shift+Alt shortcuts.
- `src/lib/screenplayShortcuts.ts`: Centralised shortcut definitions and browser-safe keyboard event resolver (Shift+Alt+Letter, Alt+1..8).
- `src/components/SluglineAutocomplete.tsx`: Minimalist light-mode floating autocomplete dropdown for Scene Headings (prefixes, locations, times of day).
- `src/components/CharacterAutocomplete.tsx`: Minimalist light-mode floating autocomplete dropdown for character name suggestions.
- `src/lib/sluglinePredictor.ts`: Modular index re-exporting slugline parser, suggestion engine, and ghost text calculator.
- `src/lib/slugline/sluglineConstants.ts`: Standard slugline prefixes, common locations, and time of day sets with completion guard.
- `src/lib/slugline/sluglineParser.ts`: Slugline prefix, location, and hyphen separator parsing.
- `src/lib/slugline/sluglineSuggestions.ts`: Contextual prefix, location, and time of day suggestion calculator.
- `src/lib/slugline/sluglineGhostText.ts`: Smart compose inline ghost text suggestion generator.
- `src/components/NavigatorSidePanel.tsx`: Scenes, shots, arcs, story bibles, and statistics drawer. Includes sticky non-overlapping fullscreen controls positioned cleanly with dual-header clearance (top-28) below both the main header and formatting toolbar.
- `src/components/navigator/PreProductionDocButton.tsx`: Premium amber-tinted trigger button positioned directly above the scenes panel search bar to launch the Pre-Production suite.
- `src/components/TableReadModal.tsx`: Multi-voice playback and script rehearsal audio engine offset safely with dual-header clearance (top-28).
- `src/components/SettingsModal.tsx`: Preferences and environment configurations.
- `src/lib/gameCooldownManager.ts`: 10-minute focus sprint timer and session storage persistence to regulate break games.
- `src/components/GameLockoutModal.tsx`: Focus sprint notification modal displaying live cooldown countdown when games are temporarily blocked.
- `src/lib/actorHighlighting.ts`: Soft pastel palette constants, character colour resolver, dialogue speaker tracker, and hex-to-rgb vector transformer.
- `src/lib/handDrawnHighlighter.ts`: Authentic hand-drawn highlighter styling with line-by-line wrapping, rough textured edges, paper fibre ink bleed, and subtle chisel tilt.
- `src/components/character_bible/ActorHighlightToggle.tsx`: Compact Actor Highlight toggle button featuring green (active) and purple (inactive) border highlights.
- `src/components/character_bible/PastelSwatchPicker.tsx`: Single interactive circle swatch button triggering the colour palette popover.
- `src/components/character_bible/ColorPalettePopover.tsx`: 12-pastel colour palette popover with custom colour picker input and outside-click dismissal.
- `src/lib/pdf/pdfDialogueHighlighter.ts`: Vector PDF hand-drawn chisel highlighter polygon engine with uneven waviness, angled chisel cuts, human tilt, and paper fibre bleed.
- `src/components/production/CallSheetTab.tsx`: Unified Shoot Schedule combining V3 administrative header, V4 interactive spreadsheet grid, multi-select batch controls, and re-themed Gantt chart.
- `src/components/production/shoot_schedule/`: Modular Shoot Schedule architecture (<100 lines per file):
  * `ShootScheduleTitleBanner.tsx`: Black title banner with department highlight filter pills including Locations and Print trigger.
  * `ShootScheduleAdminBox.tsx`: Compact administrative bar organising screenplay title, filming dates, director/producer details, single-line emergency contacts, and action buttons.
  * `AdminTitleDateCol.tsx` & `AdminPersonnelCol.tsx`: Extracted modular columns for Title/Filming Dates and Director/Producer controls.
  * `EmergencyContactsCol.tsx`: Compact single-line emergency contact inputs with phantom inline addition.
  * `ShootScheduleDayTabs.tsx`: Accordion/tab list on the white call sheet with rest-day moon toggles.
  * `LocationBadgePills.tsx`: Soft pastel location pill badges with active highlighting.
  * `InteractiveScheduleGrid.tsx`, `ScheduleGridRow.tsx`, `RowMainCells.tsx`: Crisp paper spreadsheet grid with dedicated Location column, smart chips, and direct 24-hour dropdown time selectors.
  * `Simple24HourTimePickerDropdown.tsx`: Clean light-mode 24-hour filming time slot dropdown popover (06:00 to 23:45) with custom time input.
  * `schedule24HourTimingOps.ts`: Strict 24-hour military minute parser, formatter, and normaliser.
  * `timeSlotGenerator.ts`: 15-minute 24-hour filming time slot array generator and index matching helper.
  * `chronologicalRowSortHelper.ts`: Direct row auto-repositioning and overlap clash resolver for 24-hour time shifts without pop-up prompts.
  * `use24HourTimeHandlers.ts`: Direct time update hook handler.
  * `PrintExportModal.tsx`: Print dialog supporting separate unit printing, combined unit printing, and single unit selection.
  * `ScheduleModals.tsx`: Modal aggregator maintaining strict file length limits.
  * `RowDragHandleWithGhostPlus.tsx`: Hover ghost inline plus adder and drag reorder handle.
  * `BatchActionsBar.tsx`: Multi-selection batch bar for bulk row deletion and clearing.
  * `ShootScheduleContextMenu.tsx`: Right-click context menu (Add Line Below, Delete Row).
  * `RethemedGanttChart.tsx` & `GanttEventRow.tsx`: Light-mode paper Gantt chart formatted with 24-hour military timeline bars.
  * `ShotSubRowsList.tsx` & `ShotSubRowItem.tsx`: Expandable camera setup shot list sub-rows with multi-line textarea supporting Return/line breaks and estimated shooting time.
  * `shotDurationShiftHelper.ts`: Recalculates block duration and auto-shifts subsequent rows to prevent time overlaps.
  * `printGanttHtmlHelper.ts` & `printShotBadgesHelper.ts`: Visual Gantt chart timeline compiler and shot badge formatting for PDF/print exports in 24-hour format.
  * `useShootShotsState.ts`: State handlers for toggling shot lists and managing camera setup items.
  * `sceneNotesAndShotsSyncHelper.ts`: Dynamic extractor parsing prop tags, wardrobe appearance notes from character bibles, and mapping script shots to setup items.
  * `scheduleScriptSyncOps.ts`: Automatic synchronisation keeping schedule rows, shot list camera setups, and prop/wardrobe notes reactive to script additions.
  * `WorkingHoursPickerModal.tsx` & `WorkingHoursChoiceModal.tsx`: Working hours setup modal and multi-day shift scope selector supporting 24-hour military time.
  * `workingHoursSpilloverOps.ts` & `useWorkingHoursState.ts`: Automated overflow calculation pushing scenes to newly created days when wrap time is exceeded.
  * `useScheduleContacts.ts`: Modular state helper managing emergency contacts and phone numbers.
  * `CallSheetAdminSection.tsx`: Administrative section wrapper for CallSheetTab enforcing modular line limits.
  * `scheduleTimingOps.ts`: Chronological sorting enforcement preventing backward time travel.
  * `multiUnitOps.ts`: Multi-unit label formatters, unit color palettes, filtering helpers, and existing unit enumeration (up to 15 units).
  * `UnitFilterDropdown.tsx`: Title banner unit filter dropdown (All Units, 1st Unit, 2nd Unit... + Create Unit).
  * `BatchAssignUnitButton.tsx`: Multi-selection batch action button to assign selected scenes to filming units.
  * `unitTimingOps.ts`: Independent per-unit timeline calculations allowing unit overlaps while cascading same-unit shifts.
  * `unitGanttColorOps.ts`: Distinct pastel color theme maps for Gantt timeline event bars across filming units.
- `src/components/navigator/shot_planner/`: Modular Scene Shot Planner architecture (<100 lines per file):
  * `SceneShotPlannerModal.tsx`: Clean light-mode container modal matching call sheet aesthetic.
  * `ShotPlannerRowItem.tsx`: Individual shot setup card featuring pastel shot type chips, description textarea, tagged props badges, duration chips, drag handle, and 1-click deletion.
  * `ShotTypeChipDropdown.tsx`: Soft pastel shot type dropdown (Wide, Medium, Close-Up, ECU, Action, Insert, Drone, Cutaway, Tracking).
  * `ShotDurationChips.tsx`: Quick duration preset chips (15m, 30m, 45m, 1h) plus custom minute input.
  * `ShotPlannerEmptyState.tsx`: Friendly teacher-toned empty state card with quick Add First Shot action button.
- `src/components/production/tour/`: Step-by-step Interactive Page Tour architecture (<100 lines per file):
  * `tourTypes.ts`: Interface definitions for TourStep and active ProductionTab.
  * `callsheetTourBlueprintPart1.ts`: Step-by-step tour definitions for Shoot Schedule & Call Sheet (Steps 1-6).
  * `callsheetTourBlueprintPart2.ts`: Step-by-step tour definitions for Shoot Schedule & Call Sheet (Steps 7-12).
  * `callsheetTourBlueprint.ts`: Master aggregator combining Call Sheet tour steps.
  * `otherTourBlueprints.ts`: Tour blueprint steps for Risk Assessment and Release Forms tabs, plus selector.
  * `useElementTracker.ts`: Live ResizeObserver, scroll tracker, and smooth glide loop tracking target element bounding coordinates with eye-level positioning.
  * `SpotlightOverlay.tsx`: 4-panel click-blocking mask with transparent click-through cutout, mouse wheel passthrough, and glowing halo.
  * `TourTooltipCard.tsx`: Two-sentence teenager-friendly floating card with non-overlapping side placement, progress bar, step progression, and navigation buttons.
  * `PageTourModal.tsx`: Main tour orchestrator rendering via React createPortal to document.body for true viewport coordinates.
  * `HowDoIUseButton.tsx`: Warm amber circular '?' trigger button with two-line teacher-friendly label.
- `src/components/production/ProductionSuiteHeader.tsx`: Extracted top bar with title, metadata, tour trigger, and modal close.
- `src/components/production/ProductionSuiteTabs.tsx`: Extracted suite tab navigation and production company logo uploader.
- `src/components/production/ProductionScheduleModal.tsx`: Modular root modal container integrating active tab views and live page tour.
