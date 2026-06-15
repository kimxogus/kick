// 공통 렌더링/상호작용 유틸 (데모용, localStorage로 좋아요 상태만 임시 저장)

function getLikedSet() {
  try {
    return new Set(JSON.parse(localStorage.getItem("kick_liked") || "[]"));
  } catch (e) {
    return new Set();
  }
}

function saveLikedSet(set) {
  localStorage.setItem("kick_liked", JSON.stringify(Array.from(set)));
}

function getLikeCount(product) {
  const liked = getLikedSet();
  return product.likes + (liked.has(product.id) ? 1 : 0);
}

function toggleLike(productId, button, countEl) {
  const liked = getLikedSet();
  const product = KICK_PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  if (liked.has(productId)) {
    liked.delete(productId);
    button.classList.remove("liked");
  } else {
    liked.add(productId);
    button.classList.add("liked");
  }
  saveLikedSet(liked);
  if (countEl) countEl.textContent = getLikeCount(product);
}

function buildNav(active) {
  const items = [
    { href: "index.html", label: "홈", key: "home" },
    { href: "week.html", label: "위클리보드", key: "week" },
    { href: "products.html", label: "탐색", key: "products" },
    { href: "contest.html", label: "콘테스트", key: "contest" },
  ];

  const links = items
    .map((item) => {
      const cls = item.key === active ? "nav-link active text-kick fw-bold" : "nav-link";
      return `<li class="nav-item"><a class="${cls}" href="${item.href}">${item.label}</a></li>`;
    })
    .join("");

  return `
  <nav class="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
    <div class="container">
      <a class="navbar-brand fs-3" href="index.html">킥 Kick</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navMenu">
        <ul class="navbar-nav ms-auto gap-2">
          ${links}
        </ul>
      </div>
    </div>
  </nav>`;
}

function buildFooter() {
  return `
  <footer class="py-4 mt-5 text-center text-muted small">
    <div class="container">
      <p class="mb-2">킥(Kick) — agent에게 말 한마디로 내 제품을 런칭하는 플랫폼 (데모)</p>
      <form class="d-flex justify-content-center gap-2" onsubmit="event.preventDefault(); alert('데모: 뉴스레터 구독은 추후 연결됩니다.');">
        <input type="email" class="form-control form-control-sm" style="max-width: 240px;" placeholder="이메일로 주간 뉴스레터 받기">
        <button class="btn btn-sm btn-kick" type="submit">구독</button>
      </form>
    </div>
  </footer>`;
}

function productCard(product) {
  const count = getLikeCount(product);
  return `
  <a href="product/index.html?id=${product.id}" class="card-product card h-100 shadow-sm">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <span class="product-emoji">${product.emoji}</span>
        <span class="badge bg-light text-dark border">${product.category}</span>
      </div>
      <h5 class="card-title mb-1">${product.name}</h5>
      <p class="card-text text-muted small mb-2">${product.tagline}</p>
      <div class="d-flex justify-content-between align-items-center">
        <span class="text-muted small">❤️ ${count}</span>
        <span class="text-muted small">${product.launchDate}</span>
      </div>
    </div>
  </a>`;
}

function renderProductGrid(containerId, products) {
  const el = document.getElementById(containerId);
  el.innerHTML = products
    .map((p) => `<div class="col-12 col-sm-6 col-lg-4 mb-4">${productCard(p)}</div>`)
    .join("");
}

function sortedByLikes(products) {
  return [...products].sort((a, b) => getLikeCount(b) - getLikeCount(a));
}

document.addEventListener("DOMContentLoaded", () => {
  const navEl = document.getElementById("nav");
  if (navEl) navEl.outerHTML = buildNav(navEl.dataset.active);

  const footerEl = document.getElementById("footer");
  if (footerEl) footerEl.outerHTML = buildFooter();
});
