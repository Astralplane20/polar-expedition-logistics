/**
 * POLAR NIGHT COMMAND — Main mission-control canvas
 * Design language: polar-night navy, safety orange exceptions, ice-cyan telemetry,
 * Space Grotesk + IBM Plex Mono, asymmetric operations-first layout.
 */
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowUpRight,
  Box,
  ChevronDown,
  CircleDot,
  Clock3,
  Compass,
  Fuel,
  Gauge,
  Layers3,
  MapPinned,
  Menu,
  PackageCheck,
  Radio,
  Route as RouteIcon,
  Search,
  Settings2,
  ShieldCheck,
  Snowflake,
  Truck,
  Users,
  X,
  Zap,
} from "lucide-react";

type ViewKey = "Overview" | "Routes" | "Inventory" | "Assets" | "People" | "Reports";

const navItems: { label: ViewKey; icon: typeof Gauge }[] = [
  { label: "Overview", icon: Gauge },
  { label: "Routes", icon: RouteIcon },
  { label: "Inventory", icon: PackageCheck },
  { label: "Assets", icon: Truck },
  { label: "People", icon: Users },
  { label: "Reports", icon: Layers3 },
];

const routeWaypoints = [
  { name: "Cape Discovery", code: "CP-01", x: "15%", y: "68%", state: "complete" },
  { name: "Kestrel Camp", code: "KC-04", x: "36%", y: "51%", state: "complete" },
  { name: "Meridian Shelf", code: "MS-07", x: "58%", y: "36%", state: "active" },
  { name: "Aurora Depot", code: "AD-12", x: "80%", y: "22%", state: "pending" },
];

const inventory = [
  { label: "Jet A-1 fuel", value: "68%", detail: "14,920 L available", progress: 68, tone: "orange", icon: Fuel },
  { label: "Provisions", value: "82%", detail: "21 days covered", progress: 82, tone: "cyan", icon: Box },
  { label: "Medical stores", value: "94%", detail: "All critical lines full", progress: 94, tone: "green", icon: ShieldCheck },
  { label: "Shelter systems", value: "76%", detail: "4 of 5 deployable", progress: 76, tone: "purple", icon: Snowflake },
];

const assets = [
  { name: "Kestrel 02", type: "Tracked carrier", signal: "98%", location: "MS-07 / East corridor", status: "In transit", tone: "cyan" },
  { name: "Twin Otter 7", type: "Fixed-wing aircraft", signal: "84%", location: "Kestrel Camp", status: "Standby", tone: "orange" },
  { name: "Mule 04", type: "Cargo sled", signal: "—", location: "Cape Discovery", status: "Service due", tone: "red" },
];

const alerts = [
  { title: "Fuel margin tightening", text: "East corridor burn rate is 8% above plan.", time: "08 min ago", tone: "orange" },
  { title: "Weather window confirmed", text: "Visibility opens for Aurora Depot at 14:20Z.", time: "22 min ago", tone: "cyan" },
  { title: "Service interval reached", text: "Mule 04 requires a track inspection before redeploy.", time: "41 min ago", tone: "red" },
];

function StatusPill({ children, tone = "cyan" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`status-pill ${tone}`}>{children}</span>;
}

function ProgressBar({ value, tone }: { value: number; tone: string }) {
  return <div className="progress-track"><div className={`progress-fill ${tone}`} style={{ width: `${value}%` }} /></div>;
}

