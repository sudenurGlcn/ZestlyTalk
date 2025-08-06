import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import HomePage from "./pages/Home.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import Login from "./pages/Login.jsx";
import Test from "./pages/Test.jsx";
import Scenarios from "./pages/Scenarios.jsx";
import Chatbot from "./pages/Chatbot.jsx";
import NewChat from "./pages/NewChat.jsx";
import ChatHistory from "./pages/ChatHistory.jsx";
import ChatAnalysis from "./pages/ChatAnalysis.jsx";
import ProgressReport from "./pages/ProgressReport.jsx";
import Profile from "./pages/Profile.jsx";
import Tests from "./pages/Tests.jsx";
import MentorAnalysis from "./pages/MentorAnalysis.jsx";
import AuthGuard from "./components/AuthGuard.jsx";
import TokenValidator from "./components/TokenValidator.jsx";
import './app.css';

function App() {
  return (
    <Provider store={store}>
      <TokenValidator />
      <Router>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <AuthGuard>
              <HomePage />
            </AuthGuard>
          } />
          <Route path="/test" element={
            <AuthGuard>
              <Test />
            </AuthGuard>
          } />
          <Route path="/scenarios" element={
            <AuthGuard>
              <Scenarios />
            </AuthGuard>
          } />
          <Route path="/new-chat" element={
            <AuthGuard>
              <NewChat />
            </AuthGuard>
          } />
          <Route path="/chat-history" element={
            <AuthGuard>
              <ChatHistory />
            </AuthGuard>
          } />
          <Route path="/chatbot/:scenarioId" element={
            <AuthGuard>
              <Chatbot />
            </AuthGuard>
          } />
          <Route path="/chat-analysis" element={
            <AuthGuard>
              <ChatAnalysis />
            </AuthGuard>
          } />
          <Route path="/progress-report" element={
            <AuthGuard>
              <ProgressReport />
            </AuthGuard>
          } />
          <Route path="/profile" element={
            <AuthGuard>
              <Profile />
            </AuthGuard>
          } />
          <Route path="/tests" element={
            <AuthGuard>
              <Tests />
            </AuthGuard>
          } />
          <Route path="/mentor-analysis" element={
            <AuthGuard>
              <MentorAnalysis />
            </AuthGuard>
          } />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
