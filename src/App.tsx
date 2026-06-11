import { Sidebar } from './layout/Sidebar';
import { Topbar } from './layout/Topbar';
import type { Crumb } from './layout/Breadcrumbs';
import { TemplatePicker } from './components/TemplatePicker';
import { Editor } from './components/Editor/Editor';
import { useStory } from './state/storyContext';
import { TEMPLATES } from './state/templates';
import styles from './App.module.css';

/**
 * App shell. Mirrors the .app / .sidebar / .main / .topbar / .content
 * structure of 10-comms-cms.html. View routing is driven by the story
 * context — see src/state/storyContext.tsx.
 */
export function App() {
  const { state, dispatch } = useStory();
  const { view, currentStory } = state;

  const crumbs: Crumb[] = (() => {
    const stories: Crumb = {
      label: 'Stories',
      onClick: () => dispatch({ type: 'SET_VIEW', view: 'stories-list' }),
    };
    if (view === 'new-story-picker') {
      return [stories, { label: 'New story' }];
    }
    if (view === 'editor') {
      const tpl = currentStory.templateKey ? TEMPLATES[currentStory.templateKey] : null;
      return [
        stories,
        {
          label: 'New story',
          onClick: () => dispatch({ type: 'SET_VIEW', view: 'new-story-picker' }),
        },
        { label: tpl?.label ?? 'Story' },
      ];
    }
    if (view === 'events') return [{ label: 'Events' }];
    if (view === 'templates-ref') return [{ label: 'Templates' }];
    return [stories];
  })();

  const actions =
    view === 'stories-list' ? (
      <button
        type="button"
        className={`${styles.btn} ${styles.btnPrimary}`}
        onClick={() => dispatch({ type: 'SET_VIEW', view: 'new-story-picker' })}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        New story
      </button>
    ) : null;

  return (
    <div className={styles.app}>
      <Sidebar />

      <main className={styles.main}>
        <Topbar crumbs={crumbs} actions={actions} />

        <div className={styles.content}>
          {view === 'stories-list' && <StoriesListPlaceholder />}
          {view === 'new-story-picker' && <TemplatePicker />}
          {view === 'editor' && <Editor />}
          {view === 'events' && (
            <PlaceholderCard
              title="Events list"
              body="Out of scope for the React port. Use the original HTML CMS for events."
            />
          )}
          {view === 'templates-ref' && (
            <PlaceholderCard
              title="Templates reference"
              body="Out of scope for the React port. The templates are visible in the picker."
            />
          )}
        </div>
      </main>
    </div>
  );
}

function StoriesListPlaceholder() {
  const { dispatch } = useStory();
  return (
    <div className={styles.empty}>
      <h1 className={styles.emptyTitle}>No stories yet</h1>
      <p className={styles.emptyBody}>
        Click <strong>+ New story</strong> to begin. The drafts list lands in Phase 3.
      </p>
      <button
        type="button"
        className={`${styles.btn} ${styles.btnPrimary}`}
        onClick={() => dispatch({ type: 'SET_VIEW', view: 'new-story-picker' })}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        New story
      </button>
    </div>
  );
}

function PlaceholderCard({ title, body }: { title: string; body: string }) {
  return (
    <div className={styles.placeholderCard}>
      <h1 className={styles.h1}>{title}</h1>
      <p className={styles.p}>{body}</p>
    </div>
  );
}
