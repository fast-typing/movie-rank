import Header from "./components/Header/Header";
import useRoutes from "./hooks/useRoutes";

function App() {
  const routes = useRoutes()

  return (
    <>
      <Header />
      {routes}
    </>
  );
}

export default App;