import { Routes, Route } from 'react-router-dom';

import './App.css';
import DynamicModule from './demos/DynamicModule';

export default function App() {
  /**
   * Aqui nós definimos o que será renderizado quando o módulo dinâmico for chamado.
   * O path definido aqui precisa ser o mesmo que foi utilizado no cadastro da Agenda Edu.
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
