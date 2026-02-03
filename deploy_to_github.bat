@echo off
chcp 65001 >nul
cls

echo ========================================================
echo       GitHub 自动上传工具 (最终修复版)
echo       Auto Deploy to GitHub
echo ========================================================
echo.

:: 1. 初始化
echo [1/4] 初始化仓库...
git init >nul 2>&1

:: 2. 配置虚拟身份 (防止因为没登录导致无法提交)
git config user.email "deploy@local.com"
git config user.name "Auto Deploy"

:: 3. 提交文件
echo [2/4] 正在提交文件 (这可能需要几秒钟)...
git add .
git commit -m "Auto deploy" >nul 2>&1

:: 4. 配置远程并上传
echo [3/4] 连接 GitHub...
set repo_url=https://github.com/xiaomingtongxueql/-.git

git remote remove origin >nul 2>&1
git remote add origin %repo_url%

echo.
echo [4/4] 正在上传...
echo ========================================================
echo    ⚠️  如果是第一次运行，会弹出一个登录框。
echo    ⚠️  请在框里点击 'Sign in with your browser'。
echo    ⚠️  如果浏览器提示授权，请点击 'Authorize'。
echo ========================================================
echo.

git branch -M main
git push -u origin main --force

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo               ✅ 恭喜！全部成功！
    echo ========================================================
    echo 请回到浏览器刷新您的 GitHub 页面。
) else (
    echo.
    echo ========================================================
    echo               ❌ 还是有点小问题
    echo ========================================================
    echo 请检查刚才的登录窗口是否操作正确。
)

pause
