'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleDot,
  Clock3,
  FileText,
  Globe2,
  Hash,
  LayoutDashboard,
  ListChecks,
  Menu,
  Mic,
  Paperclip,
  Play,
  Plus,
  Search,
  Settings2,
  Sparkles,
  SquareArrowOutUpRight,
  Users,
  Wrench,
  X,
  Zap,
} from 'lucide-react'

type Stage = 'idle' | 'understand' | 'reason' | 'plan' | 'tools' | 'act' | 'deliver'

const navItems = [
  { no: '01', label: 'Command center', display: 'COMMAND', icon: LayoutDashboard },
  { no: '02', label: 'Tasks', display: 'TASKS', icon: ListChecks, count: '03' },
  { no: '03', label: 'Active agents', display: 'AGENTS', icon: Users },
  { no: '04', label: 'Toolbox', display: 'TOOLS', icon: Wrench },
  { no: '05', label: 'Activity', display: 'ACTIVITY', icon: Activity },
  { no: '06', label: 'History', display: 'HISTORY', icon: Clock3 },
  { no: '07', label: 'Settings', display: 'SETTINGS', icon: Settings2 },
]

const stages: { key: Stage; label: string; short: string; tone: string }[] = [
  { key: 'understand', label: 'UNDERSTAND', short: '01', tone: 'ink' },
  { key: 'reason', label: 'REASON', short: '02', tone: 'purple' },
  { key: 'plan', label: 'PLAN', short: '03', tone: 'yellow' },
  { key: 'tools', label: 'TOOLS', short: '04', tone: 'blue' },
  { key: 'act', label: 'ACT', short: '05', tone: 'orange' },
  { key: 'deliver', label: 'DELIVER', short: '06', tone: 'lime' },
]

const toolEvents = [
  { time: '12:31:04', agent: 'UNDERSTAND', detail: 'Intent extracted: delayed scholarship payment', tone: 'blue' },
  { time: '12:31:06', agent: 'SEARCH TOOL', detail: 'Searching relevant scholarship requirements', tone: 'lime' },
  { time: '12:31:09', agent: 'KNOWLEDGE TOOL', detail: 'Matching payment verification process', tone: 'lime' },
  { time: '12:31:12', agent: 'REASONING ENGINE', detail: 'Potential blockage identified', tone: 'blue' },
  { time: '12:31:15', agent: 'CHECKLIST TOOL', detail: 'Generating required documents', tone: 'orange' },
  { time: '12:31:18', agent: 'ACTION AGENT', detail: 'Creating next-step plan', tone: 'orange' },
]

function Logo() {
  return (
    <div className="brand-lockup">
      <div className="brand-mark" aria-hidden="true">
        <span className="mk mk-a" />
        <span className="mk mk-b" />
        <span className="mk mk-c" />
        <span className="mk mk-d" />
        <span className="mk mk-e" />
        <span className="mk-node" />
      </div>
      <div>
        <div className="brand-name">SAARTHI</div>
        <div className="brand-sub">ACTION AGENT FOR BHARAT</div>
      </div>
    </div>
  )
}

function Sidebar({ active, onSelect, onClose }: { active: string; onSelect: (item: string) => void; onClose?: () => void }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <Logo />
        {onClose && <button className="icon-button mobile-only" aria-label="Close menu" onClick={onClose}><X /></button>}
      </div>
      <div className="sidebar-rule" />
      <nav aria-label="Main navigation">
        <div className="nav-label">01 — 07 / WORKSPACE</div>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button key={item.label} className={`nav-item ${active === item.label ? 'active' : ''}`} onClick={() => onSelect(item.label)}>
              <span className="nav-no">{item.no}</span>
              <Icon className="nav-icon" />
              <span className="nav-text">{item.display}</span>
              {item.count && <b>{item.count}</b>}
              {active === item.label && <ChevronRight className="nav-arrow" />}
            </button>
          )
        })}
      </nav>
      <div className="sidebar-rule lower" />
      <div className="nav-label">08 / SYSTEM</div>
      <button className={`nav-item ${active === 'Integrations' ? 'active' : ''}`} onClick={() => onSelect('Integrations')}>
        <span className="nav-no">08</span>
        <Globe2 className="nav-icon" />
        <span className="nav-text">INTEGRATIONS</span>
      </button>
      <div className="sidebar-footer">
        <div className="online-dot" /> <span>AGENT ONLINE</span>
        <span className="mono">v.0.8.4</span>
      </div>
    </aside>
  )
}

