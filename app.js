/* Initialize WhatsApp Floating Button with Smart Positioning */
(function() {
  const whatsappBtn = document.querySelector('.whatsapp-floating-btn');
  if (!whatsappBtn) return;
  
  whatsappBtn.style.display = 'flex';
  whatsappBtn.style.visibility = 'visible';
  whatsappBtn.style.opacity = '1';
  
  // Handle scroll to avoid footer overlap
  const handleScroll = () => {
    const pageHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const scrollTop = window.scrollY;
    const scrollableHeight = pageHeight - viewportHeight;
    const distanceFromBottom = scrollableHeight - scrollTop;
    
    // If within 200px of bottom, move button up progressively
    if (distanceFromBottom < 200) {
      const newBottom = 24 + (200 - distanceFromBottom);
      whatsappBtn.style.bottom = newBottom + 'px !important';
    } else {
      whatsappBtn.style.bottom = '24px !important';
    }
  };
  
  // Add scroll listener to the main window
  window.addEventListener('scroll', handleScroll, { passive: true });
})();

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

function getProductFallbackImage(category) {
  return 'logo.png';
}

function formatPrice(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

// The 5 steel products that are displayed outside in the catalog
const OUTSIDE_STEEL_IDS = [
  'steel-almirah-blue-double',
  'steel-cot-ornate-blue',
  'steel-table-double-pedestal',
  'steel-rack-5tier-black',
  'steel-bookshelf-grey-4tier'
];

// The 8 wooden products that are displayed outside in the catalog
const OUTSIDE_WOODEN_IDS = [
  'wooden-wardrobe-customized-double', // Series 1
  'wooden-tv-unit-premium-showcase',   // Series 2
  'wooden-pooja-mandir-premium-5ft',   // Series 3
  'wooden-cot-series-premium-teak',    // Series 4
  'wooden-dressing-vanity-multi-finish',// Series 5
  'wooden-office-table-premium-4x2',    // Series 6
  'wooden-dining-table-premium',        // Series 7
  'wooden-sofa-premium-set'            // Series 8
];

const OUTSIDE_OTHER_IDS = [
  'steel-stool-heavy-duty-collection', // Series 1
  'steel-almirah-orange-locker',        // Series 2
  'other-office-table-series3'          // Series 3
];

// Global Wishlist State Management
let wishlist = [];
try {
  wishlist = JSON.parse(localStorage.getItem('df_wishlist')) || [];
} catch (e) {
  wishlist = [];
}

function updateWishlistBadges() {
  const badges = document.querySelectorAll('.wishlist-counter-badge');
  badges.forEach((badge) => {
    badge.textContent = wishlist.length;
    badge.style.display = wishlist.length > 0 ? 'inline-block' : 'none';
  });
  
  const adminStat = document.getElementById('admin-stat-wishlists-count');
  if (adminStat) {
    adminStat.textContent = wishlist.length;
  }
}

function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId);
  if (index > -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push(productId);
  }
  localStorage.setItem('df_wishlist', JSON.stringify(wishlist));
  updateWishlistBadges();
  
  // Sync all visual cards in DOM representing this product ID
  document.querySelectorAll(`.product-card[data-product-id="${productId}"]`).forEach((card) => {
    const roundBtn = card.querySelector('.wishlist-btn-round');
    const textBtn = card.querySelector('.btn-add-wishlist');
    const isWishlisted = wishlist.includes(productId);
    
    if (roundBtn) {
      roundBtn.classList.toggle('liked', isWishlisted);
      const icon = roundBtn.querySelector('i');
      if (icon) {
        icon.className = isWishlisted ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
      }
    }
    
    if (textBtn) {
      textBtn.classList.toggle('wishlisted-active', isWishlisted);
      const icon = textBtn.querySelector('i');
      if (icon) {
        icon.className = isWishlisted ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
      }
      const labelText = textBtn.querySelector('.wishlist-btn-label');
      if (labelText) {
        labelText.textContent = isWishlisted ? 'Wishlisted' : 'Add to Wishlist';
      }
    }
  });
  
  // Update details page button if it is currently displaying this product
  const detailsTitle = document.getElementById('details-title-text');
  const currentDetailsProduct = productData.find((p) => p.title === detailsTitle?.textContent);
  if (currentDetailsProduct && currentDetailsProduct.id === productId) {
    const detailsWishlistBtn = document.getElementById('details-wishlist-btn');
    if (detailsWishlistBtn) {
      const isWishlisted = wishlist.includes(productId);
      detailsWishlistBtn.classList.toggle('wishlisted-active', isWishlisted);
      const icon = detailsWishlistBtn.querySelector('i');
      if (icon) {
        icon.className = isWishlisted ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
      }
      const labelText = document.getElementById('details-wishlist-btn-label');
      if (labelText) {
        labelText.textContent = isWishlisted ? 'Wishlisted' : 'Add to Wishlist';
      }
    }
  }
  
  // If we are currently on the wishlist page, refresh it to remove unliked items
  const wishlistView = document.getElementById('wishlist-view');
  if (wishlistView && wishlistView.classList.contains('active')) {
    renderWishlist();
  }
}

function renderWishlist() {
  const container = document.getElementById('wishlist-grid');
  const emptyState = document.getElementById('wishlist-empty-state');
  if (!container) return;
  
  const wishlistedProducts = productData.filter((product) => wishlist.includes(product.id));
  
  if (wishlistedProducts.length === 0) {
    container.style.display = 'none';
    if (emptyState) emptyState.style.display = 'flex';
  } else {
    if (emptyState) emptyState.style.display = 'none';
    container.style.display = 'grid';
    renderProducts(wishlistedProducts, container);
  }
}

