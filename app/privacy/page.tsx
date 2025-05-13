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
        <p className="text-muted-foreground">Last updated: January 1, 2023</p>
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
              <strong>OpenAI API key:</strong> If you provide an OpenAI API key, it is stored locally in your browser's
              storage.
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
            <li>Process API requests to OpenAI using your provided API key</li>
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
              <strong>No server storage:</strong> We do not maintain any servers that store your data. All processing
              happens either locally in your browser or through direct API calls to OpenAI.
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
              processing. This is done using your own API key. Please review{" "}
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
              <strong>Access:</strong> You can access all data stored by the extension in your browser's local storage.
            </li>
            <li>
              <strong>Deletion:</strong> You can clear all stored data by uninstalling the extension or clearing your
              browser's storage for the extension.
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
          <p>Email: privacy@lia-assistant.com</p>
        </section>
      </div>
    </div>
  )
}
