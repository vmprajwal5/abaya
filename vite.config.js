import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    ui: ['framer-motion', 'lucide-react', 'clsx', 'tailwind-merge'],
                    radix: ['@radix-ui/react-accordion', '@radix-ui/react-slider', '@radix-ui/react-dialog', '@radix-ui/react-slot', '@radix-ui/react-label']
                }
            }
        }
    }
})
