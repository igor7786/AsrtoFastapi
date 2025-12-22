import { Button } from '@rcomp/ui/button';
import { ArrowRight, Sparkles, Zap, Shield, Layers } from 'lucide-react';
import { AuroraText } from '@rcomp/magicui/aurora-text';
import { $nanoUser } from '@/lib/stores/user';
import { useStore } from '@nanostores/react';
import { useEffect, useState } from 'react';
import { SkeletonPage } from '@rcomp/LoadingSkeleton';
const Main = () => {
  const isUser = useStore($nanoUser);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, [isUser]);

  if (!loaded) {
    return <SkeletonPage />;
  }
  return (
    <>
      {/* Hero Section */}
      <section
        id="about"
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-16"
      >
        {/* Background Elements */}
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div
            className="border-border animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border bg-emerald-500/50 px-4 py-2 text-sm opacity-0"
            style={{
              animationDelay: '0.1s',
            }}
          >
            <Sparkles className="h-4 w-4 text-purple-300" />
            <span className="text-muted-foreground">Introducing the future of design</span>
            {isUser ? (
              <div className="flex items-center gap-4">
                <span className="text-sm leading-none font-medium">Hello {isUser.name}</span>
              </div>
            ) : null}
          </div>

          <h1
            className="font-display animate-fade-in text-5xl leading-tight font-bold tracking-tight opacity-0 md:text-7xl lg:text-8xl"
            style={{
              animationDelay: '0.2s',
            }}
          >
            Build something
            <br />
            <span className="text-gradient">extraordinary</span>
          </h1>

          <p
            className="text-muted-foreground animate-fade-in mx-auto mt-6 max-w-xl text-lg opacity-0 md:text-xl"
            style={{
              animationDelay: '0.3s',
            }}
          >
            The next generation platform for creators who demand excellence. Craft stunning experiences
            with unmatched precision.
          </p>

          <div
            className="animate-fade-in mt-10 flex flex-col items-center justify-center gap-4 opacity-0 sm:flex-row"
            style={{
              animationDelay: '0.4s',
            }}
          >
            <Button
              size="lg"
              className="bg-primary/80 text-primary-foreground shadow-glow hover:opacity-100 hover:shadow-none"
            >
              Start Building
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              className="bg-primary/80 text-primary-foreground text-justify hover:opacity-100 hover:shadow-none"
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div
            className="border-border animate-fade-in mt-20 grid grid-cols-3 gap-8 border-t pt-10 opacity-0"
            style={{
              animationDelay: '0.5s',
            }}
          >
            <div>
              <div className="font-display text-gradient text-3xl font-bold md:text-4xl">10K+</div>
              <div className="text-muted-foreground mt-1 text-sm">Active Users</div>
            </div>
            <div>
              <div className="font-display text-gradient text-3xl font-bold md:text-4xl">99.9%</div>
              <div className="text-muted-foreground mt-1 text-sm">Uptime</div>
            </div>
            <div>
              <div className="font-display text-gradient text-3xl font-bold md:text-4xl">24/7</div>
              <div className="text-muted-foreground mt-1 text-sm">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
              Everything you need to <span className="text-gradient">succeed</span>
            </h2>
            <p className="text-muted-foreground mt-4">
              Powerful features designed to help you build, scale, and grow without limits.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Zap className="dark:text-primary h-6 w-6 text-emerald-500" />}
              title="Lightning Fast"
              description="Optimized performance that keeps your projects running at peak speed."
              delay="0.1s"
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6 text-amber-400" />}
              title="Enterprise Security"
              description="Bank-grade encryption and security protocols to protect your data."
              delay="0.2s"
            />
            <FeatureCard
              icon={<Layers className="h-6 w-6 text-sky-700" />}
              title="Scalable Architecture"
              description="Grow from prototype to millions of users without changing your stack."
              delay="0.3s"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="ready"
        className="animate-fade-in border-primary relative border-dashed py-32 opacity-0"
        style={{
          animationDelay: '0.6s',
        }}
      >
        <div className="container mx-auto px-6">
          <div className="bg-gradient-dark border-border shadow-card bg-sidebar-accent relative overflow-hidden rounded-3xl border p-12 text-center md:p-20">
            <div className="border-primary absolute inset-0 overflow-hidden">
              <div className="bg-primary/10 absolute top-0 right-0 h-75 w-75 translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
            </div>

            <div className="bg-accent relative z-10">
              <AuroraText className="font-display text-3xl font-bold tracking-tight md:text-5xl">
                Ready to get started?
              </AuroraText>
              <p className="text-muted-foreground mx-auto mt-4 max-w-md">
                Join thousands of creators who are already building the future with Apex.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground shadow-glow font-semibold hover:opacity-90"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  className="border-muted-foreground bg-emerald-700 text-center font-serif text-lg font-semibold shadow-2xl hover:bg-emerald-600"
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}
const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => {
  return (
    <div
      className="group border-border bg-card shadow-card hover:border-primary/30 hover:shadow-glow animate-fade-in rounded-2xl border p-8 opacity-0 transition-all duration-300"
      style={{
        animationDelay: delay,
      }}
    >
      <div className="bg-gradient-primary text-primary-foreground mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl">
        {icon}
      </div>
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2">{description}</p>
    </div>
  );
};
export default Main;
