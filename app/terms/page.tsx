import Link from "next/link";
import Mascot from "@/components/mascot";

export const metadata = {
  title: "Terms of Service — GuruBuddy",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-1.5 font-bold text-xl text-primary mb-8">
            <Mascot size={36} />
            GuruBuddy
          </Link>
          <h1 className="text-3xl font-bold mt-6">Terms of Service</h1>
          <p className="text-muted-foreground mt-2">Last updated: March 28, 2026</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold mb-2">1. Agreement to Terms</h2>
            <p>By creating an account with GuruBuddy, you agree to these Terms of Service. If you do not agree, please do not use GuruBuddy. These terms apply to all users of the service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">2. Who May Use GuruBuddy</h2>
            <p>GuruBuddy is intended for use by parents and legal guardians (&ldquo;you&rdquo;) on behalf of their children. You must be at least 18 years old to create an account. By creating child profiles, you confirm that you are the parent or legal guardian of those children and consent to the collection and use of their educational information as described in our Privacy Policy.</p>
            <p className="mt-2">Children do not create their own accounts. All accounts are held by adults.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">3. AI-Generated Content Disclaimer</h2>
            <p>GuruBuddy uses artificial intelligence to generate educational worksheets and provide homework assistance. You acknowledge that:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>AI-generated content may contain errors, inaccuracies, or omissions</li>
              <li>Worksheets are practice tools and are not a substitute for professional educational assessment or instruction</li>
              <li>You should review all AI-generated content before your child uses it</li>
              <li>GuruBuddy makes no guarantees about academic outcomes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">4. Acceptable Use</h2>
            <p>You agree to use GuruBuddy only for its intended purpose of supporting children&apos;s educational practice. You agree not to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Attempt to generate content involving violence, drugs, alcohol, sexual content, or any material inappropriate for children</li>
              <li>Use the service for any purpose other than legitimate educational practice</li>
              <li>Share your account credentials with others</li>
              <li>Attempt to circumvent usage limits or access controls</li>
              <li>Use the service in any way that violates applicable laws</li>
            </ul>
            <p className="mt-2">We reserve the right to terminate accounts that violate these terms without notice or refund.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">5. Content You Provide</h2>
            <p>When you enter information about your child (name, grade, interests, learning notes), you confirm that this information is appropriate and does not include harmful, offensive, or illegal content. We use this information solely to personalize educational content.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">6. Subscriptions and Billing</h2>
            <p>GuruBuddy offers a free tier (5 worksheets/month) and a Pro subscription ($12/month). Subscriptions are billed monthly and renew automatically. You may cancel at any time through the billing portal; cancellation takes effect at the end of the current billing period. All payments are processed by Stripe. We do not store payment card information.</p>
            <p className="mt-2">Refunds are handled on a case-by-case basis. Contact us at support@gurubuddy.com for billing issues.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">7. Intellectual Property</h2>
            <p>The worksheets generated for your child are yours to use for personal, non-commercial educational purposes. You may not resell or redistribute AI-generated worksheets. GuruBuddy retains rights to the platform, software, and underlying systems.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">8. Limitation of Liability</h2>
            <p>GuruBuddy is provided &ldquo;as is.&rdquo; To the maximum extent permitted by law, GuruBuddy and its operators shall not be liable for any indirect, incidental, or consequential damages arising from use of the service. Our total liability shall not exceed the amount you paid in the 3 months preceding any claim.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">9. Changes to Terms</h2>
            <p>We may update these terms from time to time. We will notify you of material changes via email. Continued use of GuruBuddy after changes constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">10. Contact</h2>
            <p>For questions about these terms, contact us at <a href="mailto:support@gurubuddy.com" className="text-primary underline">support@gurubuddy.com</a>.</p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t">
          <Link href="/" className="text-sm text-primary hover:underline">← Back to GuruBuddy</Link>
        </div>
      </div>
    </div>
  );
}
