const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileNavPanel = document.getElementById('mobile-nav-panel');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
const featuredProductsGrid = document.getElementById('featured-products-grid');
const catalogResultsGrid = document.getElementById('catalog-results-grid');
const catalogResultsCount = document.getElementById('catalog-results-count');
const catalogSearchInput = document.getElementById('catalog-search-input');
const catalogSortSelect = document.getElementById('catalog-sort-select');
const categoryFilterCheckboxes = Array.from(document.querySelectorAll('.category-filter-checkbox'));
const detailsTitleText = document.getElementById('details-title-text');
const detailsDescriptionText = document.getElementById('details-description-text');
const detailsCrumbCategory = document.getElementById('details-crumb-category');
const detailsCrumbTitle = document.getElementById('details-crumb-title');
const detailsMainViewImage = document.getElementById('details-main-view-image');
const detailsCategoryBadge = document.getElementById('details-category-badge');
const detailsPriceTag = document.getElementById('details-price-tag');
const detailsOriginalPriceTag = document.getElementById('details-original-price-tag');
const specDimensions = document.getElementById('spec-dimensions');
const specMaterials = document.getElementById('spec-materials');
const specWarranty = document.getElementById('spec-warranty');
const specStatus = document.getElementById('spec-status');

/* productData is defined in products-data.js (loaded before this file)
   with the real Durga Furniture catalog: steel almirahs, tables, racks,
   cots, wooden furniture, and other furniture items. */

function formatPrice(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.innerHTML = `
    <button class="wishlist-btn-round" title="Add to wishlist"><i class="fa-regular fa-heart"></i></button>
    <div class="product-card-badge ${product.badge}">${product.category.split(' ')[0]}</div>
    <div class="product-card-img-wrapper">
      <img class="product-card-img" src="${product.image}" alt="${product.title}">
    </div>
    <div class="product-card-info">
      <span class="product-card-category">${product.category}</span>
      <h3 class="product-card-title">${product.title}</h3>
    </div>
  `;

  card.addEventListener('click', () => {
    showProductDetails(product);
    routeTo('details');
  });

  const wishlistButton = card.querySelector('.wishlist-btn-round');
  wishlistButton?.addEventListener('click', (event) => {
    event.stopPropagation();
    wishlistButton.classList.toggle('liked');
    const icon = wishlistButton.querySelector('i');
    if (icon) icon.classList.toggle('fa-solid');
  });

  return card;
}

function renderProducts(productList, container) {
  container.innerHTML = '';
  if (!productList.length) {
    container.innerHTML = '<p style="grid-column:1/-1; text-align:center; color: var(--color-text-muted);">No products found.</p>';
    return;
  }

  productList.forEach((product) => {
    container.appendChild(createProductCard(product));
  });
}

function renderFeaturedProducts() {
  if (!featuredProductsGrid) return;
  const featured = productData.filter((product) => product.category !== 'Other Furniture').slice(0, 6);
  renderProducts(featured, featuredProductsGrid);
}

function updateCatalogCount(count) {
  if (catalogResultsCount) {
    catalogResultsCount.textContent = `Showing ${count} products`;
  }
}

function sortProducts(products, sortKey) {
  const sorted = [...products];
  switch (sortKey) {
    case 'latest':
      return sorted.reverse();
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    default:
      return sorted;
  }
}

function filterCatalog() {
  const searchTerm = catalogSearchInput?.value.trim().toLowerCase() || '';
  const activeCategories = categoryFilterCheckboxes
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.dataset.catValue);

  let filteredProducts = [...productData];
  if (activeCategories.length) {
    filteredProducts = filteredProducts.filter((product) => activeCategories.includes(product.category));
  }
  if (searchTerm) {
    filteredProducts = filteredProducts.filter((product) =>
      product.title.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }

  const sortKey = catalogSortSelect?.value || 'popular';
  filteredProducts = sortProducts(filteredProducts, sortKey);

  renderProducts(filteredProducts, catalogResultsGrid);
  updateCatalogCount(filteredProducts.length);
}

function buildSizeOptions(product) {
  if (product.sizeOptions && product.sizeOptions.length) return product.sizeOptions;
  if (product.dimensions && product.dimensions.includes(' / ')) {
    return product.dimensions.split(' / ').map((part) => part.trim());
  }
  return null;
}

