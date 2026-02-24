import { Upload, X, Loader2 } from "lucide-react";
import { useState, useRef } from "react";

interface PhotoUploadProps {
  label: string;
  description: string;
  onPhotosChange?: (urls: string[]) => void;
}

export function PhotoUpload({ label, description, onPhotosChange }: PhotoUploadProps) {
  const [files, setFiles] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("photos", selectedFiles[i]);
    }

    try {
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        const uploads = await res.json();
        const urls = uploads.map((u: any) => u.path);
        const newFiles = [...files, ...urls];
        setFiles(newFiles);
        onPhotosChange?.(newFiles);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onPhotosChange?.(newFiles);
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleUpload}
        data-testid="input-photo-upload"
      />
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
              data-testid={`button-remove-photo-${i}`}
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {files.length < 5 && (
          <div
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 flex flex-col items-center justify-center cursor-pointer transition-colors"
            data-testid="button-add-photo"
          >
            {uploading ? (
              <Loader2 size={24} className="animate-spin text-primary" />
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-secondary text-primary-foreground flex items-center justify-center mb-2">
                  <Upload size={18} />
                </div>
                <span className="text-xs font-bold text-primary">Upload Photo</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
