// // src/App.jsx
// import { Routes, Route, useLocation } from "react-router-dom";
// import GetStarted from "./pages/GetStarted";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import DroneUpload from "./pages/DroneUpload";
// import ProfitCalculator from "./pages/ProfitCalculator";
// import ChatAssistant from "./pages/ChatAssistant";
// import FieldDetail from "./pages/FieldDetail"; // details page
// import Navbar from "./components/Navbar";
// import ChatFloat from "./components/ChatFloat";
// import ForgotPassword from "./pages/ForgotPassword";
// import RequestScan from "./pages/RequestScan";
// import LastScanReport from "./pages/LastScanReport";
// import Home from "./pages/Home";

// import bgField1 from "./assets/bg-field-1.jpg";
// import bgField2 from "./assets/bg-field-2.jpg";
// import bgField3 from "./assets/bg-field-3.jpg";
// import bgField4 from "./assets/bg-field-4.jpg";
// import bgField5 from "./assets/bg-field-5.jpg";

// const App = () => {
//   const location = useLocation();
//   const hideNavbarRoutes = ["/", "/login", "/signup", "/forgot-password"];

//   const showNavbar = !hideNavbarRoutes.includes(location.pathname);
//   const isPlainPage = hideNavbarRoutes.includes(location.pathname);

//   const path = location.pathname;
//   let bgImage = null;

