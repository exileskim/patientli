'use client';

import { useEffect } from 'react';

import type { HubspotFormConfig, HubspotMeetingConfig } from '@/lib/marketing-content';

declare global {
  interface Window {
    hbspt?: {
      forms?: {
        create: (config: Record<string, unknown>) => void;
      };
      meetings?: {
        create: (selector: string) => void;
      };
    };
    Swiper?: new (element: Element | string, config: Record<string, unknown>) => unknown;
  }
}

const loadedScripts = new Set<string>();

function loadScript(src: string) {
  if (loadedScripts.has(src)) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      loadedScripts.add(src);
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => {
      loadedScripts.add(src);
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

function decodeSettings(value: string) {
  return value.replaceAll('&quot;', '"').replaceAll('&#038;', '&');
}

function parseSettings(value?: string) {
  if (!value) return {} as Record<string, unknown>;
  try {
    return JSON.parse(decodeSettings(value)) as Record<string, unknown>;
  } catch {
    return {} as Record<string, unknown>;
  }
}

function initMegaMenus(root: ParentNode) {
  const widgets = root.querySelectorAll<HTMLElement>('.elementor-widget-n-menu');

  widgets.forEach((widget) => {
    if (widget.dataset.menuEnhanced) return;
    widget.dataset.menuEnhanced = 'true';

    const settings = parseSettings(widget.getAttribute('data-settings') ?? undefined) as {
      open_on?: string;
    };

    const toggle = widget.querySelector<HTMLButtonElement>('.e-n-menu-toggle');
    const wrapper = widget.querySelector<HTMLElement>('.e-n-menu-wrapper');
    const items = widget.querySelectorAll<HTMLElement>('.e-n-menu-item');

    if (toggle && wrapper) {
      toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      });
    }

    const openItem = (item: HTMLElement) => {
      const contentWrapper = item.querySelector<HTMLElement>('.e-n-menu-content');
      const content = contentWrapper?.querySelector<HTMLElement>('.e-con') ?? null;
      const dropdown = item.querySelector<HTMLElement>('.e-n-menu-dropdown-icon');
      if (!contentWrapper || !content || !dropdown) return;

      items.forEach((other) => {
        if (other === item) return;
        const otherWrapper = other.querySelector<HTMLElement>('.e-n-menu-content');
        const otherContent = otherWrapper?.querySelector<HTMLElement>('.e-con') ?? null;
        const otherDropdown = other.querySelector<HTMLElement>('.e-n-menu-dropdown-icon');
        otherWrapper?.classList.remove('e-active');
        otherContent?.classList.remove('e-active');
        otherDropdown?.setAttribute('aria-expanded', 'false');
      });

      contentWrapper.classList.add('e-active');
      content.classList.add('e-active');
      dropdown.setAttribute('aria-expanded', 'true');
    };

    const closeItem = (item: HTMLElement) => {
      const contentWrapper = item.querySelector<HTMLElement>('.e-n-menu-content');
      const content = contentWrapper?.querySelector<HTMLElement>('.e-con') ?? null;
      const dropdown = item.querySelector<HTMLElement>('.e-n-menu-dropdown-icon');
      contentWrapper?.classList.remove('e-active');
      content?.classList.remove('e-active');
      dropdown?.setAttribute('aria-expanded', 'false');
    };

    items.forEach((item) => {
      const dropdown = item.querySelector<HTMLButtonElement>('.e-n-menu-dropdown-icon');
      const content = item.querySelector<HTMLElement>('.e-n-menu-content > .e-con');
      if (!dropdown || !content) return;

      dropdown.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const isOpen = content.classList.contains('e-active');
        if (isOpen) {
          closeItem(item);
        } else {
          openItem(item);
        }
      });

      if (settings.open_on === 'hover') {
        item.addEventListener('mouseenter', () => openItem(item));
        item.addEventListener('mouseleave', () => closeItem(item));
      }
    });
  });
}

function initTabs(root: ParentNode) {
  const tabs = root.querySelectorAll<HTMLElement>('.e-n-tabs');

  tabs.forEach((tab) => {
    if (tab.dataset.tabsEnhanced) return;
    tab.dataset.tabsEnhanced = 'true';

    const buttons = Array.from(tab.querySelectorAll<HTMLButtonElement>('.e-n-tab-title'));
    const panels = Array.from(tab.querySelectorAll<HTMLElement>('[role="tabpanel"]'));

    const activate = (button: HTMLButtonElement) => {
      const targetId = button.getAttribute('aria-controls');
      if (!targetId) return;

      buttons.forEach((btn) => {
        const isActive = btn === button;
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        btn.setAttribute('tabindex', isActive ? '0' : '-1');
        btn.classList.toggle('e-active', isActive);
      });

      panels.forEach((panel) => {
        const isActive = panel.id === targetId;
        panel.classList.toggle('e-active', isActive);
      });
    };

    buttons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        activate(button);
      });
    });
  });
}

