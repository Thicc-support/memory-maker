import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Heart, Play, Trash2, Plus, ShoppingBag, Eye, Lock, Users, Edit, X, Save } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Draft {
  id: string;
  title: string;
  theme: string | null;
  step: string;
  progress: number;
  updatedAt: string | null;
}

interface Book {
  id: string;
  title: string;
  theme: string | null;
  style: string | null;
  format: string;
  status: string;
  createdAt: string | null;
  pages: Array<{ text: string; image: string }>;
}

interface Order {
  id: string;
  bookId: string;
  format: string;
  status: string;
  amount: number;
  createdAt: string | null;
}

interface Favorite {
  id: string;
  bookId: string | null;
  createdAt: string | null;
}

interface StoryProfile {
  id: string;
  name: string;
  relationship: string;
  age: string | null;
  personality: string | null;
  appearance: string | null;
  interests: string | null;
  catchphrases: string | null;
  favoriteThemes: string[] | null;
  storyHistory: Array<{ bookId: string; bookTitle: string; summary: string; themes: string[]; createdAt: string }> | null;
  aiNotes: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export default function Profile() {
  const { user, loading } = useAuth();
  const [location, setLocation] = useLocation();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [storyProfiles, setStoryProfiles] = useState<StoryProfile[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [editingProfile, setEditingProfile] = useState<StoryProfile | null>(null);
  const [showNewProfile, setShowNewProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", relationship: "", age: "", personality: "", appearance: "", interests: "", catchphrases: "" });
  const { toast } = useToast();

  const fetchAllData = () => {
    if (!user) return;
    fetch("/api/drafts", { credentials: "include" })
      .then(r => r.json())
      .then(setDrafts)
      .catch(() => {});
    fetch("/api/books", { credentials: "include" })
      .then(r => r.json())
      .then(setBooks)
      .catch(() => {});
    fetch("/api/orders", { credentials: "include" })
      .then(r => r.json())
      .then(setOrders)
      .catch(() => {});
    fetch("/api/favorites", { credentials: "include" })
      .then(r => r.json())
      .then(setFavorites)
      .catch(() => {});
    fetch("/api/story-profiles", { credentials: "include" })
      .then(r => r.json())
      .then(setStoryProfiles)
      .catch(() => {});
  };

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/");
      return;
    }
    fetchAllData();
  }, [user, loading, setLocation]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") fetchAllData();
    };
    const handleFocus = () => fetchAllData();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [user]);

  const handleDeleteDraft = async (id: string) => {
    await fetch(`/api/drafts/${id}`, { method: "DELETE", credentials: "include" });
    setDrafts(prev => prev.filter(d => d.id !== id));
  };

  const handleRemoveFavorite = async (id: string) => {
    await fetch(`/api/favorites/${id}`, { method: "DELETE", credentials: "include" });
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast({ title: "Please fill in both fields", variant: "destructive" });
      return;
    }
    setChangingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Password updated successfully" });
        setCurrentPassword("");
        setNewPassword("");
        setShowPassword(false);
      } else {
        toast({ title: data.message || "Failed to change password", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to change password", variant: "destructive" });
    }
    setChangingPassword(false);
  };

  const handleCreateProfile = async () => {
    if (!profileForm.name || !profileForm.relationship) {
      toast({ title: "Name and relationship are required", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch("/api/story-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
        credentials: "include",
      });
      if (res.ok) {
        const profile = await res.json();
        setStoryProfiles(prev => [...prev, profile]);
        setProfileForm({ name: "", relationship: "", age: "", personality: "", appearance: "", interests: "", catchphrases: "" });
        setShowNewProfile(false);
        toast({ title: `Profile for ${profile.name} created!` });
      }
    } catch {
      toast({ title: "Failed to create profile", variant: "destructive" });
    }
  };

  const handleUpdateProfile = async () => {
    if (!editingProfile) return;
    try {
      const res = await fetch(`/api/story-profiles/${editingProfile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
        credentials: "include",
      });
      if (res.ok) {
        const updated = await res.json();
        setStoryProfiles(prev => prev.map(p => p.id === updated.id ? updated : p));
        setEditingProfile(null);
        toast({ title: "Profile updated!" });
      }
    } catch {
      toast({ title: "Failed to update profile", variant: "destructive" });
    }
  };

  const handleDeleteProfile = async (id: string) => {
    await fetch(`/api/story-profiles/${id}`, { method: "DELETE", credentials: "include" });
    setStoryProfiles(prev => prev.filter(p => p.id !== id));
  };

  const startEditProfile = (profile: StoryProfile) => {
    setEditingProfile(profile);
    setProfileForm({
      name: profile.name,
      relationship: profile.relationship,
      age: profile.age || "",
      personality: profile.personality || "",
      appearance: profile.appearance || "",
      interests: profile.interests || "",
      catchphrases: profile.catchphrases || "",
    });
  };

  if (loading) return null;
  if (!user) return null;

  const initials = user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const getBookTitle = (bookId: string | null) => books.find(b => b.id === bookId)?.title || "Unknown Book";

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12 bg-white p-8 rounded-3xl shadow-sm border border-border">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left">
            <h1 className="font-heading text-3xl font-bold mb-2" data-testid="text-profile-name">{user.name}</h1>
            <p className="text-muted-foreground mb-4" data-testid="text-profile-email">{user.email}</p>
            <p className="text-sm text-muted-foreground">{books.length} Books Created · {drafts.length} Drafts · {orders.length} Orders</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="rounded-full" onClick={() => setShowPassword(!showPassword)} data-testid="button-change-password">
              <Lock size={16} className="mr-2" /> Change Password
            </Button>
            <Link href="/create">
              <Button className="rounded-full shadow-lg shadow-primary/20" data-testid="button-create-new">
                <Plus size={16} className="mr-2" /> Create New Story
              </Button>
            </Link>
          </div>
        </div>

        {showPassword && (
          <div className="mb-8 bg-white p-6 rounded-2xl border border-border shadow-sm max-w-md">
            <h3 className="font-heading font-bold text-lg mb-4">Change Password</h3>
            <div className="space-y-3">
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                data-testid="input-current-password"
              />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                data-testid="input-new-password"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleChangePassword} disabled={changingPassword} data-testid="button-save-password">
                  {changingPassword ? "Saving..." : "Update Password"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowPassword(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="books" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-5 mb-8 bg-white border border-border p-1 rounded-full mx-auto md:mx-0">
            <TabsTrigger value="books" className="rounded-full" data-testid="tab-books">My Books</TabsTrigger>
            <TabsTrigger value="profiles" className="rounded-full" data-testid="tab-profiles">Story Profiles</TabsTrigger>
            <TabsTrigger value="drafts" className="rounded-full" data-testid="tab-drafts">Drafts</TabsTrigger>
            <TabsTrigger value="orders" className="rounded-full" data-testid="tab-orders">Orders</TabsTrigger>
            <TabsTrigger value="favorites" className="rounded-full" data-testid="tab-favorites">Favorites</TabsTrigger>
          </TabsList>

          <TabsContent value="books" className="mt-0">
            {books.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-border">
                <BookOpen size={48} className="text-muted-foreground mb-4 opacity-50" />
                <h3 className="font-heading text-xl font-bold mb-2">No books yet</h3>
                <p className="text-muted-foreground mb-6">Create your first story to see it here!</p>
                <Link href="/create">
                  <Button className="rounded-full">Create a Book</Button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map(book => (
                  <div key={book.id} className="bg-white p-6 rounded-2xl border border-border shadow-sm" data-testid={`card-book-${book.id}`}>
                    {book.pages?.[0]?.image && (
                      <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-slate-100">
                        <img src={book.pages[0].image} alt={book.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <BookOpen size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading font-bold">{book.title}</h3>
                        <p className="text-xs text-muted-foreground">{book.theme} · {book.style}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{book.pages?.length || 0} pages</p>
                    <Link href={`/book/${book.id}`}>
                      <Button size="sm" variant="outline" className="rounded-full w-full" data-testid={`button-view-book-${book.id}`}>
                        <Eye size={14} className="mr-1" /> View Book
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profiles">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="font-heading text-xl font-bold">Family & Character Profiles</h2>
                <p className="text-sm text-muted-foreground">Create profiles for family members so the AI remembers them across books</p>
              </div>
              <Button className="rounded-full" onClick={() => { setShowNewProfile(true); setEditingProfile(null); setProfileForm({ name: "", relationship: "", age: "", personality: "", appearance: "", interests: "", catchphrases: "" }); }} data-testid="button-new-profile">
                <Plus size={16} className="mr-2" /> New Profile
              </Button>
            </div>

            {(showNewProfile || editingProfile) && (
              <div className="bg-white p-6 rounded-2xl border border-border shadow-sm mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-heading font-bold text-lg">{editingProfile ? `Edit ${editingProfile.name}` : "Create New Profile"}</h3>
                  <Button size="sm" variant="ghost" onClick={() => { setShowNewProfile(false); setEditingProfile(null); }}>
                    <X size={16} />
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Aunt Sally"
                      value={profileForm.name}
                      onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      data-testid="input-profile-name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Relationship *</label>
                    <select
                      value={profileForm.relationship}
                      onChange={e => setProfileForm(f => ({ ...f, relationship: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                      data-testid="input-profile-relationship"
                    >
                      <option value="">Select...</option>
                      <option value="Mom">Mom</option>
                      <option value="Dad">Dad</option>
                      <option value="Grandma">Grandma</option>
                      <option value="Grandpa">Grandpa</option>
                      <option value="Aunt">Aunt</option>
                      <option value="Uncle">Uncle</option>
                      <option value="Sister">Sister</option>
                      <option value="Brother">Brother</option>
                      <option value="Cousin">Cousin</option>
                      <option value="Friend">Friend</option>
                      <option value="Pet">Pet</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Age</label>
                    <input
                      type="text"
                      placeholder="e.g., 45"
                      value={profileForm.age}
                      onChange={e => setProfileForm(f => ({ ...f, age: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      data-testid="input-profile-age"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Personality</label>
                    <input
                      type="text"
                      placeholder="e.g., Funny, adventurous, loves puns"
                      value={profileForm.personality}
                      onChange={e => setProfileForm(f => ({ ...f, personality: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      data-testid="input-profile-personality"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Appearance</label>
                    <input
                      type="text"
                      placeholder="e.g., Brown hair, blue eyes, tall, always wears a red hat"
                      value={profileForm.appearance}
                      onChange={e => setProfileForm(f => ({ ...f, appearance: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      data-testid="input-profile-appearance"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Interests & Hobbies</label>
                    <input
                      type="text"
                      placeholder="e.g., Gardening, cooking Italian food, hiking"
                      value={profileForm.interests}
                      onChange={e => setProfileForm(f => ({ ...f, interests: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      data-testid="input-profile-interests"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium mb-1 block">Catchphrases or Things They Say</label>
                    <input
                      type="text"
                      placeholder="e.g., 'Holy moly!', 'Let's go on an adventure!'"
                      value={profileForm.catchphrases}
                      onChange={e => setProfileForm(f => ({ ...f, catchphrases: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      data-testid="input-profile-catchphrases"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={editingProfile ? handleUpdateProfile : handleCreateProfile} data-testid="button-save-profile">
                    <Save size={14} className="mr-2" /> {editingProfile ? "Save Changes" : "Create Profile"}
                  </Button>
                  <Button variant="ghost" onClick={() => { setShowNewProfile(false); setEditingProfile(null); }}>Cancel</Button>
                </div>
              </div>
            )}

            {storyProfiles.length === 0 && !showNewProfile ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-border">
                <Users size={48} className="text-muted-foreground mb-4 opacity-50" />
                <h3 className="font-heading text-xl font-bold mb-2">No story profiles yet</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  Create profiles for family members and characters. The AI will remember their personality,
                  appearance, and past adventures to write better, more personal stories each time.
                </p>
                <Button className="rounded-full" onClick={() => setShowNewProfile(true)} data-testid="button-create-first-profile">
                  <Plus size={16} className="mr-2" /> Create Your First Profile
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {storyProfiles.map(profile => (
                  <div key={profile.id} className="bg-white p-6 rounded-2xl border border-border shadow-sm" data-testid={`card-profile-${profile.id}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {profile.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading font-bold text-lg">{profile.name}</h3>
                        <p className="text-sm text-muted-foreground">{profile.relationship}{profile.age ? ` · Age ${profile.age}` : ""}</p>
                      </div>
                    </div>

                    {profile.personality && (
                      <p className="text-sm mb-2"><span className="font-medium">Personality:</span> {profile.personality}</p>
                    )}
                    {profile.appearance && (
                      <p className="text-sm mb-2"><span className="font-medium">Looks:</span> {profile.appearance}</p>
                    )}
                    {profile.interests && (
                      <p className="text-sm mb-2"><span className="font-medium">Interests:</span> {profile.interests}</p>
                    )}

                    {(profile.storyHistory || []).length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          {(profile.storyHistory || []).length} book{(profile.storyHistory || []).length !== 1 ? "s" : ""} starring {profile.name}
                        </p>
                        {(profile.storyHistory || []).slice(-2).map((h, i) => (
                          <p key={i} className="text-xs text-muted-foreground">"{h.bookTitle}"</p>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Link href={`/create?profile=${profile.id}`}>
                        <Button size="sm" className="rounded-full text-xs" data-testid={`button-create-for-${profile.id}`}>
                          <BookOpen size={12} className="mr-1" /> New Book
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" className="rounded-full text-xs" onClick={() => startEditProfile(profile)} data-testid={`button-edit-profile-${profile.id}`}>
                        <Edit size={12} className="mr-1" /> Edit
                      </Button>
                      <Button size="sm" variant="ghost" className="rounded-full text-xs text-muted-foreground hover:text-destructive" onClick={() => handleDeleteProfile(profile.id)} data-testid={`button-delete-profile-${profile.id}`}>
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="drafts">
            {drafts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-border">
                <BookOpen size={48} className="text-muted-foreground mb-4 opacity-50" />
                <h3 className="font-heading text-xl font-bold mb-2">No drafts yet</h3>
                <p className="text-muted-foreground">Start creating a story and your progress will be saved here.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {drafts.map(draft => (
                  <div key={draft.id} className="bg-white p-6 rounded-2xl border border-border shadow-sm flex gap-4 items-center" data-testid={`card-draft-${draft.id}`}>
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <BookOpen size={28} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-heading text-lg font-bold">{draft.title}</h3>
                        <span className="text-xs text-muted-foreground bg-slate-100 px-2 py-1 rounded-full">{draft.progress}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{draft.step} · {draft.theme || "No theme"}</p>
                      <div className="flex gap-2">
                        <Link href={`/create?draft=${draft.id}`}>
                          <Button size="sm" className="rounded-full h-8 text-xs" data-testid={`button-continue-draft-${draft.id}`}>
                            <Play size={12} className="mr-1" /> Continue
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-full h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteDraft(draft.id)}
                          data-testid={`button-delete-draft-${draft.id}`}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-border">
                <ShoppingBag size={48} className="text-muted-foreground mb-4 opacity-50" />
                <h3 className="font-heading text-xl font-bold mb-2">No orders yet</h3>
                <p className="text-muted-foreground">Complete a book and place an order to see it here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4" data-testid={`card-order-${order.id}`}>
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                      <ShoppingBag size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-bold">{getBookTitle(order.bookId)}</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.format} · ${(order.amount / 100).toFixed(2)} · {order.status}
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      order.status === "completed" ? "bg-green-100 text-green-700" :
                      order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites">
            {favorites.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-border">
                <Heart size={48} className="text-muted-foreground mb-4 opacity-50" />
                <h3 className="font-heading text-xl font-bold mb-2">No favorites yet</h3>
                <p className="text-muted-foreground">Heart a book to save it to your favorites.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map(fav => {
                  const book = books.find(b => b.id === fav.bookId);
                  return (
                    <div key={fav.id} className="bg-white p-6 rounded-2xl border border-border shadow-sm" data-testid={`card-favorite-${fav.id}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center text-red-500">
                          <Heart size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-heading font-bold">{book?.title || "Unknown Book"}</h3>
                          <p className="text-xs text-muted-foreground">{book?.theme}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveFavorite(fav.id)}
                        data-testid={`button-remove-favorite-${fav.id}`}
                      >
                        <Trash2 size={14} className="mr-1" /> Remove
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
