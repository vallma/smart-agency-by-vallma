import React from 'react';
import { X } from 'lucide-react';

interface InfoModalProps {
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-6 pointer-events-auto overflow-hidden">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-white/60 backdrop-blur-xl animate-in fade-in duration-500"
      />
      <div
        className="relative w-full max-w-xl bg-white rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] p-8 md:p-10 border border-zinc-100 animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        {/* Close Button X */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-zinc-300 hover:text-zinc-500 hover:bg-zinc-100 rounded-full transition-all active:scale-95 cursor-pointer"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="max-w-md mx-auto">
          <div className="flex justify-center mb-8">
            <img
              src="images/the-delegation.svg"
              alt="Smart Agency by Vallma Logo"
              width={256}
              className="h-auto"
            />
          </div>

          <h2 className="text-3xl font-black text-darkDelegation leading-[1.2] mb-6 tracking-tight text-center">
            Un entorno 3D sin código para explorar sistemas de IA agéntica
          </h2>

          <div className="space-y-6 text-zinc-500 text-[15px] leading-relaxed text-center sm:text-left">
            <p>
              Smart Agency by Vallma es un espacio de trabajo experimental donde dejáis de hacer prompts y empezáis a delegar en un equipo de agentes de IA autónomos en una oficina 3D en vivo.
            </p>
            <p>
              Diseñado para entusiastas, educadores y desarrolladores creativos para entender la colaboración multiagente, haciendo los procesos de IA complejos transparentes, colaborativos y centrados en las personas.
            </p>
          </div>

          <div className="mt-6 flex flex-col items-center gap-6">
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;


