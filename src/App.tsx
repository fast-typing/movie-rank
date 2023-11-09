import Header from "./components/Header";
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