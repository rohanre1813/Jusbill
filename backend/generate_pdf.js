import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT = path.join(__dirname, '..', 'JusBill_Interview_QA.pdf');

const doc = new PDFDocument({ 
  margin: 50, 
  size: 'A4',
  info: { Title: 'JusBill Interview Q&A', Author: 'Rohan' }
});

doc.pipe(fs.createWriteStream(OUTPUT));

// Colors
const INDIGO = '#4F46E5';
const DARK   = '#111827';
const GRAY   = '#6B7280';
const LIGHT  = '#F9FAFB';
const WHITE  = '#FFFFFF';
const GREEN  = '#059669';

// ──────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────
function pageWidth() { return doc.page.width - doc.page.margins.left - doc.page.margins.right; }

function hr(y, color = '#E5E7EB') {
  doc.save().strokeColor(color).lineWidth(0.5).moveTo(50, y).lineTo(doc.page.width - 50, y).stroke().restore();
}

function sectionBadge(text, x, y) {
  const w = 180;
  doc.save()
    .roundedRect(x, y, w, 22, 4).fill(INDIGO)
    .fillColor(WHITE).fontSize(9).font('Helvetica-Bold')
    .text(text, x + 8, y + 6, { width: w - 16 })
    .restore();
  return y + 30;
}

let pageNum = 0;
doc.on('pageAdded', () => {
  pageNum++;
  if (pageNum > 1) {
    doc.save()
      .fillColor(GRAY).fontSize(8).font('Helvetica')
      .text(`JusBill Interview Guide  ·  Page ${pageNum}`, 50, doc.page.height - 35, { width: pageWidth(), align: 'center' })
      .restore();
    hr(doc.page.height - 45, '#E5E7EB');
  }
});

// ──────────────────────────────────────────
// COVER PAGE
// ──────────────────────────────────────────
doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0F172A');

// Decorative circles
doc.save().circle(500, 100, 180).fillOpacity(0.07).fill(INDIGO).restore();
doc.save().circle(100, 600, 220).fillOpacity(0.06).fill(INDIGO).restore();

// Badge
doc.roundedRect(50, 120, 130, 26, 5).fill(INDIGO);
doc.fillColor(WHITE).fontSize(10).font('Helvetica-Bold').text('INTERVIEW GUIDE', 58, 128);

// Title
doc.fillColor(WHITE).fontSize(42).font('Helvetica-Bold')
   .text('JusBill Project', 50, 170, { width: pageWidth() });
doc.fillColor(INDIGO).fontSize(42).font('Helvetica-Bold')
   .text('100 Interview Q&A', 50, 220, { width: pageWidth() });

// Subtitle
doc.fillColor('#94A3B8').fontSize(14).font('Helvetica')
   .text('Comprehensive answers for React · Node.js · MongoDB · Docker · DevOps · System Design', 50, 285, { width: pageWidth() });

// Divider
doc.moveTo(50, 330).lineTo(doc.page.width - 50, 330).strokeColor(INDIGO).lineWidth(2).stroke();

// Stats row
const stats = [
  { val: '100', label: 'Questions' },
  { val: '6', label: 'Sections' },
  { val: 'Full Stack', label: 'Coverage' },
  { val: 'Detailed', label: 'Answers' },
];
let sx = 50;
stats.forEach(s => {
  doc.fillColor(WHITE).fontSize(28).font('Helvetica-Bold').text(s.val, sx, 360, { width: 120, align: 'center' });
  doc.fillColor('#64748B').fontSize(10).font('Helvetica').text(s.label, sx, 395, { width: 120, align: 'center' });
  sx += 130;
});

