import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Bell, FileText, History, Bookmark, TrendingUp, Mail, Info, ScrollText, Shield, ShieldCheck, Scale, Key } from "lucide-react";
import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";

export function MenuDrawer() {
  const [open, setOpen] = useState(false);

  const updatesAndNotices = [
    { 
      id: 'neet-updates', 
      name: 'NEET Latest Updates', 
      icon: Bell, 
      color: 'text-blue-500 dark:text-blue-400',
      href: '/neet-updates'
    },
    { 
      id: 'jee-updates', 
      name: 'JEE Latest Updates', 
      icon: Bell, 
      color: 'text-green-500 dark:text-green-400',
      href: '/jee-updates'
    },
    { 
      id: 'neet-criteria', 
      name: 'NEET Exam Criteria And Pattern', 
      icon: FileText, 
      color: 'text-purple-500 dark:text-purple-400',
      href: '/neet-criteria'
    },
    { 
      id: 'jee-criteria', 
      name: 'JEE Exam Criteria And Pattern', 
      icon: FileText, 
      color: 'text-pink-500 dark:text-pink-400',
      href: '/jee-criteria'
    }
  ];

  const quickActions = [
    { name: 'View History', icon: History, color: 'text-primary', href: '/history' },
    { name: 'Saved Solutions', icon: Bookmark, color: 'text-accent', href: '/saved-solutions' },
    { name: 'Progress', icon: TrendingUp, color: 'text-primary', href: '/progress' },
    { name: 'API Keys', icon: Key, color: 'text-golden', href: '/api-keys' }
  ];

  const policies = [
    { name: 'Contact Us', icon: Mail, color: 'text-blue-500', href: '/contact-us' },
    { name: 'About Us', icon: Info, color: 'text-green-500', href: '/about-us' },
    { name: 'Terms of Use', icon: ScrollText, color: 'text-purple-500', href: '/terms-of-use' },
    { name: 'Privacy Policy', icon: Shield, color: 'text-orange-500', href: '/privacy-policy' },
    { name: 'Child Safety Policy', icon: ShieldCheck, color: 'text-pink-500', href: '/child-safety' },
    { name: 'Grievance Redressal', icon: Scale, color: 'text-red-500', href: '/grievance-redressal' }
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="fixed top-4 left-4 z-[100] hover:bg-primary/10 bg-background/80 backdrop-blur-sm shadow-md"
          data-testid="menu-drawer-trigger"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <div className="w-2 h-2 bg-primary rounded-full mr-2 premium-glow" />
            Menu
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Updates and Notices Section */}
          <div>
            <h3 className="font-semibold text-sm mb-3 flex items-center text-muted-foreground">
              <Bell className="h-4 w-4 mr-2" />
              Updates and Notices
            </h3>
            <div className="space-y-2">
              {updatesAndNotices.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.id} href={item.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-3 py-2 h-auto hover:bg-primary/10"
                      onClick={() => setOpen(false)}
                      data-testid={`menu-${item.id}`}
                    >
                      <Icon className={`h-4 w-4 mr-3 ${item.color}`} />
                      <span className="text-sm">{item.name}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Quick Actions Section */}
          <div>
            <h3 className="font-semibold text-sm mb-3 flex items-center text-muted-foreground">
              <TrendingUp className="h-4 w-4 mr-2" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.name} href={action.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-3 py-2 h-auto hover:bg-primary/10"
                      onClick={() => setOpen(false)}
                      data-testid={`menu-${action.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Icon className={`h-4 w-4 mr-3 ${action.color}`} />
                      <span className="text-sm">{action.name}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Policies Section */}
          <div>
            <h3 className="font-semibold text-sm mb-3 flex items-center text-muted-foreground">
              <Shield className="h-4 w-4 mr-2" />
              Policies
            </h3>
            <div className="space-y-2">
              {policies.map((policy) => {
                const Icon = policy.icon;
                return (
                  <Link key={policy.name} href={policy.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-3 py-2 h-auto hover:bg-primary/10"
                      onClick={() => setOpen(false)}
                      data-testid={`menu-${policy.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Icon className={`h-4 w-4 mr-3 ${policy.color}`} />
                      <span className="text-sm">{policy.name}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
