import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("Machine Learning Engineer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("role", role);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/analyze/resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Store data in localStorage specifically for the demo dashboard to pick up
      localStorage.setItem("analysisResult", JSON.stringify(data));
      
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setError("Failed to connect to the analysis engine. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans text-zinc-300">
      {/* Navigation */}
      <nav className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10 px-6 py-4 flex justify-between items-center">
        <Link to="/" className="font-semibold tracking-wide text-zinc-100 flex items-center gap-2">
          <div className="w-4 h-4 bg-zinc-700 rounded-sm"></div>
          SkillGap<span className="text-zinc-500">Analyzer</span>
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 p-8 rounded-sm shadow-2xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">System Input</h1>
            <p className="text-sm text-zinc-500 mt-1">Configure parameters and inject resume document.</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-950/30 border border-red-900/50 text-red-400 text-sm rounded-sm">
              [!] {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-2 uppercase tracking-wider">Target Parameter: Role</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 text-zinc-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 block p-3 outline-none rounded-sm transition-colors"
                disabled={loading}
              >
                <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Cyber Security Analyst">Cyber Security Analyst</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-2 uppercase tracking-wider">Input Vector: Document</label>
              <div className="border border-dashed border-zinc-700 bg-zinc-950/50 hover:bg-zinc-800/50 hover:border-zinc-500 transition-colors cursor-pointer relative rounded-sm p-8 text-center flex flex-col items-center justify-center min-h-[160px]">
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={loading}
                />
                
                {file ? (
                  <div className="text-center">
                    <svg className="w-8 h-8 text-blue-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <p className="text-zinc-200 font-medium text-sm truncate max-w-[200px] mx-auto">{file.name}</p>
                    <p className="text-zinc-500 text-xs mt-1">Ready for parsing</p>
                  </div>
                ) : (
                  <div className="text-center">
                     <svg className="w-8 h-8 text-zinc-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    <p className="text-zinc-400 text-sm">Select logical file (.pdf, .docx)</p>
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-3 text-sm font-semibold tracking-wide uppercase transition-all rounded-sm flex items-center justify-center gap-2 ${
                loading 
                ? 'bg-zinc-800 text-zinc-500 cursor-wait border border-zinc-700' 
                : 'bg-blue-500 hover:bg-blue-400 text-zinc-950 border border-transparent'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : "Execute Analysis"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