function MapPanel() {
  return (
    <section className="panel map-panel">
      <div className="panel-header">
        <div>
          <div className="eyebrow"><MapPinned size={13} /> LIVE ROUTE PICTURE</div>
          <h2>East corridor / Traverse 04</h2>
        </div>
        <div className="panel-actions"><StatusPill tone="green"><CircleDot size={10} /> Telemetry nominal</StatusPill><button className="icon-button" aria-label="Map options" onClick={() => toast.info("Map layers are ready for route planning in the next prototype pass.")}><Settings2 size={16} /></button></div>
      </div>
      <div className="map-stage">
        <img src="/manus-storage/ice-shelf-texture_084de536.jpg" alt="Satellite-style ice shelf texture" />
        <div className="map-wash" />
        <div className="map-grid" />
        <div className="route-line" />
        <div className="map-label top-label">84° 17' S&nbsp;&nbsp; 112° 04' E</div>
        <div className="map-label bottom-label">ICE CLASS / ROUTE WINDOW 04</div>
        {routeWaypoints.map((point) => <div key={point.code} className={`waypoint ${point.state}`} style={{ left: point.x, top: point.y }}><span className="waypoint-dot" /><div className="waypoint-copy"><strong>{point.code}</strong><small>{point.name}</small></div></div>)}
        <div className="vehicle-tag"><Truck size={14} /> KESTREL 02 <span>64 km/h</span></div>
        <div className="map-scale"><span>0</span><i /><span>50 km</span></div>
      </div>
      <div className="map-footer"><div><span className="muted-label">ETA TO AURORA DEPOT</span><strong>18:42Z</strong></div><div><span className="muted-label">ROUTE DISTANCE</span><strong>126 km</strong></div><div><span className="muted-label">ICE RISK</span><strong className="orange-text">Moderate</strong></div><button className="text-button" onClick={() => toast.success("Route brief queued for export.")}>Open route brief <ArrowUpRight size={14} /></button></div>
    </section>
  );
}