// Call on load
document.addEventListener('DOMContentLoaded', () => {
  updateWishlistBadges();
});
// Fallback if DOMContentLoaded already fired
updateWishlistBadges();

function getProductSeriesNumber(product) {
  if (!product) return null;
  if (product.series) return String(product.series);
  if (!product.id) return null;
  const id = product.id.toLowerCase();
  
  if (product.category === 'Wooden Furniture') {
    if (id.includes('wardrobe') && !id.includes('dressing')) return '1';
    if (id.includes('tv') || id.includes('showcase')) return '2';
    if (id.includes('mandir') || id.includes('pooja')) return '3';
    if (id.includes('cot') || id.includes('bed')) return '4';
    if (id.includes('dressing') || id.includes('vanity') || id.includes('cabinet')) return '5';
    if (id.includes('office-table') || id.includes('office_table') || id.includes('study-desk') || id.includes('computer-table') || id.includes('desk-angled') || id.includes('office-desk') || id.includes('workstation') || id.includes('office-workstation')) return '6';
    if (id.includes('dining') || id.includes('dinning')) return '7';
    if (id.includes('sofa')) return '8';
    
    if (id.includes('wardrobe')) return '1';
    if (id.includes('office')) return '6';
    return '1';
  }
  
  if (product.category === 'Steel Furniture') {
    if (id.includes('bookshelf') || id.includes('bookcase') || id.includes('filing')) return '5';
    if (id.includes('almirah') || id.includes('locker') || id.includes('cabinet')) return '1';
    if (id.includes('cot') || id.includes('bed')) return '2';
    if (id.includes('table') || id.includes('desk') || id.includes('pedestal') || id.includes('stool')) return '3';
    if (id.includes('rack') || id.includes('trolley')) return '4';
    return '1';
  }

  if (product.category === 'Other Furniture') {
    if (id.includes('stool')) return '1';
    if (id.includes('locker') || id.includes('almirah')) return '2';
    if (id.includes('table') || id.includes('office') || id.includes('series3')) return '3';
    return '1';
  }
  
  return null;
}

function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.setAttribute('data-product-id', product.id);
  
  let priceHtml = '';
  if (product.price) {
    priceHtml = `
      <div class="product-card-price-row" style="margin-top: auto; display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <span class="product-card-price" style="font-weight: 700; color: var(--color-text-espresso);">${formatPrice(product.price)}</span>
        ${product.originalPrice ? `<span class="product-card-original-price" style="text-decoration: line-through; font-size: 11px; color: var(--color-text-muted);">${formatPrice(product.originalPrice)}</span>` : ''}
      </div>
    `;
  }

   const seriesNum = getProductSeriesNumber(product);
  const seriesLabel = seriesNum ? ` &bull; Series ${seriesNum}` : '';

  card.innerHTML = `
    <div class="product-card-badge ${product.badge}">${product.category.split(' ')[0]}</div>
    <div class="product-card-img-wrapper">
      <img class="product-card-img" src="${product.image}" alt="${product.title}" onerror="this.onerror=null; this.src='${getProductFallbackImage(product.category)}';">
    </div>
    <div class="product-card-info" style="display: flex; flex-direction: column; flex: 1;">
      <span class="product-card-category">${product.category}${seriesLabel}</span>
      <h3 class="product-card-title">${product.title}</h3>
      ${priceHtml}
      <div class="product-card-cta-row" style="margin-top: auto; padding-top: 12px; width: 100%;">
        <button class="btn-gold" style="pointer-events: none; width: 100% !important; justify-content: center !important; height: 36px !important; font-size: 13px !important; display: flex; align-items: center; gap: 6px; border-radius: 6px;">
          <span>View Details</span> <i class="fa-solid fa-arrow-right" style="font-size: 11px;"></i>
        </button>
      </div>
    </div>
  `;

  card.addEventListener('click', () => {
    showProductDetails(product);
    routeTo('details');
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
  
  // Group products to select one representative per series to avoid duplicate variants
  const representatives = [];
  const seriesGroups = {};
  
  // Sort to prioritize items that have main images
  const sortedForRep = [...productData].sort((a, b) => {
    const hasAImg = a.image_url && !a.image_url.includes('placeholder') && !a.image_url.includes('logo.png');
    const hasBImg = b.image_url && !b.image_url.includes('placeholder') && !b.image_url.includes('logo.png');
    if (hasAImg && !hasBImg) return -1;
    if (!hasAImg && hasBImg) return 1;
    return 0;
  });

  sortedForRep.forEach(p => {
    if (!p.series) return;
    const seriesKey = `${p.category}|${p.series}`;
    if (!seriesGroups[seriesKey]) {
      seriesGroups[seriesKey] = p;
      representatives.push(p);
    }
  });

  const wooden = representatives.filter(p => p.category === 'Wooden Furniture').slice(0, 3);
  const steel = representatives.filter(p => p.category === 'Steel Furniture').slice(0, 3);
  const other = representatives.filter(p => p.category === 'Other Furniture').slice(0, 2);
  const featured = [...wooden, ...steel, ...other];
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
      return sorted.sort((a, b) => {
        if (a.category === b.category) {
          const aSeries = parseInt(getProductSeriesNumber(a)) || 999;
          const bSeries = parseInt(getProductSeriesNumber(b)) || 999;
          if (aSeries !== bSeries) {
            return aSeries - bSeries;
          }
        }
        return 0;
      });
  }
}

