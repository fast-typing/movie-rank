import { useLocation } from "react-router-dom";
import GPTDialog from "./components/GPTDialog";
import Header from "./components/Header";
import useRoutes from "./routes/useRoutes";
import { useEffect } from "react";
import { PAGE_TITLE_TO_PATH } from "./App.constants";

function App() {
  const routes = useRoutes()
  const location = useLocation()

  useEffect(() => {
    const title = PAGE_TITLE_TO_PATH[location.pathname]
    if (!title) return
    document.title = title
  }, [location])
 
  return (
    <>
      <Header />
      {routes}
      <GPTDialog />
    </>
  );
}

export default App;