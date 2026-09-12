import { PEDAGOGY_AXES } from '../data/initialData';
import { X, BookOpen, CheckCircle, GraduationCap } from 'lucide-react';

interface PedagogyGuideModalProps {
  onClose: () => void;
}

export function PedagogyGuideModal({ onClose }: PedagogyGuideModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-3xl bg-slate-950 border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.25)] space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-400 text-cyan-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-100">
                Guía Curricular y Pedagógica
              </h2>
              <p className="text-xs font-mono text-cyan-400">
                Taller de Robótica Aplicada • 3.º Año Ciclo Básico Secundaria
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-400 hover:text-cyan-300 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pedagogical Statement */}
        <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 font-mono">
          <span className="text-cyan-300 font-bold">ENFOQUE DIDÁCTICO:</span> “Jugá. Programá. Probá. Equivocate. Mejorá.” El error no es punitivo; es una herramienta de aprendizaje activo y depuración constructiva.
        </div>

        {/* Axes List */}
        <div className="space-y-4 overflow-y-auto pr-1 flex-1 py-1">
          {PEDAGOGY_AXES.map(axe => (
            <div
              key={axe.id}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{axe.icon}</span>
                <div>
                  <h3 className="text-sm font-display font-bold text-slate-100">
                    {axe.title}
                  </h3>
                  <p className="text-xs text-slate-400">{axe.description}</p>
                </div>
              </div>

              {/* Topics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                    CONTENIDOS ESPECÍFICOS:
                  </span>
                  <ul className="space-y-1">
                    {axe.topics.map((t, idx) => (
                      <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block mb-1">
                    CAPACIDADES A DESARROLLAR:
                  </span>
                  <ul className="space-y-1">
                    {axe.competencies.map((c, idx) => (
                      <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
