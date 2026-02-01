#!/bin/bash
# Google OAuth Authentication Quick Test Script
# Run this to verify Google sign-in is working

echo "🔐 SquidAI Google OAuth Authentication Test"
echo "==========================================="
echo ""

# Check environment variables
echo "1️⃣  Checking Environment Variables..."
if [ -z "$GOOGLE_CLIENT_ID" ]; then
  echo "   ⚠️  GOOGLE_CLIENT_ID not set in environment"
  echo "   Loading from .env.local..."
  if grep -q "GOOGLE_CLIENT_ID" .env.local; then
    echo "   ✅ Found in .env.local"
  else
    echo "   ❌ NOT found in .env.local"
  fi
else
  echo "   ✅ GOOGLE_CLIENT_ID set"
fi

if grep -q "NEXTAUTH_SECRET" .env.local; then
  echo "   ✅ NEXTAUTH_SECRET found"
else
  echo "   ❌ NEXTAUTH_SECRET NOT found"
fi

if grep -q "NEXTAUTH_URL" .env.local; then
  echo "   ✅ NEXTAUTH_URL found"
else
  echo "   ❌ NEXTAUTH_URL NOT found"
fi

echo ""
echo "2️⃣  Checking NextAuth Configuration..."
if [ -f "lib/nextauth.ts" ]; then
  if grep -q "GoogleProvider" lib/nextauth.ts; then
    echo "   ✅ GoogleProvider configured in lib/nextauth.ts"
  else
    echo "   ❌ GoogleProvider not found"
  fi
  
  if grep -q "GOOGLE_CLIENT_ID" lib/nextauth.ts; then
    echo "   ✅ Google credentials referenced"
  fi
else
  echo "   ❌ lib/nextauth.ts not found"
fi

echo ""
echo "3️⃣  Checking API Routes..."
if [ -f "app/api/auth/\[...nextauth\]/route.ts" ]; then
  echo "   ✅ NextAuth API route exists"
else
  echo "   ❌ NextAuth API route not found"
fi

if grep -q "signInWithGoogle" components/auth/auth-context.tsx; then
  echo "   ✅ signInWithGoogle function implemented"
else
  echo "   ❌ signInWithGoogle not found"
fi

if grep -q "Sign in with Google" components/auth/auth-ui.tsx; then
  echo "   ✅ Google sign-in button in UI"
else
  echo "   ❌ Google sign-in button not found"
fi

echo ""
echo "4️⃣  NextAuth Dependencies..."
npm list next-auth 2>/dev/null | head -2

echo ""
echo "==========================================="
echo "✅ Configuration verification complete!"
echo ""
echo "🚀 To test Google sign-in:"
echo "   1. npm run dev"
echo "   2. Navigate to http://localhost:3000"
echo "   3. Click 'Sign in with Google' button"
echo "   4. Sign in with your Google account"
echo "   5. Verify redirect back to app"
echo ""
echo "📚 For detailed info, see:"
echo "   - AUTH_TEST_GUIDE.md"
echo "   - GOOGLE_AUTH_VERIFICATION.md"
