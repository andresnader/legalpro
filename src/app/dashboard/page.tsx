"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  Scale,
  Loader2
} from "lucide-react";

interface Subscription {
  id: string;
  status: string;
  plan: {
    name: string;
    price: string;
  };
  startDate: string;
  endDate: string;
  subscriptionCoverages: Array<{
    coverage: {
      name: string;
    };
    isActive: boolean;
  }>;
  payments: Array<{
    date: string;
    amount: string;
    status: string;
  }>;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchSubscriptions();
    }
  }, [session]);

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch("/api/subscriptions");
      if (!res.ok) {
        throw new Error("Error al cargar suscripciones");
      }
      const data = await res.json();
      setSubscriptions(data);
    } catch (err) {
      setError("Error al cargar tus suscripciones");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const activeSubscription = subscriptions.find((sub) => sub.status === "active");
  const isActive = !!activeSubscription;

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">LegalPro</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium hidden sm:inline">{session?.user?.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Mi Panel</h1>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {subscriptions.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No tienes suscripciones activas</h2>
              <p className="text-muted-foreground mb-6">
                Contrata un plan de protección legal para comenzar
              </p>
              <Link href="/register">
                <Button>Ver Planes</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
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
                    Plan {activeSubscription?.plan?.name} - ${activeSubscription?.plan?.price}/mes
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
                        <span className="font-medium">{activeSubscription?.plan?.name}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b">
                        <span className="text-muted-foreground">Precio</span>
                        <span className="font-medium">${activeSubscription?.plan?.price}/mes</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b">
                        <span className="text-muted-foreground">Vigencia</span>
                        <span className="font-medium">
                          {activeSubscription?.startDate ? new Date(activeSubscription.startDate).toLocaleDateString('es-EC') : '-'} - {activeSubscription?.endDate ? new Date(activeSubscription.endDate).toLocaleDateString('es-EC') : '-'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        <span className="text-muted-foreground">Próximo pago</span>
                        <span className="font-medium">{activeSubscription?.endDate ? new Date(activeSubscription.endDate).toLocaleDateString('es-EC') : '-'}</span>
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
                      {activeSubscription?.subscriptionCoverages?.map((sc) => (
                        <div 
                          key={sc.coverage.name} 
                          className={`flex items-center justify-between p-3 rounded-lg ${sc.isActive ? 'bg-green-50' : 'bg-muted'}`}
                        >
                          <div className="flex items-center gap-3">
                            <Shield className={`h-5 w-5 ${sc.isActive ? 'text-green-600' : 'text-muted-foreground'}`} />
                            <span className={sc.isActive ? '' : 'text-muted-foreground'}>
                              {sc.coverage.name}
                            </span>
                          </div>
                          {sc.isActive ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      )) || (
                        <p className="text-muted-foreground text-center py-4">No hay coberturas configuradas</p>
                      )}
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
                      {activeSubscription?.payments?.length ? (
                        activeSubscription.payments.map((payment, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{new Date(payment.date).toLocaleDateString('es-EC')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">${payment.amount}</span>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm text-center py-4">No hay pagos registrados</p>
                      )}
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
          </>
        )}
      </div>
    </div>
  );
}
