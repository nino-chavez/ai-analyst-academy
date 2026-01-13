/**
 * Feature flags for the application
 * Set these to enable/disable features across the app
 */

export const features = {
	// OAuth provider support
	auth: {
		/** Enable Google OAuth login */
		googleOAuth: true,
		/** Enable GitHub OAuth login */
		githubOAuth: false,
		/** Enable email/password authentication */
		emailPassword: true
	},

	// AI Provider support in Sandbox
	aiProviders: {
		openai: true,
		anthropic: true,
		google: true
	}
} as const;

export type Features = typeof features;
