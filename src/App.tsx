import { useEffect, useRef, useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CodePlaygroundView } from './components/CodePlaygroundView';
import { DashboardView } from './components/DashboardView';
import { RoboticsLabView } from './components/RoboticsLabView';
import { PhysicsMathView } from './components/PhysicsMathView';
import { ChallengesView } from './components/ChallengesView';
import { MyProjectsView } from './components/MyProjectsView';
import { DocsApiView } from './components/DocsApiView';
import { SettingsView } from './components/SettingsView';
import { CHALLENGES, LABS } from './data/labs';
import { sameCoord } from './engine/astar';
import { executeRoverPython } from './engine/pythonSandbox';
import {
  ChallengeItem,
  ExecutionResult,
  GridCoord,
  NavTabId,
  SandboxSettings,
  SavedProject,
  TerminalLine,
} from './types/sandbox';

const STORAGE_KEYS = {
  PROJECTS: 'stem_sandbox_projects_v1',
  XP: 'stem_sandbox_xp_v1',
  COMPLETED_LABS: 'stem_sandbox_completed_labs_v1',
  COMPLETED_CHALLENGES: 'stem_sandbox_completed_challenges_v1',
  SETTINGS: 'stem_sandbox_settings_v1',
};

const DEFAULT_SETTINGS: SandboxSettings = {
  editorFontSize: 13,
  stepDelayMs: 220,
  defaultHeuristicWeight: 1.25,
  hardwareBridgeConnected: true,
  showExploredNodes: false,
};

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function App() {
  const [activeTab, setActiveTab] = useState<NavTabId>('code-playground');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [activeLabId, setActiveLabId] = useState<string>(LABS[0].id);
  const activeLab = LABS.find((l) => l.id === activeLabId) ?? LABS[0];

  const [settings, setSettings] = useState<SandboxSettings>(() =>
    loadJson(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS),
  );
  const [xp, setXp] = useState<number>(() => loadJson(STORAGE_KEYS.XP, 1250));
  const [completedLabIds, setCompletedLabIds] = useState<string[]>(() =>
    loadJson(STORAGE_KEYS.COMPLETED_LABS, []),
  );
  const [completedChallengeIds, setCompletedChallengeIds] = useState<string[]>(() =>
    loadJson(STORAGE_KEYS.COMPLETED_CHALLENGES, []),
  );
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>(() =>
    loadJson(STORAGE_KEYS.PROJECTS, []),
  );

  const [code, setCode] = useState<string>(activeLab.starterCode);
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);

  const [result, setResult] = useState<ExecutionResult>(() =>
    executeRoverPython(LABS[0].starterCode, LABS[0]),
  );
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(() =>
    Math.max(0, executeRoverPython(LABS[0].starterCode, LABS[0]).steps.length - 1),
  );
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>(
    () => executeRoverPython(LABS[0].starterCode, LABS[0]).terminalLines,
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const simTimerRef = useRef<number | null>(null);

  // Persist user data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.XP, JSON.stringify(xp));
  }, [xp]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_LABS, JSON.stringify(completedLabIds));
  }, [completedLabIds]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.COMPLETED_CHALLENGES,
      JSON.stringify(completedChallengeIds),
    );
  }, [completedChallengeIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(savedProjects));
  }, [savedProjects]);

  useEffect(() => {
    return () => {
      if (simTimerRef.current) window.clearInterval(simTimerRef.current);
    };
  }, []);

  const stopAnimation = () => {
    if (simTimerRef.current) {
      window.clearInterval(simTimerRef.current);
      simTimerRef.current = null;
    }
    setIsSimulating(false);
  };

  const runCodeWithAnimation = (sourceCode: string, lab = activeLab, weightOverride?: number) => {
    stopAnimation();
    setIsRunning(true);

    window.setTimeout(() => {
      const nextResult = executeRoverPython(sourceCode, lab, weightOverride);
      setResult(nextResult);
      setTerminalLines(nextResult.terminalLines);
      setIsRunning(false);

      if (nextResult.success && nextResult.steps.length > 1) {
        setCurrentStepIdx(0);
        setIsSimulating(true);
        let step = 0;
        simTimerRef.current = window.setInterval(() => {
          step += 1;
          if (step >= nextResult.steps.length - 1) {
            setCurrentStepIdx(nextResult.steps.length - 1);
            stopAnimation();
          } else {
            setCurrentStepIdx(step);
          }
        }, settings.stepDelayMs);

        // Award XP once per lab / challenge completion
        if (!completedLabIds.includes(lab.id)) {
          setCompletedLabIds((prev) => [...prev, lab.id]);
          setXp((prev) => prev + lab.xpReward);
        }
        if (activeChallengeId && !completedChallengeIds.includes(activeChallengeId)) {
          const chal = CHALLENGES.find((c) => c.id === activeChallengeId);
          if (chal) {
            setCompletedChallengeIds((prev) => [...prev, chal.id]);
            setXp((prev) => prev + chal.xpReward);
          }
        }
      } else {
        setCurrentStepIdx(0);
      }
    }, 320);
  };

  const handleSelectLab = (labId: string) => {
    const nextLab = LABS.find((l) => l.id === labId) ?? LABS[0];
    stopAnimation();
    setActiveLabId(nextLab.id);
    setActiveChallengeId(null);
    setCode(nextLab.starterCode);
    const nextRes = executeRoverPython(nextLab.starterCode, nextLab);
    setResult(nextRes);
    setTerminalLines(nextRes.terminalLines);
    setCurrentStepIdx(Math.max(0, nextRes.steps.length - 1));
    setActiveTab('code-playground');
  };

  const handleReset = () => {
    stopAnimation();
    setCode(activeLab.starterCode);
    const resetRes = executeRoverPython(activeLab.starterCode, activeLab);
    setResult(resetRes);
    setCurrentStepIdx(0);
    setTerminalLines([
      { id: 'r-1', text: `$ python3 ${activeLab.fileName}`, tone: 'muted' },
      {
        id: 'r-2',
        text: `[*] State reset to initial pose (${activeLab.start.x}, ${activeLab.start.y}).`,
        tone: 'cyan',
      },
      {
        id: 'r-3',
        text: `[*] Rover engine ready. Press 'Run Code' to execute.`,
        tone: 'slate',
      },
    ]);
  };

  const handleSave = () => {
    const snapshot: SavedProject = {
      id: `${activeLab.id}-${Date.now()}`,
      name: `${activeLab.title} (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
      labId: activeLab.id,
      labTitle: `${activeLab.labBadge} · ${activeLab.moduleTitle}`,
      fileName: activeLab.fileName,
      code,
      updatedAt: new Date().toISOString(),
    };
    setSavedProjects((prev) => [snapshot, ...prev]);
  };

  const handleRestartSim = () => {
    stopAnimation();
    setCurrentStepIdx(0);
    setTerminalLines((prev) => [
      ...prev,
      {
        id: `sim-rst-${Date.now()}`,
        text: `[*] Rover kinematic loop restarted at origin (${result.start.x}, ${result.start.y}).`,
        tone: 'indigo',
      },
    ]);
  };

  const handleStepForward = () => {
    stopAnimation();
    if (!result.success || result.steps.length === 0) return;

    const nextIdx =
      currentStepIdx >= result.steps.length - 1 ? 0 : currentStepIdx + 1;
    setCurrentStepIdx(nextIdx);
    const step = result.steps[nextIdx];
    setTerminalLines((prev) => [
      ...prev,
      {
        id: `step-log-${Date.now()}`,
        text: `[>] Single Step (dt=0.1s): Pose (${step.position.x}, ${step.position.y}) | θ=${step.headingDeg}° | Battery=${step.battery}%`,
        tone: 'yellow',
      },
    ]);
  };

  const handleToggleObstacle = (coord: GridCoord) => {
    stopAnimation();
    const exists = result.obstacles.some((o) => sameCoord(o, coord));
    const updatedObstacles = exists
      ? result.obstacles.filter((o) => !sameCoord(o, coord))
      : [...result.obstacles, coord];

    const tupleListStr = `[${updatedObstacles.map((o) => `(${o.x}, ${o.y})`).join(', ')}]`;
    let nextCode = code;
    if (/obstacles\s*=\s*\[[^\]]*\]/.test(code)) {
      nextCode = code.replace(/obstacles\s*=\s*\[[^\]]*\]/, `obstacles = ${tupleListStr}`);
    } else {
      nextCode = `obstacles = ${tupleListStr}\n${code}`;
    }

    setCode(nextCode);
    const nextRes = executeRoverPython(nextCode, activeLab);
    setResult(nextRes);
    setTerminalLines(nextRes.terminalLines);
    setCurrentStepIdx(Math.max(0, nextRes.steps.length - 1));
  };

  const handleApplyFromRoboticsLab = (params: {
    obstacles: GridCoord[];
    heuristicWeight: number;
    target: GridCoord;
  }) => {
    const tupleListStr = `[${params.obstacles.map((o) => `(${o.x}, ${o.y})`).join(', ')}]`;
    let nextCode = code;
    if (/obstacles\s*=\s*\[[^\]]*\]/.test(nextCode)) {
      nextCode = nextCode.replace(
        /obstacles\s*=\s*\[[^\]]*\]/,
        `obstacles = ${tupleListStr}`,
      );
    }
    if (/heuristic_weight\s*=\s*[0-9.]+/.test(nextCode)) {
      nextCode = nextCode.replace(
        /heuristic_weight\s*=\s*[0-9.]+/,
        `heuristic_weight = ${params.heuristicWeight.toFixed(2)}`,
      );
    } else {
      nextCode = nextCode.replace(
        /(obstacles\s*=\s*\[[^\]]*\])/,
        `$1\nheuristic_weight = ${params.heuristicWeight.toFixed(2)}`,
      );
    }
    setCode(nextCode);
    setActiveTab('code-playground');
    runCodeWithAnimation(nextCode, activeLab, params.heuristicWeight);
  };

  const handleStartChallenge = (chal: ChallengeItem) => {
    const lab = LABS.find((l) => l.id === chal.labId) ?? LABS[0];
    setActiveLabId(lab.id);
    setActiveChallengeId(chal.id);
    setCode(chal.starterCode);
    const nextRes = executeRoverPython(chal.starterCode, lab);
    setResult(nextRes);
    setTerminalLines(nextRes.terminalLines);
    setCurrentStepIdx(0);
    setActiveTab('code-playground');
  };

  const handleLoadProject = (proj: SavedProject) => {
    const lab = LABS.find((l) => l.id === proj.labId) ?? LABS[0];
    setActiveLabId(lab.id);
    setActiveChallengeId(null);
    setCode(proj.code);
    const nextRes = executeRoverPython(proj.code, lab);
    setResult(nextRes);
    setTerminalLines(nextRes.terminalLines);
    setCurrentStepIdx(Math.max(0, nextRes.steps.length - 1));
    setActiveTab('code-playground');
  };

  const handleResetAllData = () => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    setSettings(DEFAULT_SETTINGS);
    setXp(1250);
    setCompletedLabIds([]);
    setCompletedChallengeIds([]);
    setSavedProjects([]);
    handleSelectLab(LABS[0].id);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Header
        activeTab={activeTab}
        activeModuleTitle={activeLab.moduleTitle}
        xp={xp}
        streakDays={7}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((v) => !v)}
        onNavigate={(tab) => {
          setActiveTab(tab);
          setMobileMenuOpen(false);
        }}
      />

      <Sidebar
        activeTab={activeTab}
        savedCount={savedProjects.length}
        mobileOpen={mobileMenuOpen}
        onSelectTab={setActiveTab}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="lg:pl-60">
        <main className="pt-16 min-h-screen bg-surface">
          {activeTab === 'code-playground' && (
            <CodePlaygroundView
              activeLab={activeLab}
              allLabs={LABS}
              code={code}
              isDirty={code !== activeLab.starterCode}
              isRunning={isRunning}
              isSimulating={isSimulating}
              result={result}
              currentStepIdx={currentStepIdx}
              terminalLines={terminalLines}
              settings={settings}
              onChangeCode={setCode}
              onSelectLab={handleSelectLab}
              onReset={handleReset}
              onSave={handleSave}
              onRun={() => runCodeWithAnimation(code)}
              onRestartSim={handleRestartSim}
              onStepForward={handleStepForward}
              onToggleObstacle={handleToggleObstacle}
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardView
              labs={LABS}
              completedLabIds={completedLabIds}
              xp={xp}
              streakDays={7}
              savedCount={savedProjects.length}
              onOpenLab={handleSelectLab}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'robotics-lab' && (
            <RoboticsLabView onSendToPlayground={handleApplyFromRoboticsLab} />
          )}

          {activeTab === 'physics-and-math' && <PhysicsMathView />}

          {activeTab === 'challenges' && (
            <ChallengesView
              challenges={CHALLENGES}
              completedChallengeIds={completedChallengeIds}
              onStartChallenge={handleStartChallenge}
            />
          )}

          {activeTab === 'my-projects' && (
            <MyProjectsView
              projects={savedProjects}
              onLoadProject={handleLoadProject}
              onDeleteProject={(id) =>
                setSavedProjects((prev) => prev.filter((p) => p.id !== id))
              }
            />
          )}

          {activeTab === 'documentation' && <DocsApiView />}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={(patch) =>
                setSettings((prev) => ({ ...prev, ...patch }))
              }
              onResetAllData={handleResetAllData}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
