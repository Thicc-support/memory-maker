import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface BookCardProps {
  title: string;
  description: string;
  image: string;
  ageRange: string;
  theme: string;
  delay?: number;
  onClick?: () => void;
}

export function BookCard({ title, description, image, ageRange, theme, delay = 0, onClick }: BookCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      onClick={onClick}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      <div className="aspect-[3/4] overflow-hidden relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold uppercase tracking-wider text-primary-foreground">
            {theme}
          </span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <span className="px-6 py-2 bg-white/90 backdrop-blur rounded-full text-sm font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
             Click to Preview
           </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="text-sm text-primary font-bold mb-2">{ageRange}</div>
        <h3 className="font-heading text-2xl font-bold mb-2 leading-tight group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground line-clamp-2 mb-4">
          {description}
        </p>
        
        <div className="flex items-center text-primary font-bold text-sm group/btn">
            Preview Book <ArrowRight size={16} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}