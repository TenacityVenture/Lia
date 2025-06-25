import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-12">
      <Link
        href="/"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <div className="space-y-4 mb-12">
        <h1 className="text-4xl font-bold">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: January 1, 2025</p>
      </div>

      <div className="space-y-8 text-muted-foreground">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
          <p>
            Welcome to LIA - LinkedIn Intelligent Assistant. These Terms of Service (&quot;Terms&quot;) govern your use of our
            website, Chrome extension, and services (collectively, the &quot;Services&quot;) operated by LIA (&quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;).
          </p>
          <p className="mt-4">
            By accessing or using our Services, you agree to be bound by these Terms. If you disagree with any part of
            the Terms, you may not access the Services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">2. Use of Services</h2>
          <p>
            Our Services are designed to help you enhance your LinkedIn presence through AI-powered content generation
            and suggestions. You may use our Services only as permitted by these Terms and any applicable laws and
            regulations.
          </p>
          <p className="mt-4">
            You are responsible for maintaining the confidentiality of your account information, including your
            password, and for all activity that occurs under your account. You agree to notify us immediately of any
            unauthorized use of your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Content</h2>
          <p>
            Our Services may allow you to generate, post, send, receive, and store content (&quot;User Content&quot;). By
            providing User Content through our Services, you grant us a worldwide, non-exclusive, royalty-free license
            to use, copy, modify, create derivative works based on, distribute, publicly display, and publicly perform
            your User Content for the purposes of operating and providing our Services.
          </p>
          <p className="mt-4">
            You are solely responsible for your User Content and the consequences of posting or publishing it. We do not
            endorse any User Content or any opinion, recommendation, or advice expressed therein, and we expressly
            disclaim any and all liability in connection with User Content.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">4. Intellectual Property</h2>
          <p>
            Our Services and their original content, features, and functionality are and will remain the exclusive
            property of LIA and its licensors. Our Services are protected by copyright, trademark, and other laws of
            both the United States and foreign countries.
          </p>
          <p className="mt-4">
            Our trademarks and trade dress may not be used in connection with any product or service without the prior
            written consent of LIA.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">5. Third-Party Services</h2>
          <p>
            Our Services may contain links to third-party websites or services that are not owned or controlled by LIA.
            We have no control over, and assume no responsibility for, the content, privacy policies, or practices of
            any third-party websites or services.
          </p>
          <p className="mt-4">
            You acknowledge and agree that LIA shall not be responsible or liable, directly or indirectly, for any
            damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such
            content, goods, or services available on or through any such websites or services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">6. OpenAI API Usage</h2>
          <p>
            Our Services utilize the OpenAI API to generate content. By using our Services, you acknowledge that content
            generated through the OpenAI API is subject to OpenAI&apos;s terms of service and usage policies.
          </p>
          <p className="mt-4">
            Please review{" "}
              <Link href="https://openai.com/privacy/" target="_blank" className="text-primary hover:underline">
                OpenAI&apos;s Privacy Policy
              </Link>{" "}
              for information on how they handle data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">7. Limitation of Liability</h2>
          <p>
            In no event shall LIA, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable
            for any indirect, incidental, special, consequential, or punitive damages, including without limitation,
            loss of profits, data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Your access to or use of or inability to access or use the Services;</li>
            <li>Any conduct or content of any third party on the Services;</li>
            <li>Any content obtained from the Services; and</li>
            <li>
              Unauthorized access, use, or alteration of your transmissions or content, whether based on warranty,
              contract, tort (including negligence), or any other legal theory, whether or not we have been informed of
              the possibility of such damage.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">8. Disclaimer</h2>
          <p>
            Your use of the Services is at your sole risk. The Services are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot;
            basis. The Services are provided without warranties of any kind, whether express or implied, including, but
            not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement,
            or course of performance.
          </p>
          <p className="mt-4">
            LIA does not warrant that: (a) the Services will function uninterrupted, secure, or available at any
            particular time or location; (b) any errors or defects will be corrected; (c) the Services are free of
            viruses or other harmful components; or (d) the results of using the Services will meet your requirements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">9. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is
            material, we will try to provide at least 30 days&apos; notice prior to any new terms taking effect. What
            constitutes a material change will be determined at our sole discretion.
          </p>
          <p className="mt-4">
            By continuing to access or use our Services after those revisions become effective, you agree to be bound by
            the revised terms. If you do not agree to the new terms, please stop using the Services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">10. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the United States, without regard
            to its conflict of law provisions.
          </p>
          <p className="mt-4">
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those
            rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining
            provisions of these Terms will remain in effect.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at:</p>
          <p className="mt-2">Email: privacy@getlia.live</p>
        </section>
      </div>
    </div>
  )
}
