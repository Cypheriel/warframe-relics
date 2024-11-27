import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [sveltekit()],
    build: {
        rollupOptions: {
            external: ["oslo", "@node-rs/argon2", "@node-rs/argon2-wasm32-wasi"],
        },
    }
});
