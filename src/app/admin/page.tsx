"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  CreditCard, 
  Shield, 
  TrendingUp,
  Scale,
  Loader2,
  ArrowLeft
} from "lucide-react";

interface AdminData {
  metrics: {
    totalUsers: number;
    totalSubscriptions: number;
    activeSubscriptions: number;
    totalPayments: number;
  };
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    createdAt: string;
  }>;
  recentSubscriptions: Array<{
    id: string;
    status: string;
    user: { name: string; email: string };
    plan: { name: string; price: string };
    createdAt: string;
  }>;
  revenueByPlan: Array<{
    planName: string;
    totalRevenue: string;
    count: number;
  }>;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchAdminData();
    }
  }, [session]);

  const fetchAdminData = async () => {
    try {
      const res = await fetch("/api/admin");
      if (res.status === 403) {
        router.push("/dashboard");
        return;
      }
      if (!res.ok) {
        throw new Error("Error al cargar datos");
      }
      const adminData = await res.json();
      setData(adminData);
    } catch (err) {
      setError("Error al cargar datos de administración");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">No se pudieron cargar los datos</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Scale className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">LegalPro Admin</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Panel de Administración</h1>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.metrics.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suscripciones</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.metrics.totalSubscriptions}</div>
              <p className="text-xs text-muted-foreground">
                {data.metrics.activeSubscriptions} activas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagos Completados</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.metrics.totalPayments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Activación</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.metrics.totalSubscriptions > 0 
                  ? Math.round((data.metrics.activeSubscriptions / data.metrics.totalSubscriptions) * 100) 
                  : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle>Usuarios Recientes</CardTitle>
              <CardDescription>Últimos 10 usuarios registrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString('es-EC')}
                    </span>
                  </div>
                ))}
                {data.recentUsers.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No hay usuarios registrados</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Subscriptions */}
          <Card>
            <CardHeader>
              <CardTitle>Suscripciones Recientes</CardTitle>
              <CardDescription>Últimas 10 suscripciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentSubscriptions.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{sub.user?.name || 'N/A'}</p>
                      <p className="text-sm text-muted-foreground">
                        Plan {sub.plan?.name} - ${sub.plan?.price}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {sub.status}
                    </span>
                  </div>
                ))}
                {data.recentSubscriptions.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No hay suscripciones</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue by Plan */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Ingresos por Plan</CardTitle>
            <CardDescription>Distribución de ingresos por tipo de plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.revenueByPlan.map((revenue) => (
                <div key={revenue.planName} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Plan {revenue.planName}</p>
                    <p className="text-sm text-muted-foreground">{revenue.count} pagos</p>
                  </div>
                  <span className="font-bold text-primary">${revenue.totalRevenue}</span>
                </div>
              ))}
              {data.revenueByPlan.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No hay ingresos registrados</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
