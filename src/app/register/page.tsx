"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Check } from "lucide-react";

const plans = [
  { name: "Básico", price: 15, features: ["Asesoría Laboral", "Asesoría Civil", "Trámites de Bienes"] },
  { name: "Familiar", price: 25, features: ["Todas las coberturas del Básico", "Demandas de Alimentos", "Violencia Intrafamiliar"], popular: true },
  { name: "Empresarial", price: 40, features: ["Asesoría Laboral", "Civil", "Empresarial y Mercantil", "Asesoría Penal"] },
  { name: "Premium", price: 50, features: ["Todas las coberturas", "Atención prioritaria", "Asesoría 24/7"] },
];

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    cedula: "",
  });

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      setError("Error al registrarte");
      setLoading(false);
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.password) {
      if (formData.password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        return;
      }
      setError("");
      setStep(2);
    }
  };

  const handleRegister = async () => {
    if (!selectedPlan) {
      setError("Por favor selecciona un plan");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Register user
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al registrarte");
        setLoading(false);
        return;
      }

      // Auto login after registration
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Registro exitoso, pero error al iniciar sesión");
        setLoading(false);
        return;
      }

      router.push("/checkout?plan=" + selectedPlan);
      router.refresh();
    } catch (err) {
      setError("Error al registrarte");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Scale className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {step === 1 ? "Crea tu Cuenta" : "Elige tu Plan"}
          </CardTitle>
          <CardDescription>
            {step === 1 
              ? "Regístrate para comenzar" 
              : "Selecciona el plan que mejor se adapte a ti"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleContinue} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input 
                  id="name" 
                  placeholder="Juan Pérez"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password" 
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input 
                  id="phone" 
                  placeholder="099 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cedula">Cédula</Label>
                <Input 
                  id="cedula" 
                  placeholder="0901234567"
                  value={formData.cedula}
                  onChange={(e) => setFormData({...formData, cedula: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full">
                Continuar
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    onClick={() => setSelectedPlan(plan.name)}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPlan === plan.name 
                        ? "border-primary bg-primary/5" 
                        : "hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPlan === plan.name ? "border-primary" : "border-muted-foreground"
                        }`}>
                          {selectedPlan === plan.name && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                        </div>
                        <span className="font-semibold">{plan.name}</span>
                        {plan.popular && (
                          <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <span className="font-bold">${plan.price}/mes</span>
                    </div>
                    <ul className="space-y-1 ml-7">
                      {plan.features.map((feature) => (
                        <li key={feature} className="text-sm text-muted-foreground flex items-center gap-1">
                          <Check className="h-3 w-3 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <Button 
                className="w-full" 
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? "Procesando..." : "Continuar al Pago"}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setStep(1)}>
                Atrás
              </Button>
            </div>
          )}

          {step === 1 && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    o
                  </span>
                </div>
              </div>

              <Button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                {loading ? "Cargando..." : "Continuar con Google"}
              </Button>
            </>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}