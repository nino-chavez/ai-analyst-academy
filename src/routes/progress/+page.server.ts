import type { PageServerLoad, Actions } from './$types';
import type { ModuleProgress, LabProgress, UserProfile, ReviewQueueItem } from '$lib/types/database';
import { updateReviewQueueItem, insertReviewQueueItem } from '$lib/db';

interface PhaseProgress {
	id: number;
	name: string;
	progress: number;
	modules: number;
	completed: number;
}

interface RecentActivity {
	type: 'module' | 'lab';
	title: string;
	phase: number;
	time: string;
}

interface Achievement {
	id: string;
	name: string;
	description: string;
	earned: boolean;
}

interface ReviewItem {
	id: string;
	conceptId: string;
	conceptTitle: string;
	moduleId: string;
	moduleTitle: string;
	phase: number;
	nextReviewAt: Date;
	reviewCount: number;
	isDue: boolean;
}

// Phase configuration
const PHASES = [
	{ id: 1, name: 'AI Literacy', modules: ['1.1', '1.2', '1.3', '1.4'] },
	{ id: 2, name: 'Workflow Engineering', modules: ['2.1', '2.2', '2.3', '2.4'] },
	{ id: 3, name: 'Agentic Orchestration', modules: ['3.1', '3.2', '3.3', '3.4', '3.5'] },
	{ id: 4, name: 'Strategy & Economics', modules: ['4.1', '4.2', '4.3', '4.4'] }
];

function formatTimeAgo(date: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 1) return 'just now';
	if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
	if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
	if (diffDays === 1) return 'yesterday';
	if (diffDays < 7) return `${diffDays} days ago`;
	return date.toLocaleDateString();
}

function calculatePhaseProgress(moduleProgress: ModuleProgress[], phaseId: number): PhaseProgress {
	const phase = PHASES.find(p => p.id === phaseId);
	if (!phase) {
		return { id: phaseId, name: '', progress: 0, modules: 0, completed: 0 };
	}

	const phaseModules = moduleProgress.filter(mp => mp.phase_id === String(phaseId));
	const completedModules = phaseModules.filter(mp => mp.completed_at !== null);
	const totalModules = phase.modules.length;
	const completed = completedModules.length;
	const progress = totalModules > 0 ? Math.round((completed / totalModules) * 100) : 0;

	return {
		id: phaseId,
		name: phase.name,
		progress,
		modules: totalModules,
		completed
	};
}

function getRecentActivity(
	moduleProgress: ModuleProgress[],
	labProgress: LabProgress[]
): RecentActivity[] {
	const activities: RecentActivity[] = [];

	// Add module activities
	moduleProgress.forEach(mp => {
		if (mp.completed_at) {
			activities.push({
				type: 'module',
				title: `Completed: Module ${mp.module_id}`,
				phase: parseInt(mp.phase_id),
				time: formatTimeAgo(new Date(mp.completed_at))
			});
		} else if (mp.started_at) {
			activities.push({
				type: 'module',
				title: `Started: Module ${mp.module_id}`,
				phase: parseInt(mp.phase_id),
				time: formatTimeAgo(new Date(mp.started_at))
			});
		}
	});

	// Add lab activities
	labProgress.forEach(lp => {
		if (lp.completed_at) {
			activities.push({
				type: 'lab',
				title: `Completed: ${lp.lab_id}`,
				phase: parseInt(lp.phase_id),
				time: formatTimeAgo(new Date(lp.completed_at))
			});
		} else if (lp.started_at) {
			activities.push({
				type: 'lab',
				title: `Started: ${lp.lab_id}`,
				phase: parseInt(lp.phase_id),
				time: formatTimeAgo(new Date(lp.started_at))
			});
		}
	});

	// Sort by most recent
	activities.sort((a, b) => {
		// Extract timestamps for sorting (this is approximate but good enough for display)
		const getTimestamp = (time: string): number => {
			if (time === 'just now') return Date.now();
			const match = time.match(/(\d+)/);
			if (!match) return 0;
			const num = parseInt(match[1]);
			if (time.includes('minute')) return Date.now() - num * 60000;
			if (time.includes('hour')) return Date.now() - num * 3600000;
			if (time === 'yesterday') return Date.now() - 86400000;
			if (time.includes('day')) return Date.now() - num * 86400000;
			return 0;
		};
		return getTimestamp(b.time) - getTimestamp(a.time);
	});

	return activities.slice(0, 5);
}