function Overview() {
  const [acknowledged, setAcknowledged] = useState<string[]>([]);
  const [feedFilter, setFeedFilter] = useState("All activity");
  const currentAlerts = useMemo(() => acknowledged.length ? alerts.filter((_, index) => !acknowledged.includes(String(index))) : alerts, [acknowledged]);
  return <>
    <div className="hero-strip"><div><div className="eyebrow accent"><Radio size={13} /> CURRENT CONDITION / EAST CORRIDOR</div><h1>Corridor holds. <em>Margin is tightening.</em></h1><p>Traverse 04 is on schedule. Fuel burn is <strong>8% above plan</strong>; the next weather window opens in <strong>04h 18m.</strong></p></div><div className="hero-meta"><div><span>LAST SYNC</span><strong>09:42:18Z</strong></div><div><span>LOCAL TEMP</span><strong>-31°C</strong></div><div><span>CREW ON ICE</span><strong>18 / 24</strong></div></div></div>
    <div className="metric-row"><div className="metric-card readiness"><div className="metric-icon"><ShieldCheck size={20} /></div><div><span className="metric-label">MISSION READINESS</span><strong>86<span>%</span></strong><small><span className="positive">+4.2%</span> since last sync</small></div><div className="readiness-ring"><svg viewBox="0 0 44 44"><circle className="ring-bg" cx="22" cy="22" r="18" /><circle className="ring-value" cx="22" cy="22" r="18" /></svg></div></div><div className="metric-card"><div className="metric-icon cyan"><RouteIcon size={20} /></div><div><span className="metric-label">ACTIVE ROUTES</span><strong>04</strong><small><span className="positive">03 nominal</span> · 01 watch</small></div></div><div className="metric-card"><div className="metric-icon orange"><AlertTriangle size={20} /></div><div><span className="metric-label">OPEN EXCEPTIONS</span><strong>03</strong><small><span className="orange-text">02 require action</span></small></div></div><div className="metric-card"><div className="metric-icon purple"><Zap size={20} /></div><div><span className="metric-label">RESOURCE COVER</span><strong>21<span className="unit">d</span></strong><small>at current burn rate</small></div></div></div>
    <div className="content-grid"><MapPanel /><aside className="panel alert-panel"><div className="panel-header"><div><div className="eyebrow"><AlertTriangle size={13} /> COMMAND ATTENTION</div><h2>Exceptions & signals</h2></div><span className="count-badge">{currentAlerts.length.toString().padStart(2, "0")}</span></div><div className="alert-list">{currentAlerts.map((alert) => { const originalIndex = alerts.indexOf(alert); return <div className={`alert-item ${alert.tone}`} key={alert.title}><div className="alert-marker" /><div className="alert-body"><div className="alert-title"><strong>{alert.title}</strong><span>{alert.time}</span></div><p>{alert.text}</p><button onClick={() => { setAcknowledged((prev) => [...prev, String(originalIndex)]); toast.success("Signal acknowledged."); }}>Acknowledge <ArrowUpRight size={12} /></button></div></div>; })}{currentAlerts.length === 0 && <div className="empty-state"><ShieldCheck size={24} /><p>All command signals acknowledged.</p></div>}</div><button className="panel-footer-button" onClick={() => toast.info("Incident log opening soon.")}>View incident log <ArrowUpRight size={14} /></button></aside></div>
    <div className="lower-grid"><section className="panel inventory-panel"><div className="panel-header"><div><div className="eyebrow"><PackageCheck size={13} /> RESOURCE COVERAGE</div><h2>Provisioning at a glance</h2></div><button className="text-button" onClick={() => toast.info("Inventory view selected.")}>Manage inventory <ArrowUpRight size={14} /></button></div><div className="inventory-list">{inventory.map((item) => { const Icon = item.icon; return <div className="inventory-item" key={item.label}><div className={`inventory-icon ${item.tone}`}><Icon size={16} /></div><div className="inventory-info"><div><strong>{item.label}</strong><span>{item.value}</span></div><ProgressBar value={item.progress} tone={item.tone} /><small>{item.detail}</small></div></div>; })}</div></section><section className="panel movement-panel"><div className="panel-header"><div><div className="eyebrow"><Clock3 size={13} /> MOVEMENT LOG</div><h2>Latest field activity</h2></div><button className="icon-button" onClick={() => toast.info("Movement history is available in the full operations build.")}><Search size={16} /></button></div><div className="filter-row">{["All activity", "Vehicles", "People"].map((filter) => <button key={filter} className={feedFilter === filter ? "active" : ""} onClick={() => setFeedFilter(filter)}>{filter}</button>)}</div><div className="movement-list"><div className="movement-item"><div className="movement-time">09:38Z</div><div className="movement-dot cyan" /><div><strong>Kestrel 02 crossed waypoint MS-07</strong><small>East corridor · In transit · 64 km/h</small></div><StatusPill>ON ROUTE</StatusPill></div><div className="movement-item"><div className="movement-time">09:21Z</div><div className="movement-dot orange" /><div><strong>Dr. Lena Ortiz checked in at Kestrel Camp</strong><small>Medical lead · Comms channel 02</small></div><StatusPill tone="orange">CHECKED IN</StatusPill></div><div className="movement-item"><div className="movement-time">08:56Z</div><div className="movement-dot purple" /><div><strong>Provision cache scanned into Aurora Depot</strong><small>28 cases · Receiving complete</small></div><StatusPill tone="purple">LOGGED</StatusPill></div></div></section></div>
  </>;
}

