#!/bin/bash

# 🎨 Homepage Design Switcher
# Schnelles Wechseln zwischen den 3 Design-Optionen

echo "🎨 Homepage Design Switcher"
echo ""
echo "Wähle ein Design:"
echo "1) Original (Aktuell)"
echo "2) Option 1: Hero + Gradient"
echo "3) Option 2: FIFA-Style"
echo "4) Option 3: Minimalist Premium"
echo ""
read -p "Deine Wahl (1-4): " choice

cd "$(dirname "$0")/src/routes"

# Backup erstellen falls nicht vorhanden
if [ ! -f "route_original.tsx" ]; then
  echo "📦 Erstelle Backup..."
  cp route.tsx route_original.tsx
fi

case $choice in
  1)
    echo "✅ Wechsle zu: Original"
    cp route_original.tsx route.tsx
    ;;
  2)
    echo "✅ Wechsle zu: Option 1 (Hero + Gradient)"
    cp route_option1_hero.tsx route.tsx
    ;;
  3)
    echo "✅ Wechsle zu: Option 2 (FIFA-Style)"
    cp route_option2_fifa.tsx route.tsx
    ;;
  4)
    echo "✅ Wechsle zu: Option 3 (Minimalist Premium)"
    cp route_option3_minimal.tsx route.tsx
    ;;
  *)
    echo "❌ Ungültige Wahl"
    exit 1
    ;;
esac

echo ""
echo "🎉 Design gewechselt!"
echo "💡 Öffne http://localhost:5173 im Browser (Auto-Reload!)"