function calculateAchievements(
	moduleProgress: ModuleProgress[],
	labProgress: LabProgress[],
	profile: Pick<UserProfile, 'streak_current'> | null
): Achievement[] {
	const completedModules = moduleProgress.filter(mp => mp.completed_at !== null);
	const completedLabs = labProgress.filter(lp => lp.completed_at !== null);
	const currentStreak = profile?.streak_current ?? 0;

	// Check if any phase is fully completed
	const phaseCompleted = PHASES.some(phase => {
		const phaseModuleCount = moduleProgress.filter(
			mp => mp.phase_id === String(phase.id) && mp.completed_at !== null
		).length;
		return phaseModuleCount >= phase.modules.length;
	});

	return [
		{
			id: 'first-module',
			name: 'First Steps',
			description: 'Complete your first module',
			earned: completedModules.length > 0
		},
		{
			id: 'week-streak',
			name: 'Week Warrior',
			description: 'Maintain a 7-day streak',
			earned: currentStreak >= 7
		},
		{
			id: 'phase-complete',
			name: 'Phase Master',
			description: 'Complete an entire phase',
			earned: phaseCompleted
		},
		{
			id: 'lab-complete',
			name: 'Lab Rat',
			description: 'Complete your first lab',
			earned: completedLabs.length > 0
		}
	];
}

// Module ID to human-readable title mapping
const MODULE_TITLES: Record<string, string> = {
	'1.1': 'Economics of Intelligence',
	'1.2': 'Types of AI Systems',
	'1.3': 'Prompt Engineering Fundamentals',
	'1.4': 'Understanding AI Limitations',
	'2.1': 'Identifying Automation Opportunities',
	'2.2': 'Workflow Mapping & Documentation',
	'2.3': 'Quality Gates & Validation',
	'2.4': 'Data Preparation & Hygiene',
	'3.1': 'Building AI Assistants',
	'3.2': 'Multi-Agent Orchestration',
	'3.3': 'Integration Patterns',
	'3.4': 'Error Handling & Fallbacks',
	'3.5': 'Customization & Fine-Tuning',
	'4.1': 'ROI & Business Case',
	'4.2': 'Governance & Compliance',
	'4.3': 'Change Management',
	'4.4': 'Future of AI Operations'
};

function getModuleTitle(moduleId: string): string {
	return MODULE_TITLES[moduleId] || moduleId;
}

function getPhaseFromModuleId(moduleId: string): number {
	const match = moduleId.match(/^(\d+)\./);
	return match ? parseInt(match[1]) : 1;
}

// SM-2 Algorithm constants
const SM2_MIN_EASE = 1.3;
const SM2_INITIAL_EASE = 2.5;

/**
 * Calculate next review date using SM-2 algorithm
 * @param quality - Quality of response: 0-2 = fail (reset), 3 = hard, 4 = good, 5 = easy
 * @param currentEase - Current ease factor
 * @param currentInterval - Current interval in days
 * @returns { newEase, newInterval } - Updated values
 */
function calculateSM2(
	quality: number,
	currentEase: number,
	currentInterval: number
): { newEase: number; newInterval: number } {
	// If quality < 3, reset interval
	if (quality < 3) {
		return { newEase: currentEase, newInterval: 1 };
	}

	// Calculate new ease factor
	const newEase = Math.max(
		SM2_MIN_EASE,
		currentEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
	);

	// Calculate new interval
	let newInterval: number;
	if (currentInterval === 0) {
		newInterval = 1;
	} else if (currentInterval === 1) {
		newInterval = 6;
	} else {
		newInterval = Math.round(currentInterval * newEase);
	}

	return { newEase, newInterval };
}

