import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import PrivateEvents from './pages/PrivateEvents';
import Eventos from './pages/Eventos';
import VIPReservations from './pages/VIPReservations';
import Contact from './pages/Contact';
import MisCuenta from './pages/MisCuenta';
import MisEntradas from './pages/MisEntradas';
import QRPage from './pages/QRPage';
import Configuracion from './pages/Configuracion';
import GestorMenu from './pages/GestorMenu';
import TicketSales from './pages/TicketSales';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentPending from './pages/PaymentPending';
import PaymentFailure from './pages/PaymentFailure';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from 'next-themes';
import { TabHistoryProvider } from '@/components/TabHistoryProvider';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}><PageTransition>{children}</PageTransition></Layout>
  : <PageTransition>{children}</PageTransition>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <LayoutWrapper currentPageName={mainPageKey}>
            <MainPage />
          </LayoutWrapper>
        } />
        {Object.entries(Pages).map(([path, Page]) => (
          <Route
            key={path}
            path={`/${path}`}
            element={
              <LayoutWrapper currentPageName={path}>
                <Page />
              </LayoutWrapper>
            }
          />
        ))}
        <Route path="/PrivateEvents" element={<LayoutWrapper currentPageName="PrivateEvents"><PrivateEvents /></LayoutWrapper>} />
        <Route path="/VIPReservations" element={<LayoutWrapper currentPageName="VIPReservations"><VIPReservations /></LayoutWrapper>} />
        <Route path="/Contact" element={<LayoutWrapper currentPageName="Contact"><Contact /></LayoutWrapper>} />
        <Route path="/MisCuenta" element={<LayoutWrapper currentPageName="MisCuenta"><MisCuenta /></LayoutWrapper>} />
        <Route path="/MisEntradas" element={<LayoutWrapper currentPageName="MisEntradas"><MisEntradas /></LayoutWrapper>} />
        <Route path="/QR" element={<LayoutWrapper currentPageName="QRPage"><QRPage /></LayoutWrapper>} />
        <Route path="/configuracion" element={<LayoutWrapper currentPageName="Configuracion"><Configuracion /></LayoutWrapper>} />
        <Route path="/gestor-menu" element={<LayoutWrapper currentPageName="GestorMenu"><GestorMenu /></LayoutWrapper>} />
        <Route path="/TicketSales" element={<LayoutWrapper currentPageName="TicketSales"><TicketSales /></LayoutWrapper>} />
        <Route path="/Eventos" element={<LayoutWrapper currentPageName="Eventos"><Eventos /></LayoutWrapper>} />
        <Route path="/payment/success" element={<LayoutWrapper currentPageName="PaymentSuccess"><PaymentSuccess /></LayoutWrapper>} />
        <Route path="/payment/pending" element={<LayoutWrapper currentPageName="PaymentPending"><PaymentPending /></LayoutWrapper>} />
        <Route path="/payment/failure" element={<LayoutWrapper currentPageName="PaymentFailure"><PaymentFailure /></LayoutWrapper>} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AnimatePresence>
  );
};


function App() {

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <TabHistoryProvider>
              <AuthenticatedApp />
            </TabHistoryProvider>
          </Router>
          <Toaster />
          <SonnerToaster position="top-center" richColors />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App