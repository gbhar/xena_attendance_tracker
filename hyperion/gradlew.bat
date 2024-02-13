@echo off

set GRADLE_PROPERTIES=gradle.properties
set ERROR_MSG=%GRADLE_PROPERTIES% file is missing
if exist %GRADLE_PROPERTIES% goto readproperies
goto fail

:readproperies
For /F "tokens=1* delims==" %%A IN (gradle.properties) DO (
    IF "%%A"=="buildSystemVersion" set buildSystemVersion=%%B
    )
set ERROR_MSG=buildSystemVersion is NOT defined in %GRADLE_PROPERTIES% file
if "%buildSystemVersion%"=="" goto fail

goto checkpath

:fail
echo.
echo ERROR: %ERROR_MSG%
echo.
echo Please check Build System guide:
echo https://confluence.jnj.com/display/ABBQ/Hyperion+Handbook#HyperionHandbook-BuildSystem
exit /b 1

:checkpath
set GRADLEW_PATH=%BUILD_SYSTEM_ROOT%\%buildSystemVersion%\gradlew.bat
if exist %GRADLEW_PATH% goto call
echo.
echo ERROR: Couldn't find %GRADLEW_PATH%
echo Check BUILD_SYSTEM_ROOT and buildSystemVersion set correctly
echo.
echo Please check Build System guide:
echo https://confluence.jnj.com/display/ABBQ/Hyperion+Handbook#HyperionHandbook-BuildSystem
exit /b 1

:call
@CALL %GRADLEW_PATH% %*