function filterCatalog() {
  const searchTerm = catalogSearchInput?.value.trim().toLowerCase() || '';
  const activeCategories = categoryFilterCheckboxes
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.dataset.catValue);

  let filteredProducts = [...productData];
  
  // Group products by category and series to find one representative per series dynamically
  const representatives = [];
  const seriesGroups = {};
  
  const sortedForRep = [...productData].sort((a, b) => {
    const isAOutside = OUTSIDE_STEEL_IDS.includes(a.id) || OUTSIDE_WOODEN_IDS.includes(a.id) || OUTSIDE_OTHER_IDS.includes(a.id);
    const isBOutside = OUTSIDE_STEEL_IDS.includes(b.id) || OUTSIDE_WOODEN_IDS.includes(b.id) || OUTSIDE_OTHER_IDS.includes(b.id);
    if (isAOutside && !isBOutside) return -1;
    if (!isAOutside && isBOutside) return 1;
    return 0;
  });

  sortedForRep.forEach(p => {
    if (!p.series) return;
    const seriesKey = `${p.category}|${p.series}`;
    if (!seriesGroups[seriesKey]) {
      seriesGroups[seriesKey] = p;
      representatives.push(p.id);
    }
  });

  filteredProducts = filteredProducts.filter((product) => {
    return representatives.includes(product.id);
  });

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

  if (product.category === 'Wooden Furniture') {
    // Finish options removed from the product details view
  }
}

function formatDimensionsHtml(dimStr) {
  if (!dimStr) return '';
  const groups = dimStr.split('|');
  let html = '<div class="formatted-dimensions" style="display: flex; flex-direction: column; gap: 8px; text-align: left; line-height: 1.4;">';
  
  groups.forEach((group) => {
    group = group.trim();
    if (!group) return;
    
    let label = '';
    let sizeListStr = group;
    const colonIndex = group.indexOf(':');
    if (colonIndex !== -1) {
      label = group.substring(0, colonIndex + 1).trim();
      sizeListStr = group.substring(colonIndex + 1).trim();
    }
    
    const sizes = sizeListStr.split('/').map(s => s.trim()).filter(s => s);
    if (sizes.length > 0) {
      html += '<div class="dimension-group" style="display: flex; flex-direction: column; gap: 2px; margin-bottom: 4px;">';
      
      const firstLineText = label ? `<strong style="color: var(--color-maroon); font-weight: 700;">${label}</strong> ${sizes[0]}` : sizes[0];
      html += `<div class="dimension-line">${firstLineText}</div>`;
      
      for (let i = 1; i < sizes.length; i++) {
        html += `<div class="dimension-line" style="padding-left: ${label ? '12px' : '0'}; color: var(--color-text-muted);">${sizes[i]}</div>`;
      }
      html += '</div>';
    }
  });
  
  html += '</div>';
  return html;
}

function renderProductInfoCards(product, hasSizeOptions) {
  const container = document.getElementById('details-info-cards');
  if (!container) return;
  container.innerHTML = '';

  const cards = [];
  if (product.dimensions) {
    cards.push(['Dimensions', product.dimensions]);
  }

  cards.forEach(([label, value]) => {
    const card = document.createElement('div');
    card.className = 'info-card';
    const labelSpan = document.createElement('span');
    labelSpan.className = 'info-card-label';
    labelSpan.textContent = label;
    const valueSpan = document.createElement('span');
    valueSpan.className = 'info-card-value';
    if (label === 'Dimensions') {
      valueSpan.innerHTML = formatDimensionsHtml(value);
    } else {
      valueSpan.textContent = value;
    }
    card.appendChild(labelSpan);
    card.appendChild(valueSpan);
    container.appendChild(card);
  });
}

function getSteelSubtype(product) {
  const id = product.id.toLowerCase();
  if (id.includes('almirah') || id.includes('locker') || id.includes('cabinet') || id.includes('wardrobe')) {
    return 'almirah';
  }
  if (id.includes('cot')) {
    return 'cot';
  }
  if (id.includes('table') || id.includes('stool') || id.includes('desk') || id.includes('pedestal')) {
    return 'table';
  }
  if (id.includes('rack') || id.includes('trolley')) {
    return 'rack';
  }
  if (id.includes('bookshelf')) {
    return 'bookshelf';
  }
  return 'other';
}

function getWoodenSubtype(product) {
  const id = product.id.toLowerCase();
  if (id.includes('wardrobe') || id.includes('vanity') || id.includes('dressing') || id.includes('tv') || id.includes('showcase')) {
    return 'wardrobe';
  }
  if (id.includes('mandir') || id.includes('pooja')) {
    return 'mandir';
  }
  if (id.includes('cot')) {
    return 'cot';
  }
  if (id.includes('desk') || id.includes('workstation') || id.includes('office') || id.includes('table')) {
    return 'office';
  }
  if (id.includes('sofa')) {
    return 'sofa';
  }
  if (id.includes('dining')) {
    return 'dining';
  }
  return 'other';
}

async function showProductDetailsBySlug(slug) {
  try {
    const res = await fetch(`${API_URL}/products/${slug}/`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      showProductDetails(data);
      routeTo('details');
    }
  } catch (err) {
    console.error(err);
  }
}

