import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Scale, Briefcase, Users, Home, Building, Store, Gavel, FileText, Check, Phone, Mail, MapPin } from "lucide-react";

const coverages = [
  { icon: Briefcase, name: "Laboral", description: "Asesoramiento en conflictos laborales, contratos y beneficios" },
  { icon: Users, name: "Demandas de Alimentos", description: "Trámites y representación en demandas de alimentos" },
  { icon: Shield, name: "Violencia Intrafamiliar", description: "Protección y asesoramiento en casos de VIF" },
  { icon: Scale, name: "Civil", description: "Conflictos civiles, contratos y obligaciones" },
  { icon: Home, name: "Bienes", description: "Trámites de propiedad, bienes raíces y herencia" },
  { icon: Building, name: "Compra Venta", description: "Asesoría en transacciones comerciales y legalización" },
  { icon: Gavel, name: "Asesoría Penal", description: "Defensa y representación en procesos penales" },
  { icon: Store, name: "Empresarial", description: "Consultas para empresas y asuntos mercantiles" },
  { icon: FileText, name: "Constitucional", description: "Amparos y protección de derechos constitucionales" },
];

const plans = [
  {
    name: "Básico",
    price: "15",
    description: "Coberturas esenciales para empleados",
    features: ["Asesoría Laboral", "Asesoría Civil", "Trámites de Bienes"],
    popular: false,
  },
  {
    name: "Familiar",
    price: "25",
    description: "Protección completa para tu familia",
    features: ["Todas las coberturas del Básico", "Demandas de Alimentos", "Violencia Intrafamiliar"],
    popular: true,
  },
  {
    name: "Empresarial",
    price: "40",
    description: "Para pequeñas y medianas empresas",
    features: ["Asesoría Laboral", "Civil", "Empresarial y Mercantil", "Asesoría Penal"],
    popular: false,
  },
  {
    name: "Premium",
    price: "50",
    description: "La protección más completa",
    features: ["Todas las coberturas", "Atención prioritaria", "Asesoría 24/7"],
    popular: false,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">LegalPro</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#servicios" className="text-sm font-medium">Servicios</Link>
            <Link href="#planes" className="text-sm font-medium">Planes</Link>
            <Link href="#contacto" className="text-sm font-medium">Contacto</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href="/register">
              <Button>Contratar Ahora</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Protección Legal Accessible
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Suscripción mensual que te protege a ti y tu familia con las mejores coberturas legales en Ecuador. 
            Rápido, fácil y sin complicaciones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#planes">
              <Button size="lg" className="w-full sm:w-auto">Ver Planes</Button>
            </Link>
            <Link href="#contacto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">Contactar Asesor</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Coverages */}
      <section id="servicios" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nuestras Coberturas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coverages.map((coverage) => (
              <Card key={coverage.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <coverage.icon className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>{coverage.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{coverage.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="planes" className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Planes de Suscripción</h2>
          <p className="text-center text-muted-foreground mb-12">Elige el plan que mejor se adapte a tus necesidades</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <Card key={plan.name} className={plan.popular ? "border-primary shadow-lg" : ""}>
                {plan.popular && (
                  <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                    Más Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/register" className="w-full">
                    <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                      Contratar
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">¿Por Qué Elegir LegalPro?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Atención Rápida</h3>
              <p className="text-muted-foreground">Contáctanos y recibe asesoramiento en menos de 24 horas</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Cobertura Completa</h3>
              <p className="text-muted-foreground">9 coberturas legales que protegen todos los aspectos de tu vida</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scale className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Profesionales Expertos</h3>
              <p className="text-muted-foreground">Abogados especializados con años de experiencia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contacto" className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Contáctanos</h2>
          <div className="max-w-xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <span>098 123 4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>contacto@legalpro.ec</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Guayaquil, Ecuador</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2026 LegalPro. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}