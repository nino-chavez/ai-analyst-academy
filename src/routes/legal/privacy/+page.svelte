<script lang="ts">
	const lastUpdated = 'January 13, 2026';
</script>

<svelte:head>
	<title>Privacy Policy | AI Analyst Academy</title>
	<meta name="description" content="Privacy Policy for AI Analyst Academy - Learn how we collect, use, and protect your data." />
</svelte:head>

<div class="legal-page">
	<div class="legal-container">
		<header class="legal-header">
			<h1>Privacy Policy</h1>
			<p class="last-updated">Last Updated: {lastUpdated}</p>
		</header>

		<div class="legal-content">
			<section>
				<h2>1. Introduction</h2>
				<p>
					<strong>AI Analyst Academy</strong> ("Company", "we", "us", or "our") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our educational platform and services.
				</p>
				<p>
					By using AI Analyst Academy, you consent to the data practices described in this policy.
				</p>
			</section>

			<section>
				<h2>2. Information We Collect</h2>

				<h3>2.1. Account Information</h3>
				<p>When you create an account, we collect:</p>
				<ul>
					<li><strong>Email address:</strong> Used for authentication, account recovery, and essential communications</li>
					<li><strong>Password:</strong> Stored securely using industry-standard hashing (we never store plaintext passwords)</li>
					<li><strong>Display name:</strong> Optional, derived from your email if not provided</li>
				</ul>

				<h3>2.2. Learning Progress Data</h3>
				<p>To provide a personalized learning experience, we track:</p>
				<ul>
					<li><strong>Module progress:</strong> Which sections you've viewed and completed</li>
					<li><strong>Lab submissions:</strong> Your progress through hands-on exercises</li>
					<li><strong>Review queue:</strong> Spaced repetition data for concept retention</li>
					<li><strong>Streak data:</strong> Daily learning activity for motivation features</li>
					<li><strong>Time spent:</strong> Aggregate time data to improve content</li>
				</ul>

				<h3>2.3. User Preferences</h3>
				<p>We store your preferences including:</p>
				<ul>
					<li>Selected learning persona/path</li>
					<li>Daily learning goal settings</li>
					<li>Theme preferences (light/dark mode)</li>
				</ul>

				<h3>2.4. API Keys (BYOK - Bring Your Own Key)</h3>
				<p>
					If you choose to use the AI Sandbox feature, you may optionally store your own API keys from providers like OpenAI, Anthropic, or Google. These keys are:
				</p>
				<ul>
					<li><strong>Encrypted at rest</strong> using industry-standard encryption</li>
					<li><strong>Never logged</strong> or stored in plaintext</li>
					<li><strong>Used only</strong> to make API calls on your behalf within the Sandbox</li>
					<li><strong>Deletable at any time</strong> through your account settings</li>
				</ul>

				<h3>2.5. Sandbox Inputs</h3>
				<p>
					Prompts and content you enter into the AI Sandbox may be temporarily processed to provide the service. We do not permanently store Sandbox session data beyond what is necessary for the immediate interaction. You should not enter sensitive personal information, confidential business data, or secrets into the Sandbox.
				</p>

				<h3>2.6. Portfolio and Deliverables</h3>
				<p>
					If you submit Capstone Projects or Phase Deliverables, we store this content to:
				</p>
				<ul>
					<li>Display your progress and achievements</li>
					<li>Potentially feature your work (with your permission) for educational purposes</li>
				</ul>

				<h3>2.7. Automatically Collected Information</h3>
				<p>Like most websites, we automatically collect:</p>
				<ul>
					<li><strong>Log data:</strong> IP address, browser type, pages visited, time and date of visits</li>
					<li><strong>Device information:</strong> Operating system, screen resolution</li>
					<li><strong>Cookies:</strong> Session cookies for authentication (see Section 5)</li>
				</ul>
			</section>

			<section>
				<h2>3. How We Use Your Information</h2>
				<p>We use the collected information to:</p>
				<ul>
					<li><strong>Provide the Service:</strong> Authenticate you, save your progress, and deliver personalized learning</li>
					<li><strong>Improve the Platform:</strong> Analyze usage patterns to enhance curriculum and user experience</li>
					<li><strong>Communicate:</strong> Send essential account-related emails (password resets, security alerts)</li>
					<li><strong>Maintain Security:</strong> Detect and prevent fraud, abuse, or violations of our Terms</li>
				</ul>
				<p>
					We do <strong>not</strong> sell your personal information to third parties. We do <strong>not</strong> use your data for targeted advertising.
				</p>
			</section>

			<section>
				<h2>4. Data Sharing and Third Parties</h2>

				<h3>4.1. Service Providers</h3>
				<p>We use the following third-party services to operate AI Analyst Academy:</p>
				<ul>
					<li><strong>Supabase:</strong> Database and authentication infrastructure (data stored securely in the cloud)</li>
					<li><strong>Vercel:</strong> Website hosting and deployment</li>
					<li><strong>AI Providers (via BYOK):</strong> When you use the Sandbox with your own API keys, your prompts are sent to the respective AI provider (OpenAI, Anthropic, Google) under their privacy policies</li>
				</ul>

				<h3>4.2. Legal Requirements</h3>
				<p>We may disclose your information if required by law, court order, or government request, or to protect our rights and safety.</p>

				<h3>4.3. Business Transfers</h3>
				<p>If AI Analyst Academy is acquired or merged, your information may be transferred as part of that transaction. We will notify you of any such change.</p>
			</section>

			<section>
				<h2>5. Cookies and Tracking</h2>
				<p>We use cookies for:</p>
				<ul>
					<li><strong>Authentication:</strong> Session cookies to keep you logged in</li>
					<li><strong>Preferences:</strong> Storing your theme choice (light/dark mode)</li>
				</ul>
				<p>
					We do <strong>not</strong> use third-party tracking cookies, advertising pixels, or analytics that track you across other websites.
				</p>
				<p>
					You can disable cookies in your browser settings, but this may affect your ability to use the platform.
				</p>
			</section>

			<section>
				<h2>6. Data Security</h2>
				<p>We implement appropriate technical and organizational measures to protect your data, including:</p>
				<ul>
					<li>HTTPS encryption for all data in transit</li>
					<li>Encrypted storage for sensitive data (API keys, passwords)</li>
					<li>Row-level security policies in our database</li>
					<li>Regular security reviews of our codebase</li>
				</ul>
				<p>
					However, no method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
				</p>
			</section>

			<section>
				<h2>7. Data Retention</h2>
				<p>We retain your data as follows:</p>
				<ul>
					<li><strong>Account data:</strong> Retained while your account is active</li>
					<li><strong>Progress data:</strong> Retained while your account is active to preserve your learning history</li>
					<li><strong>Sandbox sessions:</strong> Not permanently retained; processed transiently</li>
					<li><strong>Deleted accounts:</strong> Data is permanently deleted within 30 days of account deletion request</li>
				</ul>
			</section>

			<section>
				<h2>8. Your Rights</h2>
				<p>Depending on your jurisdiction, you may have the right to:</p>
				<ul>
					<li><strong>Access:</strong> Request a copy of your personal data</li>
					<li><strong>Correction:</strong> Update or correct inaccurate data</li>
					<li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
					<li><strong>Portability:</strong> Receive your data in a portable format</li>
					<li><strong>Objection:</strong> Object to certain processing of your data</li>
				</ul>

				<h3>How to Exercise Your Rights</h3>
				<p>
					To request access to, correction of, or deletion of your personal data, please email us at <a href="mailto:privacy@aianalyst.academy">privacy@aianalyst.academy</a> with the subject line "Data Request."
				</p>
				<p>Please include:</p>
				<ul>
					<li>Your name and email address associated with your account</li>
					<li>A description of what you are requesting</li>
					<li>Any relevant details to help us locate your data</li>
				</ul>
				<p>
					We will respond to your request within 30 days. We may need to verify your identity before processing certain requests.
				</p>
			</section>

			<section>
				<h2>9. California Privacy Rights (CCPA)</h2>
				<p>
					If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
				</p>
				<ul>
					<li><strong>Right to Know:</strong> You can request information about the categories and specific pieces of personal information we have collected about you</li>
					<li><strong>Right to Delete:</strong> You can request deletion of your personal information</li>
					<li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your privacy rights</li>
				</ul>
				<p>
					<strong>We do not sell personal information.</strong> AI Analyst Academy does not sell, rent, or trade your personal information to third parties for monetary consideration.
				</p>
			</section>

			<section>
				<h2>10. European Privacy Rights (GDPR)</h2>
				<p>
					If you are in the European Economic Area (EEA), United Kingdom, or Switzerland, you have additional rights under the General Data Protection Regulation (GDPR):
				</p>
				<ul>
					<li>Right to access your personal data</li>
					<li>Right to rectification of inaccurate data</li>
					<li>Right to erasure ("right to be forgotten")</li>
					<li>Right to restrict processing</li>
					<li>Right to data portability</li>
					<li>Right to object to processing</li>
					<li>Right to withdraw consent at any time</li>
				</ul>

				<h3>Legal Basis for Processing</h3>
				<p>Our legal basis for processing your data is:</p>
				<ul>
					<li><strong>Consent:</strong> When you create an account and agree to this Privacy Policy</li>
					<li><strong>Contract Performance:</strong> To provide the Services you requested (curriculum access, progress tracking)</li>
					<li><strong>Legitimate Interests:</strong> To improve our Services, ensure security, and communicate with you about your account</li>
				</ul>
			</section>

			<section>
				<h2>11. Children's Privacy</h2>
				<p>
					<strong>AI Analyst Academy is not intended for children under 16 years of age.</strong> We do not knowingly collect personal information from children under 16. If you believe we have collected such information, please contact us immediately at <a href="mailto:privacy@aianalyst.academy">privacy@aianalyst.academy</a>.
				</p>
				<p>
					If you are between 16 and 18 years old, you may use the Services with permission from a parent or guardian.
				</p>
			</section>

			<section>
				<h2>12. International Data Transfers</h2>
				<p>
					AI Analyst Academy is based in the United States. If you access the Services from outside the United States, your information may be transferred to, stored, and processed in the United States or other countries where our service providers operate.
				</p>
				<p>
					These countries may have different data protection laws than your country of residence. By using our Services, you consent to the transfer of your information to these countries.
				</p>
			</section>

			<section>
				<h2>13. Changes to This Policy</h2>
				<p>
					We may update this Privacy Policy from time to time. We will notify you of material changes by:
				</p>
				<ul>
					<li>Posting the updated policy on this page with a new "Last Updated" date</li>
					<li>Sending an email notification to account holders for significant changes</li>
				</ul>
				<p>
					Your continued use of the Services after changes take effect constitutes acceptance of the updated policy.
				</p>
			</section>

			<section>
				<h2>14. Contact Us</h2>
				<p>
					If you have questions about this Privacy Policy or our data practices, please contact us:
				</p>
				<ul>
					<li><strong>Privacy Inquiries:</strong> <a href="mailto:privacy@aianalyst.academy">privacy@aianalyst.academy</a></li>
					<li><strong>Data Requests:</strong> <a href="mailto:privacy@aianalyst.academy">privacy@aianalyst.academy</a> (subject: "Data Request")</li>
					<li><strong>General Support:</strong> <a href="mailto:support@aianalyst.academy">support@aianalyst.academy</a></li>
				</ul>
			</section>
		</div>

		<footer class="legal-footer">
			<a href="/legal/terms" class="legal-link">Terms of Service</a>
			<a href="/" class="legal-link">Back to Home</a>
		</footer>
	</div>
