import { Routes, Route } from 'react-router-dom';

import './App.css';
import DynamicModule from './demos/DynamicModule';

export default function App() {
  /**
   * Aqui nós definimos o que será renderizado quando o módulo dinâmico for chamado.
   * Se você está utilizando nossa estrutura padrão, o path precisa ser "/agendaedu/dynamicmodule".
   */
  return (
    <Routes>
      <Route
        path="/agendaedu/dynamicmodule"
        element={<DynamicModule />}
      >
      </Route>
    </Routes>
  );
}
