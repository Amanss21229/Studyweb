import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { MenuDrawer } from "@/components/MenuDrawer";

export default function Home() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl" data-testid="home-page">
      {/* Menu Drawer with hamburger icon */}
      <MenuDrawer />

      {/* Chat Interface - Full Width */}
      <div className="max-w-5xl mx-auto">
        <ChatInterface selectedSubject={selectedSubject} />
      </div>
    </main>
  );
}