</div>

<style>
	.legal-page {
		min-height: 100vh;
		background-color: var(--color-bg-primary);
		padding: var(--space-8) var(--space-4);
	}

	.legal-container {
		max-width: 800px;
		margin: 0 auto;
	}

	.legal-header {
		margin-bottom: var(--space-8);
		padding-bottom: var(--space-6);
		border-bottom: var(--border-width) solid var(--color-border-secondary);
	}

	.legal-header h1 {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-2) 0;
	}

	.last-updated {
		font-size: var(--text-sm);
		color: var(--color-text-tertiary);
		margin: 0;
	}

	.legal-content {
		color: var(--color-text-secondary);
		line-height: var(--leading-relaxed);
	}

	.legal-content section {
		margin-bottom: var(--space-8);
	}

	.legal-content h2 {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: 0 0 var(--space-4) 0;
	}

	.legal-content h3 {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-text-primary);
		margin: var(--space-4) 0 var(--space-2) 0;
	}

	.legal-content p {
		margin: 0 0 var(--space-4) 0;
	}

	.legal-content ul {
		margin: 0 0 var(--space-4) 0;
		padding-left: var(--space-6);
	}

	.legal-content li {
		margin-bottom: var(--space-2);
	}

	.legal-content strong {
		color: var(--color-text-primary);
	}

	.legal-footer {
		margin-top: var(--space-12);
		padding-top: var(--space-6);
		border-top: var(--border-width) solid var(--color-border-secondary);
		display: flex;
		gap: var(--space-6);
	}

	.legal-link {
		font-size: var(--text-sm);
		color: var(--color-primary-500);
		text-decoration: none;
	}

	.legal-link:hover {
		text-decoration: underline;
	}
</style>
