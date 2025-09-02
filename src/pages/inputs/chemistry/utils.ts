import { ALARM_STATUSES } from "@/lib/constants";

// Randmly return status field to populate alarm cell
export function determineAlarmStatus() {
  const statusStyles = {
    Normal: "text-green-600",
    Low: "text-yellow-500",
    High: "text-orange-500",
    "Critical High": "text-red-600 animate-pulse",
  };

  const randomIndex = Math.floor(Math.random() * ALARM_STATUSES.length);
  const status = ALARM_STATUSES[randomIndex];

  return {
    status: status,
    colorClass: statusStyles[status],
  };
}
