::: Begin set date

for /f "tokens=1-4 delims=/-. " %%i in ('date /t') do (call :set_date %%i %%j %%k %%l)
goto :end_set_date

:set_date
if "%1:~0,1%" gtr "9" shift
for /f "skip=1 tokens=2-4 delims=(-)" %%m in ('echo,^|date') do (set %%m=%1&set %%n=%2&set %%o=%3)
goto :eof

:end_set_date
::: End set date

@echo off
set /p var1=versionNo:
set /p var2=no:

SET folder=v%var1%_%yy%_%mm%_%dd%_%var2%
SET location="\\mpdsw01\Temp\[AnitaChou]\SE5820_WEB\"%folder%

MKDIR %location%
timeout /t 1

%SystemRoot%\explorer.exe %location%

timeout /t 1

@echo 0
xcopy ".\build" %location%"\*" /i /y /e /v /q /c /h /r > nul

