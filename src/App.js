import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRouter from "./componenets/AppRouter";
import NavBar from "./componenets/NavBar";
import Footer from "./componenets/Footer";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { check as checkUser } from "./http/userApi";
import CookieBanner from "./componenets/CookieBanner";

const App = observer(() => {
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuthentication = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const isUserAuth = JSON.parse(localStorage.getItem("userIsAuth"));

      if (isUserAuth && accessToken) {
        try {
          const userData = await checkUser();
          user.setUser(userData);
          user.setIsAuth(true);
        } catch (userError) {
          console.error("Failed to refresh user token", userError);
          user.clearUser();
          localStorage.removeItem("userIsAuth");
          localStorage.removeItem("accessToken");
        }
      } else {
        user.clearUser();
      }
      setLoading(false);
    };

    verifyAuthentication();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>; // Индикатор загрузки
  }

  return (
    <BrowserRouter>
      <AppWithFooter />
    </BrowserRouter>
  );
});

const AppWithFooter = () => {
  const location = useLocation();
  const excludeFooterPages = [
    "/order-confirmation",
    "/confirmation2",
    "/confirmation3",
  ]; // Здесь указывайте страницы, на которых footer не должен отображаться
  const shouldShowFooter = !excludeFooterPages.includes(location.pathname);

  return (
    <>
      <NavBar />
      <ScrollToTop />
      <AppRouter />
      <CookieBanner />
      {shouldShowFooter && <Footer />}
    </>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default App;
