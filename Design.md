# Screenwriter Pro Architecture & Path Index

## Application Structure
- `src/App.tsx`: Central application state, keyboard shortcuts, disk persistence, and navigation controller.
- `src/components/Header.tsx`: Top bar coordinating navigation drawer, focus mode, theme switcher, and responsive action layout.
- `src/components/header/NavigatorToggle.tsx`: Prominent two-line toggle button for Navigator & Production Tools.
- `src/components/header/ScriptTitleEditor.tsx`: Legacy screenplay title display and click-to-edit component (currently omitted from Header to keep header controls compact).
- `src/components/header/PomodoroWidget.tsx`: Pomodoro break game trigger, countdown timer, and settings menu.
- `src/components/header/ExportMenu.tsx`: Export dropdown providing pure PDF document generation, Word Docx, .screenplay project outputs, and direct script printing.
- `src/lib/pdf/exportScreenplayPdf.ts`: Pure vector text PDF screenplay compiler generating letter-format industry-standard documents with title page and running headers.
- `src/lib/pdf/pdfTitlePage.ts`: Title page formatting engine rendering centered title block, author credentials, contact, date, and draft colour.
- `src/lib/pdf/pdfElementRenderer.ts`: Screenplay element formatting rules, margin offsets, uppercase transforms, and orphan prevention rules.
- `src/lib/printScript.ts`: Direct script printing trigger compiling and printing isolated screenplay documents without app buttons.
- `src/lib/print/printScriptDocument.ts`: Standalone in-place printing pipeline ensuring crisp, reliable printer dispatch without opening new tabs.
- `src/lib/print/printHtmlInPlace.ts`: Shared in-place print helper routing embedded sandbox previews to PrintPreviewModal and standalone tabs to synchronous `window.print()`.
- `src/lib/print/printPreviewBus.ts` & `src/components/PrintPreviewModal.tsx`: Global in-app Print Preview overlay with live paper preview and 1-click PDF download.
- `src/lib/print/htmlToPdfExporter.ts`: Universal HTML-to-PDF converter supporting portrait/landscape pages, page breaks, logos, SVGs, and tables.
- `src/lib/print/generateScriptHtml.ts`: Standalone HTML generator compiling title page and screenplay body into pure screenplay format.
- `src/lib/print/printStyles.ts`: Print stylesheet bundler combining page layout and element typography styles.
- `src/lib/print/printPageStyles.ts`: Page size, 1-inch margins, Courier font, and title page centering layout.
- `src/lib/print/printElementStyles.ts`: Screenplay element indentation, margins, dialogue widths, and orphan prevention rules.
- `src/components/header/ImportProjectMenu.tsx`: Open file, import script, new blank script, and sample loader.
- `src/components/header/MainBarQuickActions.tsx`: Main bar quick buttons for Table Read, Revision History, and Title Page.
- `src/components/header/ThemeDropdownButton.tsx`: Theme switcher dropdown offering Vintage, Charcoal, Eucalyptus presets and Paper/Text colour pickers.
- `src/components/header/ThemeColorPickers.tsx`: Native colour picker controls for customising script paper background and script text colour independently.
- `src/lib/themePresets.ts`: Theme preset definitions (Vintage, Charcoal, Eucalyptus), luminance helpers, and `resolveThemeConfig` mapper.
- `src/lib/modalTheme.ts`: Shared modal, popover, and sub-window theme token helper (`getModalTheme`) mapping `AppThemeConfig` across all dialogues and tools.
- `src/components/header/HeaderActionButtons.tsx`: Action controller organizing header actions and responsive toolgroups.
- `src/components/TitlePageModal.tsx`: Script creation modal and metadata editor with empty defaults and discreet placeholder hints.
- `src/components/title_page/StartupOptionsGrid.tsx`: Startup options grid with prominent action buttons and bordered metadata editor button.
- `src/components/title_page/StartupOptionCards.tsx`: 3-card launchpad for starting a new script, loading files, and opening samples.
- `src/components/title_page/TitlePageForm.tsx`: Dedicated form container for script title, author, date, and draft colour metadata.
- `src/components/title_page/TitlePageFormFields.tsx`: Inputs and text areas for title page attributes.
- `src/components/title_page/useTitlePageModalState.ts`: Custom hook managing modal phases, draft states, and form submissions.
- `src/components/ScreenplayEditor.tsx`: Main pagination and script canvas supporting industry-standard screenplay formatting, predictive element flow, Alt+letter shortcuts (Alt+S/A/C/D/T), and bi-directional Tab format cycling (Tab right, Alt+Tab / Shift+Tab left) strictly isolated from autocomplete dropdowns.
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
- `src/utils/sparkEngine.ts`: Zero-AI weighted 8-category Spark Engine coordinating category selection, 0-character filtering, 5%-capped state-aware nudges, and token replacement (<100 lines).
- `src/utils/sparks/`:
  * `sparkContext.ts`: Core-cast selector (min 5% dialogue share for developed scripts, neutral fallback for solo characters), rotating 24-prop bank, and feature state checks (<100 lines).
  * `sparkDeck.ts`: Full-deck category shuffler with rolling 15-template anti-repeat session memory (<100 lines).
