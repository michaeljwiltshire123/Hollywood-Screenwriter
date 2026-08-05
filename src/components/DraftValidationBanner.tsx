import React, { useState, useEffect } from 'react';
import { CheckCircle2, ShieldCheck, Database, Zap, RefreshCw } from 'lucide-react';
import { saveScriptToIDB, getScriptFromIDB } from '../lib/db';
import { ScreenplayDocument } from '../types';

interface DraftValidationBannerProps {
  script: ScreenplayDocument;
  onValidationComplete: () => void;
  latencyMs: number;
  onOpenDebugModal?: () => void;
}

export const DraftValidationBanner: React.FC<DraftValidationBannerProps> = ({
  script,
  onValidationComplete,
  latencyMs,
  onOpenDebugModal,
}) => {
  const [tests, setTests] = useState<{
    idbConnected: boolean | null;
    keystrokeWrite: boolean | null;
    schemaIntegrity: boolean | null;
    readBackLatency: number | null;
  }>({
    idbConnected: null,
    keystrokeWrite: null,
    schemaIntegrity: null,
    readBackLatency: null,
  });

  const [validating, setValidating] = useState(false);

  const runDiagnosticAudit = async () => {
    setValidating(true);
    const start = performance.now();

    try {
      // 1. Check IDB Write
      const writeTime = await saveScriptToIDB(script);

      // 2. Read back
      const startRead = performance.now();
      const readScript = await getScriptFromIDB(script.id);
      const readTime = Math.round(performance.now() - startRead);

      // 3. Schema Check
      const hasElements = Array.isArray(readScript?.elements) && readScript.elements.length > 0;

      setTests({
        idbConnected: true,
        keystrokeWrite: writeTime < 200,
        schemaIntegrity: hasElements,
        readBackLatency: readTime,
      });
    } catch (e) {
      console.error('Audit failed', e);
      setTests({
        idbConnected: false,
        keystrokeWrite: false,
        schemaIntegrity: false,
        readBackLatency: null,
      });
    } finally {
      setValidating(false);
    }
  };

  useEffect(() => {
    runDiagnosticAudit();
  }, [script.id]);

  const allPassed = tests.idbConnected && tests.keystrokeWrite && tests.schemaIntegrity;

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 border-b border-amber-300 text-amber-950 px-4 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-200/80 rounded-lg text-amber-800">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-amber-900 flex items-center gap-2">
              <span>DRAFT VALIDATION MODE: Local-First IndexedDB Engine</span>
              <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] uppercase font-mono font-bold rounded">
                DRAFT STATE
              </span>
            </div>
            <p className="text-amber-800 text-xs mt-0.5">
              Validating atomic keystroke persistence to browser IndexedDB before full editing unlock ($0 hosting costs, 100% offline data safety).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3 text-xs font-mono bg-white/70 backdrop-blur-xs px-3 py-1.5 rounded-md border border-amber-200">
            <span className="flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-amber-700" />
              IDB:{' '}
              {tests.idbConnected === null ? (
                '...'
              ) : tests.idbConnected ? (
                <span className="text-emerald-700 font-bold">READY</span>
              ) : (
                <span className="text-rose-600 font-bold">FAIL</span>
              )}
            </span>
            <span className="text-amber-300">|</span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-700" />
              Latency: <span className="font-bold text-amber-900">{latencyMs}ms</span>
            </span>
            <span className="text-amber-300">|</span>
            <span className="flex items-center gap-1">
              Readback: <span className="font-bold text-amber-900">{tests.readBackLatency ?? 0}ms</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenDebugModal && (
              <button
                onClick={onOpenDebugModal}
                className="px-2.5 py-1.5 bg-amber-900 text-amber-100 border border-amber-700 rounded hover:bg-amber-950 flex items-center gap-1 font-mono font-bold text-xs transition"
                title="Inspect raw IndexedDB JSON data"
              >
                <Database className="w-3.5 h-3.5 text-amber-300" />
                Debug Dashboard (Raw JSON)
              </button>
            )}

            <button
              onClick={runDiagnosticAudit}
              disabled={validating}
              className="px-2.5 py-1.5 bg-white text-amber-800 border border-amber-300 rounded hover:bg-amber-50 flex items-center gap-1 font-medium text-xs transition"
              title="Re-run local store diagnostic audit"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${validating ? 'animate-spin' : ''}`} />
              Re-Audit
            </button>

            <button
              onClick={onValidationComplete}
              className={`px-3 py-1.5 rounded font-medium text-xs flex items-center gap-1.5 transition shadow-xs ${
                allPassed
                  ? 'bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer'
                  : 'bg-amber-800 text-amber-100 hover:bg-amber-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm & Unlock Full Editor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
