import React, { useState } from "react";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";

const App: React.FC = () => {
  const [reloadKey, setReloadKey] = useState(0);

  const refresh = () => {
    setReloadKey((prev) => prev + 1);
  };

  return (
    <div>
      <ProductForm onCreated={refresh} />
      <ProductList reloadKey={reloadKey} onChange={refresh} />
    </div>
  );
};

export default App;
