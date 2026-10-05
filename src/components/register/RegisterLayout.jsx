import { useEffect } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useRegistration } from "../../context/RegistrationContext";
import { REGISTRATION_STEPS } from "../../data/registrationConfig";

// Shell for /register/account, /register/business and /register/kyc:
// logo, progress stepper, card, and the route guard that stops people
// from jumping ahead of an unfinished step.
export default function RegisterLayout() {
  const { pathname } = useLocation();
  const { accountDone, businessDone, clearIfCompleted } = useRegistration();

  // Leaving the wizard after a successful submit wipes the draft (no-op otherwise).
  useEffect(() => clearIfCompleted, [clearIfCompleted]);

  const currentPath = pathname.replace(/\/+$/, "").split("/").pop();
  const currentIndex = REGISTRATION_STEPS.findIndex((s) => s.path === currentPath);

  if (currentIndex === -1) return <Navigate to="/register/account" replace />;
  if (currentIndex >= 1 && !accountDone) return <Navigate to="/register/account" replace />;
  if (currentIndex >= 2 && !businessDone) return <Navigate to="/register/business" replace />;

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <Link to="/">
            <img src="/brand/logo-full.png" alt="ThiruPay" className="h-16 w-auto mx-auto" />
          </Link>
          <p className="text-green-300 text-sm mt-1">
            Merchant Onboarding — Step {currentIndex + 1} of {REGISTRATION_STEPS.length}
          </p>
        </div>

        <nav aria-label="Registration progress" className="mb-6">
          <ol className="flex items-start">
            {REGISTRATION_STEPS.map((step, i) => {
              const isDone = i < currentIndex;
              const isCurrent = i === currentIndex;
              const circle = (
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                    isDone
                      ? "bg-green-500 border-green-500 text-white"
                      : isCurrent
                      ? "bg-white border-green-500 text-green-700 ring-4 ring-green-100"
                      : "bg-white border-green-100 text-green-300"
                  }`}
                >
                  {isDone ? <Check size={15} strokeWidth={3} /> : i + 1}
                </span>
              );
              return (
                <li key={step.path} className="flex-1 flex flex-col items-center relative">
                  {i > 0 && (
                    <span
                      aria-hidden="true"
                      className={`absolute top-4 right-1/2 w-full h-0.5 -translate-y-1/2 ${
                        i <= currentIndex ? "bg-green-500" : "bg-green-100"
                      }`}
                    />
                  )}
                  <span className="relative">
                    {isDone ? (
                      <Link to={`/register/${step.path}`} aria-label={`Go back to ${step.label}`}>
                        {circle}
                      </Link>
                    ) : (
                      circle
                    )}
                  </span>
                  <span
                    className={`mt-2 text-xs font-semibold ${isCurrent ? "text-green-700" : isDone ? "text-green-500" : "text-green-300"}`}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>

        <motion.div
          key={currentPath}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="card p-8"
        >
          <Outlet />
        </motion.div>

        <p className="text-center text-sm text-green-400 mt-6">
          Already registered?{" "}
          <Link to="/login" className="text-green-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
