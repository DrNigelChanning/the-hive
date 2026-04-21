import { useState, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine, AreaChart, Area, ComposedChart
} from "recharts";

// ─── COLORS ──────────────────────────────────────────────────────────────────
const COLORS = {
  "Costco":      "#3B82F6",
  "Kroger":      "#F87171",
  "Trader Joes": "#34D399",
  "Wal-Mart":    "#FBBF24",
};
const CUSTOMERS = ["Costco", "Kroger", "Trader Joes", "Wal-Mart"];

// ─── DATA ─────────────────────────────────────────────────────────────────────
const ALL_DATA = [
  // Jun 1-7, 2025
  { customer:"Costco",      dpc:2.95, dpl:0.08, ws:"2025-06-01", wl:"Jun 1–7",      inFull:7,  otif:92.86, status:"Done",        cases:2150,  cost:6350,     orders:7,  trucks:4,  weight:78045,      notes:"" },
  { customer:"Kroger",      dpc:1.42, dpl:0.10, ws:"2025-06-01", wl:"Jun 1–7",      inFull:1,  otif:100,   status:"Done",        cases:176,   cost:250,      orders:1,  trucks:1,  weight:2570.92,    notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-06-01", wl:"Jun 1–7",      inFull:9,  otif:94.44, status:"Done",        cases:1840,  cost:0,        orders:9,  trucks:7,  weight:22926.4,    notes:"" },
  // Jun 8-14, 2025
  { customer:"Costco",      dpc:4.38, dpl:0.12, ws:"2025-06-08", wl:"Jun 8–14",     inFull:6,  otif:91.67, status:"Done",        cases:1300,  cost:5700,     orders:6,  trucks:3,  weight:47494,      notes:"" },
  { customer:"Kroger",      dpc:1.12, dpl:0.08, ws:"2025-06-08", wl:"Jun 8–14",     inFull:1,  otif:100,   status:"Done",        cases:224,   cost:250,      orders:1,  trucks:1,  weight:3272.08,    notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-06-08", wl:"Jun 8–14",     inFull:11, otif:100,   status:"Done",        cases:1360,  cost:0,        orders:11, trucks:8,  weight:16945.6,    notes:"" },
  // Jun 15-21, 2025
  { customer:"Costco",      dpc:4.11, dpl:0.11, ws:"2025-06-15", wl:"Jun 15–21",    inFull:4,  otif:87.5,  status:"Done",        cases:950,   cost:3900,     orders:4,  trucks:3,  weight:34485,      notes:"" },
  { customer:"Kroger",      dpc:1.20, dpl:0.08, ws:"2025-06-15", wl:"Jun 15–21",    inFull:1,  otif:100,   status:"Done",        cases:208,   cost:250,      orders:1,  trucks:1,  weight:3038.36,    notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-06-15", wl:"Jun 15–21",    inFull:10, otif:100,   status:"Done",        cases:2160,  cost:0,        orders:10, trucks:7,  weight:26913.6,    notes:"" },
  // Jun 22-28, 2025
  { customer:"Costco",      dpc:4.16, dpl:0.11, ws:"2025-06-22", wl:"Jun 22–28",    inFull:5,  otif:70,    status:"Done",        cases:1300,  cost:5411.5,   orders:5,  trucks:2,  weight:47190,      notes:"" },
  { customer:"Kroger",      dpc:1.12, dpl:0.08, ws:"2025-06-22", wl:"Jun 22–28",    inFull:1,  otif:100,   status:"Done",        cases:224,   cost:250,      orders:1,  trucks:1,  weight:3272.08,    notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-06-22", wl:"Jun 22–28",    inFull:13, otif:96.15, status:"Done",        cases:1520,  cost:0,        orders:13, trucks:9,  weight:18939.2,    notes:"" },
  // Jun 29 – Jul 5, 2025
  { customer:"Costco",      dpc:5.63, dpl:0.16, ws:"2025-06-29", wl:"Jun 29–Jul 5", inFull:7,  otif:100,   status:"Done",        cases:1650,  cost:9295.93,  orders:7,  trucks:5,  weight:59895,      notes:"" },
  { customer:"Kroger",      dpc:1.12, dpl:0.08, ws:"2025-06-29", wl:"Jun 29–Jul 5", inFull:1,  otif:100,   status:"Done",        cases:224,   cost:250,      orders:1,  trucks:1,  weight:3272,       notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-06-29", wl:"Jun 29–Jul 5", inFull:9,  otif:100,   status:"Done",        cases:1440,  cost:0,        orders:9,  trucks:7,  weight:17942,      notes:"" },
  // Jul 6-12, 2025
  { customer:"Costco",      dpc:3.81, dpl:0.10, ws:"2025-07-06", wl:"Jul 6–12",     inFull:5,  otif:100,   status:"Done",        cases:1450,  cost:5520,     orders:5,  trucks:2,  weight:52635,      notes:"" },
  { customer:"Kroger",      dpc:1.42, dpl:0.10, ws:"2025-07-06", wl:"Jul 6–12",     inFull:1,  otif:100,   status:"Done",        cases:176,   cost:250,      orders:1,  trucks:1,  weight:2571,       notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-07-06", wl:"Jul 6–12",     inFull:14, otif:100,   status:"Done",        cases:2160,  cost:0,        orders:14, trucks:10, weight:26914,      notes:"" },
  // Jul 13-19, 2025
  { customer:"Costco",      dpc:4.44, dpl:0.12, ws:"2025-07-13", wl:"Jul 13–19",    inFull:7,  otif:100,   status:"Done",        cases:1700,  cost:7545,     orders:7,  trucks:4,  weight:61710,      notes:"" },
  { customer:"Kroger",      dpc:1.20, dpl:0.08, ws:"2025-07-13", wl:"Jul 13–19",    inFull:1,  otif:100,   status:"Done",        cases:208,   cost:250,      orders:1,  trucks:1,  weight:3038.36,    notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-07-13", wl:"Jul 13–19",    inFull:9,  otif:100,   status:"Done",        cases:1200,  cost:0,        orders:9,  trucks:4,  weight:14952,      notes:"" },
  // Jul 20-26, 2025
  { customer:"Costco",      dpc:5.77, dpl:0.16, ws:"2025-07-20", wl:"Jul 20–26",    inFull:8,  otif:100,   status:"Done",        cases:1320,  cost:7618.73,  orders:8,  trucks:4,  weight:47916,      notes:"" },
  { customer:"Kroger",      dpc:0.98, dpl:0.07, ws:"2025-07-20", wl:"Jul 20–26",    inFull:1,  otif:100,   status:"Done",        cases:256,   cost:250,      orders:1,  trucks:1,  weight:3739.52,    notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-07-20", wl:"Jul 20–26",    inFull:4,  otif:100,   status:"Done",        cases:480,   cost:0,        orders:4,  trucks:2,  weight:5980.8,     notes:"" },
  // Jul 27 – Aug 2, 2025
  { customer:"Costco",      dpc:5.07, dpl:0.14, ws:"2025-07-27", wl:"Jul 27–Aug 2", inFull:7,  otif:100,   status:"Done",        cases:1510,  cost:7651.33,  orders:7,  trucks:3,  weight:54813,      notes:"" },
  { customer:"Kroger",      dpc:1.95, dpl:0.13, ws:"2025-07-27", wl:"Jul 27–Aug 2", inFull:1,  otif:100,   status:"Done",        cases:128,   cost:250,      orders:1,  trucks:1,  weight:1869.76,    notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-07-27", wl:"Jul 27–Aug 2", inFull:6,  otif:100,   status:"Done",        cases:800,   cost:0,        orders:6,  trucks:3,  weight:9970,       notes:"" },
  // Aug 3-9, 2025
  { customer:"Costco",      dpc:3.93, dpl:0.11, ws:"2025-08-03", wl:"Aug 3–9",      inFull:8,  otif:87.5,  status:"Done",        cases:2050,  cost:8065,     orders:8,  trucks:4,  weight:74415,      notes:"" },
  { customer:"Kroger",      dpc:1.56, dpl:0.11, ws:"2025-08-03", wl:"Aug 3–9",      inFull:1,  otif:100,   status:"Done",        cases:160,   cost:250,      orders:1,  trucks:1,  weight:2337.2,     notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-08-03", wl:"Aug 3–9",      inFull:10, otif:100,   status:"Done",        cases:1600,  cost:0,        orders:10, trucks:8,  weight:19936,      notes:"" },
  // Aug 10-16, 2025
  { customer:"Costco",      dpc:3.84, dpl:0.11, ws:"2025-08-10", wl:"Aug 10–16",    inFull:9,  otif:100,   status:"Done",        cases:2100,  cost:8070,     orders:9,  trucks:4,  weight:76230,      notes:"" },
  { customer:"Kroger",      dpc:1.30, dpl:0.09, ws:"2025-08-10", wl:"Aug 10–16",    inFull:1,  otif:100,   status:"Done",        cases:192,   cost:250,      orders:1,  trucks:1,  weight:2804.62,    notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-08-10", wl:"Aug 10–16",    inFull:7,  otif:100,   status:"Done",        cases:1200,  cost:0,        orders:7,  trucks:5,  weight:14952,      notes:"" },
  // Aug 17-23, 2025
  { customer:"Costco",      dpc:2.68, dpl:0.08, ws:"2025-08-17", wl:"Aug 17–23",    inFull:5,  otif:50,    status:"Done",        cases:4100,  cost:10995,    orders:10, trucks:5,  weight:134970,     notes:"" },
  { customer:"Kroger",      dpc:3.13, dpl:0.21, ws:"2025-08-17", wl:"Aug 17–23",    inFull:1,  otif:100,   status:"Done",        cases:80,    cost:250,      orders:1,  trucks:1,  weight:1168.6,     notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-08-17", wl:"Aug 17–23",    inFull:16, otif:100,   status:"Done",        cases:13120, cost:0,        orders:16, trucks:13, weight:163475.2,   notes:"" },
  // Aug 24-30, 2025
  { customer:"Costco",      dpc:2.52, dpl:0.08, ws:"2025-08-24", wl:"Aug 24–30",    inFull:17, otif:97.06, status:"Done",        cases:9500,  cost:23975,    orders:17, trucks:10, weight:313896,     notes:"" },
  { customer:"Kroger",      dpc:1.30, dpl:0.09, ws:"2025-08-24", wl:"Aug 24–30",    inFull:1,  otif:100,   status:"Done",        cases:192,   cost:250,      orders:1,  trucks:1,  weight:2804.64,    notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-08-24", wl:"Aug 24–30",    inFull:19, otif:97.37, status:"Done",        cases:14240, cost:0,        orders:19, trucks:15, weight:177430,     notes:"" },
  // Aug 31 – Sep 6, 2025
  { customer:"Costco",      dpc:3.07, dpl:0.09, ws:"2025-08-31", wl:"Aug 31–Sep 6", inFull:16, otif:94.44, status:"Done",        cases:7250,  cost:22235,    orders:18, trucks:9,  weight:247005,     notes:"" },
  { customer:"Kroger",      dpc:0.98, dpl:0.07, ws:"2025-08-31", wl:"Aug 31–Sep 6", inFull:1,  otif:100,   status:"Done",        cases:256,   cost:250,      orders:1,  trucks:1,  weight:3739.52,    notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-08-31", wl:"Aug 31–Sep 6", inFull:8,  otif:94.44, status:"Done",        cases:11422, cost:0,        orders:9,  trucks:9,  weight:142318.12,  notes:"" },
  // Sep 7-13, 2025
  { customer:"Costco",      dpc:3.24, dpl:0.09, ws:"2025-09-07", wl:"Sep 7–13",     inFull:17, otif:97.22, status:"Done",        cases:8212,  cost:26643,    orders:18, trucks:11, weight:289779.6,   notes:"PO 10530731121 Frederick – 88cs Short, waiting on test results" },
  { customer:"Kroger",      dpc:1.82, dpl:0.12, ws:"2025-09-07", wl:"Sep 7–13",     inFull:1,  otif:100,   status:"Done",        cases:192,   cost:350,      orders:1,  trucks:1,  weight:2804.64,    notes:"Shipped wrong lot code – $100 stop-back fee, 1hr wait swapping pallet" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-09-07", wl:"Sep 7–13",     inFull:13, otif:100,   status:"Done",        cases:14800, cost:0,        orders:13, trucks:11, weight:184408,     notes:"" },
  // Sep 14-20, 2025
  { customer:"Costco",      dpc:1.58, dpl:0.07, ws:"2025-09-14", wl:"Sep 14–20",    inFull:19, otif:86.84, status:"Done",        cases:15704, cost:24866,    orders:19, trucks:10, weight:333872.01,  notes:"Multiple late deliveries: SLC/Sumner missed UT delivery; Mira Loma all appts rescheduled to 9/19" },
  { customer:"Kroger",      dpc:1.13, dpl:0.13, ws:"2025-09-14", wl:"Sep 14–20",    inFull:2,  otif:70,    status:"Done",        cases:10144, cost:11470,    orders:5,  trucks:5,  weight:88678.48,   notes:"Multiple short shipments – GCC/SGO cases short due to less yield" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-09-14", wl:"Sep 14–20",    inFull:11, otif:100,   status:"Done",        cases:15808, cost:0,        orders:11, trucks:9,  weight:196374.83,  notes:"" },
  // Sep 21-27, 2025
  { customer:"Costco",      dpc:2.26, dpl:0.07, ws:"2025-09-21", wl:"Sep 21–27",    inFull:11, otif:100,   status:"Done",        cases:6560,  cost:14845,    orders:11, trucks:8,  weight:221034,     notes:"" },
  { customer:"Kroger",      dpc:2.60, dpl:0.18, ws:"2025-09-21", wl:"Sep 21–27",    inFull:1,  otif:100,   status:"Done",        cases:96,    cost:250,      orders:1,  trucks:1,  weight:1402.32,    notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-09-21", wl:"Sep 21–27",    inFull:14, otif:96.67, status:"Done",        cases:26111, cost:0,        orders:15, trucks:11, weight:305730.05,  notes:"PO 151579145 – 81cs CTH short, USDA pathogen results hold" },
  // Sep 28 – Oct 4, 2025
  { customer:"Costco",      dpc:3.14, dpl:0.10, ws:"2025-09-28", wl:"Sep 28–Oct 4", inFull:21, otif:95.45, status:"Done",        cases:9950,  cost:31227,    orders:22, trucks:13, weight:326535,     notes:"UT did not unload 1 pallet; $450×2 layovers + $70 stop-off fee" },
  { customer:"Kroger",      dpc:0.42, dpl:0.03, ws:"2025-09-28", wl:"Sep 28–Oct 4", inFull:1,  otif:100,   status:"Done",        cases:589,   cost:250,      orders:1,  trucks:1,  weight:8603.82,    notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-09-28", wl:"Sep 28–Oct 4", inFull:17, otif:100,   status:"Done",        cases:23808, cost:0,        orders:17, trucks:14, weight:286086.83,  notes:"" },
  // Oct 5-11, 2025
  { customer:"Costco",      dpc:2.57, dpl:0.07, ws:"2025-10-05", wl:"Oct 5–11",     inFull:4,  otif:100,   status:"Done",        cases:2300,  cost:5915,     orders:4,  trucks:3,  weight:83490,      notes:"" },
  { customer:"Kroger",      dpc:1.08, dpl:0.08, ws:"2025-10-05", wl:"Oct 5–11",     inFull:2,  otif:100,   status:"Done",        cases:5184,  cost:5610,     orders:2,  trucks:2,  weight:66337.92,   notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-10-05", wl:"Oct 5–11",     inFull:7,  otif:93.75, status:"Done",        cases:3760,  cost:0,        orders:8,  trucks:5,  weight:47000,      notes:"80cs CTH short – COL/CTH mix-up on order adjustment PO 151862902" },
  // Oct 12-18, 2025  (Walmart first appears)
  { customer:"Costco",      dpc:2.11, dpl:0.07, ws:"2025-10-12", wl:"Oct 12–18",    inFull:26, otif:98.15, status:"Done",        cases:14410, cost:30342,    orders:27, trucks:13, weight:411415.4,   notes:"6cs BVS short PO 2680819071. Overweight truck had to return – $900 issue" },
  { customer:"Kroger",      dpc:1.30, dpl:0.09, ws:"2025-10-12", wl:"Oct 12–18",    inFull:0,  otif:50,    status:"Done",        cases:192,   cost:250,      orders:1,  trucks:1,  weight:2804.64,    notes:"96 GCC cases short" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-10-12", wl:"Oct 12–18",    inFull:27, otif:100,   status:"Done",        cases:42224, cost:0,        orders:27, trucks:23, weight:505743.68,  notes:"" },
  { customer:"Wal-Mart",    dpc:0.57, dpl:0.08, ws:"2025-10-12", wl:"Oct 12–18",    inFull:46, otif:100,   status:"Done",        cases:14760, cost:8350,     orders:46, trucks:3,  weight:101516,     notes:"" },
  // Oct 19-25, 2025
  { customer:"Costco",      dpc:1.73, dpl:0.07, ws:"2025-10-19", wl:"Oct 19–25",    inFull:15, otif:100,   status:"Done",        cases:10520, cost:18163,    orders:15, trucks:7,  weight:275567.6,   notes:"Reship due to slow XMI update; truck shipped 8am Monday with old order" },
  { customer:"Kroger",      dpc:1.06, dpl:0.11, ws:"2025-10-19", wl:"Oct 19–25",    inFull:2,  otif:100,   status:"Done",        cases:3264,  cost:3470,     orders:2,  trucks:2,  weight:30178.88,   notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-10-19", wl:"Oct 19–25",    inFull:7,  otif:92.86, status:"Done",        cases:6240,  cost:0,        orders:7,  trucks:7,  weight:77750.4,    notes:"PO 151988792 approved to ship 10/20 for 10/18 RDD" },
  { customer:"Wal-Mart",    dpc:0.59, dpl:0.09, ws:"2025-10-19", wl:"Oct 19–25",    inFull:46, otif:100,   status:"Done",        cases:10296, cost:6090,     orders:46, trucks:3,  weight:70813.6,    notes:"" },
  // Oct 26 – Nov 1, 2025
  { customer:"Costco",      dpc:2.08, dpl:0.06, ws:"2025-10-26", wl:"Oct 26–Nov 1", inFull:18, otif:100,   status:"Done",        cases:11250, cost:23366,    orders:18, trucks:11, weight:372662.4,   notes:"" },
  { customer:"Kroger",      dpc:1.11, dpl:0.13, ws:"2025-10-26", wl:"Oct 26–Nov 1", inFull:1,  otif:50,    status:"Done",        cases:2880,  cost:3200,     orders:1,  trucks:1,  weight:24569.6,    notes:"Missed delivery; truck kept in dock overnight – paperwork issue" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-10-26", wl:"Oct 26–Nov 1", inFull:13, otif:100,   status:"Done",        cases:12000, cost:0,        orders:13, trucks:11, weight:149520,     notes:"" },
  { customer:"Wal-Mart",    dpc:0.51, dpl:0.07, ws:"2025-10-26", wl:"Oct 26–Nov 1", inFull:45, otif:100,   status:"Done",        cases:12000, cost:6090,     orders:45, trucks:3,  weight:82533.33,   notes:"" },
  // Nov 2-8, 2025
  { customer:"Costco",      dpc:3.10, dpl:0.09, ws:"2025-11-02", wl:"Nov 2–8",      inFull:16, otif:93.75, status:"Done",        cases:9900,  cost:30677,    orders:16, trucks:10, weight:326568,     notes:"" },
  { customer:"Kroger",      dpc:0.63, dpl:0.04, ws:"2025-11-02", wl:"Nov 2–8",      inFull:0,  otif:50,    status:"Done",        cases:960,   cost:600,      orders:1,  trucks:1,  weight:14023.2,    notes:"Warehouse didn't load 192cs GCC. Said couldn't find it. AC provided photo of location" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-11-02", wl:"Nov 2–8",      inFull:11, otif:100,   status:"Done",        cases:11520, cost:0,        orders:11, trucks:9,  weight:143539.2,   notes:"" },
  { customer:"Wal-Mart",    dpc:1.02, dpl:0.15, ws:"2025-11-02", wl:"Nov 2–8",      inFull:34, otif:100,   status:"Done",        cases:6000,  cost:6090,     orders:34, trucks:3,  weight:41266.67,   notes:"" },
  // Nov 9-15, 2025
  { customer:"Costco",      dpc:3.60, dpl:0.11, ws:"2025-11-09", wl:"Nov 9–15",     inFull:27, otif:100,   status:"Done",        cases:14800, cost:53223,    orders:27, trucks:15, weight:463320,     notes:"Two UT POs for new store opening had 12/12 RDD; advised to keep 12/15 DELV APPT" },
  { customer:"Kroger",      dpc:1.39, dpl:0.11, ws:"2025-11-09", wl:"Nov 9–15",     inFull:7,  otif:100,   status:"Done",        cases:10272, cost:14280,    orders:7,  trucks:4,  weight:131447.4,   notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-11-09", wl:"Nov 9–15",     inFull:17, otif:100,   status:"Done",        cases:19792, cost:0,        orders:17, trucks:16, weight:247804.16,  notes:"" },
  { customer:"Wal-Mart",    dpc:0.68, dpl:0.10, ws:"2025-11-09", wl:"Nov 9–15",     inFull:37, otif:100,   status:"Done",        cases:6000,  cost:4060,     orders:37, trucks:2,  weight:41266.67,   notes:"" },
  // Nov 16-22, 2025
  { customer:"Costco",      dpc:3.18, dpl:0.10, ws:"2025-11-16", wl:"Nov 16–22",    inFull:25, otif:98,    status:"Done",        cases:12800, cost:40695,    orders:25, trucks:13, weight:393492,     notes:"AZ/CALI truck recovered; lots of back-and-forth; rescheduled 72hrs after RDD" },
  { customer:"Kroger",      dpc:0.96, dpl:0.07, ws:"2025-11-16", wl:"Nov 16–22",    inFull:5,  otif:100,   status:"Done",        cases:12416, cost:11981,    orders:5,  trucks:5,  weight:160505.92,  notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-11-16", wl:"Nov 16–22",    inFull:10, otif:100,   status:"Done",        cases:5120,  cost:0,        orders:10, trucks:8,  weight:63795.2,    notes:"Scheduled after PU date – confirmed with sales" },
  { customer:"Wal-Mart",    dpc:0.78, dpl:0.11, ws:"2025-11-16", wl:"Nov 16–22",    inFull:36, otif:100,   status:"Done",        cases:2592,  cost:2030,     orders:36, trucks:1,  weight:17827.2,    notes:"" },
  // Nov 23-29, 2025
  { customer:"Costco",      dpc:2.25, dpl:0.08, ws:"2025-11-23", wl:"Nov 23–29",    inFull:19, otif:100,   status:"Done",        cases:11230, cost:25235,    orders:19, trucks:10, weight:304385.4,   notes:"" },
  { customer:"Kroger",      dpc:2.38, dpl:0.18, ws:"2025-11-23", wl:"Nov 23–29",    inFull:2,  otif:100,   status:"Done",        cases:3392,  cost:8060,     orders:2,  trucks:2,  weight:44333.4,    notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-11-23", wl:"Nov 23–29",    inFull:14, otif:100,   status:"Done",        cases:5680,  cost:0,        orders:14, trucks:12, weight:70772.8,    notes:"" },
  { customer:"Wal-Mart",    dpc:0.59, dpl:0.09, ws:"2025-11-23", wl:"Nov 23–29",    inFull:47, otif:91.49, status:"Done",        cases:18000, cost:10650,    orders:47, trucks:5,  weight:123800,     notes:"Only 3 trucks planned; couldn't stack pallets as planned – 7 orders missed original trucks" },
  // Nov 30 – Dec 6, 2025
  { customer:"Costco",      dpc:2.95, dpl:0.09, ws:"2025-11-30", wl:"Nov 30–Dec 6", inFull:33, otif:96.97, status:"Done",        cases:14400, cost:42413,    orders:33, trucks:15, weight:462660,     notes:"$8,700 recovery – space issues; $400 increase out of CCC; $75 detention" },
  { customer:"Kroger",      dpc:1.56, dpl:0.12, ws:"2025-11-30", wl:"Nov 30–Dec 6", inFull:1,  otif:75,    status:"Done",        cases:3520,  cost:5487.5,   orders:2,  trucks:2,  weight:44156.4,    notes:"58cs BOMIN short (couldn't find)" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-11-30", wl:"Nov 30–Dec 6", inFull:12, otif:100,   status:"Done",        cases:19680, cost:0,        orders:12, trucks:11, weight:246182.4,   notes:"" },
  { customer:"Wal-Mart",    dpc:0.68, dpl:0.10, ws:"2025-11-30", wl:"Nov 30–Dec 6", inFull:37, otif:100,   status:"Done",        cases:6000,  cost:4060,     orders:37, trucks:2,  weight:41266.67,   notes:"" },
  // Dec 7-13, 2025
  { customer:"Costco",      dpc:2.17, dpl:0.08, ws:"2025-12-07", wl:"Dec 7–13",     inFull:29, otif:98.33, status:"Done",        cases:24850, cost:53930,    orders:30, trucks:21, weight:707091,     notes:"Tolleson PO 2601119241 – Short 150cs CTS; update not received in time, adding to 12/17 shipment" },
  { customer:"Kroger",      dpc:5.21, dpl:0.41, ws:"2025-12-07", wl:"Dec 7–13",     inFull:1,  otif:100,   status:"Done",        cases:192,   cost:1000,     orders:1,  trucks:1,  weight:2442.24,    notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-12-07", wl:"Dec 7–13",     inFull:12, otif:100,   status:"Done",        cases:17040, cost:0,        orders:12, trucks:9,  weight:212318.4,   notes:"" },
  { customer:"Wal-Mart",    dpc:0.52, dpl:0.08, ws:"2025-12-07", wl:"Dec 7–13",     inFull:45, otif:100,   status:"Done",        cases:12000, cost:6290,     orders:45, trucks:3,  weight:82533.33,   notes:"$200 shipping detention – 3rd truck loaded too long" },
  // Dec 14-20, 2025
  { customer:"Costco",      dpc:2.80, dpl:0.09, ws:"2025-12-14", wl:"Dec 14–20",    inFull:31, otif:95.16, status:"Done",        cases:21100, cost:59182.57, orders:31, trucks:20, weight:625482,     notes:"" },
  { customer:"Kroger",      dpc:0,    dpl:0,    ws:"2025-12-14", wl:"Dec 14–20",    inFull:0,  otif:null,  status:"Done",        cases:0,     cost:0,        orders:0,  trucks:0,  weight:0,          notes:"No shipments" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-12-14", wl:"Dec 14–20",    inFull:16, otif:100,   status:"Done",        cases:17440, cost:0,        orders:16, trucks:11, weight:217302,     notes:"" },
  { customer:"Wal-Mart",    dpc:0.68, dpl:0.10, ws:"2025-12-14", wl:"Dec 14–20",    inFull:38, otif:100,   status:"Done",        cases:6000,  cost:4060,     orders:38, trucks:2,  weight:41266.67,   notes:"" },
  // Dec 21-27, 2025
  { customer:"Costco",      dpc:2.33, dpl:0.08, ws:"2025-12-21", wl:"Dec 21–27",    inFull:27, otif:100,   status:"Done",        cases:20450, cost:47741.12, orders:27, trucks:20, weight:579249,     notes:"" },
  { customer:"Kroger",      dpc:2.08, dpl:0.14, ws:"2025-12-21", wl:"Dec 21–27",    inFull:1,  otif:100,   status:"Done",        cases:288,   cost:600,      orders:1,  trucks:1,  weight:4206.96,    notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-12-21", wl:"Dec 21–27",    inFull:14, otif:100,   status:"Done",        cases:17760, cost:0,        orders:14, trucks:11, weight:221289.6,   notes:"" },
  { customer:"Wal-Mart",    dpc:0.51, dpl:0.07, ws:"2025-12-21", wl:"Dec 21–27",    inFull:45, otif:98.91, status:"Done",        cases:11967, cost:6090,     orders:46, trucks:3,  weight:82306.36,   notes:"33cs PZT short PO 0967039164" },
  // Dec 28 – Jan 3, 2026
  { customer:"Costco",      dpc:2.56, dpl:0.09, ws:"2025-12-28", wl:"Dec 28–Jan 3", inFull:38, otif:92.11, status:"Done",        cases:27550, cost:70502.88, orders:38, trucks:26, weight:829257,     notes:"" },
  { customer:"Kroger",      dpc:2.74, dpl:0.19, ws:"2025-12-28", wl:"Dec 28–Jan 3", inFull:1,  otif:75,    status:"Done",        cases:219,   cost:600,      orders:2,  trucks:1,  weight:3199.04,    notes:"Short BOMIN – full PO slipped through; caught day-of but still short 53cs MIN" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2025-12-28", wl:"Dec 28–Jan 3", inFull:10, otif:100,   status:"Done",        cases:12800, cost:0,        orders:10, trucks:7,  weight:159488,     notes:"" },
  { customer:"Wal-Mart",    dpc:0.87, dpl:0.13, ws:"2025-12-28", wl:"Dec 28–Jan 3", inFull:36, otif:100,   status:"Done",        cases:6000,  cost:5230,     orders:36, trucks:2,  weight:41266.67,   notes:"Missed order but Americold had extra pallet of each – matched order" },
  // Jan 4-10, 2026
  { customer:"Costco",      dpc:2.58, dpl:0.09, ws:"2026-01-04", wl:"Jan 4–10",     inFull:18, otif:86.11, status:"Done",        cases:12200, cost:31506,    orders:18, trucks:13, weight:357852,     notes:"" },
  { customer:"Kroger",      dpc:2.50, dpl:0.17, ws:"2026-01-04", wl:"Jan 4–10",     inFull:2,  otif:100,   status:"Done",        cases:480,   cost:1200,     orders:2,  trucks:2,  weight:7012,       notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2026-01-04", wl:"Jan 4–10",     inFull:22, otif:100,   status:"Done",        cases:31360, cost:0,        orders:22, trucks:18, weight:390746,     notes:"" },
  { customer:"Wal-Mart",    dpc:0.70, dpl:0.10, ws:"2026-01-04", wl:"Jan 4–10",     inFull:37, otif:100,   status:"Done",        cases:6000,  cost:4210,     orders:37, trucks:2,  weight:41266.67,   notes:"1 truck: 3.5hr ship detention $150, x-ray issues" },
  // Jan 11-17, 2026
  { customer:"Costco",      dpc:2.90, dpl:0.09, ws:"2026-01-11", wl:"Jan 11–17",    inFull:20, otif:83.33, status:"Done",        cases:12520, cost:36321.63, orders:21, trucks:14, weight:412711,     notes:"Mira Loma CWR shipped at 320, Fishbowl had order at 350. Katy First VGA misentered with CTS – truck turned around" },
  { customer:"Kroger",      dpc:0,    dpl:0,    ws:"2026-01-11", wl:"Jan 11–17",    inFull:0,  otif:null,  status:"Done",        cases:0,     cost:0,        orders:0,  trucks:0,  weight:0,          notes:"No shipments" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2026-01-11", wl:"Jan 11–17",    inFull:11, otif:100,   status:"Done",        cases:11200, cost:0,        orders:11, trucks:10, weight:139552,     notes:"" },
  { customer:"Wal-Mart",    dpc:0.56, dpl:0.08, ws:"2026-01-11", wl:"Jan 11–17",    inFull:46, otif:100,   status:"Done",        cases:12000, cost:6775,     orders:46, trucks:3,  weight:82533.33,   notes:"Capacity pains $3,400; split increase $685 for 1 truck" },
  // Jan 18-24, 2026
  { customer:"Costco",      dpc:3.17, dpl:0.09, ws:"2026-01-18", wl:"Jan 18–24",    inFull:18, otif:100,   status:"Done",        cases:8800,  cost:27921.54, orders:18, trucks:11, weight:297726,     notes:"" },
  { customer:"Kroger",      dpc:0.89, dpl:0.06, ws:"2026-01-18", wl:"Jan 18–24",    inFull:1,  otif:100,   status:"Done",        cases:432,   cost:385,      orders:1,  trucks:1,  weight:6310.44,    notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2026-01-18", wl:"Jan 18–24",    inFull:3,  otif:87.5,  status:"Done",        cases:3342,  cost:0,        orders:4,  trucks:3,  weight:41641.32,   notes:"Short-shipped TJ Naz on COL 178 COL – exp date too far out" },
  { customer:"Wal-Mart",    dpc:0.56, dpl:0.08, ws:"2026-01-18", wl:"Jan 18–24",    inFull:46, otif:100,   status:"Done",        cases:11580, cost:6540,     orders:46, trucks:3,  weight:79644.67,   notes:"" },
  // Jan 25-31, 2026
  { customer:"Costco",      dpc:3.95, dpl:0.12, ws:"2026-01-25", wl:"Jan 25–31",    inFull:19, otif:97.5,  status:"Done",        cases:12555, cost:49586.12, orders:20, trucks:15, weight:411810.3,   notes:"Multiple freight issues: layovers, NJ recover truck $6,600. Total additional cost: $3,312.50" },
  { customer:"Kroger",      dpc:0.83, dpl:0.06, ws:"2026-01-25", wl:"Jan 25–31",    inFull:1,  otif:100,   status:"Done",        cases:528,   cost:440,      orders:1,  trucks:1,  weight:7712.76,    notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2026-01-25", wl:"Jan 25–31",    inFull:19, otif:100,   status:"Done",        cases:14720, cost:0,        orders:19, trucks:17, weight:183411.2,   notes:"" },
  { customer:"Wal-Mart",    dpc:0.57, dpl:0.08, ws:"2026-01-25", wl:"Jan 25–31",    inFull:46, otif:100,   status:"Done",        cases:11232, cost:6380,     orders:46, trucks:2,  weight:77251.2,    notes:"" },
  // Feb 1-7, 2026
  { customer:"Costco",      dpc:3.60, dpl:0.11, ws:"2026-02-01", wl:"Feb 1–7",      inFull:21, otif:82.61, status:"Done",        cases:11900, cost:42851.55, orders:23, trucks:16, weight:394086,     notes:"" },
  { customer:"Kroger",      dpc:2.49, dpl:0.19, ws:"2026-02-01", wl:"Feb 1–7",      inFull:2,  otif:83.33, status:"Done",        cases:2805,  cost:6981,     orders:3,  trucks:3,  weight:36503.09,   notes:"Short 123cs VGS" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2026-02-01", wl:"Feb 1–7",      inFull:15, otif:100,   status:"Done",        cases:20309, cost:0,        orders:15, trucks:12, weight:253881.37,  notes:"" },
  { customer:"Wal-Mart",    dpc:0.66, dpl:0.10, ws:"2026-02-01", wl:"Feb 1–7",      inFull:45, otif:100,   status:"Done",        cases:6624,  cost:4360,     orders:45, trucks:2,  weight:45558.4,    notes:"" },
  // Feb 8-14, 2026
  { customer:"Costco",      dpc:3.41, dpl:0.13, ws:"2026-02-08", wl:"Feb 8–14",     inFull:18, otif:68.75, status:"Done",        cases:16391, cost:55882.93, orders:24, trucks:18, weight:436893.56,  notes:"" },
  { customer:"Kroger",      dpc:0.99, dpl:0.08, ws:"2026-02-08", wl:"Feb 8–14",     inFull:2,  otif:83.33, status:"Done",        cases:5159,  cost:5100,     orders:3,  trucks:3,  weight:66539.52,   notes:"Short 25 CGO; no VGS or SGO sent – finished off short-dated inventory" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2026-02-08", wl:"Feb 8–14",     inFull:12, otif:100,   status:"Done",        cases:10480, cost:0,        orders:12, trucks:10, weight:130580.8,   notes:"" },
  { customer:"Wal-Mart",    dpc:0.75, dpl:0.11, ws:"2026-02-08", wl:"Feb 8–14",     inFull:42, otif:100,   status:"Done",        cases:7176,  cost:5360,     orders:42, trucks:2,  weight:49354.93,   notes:"$250 + $750 layovers – Americold pushed appointments" },
  // Feb 15-21, 2026
  { customer:"Costco",      dpc:4.67, dpl:0.14, ws:"2026-02-15", wl:"Feb 15–21",    inFull:40, otif:90.24, status:"Done",        cases:16140, cost:75344.35, orders:41, trucks:24, weight:543284,     notes:"PO 12040202176 – 93cs CWR short; CEB came back on 3 trucks for 4 POs" },
  { customer:"Kroger",      dpc:0,    dpl:0,    ws:"2026-02-15", wl:"Feb 15–21",    inFull:0,  otif:null,  status:"Done",        cases:0,     cost:0,        orders:0,  trucks:0,  weight:0,          notes:"No shipments" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2026-02-15", wl:"Feb 15–21",    inFull:9,  otif:100,   status:"Done",        cases:9280,  cost:0,        orders:9,  trucks:9,  weight:115628.8,   notes:"" },
  { customer:"Wal-Mart",    dpc:0.73, dpl:0.11, ws:"2026-02-15", wl:"Feb 15–21",    inFull:41, otif:100,   status:"Done",        cases:6564,  cost:4810,     orders:41, trucks:2,  weight:45143.73,   notes:"$250 layover; SKUs not ready; 4hrs @ $50/hr rec detention $200" },
  // Feb 22-28, 2026
  { customer:"Costco",      dpc:4.01, dpl:0.17, ws:"2026-02-22", wl:"Feb 22–28",    inFull:34, otif:87.14, status:"Done",        cases:12838, cost:51440.46, orders:35, trucks:19, weight:297266.22,  notes:"Lates: 4 CWR delay, 2x driver breakdown, 2x delayed load, missed appt. Short: 24cs CEB – pallet found after truck left" },
  { customer:"Kroger",      dpc:1.72, dpl:0.11, ws:"2026-02-22", wl:"Feb 22–28",    inFull:1,  otif:100,   status:"Done",        cases:256,   cost:440,      orders:1,  trucks:1,  weight:4050.62,    notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2026-02-22", wl:"Feb 22–28",    inFull:13, otif:100,   status:"Done",        cases:15760, cost:0,        orders:13, trucks:12, weight:231431,     notes:"" },
  { customer:"Wal-Mart",    dpc:0.75, dpl:0.09, ws:"2026-02-22", wl:"Feb 22–28",    inFull:31, otif:100,   status:"Done",        cases:6000,  cost:4510,     orders:31, trucks:2,  weight:52592,      notes:"3hr ship detention $150" },
  // Mar 1-7, 2026
  { customer:"Costco",      dpc:4.31, dpl:0.13, ws:"2026-03-01", wl:"Mar 1–7",      inFull:31, otif:92.19, status:"Done",        cases:10031, cost:43278.03, orders:32, trucks:17, weight:330246.72,  notes:"Tracy 1720105505 – 35cs CEB short" },
  { customer:"Kroger",      dpc:0.97, dpl:0.08, ws:"2026-03-01", wl:"Mar 1–7",      inFull:5,  otif:100,   status:"Done",        cases:11616, cost:11271,    orders:5,  trucks:5,  weight:145641.02,  notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2026-03-01", wl:"Mar 1–7",      inFull:12, otif:100,   status:"Done",        cases:9120,  cost:0,        orders:12, trucks:12, weight:110662.08,  notes:"" },
  { customer:"Wal-Mart",    dpc:0.73, dpl:0.11, ws:"2026-03-01", wl:"Mar 1–7",      inFull:40, otif:100,   status:"Done",        cases:6000,  cost:4360,     orders:40, trucks:2,  weight:40180,      notes:"2 days after RDD – first available delivery" },
  // Mar 8-14, 2026
  { customer:"Costco",      dpc:4.09, dpl:0.12, ws:"2026-03-08", wl:"Mar 8–14",     inFull:26, otif:98.15, status:"Done",        cases:12078, cost:49367.12, orders:27, trucks:19, weight:414205.32,  notes:"Van Buren PO 12040220110 – 72cs CML short" },
  { customer:"Kroger",      dpc:0.84, dpl:0.07, ws:"2026-03-08", wl:"Mar 8–14",     inFull:3,  otif:100,   status:"Done",        cases:6000,  cost:5045,     orders:3,  trucks:3,  weight:75526.56,   notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2026-03-08", wl:"Mar 8–14",     inFull:2,  otif:100,   status:"Done",        cases:1040,  cost:0,        orders:2,  trucks:2,  weight:12619.36,   notes:"" },
  { customer:"Wal-Mart",    dpc:0.80, dpl:0.12, ws:"2026-03-08", wl:"Mar 8–14",     inFull:39, otif:100,   status:"Done",        cases:6000,  cost:4810,     orders:39, trucks:2,  weight:40180,      notes:"Freight increase: 4hr ship detention $200, 6hr rec detention $250" },
  // Mar 15-21, 2026
  { customer:"Costco",      dpc:3.82, dpl:0.12, ws:"2026-03-15", wl:"Mar 15–21",    inFull:20, otif:81.82, status:"Done",        cases:11770, cost:45000,    orders:22, trucks:17, weight:365242.72,  notes:"Morris sent with 2 CML pallets in VGA packaging – stopped truck; first avail new DELV 3/25" },
  { customer:"Kroger",      dpc:0.83, dpl:0.07, ws:"2026-03-15", wl:"Mar 15–21",    inFull:2,  otif:100,   status:"Done",        cases:3264,  cost:2715,     orders:2,  trucks:2,  weight:41484.1,    notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2026-03-15", wl:"Mar 15–21",    inFull:20, otif:100,   status:"Done",        cases:17600, cost:0,        orders:20, trucks:17, weight:213558.4,   notes:"14 orders delayed due to orzo – shipped this week" },
  { customer:"Wal-Mart",    dpc:0.73, dpl:0.11, ws:"2026-03-15", wl:"Mar 15–21",    inFull:41, otif:100,   status:"Done",        cases:6000,  cost:4360,     orders:41, trucks:2,  weight:40180,      notes:"" },
  // Mar 22-28, 2026 — PREVIOUS WEEK
  { customer:"Costco",      dpc:5.56, dpl:0.16, ws:"2026-03-22", wl:"Mar 22–28",    inFull:14, otif:100,   status:"Done",        cases:4400,  cost:24455.91, orders:14, trucks:9,  weight:151659.36,  notes:"" },
  { customer:"Kroger",      dpc:0.84, dpl:0.07, ws:"2026-03-22", wl:"Mar 22–28",    inFull:3,  otif:100,   status:"Done",        cases:5984,  cost:5045,     orders:3,  trucks:3,  weight:75301.06,   notes:"" },
  { customer:"Trader Joes", dpc:0,    dpl:0,    ws:"2026-03-22", wl:"Mar 22–28",    inFull:13, otif:100,   status:"Done",        cases:9040,  cost:0,        orders:13, trucks:12, weight:109691.36,  notes:"" },
  { customer:"Wal-Mart",    dpc:0.73, dpl:0.11, ws:"2026-03-22", wl:"Mar 22–28",    inFull:43, otif:100,   status:"Done",        cases:6000,  cost:4360,     orders:43, trucks:2,  weight:40180,      notes:"" },
{ customer:"Wal-Mart",    dpc:0.79, dpl:0.12, ws:"2026-04-12", wl:"Apr 12–18", inFull:37, otif:100, status:"Done", cases:3108, cost:2470, orders:37, trucks:1, weight:20813, notes:"" },
  { customer:"Costco",      dpc:4.35, dpl:0.13, ws:"2026-04-12", wl:"Apr 12–18", inFull:8,  otif:100, status:"Done", cases:1650, cost:7175, orders:8,  trucks:3, weight:53443, notes:"" },
  { customer:"Kroger",      dpc:3.75, dpl:0.27, ws:"2026-04-12", wl:"Apr 12–18", inFull:1,  otif:100, status:"Done", cases:176,  cost:660,  orders:1,  trucks:1, weight:2481,  notes:"" },
  { customer:"Trader Joes", dpc:0.00, dpl:0.00, ws:"2026-04-12", wl:"Apr 12–18", inFull:13, otif:100, status:"Done", cases:10320, cost:0,   orders:13, trucks:12, weight:125223, notes:"" }
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const calcWeightedOTIF = (rows) => {
  const eligible = rows.filter(r => r.orders > 0 && r.otif !== null);
  if (!eligible.length) return null;
  const totalOrders = eligible.reduce((s, r) => s + r.orders, 0);
  return eligible.reduce((s, r) => s + r.otif * r.orders, 0) / totalOrders;
};
const calcTotalCost    = (rows) => rows.reduce((s, r) => s + r.cost, 0);
const calcWeightedDPC  = (rows) => {
  const e = rows.filter(r => r.cost > 0 && r.cases > 0);
  if (!e.length) return 0;
  return e.reduce((s, r) => s + r.cost, 0) / e.reduce((s, r) => s + r.cases, 0);
};
const calcWeightedDPL  = (rows) => {
  const e = rows.filter(r => r.cost > 0 && r.weight > 0);
  if (!e.length) return 0;
  return e.reduce((s, r) => s + r.cost, 0) / e.reduce((s, r) => s + r.weight, 0);
};
const fmtK   = (v) => v >= 1000 ? `$${(v/1000).toFixed(1)}K` : `$${v.toFixed(0)}`;
const fmtPct = (v, decimals = 1) => v == null ? "—" : `${v.toFixed(decimals)}%`;
const fmtDPC = (v) => v > 0 ? `$${v.toFixed(2)}` : "—";
const fmtDPL = (v) => v > 0 ? `$${v.toFixed(3)}` : "—";
const otifColor = (v) => v == null ? "#475569" : v >= 95 ? "#34D399" : v >= 85 ? "#FBBF24" : "#F87171";

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function OutboundDashboard() {
  const weeks = useMemo(() => {
    const seen = new Set();
    return ALL_DATA.reduce((acc, d) => {
      if (!seen.has(d.ws)) { seen.add(d.ws); acc.push({ ws: d.ws, wl: d.wl }); }
      return acc;
    }, []).sort((a, b) => a.ws.localeCompare(b.ws));
  }, []);

  const [selIdx, setSelIdx]         = useState(weeks.length - 1);
  const [activeCusts, setActiveCusts] = useState(new Set(CUSTOMERS));
  const [tab, setTab]               = useState("overview");
  const [trendRange, setTrendRange] = useState(16);
  const [expandedNote, setExpandedNote] = useState(null);

  const curWeek  = weeks[selIdx];
  const prevWeek = selIdx > 0 ? weeks[selIdx - 1] : null;

  const curRows  = useMemo(() => ALL_DATA.filter(d => d.ws === curWeek.ws  && activeCusts.has(d.customer)), [curWeek,  activeCusts]);
  const prevRows = useMemo(() => prevWeek ? ALL_DATA.filter(d => d.ws === prevWeek.ws && activeCusts.has(d.customer)) : [], [prevWeek, activeCusts]);

  const kpis = useMemo(() => ({
    curr: { otif: calcWeightedOTIF(curRows),  cost: calcTotalCost(curRows),  dpc: calcWeightedDPC(curRows),  dpl: calcWeightedDPL(curRows),  cases: curRows.reduce((s,r)=>s+r.cases,0),  orders: curRows.reduce((s,r)=>s+r.orders,0) },
    prev: prevRows.length ? { otif: calcWeightedOTIF(prevRows), cost: calcTotalCost(prevRows), dpc: calcWeightedDPC(prevRows), dpl: calcWeightedDPL(prevRows), cases: prevRows.reduce((s,r)=>s+r.cases,0), orders: prevRows.reduce((s,r)=>s+r.orders,0) } : null,
  }), [curRows, prevRows]);

  const trendWeeks = useMemo(() => weeks.slice(Math.max(0, selIdx - trendRange + 1), selIdx + 1), [weeks, selIdx, trendRange]);

  const trendData = useMemo(() => trendWeeks.map(w => {
    const rows = ALL_DATA.filter(d => d.ws === w.ws && activeCusts.has(d.customer));
    const obj  = { wl: w.wl, otif: calcWeightedOTIF(rows), cost: calcTotalCost(rows), dpc: calcWeightedDPC(rows), dpl: calcWeightedDPL(rows) };
    CUSTOMERS.forEach(c => {
      if (!activeCusts.has(c)) return;
      const r = ALL_DATA.find(d => d.ws === w.ws && d.customer === c);
      obj[`otif_${c.replace(" ","_")}`] = r?.otif ?? null;
      obj[`dpc_${c.replace(" ","_")}`]  = r && r.cost > 0 ? r.dpc : null;
      obj[`dpl_${c.replace(" ","_")}`]  = r && r.cost > 0 ? r.dpl : null;
      obj[`cost_${c.replace(" ","_")}`] = r?.cost ?? 0;
    });
    return obj;
  }), [trendWeeks, activeCusts]);

  const allIssues = useMemo(() =>
    ALL_DATA.filter(d => d.notes && d.notes.trim())
            .sort((a,b) => b.ws.localeCompare(a.ws)), []);

  const toggleCust = (c) => setActiveCusts(prev => {
    const next = new Set(prev);
    if (next.has(c)) { if (next.size > 1) next.delete(c); } else next.add(c);
    return next;
  });

  const status = ALL_DATA.find(d => d.ws === curWeek.ws)?.status;

  // ── STYLES ────────────────────────────────────────────────────────────────
  const S = {
    app:    { background:"#0A0F1E", minHeight:"100vh", color:"#E2E8F0", fontFamily:"'Inter','Segoe UI',system-ui,sans-serif", fontSize:"14px" },
    header: { background:"linear-gradient(135deg,#1E293B 0%,#0F172A 100%)", borderBottom:"1px solid #1E3A5F", padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" },
    card:   { background:"#111827", border:"1px solid #1F2D40", borderRadius:"12px", padding:"16px" },
    pill:   (active, color) => ({ padding:"5px 14px", borderRadius:"20px", fontSize:"12px", fontWeight:600, cursor:"pointer", border:`2px solid ${color}`, background: active ? color : "transparent", color: active ? "#fff" : color, transition:"all 0.15s ease" }),
    tab:    (active) => ({ padding:"9px 22px", borderRadius:"8px 8px 0 0", fontSize:"13px", fontWeight: active ? 700 : 400, cursor:"pointer", border:"none", borderBottom: active ? "2px solid #3B82F6" : "2px solid transparent", background: active ? "#111827" : "transparent", color: active ? "#F1F5F9" : "#475569", transition:"all 0.15s" }),
    select: { background:"#1E293B", border:"1px solid #334155", color:"#F1F5F9", padding:"6px 12px", borderRadius:"8px", fontSize:"13px", cursor:"pointer", outline:"none" },
    badge:  (bg,color) => ({ background:bg, color, padding:"3px 9px", borderRadius:"12px", fontSize:"11px", fontWeight:700, letterSpacing:"0.04em" }),
  };

  const deltaEl = (curr, prev, higherBetter, fmtFn, fractionDigits=1) => {
    if (curr == null || prev == null || prev === 0) return null;
    const delta   = curr - prev;
    const pct     = (delta / Math.abs(prev)) * 100;
    const isGood  = higherBetter ? delta >= 0 : delta <= 0;
    const clr     = isGood ? "#34D399" : "#F87171";
    const arrow   = delta >= 0 ? "▲" : "▼";
    return (
      <div style={{ display:"flex", alignItems:"center", gap:"4px", marginTop:"4px", fontSize:"12px" }}>
        <span style={{ color:clr, fontWeight:600 }}>{arrow} {fmtFn(Math.abs(delta))}</span>
        <span style={{ color:"#475569" }}>({Math.abs(pct).toFixed(fractionDigits)}%)</span>
        <span style={{ color:"#334155" }}>vs prior wk</span>
      </div>
    );
  };

  const kpiCards = [
    { label:"OT/IF",         curr:kpis.curr.otif,   prev:kpis.prev?.otif,   higherBetter:true,  fmtBig:fmtPct,  fmtDelta:(v)=>`${v.toFixed(1)}pp`, accent: otifColor(kpis.curr.otif) },
    { label:"$/Case",        curr:kpis.curr.dpc,    prev:kpis.prev?.dpc,    higherBetter:false, fmtBig:fmtDPC,  fmtDelta:(v)=>`$${v.toFixed(2)}`,  accent:"#818CF8" },
    { label:"$/Lb",          curr:kpis.curr.dpl,    prev:kpis.prev?.dpl,    higherBetter:false, fmtBig:fmtDPL,  fmtDelta:(v)=>`$${v.toFixed(3)}`,  accent:"#A78BFA" },
    { label:"Freight Cost",  curr:kpis.curr.cost,   prev:kpis.prev?.cost,   higherBetter:false, fmtBig:fmtK,    fmtDelta:(v)=>`${fmtK(v)}`,         accent:"#F59E0B" },
    { label:"Total Cases",   curr:kpis.curr.cases,  prev:kpis.prev?.cases,  higherBetter:true,  fmtBig:(v)=>v.toLocaleString(), fmtDelta:(v)=>v.toLocaleString(), accent:"#38BDF8" },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background:"#1E293B", border:"1px solid #334155", borderRadius:"8px", padding:"10px 14px", fontSize:"12px" }}>
        <div style={{ fontWeight:700, color:"#94A3B8", marginBottom:"6px" }}>{label}</div>
        {payload.map(p => (
          <div key={p.dataKey} style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"3px" }}>
            <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:p.color, display:"inline-block" }}/>
            <span style={{ color:"#94A3B8" }}>{p.name}:</span>
            <span style={{ fontWeight:600, color:"#F1F5F9" }}>{p.value != null ? (typeof p.value === "number" ? (p.value > 10 ? p.value.toFixed(1) : p.value.toFixed(3)) : p.value) : "—"}</span>
          </div>
        ))}
      </div>
    );
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div style={S.app}>
      {/* HEADER */}
      <div style={S.header}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <span style={{ fontSize:"20px" }}>📦</span>
            <h1 style={{ margin:0, fontSize:"18px", fontWeight:800, letterSpacing:"-0.02em", color:"#F8FAFC" }}>Outbound Freight Dashboard</h1>
            {status === "In Progress" && <span style={S.badge("#F59E0B20","#FBBF24")}>IN PROGRESS</span>}
          </div>
          <p style={{ margin:"3px 0 0 30px", fontSize:"12px", color:"#475569" }}>SIOP Weekly Review · All data from Outbound_Customer_byWeek</p>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <span style={{ fontSize:"12px", color:"#475569" }}>Week ending:</span>
          <select value={selIdx} onChange={e => setSelIdx(+e.target.value)} style={S.select}>
            {weeks.map((w,i) => <option key={w.ws} value={i}>{w.wl}</option>)}
          </select>
          <button onClick={()=>setSelIdx(i=>Math.max(0,i-1))} style={{...S.select, padding:"6px 10px", cursor:"pointer"}} disabled={selIdx===0}>◀</button>
          <button onClick={()=>setSelIdx(i=>Math.min(weeks.length-1,i+1))} style={{...S.select, padding:"6px 10px", cursor:"pointer"}} disabled={selIdx===weeks.length-1}>▶</button>
        </div>
      </div>

      {/* CUSTOMER FILTER */}
      <div style={{ background:"#0D1525", borderBottom:"1px solid #1E2D40", padding:"10px 24px", display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap" }}>
        <span style={{ fontSize:"11px", color:"#334155", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", marginRight:"4px" }}>Customers:</span>
        {CUSTOMERS.map(c => <button key={c} onClick={()=>toggleCust(c)} style={S.pill(activeCusts.has(c), COLORS[c])}>{c}</button>)}
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:"6px", fontSize:"12px", color:"#334155" }}>
          <span>*Trader Joe's freight is carrier-paid ($0 cost to us)</span>
        </div>
      </div>

      {/* KPI STRIP */}
      <div style={{ padding:"16px 24px", display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"12px" }}>
        {kpiCards.map(({ label, curr, prev, higherBetter, fmtBig, fmtDelta, accent }) => (
          <div key={label} style={{ ...S.card, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:"3px", background:`linear-gradient(90deg,${accent},transparent)` }}/>
            <div style={{ fontSize:"11px", color:"#475569", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"8px" }}>{label}</div>
            <div style={{ fontSize:"28px", fontWeight:800, color: label==="OT/IF" ? otifColor(curr) : "#F8FAFC", letterSpacing:"-0.02em" }}>{curr != null ? fmtBig(curr) : "—"}</div>
            {deltaEl(curr, prev, higherBetter, fmtDelta)}
            {prev != null && <div style={{ marginTop:"4px", fontSize:"11px", color:"#334155" }}>Prior: {fmtBig(prev)}</div>}
          </div>
        ))}
      </div>

      {/* TABS */}
      <div style={{ padding:"0 24px", display:"flex", borderBottom:"1px solid #1E2D40" }}>
        {[["overview","📊  Overview"],["trends","📈  Trends"],["issues","⚠️  Issues Log"]].map(([id,label]) => (
          <button key={id} onClick={()=>setTab(id)} style={S.tab(tab===id)}>{label}</button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div style={{ padding:"0 24px 32px" }}>

        {/* ── OVERVIEW TAB ── */}
        {tab === "overview" && (
          <div style={{ ...S.card, borderRadius:"0 12px 12px 12px", marginTop:"0" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"16px" }}>
              <h3 style={{ margin:0, fontSize:"13px", color:"#94A3B8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>
                Week of {curWeek.wl} — Customer Breakdown
              </h3>
              {prevWeek && <span style={{ fontSize:"12px", color:"#334155" }}>↕ deltas vs {prevWeek.wl}</span>}
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"13px" }}>
                <thead>
                  <tr style={{ borderBottom:"1px solid #1F2D40" }}>
                    {["Customer","OT/IF %","$/Case","$/Lb","Freight Cost","Cases","Orders","Trucks","Weight (lbs)","Notes"].map(h => (
                      <th key={h} style={{ padding:"8px 12px", textAlign:"left", color:"#475569", fontWeight:600, fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.05em", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CUSTOMERS.filter(c => activeCusts.has(c)).map(c => {
                    const r = curRows.find(d => d.customer === c);
                    const p = prevRows.find(d => d.customer === c);
                    if (!r) return null;
                    const otifDelta = r.otif != null && p?.otif != null ? r.otif - p.otif : null;
                    const costDelta = p ? r.cost - p.cost : null;
                    const dpcDelta  = p && r.dpc > 0 && p.dpc > 0 ? r.dpc - p.dpc : null;
                    return (
                      <tr key={c} style={{ borderBottom:"1px solid #111827" }}
                          onMouseEnter={e=>e.currentTarget.style.background="#0F172A"}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <td style={{ padding:"12px", fontWeight:700, whiteSpace:"nowrap" }}>
                          <span style={{ display:"inline-flex", alignItems:"center", gap:"8px" }}>
                            <span style={{ width:"10px", height:"10px", borderRadius:"50%", background:COLORS[c], flexShrink:0 }}/>
                            {c}
                          </span>
                        </td>
                        <td style={{ padding:"12px" }}>
                          {r.orders > 0 ? (
                            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                              <div style={{ width:"60px", height:"5px", borderRadius:"3px", background:"#1E293B", flexShrink:0 }}>
                                <div style={{ width:`${r.otif ?? 0}%`, height:"100%", borderRadius:"3px", background:otifColor(r.otif) }}/>
                              </div>
                              <span style={{ color:otifColor(r.otif), fontWeight:700 }}>{fmtPct(r.otif)}</span>
                              {otifDelta != null && <span style={{ fontSize:"11px", color: otifDelta >= 0 ? "#34D399" : "#F87171" }}>{otifDelta >= 0 ? "↑" : "↓"}{Math.abs(otifDelta).toFixed(1)}pp</span>}
                            </div>
                          ) : <span style={{ color:"#334155" }}>—</span>}
                        </td>
                        <td style={{ padding:"12px", color:"#94A3B8", whiteSpace:"nowrap" }}>
                          {fmtDPC(r.dpc)}
                          {dpcDelta != null && <span style={{ fontSize:"11px", marginLeft:"5px", color:dpcDelta<=0?"#34D399":"#F87171" }}>{dpcDelta<=0?"↓":"↑"}{Math.abs(dpcDelta).toFixed(2)}</span>}
                        </td>
                        <td style={{ padding:"12px", color:"#94A3B8" }}>{fmtDPL(r.dpl)}</td>
                        <td style={{ padding:"12px", whiteSpace:"nowrap" }}>
                          {r.cost > 0 ? (
                            <span>
                              {fmtK(r.cost)}
                              {costDelta != null && r.cost > 0 && <span style={{ fontSize:"11px", marginLeft:"5px", color:costDelta<=0?"#34D399":"#F87171" }}>{costDelta<=0?"↓":"↑"}{fmtK(Math.abs(costDelta))}</span>}
                            </span>
                          ) : <span style={{ color:"#334155" }}>—</span>}
                        </td>
                        <td style={{ padding:"12px", color:"#94A3B8" }}>{r.cases > 0 ? r.cases.toLocaleString() : "—"}</td>
                        <td style={{ padding:"12px", color:"#94A3B8" }}>{r.orders || "—"}</td>
                        <td style={{ padding:"12px", color:"#94A3B8" }}>{r.trucks || "—"}</td>
                        <td style={{ padding:"12px", color:"#94A3B8" }}>{r.weight > 0 ? (r.weight/1000).toFixed(0)+"K" : "—"}</td>
                        <td style={{ padding:"12px", maxWidth:"220px" }}>
                          {r.notes ? (
                            <div style={{ position:"relative" }}>
                              <span
                                onClick={()=>setExpandedNote(expandedNote===`${c}-${r.ws}` ? null : `${c}-${r.ws}`)}
                                style={{ color:"#F87171", cursor:"pointer", fontSize:"12px", display:"flex", alignItems:"flex-start", gap:"4px" }}>
                                <span>⚠️</span>
                                <span style={{ display:"-webkit-box", WebkitLineClamp:expandedNote===`${c}-${r.ws}`?99:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                                  {r.notes}
                                </span>
                              </span>
                            </div>
                          ) : <span style={{ color:"#1F2D40" }}>✓</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop:"2px solid #1F2D40", background:"#0A0F1E" }}>
                    <td style={{ padding:"10px 12px", fontWeight:800, color:"#94A3B8", fontSize:"11px", textTransform:"uppercase" }}>TOTAL</td>
                    <td style={{ padding:"10px 12px" }}>
                      {(() => { const v = calcWeightedOTIF(curRows); return <span style={{ fontWeight:800, color:otifColor(v) }}>{fmtPct(v)}</span>; })()}
                    </td>
                    <td style={{ padding:"10px 12px", fontWeight:700, color:"#F1F5F9" }}>{fmtDPC(calcWeightedDPC(curRows))}</td>
                    <td style={{ padding:"10px 12px", fontWeight:700, color:"#F1F5F9" }}>{fmtDPL(calcWeightedDPL(curRows))}</td>
                    <td style={{ padding:"10px 12px", fontWeight:700, color:"#F1F5F9" }}>{fmtK(calcTotalCost(curRows))}</td>
                    <td style={{ padding:"10px 12px", fontWeight:700, color:"#F1F5F9" }}>{curRows.reduce((s,r)=>s+r.cases,0).toLocaleString()}</td>
                    <td style={{ padding:"10px 12px", fontWeight:700, color:"#F1F5F9" }}>{curRows.reduce((s,r)=>s+r.orders,0)}</td>
                    <td style={{ padding:"10px 12px", fontWeight:700, color:"#F1F5F9" }}>{curRows.reduce((s,r)=>s+r.trucks,0)}</td>
                    <td style={{ padding:"10px 12px", fontWeight:700, color:"#F1F5F9" }}>{(curRows.reduce((s,r)=>s+r.weight,0)/1000).toFixed(0)}K</td>
                    <td/>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Per-Customer Cost Mini-Grid */}
            <div style={{ marginTop:"24px", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px" }}>
              {CUSTOMERS.filter(c=>activeCusts.has(c)).map(c => {
                const r = curRows.find(d => d.customer === c);
                const p = prevRows.find(d => d.customer === c);
                if (!r || r.orders === 0) return null;
                const prevOTIF = trendData.slice(-5).map(d => ({ wl:d.wl, v: d[`otif_${c.replace(" ","_")}`] }));
                return (
                  <div key={c} style={{ background:"#0D1525", borderRadius:"10px", padding:"14px", border:`1px solid ${COLORS[c]}22` }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"10px" }}>
                      <span style={{ width:"10px", height:"10px", borderRadius:"50%", background:COLORS[c] }}/>
                      <span style={{ fontWeight:700, color:COLORS[c] }}>{c}</span>
                      <span style={S.badge(r.status==="In Progress"?"#F59E0B20":"#34D39820", r.status==="In Progress"?"#FBBF24":"#34D399")}>{r.status}</span>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
                      {[
                        { l:"OT/IF", v:fmtPct(r.otif), color:otifColor(r.otif) },
                        { l:"$/Case", v:fmtDPC(r.dpc), color:"#818CF8" },
                        { l:"Cases",  v:r.cases.toLocaleString(), color:"#38BDF8" },
                        { l:"Cost",   v:r.cost>0?fmtK(r.cost):"—", color:"#F59E0B" },
                      ].map(({ l,v,color }) => (
                        <div key={l} style={{ background:"#111827", borderRadius:"8px", padding:"8px" }}>
                          <div style={{ fontSize:"10px", color:"#475569", textTransform:"uppercase", letterSpacing:"0.05em" }}>{l}</div>
                          <div style={{ fontSize:"16px", fontWeight:700, color, marginTop:"2px" }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    {/* Tiny sparkline for OT/IF */}
                    <div style={{ marginTop:"10px", height:"36px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={prevOTIF} margin={{top:2,right:2,bottom:2,left:2}}>
                          <Line type="monotone" dataKey="v" stroke={COLORS[c]} strokeWidth={2} dot={false} connectNulls />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{ fontSize:"10px", color:"#334155", marginTop:"2px", textAlign:"center" }}>OT/IF trend (5 wks)</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TRENDS TAB ── */}
        {tab === "trends" && (
          <div style={{ borderRadius:"0 12px 12px 12px" }}>
            <div style={{ ...S.card, borderRadius:"0 12px 0 0", borderBottom:"none", display:"flex", alignItems:"center", gap:"12px", padding:"12px 16px" }}>
              <span style={{ fontSize:"12px", color:"#475569", fontWeight:600 }}>Show last</span>
              {[8,16,24,43].map(n => (
                <button key={n} onClick={()=>setTrendRange(n)}
                  style={{ padding:"4px 12px", borderRadius:"6px", fontSize:"12px", fontWeight:600, cursor:"pointer", border:`1px solid ${trendRange===n?"#3B82F6":"#1F2D40"}`, background: trendRange===n?"#3B82F6":"transparent", color: trendRange===n?"#fff":"#475569" }}>
                  {n === 43 ? "All" : `${n} wks`}
                </button>
              ))}
            </div>

            {/* OT/IF Chart */}
            <div style={{ ...S.card, borderRadius:0, borderBottom:"none", marginTop:"1px" }}>
              <h4 style={{ margin:"0 0 16px", fontSize:"13px", color:"#94A3B8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>OT/IF % by Customer</h4>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={trendData} margin={{top:4,right:20,bottom:4,left:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2D40" />
                  <XAxis dataKey="wl" tick={{fill:"#475569", fontSize:10}} interval={trendRange<=8?0:trendRange<=16?1:2} angle={-30} textAnchor="end" height={40}/>
                  <YAxis domain={[40,100]} tick={{fill:"#475569", fontSize:10}} tickFormatter={v=>`${v}%`}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:"12px", paddingTop:"8px"}}/>
                  <ReferenceLine y={95} stroke="#34D39940" strokeDasharray="4 4" label={{value:"95% target", fill:"#34D39960", fontSize:10, position:"insideTopRight"}}/>
                  {CUSTOMERS.filter(c=>activeCusts.has(c)).map(c => (
                    <Line key={c} type="monotone" dataKey={`otif_${c.replace(" ","_")}`} name={c} stroke={COLORS[c]} strokeWidth={2} dot={{r:3,fill:COLORS[c]}} connectNulls activeDot={{r:5}}/>
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* $/Case Chart */}
            <div style={{ ...S.card, borderRadius:0, borderBottom:"none", marginTop:"1px" }}>
              <h4 style={{ margin:"0 0 4px", fontSize:"13px", color:"#94A3B8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>$/Case Trend</h4>
              <p style={{ margin:"0 0 12px", fontSize:"11px", color:"#334155" }}>Paid freight only (excludes Trader Joe's carrier-paid)</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={trendData} margin={{top:4,right:20,bottom:4,left:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2D40"/>
                  <XAxis dataKey="wl" tick={{fill:"#475569",fontSize:10}} interval={trendRange<=8?0:trendRange<=16?1:2} angle={-30} textAnchor="end" height={40}/>
                  <YAxis tick={{fill:"#475569",fontSize:10}} tickFormatter={v=>`$${v.toFixed(1)}`}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:"12px",paddingTop:"8px"}}/>
                  {["Costco","Kroger","Wal-Mart"].filter(c=>activeCusts.has(c)).map(c => (
                    <Line key={c} type="monotone" dataKey={`dpc_${c.replace(" ","_")}`} name={c} stroke={COLORS[c]} strokeWidth={2} dot={{r:3,fill:COLORS[c]}} connectNulls activeDot={{r:5}}/>
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* $/Lb Chart */}
            <div style={{ ...S.card, borderRadius:0, borderBottom:"none", marginTop:"1px" }}>
              <h4 style={{ margin:"0 0 4px", fontSize:"13px", color:"#94A3B8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>$/Lb Trend</h4>
              <p style={{ margin:"0 0 12px", fontSize:"11px", color:"#334155" }}>Paid freight only</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trendData} margin={{top:4,right:20,bottom:4,left:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2D40"/>
                  <XAxis dataKey="wl" tick={{fill:"#475569",fontSize:10}} interval={trendRange<=8?0:trendRange<=16?1:2} angle={-30} textAnchor="end" height={40}/>
                  <YAxis tick={{fill:"#475569",fontSize:10}} tickFormatter={v=>`$${v.toFixed(2)}`}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:"12px",paddingTop:"8px"}}/>
                  {["Costco","Kroger","Wal-Mart"].filter(c=>activeCusts.has(c)).map(c => (
                    <Line key={c} type="monotone" dataKey={`dpl_${c.replace(" ","_")}`} name={c} stroke={COLORS[c]} strokeWidth={2} dot={{r:3,fill:COLORS[c]}} connectNulls activeDot={{r:5}}/>
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Total Weekly Freight Cost Stacked Bar */}
            <div style={{ ...S.card, borderRadius:"0 0 12px 12px", marginTop:"1px" }}>
              <h4 style={{ margin:"0 0 16px", fontSize:"13px", color:"#94A3B8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>Total Weekly Freight Cost by Customer</h4>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={trendData} margin={{top:4,right:20,bottom:4,left:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2D40"/>
                  <XAxis dataKey="wl" tick={{fill:"#475569",fontSize:10}} interval={trendRange<=8?0:trendRange<=16?1:2} angle={-30} textAnchor="end" height={40}/>
                  <YAxis tick={{fill:"#475569",fontSize:10}} tickFormatter={v=>`$${(v/1000).toFixed(0)}K`}/>
                  <Tooltip content={<CustomTooltip/>} formatter={(v,n)=>[`$${(v/1000).toFixed(1)}K`,n]}/>
                  <Legend iconType="square" iconSize={10} wrapperStyle={{fontSize:"12px",paddingTop:"8px"}}/>
                  {CUSTOMERS.filter(c=>activeCusts.has(c)).map(c => (
                    <Bar key={c} dataKey={`cost_${c.replace(" ","_")}`} name={c} stackId="a" fill={COLORS[c]} fillOpacity={0.85}/>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── ISSUES LOG TAB ── */}
        {tab === "issues" && (
          <div style={{ ...S.card, borderRadius:"0 12px 12px 12px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"16px" }}>
              <h3 style={{ margin:0, fontSize:"13px", color:"#94A3B8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>
                Issues & Notes Log — {allIssues.length} entries
              </h3>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              {allIssues.map((r,i) => (
                <div key={i} style={{ background:"#0D1525", borderRadius:"10px", padding:"12px 14px", borderLeft:`3px solid ${COLORS[r.customer]||"#475569"}`, display:"flex", gap:"14px", alignItems:"flex-start" }}>
                  <div style={{ flexShrink:0, width:"90px" }}>
                    <div style={{ fontSize:"11px", color:COLORS[r.customer], fontWeight:700 }}>{r.customer}</div>
                    <div style={{ fontSize:"11px", color:"#334155", marginTop:"2px" }}>{r.wl}</div>
                    <div style={{ marginTop:"4px" }}>
                      <span style={{ ...S.badge(otifColor(r.otif)+"22", otifColor(r.otif)), fontSize:"10px" }}>{fmtPct(r.otif)}</span>
                    </div>
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ margin:0, fontSize:"13px", color:"#CBD5E1", lineHeight:"1.5" }}>{r.notes}</p>
                  </div>
                  <div style={{ flexShrink:0, textAlign:"right" }}>
                    {r.cost > 0 && <div style={{ fontSize:"12px", color:"#F59E0B", fontWeight:600 }}>{fmtK(r.cost)}</div>}
                    <div style={{ fontSize:"11px", color:"#334155", marginTop:"2px" }}>{r.cases.toLocaleString()} cs</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
