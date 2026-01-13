/**
 * Streak tracking utilities
 * Calculates and updates user streaks based on daily activity
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClientAny = any;

interface StreakResult {
	currentStreak: number;
	longestStreak: number;
	isNewDay: boolean;
}

/**
 * Check if two dates are on consecutive days
 */
function areConsecutiveDays(date1: Date, date2: Date): boolean {
	const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
	const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
	const diffTime = Math.abs(d2.getTime() - d1.getTime());
	const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
	return diffDays === 1;
}

/**
 * Check if two dates are on the same day
 */
function isSameDay(date1: Date, date2: Date): boolean {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
}

/**
 * Calculate the new streak values based on last active date
 */
export function calculateStreak(
	lastActiveAt: string | null,
	currentStreak: number | null,
	longestStreak: number | null
): StreakResult {
	const now = new Date();
	const streak = currentStreak ?? 0;
	const longest = longestStreak ?? 0;

	if (!lastActiveAt) {
		// First activity ever
		return {
			currentStreak: 1,
			longestStreak: Math.max(1, longest),
			isNewDay: true
		};
	}

	const lastActive = new Date(lastActiveAt);

	// Same day - no change needed
	if (isSameDay(lastActive, now)) {
		return {
			currentStreak: streak,
			longestStreak: longest,
			isNewDay: false
		};
	}

	// Consecutive day - increment streak
	if (areConsecutiveDays(lastActive, now)) {
		const newStreak = streak + 1;
		return {
			currentStreak: newStreak,
			longestStreak: Math.max(newStreak, longest),
			isNewDay: true
		};
	}

	// More than one day gap - streak broken, start new
	return {
		currentStreak: 1,
		longestStreak: longest, // Keep longest
		isNewDay: true
	};
}

/**
 * Update user's streak and last_active_at in database
 */
export async function updateUserStreak(
	supabase: SupabaseClientAny,
	userId: string
): Promise<StreakResult | null> {
	// Get current profile data
	const { data: profile } = await (supabase
		.from('user_profiles') as any)
		.select('last_active_at, streak_current, streak_longest')
		.eq('id', userId)
		.single();

	if (!profile) {
		return null;
	}

	const result = calculateStreak(
		profile.last_active_at,
		profile.streak_current,
		profile.streak_longest
	);

	// Only update if it's a new day
	if (result.isNewDay) {
		await (supabase.from('user_profiles') as any)
			.update({
				last_active_at: new Date().toISOString(),
				streak_current: result.currentStreak,
				streak_longest: result.longestStreak,
				updated_at: new Date().toISOString()
			})
			.eq('id', userId);
	} else {
		// Just update last_active_at timestamp
		await (supabase.from('user_profiles') as any)
			.update({
				last_active_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			})
			.eq('id', userId);
	}

	return result;
}
