import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, BookOpen, Printer, Sparkles, ChevronRight } from "lucide-react";

const FAQ = [
  {
    q: "What grades does HWCopilot support?",
    a: "Kindergarten through 8th grade. Every worksheet is tailored to the grade level, with age-appropriate language, problem complexity, and visual layout.",
  },
  {
    q: "How are worksheets personalized?",
    a: "When you create a child profile, you tell us their interests — dinosaurs, soccer, Minecraft, whatever they love. Our AI weaves those interests into word problems and examples, making homework feel relevant and engaging.",
  },
  {
    q: "What curriculum do the worksheets follow?",
    a: "Worksheets align to US Common Core standards for K-8. Subjects include Math, ELA/Reading/Writing, Science, and Social Studies.",
  },
  {
    q: "Can I print worksheets?",
    a: "Yes! Every worksheet has a Print button that opens a clean, print-optimized view. Just hit Ctrl+P (or Cmd+P on Mac). They print beautifully in black and white.",
  },
  {
    q: "What's the difference between Free and Pro?",
    a: "Free gives you 5 worksheets per month and 1 child profile — enough to try it out. Pro ($12/month) gives you 250 worksheets, unlimited children, and AI Homework Help. Most families never come close to the 250-worksheet limit.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your account settings with one click. No hidden fees, no contracts.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-40">
        <div className="container mx-auto max-w-6xl px-4 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            ✏️ HWCopilot
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get started free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-24 px-4 text-center">
        <div className="container mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-1.5 text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            AI-powered homework practice
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Homework practice that actually matches{" "}
            <span className="text-primary">what your kid is learning, today</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Personalized worksheets for K–8, built around your child&apos;s exact grade, current subjects, and the things they love. Ready to print in 30 seconds.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto text-base px-8">
                Start for free
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              5 free worksheets · No credit card needed
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Done in 3 steps</h2>
            <p className="text-muted-foreground mt-3 text-lg">
              From signup to printed worksheet in under 2 minutes.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6">
            {/* Dashed connector line */}
            <div className="hidden md:block absolute top-12 left-[calc(33%+2rem)] right-[calc(33%+2rem)] border-t-2 border-dashed border-slate-300" />

            {[
              {
                step: "1",
                gradient: "from-blue-500 to-indigo-600",
                shadow: "shadow-blue-200",
                Icon: BookOpen,
                title: "Add your child",
                description: "Tell us their grade, the subjects you want to practice, and what they love. Takes 60 seconds.",
                tags: ["Grade K–8", "Any subject"],
              },
              {
                step: "2",
                gradient: "from-violet-500 to-purple-600",
                shadow: "shadow-violet-200",
                Icon: Sparkles,
                title: "Pick a subject",
                description: "Choose a subject and topic from our curriculum-aligned list, set the difficulty, and hit generate.",
                tags: ["Math", "Science", "ELA"],
              },
              {
                step: "3",
                gradient: "from-emerald-500 to-teal-600",
                shadow: "shadow-emerald-200",
                Icon: Printer,
                title: "Print and practice",
                description: "Your personalized worksheet is ready instantly. Print it, and watch your kid actually enjoy it.",
                tags: ["30 seconds", "Answer key"],
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                {/* Icon circle */}
                <div className="relative mb-6">
                  <div className={`h-24 w-24 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-xl ${item.shadow}`}>
                    <item.Icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 h-7 w-7 rounded-full bg-amber-400 text-white text-sm font-bold flex items-center justify-center shadow-md border-2 border-white">
                    {item.step}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex gap-1.5 mb-4 flex-wrap justify-center">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-[230px]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Built for real families</h2>
            <p className="text-muted-foreground mt-2">
              Not another generic worksheet site. This one actually knows your kid.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: "📚",
                title: "Curriculum-aligned",
                description: "Every worksheet matches US Common Core standards for your child's exact grade level.",
              },
              {
                icon: "🎯",
                title: "Truly personalized",
                description: "Your child loves soccer? Minecraft? Dinosaurs? We put those in the word problems.",
              },
              {
                icon: "🖨️",
                title: "Print-ready",
                description: "Clean, beautiful layouts that print perfectly in black and white. No ink waste.",
              },
              {
                icon: "⚡",
                title: "30 seconds",
                description: "From clicking Generate to a ready-to-print worksheet, every time.",
              },
              {
                icon: "📝",
                title: "Answer key included",
                description: "Every worksheet comes with a complete answer key with explanations. Parents rejoice.",
              },
              {
                icon: "💬",
                title: "Homework help",
                description: "Stuck on a problem? Ask anything and get a step-by-step explanation (Pro).",
              },
            ].map((f) => (
              <Card key={f.title} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-semibold mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-secondary/30" id="pricing">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Simple, honest pricing</h2>
            <p className="text-muted-foreground mt-2">
              Start free. Upgrade when you need more.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="font-bold text-lg">Free</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold">$0</span>
                    <span className="text-muted-foreground">/ month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">No credit card needed</p>
                </div>
                <ul className="space-y-2 mb-6">
                  {[
                    "5 worksheets per month",
                    "1 child profile",
                    "All subjects & grade levels",
                    "Answer keys included",
                    "Print-ready format",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button variant="outline" className="w-full">Get started free</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="border-primary shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
                Most Popular
              </div>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="font-bold text-lg">Pro</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold">$12</span>
                    <span className="text-muted-foreground">/ month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Cancel anytime</p>
                </div>
                <ul className="space-y-2 mb-6">
                  {[
                    "250 worksheets/month — that's 8 per day",
                    "Unlimited child profiles",
                    "AI Homework Help",
                    "All subjects & difficulty levels",
                    "Answer keys with explanations",
                    "Priority support",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button className="w-full">Start Pro free trial</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            250 worksheets/month is more than 8 per day — more than enough for even the most studious family.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Questions? We have answers.</h2>
          </div>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <Card key={item.q}>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2">{item.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold">Ready to make homework easier?</h2>
          <p className="mt-3 text-primary-foreground/80 text-lg">
            Join thousands of parents who have made homework time less stressful.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto text-base px-8"
              >
                Start for free today
              </Button>
            </Link>
          </div>
          <p className="mt-3 text-sm text-primary-foreground/60">
            5 free worksheets every month. No credit card.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="font-bold text-primary">
            ✏️ HWCopilot
          </Link>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-foreground">Sign in</Link>
            <Link href="/signup" className="hover:text-foreground">Sign up</Link>
            <Link href="#pricing" className="hover:text-foreground">Pricing</Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} HWCopilot. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
