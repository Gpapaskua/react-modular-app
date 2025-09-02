export const INPUT_ROUTES = {
  GENERAL: "general",
  CONSUMPTION: "consumption",
  PIPES: "pipes",
  CHEMISTRY: "chemistry",
  REUSE: "reuse",
};

export const tabRoutes = [
  { value: INPUT_ROUTES.GENERAL, label: "General", path: "/inputs/general" },
  {
    value: INPUT_ROUTES.CONSUMPTION,
    label: "Consumption",
    path: "/inputs/consumption",
  },
  { value: INPUT_ROUTES.PIPES, label: "Pipes", path: "/inputs/pipes" },
  {
    value: INPUT_ROUTES.CHEMISTRY,
    label: "Chemistry",
    path: "/inputs/chemistry",
  },
  { value: INPUT_ROUTES.REUSE, label: "Reuse", path: "/inputs/reuse" },
];