function initAccordions(root: ParentNode) {
  const widgets = root.querySelectorAll<HTMLElement>('.elementor-widget-n-accordion');

  widgets.forEach((widget) => {
    if (widget.dataset.accordionEnhanced) return;
    widget.dataset.accordionEnhanced = 'true';

    const settings = parseSettings(widget.getAttribute('data-settings') ?? undefined) as {
      max_items_expended?: string;
    };

    const details = Array.from(widget.querySelectorAll<HTMLDetailsElement>('details.e-n-accordion-item'));

    details.forEach((detail) => {
      detail.addEventListener('toggle', () => {
        const summary = detail.querySelector('summary');
        if (summary) {
          summary.setAttribute('aria-expanded', detail.open ? 'true' : 'false');
        }

        if (detail.open && settings.max_items_expended === 'one') {
          details.forEach((other) => {
            if (other !== detail) {
              other.open = false;
              const otherSummary = other.querySelector('summary');
              otherSummary?.setAttribute('aria-expanded', 'false');
            }
          });
        }
      });
    });
  });
}

function initPasswordToggles(root: ParentNode) {
  const inputs = Array.from(
    root.querySelectorAll<HTMLInputElement>('.woocommerce form input[type="password"]'),
  );

  inputs.forEach((input) => {
    const parent = input.parentElement;
    if (!parent) return;

    let wrapper = input.closest<HTMLSpanElement>('span.password-input');
    if (!wrapper) {
      wrapper = document.createElement('span');
      wrapper.className = 'password-input';
      parent.insertBefore(wrapper, input);
      wrapper.appendChild(input);
    } else {
      wrapper.classList.add('password-input');
    }

    let button = wrapper.querySelector<HTMLButtonElement>('button.show-password-input');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'show-password-input';
      button.setAttribute('aria-label', 'Show password');
      const inputId = input.getAttribute('id');
      if (inputId) {
        button.setAttribute('aria-describedby', inputId);
      }
      wrapper.appendChild(button);
    }

    if (button.dataset.passwordToggleBound === 'true') return;
    button.dataset.passwordToggleBound = 'true';

    button.addEventListener('click', (event) => {
      event.preventDefault();
      const isVisible = button.classList.toggle('display-password');
      button.setAttribute('aria-label', isVisible ? 'Hide password' : 'Show password');
      input.type = isVisible ? 'text' : 'password';
      input.focus();
    });
  });
}

function initMenuCart(root: ParentNode) {
  const widgets = root.querySelectorAll<HTMLElement>('.elementor-widget-woocommerce-menu-cart');

  widgets.forEach((widget) => {
    if (widget.dataset.menuCartEnhanced) return;
    widget.dataset.menuCartEnhanced = 'true';

    const settings = parseSettings(widget.getAttribute('data-settings') ?? undefined) as {
      open_cart?: string;
    };

    const toggleWrapper = widget.querySelector<HTMLElement>('.elementor-menu-cart__toggle_wrapper');
    const toggleButton = widget.querySelector<HTMLAnchorElement>('#elementor-menu-cart__toggle_button');
    const container = widget.querySelector<HTMLElement>('.elementor-menu-cart__container');
    const main = widget.querySelector<HTMLElement>('.elementor-menu-cart__main');
    const closeButton = widget.querySelector<HTMLElement>(
      '.elementor-menu-cart__close-button, .elementor-menu-cart__close-button-custom',
    );

    if (!toggleButton) return;

    const setOpen = (open: boolean) => {
      widget.classList.toggle('elementor-menu-cart--shown', open);
      toggleButton.setAttribute('aria-expanded', open ? 'true' : 'false');
      container?.setAttribute('aria-hidden', open ? 'false' : 'true');
      main?.setAttribute('aria-hidden', open ? 'false' : 'true');
    };

    const toggle = () => setOpen(!widget.classList.contains('elementor-menu-cart--shown'));

    const handleToggleClick = (event: Event) => {
      event.preventDefault();
      toggle();
    };

    const handleCloseClick = (event: Event) => {
      event.preventDefault();
      setOpen(false);
    };

    toggleButton.addEventListener('click', handleToggleClick);

    if (settings.open_cart === 'mouseover' && toggleWrapper) {
      toggleWrapper.addEventListener('mouseenter', () => setOpen(true));
      toggleWrapper.addEventListener('mouseleave', () => setOpen(false));
    }

    closeButton?.addEventListener('click', handleCloseClick);

    document.addEventListener('click', (event) => {
      if (!widget.classList.contains('elementor-menu-cart--shown')) return;
      const target = event.target as Node;
      if (main?.contains(target)) return;
      if (toggleWrapper?.contains(target)) return;
      setOpen(false);
    });

    document.addEventListener('keyup', (event) => {
      if (event.key !== 'Escape') return;
      if (!widget.classList.contains('elementor-menu-cart--shown')) return;
      setOpen(false);
    });
  });
}