//   if (!isPlainPage) {
//     if (path.startsWith("/home")) {
//       bgImage = bgField3;
//     } else if (path.startsWith("/upload") || path.startsWith("/request-scan")) {
//       bgImage = bgField5;
//     } else if (path.startsWith("/last-scan") || path.startsWith("/fields")) {
//       bgImage = bgField5;
//     } else if (path.startsWith("/profit")) {
//       bgImage = bgField4;
//     } else if (path.startsWith("/chat")) {
//       bgImage = bgField1;
//     } else {
//       bgImage = bgField2;
//     }
//   }

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       {!isPlainPage && bgImage && (
//         <>
//           <div
//             className="
//               absolute inset-0 -z-20
//               bg-cover bg-center
//               opacity-50
//               blur-sm
//               scale-105
//             "
//             style={{ backgroundImage: `url(${bgImage})` }}
//           />
//           <div className="absolute inset-0 -z-10 bg-black/25" />
//         </>
//       )}

//       {showNavbar && <Navbar />}

//       <main
//         className={
//           showNavbar ? "relative max-w-6xl mx-auto mt-4 mb-8" : ""
//         }
//       >
//         <Routes>
//           <Route path="/" element={<GetStarted />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />

//           <Route path="/home" element={<Home />} />
//           <Route path="/upload" element={<DroneUpload />} />
//           <Route path="/profit" element={<ProfitCalculator />} />
//           <Route path="/chat" element={<ChatAssistant />} />

//           {/* Field card → details */}
//           <Route path="/fields/:id" element={<FieldDetail />} />

//           {/* Scan flows */}
//           <Route path="/request-scan" element={<RequestScan />} />
//           <Route path="/last-scan" element={<LastScanReport />} />
//         </Routes>
//       </main>

//       {showNavbar && <ChatFloat />}
//     </div>
//   );
// };

// export default App;

// // src/App.jsx
// import { Routes, Route, useLocation, Navigate } from "react-router-dom";
// import { useAuth0 } from "@auth0/auth0-react";
// import { useEffect } from "react";
// import GetStarted from "./pages/GetStarted";
// import Login from "./pages/Login";
// import DroneUpload from "./pages/DroneUpload";
// import ProfitCalculator from "./pages/ProfitCalculator";
// import ChatAssistant from "./pages/ChatAssistant";
// import FieldDetail from "./pages/FieldDetail";
// import Navbar from "./components/Navbar";
// import ChatFloat from "./components/ChatFloat";
// import RequestScan from "./pages/RequestScan";
// import LastScanReport from "./pages/LastScanReport";
// import Home from "./pages/Home";
// import api, { setAuthToken } from "./api";

// import bgField1 from "./assets/bg-field-1.jpg";
// import bgField2 from "./assets/bg-field-2.jpg";
// import bgField3 from "./assets/bg-field-3.jpg";
// import bgField4 from "./assets/bg-field-4.jpg";
// import bgField5 from "./assets/bg-field-5.jpg";

// // Protected route wrapper
// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

//   if (isLoading) return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-900">
//       <p className="text-white text-lg">Loading...</p>
//     </div>
//   );

//   if (!isAuthenticated) {
//     loginWithRedirect();
//     return null;
//   }

//   return children;
// };

// const App = () => {
//   const location = useLocation();
//   const { isAuthenticated, getAccessTokenSilently } = useAuth0();

//   // Sync Auth0 token to axios + sync user to MongoDB
//   useEffect(() => {
//     const syncUser = async () => {
//       try {
//         const token = await getAccessTokenSilently();
//         setAuthToken(token);
//         await api.post("/api/auth/sync");
//       } catch (err) {
//         console.error("Sync error:", err);
//       }
//     };

//     if (isAuthenticated) syncUser();
//   }, [isAuthenticated]);

//   const hideNavbarRoutes = ["/", "/login", "/signup", "/forgot-password"];
//   const showNavbar = !hideNavbarRoutes.includes(location.pathname);
//   const isPlainPage = hideNavbarRoutes.includes(location.pathname);

//   const path = location.pathname;
//   let bgImage = null;

//   if (!isPlainPage) {
//     if (path.startsWith("/home")) bgImage = bgField3;
//     else if (path.startsWith("/upload") || path.startsWith("/request-scan")) bgImage = bgField5;
//     else if (path.startsWith("/last-scan") || path.startsWith("/fields")) bgImage = bgField5;
//     else if (path.startsWith("/profit")) bgImage = bgField4;
//     else if (path.startsWith("/chat")) bgImage = bgField1;
//     else bgImage = bgField2;
//   }

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       {!isPlainPage && bgImage && (
//         <>
//           <div
//             className="absolute inset-0 -z-20 bg-cover bg-center opacity-50 blur-sm scale-105"
//             style={{ backgroundImage: `url(${bgImage})` }}
//           />
//           <div className="absolute inset-0 -z-10 bg-black/25" />
//         </>
//       )}

//       {showNavbar && <Navbar />}

//       <main className={showNavbar ? "relative max-w-6xl mx-auto mt-4 mb-8" : ""}>
//         <Routes>
//           {/* Public routes */}
//           <Route path="/" element={<GetStarted />} />
//           <Route path="/login" element={<Login />} />

//           {/* Redirect old signup route to login (Auth0 handles signup) */}
//           <Route path="/signup" element={<Navigate to="/login" replace />} />
//           <Route path="/forgot-password" element={<Navigate to="/login" replace />} />

//           {/* Protected routes */}
//           <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
//           <Route path="/upload" element={<ProtectedRoute><DroneUpload /></ProtectedRoute>} />
//           <Route path="/profit" element={<ProtectedRoute><ProfitCalculator /></ProtectedRoute>} />
//           <Route path="/chat" element={<ProtectedRoute><ChatAssistant /></ProtectedRoute>} />
//           <Route path="/fields/:id" element={<ProtectedRoute><FieldDetail /></ProtectedRoute>} />
//           <Route path="/request-scan" element={<ProtectedRoute><RequestScan /></ProtectedRoute>} />
//           <Route path="/last-scan" element={<ProtectedRoute><LastScanReport /></ProtectedRoute>} />
//         </Routes>
//       </main>

//       {showNavbar && <ChatFloat />}
//     </div>
//   );
// };

// export default App;


// src/App.jsx
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import GetStarted from "./pages/GetStarted";
import Login from "./pages/Login";
import DroneUpload from "./pages/DroneUpload";

import ChatAssistant from "./pages/ChatAssistant";
import FieldDetail from "./pages/FieldDetail";
import Navbar from "./components/Navbar";
import ChatFloat from "./components/ChatFloat";
import RequestScan from "./pages/RequestScan";
import LastScanReport from "./pages/LastScanReport";
import Home from "./pages/Home";
import api, { setAuthToken } from "./api"; // ✅ import setAuthToken from api.js

import bgField1 from "./assets/bg-field-1.jpg";
import bgField2 from "./assets/bg-field-2.jpg";
import bgField3 from "./assets/bg-field-3.jpg";
// import bgField4 from "./assets/bg-field-4.jpg";
import bgField5 from "./assets/bg-field-5.jpg";

// ── Protected Route ──────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <p className="text-white text-lg">Loading...</p>
    </div>
  );

  if (!isAuthenticated) {
    loginWithRedirect();
    return null;
  }

  return children;
};

// ── App ──────────────────────────────────────────────────────
const App = () => {
  const location = useLocation();

  // ✅ Correct way - useAuth0 called inside component (not top level hook file)
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  // ✅ Sync Auth0 token to axios defaults + sync user to MongoDB
  useEffect(() => {
    if (!isAuthenticated) return;

    const syncUser = async () => {
  try {
    const token = await getAccessTokenSilently();
    console.log("✅ Token:", token ? "received" : "empty");
    setAuthToken(token);
    await api.post("/api/auth/sync");
    console.log("✅ Sync done");
  } catch (err) {
    console.error("Sync error:", err);
  }
};

    syncUser();
  }, [isAuthenticated, getAccessTokenSilently]); // ✅ added getAccessTokenSilently to deps

  const hideNavbarRoutes = ["/", "/login", "/signup", "/forgot-password"];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);
  const isPlainPage = hideNavbarRoutes.includes(location.pathname);

  const path = location.pathname;
  let bgImage = null;

  if (!isPlainPage) {
    if (path.startsWith("/home")) bgImage = bgField3;
    else if (path.startsWith("/upload") || path.startsWith("/request-scan")) bgImage = bgField5;
    else if (path.startsWith("/last-scan") || path.startsWith("/fields")) bgImage = bgField5;
    // else if (path.startsWith("/profit")) bgImage = bgField4;
    else if (path.startsWith("/chat")) bgImage = bgField1;
    else bgImage = bgField2;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {!isPlainPage && bgImage && (
        <>
          <div
            className="absolute inset-0 -z-20 bg-cover bg-center opacity-50 blur-sm scale-105"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div className="absolute inset-0 -z-10 bg-black/25" />
        </>
      )}

      {showNavbar && <Navbar />}

      <main className={showNavbar ? "relative max-w-6xl mx-auto mt-4 mb-8" : ""}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<GetStarted />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Navigate to="/login" replace />} />
          <Route path="/forgot-password" element={<Navigate to="/login" replace />} />

          {/* Protected */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><DroneUpload /></ProtectedRoute>} />
          {/* <Route path="/profit" element={<ProtectedRoute><ProfitCalculator /></ProtectedRoute>} /> */}
          <Route path="/chat" element={<ProtectedRoute><ChatAssistant /></ProtectedRoute>} />
          <Route path="/fields/:id" element={<ProtectedRoute><FieldDetail /></ProtectedRoute>} />
          <Route path="/request-scan" element={<ProtectedRoute><RequestScan /></ProtectedRoute>} />
          <Route path="/last-scan" element={<ProtectedRoute><LastScanReport /></ProtectedRoute>} />
        </Routes>
      </main>

      {showNavbar && <ChatFloat />}
    </div>
  );
};

export default App;



