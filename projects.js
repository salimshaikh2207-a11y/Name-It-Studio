(() => {
  'use strict';
  const el = id => document.getElementById(id);
  const themes = {
    business: ['Logo & brand lettering', 'Reception / office sign', 'Café, salon or studio sign', 'Something else'],
    spiritual: ['Devotional artwork', 'Meaningful symbol or calligraphy', 'Decorative wall panel', 'Something else'],
    hobby: ['Gaming tag / setup', 'Sport-inspired design', 'Music-inspired design', 'Car / bike-inspired design', 'Anime / character-inspired idea', 'Something else'],
    gift: ['Housewarming', 'Birthday', 'Wedding / anniversary', 'Kids’ room', 'Event backdrop', 'Something else']
  };
  let reference = null, referenceURL = null, imageRevision = 0, imageLoading = false;
  const ids = ['project-category','project-theme','project-text','project-material','project-light','project-width','project-height','project-quantity','project-space','project-notes'];
  const value = id => el(id).value.trim();
  function setThemes() {
    el('project-theme').replaceChildren(...themes[value('project-category')].map(t => new Option(t, t)));
  }
  function rows() {
    const width = value('project-width'), height = value('project-height');
    return [
      ['Project', el('project-category').selectedOptions[0].textContent],
      ['Direction', value('project-theme')], ['Name / idea', value('project-text') || 'To be discussed'],
      ['Preferred material', value('project-material')], ['Lighting request', value('project-light')],
      ['Requested size', width && height ? `${width} × ${height} inches` : width || height ? 'Add both dimensions' : 'Please advise'],
      ['Quantity', value('project-quantity') || 'Not set'], ['Placement', value('project-space')],
      ...(value('project-notes') ? [['Details', value('project-notes')]] : []),
      ['Reference', reference ? reference.name + ' — attach separately in WhatsApp' : 'No image selected']
    ];
  }
  function fillList(target, items) {
    el(target).replaceChildren(...items.flatMap(([key, val]) => {
      const dt = document.createElement('dt'), dd = document.createElement('dd');
      dt.textContent = key; dd.textContent = val; return [dt, dd];
    }));
  }
  function render() {
    el('project-preview-title').textContent = value('project-text') || 'Your custom piece';
    fillList('project-summary', rows().filter(([key]) => !['Name / idea', 'Details', 'Reference'].includes(key)));
    el('project-light-hint').textContent = value('project-light').includes('Neon')
      ? 'Neon-style lettering is a special request. We’ll confirm feasibility, colours and construction before quoting.'
      : 'We’ll confirm the lighting system and construction with your quote.';
  }
  function clearReference() {
    imageRevision++; imageLoading = false;
    if (referenceURL) URL.revokeObjectURL(referenceURL);
    reference = null; referenceURL = null;
    el('project-reference-image').removeAttribute('src'); el('project-reference-image').hidden = true;
    el('project-reference-empty').hidden = false; el('project-remove-image').hidden = true;
    el('project-image').value = ''; el('project-file-status').textContent = '';
    render();
  }
  el('project-image').addEventListener('change', () => {
    const file = el('project-image').files[0];
    clearReference();
    if (!file) return;
    if (!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) {
      el('project-file-status').textContent = 'Choose a JPG, PNG or WebP image no larger than 10 MB.'; return;
    }
    const revision = imageRevision;
    const objectURL = URL.createObjectURL(file), probe = new Image();
    imageLoading = true; el('project-file-status').textContent = 'Preparing your local reference preview…';
    probe.onload = () => {
      if (revision !== imageRevision) { URL.revokeObjectURL(objectURL); return; }
      imageLoading = false;
      if (probe.naturalWidth * probe.naturalHeight > 40000000) {
        URL.revokeObjectURL(objectURL); el('project-file-status').textContent = 'Please choose an image below 40 megapixels.'; return;
      }
      reference = file; referenceURL = objectURL;
      el('project-reference-image').src = objectURL; el('project-reference-image').hidden = false;
      el('project-reference-empty').hidden = true; el('project-remove-image').hidden = false;
      el('project-file-status').textContent = `${file.name} selected. Preview only; attach it in WhatsApp when sending.`;
      render();
    };
    probe.onerror = () => {
      URL.revokeObjectURL(objectURL);
      if (revision === imageRevision) { imageLoading = false; el('project-file-status').textContent = 'This image could not be opened. Please choose a different JPG, PNG or WebP.'; }
    };
    probe.src = objectURL;
  });
  el('project-remove-image').addEventListener('click', clearReference);
  el('project-category').addEventListener('change', () => { setThemes(); render(); });
  ids.forEach(id => el(id).addEventListener('input', render));
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', event => {
    event.preventDefault(); el('project-category').value = button.dataset.project;
    setThemes(); render(); el('project-request').open = true;
    el('project-request').scrollIntoView({behavior: 'smooth', block: 'start'});
    el('project-category').focus({preventScroll: true});
  }));
  function brief() {
    return 'Hello Name It Studio, I would like a quote for a custom project at your current material and LED square-inch rate.\n\n' + rows().map(([k,v]) => `${k}: ${v}`).join('\n')
      + '\n\nPlease confirm the final artwork, material, dimensions, lighting, manufacturing feasibility, price before production. Delivery within 3–5 working days from order confirmation. Payment: 30% after design finalisation, remaining 70% on delivery.';
  }
  el('project-form').noValidate = true;
  el('project-form').addEventListener('submit', event => {
    event.preventDefault(); el('project-error').textContent = '';
    const fail = (message, field) => { el('project-error').textContent = message; el(field).focus(); };
    if (!value('project-text')) return fail('Tell us the name, message or design idea for this piece.', 'project-text');
    const width = value('project-width'), height = value('project-height');
    if (!!width !== !!height) return fail('Enter both width and height, or leave both blank for advice.', width ? 'project-height' : 'project-width');
    if (width && (![Number(width), Number(height)].every(n => Number.isFinite(n) && n >= 1 && n <= 96))) return fail('Enter dimensions between 1 and 96 inches for your request.', 'project-width');
    const count = Number(value('project-quantity'));
    if (!Number.isInteger(count) || count < 1 || count > 1000) return fail('Enter a whole-number quantity from 1 to 1,000.', 'project-quantity');
    if (imageLoading) return fail('Please wait for your reference image preview to finish.', 'project-image');
    fillList('project-review-specs', rows());
    el('project-whatsapp').href = 'https://wa.me/919082405720?text=' + encodeURIComponent(brief());
    el('project-attachment-note').textContent = reference
      ? `Remember to attach “${reference.name}” in WhatsApp. Your image is not automatically sent with this brief.`
      : 'Have a logo or reference to share later? Attach it directly in WhatsApp.';
    el('project-review').showModal();
  });
  ['project-close-review','project-edit'].forEach(id => el(id).addEventListener('click', () => el('project-review').close()));
  el('project-download').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([brief()], {type: 'text/plain;charset=utf-8'}));
    const a = document.createElement('a'); a.href = url; a.download = 'Name-It-Studio-custom-project.txt'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  });
  function openLinkedRequest(){if(location.hash==='#project-request'){el('project-request').open=true;}}
  window.addEventListener('hashchange',openLinkedRequest);openLinkedRequest();
  setThemes(); render();
})();
