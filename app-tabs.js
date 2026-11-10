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
  mapPanel.setAttribute('role', 'tabpanel');
  mapPanel.setAttribute('aria-label', 'Workshop map');
  map.parentNode.insertBefore(mapPanel, map);
  mapPanel.append(map);
  if (mapNote) mapPanel.append(mapNote);

  const helperPanel = document.createElement('section');
  helperPanel.className = 'app-tab-panel helper-tab-panel';
  helperPanel.id = 'helperTabPanel';
  helperPanel.setAttribute('role', 'tabpanel');
  helperPanel.setAttribute('aria-label', 'Helper quick actions');
  const actions = headerTools.querySelector('.header-actions');
  if (actions) {
    const groups = [
      ['openEmergency'],
      ['openFeedback'],
      ['openCall'],
      ['openGuide', 'openIntroVideo'],
    ];
    actions.replaceChildren(...groups.map((ids, index) => {
      const row = document.createElement('div');
      row.className = 'helper-tool-row';
      row.setAttribute('role', 'group');
      row.setAttribute('aria-label', ['Precaution', 'Feedback', 'Call', 'Guide and video'][index]);
      ids.forEach(id => {
        const button = document.getElementById(id);
        if (button) row.append(button);
      });
      return row;
    }));
  }
  helperPanel.append(headerTools);
  activityGuides.parentNode.insertBefore(helperPanel, activityGuides);

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
  activityGuides.setAttribute('role', 'tabpanel');
  activityGuides.setAttribute('aria-labelledby', 'activitiesTab');

  const nav = document.createElement('nav');
  nav.className = 'app-tab-bar';
  nav.setAttribute('aria-label', 'Main navigation');
  nav.setAttribute('role', 'tablist');
  nav.innerHTML = `
    <button class="app-tab is-selected" id="mapTab" type="button" role="tab" aria-selected="true" aria-controls="mapTabPanel" data-app-tab="map">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15m6-12v15"/></svg><span>Map</span>
    </button>
    <button class="app-tab" id="helpersTab" type="button" role="tab" aria-selected="false" aria-controls="helperTabPanel" data-app-tab="helpers" tabindex="-1">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2"/><path d="M5 20c.4-3.5 3.2-5.5 7-5.5s6.6 2 7 5.5"/><circle cx="12" cy="12" r="10"/></svg><span>Helpers</span>
    </button>
    <button class="app-tab" id="activitiesTab" type="button" role="tab" aria-selected="false" aria-controls="activitiesTabPanel" data-app-tab="activities" tabindex="-1">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11"/><path d="m3 6 1.2 1.2L6.5 5m-3.5 7 1.2 1.2L6.5 11m-3.5 7 1.2 1.2L6.5 17"/></svg><span>Activities</span>
    </button>`;
  app.append(nav);

  nav.insertBefore(nav.querySelector('#activitiesTab'), nav.querySelector('#helpersTab'));
  const tabs = [...nav.querySelectorAll('[role="tab"]')];
  const panels = [mapPanel, helperPanel, activityGuides];
  function activateTab(name, { scroll = true } = {}) {
    const selected = tabs.find(tab => tab.dataset.appTab === name);
    if (!selected) return;
    tabs.forEach(tab => {
      const isSelected = tab === selected;
      tab.classList.toggle('is-selected', isSelected);
      tab.setAttribute('aria-selected', String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
    });
    panels.forEach(panel => { panel.hidden = panel.id !== selected.getAttribute('aria-controls'); });
    app.dataset.activeTab = name;
    if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab.dataset.appTab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
      tabs[nextIndex].focus();
      activateTab(tabs[nextIndex].dataset.appTab);
    });
  });

  map.addEventListener('click', event => {
    if (event.target.closest('.circle')) activateTab('activities', { scroll: false });
  }, true);

  const welcome = document.getElementById('welcomeScreen');
  const welcomeAccess = welcome?.querySelector('.welcome-guide-access');
  const tapOpenPrompt = document.getElementById('tapOpenPrompt');
  if (welcomeAccess && tapOpenPrompt) tapOpenPrompt.before(welcomeAccess);

  activateTab('map', { scroll: false });
})();