function initFilters(root: ParentNode) {
  const widgets = root.querySelectorAll<HTMLElement>('.elementor-widget-taxonomy-filter');

  widgets.forEach((widget) => {
    if (widget.dataset.filterEnhanced) return;
    widget.dataset.filterEnhanced = 'true';

    const settings = parseSettings(widget.getAttribute('data-settings') ?? undefined) as {
      taxonomy?: string;
      selected_element?: string;
    };

    const filterButtons = Array.from(widget.querySelectorAll<HTMLButtonElement>('.e-filter-item'));
    const targetId = settings.selected_element;
    const taxonomy = settings.taxonomy;
    if (!targetId || !taxonomy) return;

    const target = root.querySelector<HTMLElement>(`.elementor-element-${targetId}, [data-id="${targetId}"]`);
    if (!target) return;

    const items = Array.from(target.querySelectorAll<HTMLElement>('[data-elementor-type="loop-item"], .e-loop-item'));

    const applyFilter = (filterValue: string) => {
      filterButtons.forEach((button) => {
        button.setAttribute('aria-pressed', button.dataset.filter === filterValue ? 'true' : 'false');
      });

      items.forEach((item) => {
        if (filterValue === '__all') {
          item.style.display = '';
          return;
        }
        const classCandidates =
          taxonomy === 'post_tag'
            ? [`tag-${filterValue}`, `post_tag-${filterValue}`]
            : taxonomy === 'category'
              ? [`category-${filterValue}`, `${taxonomy}-${filterValue}`]
              : [`${taxonomy}-${filterValue}`];
        const matches = classCandidates.some((className) => item.classList.contains(className));
        item.style.display = matches ? '' : 'none';
      });
    };

    filterButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        applyFilter(button.dataset.filter ?? '__all');
      });
    });

    const activeButton =
      filterButtons.find((button) => button.getAttribute('aria-pressed') === 'true') ??
      filterButtons.find((button) => button.dataset.filter === '__all');
    if (activeButton) {
      applyFilter(activeButton.dataset.filter ?? '__all');
    }
  });
}

function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function initToc(root: ParentNode) {
  const widgets = root.querySelectorAll<HTMLElement>('.elementor-widget-table-of-contents');

  widgets.forEach((widget) => {
    if (widget.dataset.tocEnhanced) return;
    widget.dataset.tocEnhanced = 'true';

    const settings = parseSettings(widget.getAttribute('data-settings') ?? undefined) as {
      headings_by_tags?: string[];
      no_headings_message?: string;
      marker_view?: string;
    };

    const container = widget.querySelector<HTMLElement>('.elementor-toc__body');
    if (!container) return;

    const headingTags = settings.headings_by_tags?.length ? settings.headings_by_tags : ['h2'];
    const selector = headingTags.join(',');
    const rootElement = widget.closest('[data-elementor-type]') ?? document;

    const headings = Array.from(rootElement.querySelectorAll<HTMLElement>(selector)).filter(
      (heading) => !widget.contains(heading),
    );

    if (!headings.length) {
      container.textContent = settings.no_headings_message ?? 'No headings were found on this page.';
      return;
    }

    const list = document.createElement(settings.marker_view === 'numbers' ? 'ol' : 'ul');
    list.className = 'elementor-toc__list-wrapper';

    headings.forEach((heading, index) => {
      if (!heading.id) {
        const slug = slugifyHeading(heading.textContent ?? `section-${index + 1}`);
        heading.id = slug || `section-${index + 1}`;
      }

      const listItem = document.createElement('li');
      listItem.className = 'elementor-toc__list-item';

      const textWrapper = document.createElement('div');
      textWrapper.className = 'elementor-toc__list-item-text-wrapper';

      const link = document.createElement('a');
      link.className = 'elementor-toc__list-item-text';
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent ?? '';

      textWrapper.appendChild(link);
      listItem.appendChild(textWrapper);
      list.appendChild(listItem);
    });

    container.innerHTML = '';
    container.appendChild(list);

    const collapseButton = widget.querySelector<HTMLElement>('.elementor-toc__toggle-button--collapse');
    const expandButton = widget.querySelector<HTMLElement>('.elementor-toc__toggle-button--expand');

    const setCollapsed = (collapsed: boolean) => {
      widget.classList.toggle('elementor-toc--collapsed', collapsed);
      collapseButton?.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      expandButton?.setAttribute('aria-expanded', collapsed ? 'true' : 'false');
    };

    collapseButton?.addEventListener('click', () => setCollapsed(true));
    expandButton?.addEventListener('click', () => setCollapsed(false));
  });
}