- `src/data/sparks/`: Modular JSON prompt banks across 8 categories (`scriptPrompts.json`, `trivia.json`, `paradoxes.json`, `motivation.json`, `antiCliche.json`, `psychology.json`, `sensory.json`, `subtext.json`).
- `src/components/navigator/PreProductionDocButton.tsx`: Premium amber-tinted trigger button positioned directly above the scenes panel search bar to launch the Pre-Production suite.
- `src/components/navigator/StoryArcTabContent.tsx`: Dedicated Story Arc bridge component immediately launching the full-screen Story Lab workspace without redundant intermediate cards.
- `src/components/TableReadModal.tsx`: Modular Table Read coordinator managing cast casting, speech loop, live rate modulation, and spacebar rehearsal cueing (<100 lines).
- `src/components/table_read/`:
  * `TableReadHeader.tsx`: Title, Edge Natural / Offline OS engine badge, room tone toggle, audio export trigger (<100 lines).
  * `TableReadControlsBar.tsx`: Play/pause, restart, 0.5x to 5.0x speed slider with live hot-swapping, Dialogue-Only toggle, Smart Cadence toggle (<100 lines).
  * `TableReadCastPanel.tsx`: Left sidebar housing the prominent top Narrator card and character casting list (<100 lines).
  * `TableReadNarratorCard.tsx`: Dedicated top card for casting the Narrator voice and audition preview (<100 lines).
  * `TableReadCharacterCard.tsx`: Character casting card with mute toggle and 10 gender/FX voice modes (Male, Female, Elder, Baby, Alien, Chipmunk, Monster, Surfer, Robot, Ghost) (<100 lines).
  * `VoiceSelectDropdown.tsx`: Gender-filtered persona and system voice dropdown with standalone FX indicator and 1-click audition button (<100 lines).
  * `TableReadScriptViewer.tsx`: Script scroll container with element cards and word-by-word karaoke tracking (<100 lines).
  * `TableReadElementCard.tsx`: Individual script card with theme-matched word karaoke and live rehearsal countdown banner (<100 lines).
  * `TableReadExportModal.tsx`: Rehearsal audio export modal generating spoken MP3, lossless WAV, and interactive HTML rehearsal packages with progress readout (<100 lines).
  * `useTableReadPlayback.ts`: Hook managing speech synthesis loop, spacebar cue advance, word boundary events, and rehearsal gap timer (<100 lines).