// Stack tags
const tags = ['React', 'Vite', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Docker', 'Nginx', 'EC2', 'Groq AI', 'Redis', 'Cloudinary'];
let tx = 50; let ty = 450;
tags.forEach(t => {
  const tw = doc.widthOfString(t, { fontSize: 9 }) + 18;
  if (tx + tw > doc.page.width - 60) { tx = 50; ty += 28; }
  doc.roundedRect(tx, ty, tw, 20, 3).fill('#1E293B');
  doc.fillColor('#94A3B8').fontSize(9).font('Helvetica').text(t, tx + 9, ty + 6);
  tx += tw + 8;
});

// Bottom
doc.fillColor('#475569').fontSize(10).font('Helvetica')
   .text('Prepared for technical interviews · Full-stack development role', 50, doc.page.height - 80, { width: pageWidth(), align: 'center' });
doc.fillColor('#334155').fontSize(9)
   .text('© 2026 Rohan · JusBill', 50, doc.page.height - 60, { width: pageWidth(), align: 'center' });

// ──────────────────────────────────────────
// SECTIONS & QUESTIONS
// ──────────────────────────────────────────
const sections = [
  {
    title: 'Section 1 — React & Frontend',
    color: '#4F46E5',
    questions: [
      { q: 'What is the role of AuthContext in your project and how does it work end-to-end?', a: `AuthContext is a React Context that provides global authentication state (user, loading) and actions (login, register, logout) to every component without prop drilling.\n\nFlow:\n1. AuthProvider wraps the entire app in main.jsx.\n2. On mount, useEffect calls checkUser() which hits GET /api/auth/me to verify the JWT cookie.\n3. If the cookie is valid, the server returns the user object stored in user state and localStorage under key "jusbill_user".\n4. If the request fails (401 or network error), user is set to null and localStorage is cleared.\n5. The loading flag starts as true and is set to false in the finally block, preventing route flashing.\n6. login(), register(), and logout() wrap the corresponding API calls and update state accordingly.\n\nWhy localStorage seed? To avoid a flash of the login page on page reload — the user is hydrated from localStorage immediately while the network verify runs in the background.` },
      { q: 'Explain how protected routes work in your app.', a: `Protected routes are implemented in ProtectedRoute.jsx:\n\n  if (loading) return children ? children : <Outlet />;\n  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;\n  return children ? children : <Outlet />;\n\n- While loading is true, it renders the children/outlet (to prevent flicker).\n- If loading is false and no user exists, it redirects to /login with the original location saved in state.\n- If user exists, it renders the protected content.\n\nIn App.jsx, all authenticated routes (dashboard, products, bills, etc.) are wrapped inside <ProtectedRoute><LayoutWithAnimatedOutlet /></ProtectedRoute>.` },
      { q: 'What is the difference between useEffect and useLayoutEffect? Why did you use useEffect?', a: `- useEffect runs asynchronously AFTER the browser has painted the screen. It does not block visual updates.\n- useLayoutEffect runs synchronously after DOM mutations but BEFORE the browser paints. It blocks painting.\n\nuseEffect was used throughout JusBill (e.g., AuthContext, NotificationBell) because:\n1. The operations are asynchronous (API calls, localStorage reads).\n2. Blocking the paint with useLayoutEffect would cause visible freezes.\n3. useLayoutEffect is only needed for DOM measurements or imperative DOM mutations that must be done before paint.` },
      { q: 'How does the Axios interceptor work in your project and why did you use it?', a: `In api/axios.js:\n\n  api.interceptors.request.use((config) => {\n    if (config.url && config.url.startsWith("/") && !config.url.startsWith("/api")) {\n      config.url = "/api" + config.url;\n    }\n    return config;\n  });\n\nPurpose: Automatically prefixes /api to all relative URLs so individual API files don't need to repeat /api/auth/..., /api/products/... — they just write /auth/login, /products, etc.\n\nWhy Interceptors? They act as middleware for HTTP requests/responses, allowing cross-cutting concerns like auto-prepending base path, attaching auth headers globally, and centralized error handling.` },
      { q: 'What is framer-motion and how did you use it in the landing page?', a: `Framer Motion is a React animation library with declarative animations using props like initial, animate, exit, whileHover, and variants.\n\nUsage in JusBill:\n- variants (fadeUp, staggerContainer) defined once and reused across sections.\n- staggerContainer staggers child animations with staggerChildren: 0.08 — each child animates 80ms after the previous.\n- AnimatePresence wraps route transitions so pages animate in/out when navigating.\n- whileHover={{ y: -5 }} on feature cards for lift effect on hover.\n\nKey lesson learned: whileInView does NOT work inside cross-origin sandboxed iframes (like Google AdSense preview) because IntersectionObserver is blocked. Switched to animate for the landing page.` },
      { q: 'What is react-hook-form and why is it better than controlled inputs?', a: `react-hook-form is a performant form library that uses uncontrolled inputs (refs) instead of React state.\n\nAdvantages over controlled inputs (useState):\n1. Performance: Doesn't re-render the entire component on every keystroke.\n2. Less boilerplate: No need for onChange handlers and state for every field.\n3. Built-in validation: register("email", { required: true, pattern: /.../ }) handles validation declaratively.\n4. FormState: Tracks isDirty, isValid, errors automatically.\n\nIn JusBill: Used in RegisterPage, LoginPage, InvoicePage, and ProfilePage.` },
      { q: "What is React Router's <Navigate> vs useNavigate()? When did you use each?", a: `- <Navigate to="/dashboard" /> is a declarative component. When rendered, it immediately redirects. Used in JSX conditionals like !user ? <LandingPage/> : <Navigate to="/dashboard"/>.\n\n- useNavigate() is an imperative hook. Returns a navigate function you call programmatically. Used in event handlers like handleLogout() → navigate("/login") or after form submission.\n\nRule of thumb: Use <Navigate> in render logic. Use useNavigate() in event handlers or async callbacks.` },
      { q: 'Explain AnimatePresence and how route transitions work in your app.', a: `AnimatePresence from framer-motion allows components to animate OUT before being removed from the DOM. Without it, React immediately unmounts a component when navigating, preventing exit animations.\n\nIn LayoutWithAnimatedOutlet:\n  <AnimatePresence mode="wait">\n    <Outlet key={location.pathname} />\n  </AnimatePresence>\n\n- key={location.pathname} tells React to treat each route as a different component instance, triggering mount/unmount animations.\n- mode="wait" ensures the outgoing page fully exits before the incoming page enters (no overlap).` },
      { q: 'How does theme switching (dark/light mode) work in your app?', a: `ThemeContext manages the theme state:\n1. Reads initial theme from localStorage (persists across reloads).\n2. Applies/removes the "dark" class on document.documentElement (the <html> tag).\n3. Tailwind's darkMode: "class" config activates dark variants only when the dark class is present.\n4. toggleTheme() flips between "dark" and "light", updates state, and persists to localStorage.\n\nAll dark mode styles use Tailwind's dark: prefix (e.g., dark:bg-gray-950).` },
      { q: "What is react-hot-toast and how is it different from alert()?", a: `react-hot-toast renders non-blocking notification toasts within the React tree. Unlike alert():\n- It's non-blocking — users can still interact with the page.\n- It's styled and customizable (position, duration, icon, color).\n- It's React-aware — renders inside the component tree via <Toaster />.\n- Supports toast.promise() for async operations (shows loading → success/error automatically).\n\nUsage in JusBill: Call toast.success("Invoice sent!") or toast.error("Failed to load") anywhere.` },
      { q: 'What is useLocation and how did you use it?', a: `useLocation returns the current URL location object { pathname, search, hash, state }.\n\nUsage in JusBill:\n1. In Navbar, isActive(path) compares location.pathname === path to highlight the active nav link.\n2. In ProtectedRoute, the current location is saved when redirecting to login: <Navigate to="/login" state={{ from: location }} /> — so after login, the user is sent back to the page they tried to access.\n3. In LayoutWithAnimatedOutlet, location.pathname is the key for AnimatePresence to detect route changes.` },
      { q: 'What is Recharts and how did you integrate it?', a: `Recharts is a composable React charting library built on D3. It provides BarChart, PieChart, LineChart components accepting data as props.\n\nIn JusBill's ReportsPage:\n- BarChart shows monthly sales revenue.\n- PieChart shows revenue distribution by product category.\n- Data is fetched from the backend, transformed into Recharts format [{ name: "Jan", value: 15000 }], and passed to chart components.\n- ResponsiveContainer makes charts fluid/responsive without fixed pixel widths.` },
      { q: 'What is html2pdf.js and how does PDF download work on the client side?', a: `html2pdf.js converts HTML elements to PDF in the browser using html2canvas (screenshots the DOM) and jsPDF (embeds the image into a PDF).\n\nFlow in JusBill:\n1. A hidden <div ref={invoiceRef}> contains the formatted invoice HTML.\n2. On "Download PDF" click: html2pdf().set(options).from(invoiceRef.current).save().\n3. The library screenshots the div and creates a downloadable PDF.\n\nLimitation: Since it screenshots the DOM, the PDF is image-based — not searchable text. For searchable PDFs, the backend uses pdfkit to generate real text-based PDFs.` },
      { q: 'Why use Vite instead of Create React App (CRA)?', a: `Vite is significantly faster than CRA because:\n1. Dev server: Vite uses native ES modules — no bundling during development. CRA bundles everything with Webpack on every change.\n2. HMR: Vite's Hot Module Replacement is near-instant. CRA's can take seconds on large apps.\n3. Build speed: Vite uses esbuild (written in Go) for transpilation — 10–100x faster than Babel/Webpack.\n4. Modern output: Vite produces optimized ES module output by default.\n\nCRA is deprecated and unmaintained as of 2023.` },
      { q: 'How does the NotificationBell component work?', a: `NotificationBell is a self-contained component inside Navbar:\n1. On mount, it calls getProducts() API.\n2. Filters products where stock < 5.\n3. Displays a red badge with the count if any low-stock items exist.\n4. Clicking the bell toggles a dropdown showing each low-stock product with its remaining quantity.\n5. Listens to a custom DOM event "stock-changed" dispatched from other components (like InvoicePage after creating an invoice) to refresh the notification count without a full page reload.` },
      { q: 'What is the no-scrollbar utility class and why was it needed?', a: `The mobile bottom navigation bar uses overflow-x-auto to allow horizontal scrolling. But the default browser scrollbar looks ugly on mobile nav bars.\n\nThe custom utility class:\n  .no-scrollbar::-webkit-scrollbar { display: none; }\n  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }\n\nThis hides the scrollbar visually while keeping scroll functionality intact. Works across Chrome (webkit), Firefox (scrollbar-width), and IE (-ms-overflow-style).` },
      { q: 'Explain the layoutId="nav-pill" on the active nav link.', a: `layoutId is a Framer Motion feature for shared layout animations. When two components share the same layoutId, Framer Motion automatically animates between their positions.\n\nIn the navbar, the white pill background sits behind the active link. When you click a different link:\n1. The pill on the old link unmounts.\n2. The pill on the new link mounts.\n3. Framer Motion detects they share the same layoutId and smoothly slides the pill from the old position to the new one.\n\nThis creates the "sliding pill" active indicator effect with zero manual position calculation.` },
      { q: 'What is dayjs and where is it used?', a: `dayjs is a lightweight (2KB) date manipulation library — a modern alternative to moment.js. It provides a chainable API for parsing, formatting, and comparing dates.\n\nUsage in JusBill:\n- Formatting invoice dates: dayjs(invoice.createdAt).format("DD MMM YYYY").\n- Calculating due dates: dayjs().add(30, "day").format(...).\n- Filtering reports by date range: comparing dayjs(invoice.date).isBetween(start, end).` },
      { q: 'What is uuid used for in your project?', a: `uuid generates universally unique identifiers (UUIDs v4) — random 128-bit strings like 550e8400-e29b-41d4-a716-446655440000.\n\nUsage in JusBill: Used to generate unique Shop IDs for users so their public shop page can be accessed at /shop/:shopId. Since UUIDs have extremely low collision probability (2^122 possible values), they're safe for this use case without checking the database for uniqueness.` },
      { q: 'What is React.StrictMode and does your app use it?', a: `React.StrictMode is a development tool that:\n1. Double-invokes effects and render functions to detect side effects.\n2. Warns about deprecated APIs and unexpected side effects.\n3. Has NO effect in production — only runs in development.\n\nDouble-invocation is why AuthContext's checkUser runs twice in development — you see two API calls to /api/auth/me in the console. This is intentional behavior of StrictMode to surface bugs in effects.\n\nIn main.jsx: <React.StrictMode><App /></React.StrictMode>` },
      { q: 'What is useRef and how would you use it in JusBill?', a: `useRef creates a mutable ref object that persists across renders without causing re-renders when changed.\n\nTwo main uses:\n\n1. DOM access:\n  const invoiceRef = useRef(null);\n  html2pdf().from(invoiceRef.current).save(); // Direct DOM access for PDF\n\n2. Persisting values without re-rendering:\n  const previousUserId = useRef(null);\n  // Track previous value without triggering re-render\n\nKey difference from useState: Changing ref.current does NOT trigger a re-render.` },
      { q: 'What is debouncing and would it be useful in JusBill?', a: `Debouncing delays executing a function until a certain time has passed since the last call.\n\nIn JusBill's customer search while creating an invoice:\n  Without debounce: User types "John" → 4 API calls: "J", "Jo", "Joh", "John"\n  With debounce: User types "John" → 1 API call (after 300ms pause)\n\nImplementation:\n  const debouncedSearch = useCallback(debounce((query) => searchCustomers(query), 300), []);\n\nThis reduces unnecessary API calls by 80-90% on search inputs.` },
      { q: 'What is useMemo and useCallback? Where would you use them in JusBill?', a: `Both are React hooks for memoization (caching to avoid redundant recalculation).\n\n- useMemo: Memoizes the RESULT of a computation.\n- useCallback: Memoizes a FUNCTION REFERENCE.\n\nuseMemo example — expensive filter in ReportsPage:\n  const topProducts = useMemo(() => {\n    return invoices.flatMap(inv => inv.items).reduce(...).sort(...).slice(0, 5);\n  }, [invoices]); // Recalculates only when invoices changes\n\nuseCallback — stable function reference for child component that won't re-render unnecessarily with React.memo.` },
    ]
  },
  {
    title: 'Section 2 — Node.js & Express Backend',
    color: '#059669',
    questions: [
      { q: 'Explain your Express app structure — why separate app.js and index.js?', a: `app.js sets up the Express application: middleware (CORS, cookie-parser, body-parser), database connection, and routes. It exports the configured app.\n\nindex.js is the entry point that imports the app and starts the HTTP server: app.listen(PORT, ...).\n\nWhy separate?\n1. Testing: Import app.js in test files without starting the server.\n2. Flexibility: The same app can be used by different runners (HTTP server, HTTPS, serverless).\n3. Clarity: App setup logic is distinct from server startup logic.` },
      { q: 'How does JWT authentication work in your backend?', a: `Login flow:\n1. Client sends POST /api/auth/login with email + password.\n2. Backend finds the user, verifies password with bcryptjs.compare().\n3. Creates a JWT: jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" }).\n4. Sets the JWT as an HttpOnly cookie: res.cookie("token", jwt, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 7*24*60*60*1000 }).\n5. Returns the user object (without password).\n\nVerification flow:\n1. Every protected request passes through authMiddleware.\n2. Middleware reads: req.cookies.token.\n3. Verifies with jwt.verify(token, JWT_SECRET).\n4. Attaches req.user with decoded payload.\n5. Calls next() if valid, returns 401 if not.\n\nWhy HttpOnly cookies? They cannot be accessed by JavaScript — immune to XSS attacks.` },
      { q: 'What is CORS and why was it critical in your project?', a: `CORS (Cross-Origin Resource Sharing) is a browser security mechanism that blocks web pages from making requests to a different domain.\n\nIn JusBill: The frontend (jusbill.online) needs to make API calls to the backend. Without CORS configured, the browser blocks these requests.\n\nConfiguration: app.use(cors({ origin: allowedOrigins, credentials: true }));\n\ncredentials: true is required when using cookies — without it, browsers won't send cookies on cross-origin requests.\n\nKey lesson: When using credentials: true, you cannot use origin: "*". You must specify exact origins.` },
      { q: 'What does express.json({ limit: "50mb" }) mean and why 50MB?', a: `express.json() is middleware that parses incoming JSON request bodies and populates req.body. The limit option sets the maximum request body size.\n\nWhy 50MB? JusBill allows users to upload:\n- Company logos (base64 encoded)\n- UPI QR code images (base64 encoded)\n\nBase64 encoding increases file size by ~33%. A 5MB image becomes ~6.7MB in base64. With multiple images potentially sent in one request, 50MB gives sufficient headroom.\n\nexpress.urlencoded({ extended: true }) handles form-encoded data. extended: true allows nested objects using the qs library.` },
      { q: 'How does cookie-parser work and why is it needed?', a: `cookie-parser is Express middleware that parses the Cookie header in incoming requests and populates req.cookies as a plain object.\n\nWithout cookie-parser: req.cookies is undefined — you'd have to manually parse the raw Cookie header string.\n\nWith cookie-parser:\n  // Cookie: token=eyJhbGc...\n  req.cookies.token  // "eyJhbGc..."\n\nIt also handles signed cookies (with req.signedCookies) when a secret is provided.` },
      { q: 'Explain how multer and multer-storage-cloudinary work together.', a: `Multer is Express middleware for handling multipart/form-data (file uploads).\n\nmulter-storage-cloudinary is a Multer storage engine that uploads files directly to Cloudinary instead of saving to disk.\n\nFlow:\n1. User uploads a file (e.g., logo) from the frontend.\n2. Multer intercepts the multipart request.\n3. CloudinaryStorage pipes the file stream directly to Cloudinary's API.\n4. Cloudinary stores the file and returns a URL.\n5. The Cloudinary URL is saved to MongoDB (e.g., user.logoUrl).\n\nCode:\n  const storage = new CloudinaryStorage({ cloudinary, params: { folder: "jusbill" }});\n  const upload = multer({ storage });\n  router.post("/upload", upload.single("logo"), handler);` },
      { q: 'How do you handle errors globally in your Express app?', a: `Each route handler uses try/catch:\n  try {\n    const data = await Model.find(...);\n    res.json(data);\n  } catch (err) {\n    res.status(500).json({ message: err.message });\n  }\n\nBetter practice (what could be improved):\nA global error handler middleware at the bottom of app.js:\n  app.use((err, req, res, next) => {\n    const status = err.status || 500;\n    res.status(status).json({ message: err.message });\n  });\n\nThen in route handlers: next(err) instead of inline error responses.` },
      { q: 'What is nanoid and where did you use it?', a: `nanoid generates random, URL-safe unique IDs that are smaller and faster than UUIDs. Default output: 21 character string like V1StGXR8_Z5jdHi6B-myT.\n\nUsage in JusBill: Used to generate unique, short invoice numbers or Shop IDs. Unlike MongoDB's ObjectId (24 hex chars), nanoid generates human-readable, URL-friendly IDs that look better in URLs like /shop/V1StGXR8_Z5jdHi6B-myT.\n\nThe nanoid v5 package is ESM-only (hence "type": "module" in package.json).` },
      { q: 'What is pdfkit and how does server-side PDF generation work?', a: `pdfkit is a Node.js PDF generation library that creates PDFs programmatically using a document API.\n\nFlow in JusBill:\n1. Route receives a request to generate/email an invoice PDF.\n2. Creates a PDFDocument instance.\n3. Calls methods like doc.fontSize(20).text("Invoice #123", 50, 50) to position text.\n4. Adds tables for line items, calculates totals, adds company logo.\n5. Pipes the document to a buffer: doc.pipe(buffer).\n6. The buffer is attached to an email via Nodemailer.\n\nDifference from html2pdf.js: pdfkit creates REAL text-based PDFs (searchable, copy-pasteable, smaller file size).` },
      { q: 'How does Nodemailer work in your project?', a: `Nodemailer is a Node.js module for sending emails.\n\nSetup in JusBill:\n  const transporter = nodemailer.createTransport({\n    service: "gmail",\n    auth: { user: process.env.EMAIL_USER, pass: process.env.APP_PASSWORD }\n  });\n\nAPP_PASSWORD is a Google App Password (not your regular Gmail password) — required when 2FA is enabled.\n\nSending flow:\n  await transporter.sendMail({\n    from: process.env.EMAIL_USER,\n    to: customer.email,\n    subject: "Your Invoice from JusBill",\n    html: "<h1>Invoice</h1>...",\n    attachments: [{ filename: "invoice.pdf", content: pdfBuffer }]\n  });` },
      { q: 'What is Groq and how did you integrate the AI chat feature?', a: `Groq is an AI inference platform that provides ultra-fast LLM APIs. It runs models like LLaMA 3 at speeds significantly faster than OpenAI.\n\nIntegration in JusBill:\n1. User sends a message in the chat interface.\n2. Frontend POSTs to POST /api/chat.\n3. Backend fetches the user's business data (recent invoices, products, top sellers).\n4. Constructs a system prompt: "You are a business assistant for JusBill. The user's top product is X, total sales this month are ₹Y..."\n5. Calls Groq API with the system context + user message.\n6. Returns the AI response to the frontend.\n\nWhy Groq over OpenAI? Groq's inference speed is 10-20x faster — crucial for a chat interface where latency matters.` },
      { q: 'How does Redis (Upstash) work in your project?', a: `Upstash is a serverless Redis service with an HTTP-based API.\n\nUsage in JusBill: Used for caching API responses that don't change frequently.\n\n  // Cache set\n  await redis.set("products:userId", JSON.stringify(products), { ex: 300 }); // 5 min TTL\n\n  // Cache get\n  const cached = await redis.get("products:userId");\n  if (cached) return res.json(JSON.parse(cached));\n\nWhy Upstash? Traditional Redis requires a persistent connection which doesn't work well in containerized environments. Upstash's HTTP API works everywhere.` },
      { q: 'What is "type": "module" in your backend package.json?', a: `Setting "type": "module" tells Node.js to treat all .js files as ES Modules (import/export) instead of CommonJS (require/module.exports).\n\nImplications:\n- Must use import x from "y" instead of const x = require("y").\n- Must use import.meta.url instead of __dirname or __filename.\n- Cannot use require() directly.\n- All imports need explicit file extensions in some cases.\n\nWhy ES Modules? Modern JavaScript standard, better static analysis, tree-shaking, and compatibility with packages like nanoid v5 that are ESM-only.` },
      { q: 'How do you prevent MongoDB injection attacks?', a: `MongoDB injection occurs when user-supplied objects are used in queries. Example: if req.body.email is { $gt: "" }, it matches all users.\n\nPrevention in JusBill:\n1. Mongoose schema validation: A field typed as String rejects objects — { $gt: "" } won't be stored as a query operator.\n2. Explicit field selection: Route handlers explicitly pick fields from req.body: const { email, password } = req.body.\n3. express-mongo-sanitize (best practice enhancement): A middleware that strips $ and . from request bodies.` },
      { q: 'What is the health check route and why does it exist?', a: `app.get("/health", (req, res) => {\n  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });\n});\n\nThe /health endpoint serves:\n1. Docker health checks: Docker uses HEALTHCHECK CMD curl -f http://localhost:5000/health to determine if a container is ready to serve traffic.\n2. Load balancer health checks: AWS ALB pings this endpoint to decide if traffic should be routed to this instance.\n3. Monitoring: Uptime monitoring services (UptimeRobot) hit this endpoint to alert when the service goes down.\n4. Deployment verification: After deploying, curl https://jusbill.online/api/health instantly confirms the backend is live.` },
      { q: 'How does session/cookie expiry work in your project?', a: `When the JWT cookie is set:\n  res.cookie("token", jwt, {\n    httpOnly: true,\n    secure: process.env.NODE_ENV === "production",\n    sameSite: "strict",\n    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms\n  });\n\n- maxAge sets the cookie to expire after 7 days.\n- The JWT itself also has expiresIn: "7d" — so even if the cookie persists, the JWT will be invalid after 7 days.\n- On logout: res.clearCookie("token") removes the cookie immediately.\n- Both cookie expiry and JWT expiry must align — a mismatch can create security holes.` },
      { q: 'What is sameSite: "strict" on the cookie?', a: `SameSite controls when cookies are sent on cross-site requests:\n\n- Strict: Cookie is ONLY sent if the request originates from the same site. Prevents CSRF entirely but breaks OAuth flows and links from external sites.\n- Lax: Cookie is sent on same-site requests AND on top-level navigations from external sites (clicking a link). Good balance.\n- None: Cookie is sent on all requests. Requires Secure: true.\n\nIn JusBill: sameSite: "strict" provides maximum CSRF protection since JusBill doesn't rely on third-party auth flows.` },
      { q: 'What is bcryptjs and how does it work?', a: `bcryptjs is a JavaScript implementation of the bcrypt hashing algorithm for secure password storage.\n\nHow bcrypt works:\n1. Generates a random salt (e.g., 10 rounds means 2^10 = 1024 iterations).\n2. Hashes the password + salt through the bcrypt algorithm.\n3. The salt is embedded in the hash output: $2b$10$[22-char-salt][31-char-hash].\n\nWhy bcrypt over SHA/MD5?\n- Adaptive: The cost factor can be increased as hardware gets faster — future-proof.\n- Slow by design: Intentionally slow to make brute force attacks computationally expensive.\n- Salted: Different salt per password — identical passwords produce different hashes.\n\nIn JusBill:\n  const hashed = await bcrypt.hash(password, 10);\n  const match = await bcrypt.compare(plaintext, hashed);` },
      { q: 'What is the difference between 403 Forbidden and 401 Unauthorized?', a: `- 401 Unauthorized: The request lacks valid authentication. The server doesn't know who you are. Solution: Log in.\n- 403 Forbidden: The server knows who you are (authenticated) but you don't have permission. Solution: Get the right permissions.\n\nIn JusBill:\n- No token → 401: "You're not logged in."\n- Logged in but trying to access another user's invoice → 403: "You don't have access to this."` },
      { q: 'How do you ensure one user cannot access another user\'s data?', a: `Every database query scopes to the authenticated user's ID:\n\n  // Instead of: Product.find()  ← returns ALL products\n  const products = await Product.find({ userId: req.user.userId }); // ← only this user's\n\nreq.user.userId is populated by authMiddleware from the verified JWT. So:\n1. User A's JWT contains { userId: "A_id" }.\n2. All queries filter by userId: "A_id".\n3. Even if User A guesses an invoice ID belonging to User B, the query Invoice.findOne({ _id: invoiceId, userId: "A_id" }) returns null.\n\nThis tenant isolation at the query level is the core data security mechanism.` },
      { q: 'What is the difference between res.json() and res.send() in Express?', a: `- res.json(data): Sets Content-Type: application/json, serializes the data with JSON.stringify(), and sends the response. Handles undefined correctly (sends null).\n\n- res.send(data): Sends data as-is. If given an object, behaves like res.json(). If given a string, it sends text/html. More flexible but less explicit.\n\nBest practice: Use res.json() for API responses — it's explicit about the format and always sets the correct content type.` },
    ]
  },
  {
    title: 'Section 3 — MongoDB & Database',
    color: '#D97706',
    questions: [
      { q: 'Why did you choose MongoDB over a relational database like PostgreSQL?', a: `Reasons for MongoDB in JusBill:\n\n1. Document model suits invoices: An invoice naturally contains nested line items, customer info, and tax breakdowns — representing this as JSON is more natural than normalizing across 5+ SQL tables.\n2. Schema flexibility: GST fields vary by business type. MongoDB's flexible schema allows different invoice structures without ALTER TABLE migrations.\n3. JavaScript native: MongoDB stores BSON (Binary JSON) — working with MongoDB data in Node.js feels natural.\n4. Mongoose ODM: Provides schema validation, virtuals, and middleware even on a schema-less database.\n5. Scale: MongoDB scales horizontally with sharding.\n\nWhen PostgreSQL would be better: Complex multi-table joins with strict ACID compliance, or heavy analytical queries.` },
      { q: 'What is Mongoose and what does it add over the MongoDB driver?', a: `Mongoose is an ODM (Object Document Mapper) for MongoDB in Node.js.\n\nWhat Mongoose adds:\n1. Schema definition: Define document structure, types, and constraints.\n2. Validation: Built-in validators (required, min, max, enum) and custom validators.\n3. Middleware (hooks): pre("save") hooks (e.g., hash password before saving), post("find") hooks.\n4. Virtuals: Computed properties not stored in DB.\n5. Population: Model.findOne().populate("customer") replaces ObjectId references with full documents (like a JOIN).\n6. Query building: Chainable query API: Product.find().where("stock").lt(5).select("name stock").\n7. Timestamps: { timestamps: true } auto-adds createdAt and updatedAt.` },
      { q: 'What are MongoDB ObjectIds and why does Mongoose use them as default _id?', a: `MongoDB ObjectId is a 12-byte BSON type composed of:\n- 4 bytes: Unix timestamp (seconds)\n- 5 bytes: Random value (machine + process unique)\n- 3 bytes: Incrementing counter\n\nProperties:\n- Globally unique without coordination between servers.\n- Sortable by creation time (first 4 bytes are timestamp).\n- Compact: 12 bytes vs 36-char UUID.\n\nMongoose auto-generates _id as ObjectId for every document. The timestamp embedded in ObjectId means you can get document creation time from _id.getTimestamp() without a separate createdAt field.` },
      { q: 'What is connectTimeoutMS and serverSelectionTimeoutMS in your DB config?', a: `mongoose.connect(MONGO_URI, {\n  connectTimeoutMS: 20000,\n  socketTimeoutMS: 45000,\n  serverSelectionTimeoutMS: 20000\n});\n\n- connectTimeoutMS: 20000 — How long the driver waits for an initial TCP connection to MongoDB. After 20 seconds without a TCP handshake, it throws a timeout error.\n- socketTimeoutMS: 45000 — How long the driver waits for a response after sending a query. If MongoDB doesn't respond in 45 seconds, the socket is closed.\n- serverSelectionTimeoutMS: 20000 — How long the driver waits for a suitable server in the topology.\n\nThese prevent the Node process from hanging indefinitely if MongoDB is unreachable on cold start.` },
      { q: 'How do you index your MongoDB collections for performance?', a: `Indexes allow the database engine to find documents without scanning the entire collection.\n\nIn JusBill, key indexes would be:\n  // Products — query by userId frequently\n  ProductSchema.index({ userId: 1 });\n\n  // Invoices — query by userId AND date range\n  InvoiceSchema.index({ userId: 1, createdAt: -1 });\n\n  // Customers — search by name or mobile\n  CustomerSchema.index({ userId: 1, name: "text", mobile: 1 });\n\nWithout indexes, MongoDB does a collection scan (reads every document). With indexes on userId, it uses an index scan — O(log n) instead of O(n).\n\n_id is indexed automatically by MongoDB on every collection.` },
      { q: 'What is populate() in Mongoose and when would you use it?', a: `populate() performs a secondary query to replace ObjectId references with actual document data — similar to a SQL JOIN.\n\nExample:\n  const invoice = await Invoice.findById(id).populate("customer");\n  // invoice.customer is now the full Customer object, not just the ID\n\nIn JusBill: Used when generating invoice PDFs or sending emails — the invoice needs customer name, email, address, and GSTIN, not just their ID.\n\nPerformance note: populate() executes a separate query for each reference. For bulk operations, use aggregation $lookup instead which handles it in one query.` },
      { q: 'What is lean() in Mongoose and when should you use it?', a: `By default, Mongoose returns Mongoose Documents — full objects with methods like .save(), .toObject(), .populate(), getters/setters, etc.\n\n.lean() returns PLAIN JavaScript objects instead, skipping Mongoose document overhead.\n\nBenefits: 2-5x faster queries, lower memory usage.\n\nUse when: You only need to read data and don't need Mongoose document methods (most GET routes).\nDon't use when: You need to modify and save the document (PUT/PATCH routes).\n\n  // Mongoose Document (heavy)\n  const products = await Product.find({ userId });\n\n  // Plain JS object (fast)\n  const products = await Product.find({ userId }).lean();` },
      { q: 'How would you handle pagination in your API?', a: `Offset-based pagination (simpler, used in JusBill):\n  const page = parseInt(req.query.page) || 1;\n  const limit = parseInt(req.query.limit) || 20;\n  const skip = (page - 1) * limit;\n  const [items, total] = await Promise.all([\n    Invoice.find({ userId }).skip(skip).limit(limit),\n    Invoice.countDocuments({ userId })\n  ]);\n  res.json({ items, total, page, totalPages: Math.ceil(total / limit) });\n\nCursor-based (better for large datasets):\n  const query = cursor ? { _id: { $gt: cursor }, userId } : { userId };\n  const items = await Invoice.find(query).limit(20).sort({ _id: 1 });\n  const nextCursor = items.length === 20 ? items[items.length-1]._id : null;` },
      { q: 'What is ACID and does MongoDB support it?', a: `ACID stands for:\n- Atomicity: A transaction either completes fully or not at all.\n- Consistency: Database moves from one valid state to another.\n- Isolation: Concurrent transactions don't interfere with each other.\n- Durability: Committed transactions survive crashes.\n\nMongoDB ACID support:\n- Document-level atomicity: A single document write is always atomic.\n- Multi-document transactions: Since MongoDB 4.0+, full ACID transactions across multiple documents/collections are supported.\n\nIn JusBill: When creating an invoice that deducts stock, a transaction ensures consistency — if the stock update fails, the invoice is not created.` },
      { q: 'What would you do if MongoDB Atlas goes down?', a: `Short-term mitigation:\n1. The app catches the connection error and returns 503 from routes.\n2. Frontend shows a generic error state.\n3. connectTimeoutMS and serverSelectionTimeoutMS prevent indefinite hangs.\n\nLonger-term strategies:\n1. Atlas built-in HA: Atlas clusters are replica sets (3 nodes). If primary goes down, a secondary is elected within seconds — zero downtime.\n2. Retryable writes: Mongoose/driver automatically retries failed writes on transient errors.\n3. Circuit breaker pattern: After N consecutive failures, stop hitting MongoDB and return cached data.\n4. Redis cache layer: Critical read paths serve from Redis cache if MongoDB is unavailable.` },
    ]
  },
  {
    title: 'Section 4 — Docker & DevOps',
    color: '#7C3AED',
    questions: [
      { q: 'Explain your Docker setup — what does docker-compose.yml do?', a: `Docker Compose defines and runs multi-container applications from a single YAML file.\n\nIn JusBill's docker-compose.yml:\n  services:\n    backend-prod:\n      build: ./backend\n      ports: ["5000:5000"]\n      env_file: .env\n    frontend-prod:\n      build: ./frontend\n      ports: ["80:80"]\n      depends_on: [backend-prod]\n\n- backend-prod: Builds from backend/Dockerfile, runs Node, exposes port 5000.\n- frontend-prod: Builds from frontend/Dockerfile, runs Nginx serving the built React app, exposes port 80.\n- depends_on: Ensures backend starts before frontend.\n- env_file: Injects environment variables from .env into the container.\n\nCommands:\n- docker compose up -d --build: Build images and start in detached mode.\n- docker compose down: Stop and remove containers.\n- docker compose logs backend-prod: View backend logs.` },
      { q: 'What is a multi-stage Docker build and why did you use it for the frontend?', a: `A multi-stage build uses multiple FROM instructions in one Dockerfile. Each stage can copy files from previous stages.\n\nYour frontend Dockerfile:\n  # Stage 1: Build\n  FROM node:20-alpine AS base\n  WORKDIR /app\n  COPY package*.json ./\n  RUN npm install\n\n  FROM base AS builder\n  COPY . .\n  ARG VITE_API_URL\n  ENV VITE_API_URL=$VITE_API_URL\n  RUN npm run build\n\n  # Stage 2: Serve\n  FROM nginx:stable-alpine AS production\n  COPY --from=builder /app/dist /usr/share/nginx/html\n  EXPOSE 80\n  CMD ["nginx", "-g", "daemon off;"]\n\nWhy multi-stage?\n- Final image only contains dist/ folder and Nginx — NO Node.js, no node_modules.\n- Result: Final image is ~25MB instead of ~500MB.\n- Security: Attack surface is minimal — no compiler or package manager in production.` },
      { q: 'How does Nginx serve your React app and proxy API requests?', a: `server {\n  listen 80;\n  root /usr/share/nginx/html;\n  index index.html;\n\n  # SPA fallback — all unknown routes return index.html\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n\n  # Proxy API calls to backend\n  location /api/ {\n    proxy_pass http://backend:5000/;\n    proxy_set_header Host $host;\n    proxy_set_header X-Real-IP $remote_addr;\n  }\n}\n\ntry_files $uri $uri/ /index.html: When someone navigates to jusbill.online/dashboard, Nginx looks for file/directory named "dashboard", doesn't find it, and falls back to index.html. React Router then handles the route client-side. Without this, direct URL navigations return 404.\n\nproxy_pass http://backend:5000/: Docker's internal DNS resolves "backend" to the backend container's IP.` },
      { q: 'What is VITE_API_URL and how does it get into the Docker build?', a: `Vite reads environment variables prefixed with VITE_ and embeds them into the JavaScript bundle at BUILD TIME (not runtime like Node.js process.env).\n\nIn Docker:\n  ARG VITE_API_URL\n  ENV VITE_API_URL=$VITE_API_URL\n  RUN npm run build\n\n  # docker-compose.yml\n  services:\n    frontend-prod:\n      build:\n        args:\n          VITE_API_URL: https://jusbill.online/api\n\nImportant: Unlike backend env vars, VITE_API_URL is baked into the bundle — changing it requires a rebuild. It's also VISIBLE in the browser — don't put secrets here.` },
      { q: 'What is EC2 and why did you deploy there?', a: `Amazon EC2 (Elastic Compute Cloud) is an AWS service that provides virtual servers in the cloud.\n\nWhy EC2 for JusBill:\n1. Full control: Unlike PaaS (Heroku, Railway), EC2 gives root access to configure Nginx, Docker, SSL, firewall rules, etc.\n2. Cost-effective: The free tier (t2.micro) provides 750 hours/month free — sufficient for a small-scale app.\n3. Docker support: EC2 runs any Docker image — perfect for containerized deployments.\n4. Persistent storage: Unlike serverless, the container stays running — no cold starts for MongoDB connections.\n\nSetup steps: Launch instance → SSH in → Install Docker → Clone repo → docker compose up -d.` },
      { q: 'What is an EC2 Security Group and how did you configure it?', a: `An EC2 Security Group acts as a virtual firewall controlling inbound and outbound traffic at the instance level.\n\nIn JusBill's EC2 setup, inbound rules:\n  Port 22  | TCP | Your IP     | SSH access\n  Port 80  | TCP | 0.0.0.0/0  | HTTP traffic\n  Port 443 | TCP | 0.0.0.0/0  | HTTPS traffic\n  Port 5000| TCP | VPC only    | Backend API (internal only)\n\nKey security point: Port 5000 (backend) should NOT be open to the public. Only Nginx (port 80/443) should be public. Nginx proxies API calls internally. This way, the backend is never directly accessible from the internet.` },
      { q: 'How does SSL/HTTPS work on your domain?', a: `HTTPS is implemented using Let's Encrypt free SSL certificates with Certbot.\n\nSteps:\n1. Install Certbot on EC2: sudo apt install certbot python3-certbot-nginx.\n2. Obtain certificate: sudo certbot --nginx -d jusbill.online -d www.jusbill.online.\n3. Certbot automatically modifies Nginx config to add SSL certificate paths and HTTPS server block (port 443).\n4. Certbot sets up a cron job to auto-renew certificates every 90 days.\n\nAfter this, all traffic to http://jusbill.online is redirected to https://jusbill.online.` },
      { q: 'What is .dockerignore and why is it important?', a: `.dockerignore tells Docker which files/directories to exclude when building the context.\n\nTypical entries:\n  node_modules/\n  .env\n  .git/\n  *.log\n  dist/\n\nWhy important:\n1. Speed: node_modules can be hundreds of MB. Excluding it prevents sending it to the daemon (the Dockerfile runs npm install inside the container anyway).\n2. Security: .env files containing secrets are excluded — they should never be baked into images.\n3. Correctness: The .git folder is large and irrelevant to the running application.` },
      { q: 'What happens when you run docker compose up -d --build on EC2?', a: `Step by step:\n1. --build: Forces rebuilding all images from their Dockerfiles.\n2. Docker reads docker-compose.yml and processes each service.\n3. For backend-prod: Runs backend Dockerfile — installs npm deps, copies source, sets CMD ["node", "index.js"].\n4. For frontend-prod: Runs multi-stage frontend Dockerfile — npm install, npm run build (with env vars), copies dist/ to Nginx's HTML directory.\n5. -d: Starts containers in detached mode (background). Terminal returns immediately.\n6. Containers start, Docker creates an internal network connecting them.\n7. backend and frontend can communicate using service names as hostnames.\n8. Port mappings expose ports to the host (80:80 for Nginx).` },
      { q: 'How would you roll back a bad deployment on EC2?', a: `With Git:\n  # Revert to the last working commit\n  git revert HEAD  # Creates a new commit undoing the last one\n  git push\n  # Re-deploy\n  docker compose up -d --build\n\n  # Or hard reset (destructive)\n  git reset --hard HEAD~1\n  git push --force\n  docker compose up -d --build\n\nWith Docker image tags (best practice):\n  docker build -t jusbill-backend:$(git rev-parse --short HEAD) .\n  # Roll back to previous tagged image:\n  docker run -d --name backend jusbill-backend:previous-sha\n\nBest practice: Tag Docker images with Git commit SHA so you can roll back to any previous version.` },
      { q: 'What is "daemon off" in the Nginx CMD?', a: `CMD ["nginx", "-g", "daemon off;"]\n\nBy default, Nginx starts as a daemon (background process). When the foreground process exits, Docker considers the container stopped.\n\nIf Nginx daemonizes itself, the foreground process (the Docker CMD) exits immediately, and Docker stops the container — even though Nginx is running in the background.\n\ndaemon off forces Nginx to run in the foreground, keeping the container alive as long as Nginx is running. This is the correct mode for Docker containers.` },
      { q: 'What is node:20-slim vs node:20-alpine? Which did you use for the backend and why?', a: `Both are minimal Node.js images:\n- node:20-alpine: ~60MB. Based on Alpine Linux (musl libc). Smallest option. May have compatibility issues with native modules that expect glibc.\n- node:20-slim: ~200MB. Based on Debian with most packages removed. Uses glibc. Better compatibility with native Node.js modules.\n\nIn JusBill:\n- Backend uses node:20-slim — safer for native modules like bcryptjs, pdfkit, and any C++ addons.\n- Frontend builder uses node:20-alpine — only used to run npm run build, no native modules needed.` },
      { q: 'What would you add to make this deployment production-grade?', a: `Current gaps and improvements:\n\n1. CI/CD Pipeline (GitHub Actions): Auto-build and deploy on every push to main. Zero manual SSH.\n2. Nginx rate limiting: limit_req_zone to prevent API abuse and DDoS.\n3. Centralized logging: Ship Docker logs to AWS CloudWatch or Logtail.\n4. Environment secrets management: AWS Secrets Manager instead of .env files.\n5. CDN (CloudFront): Serve static frontend assets from CDN edge nodes for lower latency globally.\n6. Database backups: MongoDB Atlas automated backups with point-in-time recovery.\n7. HTTPS everywhere: Redirect HTTP to HTTPS at Nginx level.\n8. Monitoring + Alerting: AWS CloudWatch alarms or UptimeRobot for downtime alerts.\n9. Health check retries: Docker HEALTHCHECK with retry logic.\n10. React Query: Replace manual useEffect + axios patterns with TanStack Query for caching.` },
    ]
  },
  {
    title: 'Section 5 — System Design & Architecture',
    color: '#DC2626',
    questions: [
      { q: 'Explain your app\'s architecture from a 10,000-foot view.', a: `User Browser\n    │ HTTPS (port 443)\n    ▼\nNginx (Docker container, port 80/443)\n    │\n    ├─── Static files ──► React SPA (index.html + JS bundle)\n    │\n    └─── /api/* → proxy ──► Node.js/Express (port 5000)\n                                  │\n                 ┌────────────────┼────────────────────┐\n                 ▼                ▼                     ▼\n            MongoDB Atlas    Cloudinary          Upstash Redis\n            (data store)     (media store)       (cache)\n\n                         Groq API    Nodemailer/Gmail\n\nRequest flow:\n1. Browser hits jusbill.online → Nginx serves index.html (React bundle).\n2. React renders, makes API calls to /api/*.\n3. Nginx proxies /api/* to Node.js on port 5000.\n4. Node validates JWT cookie, queries MongoDB, calls external services.\n5. Response flows back through Nginx to the browser.` },
      { q: 'Why is this a monorepo structure? What are the tradeoffs?', a: `A monorepo keeps frontend and backend in the same Git repository (bitztracker/).\n\nAdvantages:\n1. Single git clone to get the entire project.\n2. Atomic commits — one commit can change both frontend and backend for a feature.\n3. Easier to run locally with one docker compose up.\n4. Simpler CI/CD — one pipeline for everything.\n\nDisadvantages:\n1. Repository grows large over time.\n2. Teams working on different services can't have separate access controls.\n3. Build times increase — changing one file triggers rebuilds for everything.\n\nAlternatives: Polyrepo (separate repos), or Turborepo/Nx (monorepo tools with smart caching).` },
      { q: 'How would you scale JusBill to handle 100,000 users?', a: `Current bottlenecks at scale:\n1. Single EC2 instance — single point of failure.\n2. Single MongoDB connection pool.\n3. No caching layer for frequent reads.\n\nScaling strategy:\n1. Horizontal scaling: Run multiple backend containers behind an AWS ALB. Since JWT is stateless, horizontal scaling works without sticky sessions.\n2. Database: MongoDB Atlas auto-scales. Add read replicas for read-heavy workloads.\n3. Caching: Redis (Upstash) for product lists, user profiles — reduce DB load by 80%+.\n4. CDN: CloudFront for static assets — removes frontend traffic from EC2 entirely.\n5. Async processing: Invoice PDF generation and email sending in a background queue (BullMQ + Redis) — don't block the API response.\n6. Rate limiting: Nginx or Redis-based rate limiting per user IP.` },
      { q: 'What is the difference between authentication and authorization?', a: `- Authentication: "Who are you?" — Verifying identity. In JusBill: JWT cookie proves you are user X.\n- Authorization: "What can you do?" — Verifying permissions. In JusBill: User X can only access their own invoices.\n\nAuthentication in JusBill: authMiddleware verifies the JWT and populates req.user.\n\nAuthorization in JusBill: Every query includes userId: req.user.userId — data is scoped to the authenticated user automatically. No separate role-based access control (RBAC) since JusBill is single-tenant per user.\n\nFuture RBAC example: If JusBill added teams with Owner/Editor/Viewer roles, authorization would check: if (req.user.role !== "owner") return res.status(403).` },
      { q: 'How would you implement real-time notifications (e.g., low stock alerts)?', a: `Current implementation: Polling — NotificationBell fetches products on mount and on stock-changed event.\n\nBetter real-time approaches:\n\n1. Server-Sent Events (SSE) — best for notifications:\n  app.get("/api/notifications/stream", (req, res) => {\n    res.setHeader("Content-Type", "text/event-stream");\n    const send = (data) => res.write("data: " + JSON.stringify(data) + "\\n\\n");\n    // When stock changes, call send()\n  });\nSSE is one-directional (server → client), lightweight, HTTP-based.\n\n2. WebSockets (Socket.io): Bidirectional. Overkill for notifications but needed for live chat.\n\nSSE would be the best fit for JusBill's notification use case.` },
      { q: 'What is rate limiting and how would you implement it?', a: `Rate limiting restricts the number of requests a client can make in a time window — protecting against abuse, DDoS, and API scraping.\n\n1. Nginx level (simplest):\n  limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;\n  location /api/ {\n    limit_req zone=api burst=20 nodelay;\n  }\n\n2. Express middleware (express-rate-limit):\n  const limiter = rateLimit({ windowMs: 15*60*1000, max: 100 });\n  app.use("/api/", limiter);\n\n3. Redis-based (distributed, for multiple instances):\nUsing Upstash Redis to track request counts — works across multiple backend containers unlike in-memory solutions.` },
      { q: 'How would you handle file uploads securely?', a: `Security considerations for file uploads:\n\n1. File type validation — Check MIME type on the server:\n  if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {\n    return res.status(400).json({ message: "Only images allowed" });\n  }\n\n2. File size limit: Multer's limits: { fileSize: 5 * 1024 * 1024 } (5MB max).\n\n3. Store outside web root: In JusBill, files go to Cloudinary — completely separate from the server.\n\n4. Rename files: Never use original filenames. Use UUID or nanoid to prevent path traversal attacks.\n\n5. Virus scanning: For production, integrate with ClamAV or AWS Macie.\n\n6. Signed URLs: For private files, use Cloudinary's signed URLs that expire after a set time.` },
      { q: 'What is XSS and how does your app prevent it?', a: `XSS (Cross-Site Scripting): An attacker injects malicious JavaScript into your web page that runs in other users' browsers, stealing cookies or credentials.\n\nPrevention in JusBill:\n\n1. HttpOnly cookies: JWT is in an HttpOnly cookie — JavaScript cannot access it. Even if XSS occurs, the attacker cannot steal the auth token.\n\n2. React's automatic escaping: React escapes all values rendered via JSX ({user.name}) — it never renders raw HTML unless you explicitly use dangerouslySetInnerHTML.\n\n3. Content Security Policy (CSP): HTTP header restricting which scripts can run. Can be added in Nginx config.\n\n4. Input sanitization: Don't render user-supplied HTML. If you must, use DOMPurify to sanitize before rendering.` },
      { q: 'What is the difference between microservices and your monolithic architecture?', a: `JusBill architecture: A modular monolith — one backend process handles all features (auth, invoices, products, chat, reports), but code is organized into modules/routes.\n\n                 Monolith          Microservices\nDeployment:      One process        Many independent processes\nCommunication:   Function calls      HTTP/gRPC/message queues\nComplexity:      Simple             Very complex\nScaling:         Scale entire app    Scale individual services\nGood for:        Small-medium apps   Large teams, complex domains\n\nFor JusBill's scale: Monolith is the right choice. Microservices add significant operational overhead (service discovery, distributed tracing, network failures) that isn't justified until you have separate teams and genuinely independent scaling needs.` },
      { q: 'What is a CDN and how would it help JusBill?', a: `A CDN (Content Delivery Network) is a globally distributed network of servers that cache and serve content from locations geographically close to users.\n\nHow it would help JusBill:\n1. Static assets: The React bundle (JS, CSS), fonts, and images are served from the nearest edge node — a user in Mumbai gets the bundle from a Mumbai CDN node, not from EC2 in us-east-1.\n2. Reduced EC2 load: Static asset requests (which are 90% of traffic) never hit EC2.\n3. DDoS protection: CloudFront, Cloudflare absorb DDoS traffic at the edge.\n4. Caching: Immutable build assets (content-hashed filenames) can be cached indefinitely.\n\nSetup: Point domain to CloudFront. Serve static files from S3. Forward /api/* to EC2 backend.` },
    ]
  },
  {
    title: 'Section 6 — JavaScript & General Concepts',
    color: '#0891B2',
    questions: [
      { q: 'What is the event loop in Node.js and why does it matter for your backend?', a: `Node.js is single-threaded with a non-blocking event loop. Instead of creating a new thread per request, Node processes all I/O operations asynchronously:\n\n1. Call Stack: Executes synchronous code.\n2. Web APIs / libuv: Handles async operations (I/O, timers, network).\n3. Callback Queue: When async operations complete, callbacks are queued.\n4. Event Loop: Continuously checks if the call stack is empty, then moves callbacks from the queue to the stack.\n\nWhy it matters for JusBill:\n- MongoDB queries, Cloudinary uploads, Nodemailer sends are all async I/O.\n- While waiting for MongoDB to respond, Node can handle other requests — thousands of concurrent connections on a single thread.\n- Never block the event loop: Avoid synchronous file reads (fs.readFileSync), heavy CPU work, or infinite loops in route handlers.` },
      { q: 'What is async/await and how does it differ from .then()/.catch()?', a: `Both handle Promises, but async/await is syntactic sugar that makes async code look synchronous.\n\n// .then()/.catch()\ngetProducts()\n  .then(products => res.json(products))\n  .catch(err => res.status(500).json({ message: err.message }));\n\n// async/await (equivalent)\ntry {\n  const products = await getProducts();\n  res.json(products);\n} catch (err) {\n  res.status(500).json({ message: err.message });\n}\n\nAdvantages of async/await:\n- Easier to read (no callback nesting).\n- try/catch works naturally for error handling.\n- Easier to debug (stack traces are clearer).\n- Can use await in loops: for (const item of items) { await process(item); }` },
      { q: 'What is Promise.all() and when would you use it in your backend?', a: `Promise.all() takes an array of promises and resolves when ALL of them resolve, or rejects if ANY of them rejects.\n\nIn JusBill — fetching dashboard data:\n  // Sequential (slow — 3 round trips)\n  const invoices = await Invoice.find({ userId });\n  const products = await Product.find({ userId });\n  const customers = await Customer.find({ userId });\n\n  // Parallel (fast — 1 round trip)\n  const [invoices, products, customers] = await Promise.all([\n    Invoice.find({ userId }),\n    Product.find({ userId }),\n    Customer.find({ userId })\n  ]);\n\nRule of thumb: Use Promise.all() when multiple async operations are independent. Use sequential await when operation B needs results from operation A.` },
      { q: 'What is closure in JavaScript? Give an example from your codebase.', a: `A closure is a function that retains access to variables from its outer scope even after the outer function has returned.\n\nExample from JusBill's AuthContext:\n  const STORAGE_KEY = "jusbill_user"; // Outer scope variable\n\n  export function AuthProvider({ children }) {\n    const [user, setUser] = useState(null);\n\n    const login = async (data) => {\n      const res = await loginApi(data);\n      setUser(res.data.user);\n      localStorage.setItem(STORAGE_KEY, ...); // closure over STORAGE_KEY\n    };\n\n    const logout = async () => {\n      setUser(null);\n      localStorage.removeItem(STORAGE_KEY); // closure over STORAGE_KEY\n    };\n  }\n\nlogin and logout close over STORAGE_KEY and setUser from their outer scope. Even when called later (in a button's onClick), they still have access to those outer variables.` },
      { q: 'What is the difference between null, undefined, and "" in JavaScript?', a: `- undefined: A variable declared but not assigned, or a function that doesn't return a value. The JS engine's default for "no value."\n- null: An intentional absence of any value. Developer explicitly sets it. typeof null === "object" (a historical JS bug).\n- "": An empty string — a value, just empty. typeof "" === "string".\n\nIn JusBill context:\n- localStorage.getItem("non_existent") → null (key doesn't exist).\n- const { gst } = user where user.gst was never set → undefined.\n- user.shopName = "" → empty string (user cleared their shop name field).\n\nNullish coalescing: user.shopName ?? "My Shop" — returns right side only if left is null or undefined, not "".` },
      { q: 'What is event bubbling and how does it relate to your notification dropdown?', a: `Event bubbling: When an event fires on a DOM element, it "bubbles up" through parent elements, triggering their event handlers too.\n\nReact's synthetic events: React uses a single event listener on the document root (event delegation) instead of attaching listeners to individual elements. More performant for large lists.\n\nIn JusBill's notification dropdown:\n  useEffect(() => {\n    const handleClickOutside = (e) => {\n      if (!dropdownRef.current?.contains(e.target)) {\n        setShowNotifications(false);\n      }\n    };\n    document.addEventListener("mousedown", handleClickOutside);\n    return () => document.removeEventListener("mousedown", handleClickOutside);\n  }, []);\n\nThis uses event bubbling — clicks anywhere bubble up to document, where we check if they originated inside the dropdown.` },
      { q: 'What is the difference between == and === in JavaScript?', a: `- === (strict equality): Compares value AND type. No type coercion.\n- == (loose equality): Compares value after type coercion. Can produce surprising results.\n\n  0 == false       // true (both coerce to 0)\n  0 === false      // false (different types: number vs boolean)\n  "" == false      // true (both coerce to 0)\n  null == undefined  // true (special JS rule)\n  null === undefined // false\n\nBest practice: Always use ===. The only valid use of == is value == null (checks for both null and undefined simultaneously).\n\nIn JusBill: All comparisons use ===. ESLint eqeqeq rule enforces this.` },
      { q: 'What is the key prop in React and why is it important?', a: `key is a special prop that React uses to identify which items in a list have changed, been added, or removed. It must be unique among siblings.\n\nWhy it matters: React uses keys to reconcile the virtual DOM efficiently. Wrong keys cause bugs:\n\n  // Bad — index as key (causes stale state when list reorders)\n  {invoices.map((inv, index) => <InvoiceRow key={index} invoice={inv} />)}\n\n  // Good — stable unique ID as key\n  {invoices.map(inv => <InvoiceRow key={inv._id} invoice={inv} />)}\n\nIn AnimatePresence: key={location.pathname} tells Framer Motion that a different route = different component, triggering the exit/enter animations.` },
      { q: "What would you do differently if you rebuilt JusBill from scratch?", a: `This question shows self-awareness and growth:\n\n1. TypeScript: Add static typing from the start. Catch type errors at compile time. Better IDE autocomplete. Prevents whole classes of bugs.\n\n2. Global error handler: Centralized Express error middleware instead of try/catch in every route.\n\n3. Input validation middleware: Use zod or joi for request body validation on every route.\n\n4. Testing: Unit tests for critical business logic (GST calculation) and integration tests for API routes using jest + supertest.\n\n5. CI/CD pipeline: GitHub Actions to auto-test, build Docker images, and deploy to EC2 on every main push.\n\n6. React Query (TanStack Query): Replace manual useEffect + axios patterns for automatic caching and background refetching.\n\n7. Database transactions: Use MongoDB multi-document transactions when creating invoices.\n\n8. Proper logging: Use winston or pino instead of console.log — structured logs with levels, timestamps, and JSON output.` },
      { q: 'What is the difference between var, let, and const?', a: `           var          let          const\nScope:     Function     Block        Block\nHoisting:  Yes(undef)   Yes(TDZ)     Yes(TDZ)\nRe-decl:   Yes          No           No\nRe-assign: Yes          Yes          No\n\nTDZ (Temporal Dead Zone): let and const variables exist from the start of their block but cannot be accessed before their declaration line — accessing them throws ReferenceError.\n\nIn JusBill: const by default. let when reassignment is needed. var never used — legacy, function-scoped behavior causes subtle bugs.\n\nBest practice: Default to const. Use let only when you know the value will change. Never use var.` },
    ]
  }
];

// ──────────────────────────────────────────
// RENDER SECTIONS
// ──────────────────────────────────────────
let qNum = 0;

sections.forEach(section => {
  doc.addPage();

  // Section header
  doc.rect(0, 0, doc.page.width, 80).fill(section.color);
  doc.fillColor(WHITE).fontSize(22).font('Helvetica-Bold')
     .text(section.title, 50, 25, { width: pageWidth() });
  doc.fillColor('rgba(255,255,255,0.7)').fontSize(10).font('Helvetica')
     .text(`Questions ${qNum + 1}–${qNum + section.questions.length}`, 50, 55);

  let y = 100;

  section.questions.forEach((item, i) => {
    qNum++;
    const isEven = i % 2 === 0;

    // Check if we need a new page
    if (y > doc.page.height - 200) {
      doc.addPage();
      y = 60;
    }

    // Question number bubble
    doc.save()
       .circle(65, y + 10, 14).fill(section.color)
       .fillColor(WHITE).fontSize(9).font('Helvetica-Bold')
       .text(String(qNum), 58, y + 5, { width: 14, align: 'center' })
       .restore();

    // Question text
    doc.fillColor(DARK).fontSize(12).font('Helvetica-Bold')
       .text(`Q${qNum}. ${item.q}`, 88, y, { width: pageWidth() - 38 });

    y = doc.y + 8;

    // Check space before answer block
    if (y > doc.page.height - 150) {
      doc.addPage();
      y = 60;
    }

    // Answer background
    const answerHeight = Math.min(
      doc.heightOfString(item.a, { width: pageWidth() - 60, fontSize: 10 }) + 20,
      doc.page.height - y - 60
    );

    doc.roundedRect(50, y, pageWidth(), answerHeight + 20, 6)
       .fill(isEven ? '#F8FAFF' : '#F9FFF9');

    // Answer label
    doc.save()
       .roundedRect(58, y + 8, 40, 14, 3).fill(section.color + '22')
       .fillColor(section.color).fontSize(8).font('Helvetica-Bold')
       .text('ANS', 66, y + 11)
       .restore();

    // Answer text
    doc.fillColor('#374151').fontSize(9.5).font('Helvetica')
       .text(item.a, 110, y + 8, { width: pageWidth() - 65 });

    y = doc.y + 20;
    hr(y - 10);
  });
});

// ──────────────────────────────────────────
// FINAL PAGE — QUICK TIPS
// ──────────────────────────────────────────
doc.addPage();
doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0F172A');

doc.fillColor(INDIGO).fontSize(30).font('Helvetica-Bold')
   .text('Quick Interview Tips', 50, 60, { width: pageWidth() });
hr(100, INDIGO);

const tips = [
  ['Know your WHY', 'Every technical decision has a reason. Don\'t just say "I used MongoDB" — say WHY: flexible schema for nested invoice data, no complex joins needed.'],
  ['Talk about trade-offs', 'Show you considered alternatives. "I used JWT cookies over localStorage because HttpOnly cookies prevent XSS attacks."'],
  ['Admit improvements', 'Interviewers love self-awareness. "If I rebuilt this, I would add TypeScript and a global error handler from day one."'],
  ['System design matters', 'Be ready to draw the architecture on a whiteboard: Browser → Nginx → Node → MongoDB. Explain each hop.'],
  ['CORS is always asked', 'Understand CORS deeply: why it exists, how credentials:true works, why you can\'t use origin:"*" with cookies.'],
  ['Auth flow is critical', 'Be able to explain the entire auth flow: login → JWT → cookie → middleware → req.user → data scoping.'],
  ['Show you tested it', 'Mention specific bugs you fixed (like the AuthContext missing try block) — shows real experience, not just theory.'],
  ['DevOps basics', 'Know what Docker Compose does, why Nginx is needed (SPA fallback + reverse proxy), and what EC2 Security Groups are.'],
];

let ty2 = 120;
tips.forEach((tip, i) => {
  if (ty2 > doc.page.height - 100) return;
  doc.circle(62, ty2 + 8, 8).fill(INDIGO);
  doc.fillColor(WHITE).fontSize(8).font('Helvetica-Bold').text(String(i + 1), 59, ty2 + 5);
  doc.fillColor('#F1F5F9').fontSize(11).font('Helvetica-Bold').text(tip[0], 80, ty2, { width: pageWidth() - 30 });
  doc.fillColor('#94A3B8').fontSize(9.5).font('Helvetica').text(tip[1], 80, ty2 + 16, { width: pageWidth() - 30 });
  ty2 += doc.heightOfString(tip[1], { width: pageWidth() - 30, fontSize: 9.5 }) + 30;
});

doc.fillColor('#334155').fontSize(9).font('Helvetica')
   .text('Good luck with your interview! — JusBill Project Guide', 50, doc.page.height - 50, { width: pageWidth(), align: 'center' });

doc.end();

console.log('PDF generated at:', OUTPUT);
