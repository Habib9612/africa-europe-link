import { Button } from "@/components/ui/button";
import { Truck, Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-hero p-2 rounded-lg shadow-glow">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                LoadHive
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  className="text-foreground hover:text-primary"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-foreground hover:text-primary"
                  onClick={() => window.location.href = '/tracking'}
                >
                  Tracking
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-foreground hover:text-primary">
                      <User className="h-4 w-4 mr-2" />
                      {profile?.full_name || 'User'}
                      {profile?.role && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {profile.role}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => window.location.href = '/dashboard'}>
                      Dashboard
                    </DropdownMenuItem>
                    {profile?.role === 'admin' && (
                      <DropdownMenuItem onClick={() => window.location.href = '/admin'}>
                        Admin Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  Find Trucks
                </Button>
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  Post Load
                </Button>
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  Tracking
                </Button>
                <Button 
                  variant="default"
                  onClick={() => window.location.href = '/auth'}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/tracking'}
                >
                  Tracking
                </Button>
                {profile?.role === 'admin' && (
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/admin'}
                  >
                    Admin Panel
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-destructive"
                  onClick={signOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="w-full justify-start">
                  Find Trucks
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Post Load
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Tracking
                </Button>
                <Button 
                  variant="default" 
                  className="w-full mt-4"
                  onClick={() => window.location.href = '/auth'}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;