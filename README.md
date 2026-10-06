# Cable Sizer

*[Version française](README.fr.md)*

**Live app: https://conducteur-section.vercel.app/** · **Full manual: [docs/MANUAL.en.md](docs/MANUAL.en.md)**

Single-page web app that sizes the cross-section of an electrical conductor from several criteria and selects the
smallest standard section (IEC 60228) that satisfies all of them. Plain HTML/CSS/JavaScript: no dependency, no build,
works offline by double-clicking `index.html`, and can be hosted as-is on any static host.

> [!WARNING]
> ## ⚠️ Disclaimer — no warranty
> The values and results given by Cable Sizer are **indicative only and are NOT guaranteed**. They may contain
> errors (data transcription, simplified models, assumptions) and do not replace the applicable standards
> (RGIE, NF C 15-100, IEC 60364) nor the study of a qualified professional.
>
> **You must verify every result. You remain solely and fully responsible for the use of this tool and for any
> installation carried out with it.** The author accepts no liability for any damage resulting from its use.

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
| `docs/MANUAL.en.md`, `docs/MANUEL.fr.md` | User and technical manual (English, French) |
| `FSD.md`, `JOURNAL.md` | Internal functional specification and change log (French) |

The three app files (`index.html`, `i18n.js`, `iz-data.js`) must stay in the same folder.

## Parameters

Every parameter marked **ⓘ** in the app shows an explanation on hover (tap on a phone). Summary below; the
[manual](docs/MANUAL.en.md) gives the full technical detail, worked examples and the meaning of every warning.

### System & load
| Parameter | Explanation |
|---|---|
| System | DC (2 conductors, b = 2), AC single-phase (phase + neutral, b = 2), AC three-phase balanced (b = √3, no neutral current, enter the line-to-line voltage). |
| Voltage U | DC voltage, 230 V phase-neutral in single-phase, 400 V line-to-line in three-phase. Reference for the voltage drop in %. |
| Current / Power | Design current Ib, or active power P converted to current: I = P/U (DC), P/(U·cos φ) (1~), P/(√3·U·cos φ) (3~). |
| cos φ | Active / apparent power: 1 for heating, 0.8–0.9 for motors. Converts P to I and weights resistance (cos φ) vs reactance (sin φ) in the voltage drop. |

### Line
| Parameter | Explanation |
|---|---|
| Cable length (one way) | Length of the cable, not doubled: the return conductor is included by the formulas (×2 or ×√3). |
| Reactance x | About 0.08 mΩ/m for cables. Independent of the section: on long, heavily loaded AC lines the reactive drop b·L·I·x·sin φ alone can exceed the limit, then no section works. |
| Frequency f | 50 Hz. Skin depth δ = √(ρ/(π·f·μ0)) ≈ 9.3 mm for copper at 20 °C; a warning appears when the conductor radius exceeds δ. |

### Installation
| Parameter | Explanation |
|---|---|
| Installation type | Mapped to the IEC 60364-5-52 reference method: A (thermally insulated wall, wooden moulding/furniture), B (conduit, trunking, hollow wall, floor screed), C (clipped on wall, embedded in masonry), D1/D2 (buried in duct / direct), E/F (free air on perforated tray). The worse the heat dissipation, the lower Iz (about ×1.5 between A and E). |
| Cable type | Multicore (common sheath, e.g. 3G2.5) or single-core (separate conductors in conduit, single-core cables): A1/A2, B1/B2, F/E. Unsheathed conductors must be in conduit or trunking. |
| Max ambient | Highest air temperature in service (soil temperature for D1/D2), not during laying. Tables are for 30 °C air / 20 °C ground. |
| Safety margin (K) | Added to the ambient for all thermal calculations: θcalc = θamb,max + margin (5–10 K is common). |
| Grouping factor | Derating when several loaded circuits run together. Bunched (IEC B.52.17): 2 → 0.80, 3 → 0.70, 4 → 0.65, 6 → 0.57, 9 → 0.50, 20 → 0.38. Count circuits, not conductors. Entered manually. |
| kθ | Ambient correction √((θmax − θcalc)/(θmax − θref)), θref = 30 °C (air) or 20 °C (ground); blank = automatic, or impose a table value. |

### Conductor
| Parameter | Explanation |
|---|---|
| Material | Copper ρ20 = 0.017241 Ω·mm²/m, α = 0.00393 /K; aluminium 0.028264, 0.00403 (≈1.64 × more resistive). |
| Insulation / θmax | PVC 70 °C (160 °C short-circuit), XLPE/EPR 90 °C (250 °C), XLPE carries about 20–30 % more current. |
| Resistivity mode | At θmax (default, worst case for sizing), at a manual temperature, or IEC convention 1.25 × ρ20. ρ(T) = ρ20·(1 + α·(T − 20)): copper +19.7 % at 70 °C. |

### Criteria
| Criterion | Explanation |
|---|---|
| Voltage drop | S = b·ρ·L·I·cos φ / (ΔUmax − b·L·I·x·sin φ). Typical limits (NF C 15-100): 3 % lighting, 5 % other uses. |
| Power loss | S = n·ρ·L·I² / Pmax (n = 2 or 3 loaded conductors); limit in W or % of the transmitted power. |
| Ampacity | Normative: smallest section with Iz × kθ × grouping ≥ I, from the IEC table of the reference method. |
| Heating (model) | Heat balance of a bare conductor in free air, h ≈ 10 W/m²·K; estimate, optimistic outside free air (disabled by default). |
| Short-circuit | Adiabatic: S ≥ Isc·√t / k, t ≤ 5 s; k = 115 / 143 / 76 / 94 (Cu-PVC / Cu-XLPE / Al-PVC / Al-XLPE). |
| Protection | Coordination I ≤ In ≤ Iz × kθ × grouping. |

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

---

> [!WARNING]
> ## ⚠️ Disclaimer — no warranty
> The values and results given by Cable Sizer are **indicative only and are NOT guaranteed**. They may contain
> errors (data transcription, simplified models, assumptions) and do not replace the applicable standards
> (RGIE, NF C 15-100, IEC 60364) nor the study of a qualified professional.
>
> **You must verify every result. You remain solely and fully responsible for the use of this tool and for any
> installation carried out with it.** The author accepts no liability for any damage resulting from its use.
