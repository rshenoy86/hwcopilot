import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, BookOpen, Printer, Sparkles, ChevronRight, ClipboardList, MessageCircle, Monitor, AlertTriangle } from "lucide-react";
import Mascot from "@/components/mascot";

const FAQ = [
  {
    q: "What grades does GuruBuddy support?",
    a: "Kindergarten through 8th grade. Everything is tailored to your child's exact grade level: age-appropriate language, the right complexity, and content that matches what they're actually learning in class.",
  },
  {
    q: "How is the content personalized?",
    a: "When you create a child profile, you tell us their grade, subjects, and interests. Soccer, Minecraft, dinosaurs, whatever they're into. GuruBuddy weaves those interests into every worksheet and test, so the content actually feels relevant to your kid.",
  },
  {
    q: "How does test prep work?",
    a: "Pick a subject and topic, and GuruBuddy generates a full practice test in about 30 seconds. Multiple choice, short answer, and show-your-work questions, just like a real classroom test. Your child can take it online right in the browser, or you can print it. Either way, GuruBuddy grades it instantly, shows exactly where they struggled, and creates extra practice to help them get it.",
  },
  {
    q: "What curriculum does GuruBuddy follow?",
    a: "All content is aligned to the Texas Essential Knowledge and Skills (TEKS) for K–8. Subjects include Math, ELA/Reading/Writing, Science, and Social Studies.",
  },
  {
    q: "What's the difference between Free and Pro?",
    a: "Free gives you 10 worksheets and 1 test prep per month with 1 child profile. Enough to try everything and see how it works. Pro ($12/month) gives you 250 worksheets, 10 test preps, unlimited child profiles, and AI Homework Help. Most families use a fraction of those limits.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your account settings with one click. No hidden fees, no contracts, no hassle.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-40">
        <div className="container mx-auto max-w-6xl px-4 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-1.5 font-bold text-xl text-primary">
            <Mascot size={38} />
            GuruBuddy
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
          <div className="flex justify-center mb-6">
            <Mascot size={96} />
          </div>
          <div className="inline-flex items-center gap-1.5 text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            AI-powered learning support for K–8
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Helping your child learn{" "}
            <span className="text-primary">shouldn&apos;t require a free afternoon</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Custom practice worksheets, AI-graded test prep, and homework help. All built around the Texas curriculum, and personalized to exactly what your child is studying right now.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto text-base px-8">
                Start for free
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              10 free worksheets · 1 free test prep · No credit card needed
            </p>
          </div>
        </div>
      </section>

      {/* Pain band */}
      <section className="py-16 px-4 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {[
              {
                quote: "They have a test Monday. You found out Sunday night.",
                resolution: "Generate a full practice test in 30 seconds.",
              },
              {
                quote: "You want to help with homework but you don't remember 4th grade fractions.",
                resolution: "GuruBuddy explains it step by step.",
              },
              {
                quote: "Between work, dinner, and activities, extra practice just doesn't happen.",
                resolution: "It takes one minute. That's all.",
              },
            ].map((item, i) => (
              <div key={i} className="space-y-3">
                <div className="relative">
                  <span className="text-6xl font-serif text-primary/20 leading-none select-none absolute -top-2 left-1/2 -translate-x-1/2">&ldquo;</span>
                  <p className="text-xl font-semibold text-foreground leading-snug pt-6 italic">{item.quote}</p>
                </div>
                <p className="text-sm font-semibold text-primary">{item.resolution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STAAR Assessment Hook */}
      <section className="py-24 px-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: Copy */}
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-full mb-6">
                <AlertTriangle className="h-3.5 w-3.5" />
                STAAR Season 2025
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                Do you know where your child{" "}
                <span className="text-amber-400">actually stands</span>{" "}
                before STAAR?
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                Most parents find out too late. GuruBuddy pinpoints exactly which skills your child hasn&apos;t mastered — then generates targeted worksheets to close those gaps before test day.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  { step: "1", text: "5-minute assessment tells you exactly where the gaps are" },
                  { step: "2", text: "Personalized gap report shows mastery by topic" },
                  { step: "3", text: "Targeted worksheets close the gaps before STAAR" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-amber-400 text-slate-900 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <p className="text-slate-200 text-sm leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>

              <Link href="/signup">
                <Button size="lg" className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold text-base px-8">
                  Find your child&apos;s STAAR gaps — free
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <p className="text-slate-400 text-xs mt-3">No credit card needed. Works for grades 3–8.</p>
            </div>

            {/* Right: Static mock gap report */}
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-slate-900">
                {/* Report header */}
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-base font-bold text-indigo-600">
                    E
                  </div>
                  <div>
                    <p className="font-bold text-sm">Emma · 4th Grade</p>
                    <p className="text-xs text-slate-500">STAAR Math Readiness</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                      3 gaps found
                    </span>
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-4 mb-5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Skill Mastery</p>
                  {[
                    { skill: "Fractions & Decimals", pct: 38, color: "bg-red-500" },
                    { skill: "Geometry & Measurement", pct: 61, color: "bg-amber-400" },
                    { skill: "Place Value", pct: 88, color: "bg-emerald-500" },
                    { skill: "Data & Graphs", pct: 70, color: "bg-amber-400" },
                  ].map((s) => (
                    <div key={s.skill}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-medium text-slate-700">{s.skill}</span>
                        <span className="text-slate-400">{s.pct}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${s.color} rounded-full transition-all`} style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Worksheets ready */}
                <div className="bg-indigo-50 rounded-xl p-3 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-indigo-900">2 worksheets ready</p>
                    <p className="text-xs text-indigo-600">Targeted practice for Emma&apos;s gaps</p>
                  </div>
                </div>

                <p className="text-center text-xs text-slate-300 mt-4">Sample report · yours generates in seconds</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3 ways GuruBuddy helps */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold">Three ways GuruBuddy supports your child</h2>
            <p className="text-muted-foreground mt-3 text-lg max-w-xl mx-auto">
              Whether it&apos;s daily practice, test prep, or a homework question at 9pm, GuruBuddy is ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                gradient: "from-blue-500 to-indigo-600",
                shadow: "shadow-blue-100",
                title: "Practice Worksheets",
                description: "Custom worksheets built around your child's exact grade, current topic, and interests. Ready to print or practice online in 30 seconds.",
                bullets: ["K–8 all subjects", "Personalized to their interests", "Answer key included"],
              },
              {
                icon: ClipboardList,
                gradient: "from-violet-500 to-purple-600",
                shadow: "shadow-violet-100",
                title: "Test Prep",
                description: "Generate a real practice test with multiple choice, short answer, and show-your-work questions. Take it online or print it. Get instant feedback and extra practice on anything they missed.",
                bullets: ["Online or print mode", "Instant AI grading", "Follow-up practice included"],
              },
              {
                icon: MessageCircle,
                gradient: "from-emerald-500 to-teal-600",
                shadow: "shadow-emerald-100",
                title: "Homework Help",
                description: "Stuck on a problem at 9pm? Just ask. GuruBuddy explains exactly what's going on, step by step, in language your child actually understands. No judgment, no frustration.",
                bullets: ["Ask anything K–8", "Step-by-step explanations", "Available anytime"],
              },
            ].map((item) => (
              <Card key={item.title} className={`border-0 shadow-lg ${item.shadow}`}>
                <CardContent className="p-6">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 shadow-md`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.description}</p>
                  <ul className="space-y-1.5">
                    {item.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Up and running in 2 minutes</h2>
            <p className="text-muted-foreground mt-3 text-lg">
              Set it up once. Use it every time they need help.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6">
            <div className="hidden md:block absolute top-12 left-[calc(33%+2rem)] right-[calc(33%+2rem)] border-t-2 border-dashed border-slate-300" />

            {[
              {
                step: "1",
                gradient: "from-blue-500 to-indigo-600",
                shadow: "shadow-blue-200",
                Icon: BookOpen,
                title: "Set up your child",
                description: "Tell us their grade, the subjects they're working on, and what they're into. Takes 60 seconds and makes everything personal.",
                tags: ["Grade K–8", "Any subject"],
              },
              {
                step: "2",
                gradient: "from-violet-500 to-purple-600",
                shadow: "shadow-violet-200",
                Icon: Sparkles,
                title: "Get what you need",
                description: "Choose a worksheet, practice test, or homework question. GuruBuddy generates it instantly. Personalized, ready to use, and actually relevant to what they're learning.",
                tags: ["Worksheets", "Tests", "Help"],
              },
              {
                step: "3",
                gradient: "from-emerald-500 to-teal-600",
                shadow: "shadow-emerald-200",
                Icon: Monitor,
                title: "See where they stand",
                description: "Graded results show exactly what your child knows and what needs more work. So you always know what to focus on next.",
                tags: ["Instant feedback", "Know what to work on"],
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className={`h-24 w-24 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-xl ${item.shadow}`}>
                    <item.Icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 h-7 w-7 rounded-full bg-amber-400 text-white text-sm font-bold flex items-center justify-center shadow-md border-2 border-white">
                    {item.step}
                  </div>
                </div>
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
            <h2 className="text-3xl font-bold">Built for the reality of family life</h2>
            <p className="text-muted-foreground mt-2">
              Not a tutoring center. Not a generic app. A tool that works on your schedule, in your home.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: "🎯",
                title: "Actually personalized",
                description: "Your child loves basketball? Space? Roblox? It shows up in every word problem and example. This is the difference between \"fine\" and \"they actually want to do it.\"",
              },
              {
                icon: "⚡",
                title: "Ready in 30 seconds",
                description: "From opening the app to a complete, personalized worksheet or practice test. No planning, no prep, no searching for resources.",
              },
              {
                icon: "📋",
                title: "Real test prep",
                description: "Not just flashcards. Full practice tests with multiple choice, short answer, and show-your-work. Graded by AI with extra practice on anything they missed.",
              },
              {
                icon: "📚",
                title: "Matches what they're learning",
                description: "Every worksheet and test is built around the Texas curriculum (TEKS) for K-8. What GuruBuddy generates is exactly what your child is supposed to be learning right now.",
              },
              {
                icon: "💬",
                title: "Homework help, anytime",
                description: "Ask any question and get a clear, step-by-step explanation. Even if it's 9pm and you've forgotten how long division works.",
              },
              {
                icon: "🖨️",
                title: "Print or go digital",
                description: "Worksheets and tests print beautifully in black and white. Or skip the printer and do everything online.",
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
              Try everything free. Upgrade when your family needs more.
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
                    "10 worksheets per month",
                    "1 test prep per month",
                    "1 child profile",
                    "All subjects & grade levels",
                    "Answer keys included",
                    "Online or print mode",
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
                    "250 worksheets/month",
                    "10 test preps/month",
                    "Unlimited child profiles",
                    "AI Homework Help",
                    "All subjects & difficulty levels",
                    "Priority support",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button className="w-full">Get started free</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Less than a dollar a day to never feel unprepared for homework time again.
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
          <h2 className="text-3xl font-bold">Your kid&apos;s next test is coming. Be ready.</h2>
          <p className="mt-3 text-primary-foreground/80 text-lg">
            GuruBuddy takes the stress out of homework time. For you and for them.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base px-8">
                Start for free today
              </Button>
            </Link>
          </div>
          <p className="mt-3 text-sm text-primary-foreground/60">
            10 free worksheets + 1 free test prep every month. No credit card.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-1.5 font-bold text-primary">
            <Mascot size={28} />
            GuruBuddy
          </Link>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-foreground">Sign in</Link>
            <Link href="/signup" className="hover:text-foreground">Sign up</Link>
            <Link href="#pricing" className="hover:text-foreground">Pricing</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} GuruBuddy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