function getViewportMode() {
  const width = window.innerWidth;
  if (width <= 767) return 'mobile';
  if (width <= 1024) return 'tablet';
  return 'desktop';
}

function initSticky(root: ParentNode) {
  const elements = root.querySelectorAll<HTMLElement>('[data-settings*="sticky"]');

  elements.forEach((element) => {
    if (element.dataset.stickyEnhanced) return;
    element.dataset.stickyEnhanced = 'true';

    const settings = parseSettings(element.getAttribute('data-settings') ?? undefined) as {
      sticky?: string;
      sticky_on?: string[];
      sticky_offset?: string | number;
    };

    if (settings.sticky !== 'top') return;

    const stickyOn = Array.isArray(settings.sticky_on)
      ? settings.sticky_on
      : ['desktop', 'tablet', 'mobile'];
    const spacer = document.createElement('div');
    spacer.className = 'elementor-sticky__spacer';
    spacer.style.height = '0px';
    spacer.style.width = '100%';

    const parent = element.parentElement;
    if (!parent) return;
    parent.insertBefore(spacer, element);

    const initialStyle = {
      position: element.style.position,
      top: element.style.top,
      left: element.style.left,
      width: element.style.width,
      zIndex: element.style.zIndex,
    };

    const applySticky = (offset: number, spacerRect: DOMRect) => {
      if (element.classList.contains('elementor-sticky--active')) return;

      element.classList.add('elementor-sticky--active');
      element.style.position = 'fixed';
      element.style.top = `${offset}px`;
      element.style.left = `${spacerRect.left}px`;
      element.style.width = `${spacerRect.width}px`;
      spacer.style.height = `${element.getBoundingClientRect().height}px`;
    };

    const resetSticky = () => {
      if (!element.classList.contains('elementor-sticky--active')) return;

      element.classList.remove('elementor-sticky--active');
      element.style.position = initialStyle.position;
      element.style.top = initialStyle.top;
      element.style.left = initialStyle.left;
      element.style.width = initialStyle.width;
      element.style.zIndex = initialStyle.zIndex;
      spacer.style.height = '0px';
    };

    const updateSticky = () => {
      const mode = getViewportMode();
      if (!stickyOn.includes(mode)) {
        resetSticky();
        return;
      }

      const offset = getSlidesValue(settings.sticky_offset) ?? 0;
      const spacerRect = spacer.getBoundingClientRect();
      const scrollTop = window.scrollY || window.pageYOffset;
      const stickyStart = spacerRect.top + scrollTop - offset;

      if (scrollTop >= stickyStart) {
        applySticky(offset, spacerRect);
      } else {
        resetSticky();
      }

      if (element.classList.contains('elementor-sticky--active')) {
        element.style.left = `${spacerRect.left}px`;
        element.style.width = `${spacerRect.width}px`;
        spacer.style.height = `${element.getBoundingClientRect().height}px`;
      }
    };

    updateSticky();
    window.addEventListener('scroll', updateSticky, { passive: true });
    window.addEventListener('resize', updateSticky);
  });
}

function initLazyBackgrounds(root: ParentNode) {
  const targets = Array.from(
    root.querySelectorAll<HTMLElement>('.e-con.e-parent:not(.e-lazyloaded):not(.e-no-lazyload)'),
  );

  if (!targets.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            element.classList.add('e-lazyloaded');
            observer.unobserve(element);
          }
        });
      },
      { rootMargin: '200px 0px 200px 0px' },
    );

    targets.forEach((element) => observer.observe(element));
  } else {
    targets.forEach((element) => element.classList.add('e-lazyloaded'));
  }
}

