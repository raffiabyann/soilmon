/**
 * Single coherent icon system (SPEC §19, §32.15).
 * ONLY lucide-react. Domain: IoT / soil-monitoring / agricultural technology.
 */
import {
  Wifi,
  Thermometer,
  Droplet,
  FlaskConical,
  Battery,
  SignalHigh,
  TriangleAlert,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Settings,
  LayoutDashboard,
  History,
  LineChart,
  FileText,
  Sun,
  Moon,
  RefreshCw,
  Leaf,
  Database,
  Clock,
  Clock4,
  Activity,
  Info,
  Cpu,
  Bell,
  ShieldCheck,
  BarChart2,
  type LucideIcon,
} from "lucide-react";

export const icons = {
  // Telemetry / sensor
  gateway:      Wifi,          // spec: WiFi icon for Gateway Status
  wifi:         Wifi,
  temperature:  Thermometer,
  moisture:     Droplet,
  ph:           FlaskConical,
  battery:      Battery,
  signal:       SignalHigh,
  // KPI cards
  database:      Database,
  trendUp:       TrendingUp,
  trendArrowUp:  ArrowUpRight,   // KPI trend direction — up
  trendDown:     ArrowDownRight, // KPI trend indicator — down
  trendFlat:     Minus,          // KPI trend indicator — flat
  chart:        LineChart,
  activity:     Activity,
  clock:        Clock,
  clock4:       Clock4,        // spec: clock/jam icon for Uptime (purple)
  barChart:     BarChart2,     // spec: bar-chart small icon on Data Received
  // Alerts / info
  alert:        TriangleAlert,
  bell:         Bell,          // spec: Bell icon for Alerts nav + Recent Alerts header
  info:         Info,          // spec: Info(i) for System Information header
  shieldCheck:  ShieldCheck,   // spec: Shield/Check for Firmware row
  // System
  node:         Cpu,          // IoT sensor/device icon for Node cards (blue)
  // Navigation
  dashboard:    LayoutDashboard,
  history:      History,
  lineChart:    LineChart,     // spec: Line Chart icon for Data History nav
  reports:      FileText,
  settings:     Settings,
  // Brand
  brand:        Leaf,
  // Shell
  themeLight:   Sun,
  themeDark:    Moon,
  autoRefresh:  RefreshCw,
  // Power monitoring (solar panel / battery system)
  solar:        Sun,          // solar panel / power source
} satisfies Record<string, LucideIcon>;

export type { LucideIcon };
