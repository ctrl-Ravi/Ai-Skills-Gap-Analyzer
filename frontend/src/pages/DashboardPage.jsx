import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Attempt to load real data from local storage uploaded from fastapi
    const saved = localStorage.getItem("analysisResult");
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      // Mock data if accessed directly
      setData({
        skills_detected: ['Python', 'NumPy', 'Pandas', 'Statistics'],
        missing_skills: ['TensorFlow', 'Docker', 'MLOps', 'AWS', 'PyTorch'],
        readiness_score: 58
      });
    }
  }, []);

  if (!data) return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-500 font-mono text-sm">
      <div className="w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      Loading telemetry...
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans pb-12">
      {/* Navigation */}
      <nav className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10 px-6 py-4 flex justify-between items-center mb-8">
        <Link to="/" className="font-semibold tracking-wide text-zinc-100 flex items-center gap-2">
          <div className="w-4 h-4 bg-zinc-700 rounded-sm"></div>
          SkillGap<span className="text-zinc-500">Analyzer</span>
        </Link>
        <Link to="/upload" className="text-xs font-mono text-zinc-400 hover:text-zinc-100 transition-colors uppercase tracking-wider">
          &larr; Return to Input
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6">
        
        <header className="mb-10 pl-2 border-l-2 border-blue-500">
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Analysis Output</h1>
          <p className="text-sm text-zinc-500 mt-2 font-mono">
            TARGET_ROLE: <span className="text-zinc-300 ml-2">{data.target_role || "Demo Role"}</span> | 
            JOB_ID: <span className="text-zinc-600 ml-2">{data.job_id || "DEMO-1234"}</span>
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Skills Section */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm">
              <h2 className="text-lg font-semibold text-zinc-100 mb-6 flex items-center gap-2 border-b border-zinc-800 pb-4">
                <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                Skill Inventory
              </h2>
              
              <div className="mb-8">
                <h3 className="text-xs font-mono text-zinc-500 mb-3 uppercase tracking-wider">Detected Capabilities</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills_detected?.length === 0 && <span className="text-sm text-zinc-600 font-mono">No valid entities found.</span>}
                  {data.skills_detected?.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-zinc-800/50 text-zinc-300 border border-zinc-700 text-sm rounded-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-mono text-zinc-500 mb-3 uppercase tracking-wider">Missing Requirements [Priority]</h3>
                <div className="flex flex-wrap gap-2">
                  {data.missing_skills?.length === 0 && <span className="text-sm text-green-500 font-mono">Inventory matches role criteria.</span>}
                  {data.missing_skills?.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 text-sm rounded-sm font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500/50"></span>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Roadmap Section */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm">
              <h2 className="text-lg font-semibold text-zinc-100 mb-6 flex items-center gap-2 border-b border-zinc-800 pb-4">
                <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                Execution Path
              </h2>
              
              <div className="space-y-0 relative border-l-2 border-zinc-800 ml-3">
                {/* Step 1 */}
                <div className="relative pl-6 pb-8">
                  <div className="absolute w-3 h-3 bg-zinc-800 border-[3px] border-zinc-900 rounded-full -left-[7.5px] top-1"></div>
                  <h4 className="font-semibold text-zinc-200 text-sm mb-1 uppercase tracking-wide">Phase 1: Knowledge Acquisition</h4>
                  <p className="text-zinc-400 text-sm mb-2">Focus on bridging core technical missing parameters: <span className="text-zinc-300 font-mono">{data.missing_skills?.slice(0, 2).join(", ")}</span>.</p>
                  <span className="text-xs font-mono text-zinc-600 bg-zinc-950 px-2 py-1 border border-zinc-800 rounded-sm">Est. Time: 2 Weeks</span>
                </div>
                
                {/* Step 2 */}
                <div className="relative pl-6 pb-4">
                  <div className="absolute w-3 h-3 bg-zinc-800 border-[3px] border-zinc-900 rounded-full -left-[7.5px] top-1"></div>
                  <h4 className="font-semibold text-zinc-200 text-sm mb-1 uppercase tracking-wide">Phase 2: Practical Application</h4>
                  <p className="text-zinc-400 text-sm mb-2">Deploy remaining systems: <span className="text-zinc-300 font-mono">{data.missing_skills?.slice(2, 4).join(", ")}</span> into a compiled infrastructure.</p>
                  <span className="text-xs font-mono text-zinc-600 bg-zinc-950 px-2 py-1 border border-zinc-800 rounded-sm">Est. Time: 3 Weeks</span>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Score Card */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm">
              <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">Readiness Metric</h2>
              
              <div className="flex items-baseline gap-2 mb-4">
                <div className="text-5xl font-light text-zinc-100 tracking-tight">{Math.round(data.readiness_score || 0)}</div>
                <div className="text-xl text-zinc-600 font-mono">/ 100</div>
              </div>

              <div className="w-full bg-zinc-800 h-1.5 rounded-none mb-4 overflow-hidden">
                <div className="bg-blue-500 h-1.5 transition-all duration-1000 ease-out" style={{ width: `${data.readiness_score}%` }}></div>
              </div>
              
              <p className="text-xs text-zinc-500 font-mono leading-relaxed">
                Metric is derived from exact keyword presence weighed against global index criteria.
              </p>
            </div>

            {/* AI Interview Prep */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm">
               <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                Prep Vectors
              </h2>
              
              <ul className="text-sm text-zinc-400 space-y-4 font-mono">
                {data.missing_skills?.slice(0, 3).map((s, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-blue-500 select-none">&gt;</span>
                    <span>Define the architectural principles behind <span className="text-zinc-200">{s}</span> mapping.</span>
                  </li>
                ))}
              </ul>
            </div>
            
          </div>
          
        </div>
      </div>
    </div>
  );
}
