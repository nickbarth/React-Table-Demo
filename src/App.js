import "./App.css";

import Header from "./components/Header";
import UserTable from "./components/UserTable";
import Footer from "./components/Footer";

import { PreferenceProvider } from "./context/PreferenceContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Header />
        <div className="container">
          <h2>Customers</h2>
          <PreferenceProvider>
            <UserTable />
          </PreferenceProvider>
        </div>
      </div>
      <Footer />
    </AuthProvider>
  );
}

export default App;
