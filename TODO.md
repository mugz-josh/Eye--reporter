# Remove Audio Feature Tasks

## Frontend Changes
- [ ] Remove audio field from Report interface (frontend/types/report.ts)
- [ ] Delete AudioPlayer component (frontend/components/AudioPlayer.tsx)
- [ ] Remove audio recording UI from CreateReport.tsx
- [ ] Remove audio display sections from RedFlags.tsx and Interventions.tsx

## Backend Changes
- [ ] Remove audio handling from redFlagsController.ts
- [ ] Remove audio handling from interventionsController.ts
- [ ] Remove audio from processMediaFiles and parseMedia in controllerHelpers.ts
- [ ] Update multer config to disallow audio uploads

## Database and Migration
- [ ] Delete audio migration files (migration_add_audio.sql, run_audio_migration.js)
- [ ] Update TODO.md to remove audio-related tasks
