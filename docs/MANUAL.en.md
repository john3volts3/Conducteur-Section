# Cable Sizer — User and technical manual

*[Version française](MANUEL.fr.md) · [README](../README.md)*

Live app: https://conducteur-section.vercel.app/

> [!WARNING]
> ## ⚠️ Disclaimer — no warranty
> The values and results given by Cable Sizer are **indicative only and are NOT guaranteed**. They may contain
> errors (data transcription, simplified models, assumptions) and do not replace the applicable standards
> (RGIE, NF C 15-100, IEC 60364) nor the study of a qualified professional.
>
> **You must verify every result. You remain solely and fully responsible for the use of this tool and for any
> installation carried out with it.** The author accepts no liability for any damage resulting from its use.

## Contents

1. [Principle](#1-principle)
2. [Quick start](#2-quick-start)
3. [Interface](#3-interface)
4. [Parameters](#4-parameters)
5. [Criteria](#5-criteria)
6. [Results](#6-results)
7. [Ampacity tables](#7-ampacity-tables)
8. [Warnings](#8-warnings)
9. [Worked examples](#9-worked-examples)
10. [Limitations](#10-limitations)
11. [References and glossary](#11-references-and-glossary)

---

## 1. Principle

A conductor must satisfy several independent requirements at the same time:

- carry its current **without overheating** its insulation (ampacity);
- deliver an acceptable **voltage** at the load (voltage drop);
- waste an acceptable amount of **energy** (power loss);
- **withstand a short-circuit** until the protection trips;
- be **protected** by its circuit breaker or fuse (coordination I ≤ In ≤ Iz).

For each enabled criterion, Cable Sizer computes the **required section** (exact value in mm²), rounds it up to the
next **standard section** of IEC 60228, then keeps the **largest** of these standard sections. The criterion that
gives this section is the **governing criterion**. The result is recomputed on every keystroke.

Standard sections (mm²): 0.5 · 0.75 · 1 · 1.5 · 2.5 · 4 · 6 · 10 · 16 · 25 · 35 · 50 · 70 · 95 · 120 · 150 · 185 ·
240 · 300 · 400 · 500 · 630. Above 630 mm², parallel conductors must be considered (not computed by the app).

## 2. Quick start

1. Choose the **system** (DC, single-phase, three-phase) and enter the **voltage** and the **current** (or the power).
2. Enter the **cable length** (one way).
3. Describe the **installation**: installation type, cable type, maximum ambient temperature.
4. Choose the **conductor** (copper / aluminium) and the **insulation** (PVC / XLPE).
5. Enable the **criteria** you need and set their limits.
6. Read the recommended section, the governing criterion and the warnings in the results panel.

Every label marked with **ⓘ** shows an explanation when hovered (or tapped on a phone).

## 3. Interface

| Element | Role |
|---|---|
| Language button | Switches English / French. Numbers are displayed with the decimal separator of the language. |
| Theme button | Auto (follows the system), light, dark. |
| Copy results | Copies a complete text report (inputs, criteria table, result, summary, warnings, data version). |
| Reset | Restores the default parameters. Custom ampacity tables are kept. |
| Results panel | Recommended section, criteria table, summary of the selected section, warnings. On a phone, a bar at the bottom shows the section and scrolls to the results. |

**Number input**: decimal point or comma are both accepted, whatever the language (`6.25` = `6,25`). There is no
thousands separator: `1,500` is read as 1.5. Scientific notation is accepted (`1e-3`). An invalid value is outlined in
red with a message, and the results are replaced by "Invalid inputs".

**Memory**: all parameters, the language and the theme are saved in the browser (localStorage). They are not shared
between browsers or computers. In a private window, nothing is kept.

## 4. Parameters

### 4.1 System & load

#### System
- **DC**: two conductors (go and return). Factor b = 2 for the voltage drop, n = 2 loaded conductors.
- **AC single-phase**: phase + neutral, same factors as DC, plus the power factor and the reactance.
- **AC three-phase**: balanced load, no current in the neutral. b = √3 (voltage drop between phases), n = 3.
  The voltage to enter is the **line-to-line** voltage (e.g. 400 V).

#### Voltage U (V)
Nominal voltage of the circuit: DC voltage, phase-to-neutral voltage in single-phase (230 V), line-to-line voltage in
three-phase (400 V). Used to convert power into current and to express the voltage drop in %.

#### Load given as — Current I (A) / Active power P (W)
- **Current**: the design current Ib of the circuit (the current the load actually absorbs).
- **Power**: active power in watts; the current is derived:
  - DC: I = P / U
  - single-phase: I = P / (U · cos φ)
  - three-phase: I = P / (√3 · U · cos φ)

The design current and the corresponding power are shown under the card ("Design current"). The power is also the
reference for the power loss in %.

#### Power factor cos φ (AC only)
Ratio of active power to apparent power, 0 < cos φ ≤ 1. Typical values: 1 for heating and incandescent lighting,
0.95–1 for electronic loads with PFC, 0.8–0.9 for motors at full load (lower at partial load). It acts twice:
- in the conversion P → I (a lower cos φ means more current for the same power);
- in the voltage drop, where it weights the resistive part (cos φ) and the reactive part (sin φ).

### 4.2 Line

#### Cable length, one way (m)
Length of the **cable** between the origin and the load. Do **not** double it: the formulas include the return
conductor (×2 in DC and single-phase, ×√3 in three-phase). Example: a two-core cable of 1 m → enter 1 m.

#### Reactance x (mΩ/m, AC only)
Inductive reactance per metre of line, due to the magnetic field between conductors. The usual value for cables is
**0.08 mΩ/m** (IEC / RGIE / NF C 15-100 convention); single-core cables spaced apart can reach 0.1–0.15 mΩ/m.
The reactive term b·L·I·x·sin φ is independent of the section: for large sections and long lines it can dominate,
and if it alone exceeds the allowed voltage drop, **no section** can satisfy the criterion (see §5.1).

#### Frequency f (Hz, AC only)
Network frequency, 50 Hz in Europe. Only used for the **skin effect** check: the skin depth
δ = √(ρ / (π · f · μ0)) (ρ in Ω·m) is compared with the conductor radius r = √(S/π). At 50 Hz, δ ≈ 9.3 mm for copper
at 20 °C, about 10 mm at 70 °C: the effect only matters for very large sections or high frequencies.

### 4.3 Installation

#### Installation type
Describes how the cable is laid. Each type is mapped to an **IEC 60364-5-52 reference method** (Table B.52.3),
which selects the ampacity table:

| Installation type | Single-core | Multicore | Notes |
|---|---|---|---|
| Embedded directly in masonry (no conduit) | C | C | Sheathed cable required |
| In conduit embedded in masonry / concrete | B1 | B2 | |
| Surface trunking on wall (e.g. Legrand DLP) | B1 | B2 | |
| Hollow partition, not insulated (plasterboard) | B1 | B2 | Conservative choice for small voids |
| Thermally insulated wall (plasterboard + wool) | A1 | A2 | Extra derating possible (see §8) |
| Wooden moulding, skirting or enclosure | A1 | A2 | |
| Inside wooden furniture | A1 | A2 | Not in the standard: conservative assumption |
| Clipped direct on wall or ceiling | C | C | Sheathed cable required |
| In conduit in floor screed | B1 | B2 | |
| Buried in ground, in duct | D1 | D1 | Reference 20 °C, soil 2.5 K·m/W |
| Buried directly in ground | D2 | D2 | Reference 20 °C, soil 2.5 K·m/W |
| Perforated cable tray, free air | F | E | F = single-core touching |
| Other — choose the reference method | manual | manual | |

Physically, the method expresses how easily the heat produced in the conductor escapes: free air (E, F) is the
best, a cable on a wall (C) is good, a conduit or trunking (B) traps air, a thermally insulated wall (A) is the worst.
For the same section, Iz can vary by a factor of about 1.5 between A and E.

#### Cable type
- **Multicore cable**: several insulated conductors under a common sheath (e.g. XVB, VVB, 3G2.5, 5G6).
- **Single-core**: separate insulated conductors (e.g. H07V-U/R wires in a conduit) or single-core cables.

It switches between the methods "1" and "2" (A1/A2, B1/B2) and between F and E. Insulated conductors **without a
sheath** must always run in a conduit or trunking: a warning is displayed for installations that require a sheathed cable.

#### Reference method (when the installation type is "Other")
- **A1**: insulated conductors in conduit in a thermally insulated wall.
- **A2**: multicore cable in conduit in a thermally insulated wall.
- **B1**: insulated conductors in conduit or trunking on a wall.
- **B2**: multicore cable in conduit or trunking on a wall.
- **C**: cable clipped direct on a wall (or embedded directly in masonry).
- **D1**: cable in a duct in the ground. **D2**: cable directly in the ground.
- **E**: multicore cable in free air (perforated tray, ≥ 0.3 × diameter from the wall).
- **F**: single-core cables touching in free air (F with 2 loaded conductors = flat touching, 3 = trefoil).

The panel shows the method in use, the number of loaded conductors (2 in DC and single-phase, 3 in three-phase) and
the reference temperature.

#### Max ambient temperature θamb,max (°C)
Highest temperature of the medium around the cable **during operation**: air for methods A to F, **soil** for D1 and
D2. It is not the temperature during the laying of the cable. Think of attics, boiler rooms, sunny façades, cable
runs near heating pipes. Iz tables are given for 30 °C in air and 20 °C in ground.

#### Safety margin (K)
Value added to the maximum ambient for **all thermal calculations**:
θcalc = θamb,max + margin. It covers hot spots, uncertain conditions or ageing. 0 K = no margin; 5–10 K is common.
θcalc must stay below θmax, otherwise an error is shown.

#### Grouping factor
Reduction factor applied to Iz when several **loaded circuits** run together (same trunking, conduit, tray, bunch):
each cable heats its neighbours, so each one must carry less current. 1 = single circuit.

IEC 60364-5-52 Table B.52.17, bunched in air, on a surface, embedded or enclosed (methods A to F):

| Circuits | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 12 | 16 | 20 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Factor | 1.00 | 0.80 | 0.70 | 0.65 | 0.60 | 0.57 | 0.54 | 0.52 | 0.50 | 0.45 | 0.41 | 0.38 |

Single layer on a wall or unperforated tray (C): 1.00, 0.85, 0.79, 0.75, 0.73, 0.72, 0.72, 0.71, 0.70 (1 to 9
circuits, no further reduction above 9). Perforated tray (E, F): 1.00, 0.88, 0.82, 0.77, 0.75, 0.73, 0.73, 0.72, 0.72.
Buried cables use other tables (B.52.18, B.52.19) depending on the spacing.

Rules: count **circuits**, not conductors (a 3G2.5 cable = 1 circuit); a circuit loaded below 30 % of its grouped Iz
may be ignored. The field is entered manually; the full tables are available in `grouping-data.js`.

#### Temperature factor kθ (blank = auto)
Correction of Iz for an ambient different from the reference:

kθ = √((θmax − θcalc) / (θmax − θref)), with θref = 30 °C (air) or 20 °C (ground).

Example: PVC (θmax 70 °C), θcalc = 40 °C → kθ = √(30/40) = 0.866. The formula reproduces the IEC correction tables
(B.52.14 / B.52.15) within about 1 %. Enter a value to impose a factor read from the tables instead.

The **total factor** kθ × grouping is shown under the card and applied to every Iz.

### 4.4 Conductor

#### Material
- **Copper**: ρ20 = 0.017241 Ω·mm²/m, α = 0.00393 /K.
- **Aluminium**: ρ20 = 0.028264 Ω·mm²/m, α = 0.00403 /K. About 1.64 × more resistive: for the same current, roughly
  one standard section larger. Aluminium ampacity tables start at 2.5 or 16 mm².

Changing the material resets ρ20 and α to the values above.

#### Insulation
- **PVC**: θmax = 70 °C in continuous service, 160 °C at the end of a short-circuit (140 °C above 300 mm²).
- **XLPE / EPR** (cross-linked polyethylene, ethylene-propylene rubber; "PR" in French standards): θmax = 90 °C,
  250 °C in short-circuit. Higher ampacity (about +20 to +30 %).

#### Max conductor temperature θmax (°C)
Maximum continuous temperature allowed by the insulation, set automatically (70 / 90 °C). It is used for kθ, the
heating model, the temperature checks and, by default, the resistivity.

#### Resistivity mode
- **At θmax of insulation (auto)** — default: ρ = ρ(θmax). Worst case, the conductor is supposed to be at its maximum
  temperature: gives the largest voltage drop and losses, which is the right assumption for sizing.
- **At conductor temperature (manual)**: ρ = ρ(T) with your temperature (e.g. to evaluate losses at partial load).
- **IEC convention (1.25 × ρ20)**: conventional value used by some standards for voltage drop calculations
  (e.g. 1.25 × 0.018 = 0.0225 for copper with ρ20 = 0.018).

Temperature law: ρ(T) = ρ20 · (1 + α · (T − 20)). Copper at 70 °C: 0.017241 × 1.1965 = 0.02063 Ω·mm²/m (+19.7 %).

#### ρ20 (Ω·mm²/m) and α (1/K)
Resistivity at 20 °C and its temperature coefficient (IEC 60228 values by default). They can be changed to use
conventional values of a national standard or of a manufacturer.

### 4.5 Criteria limits

| Parameter | Meaning |
|---|---|
| Voltage drop limit (V or %) | Maximum voltage drop between origin and load. In %, relative to U. Typical limits (NF C 15-100, supply from the public network): 3 % lighting, 5 % other uses; private LV substation: 6 % / 8 %. 12/24 V DC systems: often 2–3 %. |
| Power loss limit (W or %) | Maximum Joule losses in the cable. In %, relative to the transmitted active power P. |
| Heat transfer coefficient h (W/m²·K) | Heating model only. About 10 W/m²·K in still air (natural convection + radiation), 15–25 with ventilation. |
| Isc (A) | Prospective short-circuit current at the considered point (from the network operator, or computed from the source impedance). |
| Clearing time t (s) | Time for the protection to interrupt the short-circuit. The adiabatic formula is valid up to 5 s. |
| k (A·√s/mm²) | Material/insulation factor: 115 Cu-PVC, 143 Cu-XLPE, 76 Al-PVC, 94 Al-XLPE; 103 / 68 for PVC above 300 mm². "Auto k" selects it automatically. |
| In (A) | Rated current of the circuit breaker or fuse. |

## 5. Criteria

Notation: S section (mm²), L cable length (m), I design current (A), U voltage (V), ρ resistivity (Ω·mm²/m),
x reactance (Ω/m), b = 2 (DC, 1~) or √3 (3~), n = 2 (DC, 1~) or 3 (3~).

### 5.1 Maximum voltage drop
Voltage drop of a line: ΔU = b · L · I · (ρ · cos φ / S + x · sin φ). Solving for S:

S = b · ρ · L · I · cos φ / (ΔUmax − b · L · I · x · sin φ)

In DC, cos φ = 1 and sin φ = 0. If the denominator is ≤ 0, the reactive drop alone already exceeds the limit: the
criterion is impossible whatever the section (shorten the line, raise the voltage, use several circuits).

### 5.2 Maximum power loss
Joule losses: P = n · ρ · L · I² / S → S = n · ρ · L · I² / Pmax. Useful for efficiency (photovoltaics, long runs,
continuously loaded lines).

### 5.3 Ampacity (normative)
Corrected capacity: Iz' = Iz × kθ × grouping. The app keeps the smallest standard section of the table such that
Iz' ≥ I. Iz comes from the IEC 60364-5-52 table for the material, insulation, reference method and number of loaded
conductors (see §7). This is the reference criterion for the thermal sizing.

### 5.4 Heating (thermal model, estimate)
Steady-state heat balance of a **bare conductor alone in free air**: heat produced I²ρ/S equals heat exchanged with
the air h · π · D · ΔT, with D = 2√(S/π) (mm → ×10⁻³ m) and ΔT = θmax − θcalc:

S = (I² · ρ(θmax) / (2 · √π · h · ΔT · 10⁻³))^(2/3)

It ignores the thermal resistance of the insulation, the installation method and the neighbouring cables: it is
optimistic outside free air. It is disabled by default; use it for bare bars or as a cross-check.

### 5.5 Short-circuit withstand
Adiabatic heating during the fault (IEC 60364-4-43, 434.5.2): S ≥ Isc · √t / k.

k = K · √ln((β + θf) / (β + θi)) (IEC 60949), with K = 226 and β = 234.5 for copper, K = 148 and β = 228 for
aluminium, θi = θmax, θf = final short-circuit temperature. Copper/PVC 70 → 160 °C gives k = 115.0. The value of the
formula is shown under the criterion. When the selected section exceeds 300 mm² with PVC, k is lowered to 103 / 68.

### 5.6 Protection rating
Coordination of the cable and its protection: **I ≤ In ≤ Iz'**. The app keeps the smallest section with Iz' ≥ In
and flags I > In. (The additional condition I2 ≤ 1.45 Iz of IEC 60364-4-43 is met by standard circuit breakers.)

## 6. Results

### Criteria table
| Column | Meaning |
|---|---|
| Criterion | Name of the criterion, with a note (limit used, corrected Iz, k…). |
| Required | Exact section computed by the formula, before rounding ("table" for ampacity and protection, which read the table directly). |
| Standard | Required section rounded up to the next IEC 60228 standard section. |
| Status | OK, Error (impossible or above 630 mm²), No data (empty table), Fail (I > In), Governing (sets the result). |

### Selected section (summary)
| Line | Computation |
|---|---|
| Voltage drop | ΔU = b · L · I · (ρ · cos φ / S + x · sin φ), in V and % of U. |
| Power loss | P = n · ρ · L · I² / S, in W and % of the transmitted power. |
| Est. conductor temperature | From the table: θ = θcalc + (θmax − θcalc) · (I / Iz')². Without table: heat-balance model solved with ρ(θ). |
| Max length | Longest line meeting the voltage-drop and/or power-loss limits with the selected section: L = ΔUmax / (b · I · (ρ cos φ / S + x sin φ)) and L = Pmax · S / (n · ρ · I²). The smallest one is displayed. |
| Iz' at selected section | When the protection criterion is enabled. |
| Skin depth δ / radius | AC only; a warning appears when the radius exceeds δ. |
| Design current, resistivity ρ | Values actually used. |

## 7. Ampacity tables

- One table per **material – insulation – reference method – loaded conductors** (e.g. `cu-pvc-B2-2`), 72 in total.
- Standard values: **IEC 60364-5-52:2009 Annex B**, Tables B.52.2 to B.52.5 (methods A1 to D2) and B.52.10 to
  B.52.13 (E, F). Reference conditions: 30 °C in air, 20 °C in ground, soil thermal resistivity 2.5 K·m/W.
  Transcribed from two independent reproductions of the standard and cross-checked cell by cell (data of 2026-10-06).
- Some cells are empty in the standard: aluminium D2 below 16 mm², method F below 25 mm². A note is shown when the
  selected section is the first of its table.
- **Editing**: open "Ampacity table Iz", change a value → a custom copy of the table is created and saved in the
  browser. "Restore standard values" deletes the copy. "Clear this table" empties it (two clicks to confirm).
- **Export JSON**: downloads all effective tables (standard + custom). **Import JSON**: loads tables as custom tables.
  Format:

```json
{
  "cu-pvc-C-2": { "1.5": 19.5, "2.5": 27, "4": 36 },
  "al-xlpe-E-3": { "16": 77, "25": 97 }
}
```

Keys: material `cu`/`al`, insulation `pvc`/`xlpe`, method `A1 A2 B1 B2 C D1 D2 E F`, loaded conductors `2`/`3`.

## 8. Warnings

| Warning | Meaning / action |
|---|---|
| Reactive drop alone exceeds the limit | No section can meet the voltage drop: shorten the line, raise the voltage or the limit. |
| Above 630 mm² | Consider parallel conductors. |
| Iz table is empty | The ampacity / protection criterion is skipped: fill or restore the table. |
| Design current exceeds In / In > Iz' | Protection coordination not met: change In or the section. |
| Estimated temperature exceeds θmax | The selected section overheats under the stated conditions. |
| Skin effect | The AC resistance is higher than the DC value used: consider an extra margin. |
| Thermally insulated wall | Cable in contact with thermal insulation over a length: extra factor down to 0.5 (IEC 60364-5-52, 523.9), not applied. |
| Sheathed cable required | Insulated conductors without sheath must be run in conduit or trunking. |
| Heating model / free air | The thermal model is optimistic outside methods E and F. |
| Installation not in the standard | "Inside wooden furniture": method A1/A2 is an assumption. |
| Table starts at … | Smaller sections are not covered by the standard for this method (e.g. F from 25 mm²). |
| Ampacity from standard values | Reminder of the source and version of the data. |

## 9. Worked examples

### 9.1 DC 12 V, 10 A, 5 m, ΔU 3 %
Inputs: DC, 12 V, 10 A, 5 m, copper, resistivity "IEC convention" with ρ20 = 0.018 (ρ = 0.0225), voltage drop 3 %.
ΔUmax = 0.36 V → S = 2 × 0.0225 × 5 × 10 / 0.36 = **6.25 mm² → 10 mm²**. Actual drop with 10 mm²:
2 × 0.0225 × 5 × 10 / 10 = 0.225 V (1.9 %).

### 9.2 Single-phase 230 V, 16 A, 20 m (default parameters)
Copper PVC clipped on wall (method C, 2 loaded conductors), 30 °C, ρ at 70 °C = 0.02063, cos φ 0.9, x 0.08 mΩ/m.
- Voltage drop 3 % (6.9 V): required 1.73 mm² → 2.5 mm².
- Power loss 2 % of 3312 W (66.2 W): required 3.19 mm² → **4 mm² (governing)**.
- Ampacity: 1.5 mm² (Iz = 19.5 A ≥ 16 A).
Result **4 mm²**: ΔU = 2.99 V (1.3 %), losses 52.8 W (1.6 %), conductor at about 38 °C, max length 25 m (losses).

### 9.3 Three-phase 400 V, 40 A, 30 m in an insulated wall
Multicore copper PVC cable in a thermally insulated wall (method A2, 3 loaded conductors), ambient 35 °C + 5 K
margin, 2 circuits bunched (grouping 0.80), protection 40 A.
kθ = √((70 − 40)/(70 − 30)) = 0.866; total factor 0.693.
- 16 mm²: Iz = 52 A → Iz' = 36.0 A < 40 A. 25 mm²: Iz = 68 A → Iz' = 47.1 A ≥ 40 A.
- Voltage drop 3 % (12 V): 3.06 mm² → 4 mm².
Result **25 mm²**, governed by the ampacity (the thermal environment, not the length, sizes this cable).

## 10. Limitations

- Indicative tool; the national standard prevails (RGIE, NF C 15-100…).
- Grouping factor entered manually; extra derating for contact with thermal insulation only flagged.
- Soil thermal resistivity fixed at 2.5 K·m/W for D1/D2 (no correction for other soils).
- AC resistance taken equal to the DC resistance; proximity effect ignored.
- No fault-loop verification (protection of persons, maximum length for indirect contact).
- No harmonic correction (neutral loaded by 3rd harmonics in three-phase).
- No parallel conductors above 630 mm².

## 11. References and glossary

- IEC 60364-5-52:2009 — Selection and erection of electrical equipment — Wiring systems (Annex B: current-carrying capacities).
- IEC 60364-4-43 — Protection against overcurrent.
- IEC 60228 — Conductors of insulated cables (standard sections, resistances).
- IEC 60949 — Calculation of thermally permissible short-circuit currents (factor k).
- RGIE (Belgium), NF C 15-100 (France).

| Term | Definition |
|---|---|
| Ib / I | Design current of the circuit. |
| Iz | Current-carrying capacity of the cable (ampacity) in reference conditions; Iz' after corrections. |
| In | Rated current of the protective device. |
| θmax | Maximum continuous conductor temperature allowed by the insulation. |
| θcalc | Design ambient = maximum ambient + safety margin. |
| Loaded conductors | Conductors carrying the current: 2 in DC/single-phase, 3 in balanced three-phase. |
| Reference method | Standardised installation condition of IEC 60364-5-52 (A1 … G). |

---

> [!WARNING]
> ## ⚠️ Disclaimer — no warranty
> The values and results given by Cable Sizer are **indicative only and are NOT guaranteed**. They may contain
> errors (data transcription, simplified models, assumptions) and do not replace the applicable standards
> (RGIE, NF C 15-100, IEC 60364) nor the study of a qualified professional.
>
> **You must verify every result. You remain solely and fully responsible for the use of this tool and for any
> installation carried out with it.** The author accepts no liability for any damage resulting from its use.
