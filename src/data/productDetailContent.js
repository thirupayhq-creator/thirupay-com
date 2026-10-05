import {
  QrCode,
  Link2,
  Wallet,
  Banknote,
  ShieldPlus,
  Volume2,
  Smartphone,
} from "lucide-react";

// Full detail content for each individual product page — /product/:slug
// Keyed by the slug used in the route and in NAV_PRODUCT_GROUPS' `to` field.
export const PRODUCT_DETAILS = {
  "qr-collection": {
    slug: "qr-collection",
    icon: QrCode,
    category: "Payments",
    title: "All-in-One UPI QR Collection",
    tagline: "One static QR. Zero MDR. Every rupee tracked.",
    heroDesc:
      "Transform your counter with a single high-resolution UPI QR standee. Accept payments seamlessly from Google Pay, PhonePe, Paytm, BHIM, Cred, and 100+ UPI apps with 0% transaction fee and instant SoundBox audio alerts.",
    stats: [
      { value: "0% MDR", label: "Zero fee on standard UPI transfers" },
      { value: "T+1 Payout", label: "Direct settlement to linked bank account" },
      { value: "100+ Apps", label: "GPay, PhonePe, Paytm, BHIM & more" },
      { value: "99.98%", label: "Real-time payment gateway uptime" },
    ],
    features: [
      {
        title: "Durable Acrylic Counter Standee",
        desc: "Get a high-resolution, weather-proof printable QR standee designed for high-traffic retail counters. Print once or order our premium acrylic stand.",
        badge: "Hardware Ready",
      },
      {
        title: "Dynamic Bill-Specific QR Codes",
        desc: "Generate dynamic QR codes on your POS or mobile screen with the exact billing amount pre-filled, eliminating customer typing mistakes and cashier disputes.",
        badge: "Zero Mismatch",
      },
      {
        title: "Instant SoundBox Voice Confirmation",
        desc: "Every successful QR payment instantly triggers an audible voice alert in Tamil and English ('₹500 received on ThiruPay'), eliminating fake screenshot fraud.",
        badge: "Fraud Shield",
      },
      {
        title: "Multi-Counter & Multi-Branch Aggregation",
        desc: "Deploy distinct QR standees across multiple cash counters, floors, or store locations while monitoring all collections from a single merchant dashboard.",
        badge: "Multi-Store",
      },
      {
        title: "Automatic T+1 Bank Payouts",
        desc: "All daily collections are reconciled automatically and credited directly to your registered bank account every morning with complete transaction reports.",
        badge: "Auto Payout",
      },
      {
        title: "Instant Digital Customer Receipts",
        desc: "Customers get a digital confirmation with unique UPI transaction reference (UTR) numbers, making refunds and recordkeeping completely effortless.",
        badge: "Paperless",
      },
    ],
    useCases: [
      {
        title: "Kirana & Provision Stores",
        desc: "Speed up busy morning and evening checkout queues. Collect small ticket amounts without searching for loose change coins.",
        badge: "High Volume",
      },
      {
        title: "Restaurants, Cafes & Bakeries",
        desc: "Place static QR standees at tables or generate bill-specific dynamic QR codes on folders for quick customer checkout.",
        badge: "Fast Turnaround",
      },
      {
        title: "Textiles, Sarees & Boutiques",
        desc: "Accept high-value payments safely with immediate voice announcement and digital ledger tracking.",
        badge: "Retail & Apparel",
      },
      {
        title: "Pharmacies & Medical Clinics",
        desc: "Contactless counter collections with instant transaction audit trails for prescription orders and billing.",
        badge: "Contactless",
      },
    ],
    comparison: [
      { metric: "Transaction MDR Fee", pos: "1.5% - 2.5% per swipe", cash: "0% (High risk of loss)", thirupay: "0% MDR on UPI" },
      { metric: "Hardware & Monthly Rental", pos: "₹500 - ₹1,200 / month", cash: "Physical Cash Drawer", thirupay: "₹0 Setup & Maintenance" },
      { metric: "Payment Verification", pos: "Paper printout slip", cash: "Manual note counting", thirupay: "Instant SoundBox Voice + App Alert" },
      { metric: "Settlement to Bank", pos: "T+2 or T+3 business days", cash: "Manual bank branch visits", thirupay: "Automated T+1 Direct Bank Deposit" },
      { metric: "Customer Convenience", pos: "Requires physical card", cash: "Requires exact cash change", thirupay: "Any smartphone & 100+ UPI Apps" },
    ],
    highlights: [
      {
        title: "Print once, use forever",
        desc: "Your QR doesn't expire or change — stick it at the counter and every customer scans the same code.",
      },
      {
        title: "Live scan tracking",
        desc: "Every scan and payment shows up instantly on your merchant dashboard, with amount, time, and customer reference.",
      },
      {
        title: "Works with any UPI app",
        desc: "Customers can pay using GPay, PhonePe, Paytm, or any UPI app already on their phone — nothing new to install.",
      },
      {
        title: "Next-day settlement",
        desc: "Collections settle to your linked bank account on T+1, with the exact settlement date visible on your dashboard.",
      },
    ],
    howItWorks: [
      { title: "Generate your QR", desc: "Create your verified static or dynamic QR from the merchant dashboard in seconds." },
      { title: "Print & display", desc: "Print the high-res standee or place your acrylic counter stand at the checkout desk." },
      { title: "Get paid & track", desc: "Customers scan to pay, your SoundBox announces the amount, and money settles T+1." },
    ],
    faqs: [
      { q: "Does the ThiruPay QR ever expire?", a: "No. Your static counter QR is permanently linked to your verified merchant account and stays valid as long as your account is active." },
      { q: "Is there any transaction fee (MDR) for UPI payments?", a: "No, standard UPI payments made via QR codes incur 0% MDR fee for merchants." },
      { q: "Can I generate different QRs for different counters or staff?", a: "Yes! You can generate multiple QR codes from your dashboard, label them (e.g., 'Counter 1', 'Juice Bar'), and track receipts separately." },
      { q: "How do I know the customer actually paid and didn't show a fake screenshot?", a: "With ThiruPay SoundBox and live app alerts, an audible voice announces '₹500 received' the exact second the bank confirms credit, completely preventing fake screenshot fraud." },
      { q: "When does the collected money get deposited into my bank account?", a: "All transactions are bundled daily and transferred to your registered bank account the next business morning on a T+1 settlement cycle." },
      { q: "What if a customer's payment fails or is debited without crediting?", a: "If NPCI fails to clear the payment, it will not reflect on your dashboard and will automatically be refunded to the customer by their bank within 24-48 hours." },
    ],
    related: ["payment-links", "settlement-tracking", "soundbox"],
  },

  "payment-links": {
    slug: "payment-links",
    icon: Link2,
    category: "Payments",
    title: "Instant UPI Payment Links",
    tagline: "Get paid from anywhere. No website or POS machine needed.",
    heroDesc:
      "Create branded payment links in seconds and share them directly over WhatsApp, SMS, or Instagram. Perfect for phone orders, home deliveries, and remote customers who cannot scan a physical QR code.",
    stats: [
      { value: "₹0 Setup", label: "Generate unlimited links instantly" },
      { value: "1-Tap Share", label: "WhatsApp, SMS, Instagram & Email" },
      { value: "15m - 7 Days", label: "Customizable link expiry windows" },
      { value: "100% Mobile", label: "Operate entirely from your smartphone" },
    ],
    features: [
      {
        title: "Generate in Under 10 Seconds",
        desc: "Simply enter the invoice amount, customer phone number, and a short order description. Your shareable link is generated instantly.",
        badge: "Lightning Fast",
      },
      {
        title: "1-Tap WhatsApp & Social Commerce",
        desc: "Click to share straight into WhatsApp with a polite, pre-formatted Tamil or English payment request message and secure payment URL.",
        badge: "Social Ready",
      },
      {
        title: "Custom Expiration & Single-Pay Security",
        desc: "Set links to expire after 15 minutes, 2 hours, or 24 hours to prevent customers from paying for out-of-stock items or duplicate invoices.",
        badge: "Fraud Protected",
      },
      {
        title: "Automated Gentle Payment Reminders",
        desc: "Eliminate awkward phone calls and manual chasing. Enable automated SMS and WhatsApp reminders for unpaid pending links.",
        badge: "Auto Follow-up",
      },
      {
        title: "Advance & Booking Token Collections",
        desc: "Collect partial deposits, customization advances, or full amounts for custom orders before dispatching goods.",
        badge: "Advance Payments",
      },
      {
        title: "Branded Digital Invoices & Receipts",
        desc: "Upon successful payment, customers automatically receive a clean digital tax receipt with your shop name, logo, and GST number.",
        badge: "Tax Ready",
      },
    ],
    useCases: [
      {
        title: "Home Delivery & WhatsApp Orders",
        desc: "Collect advance payments before delivery boys depart, eliminating cash-on-delivery change disputes and fake orders.",
        badge: "Delivery",
      },
      {
        title: "Social Media & Instagram Sellers",
        desc: "Boutiques, jewelers, and handmade craft shops selling over Instagram DM can close sales instantly with direct payment links.",
        badge: "Social Sellers",
      },
      {
        title: "Wholesale & B2B Distribution",
        desc: "Send payment links alongside digital invoices to retail dealers across Tamil Nadu for prompt order fulfillment.",
        badge: "Wholesale",
      },
      {
        title: "Services, Repairs & Home Technicians",
        desc: "Electricians, plumbers, AC service technicians, and caterers can collect professional fees on-site or post-service.",
        badge: "Field Services",
      },
    ],
    comparison: [
      { metric: "Payment Time", pos: "Cash on Delivery (high return risk)", cash: "Bank Transfer NEFT (2-4 hrs delay)", thirupay: "Instant UPI Checkout in 10s" },
      { metric: "Customer Effort", pos: "Must keep exact cash change", cash: "Must add beneficiary & wait", thirupay: "1-Tap opens GPay / PhonePe" },
      { metric: "Payment Proof", pos: "Manual paper receipt", cash: "Demanding bank screenshots", thirupay: "Automated instant SMS & WhatsApp receipt" },
      { metric: "Link Expiry Control", pos: "No expiration control", cash: "Cannot prevent outdated payment", thirupay: "Custom expiry prevents inventory mismatch" },
      { metric: "Dashboard Tracking", pos: "Delivery boy logbook", cash: "Checking physical bank passbook", thirupay: "Live Real-Time Status (Pending → Paid)" },
    ],
    highlights: [
      {
        title: "Any amount, any time",
        desc: "Set the exact amount for an order and generate a link in seconds — no fixed pricing needed.",
      },
      {
        title: "Share anywhere",
        desc: "Send the link over WhatsApp, SMS, or even email — the customer just taps and pays.",
      },
      {
        title: "Optional expiry",
        desc: "Set an expiry so old, unpaid links automatically stop accepting payment.",
      },
      {
        title: "Tracked like every collection",
        desc: "Paid links show up in your transactions and settlement tracking exactly like QR collections.",
      },
    ],
    howItWorks: [
      { title: "Create a link", desc: "Enter the order amount, customer mobile, and order note from your dashboard." },
      { title: "Send it via WhatsApp", desc: "Share the link with 1 tap over WhatsApp, SMS, or Instagram direct message." },
      { title: "Customer taps & pays", desc: "Customer taps the link, chooses GPay/PhonePe/Card, and funds settle T+1." },
    ],
    faqs: [
      { q: "Can a customer pay using any UPI app or debit card?", a: "Yes! When the customer clicks the link, they can choose any installed UPI app (Google Pay, PhonePe, Paytm), Net Banking, or Debit/Credit cards." },
      { q: "Can I reuse the same payment link for multiple customers?", a: "By default, payment links are unique to each order. Once paid, they are closed to prevent double payments. You can create as many links as you need for free." },
      { q: "What happens if a link expires before the customer pays?", a: "Once expired, the link safely rejects any payment attempts and displays a message prompting the customer to request a new link from you." },
      { q: "Do I get notified the moment a link is paid?", a: "Yes! You receive an instant push notification on your merchant app and an SMS alert the second payment is verified." },
      { q: "Is there any fee to generate payment links?", a: "There is zero setup fee and zero subscription charge. Basic UPI payments on links are free under standard guidelines." },
      { q: "Can I cancel a payment link after sending it?", a: "Yes, you can deactivate any pending payment link anytime from your merchant dashboard with a single click." },
    ],
    related: ["qr-collection", "settlement-tracking", "business-loans"],
  },

  "settlement-tracking": {
    slug: "settlement-tracking",
    icon: Wallet,
    category: "Payments",
    title: "Automated T+1 Settlement Tracking",
    tagline: "Know exactly when money lands in your bank. Every single day.",
    heroDesc:
      "Eliminate spreadsheet guesswork and bank branch visits. Every rupee collected via UPI QR or Payment Links is reconciled and credited directly to your bank account on a predictable T+1 schedule with 0% platform fee.",
    stats: [
      { value: "T+1 Daily", label: "Automated direct bank deposit" },
      { value: "₹0 Fee", label: "Zero payout transfer deductions" },
      { value: "100% Auto", label: "Automated daily reconciliation" },
      { value: "365 Days", label: "Uninterrupted payout cycle" },
    ],
    features: [
      {
        title: "Automated Morning Bank Credit",
        desc: "All sales collected during the day are batched and transferred directly to your linked bank account every morning by 06:00 AM.",
        badge: "T+1 Automated",
      },
      {
        title: "Real-Time Pending vs Settled Ledger",
        desc: "Watch your funds move with clear visual status tags. See in real-time what has been credited and what is queued for next payout.",
        badge: "Live Ledger",
      },
      {
        title: "Unique Bank UTR Tracking",
        desc: "Every settlement is tagged with the official Bank UTR (Unique Transaction Reference) number for instant bank passbook verification.",
        badge: "Bank Verified",
      },
      {
        title: "Instant Downloadable Settlement Advice",
        desc: "Download official tax-ready settlement PDF advice statements with single-click ease for your auditor or CA.",
        badge: "Tax Ready",
      },
      {
        title: "Zero Deduction Guarantee",
        desc: "What you collect is exactly what lands in your bank. No hidden payout cuts, no gateway maintenance fees, no surprise charges.",
        badge: "0% Hidden Fees",
      },
      {
        title: "Multi-Account Bank Routing",
        desc: "Link your verified Current or Savings bank account with instant Penny Drop verification for error-free transfers.",
        badge: "Bank Grade",
      },
    ],
    useCases: [
      {
        title: "Kirana & Provision Stores",
        desc: "Ensure morning liquidity so you can pay wholesale milk, bread, and vegetable distributors without delay.",
        badge: "Daily Liquidity",
      },
      {
        title: "Restaurants & Bakeries",
        desc: "Keep cash flow steady for daily fresh ingredient purchases and staff payroll with morning payouts.",
        badge: "Cash Flow",
      },
      {
        title: "Wholesale & Stockists",
        desc: "High-volume counter collections automatically credited and cross-verified against delivery chalans.",
        badge: "Wholesale",
      },
      {
        title: "Apparel & Retail Boutiques",
        desc: "Automated matching between daily sales register and bank credits without manual evening accounting.",
        badge: "Easy Accounting",
      },
    ],
    comparison: [
      { metric: "Payout Schedule", pos: "T+2 or T+3 business days", cash: "Manual cash deposit at branch", thirupay: "Automated T+1 morning credit" },
      { metric: "Reconciliation", pos: "Lump-sum bank entry with no breakdown", cash: "Manual physical counting", thirupay: "Line-by-line UTR & transaction breakdown" },
      { metric: "Transfer Fees", pos: "NEFT charges & gateway commissions", cash: "Fuel & time loss at bank", thirupay: "₹0 Free Automated Bank Transfer" },
      { metric: "Accounting Statements", pos: "Quarterly merchant statements", cash: "Manual paper ledger book", thirupay: "1-Click PDF Settlement Advice" },
    ],
    highlights: [
      {
        title: "Pending vs settled, always visible",
        desc: "Each transaction is clearly marked with its current status right on your dashboard.",
      },
      {
        title: "T+1 standard settlement",
        desc: "Collections settle to your linked bank account the next business day, as standard.",
      },
      {
        title: "Daily settlement summary",
        desc: "See a day-wise breakdown of how much settled and how much is still in transit.",
      },
      {
        title: "No manual reconciliation",
        desc: "Match your bank credits to dashboard collections automatically — no spreadsheets needed.",
      },
    ],
    howItWorks: [
      { title: "Collect throughout the day", desc: "Receive payments via QR and Payment Links throughout your store business hours." },
      { title: "Auto-reconcile at midnight", desc: "Our system batches and verifies all successful collections into a single payout." },
      { title: "Credited T+1 morning", desc: "Funds land directly in your registered bank account with an instant UTR notification." },
    ],
    faqs: [
      { q: "What time does the money reach my bank account?", a: "Daily settlements are typically credited to your bank account every morning by 06:00 AM to 09:00 AM on business days." },
      { q: "Is there any fee charged for settling funds to my bank?", a: "No! ThiruPay does not charge any payout transfer fee or maintenance deduction for standard T+1 settlements." },
      { q: "What happens to collections on Sundays and bank holidays?", a: "Collections received on bank holidays are queued and credited on the very next banking working day." },
      { q: "Can I change my registered settlement bank account?", a: "Yes, you can update your linked bank account from your Merchant Profile with instant penny-drop verification." },
      { q: "How do I verify the credit in my bank passbook?", a: "Each settlement on your dashboard provides an official Bank UTR number that exactly matches the narration line in your bank statement." },
    ],
    related: ["qr-collection", "payment-links", "business-loans"],
  },

  "business-loans": {
    slug: "business-loans",
    icon: Banknote,
    category: "Grow your business",
    title: "Collection-Based Business Loans",
    tagline: "Up to ₹2,00,000 collateral-free capital. Repay daily via QR sales.",
    heroDesc:
      "Fuel your shop expansion and festival inventory stocking without traditional paperwork headaches. Loan eligibility is calculated directly from your ThiruPay QR collection history, with easy daily auto-deductions.",
    stats: [
      { value: "Up to ₹2,00,000", label: "Zero-collateral business credit" },
      { value: "₹0 Fee", label: "Zero processing or setup fee" },
      { value: "24 Hours", label: "Digital approval & disbursal" },
      { value: "Daily Auto-EMI", label: "Repayment linked to daily QR sales" },
    ],
    features: [
      {
        title: "Underwritten on Counter Sales",
        desc: "No traditional CIBIL hurdles, audited balance sheets, or tax returns required. Your everyday QR collections prove your repayment strength.",
        badge: "No CIBIL Hassle",
      },
      {
        title: "Stress-Free Daily Micro-Deduction",
        desc: "A small fixed fraction is automatically deducted from your daily settlement. No heavy end-of-month EMI lump-sum anxiety.",
        badge: "Daily Repayment",
      },
      {
        title: "Zero Bank Bounce Penalties",
        desc: "Because repayment is linked to your daily digital collections, you never face ₹500 cheque bounce or NACH ECS bank penalties.",
        badge: "Bounce Free",
      },
      {
        title: "100% Digital Paperless Process",
        desc: "Your business and KYC are already verified on ThiruPay. Apply in one tap from your dashboard without visiting any branch.",
        badge: "100% Paperless",
      },
      {
        title: "Flexible 3, 6 & 12 Month Tenures",
        desc: "Choose a repayment horizon that matches your seasonal sales cycle, with transparent total interest displayed upfront.",
        badge: "Flexible Terms",
      },
      {
        title: "Pre-Approved Limit Upgrades",
        desc: "Timely daily repayment automatically increases your merchant credit tier, unlocking larger loan limits up to ₹5,00,000.",
        badge: "Credit Booster",
      },
    ],
    useCases: [
      {
        title: "Festive Inventory Stocking",
        desc: "Stock up on sweets, crackers, sarees, or grocery provisions before Diwali, Pongal, and wedding seasons.",
        badge: "Inventory",
      },
      {
        title: "Counter Renovation & Hardware",
        desc: "Upgrade shop interiors, add modern refrigeration, display racks, or new billing computers.",
        badge: "Renovation",
      },
      {
        title: "Bulk Wholesale Cash Discounts",
        desc: "Pay wholesale suppliers in upfront cash to negotiate 5% to 10% volume discounts on inventory.",
        badge: "Working Capital",
      },
      {
        title: "Branch Expansion",
        desc: "Fund advance rental deposits or set up a second billing counter or tea branch in a nearby neighborhood.",
        badge: "Expansion",
      },
    ],
    comparison: [
      { metric: "Collateral Required", pos: "Property deeds / Gold / Fixed Deposits", cash: "Local moneylender (30%+ interest)", thirupay: "₹0 Zero Collateral Required" },
      { metric: "Approval Turnaround", pos: "3 to 4 weeks with branch visits", cash: "Same day (predatory terms)", thirupay: "Disbursal in 24 Hours digitally" },
      { metric: "Documentation", pos: "ITR, GST, P&L, 3-yr bank statements", cash: "Promissory notes & blank cheques", thirupay: "Zero extra paperwork required" },
      { metric: "Repayment Structure", pos: "Fixed heavy monthly EMI", cash: "High weekly compound interest", thirupay: "Micro-daily deduction from QR sales" },
    ],
    highlights: [
      {
        title: "Up to ₹2,00,000",
        desc: "Loan amount based on your collection history and business activity on ThiruPay.",
      },
      {
        title: "Zero processing fees",
        desc: "No hidden charges to apply — what you request is reviewed as-is.",
      },
      {
        title: "No collateral needed",
        desc: "Your ThiruPay transaction history stands in for traditional collateral.",
      },
      {
        title: "Digital disbursal",
        desc: "Once approved by our admin team, funds are disbursed digitally to your linked account.",
      },
    ],
    howItWorks: [
      { title: "Select loan amount", desc: "Choose your required loan amount (₹25k - ₹2 Lakhs) and tenure on your dashboard." },
      { title: "Instant admin review", desc: "Our admin team verifies your counter transaction volume within 24 hours." },
      { title: "Direct bank credit", desc: "Approved funds are transferred directly into your registered bank account." },
    ],
    faqs: [
      { q: "Who is eligible for a ThiruPay business loan?", a: "Any active, KYC-verified merchant who has been collecting payments on ThiruPay for at least 30 to 60 days is eligible to apply." },
      { q: "How does daily auto-repayment work?", a: "Each morning when your daily QR collections settle, a small pre-agreed installment is deducted, and the remaining balance is sent to your bank." },
      { q: "What happens on days with very low sales?", a: "Deductions adapt to your collection. If sales are lower on a particular day, you aren't penalized with bank bounce charges." },
      { q: "Can I prepay the loan early?", a: "Yes! You can close your loan early at any time with zero foreclosure charges." },
      { q: "Are there any hidden processing charges?", a: "No, ThiruPay loans have 0% processing fee and no hidden administrative charges." },
    ],
    related: ["qr-collection", "settlement-tracking", "insurance"],
  },

  insurance: {
    slug: "insurance",
    icon: ShieldPlus,
    category: "Grow your business",
    title: "Merchant Protection & Insurance",
    tagline: "Comprehensive cover for your shop, devices, and family health from ₹49/month.",
    heroDesc:
      "Shield your counter against unexpected disasters, burglary, and device breakdowns. Request tailored insurance packages directly from your merchant dashboard with paperless 1-tap activation.",
    stats: [
      { value: "₹5,00,000", label: "Maximum shop inventory coverage" },
      { value: "From ₹49/mo", label: "Pocket-friendly micro premiums" },
      { value: "48h SLA", label: "Fast digital claim settlement" },
      { value: "100% Cashless", label: "Direct replacement & cash compensation" },
    ],
    features: [
      {
        title: "Shop & Stock Fire/Burglary Shield",
        desc: "Protects your physical shop, counter cash, and entire product inventory against fire accidents, electrical short circuits, and nighttime break-ins.",
        badge: "Shop Cover",
      },
      {
        title: "SoundBox & POS Hardware Care",
        desc: "Covers counter speaker and POS machines against accidental tea/coffee spills, countertop drops, lightning surges, and device theft.",
        badge: "Device Care",
      },
      {
        title: "Daily Merchant Hospital Cash",
        desc: "Provides up to ₹2,000 daily cash compensation during hospitalization, ensuring your household income does not stop if you fall ill.",
        badge: "Health Shield",
      },
      {
        title: "1-Tap Paperless Activation",
        desc: "No health tests, no insurance agents visiting your shop, no lengthy 20-page forms. Activate coverage instantly from your dashboard.",
        badge: "Instant Setup",
      },
      {
        title: "Hassle-Free Digital Claims",
        desc: "In case of damage or loss, simply snap photos on your phone and upload via the merchant app. Claims are reviewed within 48 hours.",
        badge: "Fast Claims",
      },
      {
        title: "IRDAI Licensed Underwriters",
        desc: "All insurance policies are underwritten by leading IRDAI-regulated general insurance companies for complete peace of mind.",
        badge: "IRDAI Certified",
      },
    ],
    useCases: [
      {
        title: "Kirana & Provision Stores",
        desc: "Protect perishable groceries, edible oil, and grain inventory against monsoon rainwater ingress and fire risks.",
        badge: "Retail Grocers",
      },
      {
        title: "Textiles & Saree Showrooms",
        desc: "High-value textile stock protection against electrical short circuits, fire, and store burglary.",
        badge: "Apparel Stores",
      },
      {
        title: "Restaurants, Cafes & Tea Stalls",
        desc: "Protect SoundBox and billing devices from hot tea/liquid spills and kitchen fire hazards.",
        badge: "Food Counters",
      },
      {
        title: "Solo Shop Owners",
        desc: "Ensure medical hospital cash support so your family is cared for even when you cannot open your shop.",
        badge: "Sole Proprietor",
      },
    ],
    comparison: [
      { metric: "Buying Experience", pos: "Visiting branch or dealing with agents", cash: "Uninsured (100% personal loss)", thirupay: "1-Tap activation from dashboard" },
      { metric: "Monthly Cost", pos: "Heavy annual upfront premium", cash: "No cost until disaster strikes", thirupay: "Affordable micro-premiums from ₹49/mo" },
      { metric: "Device Cover", pos: "Hard to insure small retail electronics", cash: "Paying out-of-pocket for new device", thirupay: "Full SoundBox & POS replacement cover" },
      { metric: "Claim Processing", pos: "Physical surveyor inspection & paperwork", cash: "Total out-of-pocket loss", thirupay: "Photo upload & 48-hour digital claim" },
    ],
    highlights: [
      {
        title: "Business cover",
        desc: "Protect your shop and inventory against loss or damage.",
      },
      {
        title: "Device cover",
        desc: "Insure your SoundBox or POS device against damage or malfunction.",
      },
      {
        title: "Health & motor options",
        desc: "Extend protection to your family's health or your vehicle, requested the same way.",
      },
      {
        title: "One-tap request",
        desc: "No separate forms or agents — request a policy right from your merchant dashboard.",
      },
    ],
    howItWorks: [
      { title: "Choose your cover", desc: "Select Shop Cover, Device Care, or Hospital Cash from your dashboard." },
      { title: "Confirm with 1-tap", desc: "Review the low monthly premium and submit your request instantly." },
      { title: "Active protection", desc: "Your digital insurance certificate is issued to your dashboard within 24 hours." },
    ],
    faqs: [
      { q: "What documents are required to activate insurance?", a: "No additional documents! Since your business details and shop address are already verified on ThiruPay, you can activate coverage in one tap." },
      { q: "How is the monthly insurance premium paid?", a: "Premiums can be automatically deducted from your daily QR settlement or paid monthly via UPI." },
      { q: "How do I file an insurance claim if something happens?", a: "Simply open your ThiruPay Merchant Dashboard, go to Services > Insurance > File Claim, upload photos of the incident, and our claims team will handle the rest." },
      { q: "Is the SoundBox hardware covered for accidental water or tea spills?", a: "Yes! The Device Care plan specifically covers liquid spills, drops, short-circuit burns, and theft." },
    ],
    related: ["soundbox", "pos-devices", "business-loans"],
  },

  soundbox: {
    slug: "soundbox",
    icon: Volume2,
    category: "Grow your business",
    title: "ThiruPay 4G Smart SoundBox",
    tagline: "Crystal-clear voice alerts in Tamil & English. Zero fake screenshot fraud.",
    heroDesc:
      "Never miss a payment or pause your busy counter to inspect a customer's phone screen. Our high-decibel 4G smart speaker announces every UPI credit out loud in Tamil or English the exact second funds arrive.",
    stats: [
      { value: "100dB Speaker", label: "Audible across noisy traffic" },
      { value: "Tamil & English", label: "Bilingual voice payment announcements" },
      { value: "7-Day Standby", label: "Long battery life with Type-C charging" },
      { value: "Dual SIM 4G", label: "Works even on weak shop networks" },
    ],
    features: [
      {
        title: "Bilingual Instant Voice Audio",
        desc: "Announces successful payments clearly in Tamil ('திருபே-ல் ₹500 பெறப்பட்டது') or English ('₹500 received on ThiruPay') with volume controls.",
        badge: "Bilingual Audio",
      },
      {
        title: "100% Fake Screenshot Fraud Shield",
        desc: "Eliminates rogue customers showing forged or edited payment screenshots. If the SoundBox does not speak, the money hasn't arrived.",
        badge: "Anti-Fraud",
      },
      {
        title: "100dB High-Clarity Loudspeaker",
        desc: "Engineered specifically for Indian street traffic, noisy bazaar markets, tea stalls, and bus stand counters.",
        badge: "High Decibel",
      },
      {
        title: "High-Contrast LED Display",
        desc: "Shows the exact received amount in bright green digits alongside the audio announcement for double verification.",
        badge: "LED Display",
      },
      {
        title: "Dual SIM 4G LTE & Wi-Fi Ready",
        desc: "Pre-fitted with multi-network 4G SIM that auto-connects to the strongest available signal. No mobile pairing required.",
        badge: "Always Connected",
      },
      {
        title: "Instant Replay Button",
        desc: "Busy with a customer? Press the top replay key anytime to repeat the last received payment amount.",
        badge: "1-Tap Replay",
      },
    ],
    useCases: [
      {
        title: "Tea Stalls & Food Stalls",
        desc: "Serve hot tea and snacks without wiping wet hands to unlock your personal mobile phone every two minutes.",
        badge: "Hands-Free",
      },
      {
        title: "Vegetable & Fish Markets",
        desc: "Loud, clear voice alerts rise above crowded bazaar shouting and street traffic noise.",
        badge: "Noisy Counters",
      },
      {
        title: "Pharmacies & Retail Counters",
        desc: "Both the cashier and the customer hear the payment confirmation simultaneously, building mutual trust.",
        badge: "Fast Checkout",
      },
      {
        title: "Multi-Counter Sweet Stalls",
        desc: "Place a dedicated SoundBox at each checkout counter to prevent cashier confusion.",
        badge: "Multi-Counter",
      },
    ],
    comparison: [
      { metric: "Payment Verification", pos: "Looking at customer's phone (high fraud risk)", cash: "Manual cash counting", thirupay: "Audible Voice in Tamil/English + LED Screen" },
      { metric: "Phone Dependency", pos: "Must keep personal phone at shop", cash: "No phone needed", thirupay: "Standalone 4G device; works with phone screen off" },
      { metric: "Battery Life", pos: "Drains phone battery fast", cash: "None", thirupay: "7-Day standby with standard Type-C charging" },
      { metric: "Network Connectivity", pos: "Depends on personal Wi-Fi / Hotspot", cash: "None", thirupay: "Pre-configured dual 4G SIM included" },
    ],
    highlights: [
      {
        title: "Instant voice alerts",
        desc: "Every successful payment is announced out loud the moment it lands.",
      },
      {
        title: "Tamil & English support",
        desc: "Choose the language your SoundBox speaks, to match your customers and staff.",
      },
      {
        title: "Hands-free confirmation",
        desc: "No need to unlock your phone or check the dashboard for every single sale.",
      },
      {
        title: "Delivered to your doorstep",
        desc: "Request one from your dashboard and it's delivered — no store visit required.",
      },
    ],
    howItWorks: [
      { title: "Request your device", desc: "Submit a SoundBox request from your merchant dashboard in 1 tap." },
      { title: "Doorstep delivery", desc: "Our team ships the pre-configured device to your registered shop address." },
      { title: "Turn on & start hearing", desc: "Turn the power switch on — it automatically connects to 4G and announces sales." },
    ],
    faqs: [
      { q: "Does the SoundBox need to be connected to my personal phone or Wi-Fi?", a: "No! The ThiruPay SoundBox comes with an internal 4G data SIM. It works 100% independently even if your phone is switched off or you are away from the shop." },
      { q: "Can I switch between Tamil and English announcements?", a: "Yes! You can toggle between Tamil, English, or bilingual modes directly from your device buttons or through your merchant dashboard." },
      { q: "How long does the battery last on a single charge?", a: "The device features a heavy-duty battery providing up to 5 to 7 days of normal counter operations on a single charge." },
      { q: "How does the SoundBox protect against fake payment screenshots?", a: "The SoundBox only announces transactions after the NPCI bank nodal gateway confirms real funds transfer. Fake screenshot apps cannot trigger the voice alert." },
    ],
    related: ["qr-collection", "pos-devices", "insurance"],
  },

  "pos-devices": {
    slug: "pos-devices",
    icon: Smartphone,
    category: "Grow your business",
    title: "Smart Android POS Terminals",
    tagline: "Accept Card Swipes, Contactless NFC Tap & UPI QR with built-in thermal bill printing.",
    heroDesc:
      "Upgrade your retail counter to accept all payment modes seamlessly. Our Android smart POS machine handles Debit cards, Credit cards, Contactless Tap, and Dynamic QR on a single touchscreen terminal.",
    stats: [
      { value: "All Cards + UPI", label: "Visa, Mastercard, RuPay & Tap" },
      { value: "Thermal Printer", label: "Built-in paper bill & tax receipt printer" },
      { value: "4G LTE + Wi-Fi", label: "Always-online Android touch terminal" },
      { value: "T+1 Payout", label: "Daily unified settlement with UPI sales" },
    ],
    features: [
      {
        title: "Accept All Major Card Brands",
        desc: "Accept all domestic and international Debit & Credit cards across Visa, Mastercard, RuPay, Maestro, and American Express.",
        badge: "All Cards",
      },
      {
        title: "Contactless NFC Tap & Pay",
        desc: "Lightning-fast transactions under ₹5,000 without requiring PIN entry. Customers simply tap their card against the POS terminal.",
        badge: "NFC Tap",
      },
      {
        title: "Built-in Thermal Receipt Printer",
        desc: "High-speed silent thermal bill printer issues customer receipts with your shop branding, item summary, and GST details.",
        badge: "Bill Printer",
      },
      {
        title: "Dynamic UPI QR on Screen",
        desc: "Display a dynamic UPI QR code with the exact bill amount right on the terminal screen for customers who prefer to pay by phone.",
        badge: "Touch Display",
      },
      {
        title: "Unified Merchant Ledger",
        desc: "Card payments and UPI payments consolidate into your single ThiruPay dashboard for simplified daily accounting and T+1 payout.",
        badge: "Unified Payout",
      },
      {
        title: "Full Day High-Capacity Battery",
        desc: "Heavy-duty rechargeable lithium battery keeps your counter billing running even during shop power cuts or table delivery.",
        badge: "Long Battery",
      },
    ],
    useCases: [
      {
        title: "Department Stores & Supermarkets",
        desc: "Handle large grocery shopping carts where customers frequently prefer to pay with credit or debit cards.",
        badge: "Supermarkets",
      },
      {
        title: "Textiles, Silk Sarees & Boutiques",
        desc: "Safe processing for high-value apparel purchases exceeding ₹5,000 to ₹50,000.",
        badge: "High Ticket",
      },
      {
        title: "Restaurants, Cafes & Hotels",
        desc: "Take the wireless POS terminal directly to the customer's dining table for convenient card tapping and bill printing.",
        badge: "Dining Tables",
      },
      {
        title: "Pharmacies & Medical Clinics",
        desc: "Offer contactless card tapping and immediate printed receipts for health insurance reimbursement.",
        badge: "Healthcare",
      },
    ],
    comparison: [
      { metric: "Terminal Technology", pos: "Bulky old push-button keypad terminal", cash: "Cash drawer only", thirupay: "Sleek Android Touchscreen + Thermal Printer" },
      { metric: "Payment Modes", pos: "Cards only (no QR on screen)", cash: "Physical currency", thirupay: "Cards (Tap/Chip) + Dynamic UPI QR on Screen" },
      { metric: "Paper Receipt", pos: "External bulky printer or slow print", cash: "Manual handwritten cash bill", thirupay: "Integrated high-speed thermal paper bill" },
      { metric: "Dashboard Integration", pos: "Separate bank terminal portal", cash: "Paper diary", thirupay: "Unified with QR collections on ThiruPay dashboard" },
    ],
    highlights: [
      {
        title: "Card + UPI, one dashboard",
        desc: "Card payments through your POS device show up alongside your QR and link collections.",
      },
      {
        title: "Tap, swipe, or insert",
        desc: "Accept all common card payment methods your customers already use.",
      },
      {
        title: "Delivered to your doorstep",
        desc: "Request a terminal from your dashboard and it's delivered directly to your business.",
      },
      {
        title: "Simple settlement",
        desc: "Card collections settle and track the same way as your other payment methods.",
      },
    ],
    howItWorks: [
      { title: "Request your POS machine", desc: "Submit a POS device request from the Services tab on your merchant dashboard." },
      { title: "Doorstep installation", desc: "Our field team delivers the pre-activated terminal and trains your counter staff." },
      { title: "Start accepting cards", desc: "Tap, swipe, or print receipts instantly — all sales settle together on T+1." },
    ],
    faqs: [
      { q: "Which cards are accepted on the ThiruPay POS device?", a: "All domestic and international Debit and Credit cards issued by Visa, Mastercard, RuPay, Maestro, and Diners Club are accepted." },
      { q: "Does the POS terminal support Contactless (Tap & Pay)?", a: "Yes! Customers can simply tap any Wi-Fi symbol enabled NFC debit/credit card or smartphone for instant payment without PIN for amounts under ₹5,000." },
      { q: "How do thermal paper rolls work for the printer?", a: "The device uses standard 58mm thermal paper rolls widely available everywhere. We provide starter rolls with device delivery." },
      { q: "How do card settlements get credited?", a: "Card collections settle directly to your registered bank account alongside your daily UPI collections on a unified T+1 schedule." },
    ],
    related: ["soundbox", "qr-collection", "insurance"],
  },
};

export const PRODUCT_DETAIL_ORDER = [
  "qr-collection",
  "payment-links",
  "settlement-tracking",
  "business-loans",
  "insurance",
  "soundbox",
  "pos-devices",
];
