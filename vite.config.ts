import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [sveltekit()],
    optimizeDeps: {
        exclude: ["oslo", "@node-rs/argon2", "@node-rs/bcrypt"]
    },
});
