import { Navbar } from "@/components/Navbar";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, BookOpen, Heart, Clock, Play, Trash2 } from "lucide-react";
import coverSpace from "@/assets/images/book-cover-space.png";
import coverJungle from "@/assets/images/book-cover-jungle.png";
import { Link } from "wouter";

export default function Profile() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12 bg-white p-8 rounded-3xl shadow-sm border border-border">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white border-2 border-white cursor-pointer hover:bg-primary/90">
              <Settings size={14} />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-heading text-3xl font-bold mb-2">The Doe Family</h1>
            <p className="text-muted-foreground mb-4">Member since 2024 • 3 Stories Created</p>
            <div className="flex gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Space Explorer</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Nature Lover</span>
            </div>
          </div>

          <Link href="/create">
            <Button className="rounded-full shadow-lg shadow-primary/20">
              Create New Story
            </Button>
          </Link>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="drafts" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8 bg-white border border-border p-1 rounded-full mx-auto md:mx-0">
            <TabsTrigger value="books" className="rounded-full">My Books</TabsTrigger>
            <TabsTrigger value="drafts" className="rounded-full">Drafts</TabsTrigger>
            <TabsTrigger value="favorites" className="rounded-full">Favorites</TabsTrigger>
          </TabsList>
          
          <TabsContent value="books" className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <BookCard 
                title="Mommy's Space Mission"
                description="The incredible journey of Captain Mom to the red planet."
                ageRange="Created Feb 2024"
                theme="Hardcover"
                image={coverSpace}
              />
              <BookCard 
                title="Grandpa's Jungle"
                description="A safari adventure with the wildest grandpa in the world."
                ageRange="Created Jan 2024"
                theme="Digital"
                image={coverJungle}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="drafts">
             <div className="grid md:grid-cols-2 gap-6">
                {/* Draft 1 */}
                <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500 shrink-0">
                    <Briefcase size={32} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-heading text-lg font-bold">Daddy's Engineering Job</h3>
                      <span className="text-xs text-muted-foreground bg-slate-100 px-2 py-1 rounded-full">50% Complete</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Interview Phase • Career Theme</p>
                    <div className="flex gap-2">
                       <Link href="/create">
                        <Button size="sm" className="rounded-full h-8 text-xs">
                          <Play size={12} className="mr-1" /> Continue
                        </Button>
                       </Link>
                       <Button size="sm" variant="ghost" className="rounded-full h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                          <Trash2 size={14} />
                       </Button>
                    </div>
                  </div>
                </div>

                 {/* Draft 2 */}
                <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-lg bg-purple-100 flex items-center justify-center text-purple-500 shrink-0">
                    <Heart size={32} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-heading text-lg font-bold">Auntie's Garden Poems</h3>
                      <span className="text-xs text-muted-foreground bg-slate-100 px-2 py-1 rounded-full">20% Complete</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Setup Phase • Hobby Theme</p>
                     <div className="flex gap-2">
                       <Link href="/create">
                        <Button size="sm" className="rounded-full h-8 text-xs">
                          <Play size={12} className="mr-1" /> Continue
                        </Button>
                       </Link>
                       <Button size="sm" variant="ghost" className="rounded-full h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                          <Trash2 size={14} />
                       </Button>
                    </div>
                  </div>
                </div>
             </div>
          </TabsContent>
          
          <TabsContent value="favorites">
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-border">
              <Heart size={48} className="text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-heading text-xl font-bold mb-2">Save your favorite themes</h3>
              <p className="text-muted-foreground">Bookmark themes to use them later.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}