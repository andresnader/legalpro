"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scale, CreditCard, Shield, Check, Loader2 } from "lucide-react";

const plans = [
  { name: "Básico", price: 15, features: ["Asesoría Laboral", "Asesoría Civil", "Trámites de Bienes"] },
  { name: "Familiar", price: 25, features: ["Todas las coberturas del Básico", "Demandas de Alimentos", "Violencia Intrafamiliar"] },
  { name: "Empresarial", price: 40, features: ["Asesoría Laboral", "Civil", "Empresarial y Mercantil", "Asesoría Penal"] },
  { name: "Premium", price: 50, features: ["Todas las coberturas", "Atención prioritaria", "Asesoría 24/7"] },
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planName = searchParams.get("plan");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvc: "",
  });

  const plan = plans.find((p) => p.name === planName);

  useEffect(() => {
    if (!planName || !plan) {
      router.push("/register");
    }
  }, [planName, plan, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false);
    setSuccess(true);
  };

  if (!plan) return null;

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <Check className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">¡Registro Exitoso!</CardTitle>
            <CardDescription>
              Tu suscripción al plan {plan.name} ha sido activada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Pronto recibirás un email con los detalles de tu suscripción y acceso a todos los servicios legales.
            </p>
            <div className="bg-muted p-4 rounded-lg mb-6">
              <p className="font-semibold">Plan: {plan.name}</p>
              <p className="text-2xl font-bold text-primary">${plan.price}/mes</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/dashboard")}>
              Ir a mi Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <div className="flex items-center gap-2 mb-8">
          <Scale className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">LegalPro</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Información de Pago</CardTitle>
              <CardDescription>Ingresa los datos de tu tarjeta</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardName">Nombre en la tarjeta</Label>
                  <Input 
                    id="cardName" 
                    placeholder="JUAN PEREZ"
                    value={formData.cardName}
                    onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Número de tarjeta</Label>
                  <Input 
                    id="cardNumber" 
                    placeholder="4111 1111 1111 1111"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Vencimiento</Label>
                    <Input 
                      id="expiry" 
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input 
                      id="cvc" 
                      placeholder="123"
                      value={formData.cvc}
                      onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Procesando..." : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pagar ${plan.price}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <div>
                      <p className="font-semibold">Plan {plan.name}</p>
                      <p className="text-sm text-muted-foreground">Suscripción mensual</p>
                    </div>
                    <span className="font-bold">${plan.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary">${plan.price}/mes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Coberturas Incluidas</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Pago seguro con encriptación SSL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
