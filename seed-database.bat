@echo off
echo Seeding Zero Waste Delhi Database...
echo.
cd backend
echo Running database seeder...
npm run seed
echo.
echo Database seeded successfully!
pause