import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import SignIn from "../pages/SignIn.jsx";
import SignUp from "../pages/SignUp.jsx";
import Overview from "../pages/Overview.jsx";
import Profile from "../pages/Profile.jsx";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer.jsx";
import AddExpense from "../pages/Expense/AddExpense.jsx";
import NotFound from "./components/NotFound";
import ExpenseHistory from "../pages/Expense/ExpenseHistory.jsx";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route element={<PrivateRoute />}>
                <Route path="/overview" element={<Overview />} />

                <Route path="/add-expense" element={<AddExpense />} />
                <Route path="/expense-history" element={<ExpenseHistory />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              {/*
              <Route path="*" element={<NotFound />} />
              */}
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
