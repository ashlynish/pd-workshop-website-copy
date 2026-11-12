(() => {
  const app = document.getElementById('workshopPage');
  const header = app?.querySelector('.header');
  const headerTools = header?.querySelector('.header-tools');
  const map = app?.querySelector('.map');
  const mapNote = app?.querySelector('.map-side-note');
  const activityGuides = app?.querySelector('.activity-guides');
  if (!app || !header || !headerTools || !map || !activityGuides) return;

  const mapPanel = document.createElement('section');
  mapPanel.className = 'app-tab-panel map-tab-panel';
  mapPanel.id = 'mapTabPanel';
  mapPanel.setAttribute('aria-label', 'Workshop map');
  map.parentNode.insertBefore(mapPanel, map);
  mapPanel.append(map);
  if (mapNote) mapPanel.append(mapNote);

  const quickActions = document.createElement('section');
  quickActions.className = 'quick-actions';
  quickActions.setAttribute('aria-label', 'Helper actions');
  const actions = headerTools.querySelector('.header-actions');
  if (actions) {
    const buttons = [...actions.querySelectorAll('.helper-action')];
    actions.classList.add('quick-action-grid');
    actions.setAttribute('role', 'group');
    actions.setAttribute('aria-label', 'Guide, video, call, and feedback');
    actions.replaceChildren(...buttons);
  }
  quickActions.append(headerTools);
  app.insertBefore(quickActions, mapPanel);

  const routeReminder = document.createElement('aside');
  routeReminder.className = 'route-reminder';
  routeReminder.setAttribute('aria-label', 'Workshop route reminder');
  routeReminder.innerHTML = '<span>Workshop route</span><strong>0 → 1 → 2 → 3 → 4a–4c → 5 → 6a–6e → optional 7 → 8</strong>';
  app.insertBefore(routeReminder, mapPanel);

  const printButton = document.getElementById('printQuickGuide');
  if (printButton) {
    printButton.classList.add('print-icon-button');
    printButton.setAttribute('aria-label', 'Print quick guide');
    printButton.title = 'Print quick guide';
    printButton.textContent = '';
    printButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8V3h10v5M6 17H4V9h16v8h-2"/><path d="M7 14h10v7H7zM17 11h.01"/></svg>';
  }

  activityGuides.id = 'activitiesTabPanel';
  activityGuides.classList.add('app-tab-panel');
  activityGuides.setAttribute('role', 'region');
  activityGuides.setAttribute('aria-labelledby', 'activityGuidesTitle');
  activityGuides.hidden = true;
  mapPanel.append(activityGuides);

  map.addEventListener('click', event => {
    if (!event.target.closest('.circle')) return;
    map.hidden = false;
    if (mapNote) mapNote.hidden = true;
    activityGuides.hidden = false;
    app.classList.add('is-guide-view');
    app.dataset.activeTab = 'map';
  }, true);

  app.addEventListener('click', event => {
    if (!app.classList.contains('is-guide-view') || event.target !== app) return;
    app.querySelector('.activity-detail-close')?.click();
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !app.classList.contains('is-guide-view')) return;
    if (event.target.closest?.('dialog[open]')) return;
    app.querySelector('.activity-detail-close')?.click();
  });

  const welcome = document.getElementById('welcomeScreen');
  const welcomeAccess = welcome?.querySelector('.welcome-guide-access');
  const tapOpenPrompt = document.getElementById('tapOpenPrompt');
  if (welcomeAccess && tapOpenPrompt) tapOpenPrompt.before(welcomeAccess);

  map.hidden = false;
  if (mapNote) mapNote.hidden = false;
  activityGuides.hidden = true;
  app.dataset.activeTab = 'map';
})();
