import Link from "next/link";
import Mascot from "@/components/mascot";

export const metadata = {
  title: "Privacy Policy — GuruBuddy",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-1.5 font-bold text-xl text-primary mb-8">
            <Mascot size={36} />
            GuruBuddy
          </Link>
          <h1 className="text-3xl font-bold mt-6">Privacy Policy</h1>
          <p className="text-muted-foreground mt-2">Last updated: March 28, 2026</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold mb-2">1. Overview</h2>
            <p>GuruBuddy is an AI-powered educational worksheet platform for K–8 students. This policy explains what information we collect, how we use it, and your rights. We take children&apos;s privacy seriously and comply with the Children&apos;s Online Privacy Protection Act (COPPA).</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">2. Who We Collect Data About</h2>
            <p>GuruBuddy accounts are held by parents and guardians (adults 18+). We do not allow children to create their own accounts. Information about children is entered by their parent or guardian and is used only to personalize educational content.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">3. Information We Collect</h2>
            <p><strong>Account information:</strong> Your email address and encrypted password when you sign up.</p>
            <p className="mt-2"><strong>Child profile information:</strong> Your child&apos;s first name, grade level, subjects, interests, and optional learning notes. This information is provided by you and used solely to generate personalized worksheets.</p>
            <p className="mt-2"><strong>Usage data:</strong> Worksheets generated, homework help sessions, and subscription status. We use this to enforce usage limits and improve the service.</p>
            <p className="mt-2"><strong>Payment information:</strong> Payments are processed by Stripe. GuruBuddy never sees or stores your full credit card number. We receive a customer ID and subscription status from Stripe.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">4. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To generate personalized worksheets and homework help for your child</li>
              <li>To manage your account and subscription</li>
              <li>To enforce usage limits and prevent abuse</li>
              <li>To send important account and billing notifications</li>
              <li>To improve the service (aggregate, anonymized usage patterns only)</li>
            </ul>
            <p className="mt-2">We do not sell your data. We do not use children&apos;s information for advertising.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">5. Third-Party Services</h2>
            <p>We use the following third-party services to operate GuruBuddy:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Supabase</strong> — Database and authentication. Data is stored in the US.</li>
              <li><strong>Anthropic</strong> — AI model provider (Claude). Worksheet prompts including your child&apos;s name, grade, and interests are sent to Anthropic&apos;s API to generate content. Anthropic&apos;s data usage policy applies.</li>
              <li><strong>Stripe</strong> — Payment processing. Stripe&apos;s privacy policy governs payment data.</li>
              <li><strong>Vercel</strong> — Application hosting and deployment.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">6. Children&apos;s Privacy (COPPA)</h2>
            <p>GuruBuddy is designed for use by parents on behalf of their children. We do not knowingly collect personal information directly from children under 13. All child profile data is entered by a verified adult account holder. If you believe a child has provided personal information without parental consent, please contact us at <a href="mailto:support@gurubuddy.com" className="text-primary underline">support@gurubuddy.com</a> and we will delete it promptly.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">7. Data Retention</h2>
            <p>We retain your account and child profile data for as long as your account is active. Worksheets are retained so you can access them later. You may request deletion of your account and all associated data at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">8. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Access the personal information we hold about you and your child</li>
              <li>Correct inaccurate information (via your account settings)</li>
              <li>Delete your account and all associated data</li>
              <li>Withdraw consent for data processing (by deleting your account)</li>
            </ul>
            <p className="mt-2">To exercise these rights, contact us at <a href="mailto:support@gurubuddy.com" className="text-primary underline">support@gurubuddy.com</a>.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">9. Security</h2>
            <p>We use industry-standard security practices including encrypted connections (HTTPS), hashed passwords, and row-level database security. No method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">10. Changes to This Policy</h2>
            <p>We may update this policy periodically. We will notify you of material changes via email. Continued use of GuruBuddy after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">11. Contact</h2>
            <p>Questions about privacy? Email us at <a href="mailto:support@gurubuddy.com" className="text-primary underline">support@gurubuddy.com</a>.</p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t">
          <Link href="/" className="text-sm text-primary hover:underline">← Back to GuruBuddy</Link>
        </div>
      </div>
    </div>
  );
}