function initLightbox(root: ParentNode) {
  const triggers = Array.from(
    root.querySelectorAll<HTMLAnchorElement>('a[data-elementor-open-lightbox="yes"]'),
  );

  if (!triggers.length) return;

  const closeIcon = `
    <svg class="e-font-icon-svg e-eicon-close" viewBox="0 0 1000 1000" aria-hidden="true">
      <path d="M742 167L500 408 258 167C246 154 233 150 217 150 196 150 179 158 167 167 154 179 150 196 150 212 150 229 154 242 171 254L408 500 167 742C138 771 138 800 167 829 196 858 225 858 254 829L496 587 738 829C750 842 767 846 783 846 800 846 817 842 829 829 842 817 846 804 846 783 846 767 842 750 829 737L588 500 833 258C863 229 863 200 833 171 804 137 775 137 742 167Z"></path>
    </svg>
  `;

  const openLightbox = (href: string, title?: string, alt?: string) => {
    const existing = document.getElementById('elementor-lightbox');
    if (existing) {
      existing.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = 'elementor-lightbox';
    overlay.className = 'dialog-widget dialog-lightbox dialog-type-lightbox elementor-lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    const dialog = document.createElement('div');
    dialog.className = 'dialog-widget-content';

    const message = document.createElement('div');
    message.className = 'dialog-message dialog-lightbox-message';

    const item = document.createElement('div');
    item.className = 'elementor-lightbox-item';

    const image = document.createElement('img');
    image.className = 'elementor-lightbox-image';
    image.src = href;
    image.alt = alt ?? '';

    item.appendChild(image);
    message.appendChild(item);

    const closeButton = document.createElement('div');
    closeButton.className = 'dialog-lightbox-close-button';
    closeButton.setAttribute('role', 'button');
    closeButton.setAttribute('tabindex', '0');
    closeButton.setAttribute('aria-label', 'Close (Esc)');
    closeButton.innerHTML = closeIcon;

    const footer = title
      ? (() => {
          const footerEl = document.createElement('div');
          footerEl.className = 'elementor-slideshow__footer';
          const titleEl = document.createElement('p');
          titleEl.className = 'elementor-slideshow__title';
          titleEl.textContent = title;
          footerEl.appendChild(titleEl);
          return footerEl;
        })()
      : null;

    const close = () => {
      overlay.remove();
      document.body.classList.remove('dialog-prevent-scroll');
      document.removeEventListener('keydown', onKeyDown);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    closeButton.addEventListener('click', close);
    closeButton.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        close();
      }
    });

    overlay.addEventListener('click', (event) => {
      if (!item.contains(event.target as Node)) {
        close();
      }
    });

    dialog.appendChild(closeButton);
    dialog.appendChild(message);
    if (footer) {
      dialog.appendChild(footer);
    }
    overlay.appendChild(dialog);

    document.body.appendChild(overlay);
    document.body.classList.add('dialog-prevent-scroll');
    document.addEventListener('keydown', onKeyDown);

    closeButton.focus();
  };

  triggers.forEach((trigger) => {
    if (trigger.dataset.lightboxEnhanced) return;
    trigger.dataset.lightboxEnhanced = 'true';

    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const href = trigger.getAttribute('href');
      if (!href) return;
      const title = trigger.getAttribute('data-elementor-lightbox-title') ?? undefined;
      const img = trigger.querySelector<HTMLImageElement>('img');
      const alt = img?.getAttribute('alt') ?? undefined;
      openLightbox(href, title, alt);
    });
  });
}

function getSlidesValue(value?: string | number) {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = typeof value === 'string' ? Number.parseFloat(value) : value;
  return Number.isFinite(parsed) ? parsed : undefined;
}

