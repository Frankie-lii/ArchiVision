import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageUploader({ onFileSelect, preview, onClear, disabled }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) onFileSelect(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) onFileSelect(file);
  };

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Only JPG and PNG files are accepted.');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File must be less than 10MB.');
      return false;
    }
    return true;
  };

  if (preview) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-border bg-card aspect-video">
        <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
        {!disabled && (
          <button
            onClick={onClear}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`
        relative rounded-xl border-2 border-dashed aspect-video
        flex flex-col items-center justify-center gap-3 transition-all cursor-pointer
        ${isDragging 
          ? 'border-accent bg-accent/5' 
          : 'border-border hover:border-accent/50 hover:bg-muted/50'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
        <Upload className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">Drop your image here</p>
        <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 10MB</p>
      </div>
    </div>
  );
}