- `src/types/mespeak.d.ts`: TypeScript declarations for offline meSpeak synthesiser and bundled JSON voice packs (<100 lines).
- `src/lib/tableReadTypes.ts`: Timbre presets, voice persona definitions, and casting interfaces (<100 lines).
- `src/lib/voiceGenderClassifier.ts`: Word-boundary gender classifier, safe character detection, and per-voice speed calibrator (<100 lines).
- `src/lib/voicePersonas.ts`: Curated library of 10 Male and 10 Female character vocal personas (<100 lines).
- `src/lib/mespeakSynth.ts`: Offline meSpeak synthesiser wrapper generating WAV buffers from bundled English UK/US voice data (<100 lines).
- `src/lib/webAudioFxRack.ts`: Shared Web Audio DSP FX graph (pitch/rate, ring modulation, wave-shaper distortion, and echo reverb) for live and offline rendering (<100 lines).
- `src/lib/fxPlaybackHelper.ts`: Real-time Web Audio FX playback controller with live rate modulation and karaoke boundary ticks (<100 lines).
- `src/lib/speechEngine.ts`: Hybrid audio router dispatching FX timbres to meSpeak + Web Audio DSP and dramatic cast roles to native OS/Edge voices (<100 lines).
- `src/lib/speechVoiceManager.ts`: Edge Natural & Offline OS voice filtering, FX local-pitch routing, and persona resolver (<100 lines).
- `src/lib/rehearsalGapTimer.ts`: Actor reading time calculator based on word count with math guards (<100 lines).
- `src/lib/mp3Encoder.ts`: Pure 16-bit PCM WAV and 128kbps MP3 encoder built on @breezystack/lamejs (<100 lines).
- `src/lib/tableReadAudioExporter.ts`: Spoken rehearsal track renderer combining meSpeak synthesis, OfflineAudioContext DSP, rehearsal chimes/gaps, and MP3/WAV export (<100 lines).
- `src/lib/tableReadHtmlExporter.ts`: Standalone offline actor rehearsal HTML audio player generator (<100 lines).
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
- `src/types/healthSafety.ts`: TypeScript interfaces for Health & Safety Toolbox Talk, Incident Log, and Emergency Contacts (<100 lines).
- `src/components/production/health_safety/`: Modular On-Set Health & Safety (H&S) Suite (<100 lines per file):
  * `HealthSafetyTab.tsx`: Main coordinator with live auto-scan on open, Call Sheet sync, and Full Pack Print/PDF/Word exports.
  * `hsHazardRules.ts` & `hsKeywordScanner.ts`: Zero-AI script scanner for sluglines, action, and shots with edit-preserving merge.
  * `hsDefaultData.ts`: UK defaults and live Call Sheet emergency contact synchronisation helpers.
  * `HazardChecklistSection.tsx` & `HazardRowItem.tsx`: Editable Automatic Set Hazard Checklist with Priority and Suggested Controls.
  * `ToolboxTalkSection.tsx` & `ToolboxCrewList.tsx`: Editable Daily Safety Briefing with Call Sheet crew import and extra blank handwritten print lines.
  * `IncidentLogSection.tsx`: Editable On-Set Incident & Near-Miss Log with extra blank clipboard rows on export.
  * `EmergencyContactsSection.tsx`: Emergency hospital and set contact manager synced bidirectionally with Call Sheet.
  * `hsLogoHelper.ts`: Image normaliser converting uploaded logos (PNG, JPEG, WebP, SVG) into scaled PNG assets for PDF and Word exports (<100 lines).
  * `HsExportActions.tsx`, `hsPrintHelper.ts`, `hsHtmlTemplates.ts`, `hsPdfExporter.ts`, `hsWordExporter.ts`: Popup-free Print, vector PDF, and editable Word (.docx) exporters with production logo branding.
- `src/components/production/safety_signs/`: Modular printable UK safety signs bank (<100 lines per file):
  * `safetySignsData.ts`, `SafetySignCard.tsx`, `SafetySignsBank.tsx`: 12 British-English printable warning & safe-condition posters.
- `src/components/production/release_forms/`: Modular Release Form selector & print helpers (<100 lines per file):
  * `releaseFormOptions.ts`, `ReleaseFormPicker.tsx`: Empty-by-default release form pill chooser and active toolbar selector.
  * `releaseFormPrintHelper.ts`: Single and batch multi-page Release Form HTML print compiler with logo and signature blocks.