function SecondaryView({ view }: { view: ViewKey }) {
  const configs: Record<Exclude<ViewKey, "Overview">, { eyebrow: string; title: string; desc: string; icon: typeof RouteIcon }> = { Routes: { eyebrow: "ROUTE PLANNING", title: "Routes & weather windows", desc: "Compare corridors, waypoint status, and travel windows before committing a movement plan.", icon: RouteIcon }, Inventory: { eyebrow: "SUPPLY CONTROL", title: "Inventory & stock cover", desc: "Track fuel, provisions, medicine, and deployable shelter systems against the current burn model.", icon: PackageCheck }, Assets: { eyebrow: "FLEET CONTROL", title: "Assets & telemetry", desc: "Monitor vehicles, aircraft, sleds, and field equipment by location, signal, and service interval.", icon: Truck }, People: { eyebrow: "CREW ROSTER", title: "People & duty status", desc: "A clear field view of who is on ice, who is checked in, and who is scheduled for the next movement.", icon: Users }, Reports: { eyebrow: "MISSION RECORD", title: "Reports & handover", desc: "Assemble route briefs, inventory snapshots, and incident summaries for shift change or export.", icon: Layers3 } };
  const config = configs[view as Exclude<ViewKey, "Overview">]; const Icon = config.icon;
  return <div className="secondary-view"><div className="secondary-hero"><div className="secondary-icon"><Icon size={28} /></div><div><div className="eyebrow accent">{config.eyebrow} <span className="slash-label">// POLARIS 06</span></div><h1>{config.title}</h1><p>{config.desc}</p></div></div><div className="secondary-placeholder panel"><div className="placeholder-map"><Compass size={42} /><div><strong>Operational layer ready</strong><span>This view is wired as a functional prototype surface. Connect live expedition data here in the next build.</span></div><button className="primary-button" onClick={() => toast.success(`${view} workspace marked for implementation.`)}>Mark for build <ArrowUpRight size={15} /></button></div></div></div>;
}

export default function Home() {
  const [activeView, setActiveView] = useState<ViewKey>("Overview"); const [sidebarOpen, setSidebarOpen] = useState(false);
  const switchView = (view: ViewKey) => { setActiveView(view); setSidebarOpen(false); if (view !== "Overview") toast.info(`${view} workspace loaded.`); };
  return <div className="app-shell"><aside className={`sidebar ${sidebarOpen ? "open" : ""}`}><div className="brand"><div className="brand-mark"><img src="/manus-storage/north-star-mark_5aa3d0b6.png" alt="Northstar mark" /></div><div><strong>NORTHSTAR <span>/</span> OPS</strong><small>EXPEDITION COMMAND</small></div><button className="mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><X size={18} /></button></div><div className="mission-select"><span>ACTIVE MISSION</span><button onClick={() => toast.info("Mission switcher is coming in the next prototype pass.")}>POLARIS 06 <ChevronDown size={14} /></button></div><nav>{navItems.map(({ label, icon: Icon }) => <button key={label} className={activeView === label ? "active" : ""} onClick={() => switchView(label)}><Icon size={17} /><span>{label}</span>{label === "Overview" && <i className="nav-pulse" />}</button>)}</nav><div className="sidebar-bottom"><div className="sync-card"><div className="sync-status"><span /> System nominal</div><small>Last sync 09:42:18Z</small><div className="sync-line"><i /></div></div><button className="sidebar-settings" onClick={() => toast.info("System settings are available in the full operations build.")}><Settings2 size={16} /> System settings</button><div className="operator"><div className="operator-avatar">SK</div><div><strong>S. Kaur</strong><small>Mission control</small></div><button onClick={() => toast.info("Operator profile opened.")}><ChevronDown size={14} /></button></div></div></aside><div className="mobile-topbar"><button onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="mobile-brand"><img src="/manus-storage/north-star-mark_5aa3d0b6.png" alt="" /> NORTHSTAR / OPS</div><span className="mobile-status"><span /> LIVE</span></div><main className="main-canvas"><header className="topbar"><div className="breadcrumb"><span>POLARIS 06</span><i>/</i><strong>{activeView.toUpperCase()}</strong></div><div className="topbar-actions"><div className="live-chip"><span /> LIVE LINK <b>09:42Z</b></div><button className="topbar-button" onClick={() => toast.info("Search is ready for the connected operations dataset.")}><Search size={16} /></button><button className="topbar-button" onClick={() => toast.info("No new notifications.")}><AlertTriangle size={16} /><i /></button><div className="date-chip">05 SEP 2026 <span>·</span> ANTARCTICA</div></div></header><div className="canvas-content">{activeView === "Overview" ? <Overview /> : <SecondaryView view={activeView} />}</div><footer className="canvas-footer"><span>NORTHSTAR OPS / POLARIS 06</span><span>SECURE FIELD NETWORK <i /> V.0.8 PROTOTYPE</span></footer></main></div>;
}
