import { createBrowserRouter } from "react-router";
import Landing from "./screens/Landing";
import Login from "./screens/Login";
import Register from "./screens/Register";
import PrivacyPolicy from "./screens/PrivacyPolicy";
import Disclaimer from "./screens/Disclaimer";
import EmergencyConfirmation from "./screens/EmergencyConfirmation";
import NoEmergencySituation from "./screens/NoEmergencySituation";
import NoEmergencyQuestions from "./screens/NoEmergencyQuestions";
import NoEmergencyLocation from "./screens/NoEmergencyLocation";
import NoEmergencySummary from "./screens/NoEmergencySummary";
import ImportantDetails from "./screens/ImportantDetails";
import Profile from "./screens/Profile";
import { ErrorBoundary } from "./components/ErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: "/login",
    Component: Login,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: "/register",
    Component: Register,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: "/privacy",
    Component: PrivacyPolicy,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: "/disclaimer",
    Component: Disclaimer,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: "/emergency-confirmation",
    Component: EmergencyConfirmation,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: "/no-emergency-situation",
    Component: NoEmergencySituation,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: "/no-emergency-questions",
    Component: NoEmergencyQuestions,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: "/no-emergency-location",
    Component: NoEmergencyLocation,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: "/no-emergency-summary",
    Component: NoEmergencySummary,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: "/important-details",
    Component: ImportantDetails,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: "/profile",
    Component: Profile,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: "*",
    Component: Landing,
    ErrorBoundary: ErrorBoundary,
  },
]);