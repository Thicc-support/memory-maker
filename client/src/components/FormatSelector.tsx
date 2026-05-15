import { Check } from "lucide-react";

export type FormatType = "digital" | "softcover" | "hardcover";

interface FormatSelectorProps {
  selected: FormatType;
  onChange: (format: FormatType) => void;
}

export function FormatSelector({ selected, onChange }: FormatSelectorProps) {
  const formats = [
    {
      id: "digital",
      title: "Digital Only",
      price: "$19.99",
      desc: "Best first product to sell now",
      features: ["High-res digital book", "Instant library access", "Share with family"]
    },
    {
      id: "softcover",
      title: "Softcover",
      price: "$39.99",
      desc: "Printed keepsake",
      features: ["Manual print review", "Premium color pages", "Shipping collected at checkout"]
    },
    {
      id: "hardcover",
      title: "Hardcover",
      price: "$59.99",
      desc: "Premium family gift",
      features: ["Manual print review", "Heirloom-style keepsake", "Shipping collected at checkout"]
    }
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {formats.map((fmt) => {
        const isSelected = selected === fmt.id;
        return (
          <div 
            key={fmt.id}
            onClick={() => onChange(fmt.id)}
            className={`
              relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200
              ${isSelected 
                ? "border-primary bg-primary/5 shadow-md scale-[1.02]" 
                : "border-border bg-white hover:border-primary/30 hover:bg-slate-50"}
            `}
          >
            {isSelected && (
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-primary rounded-full text-white flex items-center justify-center shadow-sm">
                <Check size={14} strokeWidth={3} />
              </div>
            )}
            
            <div className="flex justify-between items-start mb-2">
              <span className={`font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>
                {fmt.title}
              </span>
              <span className="font-heading font-bold text-lg">{fmt.price}</span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">{fmt.desc}</p>
            
            <ul className="space-y-1">
              {fmt.features.map((feat, i) => (
                <li key={i} className="text-xs text-slate-500 flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-slate-400" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}