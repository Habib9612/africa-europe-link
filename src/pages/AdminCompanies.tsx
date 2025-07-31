import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Users, MapPin, Calendar, Mail, Phone } from "lucide-react";

export default function AdminCompanies() {
  const companiesData = [
    { 
      id: "CP001", 
      name: "Atlas Logistics", 
      type: "Carrier", 
      location: "Casablanca", 
      vehicles: 12, 
      contact: "contact@atlas.ma",
      phone: "+212 522 123 456",
      status: "Active" 
    },
    { 
      id: "CP002", 
      name: "EuroMed Shipping", 
      type: "Shipper", 
      location: "Barcelona", 
      vehicles: 0, 
      contact: "info@euromed.es",
      phone: "+34 93 123 456",
      status: "Active" 
    },
    { 
      id: "CP003", 
      name: "Maghreb Transport", 
      type: "Carrier", 
      location: "Rabat", 
      vehicles: 8, 
      contact: "support@maghreb.ma",
      phone: "+212 537 123 456",
      status: "Pending" 
    },
    { 
      id: "CP004", 
      name: "Med Freight Solutions", 
      type: "Both", 
      location: "Marseille", 
      vehicles: 15, 
      contact: "contact@medfreight.fr",
      phone: "+33 4 91 123 456",
      status: "Active" 
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Suspended": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Carrier": return "bg-blue-100 text-blue-800";
      case "Shipper": return "bg-purple-100 text-purple-800";
      case "Both": return "bg-emerald-100 text-emerald-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Companies Management</h1>
          <p className="text-muted-foreground mt-2">Manage all registered companies and partners</p>
        </div>

        {/* Company Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Companies</p>
                  <p className="text-3xl font-bold text-foreground">156</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Carriers</p>
                  <p className="text-3xl font-bold text-blue-600">89</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Shippers</p>
                  <p className="text-3xl font-bold text-purple-600">52</p>
                </div>
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                  <p className="text-3xl font-bold text-yellow-600">15</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Companies Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Registered Companies</CardTitle>
            <CardDescription>All companies registered on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Button className="mr-2">Add New Company</Button>
              <Button variant="outline">Export Data</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Vehicles</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companiesData.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {company.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(company.type)}>
                        {company.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {company.location}
                      </div>
                    </TableCell>
                    <TableCell>{company.vehicles}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3" />
                          {company.contact}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3" />
                          {company.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(company.status)}>
                        {company.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}