async function renderRelatedProducts(currentProduct) {
  const container = document.getElementById('related-products-carousel');
  if (!container) return;
  
  const relatedTitle = document.querySelector('#details-view h3.details-specs-title');
  const seriesNum = getProductSeriesNumber(currentProduct);
  const category = currentProduct.category_name || currentProduct.category;

  if (relatedTitle) {
    relatedTitle.textContent = "Color / Finish Gallery";
  }

  container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted);">Loading gallery...</p>';

  try {
    // Fetch variants from the API
    let url = `${API_URL}/products/?category=${encodeURIComponent(category)}&series=${seriesNum}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      
      container.innerHTML = '';
      if (data.length === 0) {
        container.innerHTML = '<p class="no-related" style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted);">No variants found.</p>';
      } else {
        // Render each variant as a plain image card
        data.forEach((variant) => {
          const card = document.createElement('div');
          card.className = 'variant-gallery-card';
          card.style.cssText = 'cursor: pointer; border: 2px solid var(--color-border); border-radius: 8px; overflow: hidden; background: var(--color-bg-cream); aspect-ratio: 1; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;';
          card.innerHTML = `<img src="${variant.image_url}" style="width: 100%; height: 100%; object-fit: contain;" onerror="this.src='logo.png';">`;
          
          card.onmouseenter = () => card.style.borderColor = 'var(--color-gold)';
          card.onmouseleave = () => card.style.borderColor = 'var(--color-border)';

          card.onclick = () => {
            showProductDetailsBySlug(variant.slug || variant.id);
          };
          container.appendChild(card);
        });
      }
    } else {
      throw new Error("Failed to fetch variants");
    }
  } catch (err) {
    console.error("Error fetching variants from API:", err);
    container.innerHTML = '<p class="no-related" style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted);">Could not load gallery.</p>';
  }
}

function showProductDetails(product) {
  if (!product) return;
  
  // If product is a Django catalogue product without variants or type defined, load details
  if (product.isFromDjango && !product.variants && product.type !== 'variant' && product.type !== 'series') {
    showProductDetailsBySlug(product.database_id || product.id);
    return;
  }

  // Reset scroll to top of page
  window.scrollTo(0, 0);
  
  const mainRow = document.querySelector('.details-main-row');
  const detailsInfo = document.querySelector('.details-info');
  const recommendationsTitle = document.querySelector('#details-view h3.details-specs-title');
  const recommendationsContainer = document.getElementById('related-products-carousel');

  const isVariant = (product.type === 'variant');

  if (isVariant) {
    // Hide details specifications panel
    if (detailsInfo) detailsInfo.style.display = 'none';
    if (mainRow) mainRow.classList.add('variant-only-view');
    
    // Hide recommendations/variant strip
    if (recommendationsTitle) recommendationsTitle.style.display = 'none';
    if (recommendationsContainer) recommendationsContainer.style.display = 'none';
    
    // Breadcrumbs
    if (detailsCrumbCategory) {
      detailsCrumbCategory.innerHTML = `<span style="cursor: pointer;" onclick="routeTo('listing', '${product.category_name}')">${product.category_name}</span> / <span style="cursor: pointer; text-decoration: underline; color: var(--color-maroon);" onclick="showProductDetailsBySlug('${product.series_slug}')">${product.series_name}</span>`;
    }
    if (detailsCrumbTitle) detailsCrumbTitle.textContent = product.color_label || 'Variant';
  } else {
    // Show details specifications panel
    if (detailsInfo) detailsInfo.style.display = 'block';
    if (mainRow) mainRow.classList.remove('variant-only-view');
    
    // Show recommendations/variant strip
    if (recommendationsTitle) recommendationsTitle.style.display = 'block';
    if (recommendationsContainer) recommendationsContainer.style.display = 'grid';
    
    // Breadcrumbs
    const seriesNum = getProductSeriesNumber(product);
    const seriesSuffix = seriesNum ? ` — Series ${seriesNum}` : '';
    if (detailsCrumbCategory) {
      detailsCrumbCategory.innerHTML = `<span style="cursor: pointer;" onclick="routeTo('listing', '${product.category}')">${product.category}</span> / <span>Series ${product.series}</span>`;
    }
    if (detailsCrumbTitle) detailsCrumbTitle.textContent = product.title;
  }

  if (detailsTitleText) detailsTitleText.textContent = product.title || product.name;
  if (detailsDescriptionText) detailsDescriptionText.textContent = product.description;
  
  const imgUrl = product.image_url || product.image || 'logo.png';
  if (detailsMainViewImage) {
    detailsMainViewImage.src = imgUrl;
    detailsMainViewImage.style.objectFit = 'contain';
    detailsMainViewImage.onerror = () => {
      detailsMainViewImage.onerror = null;
      detailsMainViewImage.src = getProductFallbackImage(product.category || product.category_name);
    };
  }

  // Zoom lens effect and Lightbox click
  const mainImageWrapper = document.getElementById('details-main-image-wrapper');
  const zoomOverlay = document.getElementById('details-zoom-overlay');
  
  if (mainImageWrapper) {
    mainImageWrapper.onclick = () => {
      openLightbox(imgUrl, product.title || product.name);
    };

    if (zoomOverlay) {
      mainImageWrapper.onmouseenter = () => {
        zoomOverlay.style.backgroundImage = `url('${imgUrl}')`;
      };
      mainImageWrapper.onmousemove = (e) => {
        const rect = mainImageWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;
        zoomOverlay.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
      };
    }
  }

  if (!isVariant) {
    if (detailsCategoryBadge) detailsCategoryBadge.textContent = product.category + (product.series ? ` — Series ${product.series}` : '');
    const sizeOptions = buildSizeOptions(product);
    renderProductVariants(product, sizeOptions);
    renderProductInfoCards(product, !!(sizeOptions && sizeOptions.length));
    
    // Render related products recommendation (variants)
    renderRelatedProducts(product);

    // Hook up CTA buttons
    const whatsappCta = document.getElementById('details-whatsapp-cta');
    if (whatsappCta) {
      whatsappCta.onclick = () => {
        const text = encodeURIComponent(`Hi Durga Furniture, I am interested in learning more about "${product.title}" (${product.category}).`);
        window.open(`https://wa.me/916369088233?text=${text}`, '_blank');
      };
    }

    const callCta = document.getElementById('details-call-cta');
    if (callCta) {
      callCta.onclick = () => {
        window.location.href = 'tel:+916369088233';
      };
    }

    // Hook up Details page Wishlist button
    const detailsWishlistBtn = document.getElementById('details-wishlist-btn');
    if (detailsWishlistBtn) {
      const isWishlisted = wishlist.includes(product.id);
      detailsWishlistBtn.classList.toggle('wishlisted-active', isWishlisted);
      const icon = detailsWishlistBtn.querySelector('i');
      if (icon) {
        icon.className = isWishlisted ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
      }
      const labelText = document.getElementById('details-wishlist-btn-label');
      if (labelText) {
        labelText.textContent = isWishlisted ? 'Wishlisted' : 'Add to Wishlist';
      }
      
      detailsWishlistBtn.onclick = (event) => {
        event.stopPropagation();
        toggleWishlist(product.id);
        
        const nowWishlisted = wishlist.includes(product.id);
        detailsWishlistBtn.classList.toggle('wishlisted-active', nowWishlisted);
        if (icon) {
          icon.className = nowWishlisted ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
        }
        if (labelText) {
          labelText.textContent = nowWishlisted ? 'Wishlisted' : 'Add to Wishlist';
        }
      };
    }
  }
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
      if (category) {
        categoryFilterCheckboxes.forEach((checkbox) => {
          checkbox.checked = checkbox.dataset.catValue === category;
        });
        filterCatalog();
      } else {
        categoryFilterCheckboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });
        filterCatalog();
      }
      showView('listing-view');
      break;
    case 'details':
      if (product) showProductDetails(product);
      showView('details-view');
      break;
    case 'wishlist':
      renderWishlist();
      showView('wishlist-view');
      break;
    case 'about':
      showView('about-view');
      break;
    case 'contact':
      showView('contact-view');
      break;
    case 'admin':
      // Replace the current state with storefront (home) to ensure back button lands on home
      history.replaceState({ route: 'home' }, '', '#home');
      history.pushState({ route: 'admin' }, '', '#admin');
      showView('admin-view');
      break;
    default:
      console.warn('Unknown route:', route);
      showView('home-view');
  }
}

