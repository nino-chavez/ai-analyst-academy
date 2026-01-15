/**
 * Analytics utilities for tracking custom events with Vercel Analytics
 *
 * Usage:
 * import { trackEvent } from '$lib/analytics';
 * trackEvent('Button Clicked', { location: 'homepage', label: 'Start Learning' });
 */

import { browser } from '$app/environment';
import { track } from '@vercel/analytics';

/**
 * Track a custom event with Vercel Analytics
 *
 * @param eventName - The name of the event (e.g., 'CTA Clicked', 'Module Started')
 * @param properties - Optional properties to attach to the event
 */
export function trackEvent(eventName: string, properties?: Record<string, string | number | boolean>) {
	if (!browser) return;

	try {
		track(eventName, properties);
	} catch (e) {
		// Silently fail in case analytics isn't loaded
		console.debug('Analytics event failed:', eventName, e);
	}
}

// Pre-defined event helpers for consistency

/**
 * Track CTA button clicks
 */
export function trackCTAClick(location: string, label: string) {
	trackEvent('CTA Clicked', { location, label });
}

/**
 * Track navigation between modules
 */
export function trackModuleNavigation(
	direction: 'next' | 'previous',
	fromModule: string,
	toModule: string
) {
	trackEvent('Module Navigation', { direction, from: fromModule, to: toModule });
}

/**
 * Track when a user starts a phase
 */
export function trackPhaseStart(phaseNumber: number, phaseTitle: string) {
	trackEvent('Phase Started', { phase: phaseNumber, title: phaseTitle });
}

/**
 * Track module completion
 */
export function trackModuleComplete(moduleId: string, moduleTitle: string, completionPercent: number) {
	trackEvent('Module Completed', {
		moduleId,
		title: moduleTitle,
		completion: completionPercent
	});
}

/**
 * Track exercise completion
 */
export function trackExerciseComplete(exerciseId: string, moduleId: string) {
	trackEvent('Exercise Completed', { exerciseId, moduleId });
}

/**
 * Track concept understood
 */
export function trackConceptUnderstood(conceptId: string, moduleId: string) {
	trackEvent('Concept Understood', { conceptId, moduleId });
}

/**
 * Track signup intent
 */
export function trackSignupIntent(source: string) {
	trackEvent('Signup Intent', { source });
}

/**
 * Track lab started
 */
export function trackLabStart(labSlug: string, labTitle: string) {
	trackEvent('Lab Started', { slug: labSlug, title: labTitle });
}