function Pipeline({ stage }: { stage: Stage }) {
  const activeIndex = stages.findIndex((s) => s.key === stage)
  return (
    <div className="pipeline" aria-label="Agent workflow progress">
      {stages.map((item, index) => (
        <div
          className={`pipeline-step tone-${item.tone} ${index <= activeIndex ? 'complete' : ''} ${item.key === stage ? 'current' : ''}`}
          key={item.key}
        >
          <div className="pipeline-box">
            <div className="pipeline-node">{index < activeIndex ? <Check /> : item.short}</div>
            <div className="pipeline-copy">
              <strong>{item.label}</strong>
              <small>{index < activeIndex ? 'COMPLETE' : item.key === stage ? 'IN PROGRESS' : 'QUEUED'}</small>
            </div>
          </div>
          {index < stages.length - 1 && <div className="pipeline-line" />}
        </div>
      ))}
    </div>
  )
}

function ToolCard({ name, status, detail, icon: Icon, color }: { name: string; status: string; detail: string; icon: typeof Search; color: string }) {
  return (
    <div className={`tool-card tool-${color}`}>
      <div className="tool-top">
        <div className="tool-icon"><Icon /></div>
        <div>
          <strong>{name}</strong>
          <span>{status}</span>
        </div>
        <SquareArrowOutUpRight className="tool-open" />
      </div>
      <p>{detail}</p>
      <div className="tool-bar"><span /></div>
    </div>
  )
}

