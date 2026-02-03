@echo off
chcp 65001 > nul
echo.
echo ╔════════════════════════════════════════╗
echo ║     溯鉴历史 - 快速启动工具            ║
echo ╚════════════════════════════════════════╝
echo.
echo 请选择操作：
echo.
echo [1] 打开独立版 (推荐，无需服务器)
echo [2] 打开测试版 (简化版)
echo [3] 打开调试版
echo [4] 启动本地服务器 (需要Python)
echo [5] 打开原始主页
echo.
set /p choice=请输入选项 (1-5):

if "%choice%"=="1" (
    start "" "index-standalone.html"
    echo ✅ 已打开独立版
    goto end
)

if "%choice%"=="2" (
    start "" "test-simple.html"
    echo ✅ 已打开测试版
    goto end
)

if "%choice%"=="3" (
    start "" "debug.html"
    echo ✅ 已打开调试版
    goto end
)

if "%choice%"=="4" (
    echo.
    echo 🚀 正在启动本地服务器...
    echo.
    python server.py
    goto end
)

if "%choice%"=="5" (
    start "" "index.html"
    echo ⚠️  注意：原始主页需要通过HTTP服务器访问
    echo    请选择选项 [4] 启动服务器
    goto end
)

echo.
echo ❌ 无效的选项，请重新运行

:end
echo.
echo 按任意键退出...
pause > nul