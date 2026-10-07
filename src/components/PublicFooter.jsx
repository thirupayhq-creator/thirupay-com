import { Link } from "react-router-dom";

const IconX = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} {...props}>
    <path d="M18.24 2H21l-6.6 7.54L22.2 22h-6.3l-4.94-6.46L5.3 22H2.5l7.06-8.07L1.8 2h6.46l4.47 5.9L18.24 2Zm-1.1 18.2h1.75L7.4 3.7H5.53L17.14 20.2Z" />
  </svg>
);
const IconLinkedin = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} {...props}>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.64h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.15 1.46-2.15 2.96V21h-4V9Z" />
  </svg>
);
const IconInstagram = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} {...props}>
    <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.43.4.61.24 1.05.52 1.5.98.46.45.74.9.98 1.5.17.47.36 1.27.4 2.44.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.4 2.43-.24.61-.52 1.05-.98 1.5-.45.46-.9.74-1.5.98-.47.17-1.27.36-2.44.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.43-.4a4.1 4.1 0 0 1-1.5-.98 4.1 4.1 0 0 1-.98-1.5c-.17-.47-.36-1.27-.4-2.44C2.2 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.24-1.97.4-2.43.24-.61.52-1.05.98-1.5.45-.46.9-.74 1.5-.98.47-.17 1.27-.36 2.44-.4C8.42 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.14 0-3.5.01-4.74.07-.96.04-1.48.2-1.83.34-.46.18-.79.4-1.13.74-.34.34-.56.67-.74 1.13-.14.35-.3.87-.34 1.83-.06 1.24-.07 1.6-.07 4.74s.01 3.5.07 4.74c.04.96.2 1.48.34 1.83.18.46.4.79.74 1.13.34.34.67.56 1.13.74.35.14.87.3 1.83.34 1.24.06 1.6.07 4.74.07s3.5-.01 4.74-.07c.96-.04 1.48-.2 1.83-.34.46-.18.79-.4 1.13-.74.34-.34.56-.67.74-1.13.14-.35.3-.87.34-1.83.06-1.24.07-1.6.07-4.74s-.01-3.5-.07-4.74c-.04-.96-.2-1.48-.34-1.83a3 3 0 0 0-.74-1.13 3 3 0 0 0-1.13-.74c-.35-.14-.87-.3-1.83-.34C15.5 4.01 15.14 4 12 4Zm0 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 1.8a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Zm4.7-2a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1Z" />
  </svg>
);
const IconFacebook = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} {...props}>
    <path d="M13.5 21v-7.6h2.55l.38-2.96h-2.93V8.55c0-.86.24-1.44 1.47-1.44h1.57V4.46c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.9v2.18H7.99v2.96h2.47V21h3.04Z" />
  </svg>
);
const IconYoutube = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} {...props}>
    <path d="M21.6 7.2s-.21-1.5-.87-2.16c-.83-.87-1.76-.87-2.19-.92C15.44 4 12 4 12 4h-.01s-3.44 0-6.54.12c-.43.05-1.36.05-2.19.92C2.6 5.7 2.4 7.2 2.4 7.2S2.18 8.96 2.18 10.7v1.6c0 1.75.22 3.5.22 3.5s.2 1.5.86 2.16c.83.87 1.92.84 2.4.94 1.75.17 7.34.22 7.34.22s3.45-.01 6.55-.13c.43-.05 1.36-.05 2.19-.92.66-.66.87-2.16.87-2.16s.22-1.75.22-3.5v-1.6c0-1.74-.22-3.5-.22-3.5ZM9.98 14.4V8.8l5.6 2.8-5.6 2.8Z" />
  </svg>
);

// Apple logo as inline SVG (the  character only renders on Apple devices)
const IconApple = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18} {...props}>
    <path d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.02-1.5-2.62-1.7-3.19-1.73-1.36-.14-2.65.8-3.34.8-.69 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.19-1.54 2.67-.39 6.62 1.1 8.79.73 1.06 1.6 2.25 2.74 2.21 1.1-.04 1.52-.71 2.85-.71 1.33 0 1.7.71 2.87.69 1.19-.02 1.94-1.08 2.66-2.15.84-1.23 1.19-2.42 1.21-2.48-.03-.01-2.3-.88-2.32-3.54ZM14.2 6.1c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.65-1.05 1.69-.92 2.68.97.08 1.96-.5 2.56-1.23Z" />
  </svg>
);

// Floating app-icon badge (top-right of the white card, like IppoPay).
// If you have a ThiruPay icon-only image, set LOGO_ICON to its path
// (example: "/brand/logo-icon.png") and it will be used instead of the "T" mark.
const LOGO_ICON = "/brand/logo-icon-white.png";

