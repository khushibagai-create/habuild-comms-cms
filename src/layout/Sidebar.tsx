import { useStory, type View } from '../state/storyContext';
import styles from './Sidebar.module.css';

/**
 * Left rail. Matches the .sidebar markup in 10-comms-cms.html:
 * brand mark + name, a single "Publishing" nav section with
 * Stories / Events / Templates, and a user footer.
 */

type NavId = 'stories' | 'events' | 'templates';

const NAV_ITEMS: ReadonlyArray<{ id: NavId; label: string; count: string }> = [
  { id: 'stories', label: 'Stories', count: '11' },
  { id: 'events', label: 'Events', count: '11' },
  { id: 'templates', label: 'Templates', count: '7' },
];

function viewToNav(view: View): NavId {
  if (view === 'events') return 'events';
  if (view === 'templates-ref') return 'templates';
  return 'stories'; // stories-list, new-story-picker, editor all live under Stories
}

function navToView(id: NavId): View {
  switch (id) {
    case 'events':
      return 'events';
    case 'templates':
      return 'templates-ref';
    case 'stories':
    default:
      return 'stories-list';
  }
}

function NavIcon({ id }: { id: NavId }) {
  if (id === 'stories') {
    return (
      <svg className={styles.ico} viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === 'events') {
    return (
      <svg className={styles.ico} viewBox="0 0 16 16" fill="none" aria-hidden>
        <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M2 6h12M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg className={styles.ico} viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function Sidebar() {
  const { state, dispatch } = useStory();
  const activeNav = viewToNav(state.view);

  return (
    <aside className={styles.sidebar} aria-label="Primary navigation">
      <div className={styles.brand}>
        <div className={styles.brandMark} aria-hidden>
          Hb
        </div>
        <div>
          <div className={styles.brandName}>Habuild Comms</div>
          <div className={styles.brandSub}>Story CMS</div>
        </div>
      </div>

      <div className={styles.navSection}>
        <div className={styles.navLabel}>Publishing</div>
        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              onClick={() => dispatch({ type: 'SET_VIEW', view: navToView(item.id) })}
              aria-current={isActive ? 'page' : undefined}
            >
              <NavIcon id={item.id} />
              <span className={styles.navItemLabel}>{item.label}</span>
              <span className={styles.count}>{item.count}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.footer}>
        <div className={styles.avatar} aria-hidden>
          KB
        </div>
        <div className={styles.userMeta}>
          <div className={styles.userName}>Khushi Bagai</div>
          <div className={styles.userRole}>Product, Habuild</div>
        </div>
      </div>
    </aside>
  );
}
