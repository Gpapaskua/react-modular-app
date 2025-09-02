export const PARAMETER_OPTIONS = [
  {
    label: "IONs",
    options: [
      {
        value: 'phos',
        label: "Phosphate (PO4-X)",
        defaultValue: 0,
        units: "mg/L",
      },
    ],
  },
  {
    label: "Other Parameters",
    options: [
      {
        value: 'tp',
        label: "Total Phosphorus (TP)",
        defaultValue: 0,
        units: "mg/L",
      },
      {
        value: 'tsi',
        label: "Total Silica (TSi)",
        defaultValue: 0,
        units: "mg/L",
      },
      {
        value: 'tss',
        label: "Total Suspended Solids (TSS)",
        defaultValue: 0,
        units: "mg/L",
      },
    ],
  },
];

export const ALARM_STATUSES = [
  "Normal",
  "Low",
  "High",
  "Critical High",
] as const;
