import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  LayoutGrid,
  Table,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export const Route = createFileRoute("/_app/")({ component: AppIndex });

function AppIndex() {
  return (
    <div className="min-h-screen bg-linear-to-b from-muted to-primary/60">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-black text-primary">TaskFlow</div>
          <Link to="/auth">
            <Button variant={"outline"}>Login</Button>
          </Link>
        </nav>
      </header>

      {/* Hero section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-primary">
            Organize yous tasks
            <br />
            intelligently
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Manage your projects with table, kanban, and calendar views. All in
            one place.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/auth">
              <Button
                size={"lg"}
                className="bg-primary hover:opacity-90 shadow shadow-primary"
              >
                Get started for free <ArrowRight className="ml-2 size-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Table className="size-6 text-background" />,
              title: "Table View",
              description:
                "Organize and filter your tasks in a clear and intuitive table.",
            },
            {
              icon: <LayoutGrid className="size-6 text-background" />,
              title: "Kanban Board",
              description:
                "Visualize the progress of your tasks with the interactive kanban board.",
            },
            {
              icon: <Calendar className="size-6 text-background" />,
              title: "Calendar",
              description:
                "Plan your tasks and deadlines on a visual calendar.",
            },
          ].map((feature, index) => (
            <Card key={`${feature.title}-${index}`}>
              <CardHeader className="flex">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-12">
            Why choose TaskFlow?
          </h3>
          <div className="space-y-4">
            {[
              "Modern and intuitive interface",
              "Multiple view of better productivity",
              "Organized by categories and priorities",
              "Real-time synchronization",
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border"
              >
                <CheckCircle2 className="size-6 text-primary flex-shrink-0" />
                <span className="text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-primary rounded-2xl p-12 shadow shadow-primary">
          <h3 className="text-2xl md:text-3xl font-bold text-background mb-4">
            Ready to boost your productivity?
          </h3>
          <p className="text-background/90 text-lg mb-8">
            Start organizing your tasks right now.
          </p>
          <Link to="/auth">
            <Button size={"lg"} variant={"secondary"}>
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 TaskFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
