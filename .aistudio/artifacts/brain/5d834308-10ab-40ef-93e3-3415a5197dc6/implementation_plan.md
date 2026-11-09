# Comprehensive 24-Hour Time Picker & Auto-Chronological Reordering Engine

A complete replacement of the shoot schedule time picker and timing calculation engine to support strict 24-hour military time formatting (e.g. `07:00` to `23:00`), simple time-slot dropdown selection, instant row repositioning, and non-clashing chronological time recalculations without confirmation popups.

## Architectural Hygiene & Strict Line Limits

> [!IMPORTANT]
> Every feature will be strictly modularised into single-purpose files under **100 lines of code**. If additional logic is required, child connected files will be extracted:
> - `src/components/production/shoot_schedule/schedule24HourTimingOps.ts` (<100 lines): 24-hour minute parsing (`07:00` -> `420`) and formatting.
> - `src/components/production/shoot_schedule/chronologicalRowSortHelper.ts` (<100 lines): Automatic row repositioning and overlap clash recalculation logic.
> - `src/components/production/shoot_schedule/timeSlotGenerator.ts` (<100 lines): 15-minute 24-hour filming time slot option list compiler (`06:00` to `23:45`).
> - `src/components/production/shoot_schedule/Simple24HourTimePickerDropdown.tsx` (<100 lines): Clean, light-mode 24-hour dropdown time slot selector popover.

---

## User Review & Critical Decisions

> [!IMPORTANT] All key product requirements and user preferences have been confirmed during Phase 1:

- **Confirmed Time Picker Interface**: Simple dropdown list of standard filming time slots (e.g., `07:00`, `07:15`, `07:30`... through `23:00`) with direct keyboard time input capability.
- **Confirmed Initial Time Alignment**: Picker opens pre-selected at the exact current 24-hour time value of the clicked scene cell.
- **Confirmed Time Format**: Strict 24-hour military format (`07:00`, `08:30`, `14:00`, `15:30`) across the entire grid, call sheet PDF export, and Gantt chart.
- **Confirmed Zero Popups**: Eliminates all confirmation choice popups (`TimeAdjustmentChoiceModal`), updating times instantly upon selection.
- **Confirmed Auto-Move & Clash Resolution**: Changing a scene's start time automatically repositions the row to its exact chronological location in the schedule (e.g., changing from `15:00` to `09:00` inserts it directly after `08:30`). If a time clashes with an already set time, proceeding scene times are automatically recalculated to ensure strict chronological flow.
- **Confirmed Fixed Break Rows**: Shared break rows (Call Time, Basecamp, Lunch) remain anchored at set times while scene rows dynamically shift around them.
- **Confirmed Multi-Unit Independence**: Time updates calculate independently per filming unit (`Unit 1`, `Unit 2`...) without altering parallel unit schedules.

---

## 1. Overview & Core Concept

### What It Does
Replaces the old 12-hour AM/PM wheel picker and timing recalculator with an intuitive, reliable 24-hour military time engine. Users can click any time cell to choose from a clean, lightweight dropdown of 15-minute filming time slots or type 24-hour times directly (`08:00`, `13:30`). The schedule instantly moves the edited row into its correct chronological position and auto-adjusts subsequent scene start times to eliminate time collisions.

### Key Value
Eliminates time parsing bugs (e.g., `14:00` misinterpreting as `02:00 AM`), removes tedious popup prompts, and guarantees that every shoot day timeline flows in pristine chronological order.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Time Slot Selection**:
   - User clicks on a time cell in the schedule grid (e.g. displaying `14:00`).
   - A clean, unboxed light-mode dropdown appears pre-focused at `14:00`.
   - User picks `09:30` from the slot list or types `09:30`.
2. **Instant Auto-Repositioning & Clash Recalculation**:
   - The dropdown closes immediately (zero popups).
   - The scene row automatically moves up from afternoon position to sit cleanly between `09:00` and `10:00`.
   - If `09:30` overlaps with an existing scene at `09:30`, proceeding scenes smoothly increment by their duration (e.g., `09:30`, `10:30`, `11:30`), preserving fixed breaks like `12:30 Lunch`.
3. **Gantt & PDF Sync**:
   - The light-mode paper Gantt chart timeline automatically updates its hour markers to 24-hour format (`07:00`, `08:00`, `09:00`... `22:00`).
   - PDF exports display crisp 24-hour timestamps.

### Visual Identity & Theme
- **Picker Design**: Lightweight floating popover (`bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50`) featuring 15-minute time chips (`07:00`, `07:15`, `07:30`...).
- **Active Selection**: `bg-amber-500 text-slate-950 font-bold` for the currently selected time slot.
- **Typography**: Clean tabular monospace figures (`font-mono tabular-nums text-sky-600 font-bold`) for all grid time cells and Gantt markers.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: 24-Hour Military Time Standard
- **Chosen Approach**: Store, parse, and render all times internally as 24-hour strings (`07:00`, `08:30`, `14:00`, `19:45`).
- **Why**: Eliminates 12-hour AM/PM flip bugs where `14:00` or `2:00 PM` mistakenly converted to `2:00 AM` (1:00 AM).
- **Alternatives Considered**: 12-hour AM/PM strings—rejected due to parsing ambiguity and accidental early-morning jumps.

### Decision 2: Zero-Popup Direct Execution
- **Chosen Approach**: Remove `TimeAdjustmentChoiceModal` trigger when selecting times from grid cells.
- **Why**: Streamlines workflow by updating schedules instantly without blocking modal prompts.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        InteractiveScheduleGrid                         │
│   (Renders Time Cells in 24-Hour Monospace Format: "08:00", "14:30")   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Click Time Cell
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  Simple24HourTimePickerDropdown                        │
│    (Pre-selected at cell's current time, 15-min slots from 06:00-23:45) │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ On Select Slot / Input
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    chronologicalRowSortHelper                          │
│  1. Parse 24h minutes (e.g. "14:30" -> 870 mins)                      │
│  2. Update row target time                                            │
│  3. Sort rows chronologically & position row in sequence               │
│  4. Recalculate non-clashing proceeding times (anchoring fixed breaks) │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Update State
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             CallSheetData (days, rows) & RethemedGanttChart            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Verification & Pre-Flight Checklist

1. **Compilation**: Run `compile_applet` and `lint_applet` together to verify zero build or syntax errors.
2. **24-Hour Parsing**: Test time slot selection at `14:00`, `15:30`, `20:00` ensuring zero 1:00 AM / 2:00 AM unwanted flips.
3. **No Popups**: Confirm clicking and picking a new time immediately updates the grid and Gantt chart without popup prompts.
4. **File Limit Check**: Verify every new file is strictly under 100 lines.