function renderVariantGroup(container, label, options, defaultIndex) {
  if (!options || !options.length) return;
  const startIndex = defaultIndex && defaultIndex < options.length ? defaultIndex : 0;

  const group = document.createElement('div');
  group.className = 'variant-group';

  const labelRow = document.createElement('div');
  labelRow.className = 'variant-group-label';
  labelRow.textContent = `${label}: `;
  const currentSpan = document.createElement('span');
  currentSpan.className = 'variant-current';
  currentSpan.textContent = options[startIndex];
  labelRow.appendChild(currentSpan);

  const pillRow = document.createElement('div');
  pillRow.className = 'pill-row';
  options.forEach((option, index) => {
    const pillButton = document.createElement('button');
    pillButton.type = 'button';
    pillButton.className = `pill-btn${index === startIndex ? ' active' : ''}`;
    pillButton.textContent = option;
    pillButton.addEventListener('click', () => {
      pillRow.querySelectorAll('.pill-btn').forEach((btn) => btn.classList.remove('active'));
      pillButton.classList.add('active');
      currentSpan.textContent = option;
    });
    pillRow.appendChild(pillButton);
  });

  group.appendChild(labelRow);
  group.appendChild(pillRow);
  container.appendChild(group);
}

function renderProductVariants(product, sizeOptions) {
  const container = document.getElementById('details-variants-container');
  if (!container) return;
  container.innerHTML = '';

  renderVariantGroup(container, 'Available Sizes', sizeOptions);

  if (product.mattressOptions) {
    renderVariantGroup(container, 'Mattress Options', product.mattressOptions);
  }

  if (product.category === 'Wooden Furniture') {
    renderVariantGroup(container, 'Wood Finish', product.finishOptions || ['Natural Oak', 'Walnut', 'Teak', 'White']);
  }
}

function renderProductInfoCards(product, hasSizeOptions) {
  const container = document.getElementById('details-info-cards');
  if (!container) return;
  container.innerHTML = '';

  const cards = [];
  if (!hasSizeOptions && product.dimensions) {
    cards.push(['Dimensions', product.dimensions]);
  }
  cards.push(['Material', product.materials || 'Premium quality materials']);

  cards.forEach(([label, value]) => {
    const card = document.createElement('div');
    card.className = 'info-card';
    const labelSpan = document.createElement('span');
    labelSpan.className = 'info-card-label';
    labelSpan.textContent = label;
    const valueSpan = document.createElement('span');
    valueSpan.className = 'info-card-value';
    valueSpan.textContent = value;
    card.appendChild(labelSpan);
    card.appendChild(valueSpan);
    container.appendChild(card);
  });
}

function showProductDetails(product) {
  if (!product) return;
  // Reset scroll to top of emulator container
  const emulatorContainer = document.querySelector('.emulator-container');
  if (emulatorContainer) {
    emulatorContainer.scrollTop = 0;
  }
  
  if (detailsTitleText) detailsTitleText.textContent = product.title;
  if (detailsDescriptionText) detailsDescriptionText.textContent = product.description;
  if (detailsCrumbCategory) detailsCrumbCategory.textContent = product.category;
  if (detailsCrumbTitle) detailsCrumbTitle.textContent = product.title;
  if (detailsMainViewImage) detailsMainViewImage.src = product.image;
  if (detailsCategoryBadge) detailsCategoryBadge.textContent = product.category;
  const sizeOptions = buildSizeOptions(product);
  renderProductVariants(product, sizeOptions);
  renderProductInfoCards(product, !!(sizeOptions && sizeOptions.length));
}

function openMobileNav() {
  mobileNavPanel?.classList.add('open');
  mobileNavOverlay?.classList.add('open');
}

function closeMobileNav() {
  mobileNavPanel?.classList.remove('open');
  mobileNavOverlay?.classList.remove('open');
}

function showView(viewId) {
  document.querySelectorAll('.view-panel').forEach((panel) => {
    panel.classList.toggle('active', panel.id === viewId);
  });
}

function hideLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  loader.classList.add('hidden');
}

window.setTimeout(hideLoader, 1200);

function routeTo(route, category, product) {
  closeMobileNav();

  switch (route) {
    case 'home':
      showView('home-view');
      break;
    case 'listing':
      showView('listing-view');
      break;
    case 'details':
      if (product) showProductDetails(product);
      showView('details-view');
      break;
    case 'wishlist':
      showView('wishlist-view');
      break;
    case 'about':
      showView('about-view');
      break;
    case 'contact':
      showView('contact-view');
      break;
    case 'admin':
      showView('admin-view');
      break;
    default:
      console.warn('Unknown route:', route);
      showView('home-view');
  }
}

window.routeTo = routeTo;

mobileMenuToggle?.addEventListener('click', openMobileNav);
mobileMenuClose?.addEventListener('click', closeMobileNav);
mobileNavOverlay?.addEventListener('click', closeMobileNav);

categoryFilterCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', filterCatalog);
});

catalogSearchInput?.addEventListener('input', filterCatalog);
catalogSortSelect?.addEventListener('change', filterCatalog);

document.querySelectorAll('.mobile-nav-item').forEach((item) => {
  item.addEventListener('click', () => {
    const route = item.dataset.route;
    const category = item.dataset.category;
    if (route) routeTo(route, category);
  });
});

renderFeaturedProducts();
filterCatalog();
