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


// --- Selectores del DOM ---
const newTwistForm = document.querySelector<HTMLFormElement>('#newTwistForm');
const twistContentInput = document.querySelector<HTMLTextAreaElement>('#twistContent');
const charCounter = document.querySelector<HTMLSpanElement>('#charCounter');
const twistsContainer = document.querySelector<HTMLDivElement>('#twistsContainer');

// --- Renderizado ---
function createTwistElement(twist: Twist, isReply = false): HTMLElement {
  const twistCard = document.createElement('article');
  twistCard.className = `twist-card ${isReply ? 'reply-card' : ''} animate-fade-in`;
  twistCard.dataset.twistId = twist.id;

  const user = currentUser; 
  twistCard.innerHTML = `
      <div class="twist-header">
        <div class="twist-avatar">${user.avatarInitial}</div>
        <div class="twist-userinfo">
          <span class="username">${user.username}</span>
          <span class="timestamp">${formatDate(twist.timestamp)}</span>
        </div>
      </div>
      <p class="twist-content">${escapeHTML(twist.content)}</p>
      <div class="twist-actions">
        <button class="btn btn-light btn-reply" data-twist-id="${twist.id}">Responder</button>
      </div>
      <div class="reply-form-container"></div>
      <div class="thread-container" id="thread-for-${twist.id}"></div>
    `;

  // Event: responder
  twistCard.querySelector<HTMLButtonElement>('.btn-reply')
    ?.addEventListener('click', () => toggleReplyForm(twist.id, twistCard));

  // Scroll suave al crear
  setTimeout(() => twistCard.scrollIntoView({ behavior: 'smooth' }), 100);

  return twistCard;
}

function renderTwists(): void {
  if (!twistsContainer) return;
  twistsContainer.innerHTML = '';

  const topLevel = twists.filter(t => !t.parentId)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  topLevel.forEach(twist => {
    const el = createTwistElement(twist);
    twistsContainer.append(el);
    renderReplies(twist, el);
  });
}

function renderReplies(parent: Twist, parentEl: HTMLElement): void {
  const container = parentEl.querySelector<HTMLDivElement>(`#thread-for-${parent.id}`);
  if (!container) return;
  container.innerHTML = '';

  const replies = twists
    .filter(t => t.parentId === parent.id)
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  replies.forEach(reply => {
    const repEl = createTwistElement(reply, true);
    container.append(repEl);
    renderReplies(reply, repEl);
  });
}
