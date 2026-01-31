"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, UserPlus, User, Mail, Lock, Sparkles, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { HoloCard } from "@/components/ui/holo-card";
import { useAuth } from "./auth-context";
import { cn } from "@/lib/utils";

export function AuthUI() {
  const { login, register, signInWithGoogle, continueAsGuest } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    continueAsGuest();
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <HoloCard className="p-8 bg-gradient-to-br from-black/90 to-red-950/10 backdrop-blur-xl border-pink-500/20">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                boxShadow: [
                  '0 0 30px rgba(236, 72, 153, 0.6)',
                  '0 0 50px rgba(239, 68, 68, 0.8)',
                  '0 0 30px rgba(236, 72, 153, 0.6)'
                ]
              }}
              transition={{
                scale: { delay: 0.2, type: "spring" },
                boxShadow: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/20 to-red-500/20 border border-pink-500/30 mb-4"
            >
              <Sparkles className="w-8 h-8 text-pink-400" />
            </motion.div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500 mb-2 tracking-tight">
              SquidAI
            </h1>
            <p className="text-gray-400 text-sm">
              Your Ultimate Technical Assistant
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-gradient-to-r from-pink-500/5 to-red-500/5 rounded-lg border border-pink-500/20">
            <button
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                mode === "login"
                  ? "bg-gradient-to-r from-pink-500/20 to-red-500/20 text-pink-300 border border-pink-500/30"
                  : "text-gray-400 hover:text-gray-200"
              )}
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
            <button
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                mode === "register"
                  ? "bg-gradient-to-r from-pink-500/20 to-red-500/20 text-pink-300 border border-pink-500/30"
                  : "text-gray-400 hover:text-gray-200"
              )}
            >
              <UserPlus className="w-4 h-4" />
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === "register" && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="pl-10 bg-gradient-to-r from-pink-500/5 to-red-500/5 border-pink-500/30 text-gray-100 placeholder:text-gray-500 focus:border-pink-500 focus:outline-none transition-colors"
                      required={mode === "register"}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10 bg-gradient-to-r from-pink-500/5 to-red-500/5 border-pink-500/30 text-gray-100 placeholder:text-gray-500 focus:border-pink-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 bg-gradient-to-r from-pink-500/5 to-red-500/5 border-pink-500/30 text-gray-100 placeholder:text-gray-500 focus:border-pink-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/30 rounded-md text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white border-none h-11 font-medium rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                "Processing..."
              ) : (
                <>
                  {mode === "login" ? "Login" : "Create Account"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-pink-500/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black/60 px-2 text-gray-500">Or</span>
            </div>
          </div>

          {/* Sign in with Google */}
          <motion.button
            type="button"
            onClick={() => signInWithGoogle()}
            className="w-full bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 h-11 font-medium rounded-lg flex items-center justify-center gap-2 transition-all mb-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </motion.button>

          {/* Continue as Guest */}
          <motion.button
            type="button"
            onClick={handleContinueAsGuest}
            className="w-full bg-gradient-to-r from-pink-500/10 to-red-500/10 hover:from-pink-500/20 hover:to-red-500/20 text-gray-300 border border-pink-500/30 h-11 font-medium rounded-lg flex items-center justify-center gap-2 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <User className="w-4 h-4" />
            Continue without login
          </motion.button>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-500">
            {mode === "login" ? (
              <>
                {`Don't`} have an account?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-pink-400 hover:text-pink-300 underline transition-colors"
                >
                  Register here
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-pink-400 hover:text-pink-300 underline transition-colors"
                >
                  Login here
                </button>
              </>
            )}
          </p>
        </HoloCard>
      </motion.div>
    </div>
  );
}

