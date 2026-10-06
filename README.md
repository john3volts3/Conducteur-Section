# Cable Sizer

*[Version française](README.fr.md)*

Single-page web app that sizes the cross-section of an electrical conductor from several criteria and selects the
smallest standard section (IEC 60228) that satisfies all of them. Plain HTML/CSS/JavaScript: no dependency, no build,
works offline by double-clicking `index.html`, and can be hosted as-is on any static host.

> **Indicative tool.** Results must be checked against the applicable standard (RGIE, NF C 15-100, IEC 60364)
> by a qualified person.

## Features

- **Systems**: DC, AC single-phase, AC three-phase. Load given as current or as active power (+ cos φ).
- **Criteria** (each can be enabled with its own limit):
  - maximum voltage drop (V or %), including line reactance in AC;
  - maximum power loss (W or % of the transmitted power);
  - ampacity Iz from IEC 60364-5-52 tables, corrected for temperature and grouping;
  - heating, physical heat-balance model (estimate, free air);
  - short-circuit withstand (Isc, clearing time, k automatic or manual);
  - protection rating In (checks I ≤ In ≤ Iz).
- **Installation types** mapped to the IEC reference methods (A1 … F): embedded in masonry, conduit, surface trunking,
  hollow or insulated walls, wooden moulding or furniture, clipped on wall, floor screed, buried, cable tray, or manual choice.
- **Temperatures**: maximum ambient + safety margin (K) → design ambient used for all thermal calculations;
  resistivity at the insulation's maximum temperature (or a chosen temperature, or the IEC 1.25 × ρ20 convention).
- **Results**: table of required and standard sections per criterion, governing criterion highlighted, actual voltage
  drop and losses, estimated conductor temperature, maximum length, skin-effect check, warnings.
- **Ampacity tables**: 72 tables (Cu/Al, PVC/XLPE, methods A1–F, 2 or 3 loaded conductors), editable per table,
  restore to standard values, JSON export/import.
- English / French interface, decimal point or comma accepted, light/dark theme, "Copy results" as text,
  settings remembered in the browser.

## Quick start

1. Download or clone the repository.
2. Open `index.html` in a browser (double-click). Nothing to install.
3. Optional: open `index.html?test` to run the self-tests (results in the browser console and in a banner).

**Cable length**: enter the length of the cable (one way). The return conductor is included by the formulas
(×2 in DC and single-phase, ×√3 in balanced three-phase).

## Files

| File | Role |
|---|---|
| `index.html` | Page, styles and logic |
| `i18n.js` | All displayed texts (English, French) |
| `iz-data.js` | Standard ampacity values (optional: without it the Iz tables are empty) |
| `grouping-data.js` | IEC grouping factors kept for a future version (not used by the app yet) |
| `FSD.md`, `JOURNAL.md` | Internal functional specification and change log (French) |

The three app files (`index.html`, `i18n.js`, `iz-data.js`) must stay in the same folder.

## Main formulas

Units: mm², m, A, V, Ω·mm²/m. b = 2 (DC, single-phase) or √3 (three-phase); n = 2 or 3 loaded conductors.

| Criterion | Required section |
|---|---|
| Voltage drop | S = b·ρ·L·I·cos φ / (ΔUmax − b·L·I·x·sin φ) |
| Power loss | S = n·ρ·L·I² / Pmax |
| Short-circuit | S = Isc·√t / k |
| Heating (model) | S = (I²·ρ / (2·√π·h·ΔT·10⁻³))^(2/3) |
| Ampacity | smallest S with Iz × kθ × grouping ≥ I, kθ = √((θmax − θcalc)/(θmax − θref)) |

The detailed specification is in [FSD.md](FSD.md) (French).

## Data sources

- Ampacity: IEC 60364-5-52:2009 Annex B, Tables B.52.2–B.52.5 and B.52.10–B.52.13 (reference 30 °C in air,
  20 °C in ground). Values transcribed from two independent reproductions of the standard and cross-checked cell by cell
  (data of 2026-10-06). The data version is shown in the app and in the copied results.
- Short-circuit factors k: 115 / 143 / 76 / 94 (Cu-PVC / Cu-XLPE / Al-PVC / Al-XLPE), 103 / 68 for PVC above 300 mm².

## Limitations

- The grouping factor is entered manually.
- The extra derating for cables in contact with thermal insulation (down to 0.5) is only flagged, not applied.
- "Inside wooden furniture" is not listed in the standard: method A1/A2 is a conservative assumption.
- AC resistance is taken equal to the DC resistance (skin effect is only flagged).
- No fault-loop (protection of persons) verification.

## Deployment

The app is static: publish `index.html`, `i18n.js` and `iz-data.js` on any web host.
With Vercel, import the GitHub repository (Framework preset: *Other*, no build command); every push redeploys.
The `.vercelignore` file publishes only the app files.
