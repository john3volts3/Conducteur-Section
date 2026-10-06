'use strict';
// Grouping (reduction) factors from IEC 60364-5-52:2009 Annex B, Tables B.52.17, B.52.18 and B.52.19.
// NOT USED by the app yet: the grouping factor is entered manually. Kept for a possible future evolution.
// Cross-checked cell by cell in two independent sources (Top Cable reproduction of IEC 60364-5-52 Ed.3,
// ABB Electrical installation handbook Vol. 2, 4th ed.); all cells agree.
// Keys = number of circuits or multicore cables. Rules decided with the user (2026-10-06):
// - B.52.17 bunched: counts not tabulated (10, 11, 13-15, 17-19) use the next higher tabulated count (conservative).
// - B.52.17 other arrangements: no further reduction above 9 circuits (value at 9 applies, per the standard).
// - B.52.18 / B.52.19: only 2 to 6 circuits (values above 6 exist in a single source only, with a probable misprint).
const GROUPING_DEFAULTS = {
  source: 'IEC 60364-5-52:2009 Annex B',
  version: '2026-10-06',
  // B.52.17: arrangement -> circuits -> factor (bunched: methods A to F; single layers: C, E, F)
  inAir: {
    "bunched": {
      "1": 1,
      "2": 0.8,
      "3": 0.7,
      "4": 0.65,
      "5": 0.6,
      "6": 0.57,
      "7": 0.54,
      "8": 0.52,
      "9": 0.5,
      "12": 0.45,
      "16": 0.41,
      "20": 0.38
    },
    "wallSingleLayer": {
      "1": 1,
      "2": 0.85,
      "3": 0.79,
      "4": 0.75,
      "5": 0.73,
      "6": 0.72,
      "7": 0.72,
      "8": 0.71,
      "9": 0.7
    },
    "ceilingSingleLayer": {
      "1": 0.95,
      "2": 0.81,
      "3": 0.72,
      "4": 0.68,
      "5": 0.66,
      "6": 0.64,
      "7": 0.63,
      "8": 0.62,
      "9": 0.61
    },
    "perforatedTray": {
      "1": 1,
      "2": 0.88,
      "3": 0.82,
      "4": 0.77,
      "5": 0.75,
      "6": 0.73,
      "7": 0.73,
      "8": 0.72,
      "9": 0.72
    },
    "ladder": {
      "1": 1,
      "2": 0.87,
      "3": 0.82,
      "4": 0.8,
      "5": 0.8,
      "6": 0.79,
      "7": 0.79,
      "8": 0.78,
      "9": 0.78
    }
  },
  // B.52.18: cables directly in ground (D2), clearance between cables -> circuits -> factor
  directInGround: {
    "touching": {
      "2": 0.75,
      "3": 0.65,
      "4": 0.6,
      "5": 0.55,
      "6": 0.5
    },
    "oneDiameter": {
      "2": 0.8,
      "3": 0.7,
      "4": 0.6,
      "5": 0.55,
      "6": 0.55
    },
    "0.125": {
      "2": 0.85,
      "3": 0.75,
      "4": 0.7,
      "5": 0.65,
      "6": 0.6
    },
    "0.25": {
      "2": 0.9,
      "3": 0.8,
      "4": 0.75,
      "5": 0.7,
      "6": 0.7
    },
    "0.5": {
      "2": 0.9,
      "3": 0.85,
      "4": 0.8,
      "5": 0.8,
      "6": 0.8
    }
  },
  // B.52.19: cables in ducts in ground (D1), cable type -> clearance between ducts -> circuits -> factor
  inDuctsInGround: {
    "multicore": {
      "touching": {
        "2": 0.85,
        "3": 0.75,
        "4": 0.7,
        "5": 0.65,
        "6": 0.6
      },
      "0.25": {
        "2": 0.9,
        "3": 0.85,
        "4": 0.8,
        "5": 0.8,
        "6": 0.8
      },
      "0.5": {
        "2": 0.95,
        "3": 0.9,
        "4": 0.85,
        "5": 0.85,
        "6": 0.8
      },
      "1.0": {
        "2": 0.95,
        "3": 0.95,
        "4": 0.9,
        "5": 0.9,
        "6": 0.9
      }
    },
    "singleCore": {
      "touching": {
        "2": 0.8,
        "3": 0.7,
        "4": 0.65,
        "5": 0.6,
        "6": 0.6
      },
      "0.25": {
        "2": 0.9,
        "3": 0.8,
        "4": 0.75,
        "5": 0.7,
        "6": 0.7
      },
      "0.5": {
        "2": 0.9,
        "3": 0.85,
        "4": 0.8,
        "5": 0.8,
        "6": 0.8
      },
      "1.0": {
        "2": 0.95,
        "3": 0.9,
        "4": 0.9,
        "5": 0.9,
        "6": 0.9
      }
    }
  },
  footnotes: {
    "B.52.17": [
      "Arrangement column header: 'Arrangement (cables touching)'. Rows 2 to 5: 'No further reduction factor for more than nine circuits or multicore cables' (cells for 12, 16 and 20 are blank).",
      "NOTE 1 These factors are applicable to uniform groups of cables, equally loaded.",
      "NOTE 2 Where horizontal clearances between adjacent cables exceeds twice their overall diameter, no reduction factor need be applied.",
      "NOTE 3 The same factors are applied to: groups of two or three single-core cables; multi-core cables.",
      "NOTE 4 If a system consists of both two- and three-core cables, the total number of cables is taken as the number of circuits, and the corresponding factor is applied to the tables for two loaded conductors for the two-core cables, and to the tables for three loaded conductors for the three-core cables.",
      "NOTE 5 If a group consists of n single-core cables it may either be considered as n/2 circuits of two loaded conductors or n/3 circuits of three loaded conductors.",
      "NOTE 6 The values given have been averaged over the range of conductor sizes and types of installation included in Tables B.52.2 to B.52.13 the overall accuracy of tabulated values is within 5 %.",
      "NOTE 7 For some installations and for other methods not provided for in the above table, it may be appropriate to use factors calculated for specific cases, see for example Tables B.52.20 and B.52.21."
    ],
    "B.52.18": [
      "Title: Reduction factors for more than one circuit, cables laid directly in the ground - Installation method D2 in Tables B.52.2 to B.52.5 - Single-core or multi-core cables.",
      "a Cable to cable clearance 'a' (figures for multi-core cables and for single-core cables in flat / trefoil groups).",
      "NOTE 1 Values given apply to an installation depth of 0,7 m and a soil thermal resistivity of 2,5 K.m/W. They are average values for the range of cable sizes and types quoted for Tables B.52.2 to B.52.5. The process of averaging, together with rounding off, can result in some cases in errors up to +/-10 %. (Where more precise values are required they may be calculated by methods given in IEC 60287-2-1.)",
      "NOTE 2 In case of a thermal resistivity lower than 2,5 K.m/W the corrections factors can, in general, be increased and can be calculated by the methods given in IEC 60287-2-1.",
      "NOTE 3 If a circuit consists of m parallel conductors per phase, then for determining the reduction factor, this circuit should be considered as m circuits."
    ],
    "B.52.19": [
      "Title: Reduction factors for more than one circuit, cables laid in ducts in the ground - Installation method D1 in Tables B.52.2 to B.52.5. Part A) Multi-core cables in single-way ducts (rows = number of cables). Part B) Single-core cables in non-magnetic single-way ducts (rows = number of single-core circuits of two or three cables).",
      "a / b Duct to duct clearance 'a' (figures for multi-core cables and for single-core cables).",
      "NOTE 1 Values given apply to an installation depth of 0,7 m and a soil thermal resistivity of 2,5 K.m/W. They are average values for the range of cable sizes and types quoted for Tables B.52.2 to B.52.5. The process of averaging, together with rounding off, can result in some cases in errors up to +/-10 %. Where more precise values are required they may be calculated by methods given in the IEC 60287 series.",
      "NOTE 2 In case of a thermal resistivity lower than 2,5 K.m/W the corrections factors can, in general, be increased and can be calculated by the methods given in IEC 60287-2-1.",
      "NOTE 3 If a circuit consists of n parallel conductors per phase, then for determining the reduction factor this circuit shall be considered as n circuits."
    ]
  }
};