const AppIconBadge = () => (
  <div
    className="hidden lg:flex absolute -top-6 right-8 h-14 w-14 items-center justify-center rounded-2xl
               bg-gradient-to-br from-[#0b2447] to-[#ea580c] text-white
               shadow-[0_10px_30px_rgba(234,88,12,0.45)] ring-4 ring-white/70"
    aria-hidden="true"
  >
    {LOGO_ICON ? (
      <img src={LOGO_ICON} alt="" className="h-8 w-8 object-contain" />
    ) : (
      <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 6h14" />
        <path d="M12 6v13" />
        <path d="M8 12.5c1.2 1.1 2.5 1.6 4 1.6" />
      </svg>
    )}
  </div>
);

// Faint watermark shapes inside the brand card (fills the empty centre)
const CardWatermark = () => (
  <svg
    className="pointer-events-none absolute inset-0 h-full w-full"
    viewBox="0 0 400 400"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <polygon points="90,330 250,150 420,190 300,380" fill="white" fillOpacity="0.05" />
    <polygon points="30,300 170,150 300,175 190,330" fill="white" fillOpacity="0.06" />
    <circle cx="340" cy="90" r="90" fill="#ea580c" fillOpacity="0.10" />
  </svg>
);

const SOCIALS = [
  { icon: IconX, label: "X", href: "https://x.com/Thirupay" },
  { icon: IconLinkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/sonachalapay/posts/?feedView=all" },
  { icon: IconInstagram, label: "Instagram", href: "https://www.instagram.com/thiru_pay/?hl=en" },
  { icon: IconFacebook, label: "Facebook", href: "https://www.facebook.com/profile.php?id=61591015570749" },
  { icon: IconYoutube, label: "YouTube", href: "https://www.youtube.com/@Thirupay" },
];

export default function PublicFooter() {
  return (
    <footer className="bg-soft">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
          {/* Left brand card */}
          <div className="relative overflow-hidden bg-brand rounded-2xl p-8 flex flex-col justify-between min-h-[300px]">
            <CardWatermark />

            {/* Logo inside white pill so dark-blue text is visible */}
            <Link to="/" className="relative inline-block self-start bg-white rounded-xl px-4 py-2.5">
              <img
                src="/brand/logo-full.png"
                alt="ThiruPay"
                className="h-9 w-auto object-contain"
              />
            </Link>

            {/* Tagline fills the middle gap */}
            <p className="relative my-8 max-w-[230px] text-xl font-semibold leading-snug text-white/90">
              Powering payments for modern India.
            </p>

            <div className="relative flex flex-wrap gap-3">
              <a
                href="#"
                className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white text-xs font-semibold px-3.5 py-2.5 rounded-lg transition-colors"
              >
                <span className="text-base leading-none">▶</span>
                <span className="text-left leading-tight">
                  Get it on<br />Google Play
                </span>
              </a>
              <a
                href="#"
                className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white text-xs font-semibold px-3.5 py-2.5 rounded-lg transition-colors"
              >
                <IconApple />
                <span className="text-left leading-tight">
                  Download on<br />App Store
                </span>
              </a>
            </div>
          </div>

          {/* Right box */}
          <div className="relative bg-white rounded-2xl p-8 flex flex-col">
            <AppIconBadge />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-3">
                  Product
                </p>
                <ul className="space-y-2.5 text-sm text-green-700/80 mb-6">
                  <li><Link to="/product" className="hover:text-green-900">Features</Link></li>
                  <li><Link to="/download" className="hover:text-green-900">Get the App</Link></li>
                  <li><Link to="/register" className="hover:text-green-900">Get started</Link></li>
                </ul>

                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-3">
                  Contact
                </p>
                <ul className="space-y-2.5 text-sm text-green-700/80">
                  <li>
                    <a href="tel:+919360921283" className="hover:text-green-900">
                      +91 93609 21283
                    </a>
                  </li>
                  <li>
                    <a href="mailto:jayakrishnan@thirupay.com" className="hover:text-green-900">
                      jayakrishnan@thirupay.com
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-3">
                  Support
                </p>
                <ul className="space-y-2.5 text-sm text-green-700/80">
                  <li><Link to="/contact" className="hover:text-green-900">Contact us</Link></li>
                  <li><Link to="/contact#faq" className="hover:text-green-900">FAQ</Link></li>
                  <li><Link to="/login" className="hover:text-green-900">Login</Link></li>
                  <li><Link to="/terms-and-conditions" className="hover:text-green-900">Terms & Conditions</Link></li>
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-3">
                  Company
                </p>
                <ul className="space-y-2.5 text-sm text-green-700/80">
                  <li><Link to="/about" className="hover:text-green-900">About us</Link></li>
                  <li className="text-green-600/70 pt-1 leading-relaxed">
                    <span className="font-semibold text-green-700/80">Thirupay Technologies Private Limited</span>
                    <br />
                    Annai Parvathi Nagar, opposite to Collectorate Office, Vengikkal,
                    <br />
                    Tiruvannamalai - 606604
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex-1 min-h-8" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-green-600">© 2026 ThiruPay. All rights reserved.</p>
              <div className="relative z-10 flex items-center gap-4 text-green-400">
                {SOCIALS.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="hover:text-green-700 transition-colors"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-green-500 text-center mt-6">
         
        </p>
      </div>
    </footer>
  );
}