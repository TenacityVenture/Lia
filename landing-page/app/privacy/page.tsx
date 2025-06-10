/* eslint-disable react/no-unescaped-entities */

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: January 1, 2025</p>
      </div>

      <div className="space-y-8 text-muted-foreground">
        <section className="mb-8">
          <h2>Introduction</h2>
          <p>
            At LinkedIn Intelligent Assistant (LIA), we take your privacy seriously. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you use our Chrome extension.
          </p>
          <p>
            Please read this Privacy Policy carefully. By using the LIA extension, you consent to the data practices
            described in this statement.
          </p>
        </section>

        <section className="mb-8">
          <h2>Information We Collect</h2>
          <p>The LIA extension collects the following information:</p>
          <ul>
            <li>
              <strong>Content you choose to enhance:</strong> When you use our AI features to generate or improve
              content, that content is processed.
            </li>
            <li>
              <strong>Settings and preferences:</strong> Your chosen settings such as tone, industry, and feature
              toggles are stored locally in your browser.
            </li>
            <li>
              <strong>Registration on the <a href="https://www.getlia.live/signup">website:</a></strong> You'll need to use one of the following methods to register:
              <ul className="list-disc pl-5">
                <li>
                  <strong>Email and Password:</strong> You can sign up using your email address and a password. This
                  will provide us with your email address for account management. 
                </li>
                <li>
                  <strong>OAuth with Google:</strong> You can sign up using your Google account, which will provide us
                  with your email address and basic profile information.
                </li>
                <li>
                  <strong>OAuth with LinkedIn:</strong> You can sign up using your LinkedIn account, which will provide
                  us with your email address and basic profile information.
                </li>
              </ul>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve the LIA extension</li>
            <li>Generate AI-powered content suggestions based on your inputs</li>
            <li>Save your preferences for future use of the extension</li>
            <li>Authenticate and process API requests to our server using the token generated during registration and sign-in</li>
            <li>Monitor and analyze usage to improve our services</li>
            <li>Communicate with you about your account, features, and updates</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>Data Storage and Security</h2>
          <p>The LIA extension stores data in the following ways:</p>
          <ul>
            <li>
              <strong>Local storage:</strong> Your settings, preferences, and API key are stored locally in your browser
              using Chrome's storage API. This data never leaves your device except when making API calls to OpenAI.
            </li>
            <li>
              <strong>Server storage:</strong> Certain data, such as authentication information (email, OAuth profile data) and usage tracking (e.g., API usage, feature usage), is securely stored on our servers to enable account management, authentication, and to monitor service usage.
            </li>
          </ul>
          <p>
            While we implement reasonable security measures, no method of transmission over the Internet or electronic
            storage is 100% secure. We cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2>Third-Party Services</h2>
          <p>The LIA extension uses the following third-party services:</p>
          <ul>
            <li>
              <strong>OpenAI API:</strong> When you use our AI features, content is sent to OpenAI's servers for
              processing. This is done in the backend using our own OpeanAI API-KEY. Please review{" "}
              <Link href="https://openai.com/privacy/" target="_blank" className="text-primary hover:underline">
                OpenAI's Privacy Policy
              </Link>{" "}
              for information on how they handle data.
            </li>
            <li>
              <strong>LinkedIn:</strong> Our extension integrates with LinkedIn's interface but does not send data to
              LinkedIn beyond what you explicitly post or comment. Please review{" "}
              <Link
                href="https://www.linkedin.com/legal/privacy-policy"
                target="_blank"
                className="text-primary hover:underline"
              >
                LinkedIn's Privacy Policy
              </Link>{" "}
              for information on how they handle data.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>Your Rights and Choices</h2>
          <p>You have the following rights regarding your data:</p>
          <ul>
            <li>
              <strong>Access:</strong> You can access all data stored by the extension in your browser's local storage and on your <a href="https://www.getlia.live/dashboard">dashboard</a> on the LIA website.
            </li>
            <li>
              <strong>Deletion:</strong> You can clear all stored data by uninstalling the extension or clearing your
              browser's storage for the extension or by deleting your account on the website.
            </li>
            <li>
              <strong>Control:</strong> You can choose which features to enable or disable through the extension
              settings.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2>Children's Privacy</h2>
          <p>
            The LIA extension is not intended for use by individuals under the age of 16. We do not knowingly collect
            personal information from children under 16. If we learn we have collected personal information from a child
            under 16, we will delete that information.
          </p>
        </section>

        <section className="mb-8">
          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the "Last updated" date.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy
            are effective when they are posted on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p>Email: privacy@getlia.live</p>
        </section>
      </div>
    </div>
  )
}
