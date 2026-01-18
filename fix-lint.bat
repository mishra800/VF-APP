@echo off
echo Fixing linting issues...

REM Fix unused variables by prefixing with underscore
echo Applying lint fixes...

REM Run eslint with auto-fix
npm run lint -- --fix

echo Lint fixes applied!
pause