- `src/components/story_lab/`: Dedicated Story Lab workspace architecture (<100 lines per file):
  * `storyLabTypes.ts`: Type definitions for 3-Act milestones, pacing metrics, and spark answers.
  * `storyLabOps.ts`: Zero-math guarded pacing calculation (`calculateSafePacing`) and `importScenesIntoActs` helper.
  * `storyLabSparkOps.ts`: Empty canvas initialization (`createDefaultEmptyCards`), content detection (`hasCardContent`), and guided prompt application.
  * `useStoryLabState.ts`: Modal state hook governing 3/5-act toggling, reset guards, and script synchronization.
  * `StoryLabTimeline.tsx`: Unified horizontal Writers' Wall & Vonnegut fortune timeline with tick marks for Act I, Act II, Midpoint, Act III, and Climax.
  * `storyStickitOps.ts`: Proportional Writers' Wall stickit position, stagger tier, and pacing calculator for Act cards and 12-stage Hero's Journey beats.
  * `StoryLabStickitsWall.tsx`: Tactile colour-coded Post-it sticky notes and pin stems pinned directly onto the main timeline canvas with edge-safe hover expansion.
  * `TimelineContextMenu.tsx`: Right-click context menu on the timeline canvas for pinning a new beat card at the clicked timestamp across Main Story or any Sub-Plot.
  * `StoryLabActionBar.tsx`: Clean action row conditionally rendering "Create a 3-Act Story" (switching to "Expand to 5 Acts" once all 3 cards have notes), "Create Synopsis", editable Audience Feeling reminder, "Start New", and "Idea Vault".
  * `AudienceEmotionInput.tsx`: Editable audience-feeling reminder badge/input placed directly to the left of "Start New" for writers working freely or via guided prompts.
  * `StoryLabSynopsisModal.tsx`: Dedicated story synopsis review modal formatting all act beats into a readable document with one-click clipboard copying.
  * `FiveActExpansionModal.tsx`: 3-step guided wizard for transforming 3 acts into 5 acts (New Act III furthest point -> New Act II outside events -> New Act IV preparation).
  * `FiveActExpansionStepView.tsx`: Step view router managing prompt questions and speed sprint launchers for 5-act expansion.
  * `FiveActPyramidView.tsx`: Visual layout matching the dramatic pyramid structure (3 original cards along the bottom with faded middle, topped by a 3-card pyramid under the dramatic arc).
  * `FiveActPyramidArcSvg.tsx`: Vector dramatic arc SVG curve connecting the pyramid apex and shoulders to the base.
  * `FiveActPyramidBaseRow.tsx`: Extracted modular component rendering the base row of original act cards for the pyramid view.
  * `StoryLabPyramidCard.tsx`: Dedicated card component for the pyramid configuration with blue-bordered styling, faded middle state, and light plot points expansion.
  * `fiveActPyramidHelper.ts`: Extractor mapping 5-act structure and preserved middle into apex, shoulders, and base.
  * `StoryLabActCard.tsx`: Act card component supporting direct text editing with solo Idea Generation button (no expand button).
  * `StoryLabCardFooter.tsx`: Modular card footer rendering Idea Generation and optional "Create more plotpoints" button.
  * `StoryLabPlotpointsDeck.tsx`: Light-themed 3-card plot points deck replacing the card in pristine white paper styling with clean Collapse button.
  * `characterFortuneTypes.ts`: Type definitions for Kurt Vonnegut G-I character fortune axis and timeline tag points.
  * `characterExtractor.ts`: Character extractor harvesting cast from script elements, character bibles, and scenes with distinct colour palettes.
  * `CharacterFortuneDropdown.tsx`: Multi-select character dropdown enabling writers to plot and compare protagonist vs antagonist trajectories.
  * `StoryLabTimelineTrack.tsx`: Baseline timeline track rendering Act I/II/Midpoint/III/Climax milestones and +Good / -Ill Fortune guidelines.
  * `StoryLabGiCurveSvg.tsx`: Smooth Catmull-Rom/Bezier spline SVG generator rendering thin coloured character fortune curves left-to-right across freeform nodes.
  * `StoryLabGiTagsLayer.tsx`: Plain unnumbered circular fortune nodes supporting 2D click-drag positioning, click selection, and keyboard/button deletion.
  * `useCharacterFortuneState.ts`: Custom hook managing multi-character 5-node default arcs, 2D node dragging, right-click insertion, and node deletion persisted on the script.
  * `StoryLabGrid.tsx`: Responsive grid and pyramid layout router.
  * `StoryLabModal.tsx`: Fullscreen `#FDFBF7` workspace portal rendered via `createPortal` to `document.body` with `z-[100]` to avoid parent stacking context and header overlap.
  * `StoryLabWorkspaceBody.tsx`: Main workspace container coordinating Header, Timeline, Action Bar, and Grid/Hero's Journey views.
  * `StoryLabModalsLayer.tsx`: Popover aggregator managing confirm-reset, synopsis, and guided-spark overlays.
  * `StoryLabConfirmResetModal.tsx`: Confirmation modal triggered when "Start New" is pressed with existing content.
  * `StoryLabGuidedModal.tsx`: 4-step reverse-engineering story spark wizard (Ending feeling -> Act III Climax -> Act I Beginning Rhyme -> Act II Middle Transformation).
  * `StoryLabGuidedStepView.tsx`: Step view router branching between emotion/climax and rhyme/middle prompts.
  * `StoryLabGuidedFooterControls.tsx`: Extracted back/next navigation controls for guided wizard steps.
  * `StoryLabStepEmotionClimax.tsx`: Steps 1 and 2 inputs for ending emotion and Act III climax with Smart Chips Input and Connected Refiner.
  * `StoryLabStepRhymeMiddle.tsx`: Steps 3 and 4 inputs for Act I rhyming beginning and Act II crucible middle.
  * `StoryLabSmartChipsInput.tsx`: Interactive smart chip input component converting typed words into removable pill badges with ✕ buttons.
  * `StoryLabEmotionRefiner.tsx`: Clean text tab refiner rendering Positive, Negative, and Neutral tabs directly above suggested emotion chips.
  * `semanticEmotionLookup.ts`: Zero-AI cinematic emotion mapper categorised by Positive, Negative, and Neutral valence constellations.
  * `StoryLabCardBackups.tsx`: Expandable backup choices component rendered under 3-Act cards allowing writers to sleep on backup ideas.
  * `subPlotOps.ts`: Sub-plot colour palettes, factory, act synchronisation, and per-act sub-plot counters.
  * `useSubPlotState.ts`: Sub-plot collection state manager handling creation, renaming, recolouring, emotion notes, card editing, and deletion.
  * `PlotSwitcherDropdown.tsx`: Plot selector beside Audience Feeling for switching between Main Story only, sub-plots, and creating new sub-plots.
  * `SubPlotLaneRow.tsx`: Full-width colour-coded sub-plot lane beneath the Main Story with tall text boxes, swatch picker, and idea triggers.
  * `SubPlotPocketTabs.tsx`: Tactile index-card folder pocket tabs tucked under each Main Act card showing written vs empty sub-plot beats.
  * `SideSlideSubPlotCard.tsx`: Inline colour-coded sub-plot overlay sliding out beside its parent Main Act without dimming or squashing the grid.
  * `SideSlideSubPlotSettings.tsx`: Compact collapsible settings panel inside the side-slide card for renaming, tint switching, emotion notes, and deleting.
  * `hero_journey/`: Two-panel 12-stage Hero's Journey story grid architecture (<100 lines per file):
    - `heroJourneyConstants.ts`: 12 classic Hero's Journey stage definitions and pacing speed styles.
    - `heroJourneyMapper.ts`: Act-to-stage auto-distribution helper, zero-math page count guard, and sub-plot track sync.
    - `heroJourneyRowOps.ts`: Pure row insertion and deletion helpers matching timeline percentages and inter-row gaps.
    - `HeroJourneyRowGapButton.tsx`: Subtle ghost `+ Add row` divider appearing between table rows on hover/focus.
    - `useHeroJourneyState.ts`: State hook managing selected beat editing, plotline filtering, page totals, row insertion, and Act re-import.
    - `HeroJourneyDraftingPanel.tsx`: Left Drafting Workspace panel for editing beat title, summary, pacing speed, and page count.
    - `HeroJourneyFilterStats.tsx`: Bottom-left plotline filter controls, New Sub-Plot button, and stage/page totals readout.
    - `HeroJourneyBeatCard.tsx`: Synchronised beat card displaying title, summary snippet, page count, and pacing speed badge.
    - `HeroJourneyGridMatrix.tsx`: Right 12-stage matrix with sticky frozen Main Plot column and horizontal column navigation.
    - `HeroJourneyStageTooltip.tsx`: Interactive (i) info icon displaying stage writing guide and tips under 50 words on hover.
    - `HeroJourneyWorkspace.tsx`: Two-panel workspace container integrating theme tokens with live Hero's Journey state.
  * `idea_sprint/`: Modular Speed Brainstorming Sprint engine (<100 lines per file):
    - `ideaSprintTypes.ts`: Type definitions for sprint sessions, vault items, and backup ideas.
    - `ideaSprintTwists.ts`: Zero-AI static pool of 10 provocative story twists for the 3-lives Wild Card.
    - `ideaSprintAudio.ts`: Web Audio API typewriter paper click sound synthesiser.
    - `ideaSprintRankHelper.ts`: Gamified rank calculator and ideas-per-minute pace calculator.
    - `IdeaSprintLauncherModal.tsx`: Pre-sprint setup pop-up allowing custom question and timer selection.
    - `IdeaSprintHeader.tsx`: Active sprint top bar with timer countdown, 3 twist lives, and Finish Sprint trigger.
    - `useIdeaSprintActiveState.ts`: Custom hook managing active sprint timer, streak multipliers, and idle burn rate.
    - `IdeaSprintMotivationBar.tsx`: High-stakes gamified pace ticker with Flow Surge 2X/3X multipliers and Inertia Warning alerts.
    - `IdeaSprintPaperCanvas.tsx`: Traditional lined notebook paper canvas enforcing strict no-deletion rules (Backspace, Delete, Cut, and length reduction blocked) until sprint timer expires.
    - `IdeaSprintSummaryItem.tsx`: Selectable idea item component for primary and backup selections.
    - `IdeaSprintSummaryModal.tsx`: Post-sprint modal allowing manual selection of 1 Primary idea + up to 2 Backup ideas + save to Idea Vault.
    - `IdeaSprintModal.tsx`: Main modal orchestrator managing launcher -> active sprint -> summary.
    - `IdeaVaultItemList.tsx`: Render engine displaying saved sprint session questions as clean collapsible accordion labels expanding to reveal all ideas.
    - `IdeaVaultDropdown.tsx`: Idea Vault dropdown in Story Lab header providing instant access to saved brainstorm sessions.
  * `logline/`: Modular logline creation suite (<100 lines per file):
    - `LoglineWizardModal.tsx`: 5-question wizard modal orchestrator integrating answer weaves, examples, and idea sprint.
    - `LoglineQuestionsColumn.tsx`: 5 core prompt question inputs with dedicated Brainstorm launchers.
    - `LoglineWeavesColumn.tsx`: Live template weave cards and 50-word final logline editor.
    - `LoglineWizardFooter.tsx`: Cancel and Save Logline action footer.
    - `useLoglineSprint.ts`: Custom hook linking question brainstorming to IdeaSprint and applying chosen ideas directly to input fields.
    - `ClassicExamplesBanner.tsx`: Collapsible classic film logline reference cards.
    - `loglineConstants.ts`: Question definitions, placeholders, and classic film pitch examples.
    - `loglineHelpers.ts`: Template interpolation formulas and word counter helper.
  * `synopsis/`: Modular professional synopsis suite architecture (<100 lines per file):
    - `SynopsisEditorModal.tsx`: Main synopsis modal orchestrator assembling header, controls, editor, and timeline drawer.
    - `SynopsisHeader.tsx`: Top bar with title, subtitle, timeline toggle, and close button.
    - `SynopsisTopControls.tsx`: Responsive top bar coordinating How to Guide expand/collapse and Comps input.
    - `SynopsisHowToGuide.tsx`: Compact, punchy "How to Guide" containing What & Why, 4-Paragraph Blueprint, and golden rules in ultra-concise bullets.
    - `SynopsisCompsInput.tsx`: Side-by-side optional comparable titles input kept separate from synopsis text.
    - `SynopsisTextArea.tsx`: Multi-line synopsis canvas with agent word-count indicators and grammar tense/pronoun tips.
    - `SynopsisTimelineDrawer.tsx`: Collapsible reference drawer rendering act beats and Hero's Journey stages with insert buttons (default off).
    - `SynopsisExportActions.tsx`: Action bar providing Copy, Print/PDF, Email, Download Word, Cancel, and Save triggers.
    - `synopsisExportOps.ts`: Pure export helper functions for clipboard, Word .doc, direct print, and email dispatch.
- `scripts/verify-db.js`: Verification script ensuring IndexedDB schema, store names, and backup keys align.

