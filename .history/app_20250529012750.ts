// --- Interfaces ---
interface User {
  id: string;
  username: string;
  avatarInitial: string;
}

interface Twist {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  parentId?: string | null;
}

// --- Simulación de Backend en Memoria ---
let currentUser: User = { id: 'user1', username: 'UsuarioActual', avatarInitial: 'U' };
let twists: Twist[] = [];
let nextTwistId = 1;

// --- Utilidades ---
const generateId = (): string => `twist-${nextTwistId++}`;

const formatDate = (date: Date): string =>
  `${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} · ` +
  date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

const escapeHTML = (str: string): string => {
  const p = document.createElement('p');
  p.textContent = str;
  return p.innerHTML;
};

