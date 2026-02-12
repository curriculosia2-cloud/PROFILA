
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
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [shape, setShape] = useState(initialShape);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Fixed size for high-quality resume photos
    const size = 600;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);
    
    // Save state for rotation
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Calculate draw dimensions
    const drawWidth = imgRef.current.naturalWidth * zoom * (size / 300);
    const drawHeight = imgRef.current.naturalHeight * zoom * (size / 300);
    
    // Draw based on current position relative to visual center
    ctx.drawImage(
      imgRef.current,
      (position.x * (size / 300)) - (drawWidth / 2) + (size / 2 * 0), // Adjusting offset
      (position.y * (size / 300)) - (drawHeight / 2) + (size / 2 * 0),
      drawWidth,
      drawHeight
    );
    
    ctx.restore();
    
    onCrop(canvas.toDataURL('image/jpeg', 0.9));
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-800/10">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h3 className="text-xl font-black text-brand-dark tracking-tight">Ajustar Foto</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Posicione e recorte para o currículo</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400">
            <X size={24} />
          </button>
        </div>

        <div className="p-10 bg-slate-900 flex items-center justify-center overflow-hidden">
          <div 
            ref={containerRef}
            className="relative w-[300px] h-[300px] overflow-hidden bg-slate-800 shadow-2xl cursor-move touch-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          >
            {/* Guide Mask */}
            <div className={`absolute inset-0 z-10 pointer-events-none border-[100px] border-slate-900/60 ${shape === 'circle' ? 'rounded-full' : shape === 'rounded' ? 'rounded-3xl' : ''}`}></div>
            <div className={`absolute inset-0 z-20 pointer-events-none ring-1 ring-white/30 ${shape === 'circle' ? 'rounded-full' : shape === 'rounded' ? 'rounded-3xl' : ''}`}></div>

            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop area"
              className="max-w-none transition-transform duration-75 select-none"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                pointerEvents: 'none'
              }}
            />
          </div>
        </div>

        <div className="p-8 space-y-8 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Zoom Controls */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span className="flex items-center"><ZoomOut size={12} className="mr-2"/> ZOOM</span>
                <span>{Math.round(zoom * 100)}%</span>
              </div>
              <input 
                type="range" min="0.5" max="3" step="0.01" 
                value={zoom} 
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-brand-blue"
              />
            </div>

            {/* Shape Selection */}
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">FORMATO DE RECORTE</span>
              <div className="flex gap-2">
                {(['circle', 'rounded', 'square'] as const).map(s => (
                  <button 
                    key={s}
                    onClick={() => setShape(s)}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${shape === s ? 'bg-brand-blue border-brand-blue text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'}`}
                  >
                    {s === 'circle' ? 'Círculo' : s === 'rounded' ? 'Arredondado' : 'Quadrado'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-50">
            <button 
              onClick={() => {
                if(window.confirm("Remover foto?")) onRemove();
              }}
              className="px-6 py-4 bg-red-50 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center hover:bg-red-100 transition-all"
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
              className="px-10 py-4 bg-brand-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20"
            >
              <Check size={18} className="mr-2" /> APLICAR FOTO
            </button>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PhotoCropModal;