window.routeTo = routeTo;
window.openMobileNav = openMobileNav;
window.closeMobileNav = closeMobileNav;

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
    closeMobileNav();
  });
});

// Category Banners click handlers
document.querySelectorAll('.category-banner-card').forEach((card) => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    const link = card.querySelector('.category-banner-link');
    const category = link?.dataset.category;
    if (category) {
      routeTo('listing', category);
    }
  });
});

const BASE_URL = "https://aizen222.pythonanywhere.com";
const API_URL = `${BASE_URL}/api`;

// FETCH PRODUCTS FROM DJANGO REST API AND POPULATE GLOBALLY
async function fetchDjangoProducts() {
  try {
    const res = await fetch(`${API_URL}/products/`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      const djangoProds = data.map(p => {
        const category = p.category || 'Other Furniture';
        return {
          id: String(p.id),
          title: p.name,
          category: category,
          series: p.series || '',
          badge: category === 'Steel Furniture' ? 'badge-steel' : 
                 category === 'Wooden Furniture' ? 'badge-wooden' : 'badge-other',
          image: p.image_url || 'logo.png',
          description: p.description || `${p.name} — high-quality showroom furniture item.`,
          dimensions: p.dimensions || 'Standard Dimensions',
          materials: p.material || 'Solid Wood / Steel',
          warranty: p.warranty || '5 Years Structural Warranty',
          availability: 'In Stock',
          price: p.price || 0,
          isFromDjango: true,
          database_id: p.database_id,
          variants: p.variants || [],
          type: p.type || 'series'
        };
      });
      
      // Make Django REST API database the sole source of truth for catalogue
      productData.length = 0;
      productData.push(...djangoProds);
      
      // Update admin stat catalog size
      const adminCatalogSize = document.getElementById('admin-stat-catalog-size');
      if (adminCatalogSize) {
        adminCatalogSize.textContent = productData.length;
      }
    }
  } catch (err) {
    console.warn("Could not load products from local Django database. Running catalog with mock file data.", err);
  } finally {
    filterCatalog();
    renderFeaturedProducts();
    renderAdminProductsTable();
  }
}

