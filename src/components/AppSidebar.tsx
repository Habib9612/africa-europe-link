import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Search,
  Package,
  MapPin,
  Truck,
  Users,
  BarChart3,
  Building2,
  Route,
  Shield,
  Fuel,
  Calendar,
  Activity,
  Brain,
  Zap,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { profile } = useAuth();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  const getMenuItems = () => {
    const baseItems: Array<{title: string; url: string; icon: any; highlight?: boolean}> = [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Messages", url: "/messages", icon: MessageSquare },
      { title: "Settings", url: "/settings", icon: Settings },
    ];

    switch (profile?.role) {
      case 'carrier':
        return [
          ...baseItems,
          { title: "Find Shipments", url: "/loads", icon: Search },
          { title: "My Fleet", url: "/trucks", icon: Truck },
          { title: "Routes", url: "/routes", icon: Route },
          { title: "Analytics", url: "/analytics", icon: BarChart3 },
        ];
      
      case 'shipper':
      case 'individual':
        return [
          ...baseItems,
          { title: "AI Matching", url: "/ai-matching", icon: Brain, highlight: true },
          { title: "Find Carriers", url: "/carriers", icon: Search },
          { title: "My Shipments", url: "/loads", icon: Package },
          { title: "Tracking", url: "/tracking", icon: MapPin },
          { title: "Analytics", url: "/analytics", icon: BarChart3 },
        ];
      
      case 'company':
        return [
          ...baseItems,
          { title: "Fleet Management", url: "/fleet", icon: Truck },
          { title: "Drivers", url: "/drivers", icon: Users },
          { title: "Shipments", url: "/loads", icon: Package },
          { title: "Routes", url: "/routes", icon: Route },
          { title: "Maintenance", url: "/maintenance", icon: Calendar },
          { title: "Fuel Reports", url: "/fuel", icon: Fuel },
          { title: "Analytics", url: "/analytics", icon: BarChart3 },
        ];
      
      case 'admin':
        return [
          ...baseItems,
          { title: "User Management", url: "/admin/users", icon: Users },
          { title: "Fleet Overview", url: "/admin/fleet", icon: Truck },
          { title: "Companies", url: "/admin/companies", icon: Building2 },
          { title: "System Monitor", url: "/admin/monitor", icon: Activity },
          { title: "Security", url: "/admin/security", icon: Shield },
          { title: "Analytics", url: "/analytics", icon: BarChart3 },
        ];
      
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar
      collapsible="icon"
    >
      <SidebarContent className="bg-card border-r">
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">M</span>
            </div>
            {!collapsed && (
              <div>
                <h3 className="font-semibold text-foreground">MarocTransit</h3>
                <p className="text-xs text-muted-foreground">AI-Powered Logistics</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="px-2 py-4">
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11 px-3">
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && (
                        <span className="ml-3 truncate flex items-center">
                          {item.title}
                          {item.highlight && (
                            <Badge variant="accent" className="ml-2 text-xs animate-pulse">
                              <Zap className="h-3 w-3 mr-1" />
                              NEW
                            </Badge>
                          )}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <div className="mt-auto p-4 border-t">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">
                  {profile?.full_name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {profile?.full_name || 'User'}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}