export const load: PageServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	if (!session || !user) {
		// Return empty/default data for unauthenticated users
		return {
			overallProgress: 0,
			currentStreak: 0,
			longestStreak: 0,
			totalTimeSpent: '0h 0m',
			phaseProgress: PHASES.map(phase => ({
				id: phase.id,
				name: phase.name,
				progress: 0,
				modules: phase.modules.length,
				completed: 0
			})),
			recentActivity: [],
			achievements: [
				{ id: 'first-module', name: 'First Steps', description: 'Complete your first module', earned: false },
				{ id: 'week-streak', name: 'Week Warrior', description: 'Maintain a 7-day streak', earned: false },
				{ id: 'phase-complete', name: 'Phase Master', description: 'Complete an entire phase', earned: false },
				{ id: 'lab-complete', name: 'Lab Rat', description: 'Complete your first lab', earned: false }
			],
			reviewQueue: [],
			dueReviewCount: 0
		};
	}

	// Fetch all data in parallel to avoid waterfall queries
	const [profileResult, moduleProgressResult, labProgressResult, reviewQueueResult] = await Promise.all([
		// User profile - only select needed fields
		locals.supabase
			.from('user_profiles')
			.select('id, streak_current, streak_longest')
			.eq('id', user.id)
			.single(),

		// Module progress
		locals.supabase
			.from('module_progress')
			.select('module_id, phase_id, started_at, completed_at, sections_viewed')
			.eq('user_id', user.id),

		// Lab progress
		locals.supabase
			.from('lab_progress')
			.select('lab_id, phase_id, started_at, completed_at')
			.eq('user_id', user.id),

		// Review queue - fetch here instead of later to parallelize
		locals.supabase
			.from('review_queue')
			.select('id, concept_id, module_id, next_review_at, review_count')
			.eq('user_id', user.id)
			.order('next_review_at', { ascending: true })
			.limit(20)
	]);

	const profile = profileResult.data as Pick<UserProfile, 'id' | 'streak_current' | 'streak_longest'> | null;
	const moduleProgressData = (moduleProgressResult.data ?? []) as ModuleProgress[];
	const labProgressData = (labProgressResult.data ?? []) as LabProgress[];

	// Calculate phase progress
	const phaseProgressData = PHASES.map(phase => calculatePhaseProgress(moduleProgressData, phase.id));

	// Calculate overall progress (total completed modules / total modules)
	const totalModules = PHASES.reduce((sum, phase) => sum + phase.modules.length, 0);
	const totalCompleted = phaseProgressData.reduce((sum, phase) => sum + phase.completed, 0);
	const overallProgress = totalModules > 0 ? Math.round((totalCompleted / totalModules) * 100) : 0;

	// Get recent activity
	const recentActivity = getRecentActivity(moduleProgressData, labProgressData);

	// Calculate achievements
	const achievements = calculateAchievements(moduleProgressData, labProgressData, profile);

	// Calculate total time spent (estimated from module progress - would need actual time tracking)
	// For now, estimate 30 min per completed module section
	const totalSections = moduleProgressData.reduce((sum, mp) => {
		return sum + (mp.sections_viewed?.length ?? 0);
	}, 0);
	const estimatedMinutes = totalSections * 5; // 5 min per section viewed
	const hours = Math.floor(estimatedMinutes / 60);
	const minutes = estimatedMinutes % 60;
	const totalTimeSpent = `${hours}h ${minutes}m`;

	// Process review queue from parallel fetch
	const now = new Date();
	const reviewQueueData = reviewQueueResult.data as Pick<ReviewQueueItem, 'id' | 'concept_id' | 'module_id' | 'next_review_at' | 'review_count'>[] | null;
	const reviewQueue: ReviewItem[] = ((reviewQueueData ?? []) as ReviewQueueItem[]).map(item => {
		const nextReview = new Date(item.next_review_at);
		return {
			id: item.id,
			conceptId: item.concept_id,
			conceptTitle: item.concept_id, // TODO: Map to actual concept title from curriculum
			moduleId: item.module_id,
			moduleTitle: getModuleTitle(item.module_id),
			phase: getPhaseFromModuleId(item.module_id),
			nextReviewAt: nextReview,
			reviewCount: item.review_count ?? 0,
			isDue: nextReview <= now
		};
	});

	const dueReviewCount = reviewQueue.filter(r => r.isDue).length;

	return {
		overallProgress,
		currentStreak: profile?.streak_current ?? 0,
		longestStreak: profile?.streak_longest ?? 0,
		totalTimeSpent,
		phaseProgress: phaseProgressData,
		recentActivity,
		achievements,
		reviewQueue,
		dueReviewCount
	};
};

