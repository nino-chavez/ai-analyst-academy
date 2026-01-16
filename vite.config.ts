import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	build: {
		// Curriculum content is ~1.9MB which is expected for a learning platform
		// This is legitimate content data, not code bloat
		chunkSizeWarningLimit: 2000
	}
});