function initCarousels(root: ParentNode) {
  if (!window.Swiper) return;

  const widgets = root.querySelectorAll<HTMLElement>(
    '.elementor-widget-n-carousel, .elementor-widget-loop-carousel',
  );

  widgets.forEach((widget) => {
    if (widget.dataset.carouselEnhanced) return;
    widget.dataset.carouselEnhanced = 'true';

    const settings = parseSettings(widget.getAttribute('data-settings') ?? undefined) as {
      slides_to_show?: string | number;
      slides_to_show_tablet?: string | number;
      slides_to_show_mobile?: string | number;
      slides_to_scroll?: string | number;
      speed?: string | number;
      autoplay?: string;
      autoplay_speed?: string | number;
      infinite?: string;
      image_spacing_custom?: { size?: string | number };
    };

    const swiperEl = widget.querySelector<HTMLElement>('.swiper');
    if (!swiperEl) return;

    const slidesToShow = getSlidesValue(settings.slides_to_show as string);
    const slidesToShowTablet = getSlidesValue(settings.slides_to_show_tablet as string);
    const slidesToShowMobile = getSlidesValue(settings.slides_to_show_mobile as string);
    const slidesToScroll = getSlidesValue(settings.slides_to_scroll as string);
    const speed = getSlidesValue(settings.speed as string) ?? 500;
    const spaceBetween = getSlidesValue(settings.image_spacing_custom?.size) ?? 0;
    const autoplay = settings.autoplay === 'yes' ? { delay: (getSlidesValue(settings.autoplay_speed as string) ?? 5000) } : false;
    const loop = settings.infinite === 'yes';

    const breakpoints: Record<number, { slidesPerView?: number }> = {};
    if (slidesToShowMobile) breakpoints[0] = { slidesPerView: slidesToShowMobile };
    if (slidesToShowTablet) breakpoints[768] = { slidesPerView: slidesToShowTablet };
    if (slidesToShow) breakpoints[1025] = { slidesPerView: slidesToShow };

    const prev = widget.querySelector<HTMLElement>('.elementor-swiper-button-prev');
    const next = widget.querySelector<HTMLElement>('.elementor-swiper-button-next');

    new window.Swiper(swiperEl, {
      slidesPerView: slidesToShow ?? 1,
      slidesPerGroup: slidesToScroll ?? 1,
      speed,
      spaceBetween,
      loop,
      autoplay,
      navigation: prev && next ? { prevEl: prev, nextEl: next } : undefined,
      breakpoints: Object.keys(breakpoints).length ? breakpoints : undefined,
    });
  });
}

function initEnhancements(root: ParentNode) {
  initMegaMenus(root);
  initTabs(root);
  initAccordions(root);
  initPasswordToggles(root);
  initMenuCart(root);
  initFilters(root);
  initToc(root);
  initSticky(root);
  initLazyBackgrounds(root);
  initLightbox(root);
}

async function initCarouselsWithScript(root: ParentNode) {
  const hasSwiper = root.querySelector('.swiper');
  if (!hasSwiper) return;

  if (!window.Swiper) {
    await loadScript('/wp-content/plugins/elementor/assets/lib/swiper/v8/swiper.min.js');
  }

  initCarousels(root);
}

async function initHubspotForms(forms: HubspotFormConfig[]) {
  if (!forms.length) return;

  await loadScript('https://js.hsforms.net/forms/embed/v2.js');

  if (!window.hbspt?.forms?.create) return;

  forms.forEach((form) => {
    const target = document.querySelector<HTMLElement>(form.target);
    if (!target || target.dataset.hubspotLoaded) return;

    window.hbspt.forms?.create({
      portalId: form.portalId,
      formId: form.formId,
      target: form.target,
      region: form.region,
    });

    target.dataset.hubspotLoaded = 'true';
  });
}

async function initHubspotMeetings(meetings: HubspotMeetingConfig[]) {
  if (!meetings.length) return;

  await loadScript('https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js');

  if (!window.hbspt?.meetings?.create) return;

  meetings.forEach((meeting) => {
    const target = document.querySelector<HTMLElement>(meeting.selector);
    if (!target || target.dataset.hubspotMeetingLoaded) return;

    window.hbspt.meetings?.create(meeting.selector);
    target.dataset.hubspotMeetingLoaded = 'true';
  });
}

interface MarketingScriptsProps {
  hubspotForms: HubspotFormConfig[];
  hubspotMeetings: HubspotMeetingConfig[];
}

export default function MarketingScripts({
  hubspotForms,
  hubspotMeetings,
}: MarketingScriptsProps) {
  useEffect(() => {
    const root = document;
    initEnhancements(root);
    initCarouselsWithScript(root).catch(() => undefined);
    initHubspotForms(hubspotForms).catch(() => undefined);
    initHubspotMeetings(hubspotMeetings).catch(() => undefined);
  }, [hubspotForms, hubspotMeetings]);

  return null;
}