// Actions for review queue
export const actions: Actions = {
	// Mark a concept as reviewed with quality rating
	review: async ({ request, locals }) => {
		const { session, user } = await locals.safeGetSession();
		if (!session || !user) {
			return { success: false, error: 'Not authenticated' };
		}

		const formData = await request.formData();
		const reviewId = formData.get('reviewId') as string;
		const quality = parseInt(formData.get('quality') as string); // 0-5 rating

		if (!reviewId || isNaN(quality) || quality < 0 || quality > 5) {
			return { success: false, error: 'Invalid review data' };
		}

		// Get current review item
		const { data: currentItem } = await locals.supabase
			.from('review_queue')
			.select('*')
			.eq('id', reviewId)
			.eq('user_id', user.id)
			.single() as { data: ReviewQueueItem | null };

		if (!currentItem) {
			return { success: false, error: 'Review item not found' };
		}

		// Calculate new values using SM-2
		const { newEase, newInterval } = calculateSM2(
			quality,
			currentItem.ease_factor ?? SM2_INITIAL_EASE,
			currentItem.interval_days ?? 0
		);

		// Calculate next review date
		const nextReviewAt = new Date();
		nextReviewAt.setDate(nextReviewAt.getDate() + newInterval);

		// Update the review item
		const { error } = await updateReviewQueueItem(locals.supabase, reviewId, {
			ease_factor: newEase,
			interval_days: newInterval,
			last_reviewed_at: new Date().toISOString(),
			next_review_at: nextReviewAt.toISOString(),
			review_count: (currentItem.review_count ?? 0) + 1,
			updated_at: new Date().toISOString()
		});

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true };
	},

	// Add a concept to the review queue
	addToReview: async ({ request, locals }) => {
		const { session, user } = await locals.safeGetSession();
		if (!session || !user) {
			return { success: false, error: 'Not authenticated' };
		}

		const formData = await request.formData();
		const conceptId = formData.get('conceptId') as string;
		const moduleId = formData.get('moduleId') as string;

		if (!conceptId || !moduleId) {
			return { success: false, error: 'Missing concept or module ID' };
		}

		// Check if already in queue
		const { data: existing } = await locals.supabase
			.from('review_queue')
			.select('id')
			.eq('user_id', user.id)
			.eq('concept_id', conceptId)
			.single();

		if (existing) {
			return { success: false, error: 'Concept already in review queue' };
		}

		// Add to queue with initial review tomorrow
		const nextReviewAt = new Date();
		nextReviewAt.setDate(nextReviewAt.getDate() + 1);

		const { error } = await insertReviewQueueItem(locals.supabase, {
			user_id: user.id,
			concept_id: conceptId,
			module_id: moduleId,
			next_review_at: nextReviewAt.toISOString(),
			ease_factor: SM2_INITIAL_EASE,
			interval_days: 1,
			review_count: 0
		});

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true };
	},

	// Remove a concept from the review queue
	removeFromReview: async ({ request, locals }) => {
		const { session, user } = await locals.safeGetSession();
		if (!session || !user) {
			return { success: false, error: 'Not authenticated' };
		}

		const formData = await request.formData();
		const reviewId = formData.get('reviewId') as string;

		if (!reviewId) {
			return { success: false, error: 'Missing review ID' };
		}

		const { error } = await locals.supabase
			.from('review_queue')
			.delete()
			.eq('id', reviewId)
			.eq('user_id', user.id);

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true };
	}
};
