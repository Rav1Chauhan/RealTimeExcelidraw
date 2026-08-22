import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import {
  Pencil,
  Share2,
  Users2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Collaborative Whiteboarding
              <span className="text-primary block">
                Made Simple
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Create, collaborate, and share beautiful
              diagrams and sketches with our intuitive
              drawing tool.
            </p>

            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/signin">
                <Button
                  variant="primary"
                  size="lg"
                  className="h-12 px-6"
                >
                  Sign in
                  <Pencil className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/signup">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-6"
                >
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-muted/50 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-2 p-6 transition-colors hover:border-primary">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Share2 className="h-6 w-6 text-primary" />
                </div>

                <h3 className="text-xl font-semibold">
                  Real-time Collaboration
                </h3>
              </div>

              <p className="mt-4 text-muted-foreground">
                Work together with your team in real-time.
                Share your drawings instantly with a simple
                link.
              </p>
            </Card>

            <Card className="border-2 p-6 transition-colors hover:border-primary">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Users2 className="h-6 w-6 text-primary" />
                </div>

                <h3 className="text-xl font-semibold">
                  Multiplayer Editing
                </h3>
              </div>

              <p className="mt-4 text-muted-foreground">
                Multiple users can edit the same canvas
                simultaneously. See who's drawing what in
                real-time.
              </p>
            </Card>

            <Card className="border-2 p-6 transition-colors hover:border-primary">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>

                <h3 className="text-xl font-semibold">
                  Smart Drawing
                </h3>
              </div>

              <p className="mt-4 text-muted-foreground">
                Intelligent shape recognition and drawing
                assistance helps you create perfect diagrams.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-primary p-8 sm:p-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Ready to start creating?
              </h2>

              <p className="mx-auto mt-6 max-w-xl text-lg text-primary-foreground/80">
                Create amazing diagrams and sketches with
                your team in real-time.
              </p>

              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/createcanvas">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="h-12 px-6"
                  >
                    Open Canvas
                    <Pencil className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/createcanvas">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 border-primary-foreground bg-transparent px-6 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  >
                    View Canvas
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2026 Excalidraw Clone. All rights reserved.
            </p>

            <div className="flex space-x-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="GitHub"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.01c-3.2.7-3.87-1.35-3.87-1.35-.53-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.21-1.5 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.08.78 2.18v3.24c0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}