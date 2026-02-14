
// Fix: Use namespace import to correctly populate global JSX.IntrinsicElements
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Check, Trash2, Move } from 'lucide-react';

interface PhotoCropModalProps {
  imageSrc: string;
  onCrop: (dataUrl: string) => void;
  onClose: () => void;
  onRemove: () => void;
  initialShape?: 'circle' | 'rounded' | 'square';
}

const PhotoCropModal: React.FC<PhotoCropModalProps> = ({ 
  imageSrc, 
  onCrop, 
  onClose, 
  onRemove,
  initialShape = 'circle'
}) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [shape, setShape] = useState(initialShape);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Inicializa o zoom e posição para cobrir a área e centralizar
  useEffect(() => {
    if (imageLoaded && imgRef.current) {
      const img = imgRef.current;
      const containerSize = 300;
      
      // Zoom inicial para cobrir o container (object-cover style)
      const scaleX = containerSize / img.naturalWidth;
      const scaleY = containerSize / img.naturalHeight;
      const minZoom = Math.max(scaleX, scaleY);
      
      setZoom(minZoom);
      
      // Centralização inicial
      setPosition({
        x: (containerSize - img.naturalWidth * minZoom) / 2,
        y: (containerSize - img.naturalHeight * minZoom) / 2
      });
    }
  }, [imageLoaded]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleApply = () => {
    if (!canvasRef.current || !imgRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 600; // Resolução final do crop
    const scaleFactor = size / 300; // Fator de escala visual -> real

    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);
    
    // Desenha a imagem baseada na posição e zoom da UI, escalonada para o tamanho do canvas
    ctx.drawImage(
      imgRef.current,
      position.x * scaleFactor,
      position.y * scaleFactor,
      imgRef.current.naturalWidth * zoom * scaleFactor,
      imgRef.current.naturalHeight * zoom * scaleFactor
    );
    
    onCrop(canvas.toDataURL('image/jpeg', 0.95));
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-brand-dark dark:text-white tracking-tight">Ajustar Foto</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Centralize seu rosto no círculo</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-400">
            <X size={24} />
          </button>
        </div>

        <div className="p-10 bg-slate-950 flex items-center justify-center overflow-hidden select-none">
          <div 
            className="relative w-[300px] h-[300px] overflow-hidden bg-slate-900 shadow-2xl cursor-move touch-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          >
            {/* Imagem em movimento */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop area"
              onLoad={() => setImageLoaded(true)}
              className="max-w-none pointer-events-none"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transformOrigin: '0 0'
              }}
            />

            {/* Máscara de Recorte (Overlay) */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="absolute inset-0 border-[40px] border-slate-950/60"></div>
              <div className={`absolute inset-0 ring-2 ring-brand-blue/50 ${shape === 'circle' ? 'rounded-full' : shape === 'rounded' ? 'rounded-3xl' : ''} shadow-[0_0_0_9999px_rgba(15,23,42,0.6)]`}></div>
            </div>
            
            {/* Grid de auxílio */}
            <div className={`absolute inset-0 z-10 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-20 ${shape === 'circle' ? 'rounded-full' : ''}`}>
              <div className="border border-white/30"></div>
              <div className="border border-white/30"></div>
              <div className="border border-white/30"></div>
              <div className="border border-white/30"></div>
              <div className="border border-white/30"></div>
              <div className="border border-white/30"></div>
              <div className="border border-white/30"></div>
              <div className="border border-white/30"></div>
              <div className="border border-white/30"></div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8 bg-white dark:bg-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span className="flex items-center"><ZoomOut size={12} className="mr-2"/> ZOOM</span>
                <span>{Math.round(zoom * 100)}%</span>
              </div>
              <input 
                type="range" min="0.1" max="5" step="0.01" 
                value={zoom} 
                onChange={(e) => {
                  const newZoom = parseFloat(e.target.value);
                  // Ajusta a posição para o zoom parecer ocorrer no centro do container
                  const centerX = 150;
                  const centerY = 150;
                  const factor = newZoom / zoom;
                  
                  setPosition(prev => ({
                    x: centerX - (centerX - prev.x) * factor,
                    y: centerY - (centerY - prev.y) * factor
                  }));
                  setZoom(newZoom);
                }}
                className="w-full accent-brand-blue"
              />
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">FORMATO NO CURRÍCULO</span>
              <div className="flex gap-2">
                {(['circle', 'rounded', 'square'] as const).map(s => (
                  <button 
                    key={s}
                    onClick={() => setShape(s)}
                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${shape === s ? 'bg-brand-blue border-brand-blue text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:bg-slate-100'}`}
                  >
                    {s === 'circle' ? 'Círculo' : s === 'rounded' ? 'Curvo' : 'Quadrado'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-50 dark:border-slate-800">
            <button 
              onClick={() => { if(window.confirm("Remover foto?")) onRemove(); }}
              className="px-6 py-4 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center hover:bg-red-100 transition-all"
            >
              <Trash2 size={16} className="mr-2" /> REMOVER
            </button>
            <div className="flex-1"></div>
            <button 
              onClick={onClose}
              className="px-8 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-all"
            >
              CANCELAR
            </button>
            <button 
              onClick={handleApply}
              className="px-10 py-4 bg-brand-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
            >
              <Check size={18} className="mr-2" /> APLICAR RECORTE
            </button>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PhotoCropModal;
