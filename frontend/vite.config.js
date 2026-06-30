import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Bind to all interfaces, not just localhost, so the dev server is
  // reachable from other devices on the LAN (e.g. scanning a QR code
  // with a phone).
  server: { host: true },
})