// Enrich static product data with their series property dynamically
function getStaticProductSeries(product) {
  const id = product.id.toLowerCase();
  
  if (product.category === 'Wooden Furniture') {
    if (id.includes('wardrobe') && !id.includes('dressing')) return '1';
    if (id.includes('tv') || id.includes('showcase')) return '2';
    if (id.includes('mandir') || id.includes('pooja')) return '3';
    if (id.includes('cot') || id.includes('bed')) return '4';
    if (id.includes('dressing') || id.includes('vanity') || id.includes('cabinet')) return '5';
    if (id.includes('office-table') || id.includes('office_table') || id.includes('study-desk') || id.includes('computer-table') || id.includes('desk-angled') || id.includes('office-desk') || id.includes('workstation') || id.includes('office-workstation')) return '6';
    if (id.includes('dining') || id.includes('dinning')) return '7';
    if (id.includes('sofa')) return '8';
    
    if (id.includes('wardrobe')) return '1';
    if (id.includes('office')) return '6';
    return '1';
  }
  
  if (product.category === 'Steel Furniture') {
    if (id.includes('almirah') || id.includes('locker') || id.includes('cabinet')) return '1';
    if (id.includes('cot') || id.includes('bed')) return '2';
    if (id.includes('table') || id.includes('desk') || id.includes('pedestal') || id.includes('stool')) return '3';
    if (id.includes('rack') || id.includes('trolley')) return '4';
    if (id.includes('bookshelf') || id.includes('bookcase')) return '5';
    return '1';
  }

  if (product.category === 'Other Furniture') {
    if (id.includes('stool')) return '1';
    if (id.includes('locker') || id.includes('almirah')) return '2';
    if (id.includes('table') || id.includes('office') || id.includes('series3')) return '3';
    return '1';
  }
  
  return null;
}

productData.forEach(p => {
  if (!p.series) {
    p.series = getStaticProductSeries(p);
  }
});

// Run sync at start
fetchDjangoProducts();

/* Lightbox Modal Globals */
function openLightbox(src, title) {
  const lightbox = document.getElementById('image-lightbox');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  if (lightbox && img) {
    img.src = src;
    if (caption) caption.textContent = title;
    lightbox.style.display = 'flex';
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('image-lightbox');
  if (lightbox) {
    lightbox.style.display = 'none';
  }
}

window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;

// ==========================================================================
// ADMIN PORTAL WIRING
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const adminAddBtn = document.getElementById('admin-add-product-btn');
  const adminBackdrop = document.getElementById('modal-admin-backdrop');
  const adminCloseBtn = document.getElementById('admin-modal-close-btn');
  const adminCancelBtn = document.getElementById('admin-form-cancel');
  const adminForm = document.getElementById('admin-product-form');
  const adminCategorySelect = document.getElementById('admin-prod-category');
  const adminSeriesGroup = document.getElementById('admin-prod-series-group');
  const adminSeriesSelect = document.getElementById('admin-prod-series');
  const adminUploadBtn = document.getElementById('admin-cloudinary-upload-btn');
  const adminImageUrlInput = document.getElementById('admin-prod-image-url');

  let cloudinaryConfig = { cloud_name: '', upload_preset: '' };

  // Fetch Cloudinary credentials from django REST API
  async function fetchCloudinaryConfig() {
    try {
      const res = await fetch(`${API_URL}/cloudinary-config/`, {
        cache: 'no-store'
      });
      if (res.ok) {
        cloudinaryConfig = await res.json();
      }
    } catch (err) {
      console.warn("Could not load Cloudinary config from Django backend.", err);
    }
  }

  fetchCloudinaryConfig();

  // Cloudinary widget or local file input callback helper
  if (adminUploadBtn && adminImageUrlInput) {
    adminUploadBtn.addEventListener('click', () => {
      if (!cloudinaryConfig.cloud_name || !cloudinaryConfig.upload_preset) {
        alert("Cloudinary credentials not loaded. Opening local file selector fallback.");
        const localInput = document.createElement('input');
        localInput.type = 'file';
        localInput.accept = 'image/*';
        localInput.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (readEvent) => {
              adminImageUrlInput.value = readEvent.target.result;
              showToast("Local file preview loaded!");
            };
            reader.readAsDataURL(file);
          }
        };
        localInput.click();
        return;
      }

      // Open Cloudinary widget
      cloudinary.openUploadWidget({
        cloudName: cloudinaryConfig.cloud_name,
        uploadPreset: cloudinaryConfig.upload_preset,
        sources: ['local', 'url', 'camera'],
        showAdvancedOptions: false,
        cropping: false,
        multiple: false,
        defaultSource: 'local',
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#D8D4CF',
            tabIcon: '#C5A880',
            menuIcons: '#5A615A',
            textDark: '#1C1512',
            textLight: '#FFFFFF',
            link: '#C5A880',
            action: '#C5A880',
            inactiveTabIcon: '#8E9A8E',
            error: '#E24C4C',
            inProgress: '#C5A880',
            complete: '#20B2AA',
            sourceBg: '#F5F5F0'
          }
        }
      }, (error, result) => {
        if (!error && result && result.event === "success") {
          adminImageUrlInput.value = result.info.secure_url;
          showToast("Image uploaded successfully!");
        }
      });
    });
  }

  // Show/Hide and populate Series select dropdown dynamically
  function updateSeriesDropdown(categoryVal, selectedSeriesVal = '') {
    if (!adminSeriesGroup || !adminSeriesSelect) return;
    
    adminSeriesGroup.style.display = 'block';
    adminSeriesSelect.setAttribute('required', 'required');
    adminSeriesSelect.innerHTML = '';
    
    let maxSeries = 5;
    if (categoryVal === 'Wooden Furniture') maxSeries = 8;
    else if (categoryVal === 'Other Furniture') maxSeries = 3;
    
    for (let i = 1; i <= maxSeries; i++) {
      const opt = document.createElement('option');
      opt.value = String(i);
      opt.textContent = `Series ${i}`;
      adminSeriesSelect.appendChild(opt);
    }
    if (selectedSeriesVal) {
      adminSeriesSelect.value = String(selectedSeriesVal);
    }
  }

  if (adminCategorySelect) {
    adminCategorySelect.addEventListener('change', (e) => {
      updateSeriesDropdown(e.target.value);
    });
  }

  // Open Add Product Modal
  if (adminAddBtn && adminBackdrop) {
    adminAddBtn.addEventListener('click', () => {
      adminForm.reset();
      document.getElementById('admin-product-edit-id').value = '';
      document.getElementById('admin-modal-title').textContent = 'Add New Product';
      updateSeriesDropdown(adminCategorySelect.value);
      adminBackdrop.classList.add('open');
    });
  }

  // Close Modal functions
  function closeAdminModal() {
    if (adminBackdrop) adminBackdrop.classList.remove('open');
  }

  if (adminCloseBtn) adminCloseBtn.addEventListener('click', closeAdminModal);
  if (adminCancelBtn) adminCancelBtn.addEventListener('click', closeAdminModal);

  // Form Submission
  if (adminForm) {
    adminForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const editId = document.getElementById('admin-product-edit-id').value;
      const title = document.getElementById('admin-prod-title').value.trim();
      const category = adminCategorySelect.value;
      const series = adminSeriesSelect.value;
      const price = parseFloat(document.getElementById('admin-prod-price').value);
      const desc = document.getElementById('admin-prod-desc').value.trim();
      const dims = document.getElementById('admin-prod-dimensions').value.trim();
      const mats = document.getElementById('admin-prod-materials').value.trim();
      const warranty = document.getElementById('admin-prod-warranty').value.trim();
      const imageUrl = document.getElementById('admin-prod-image-url').value.trim();

      const payload = {
        name: title,
        category: category,
        series: series,
        price: price,
        description: desc,
        dimensions: dims,
        material: mats,
        warranty: warranty,
        image_url: imageUrl || 'logo.png'
      };

      try {
        let res;
        if (editId) {
          res = await fetch(`${API_URL}/products/${editId}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } else {
          res = await fetch(`${API_URL}/products/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }

        if (res.ok) {
          showToast(editId ? 'Product updated successfully!' : 'Product added successfully!');
          closeAdminModal();
          await fetchDjangoProducts();
        } else {
          alert('Failed to save product in backend. Please ensure the Django server is online.');
        }
      } catch (err) {
        console.error(err);
        alert('API Connection error while saving product.');
      }
    });
  }
});

