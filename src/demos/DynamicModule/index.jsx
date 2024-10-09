import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import './styles.css';

/**
 * Aqui está toda a lógica de renderização do módulo dinâmico. Nesse caso, os passos seriam:
 *   1. Buscar os dados do usuário que deseja utilizar o módulo (feito no useEffect);
 *   2. Renderizar informações do usuário, seja ele um responsável ou estudante (feito no return do DynamicModule).
 *
 * A lógica implementada aqui é somente um exemplo, uma vez que o usuário foi autenticado e o seu
 * módulo foi chamado você poderá fazer tudo aquilo que precisar.
 */
export default function DynamicModule() {
  const [searchParams] = useSearchParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const issuer = decodedToken.iss;

      if (issuer.includes('production')) {
        setApiUrl('https://api.agendaedu.com');
      } else if (issuer.includes('sandbox')) {
        setApiUrl('https://sandbox-api.agendaedu.dev');
      } else {
        setApiUrl('http://api.agendaedu.localhost:3000');
      }
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchCurrentUser() {
      const response = await fetch(`${apiUrl}/v2/me`, {
        headers: {
          Authorization: `Bearer ${searchParams.get('token')}`
        }
      });

      if (!response.ok) {
        // Tratar erros de resposta aqui, se necessário
        console.error('Failed to fetch user data');
        return;
      }

      const jsonData = await response.json();
      setCurrentUser(jsonData);
    }

    if (apiUrl && !currentUser) {
      fetchCurrentUser();
    }
  }, [apiUrl, currentUser, searchParams]);

  return (
    <>
      {currentUser && (
        currentUser.data.attributes.role === 'responsible'
          ? <ResponsibleDesc responsible={currentUser} />
          : <StudentDesc student={currentUser} />
      )}
    </>
  );
}

function ResponsibleDesc({ responsible }) {
  const userAttributes = responsible.data.attributes;
  const responsibleSchool = responsible.included.find(o => o.type === 'school');
  const responsibleStudent = responsible.included.find(o => o.type === 'family_profile');
  const studentClassroomsText = responsible.included
    .filter(o => o.type === 'classroom')
    .map(c => `${c.attributes.name} (${c.attributes.segment})`)
    .join(', ');

  return (
    <div className="App">
      <p>
        Seu nome é <strong>{userAttributes.name}</strong>,
        e você possui uma conta de <strong>responsável</strong> na Agenda Edu.
      </p>

      <p>
        Você está vinculado à escola <strong>{responsibleSchool.attributes.name}</strong>,
        onde seu/sua filho(a) <strong>{responsibleStudent.attributes.name}</strong> estuda.
      </p>

      <p>
        Atualmente, seu filho(a) faz parte da(s) turma(s) <strong>{studentClassroomsText}.</strong>
      </p>
    </div>
  );
}

function StudentDesc({ student }) {
  const userAttributes = student.data.attributes;
  const studentSchool = student.included.find(o => o.type === 'school');
  const studentClassroomsText = student.included
    .filter(o => o.type === 'classroom')
    .map(c => `${c.attributes.name} (${c.attributes.segment})`)
    .join(', ');
  const studentResponsibles = student.included.filter(o => o.type === 'family_profile');
  const responsibleNames = studentResponsibles.map(r => r.attributes.name).join(', ');

  return (
    <div className="App">
      <p>
        Seu nome é <strong>{userAttributes.name}</strong>,
        e você possui uma conta de <strong>estudante</strong> na Agenda Edu.
      </p>

      <p>
        Você está vinculado à escola <strong>{studentSchool.attributes.name}</strong>,
        onde você faz parte da(s) turma(s) <strong>{studentClassroomsText}</strong>.
      </p>

      <p>
        Além disso, você está relacionado com os seguintes responsáveis: <strong>{responsibleNames}</strong>.
      </p>
    </div>
  );
}
