import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  CreditCard, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Menu,
  User,
  LogOut,
  Scale
} from "lucide-react";

const mockSubscription = {
  status: "active",
  plan: "Familiar",
  price: 25,
  startDate: "2026-01-15",
  endDate: "2026-02-15",
  coverages: [
    { name: "Laboral", active: true },
    { name: "Demanddas de Alimentos", active: true },
    { name: "Violencia Intrafamiliar", active: true },
    { name: "Civil", active: true },
    { name: "Bienes", active: true },
    { name: "Compra Venta y Legalización", active: false },
    { name: "Asesoría Penal", active: false },
    { name: "Asesoría Empresarial y Mercantil", active: false },
    { name: "Constitucional", active: false },
  ],
};

const mockPayments = [
  { date: "2026-01-15", amount: 25, status: "completed" },
  { date: "2025-12-15", amount: 25, status: "completed" },
  { date: "2025-11-15", amount: 25, status: "completed" },
];

export default function DashboardPage() {
  const isActive = mockSubscription.status === "active";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">LegalPro</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Mi Panel</h1>

        {/* Status Banner */}
        <div className={`rounded-lg p-4 mb-8 ${isActive ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <div className="flex items-center gap-3">
            {isActive ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            )}
            <div>
              <p className="font-medium">
                Suscripción {isActive ? 'Activa' : 'Pendiente'}
              </p>
              <p className="text-sm text-muted-foreground">
                Plan {mockSubscription.plan} - ${mockSubscription.price}/mes
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subscription Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Mi Suscripción</CardTitle>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {isActive ? 'Activa' : 'Pendiente'}
                  </span>
                </div>
                <CardDescription>Detalles de tu plan actual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="font-medium">{mockSubscription.plan}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-muted-foreground">Precio</span>
                    <span className="font-medium">${mockSubscription.price}/mes</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-muted-foreground">Vigencia</span>
                    <span className="font-medium">
                      {mockSubscription.startDate} - {mockSubscription.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-muted-foreground">Próximo pago</span>
                    <span className="font-medium">{mockSubscription.endDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coverages */}
            <Card>
              <CardHeader>
                <CardTitle>Mis Coberturas</CardTitle>
                <CardDescription>Servicios incluidos en tu plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockSubscription.coverages.map((coverage) => (
                    <div 
                      key={coverage.name} 
                      className={`flex items-center justify-between p-3 rounded-lg ${coverage.active ? 'bg-green-50' : 'bg-muted'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Shield className={`h-5 w-5 ${coverage.active ? 'text-green-600' : 'text-muted-foreground'}`} />
                        <span className={coverage.active ? '' : 'text-muted-foreground'}>
                          {coverage.name}
                        </span>
                      </div>
                      {coverage.active ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Ver todos los servicios
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Solicitar Asesoría
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Ver Método de Pago
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Actualizar Plan
                </Button>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle>Historial de Pagos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockPayments.map((payment, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{payment.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">${payment.amount}</span>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <p className="text-sm text-center mb-4">
                  ¿Necesitas ayuda? Contáctanos
                </p>
                <Button className="w-full">
                  Contactar Soporte
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}