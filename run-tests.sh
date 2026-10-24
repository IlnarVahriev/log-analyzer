set -e
echo "=== Установка зависимостей ==="
npm install
echo ""
echo "=== Тесты + покрытие + HTML-отчёт ==="
npm test
echo ""
echo "HTML-отчёт: coverage/lcov-report/index.html"