// Render the CRUD list inside the admin panel inventory table
function renderAdminProductsTable() {
  const tbody = document.getElementById('admin-products-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  // Render only products synced from the Django database
  const djangoProducts = productData.filter(p => p.isFromDjango);

  if (djangoProducts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 24px; color: var(--color-text-muted);">
          No uploaded items found. Add a new product to begin.
        </td>
      </tr>
    `;
    return;
  }

  djangoProducts.forEach((p) => {
    const tr = document.createElement('tr');
    
    // Format series text for column view
    const seriesText = p.series ? ` — Series ${p.series}` : '';

    tr.innerHTML = `
      <td>
        <img src="${p.image}" alt="${p.title}" style="width: 44px; height: 44px; object-fit: contain; background-color: var(--color-bg-cream); border-radius: 4px;">
      </td>
      <td>
        <div style="font-weight:600; color:var(--color-text-espresso);">${p.title}</div>
        <div style="font-size:10px; color:var(--color-text-muted);">ID: ${p.id}</div>
      </td>
      <td>
        <span style="font-size:11px; font-weight:500; color:var(--color-text-espresso);">${p.category}${seriesText}</span>
      </td>
      <td>₹${(p.price || 0).toLocaleString('en-IN')}</td>
      <td>${p.dimensions || 'N/A'}</td>
      <td>
        <div style="display:flex; gap: 8px;">
          <button class="btn-outline" onclick="editProduct('${p.database_id}')" style="padding: 4px 8px; font-size:10px; height:auto; width:auto;"><i class="fa-solid fa-pen"></i></button>
          <button class="btn-outline" onclick="deleteProduct('${p.database_id}')" style="padding: 4px 8px; font-size:10px; height:auto; width:auto; border-color:#E24C4C; color:#E24C4C;"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// global action functions for edit and delete clicks
window.editProduct = function(productId) {
  const product = productData.find(p => String(p.database_id) === String(productId));
  if (!product) return;

  const adminBackdrop = document.getElementById('modal-admin-backdrop');
  const adminCategorySelect = document.getElementById('admin-prod-category');
  
  document.getElementById('admin-product-edit-id').value = product.database_id;
  document.getElementById('admin-prod-title').value = product.title;
  document.getElementById('admin-prod-price').value = product.price || '';
  document.getElementById('admin-prod-desc').value = product.description;
  document.getElementById('admin-prod-dimensions').value = product.dimensions;
  document.getElementById('admin-prod-materials').value = product.materials;
  document.getElementById('admin-prod-warranty').value = product.warranty;
  adminCategorySelect.value = product.category;
  
  // Set image URL value
  document.getElementById('admin-prod-image-url').value = product.image || '';

  // Update Series select dropdown and set its active value
  const adminSeriesSelect = document.getElementById('admin-prod-series');
  const adminSeriesGroup = document.getElementById('admin-prod-series-group');
  if (adminSeriesGroup && adminSeriesSelect) {
    adminSeriesGroup.style.display = 'block';
    adminSeriesSelect.setAttribute('required', 'required');
    adminSeriesSelect.innerHTML = '';
    let maxSeries = 5;
    if (product.category === 'Wooden Furniture') maxSeries = 8;
    else if (product.category === 'Other Furniture') maxSeries = 3;
    for (let i = 1; i <= maxSeries; i++) {
      const opt = document.createElement('option');
      opt.value = String(i);
      opt.textContent = `Series ${i}`;
      adminSeriesSelect.appendChild(opt);
    }
    adminSeriesSelect.value = String(product.series || '1');
  }

  document.getElementById('admin-modal-title').textContent = 'Edit Product';
  if (adminBackdrop) adminBackdrop.classList.add('open');
};

window.deleteProduct = async function(productId) {
  if (!confirm('Are you sure you want to delete this product from the database?')) return;
  
  try {
    const res = await fetch(`${API_URL}/products/${productId}/`, {
      method: 'DELETE'
    });
    if (res.ok) {
      showToast('Product deleted successfully!');
      await fetchDjangoProducts();
    } else {
      alert('Failed to delete product from backend.');
    }
  } catch (err) {
    console.error(err);
    alert('API connection error during deletion.');
  }
};

// Toast notification helper
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const toastText = document.getElementById('toast-text');
  if (toast && toastText) {
    toastText.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}
window.showToast = showToast;

// Hook into routeTo to manage history on mobile
const originalRouteTo = window.routeTo;
let isPoppingState = false;
let activeProductSlug = null;
let currentOverlay = null;

window.routeTo = function(route, category, product) {
  // Clear active overlay tracking to prevent logical back-navigation loops during direct routing
  currentOverlay = null;

  if (originalRouteTo) originalRouteTo(route, category, product);
  
  // Mobile-only History Management
  if (window.innerWidth < 768 && !isPoppingState) {
    if (route === 'details') {
      history.pushState({ route: 'details', slug: activeProductSlug }, '', '#details');
    } else if (route !== 'admin') {
      history.pushState({ route: route, category: category, product: product }, '', '#' + route);
    }
  }
};

// Android System Back Button & Routing History Manager (Mobile-only IIFE)
(function() {
  if (window.innerWidth >= 768) return; // STRICT RULE: Fix ONLY the mobile behavior.

  // Initialize baseline state on window load
  window.addEventListener('load', () => {
    if (!history.state) {
      history.replaceState({ route: 'home' }, '', '#home');
    }
  });

  // Hook into showProductDetailsBySlug to capture the active product details slug
  let originalShowProductDetailsBySlug = window.showProductDetailsBySlug;
  if (!originalShowProductDetailsBySlug && typeof showProductDetailsBySlug !== 'undefined') {
    originalShowProductDetailsBySlug = showProductDetailsBySlug;
  }
  
  if (originalShowProductDetailsBySlug) {
    window.showProductDetailsBySlug = function(slug) {
      activeProductSlug = slug;
      if (window.innerWidth < 768 && !isPoppingState) {
        history.pushState({ route: 'details', slug: slug }, '', '#details');
      }
      return originalShowProductDetailsBySlug(slug);
    };
  }

  // Handle popstate (Android back button / back gesture)
  window.addEventListener('popstate', (event) => {
    isPoppingState = true;
    
    try {
      // 1. Close mobile menu if open
      const menuPanel = document.querySelector('.mobile-nav-panel.open');
      if (menuPanel) {
        if (window.closeMobileNav) window.closeMobileNav();
        currentOverlay = null;
        return;
      }

      // 2. Close modals if open
      const openModal = document.querySelector('.modal-backdrop.open');
      if (openModal) {
        openModal.classList.remove('open');
        currentOverlay = null;
        return;
      }

      // 3. Close lightbox if open
      const lightbox = document.getElementById('image-lightbox');
      if (lightbox && lightbox.style.display === 'flex') {
        if (window.closeLightbox) window.closeLightbox();
        currentOverlay = null;
        return;
      }

      // 4. Handle route transition
      if (event.state && event.state.route) {
        const state = event.state;
        if (state.route === 'details' && state.slug) {
          if (originalShowProductDetailsBySlug) {
            originalShowProductDetailsBySlug(state.slug);
          }
        } else {
          if (originalRouteTo) {
            originalRouteTo(state.route, state.category, state.product);
          }
        }
      } else {
        // Fallback to home if no state
        if (originalRouteTo) {
          originalRouteTo('home');
        }
      }
    } finally {
      // Reset popping flag after a tiny timeout
      setTimeout(() => {
        isPoppingState = false;
      }, 50);
    }
  });

  // Watch for UI overlay openings and push history states automatically
  const overlayObserver = new MutationObserver((mutations) => {
    if (window.innerWidth >= 768) return;
    
    mutations.forEach((mutation) => {
      const target = mutation.target;
      let isOpen = false;

      if (mutation.attributeName === 'class') {
        isOpen = target.classList.contains('open');
      } else if (mutation.attributeName === 'style') {
        isOpen = target.style.display === 'flex';
      }

      if (isOpen) {
        if (!isPoppingState && currentOverlay !== target) {
          currentOverlay = target;
          history.pushState({ overlay: true }, '', window.location.hash);
        }
      } else {
        if (!isPoppingState && currentOverlay === target) {
          currentOverlay = null;
          history.back();
        }
      }
    });
  });

  const startObserving = () => {
    const elMenu = document.querySelector('.mobile-nav-panel');
    const elAdmin = document.querySelector('#modal-admin-backdrop');
    const elLightbox = document.querySelector('#image-lightbox');

    if (elMenu) overlayObserver.observe(elMenu, { attributes: true, attributeFilter: ['class'] });
    if (elAdmin) overlayObserver.observe(elAdmin, { attributes: true, attributeFilter: ['class'] });
    if (elLightbox) overlayObserver.observe(elLightbox, { attributes: true, attributeFilter: ['style'] });
  };

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', startObserving);
  } else {
    startObserving();
  }
})();