function Workspace({ onNew }: { onNew: () => void }) {
  const [stage, setStage] = useState<Stage>('understand')
  const [approved, setApproved] = useState(false)
  useEffect(() => { const timer = setInterval(() => setStage((current) => { const next = stages[stages.findIndex((s) => s.key === current) + 1]; return next?.key ?? 'deliver' }), 4200); return () => clearInterval(timer) }, [])
  const stageIndex = stages.findIndex((item) => item.key === stage)
  return (
    <div className="workspace-content">
      <div className="workspace-title-row">
        <div>
          <div className="eyebrow"><span className="pulse-dot" /> REQUEST #ST-1042 / AGENT WORKSPACE</div>
          <h1>Scholarship payment issue<span className="accent-blue">.</span></h1>
          <p className="muted">The agent is turning a messy request into your next move.</p>
        </div>
        <button className="new-request" onClick={onNew}><Plus /> NEW REQUEST</button>
      </div>

      <div className="pipeline-wrap">
        <div className="pipeline-head">
          <span className="kicker">AGENT PIPELINE</span>
          <span className="mono">RUN #ST-1042 / {stage.toUpperCase()}</span>
        </div>
        <Pipeline stage={stage} />
      </div>

      <div className="workspace-grid">
        <section className="main-panel">
          <div className="panel-label">
            <span className="section-number">0{Math.min(stageIndex + 1, 6)}</span> LIVE AGENT OUTPUT <span className="line" />
          </div>

          {stage === 'understand' && (
            <div className="stage-view">
              <div className="stage-heading">
                <div>
                  <span className="kicker blue">REQUEST UNDERSTANDING</span>
                  <h2>We found the shape<br />of your problem.</h2>
                </div>
                <div className="confidence"><span>CONFIDENCE</span><b>96%</b></div>
              </div>
              <div className="intent-box">
                <div className="intent-title"><CircleDot /> INTENT <strong>Scholarship status issue</strong></div>
                <div className="entity-grid">{['Student', 'Scholarship', 'Payment', 'Institution'].map((e) => <div key={e}><Hash /> {e}</div>)}</div>
              </div>
              <div className="check-list">
                <div><Check /> Intent extracted</div>
                <div><Check /> Key entities identified</div>
                <div className="pending"><Zap /> Missing information detected</div>
              </div>
            </div>
          )}

          {stage === 'reason' && (
            <div className="stage-view">
              <span className="kicker purple">REASONING SUMMARY</span>
              <h2>The next useful step<br />is now clear.</h2>
              <p className="reasoning-copy">“The request appears to involve a delayed scholarship payment. We need to identify the scholarship process, determine whether payment status can be checked, and find the right escalation path.”</p>
              <div className="assumptions">
                <span>ASSUMPTIONS</span>
                <p>• Student application exists</p>
                <p>• Institution verification may be required</p>
                <p>• Payment status is unknown</p>
              </div>
            </div>
          )}

          {stage === 'plan' && (
            <div className="stage-view">
              <span className="kicker orange">PLAN / 04 STEPS</span>
              <h2>An executable plan<br />is ready.</h2>
              <div className="plan-list">
                {['Identify scholarship', 'Check status requirements', 'Determine likely blockage', 'Generate next action'].map((x, i) => (
                  <div className={i < 2 ? 'done' : i === 2 ? 'selected' : ''} key={x}>
                    <b>0{i + 1}</b><span>{x}</span>{i < 2 ? <Check /> : <ChevronRight />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {stage === 'tools' && (
            <div className="stage-view">
              <span className="kicker lime">TOOL EXECUTION / LIVE</span>
              <h2>Watching the agent<br />do the work.</h2>
              <div className="tools-grid">
                <ToolCard name="WEB SEARCH" status="COMPLETE" detail="3 relevant sources found" icon={Search} color="lime" />
                <ToolCard name="KNOWLEDGE BASE" status="COMPLETE" detail="Process matched" icon={Globe2} color="blue" />
                <ToolCard name="ELIGIBILITY CHECKER" status="RUNNING" detail="Verifying requirements…" icon={ListChecks} color="orange" />
              </div>
            </div>
          )}

          {(stage === 'act' || stage === 'deliver') && (
            <div className="stage-view">
              <span className="kicker orange">YOUR NEXT MOVE</span>
              <h2>Prepare your<br />escalation request.</h2>
              <p className="muted stage-lede">SAARTHI found a likely verification hold. Here is what you need to move forward.</p>
              <div className="action-output">
                <div className="action-head">
                  <FileText /> <span>CHECKLIST / ST-1042</span><span className="ready">READY FOR YOUR APPROVAL</span>
                </div>
                <div className="next-moves">
                  <div className="next-move lead">
                    <b>01</b>
                    <div className="next-move-body">
                      <strong>CHECK DOCUMENT</strong>
                      <div className="check-list inline">
                        {['Application ID', 'Student ID', 'Bank details', 'Payment reference'].map((x) => (
                          <div className="check-row" key={x}><span className="check-square" /> {x}<span className="required">REQUIRED</span></div>
                        ))}
                      </div>
                    </div>
                    <span className="move-flag">DO THIS FIRST</span>
                  </div>
                  <div className="next-move">
                    <b>02</b>
                    <div className="next-move-body">
                      <strong>SUBMIT REQUEST</strong>
                      <p>Send the escalation with your checklist attached.</p>
                    </div>
                  </div>
                  <div className="next-move">
                    <b>03</b>
                    <div className="next-move-body">
                      <strong>TRACK STATUS</strong>
                      <p>Follow the reference number until the payment clears.</p>
                    </div>
                  </div>
                </div>
                <button className={`generate-button ${approved ? 'approved' : ''}`} onClick={() => setApproved(true)}>
                  {approved ? <><Check /> REQUEST GENERATED</> : <>GENERATE ESCALATION REQUEST <ArrowUpRight /></>}
                </button>
              </div>
            </div>
          )}
        </section>

        <aside className="activity-panel">
          <div className="panel-label"><span className="section-number alt">SYS</span> AGENT ACTIVITY <span className="line" /></div>
          <div className="activity-status"><span className="pulse-dot" /> SYSTEM EVENT STREAM <span className="mono">LIVE</span></div>
          <div className="events">
            {toolEvents.map((event, i) => (
              <div className={`event ${i <= stageIndex ? 'revealed' : ''}`} key={event.time}>
                <time>{event.time}</time>
                <div className={`event-marker ${event.tone}`} />
                <div><strong>{event.agent}</strong><p>{event.detail}</p></div>
              </div>
            ))}
          </div>
          <div className="memory-card">
            <div className="memory-top"><Sparkles /> SAARTHI REMEMBERS</div>
            <strong>Scholarship issue</strong>
            <p>Next step: upload application ID</p>
            <div className="memory-progress"><span /></div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Landing({ onStart, onDemo }: { onStart: () => void; onDemo: () => void }) {
  return (
    <div className="landing">
      <div className="landing-grid" />
      <span className="corner-note note-a mono">FIG. 01 / COMMAND SURFACE</span>
      <span className="corner-note note-b mono">28.61°N / 77.20°E — NEW DELHI</span>
      <header className="landing-header">
        <Logo />
        <div className="header-right">
          <span className="system-chip"><span className="online-dot" /> AGENT ONLINE</span>
          <button className="language"><Globe2 /> ENGLISH <ChevronRight /></button>
        </div>
      </header>
      <main className="hero">
        <div className="hero-copy">
          <div className="hero-kicker"><span>01</span> REAL-WORLD PROBLEM SOLVING / BHARAT</div>
          <h1>YOU HAVE<br /><em>A PROBLEM.</em><br /><strong>SAARTHI TAKES<br />IT FROM HERE<span className="accent-lime">.</span></strong></h1>
          <p>An AI action agent that understands problems, reasons through them, uses tools and turns decisions into real next steps.</p>
          <div className="hero-actions">
            <button className="primary-cta" onClick={onStart}>ASK SAARTHI <ArrowUpRight /></button>
            <button className="secondary-cta" onClick={onDemo}><Play /> WATCH AGENT WORK</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-header"><span>AGENT WORKFLOW / DEMO</span><span className="mono">ID: AGENT-07</span></div>
          <div className="request-card">
            <span className="kicker blue">REQUEST RECEIVED</span>
            <p>“My scholarship hasn't arrived and I don't know what to do.”</p>
            <div className="request-footer"><span>USER / STUDENT</span><span>12:31:02</span></div>
          </div>
          <div className="flow-steps">
            {['REQUEST', 'UNDERSTAND', 'REASON', 'PLAN', 'TOOLS', 'ACTION', 'DONE'].map((x, i) => (
              <div className={`flow-step step-${i}`} key={x}>
                <span className="flow-node">{i === 6 ? <Check /> : i + 1}</span>
                <strong>{x}</strong>
                {i < 6 && <span className="flow-connector" />}
              </div>
            ))}
          </div>
          <div className="event-strip">
            <span><span className="event-dot" /> PROCESS IDENTIFIED</span>
            <span>DOCUMENT REQUIREMENT FOUND</span>
            <span>DEADLINE CHECKED</span>
          </div>
        </div>
      </main>
      <section className="landing-bottom">
        <div>
          <span className="kicker orange">THE DIFFERENCE</span>
          <h2>FROM QUESTION<br /><span>TO ACTION.</span></h2>
        </div>
        <div className="bottom-description">
          SAARTHI does not just answer. It understands, reasons, plans, uses tools, and delivers something you can use.
          <span className="mono">SAARTHI / UNDERSTAND → REASON → ACT</span>
        </div>
      </section>
      <footer className="landing-footer">
        <span>© 2026 SAARTHI</span>
        <span>ACTION AGENT FOR BHARAT</span>
        <span>BUILT FOR THE REAL WORLD <ArrowUpRight /></span>
      </footer>
    </div>
  )
}

export default function Page() {
  const [view, setView] = useState<'landing' | 'app'>('landing')
  const [activeNav, setActiveNav] = useState('Command center')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [request, setRequest] = useState('')
  const [showComposer, setShowComposer] = useState(false)
  const goApp = () => setView('app')
  const navSelect = (item: string) => { setActiveNav(item); setView('app'); setMobileMenu(false) }
  const contextLabel = useMemo(() => activeNav === 'Command center' ? 'COMMAND CENTER' : activeNav.toUpperCase(), [activeNav])
  if (view === 'landing') return <Landing onStart={() => { setView('app'); setShowComposer(true) }} onDemo={goApp} />
  return (
    <div className="app-shell">
      <div className={`mobile-overlay ${mobileMenu ? 'show' : ''}`} onClick={() => setMobileMenu(false)} />
      <div className={`sidebar-wrap ${mobileMenu ? 'open' : ''}`}>
        <Sidebar active={activeNav} onSelect={navSelect} onClose={() => setMobileMenu(false)} />
      </div>
      <main className="app-main">
        <header className="app-header">
          <button className="icon-button mobile-only" aria-label="Open menu" onClick={() => setMobileMenu(true)}><Menu /></button>
          <div className="header-context"><span className="mono">SAARTHI /</span> {contextLabel}</div>
          <div className="app-header-right">
            <span className="location"><span className="online-dot" /> NEW DELHI, IN</span>
            <button className="icon-button" aria-label="Search"><Search /></button>
            <button className="avatar">AK</button>
          </div>
        </header>

        {activeNav === 'Command center' ? (
          <div className="app-scroll">
            <div className="request-banner">
              <div className="banner-copy">
                <span className="kicker lime">AGENT ONLINE / READY</span>
                <h2>What do you need<br /><span>to get done?</span></h2>
                <p className="banner-sub">DESCRIBE A PROBLEM. SAARTHI WILL TURN IT INTO ACTION.</p>
              </div>
              <div className="banner-stats">
                <span className="mega-stat"><b>06</b><span className="stat-label">ACTIVE AGENTS</span></span>
                <span className="mega-stat"><b>14</b><span className="stat-label">TOOLS READY</span></span>
                <span className="mega-stat"><b>27</b><span className="stat-label">ACTIONS COMPLETED</span></span>
              </div>
            </div>

            {showComposer && (
              <div className="composer">
                <div className="composer-head">
                  <span className="composer-tag">NEW MISSION</span>
                  <span className="mono">INPUT / 01 — CONSOLE</span>
                </div>
                <textarea
                  autoFocus
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  placeholder="Describe the problem naturally. SAARTHI will understand, reason, plan and act."
                  aria-label="Describe your problem"
                />
                <div className="composer-bottom">
                  <div className="composer-tools">
                    <button className="small-tool"><Paperclip /> ADD FILE</button>
                    <button className="small-tool"><Mic /> VOICE</button>
                  </div>
                  <button className="send-button" onClick={() => { setShowComposer(false); setRequest('') }}>EXECUTE <ArrowUpRight /></button>
                </div>
              </div>
            )}

            <Workspace onNew={() => setShowComposer(true)} />
          </div>
        ) : (
          <div className="app-scroll">
            <div className="empty-section">
              <span className="kicker blue">{contextLabel}</span>
              <h1>{contextLabel}</h1>
              <p>This workspace is ready for your next mission.</p>
              <div className="empty-meta mono">SECTION / NO ACTIVE DATA</div>
              <button className="primary-cta" onClick={() => { setActiveNav('Command center'); setShowComposer(true) }}>NEW REQUEST <ArrowUpRight /></button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
