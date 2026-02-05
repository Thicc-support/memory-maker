import { Upload, Image as ImageIcon, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PhotoUploadProps {
  label: string;
  description: string;
}

export function PhotoUpload({ label, description }: PhotoUploadProps) {
  const [files, setFiles] = useState<string[]>([]);

  // Mock upload functionality
  const handleUpload = () => {
    // In a real app, this would open a file picker
    // For mockup, we'll just add a placeholder
    const mockImages = [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop", // Woman
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop"  // Man
    ];
    
    if (files.length < 2) {
      setFiles([...files, mockImages[files.length]]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      <div className="mb-2">
        <h4 className="font-bold text-sm">{label}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {files.map((url, i) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-border">
            <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
            <button 
              onClick={() => removeFile(i)}
              className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] py-1 px-2 text-center backdrop-blur-sm">
              Processing Avatar...
            </div>
          </div>
        ))}
        
        {files.length < 3 && (
          <div 
            onClick={handleUpload}
            className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 flex flex-col items-center justify-center cursor-pointer transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-secondary text-primary-foreground flex items-center justify-center mb-2">
              <Upload size={18} />
            </div>
            <span className="text-xs font-bold text-primary">Upload Photo</span>
          </div>
        )}
      </div>
    </div>
  );
}