import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import heroImage from "@/assets/images/hero-story-magic.png";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col md:flex-row items-center justify-between px-6 md:px-12 pt-10 pb-20 overflow-hidden">
      
      {/* Text Content */}
      <div className="w-full md:w-1/2 z-10 flex flex-col gap-6 md:pr-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground font-bold text-sm mb-6 border border-white/50 backdrop-blur-sm">
            <Sparkles size={14} />
            <span>AI-Powered Family Stories</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6 text-balance text-primary-foreground">
            Turn Family Memories into <span className="text-primary italic font-serif">Magical</span> Children's Books
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg">
            Our AI interviewer listens to your stories and weaves them into beautifully illustrated custom books for the little ones you love.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/create">
              <Button size="lg" className="rounded-full px-8 text-lg h-14 font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all group">
                Start Your Story
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#examples">
              <Button variant="outline" size="lg" className="rounded-full px-8 text-lg h-14 border-2 bg-transparent hover:bg-white/50 cursor-pointer">
                View Examples
              </Button>
            </a>
          </div>
        </motion.div>
        
        <div className="mt-12 flex gap-8 items-center text-sm font-bold text-muted-foreground/80">
          <div className="flex -space-x-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
            ))}
          </div>
          <p>Loved by 10,000+ families</p>
        </div>
      </div>

      {/* Image Content */}
      <motion.div 
        className="w-full md:w-1/2 relative mt-12 md:mt-0"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="relative z-10 animate-float">
          <img 
            src={heroImage} 
            alt="Magical storybook" 
            className="w-full h-auto rounded-3xl shadow-2xl rotate-1 border-4 border-white/50"
          />
        </div>
        
        {/* Decorative background blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-3xl rounded-full -z-10" />
        <div className="absolute top-10 right-10 w-32 h-32 bg-secondary blur-2xl rounded-full -z-10 animate-pulse" />
      </motion.div>
    </section>
  );
}