const alert = document.querySelector("[show-alert]");
const closeAlert = document.querySelector("[close-alert]");
if (closeAlert) {
  const time = alert.getAttribute("data-time");
  alert.style.transition = "all 0.3s ease-in-out";
  closeAlert.addEventListener("click", () => {
    alert.remove();
  });
  if (alert) {
    setTimeout(() => {
      alert.remove();
    }, time);
  }
}

function renderProductList(products) {
  const container = document.querySelector(".products-wrapper .row");
  container.innerHTML = ""; // Xóa hết nội dung cũ để hiển thị mới

  if (!products || products.length === 0) {
    container.innerHTML = "<p>Không tìm thấy sản phẩm phù hợp.</p>";
    return;
  }

  products.forEach((product) => {
    // Tạo đoạn HTML cho từng sản phẩm
    const productHTML = `
  <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
    <div class="product-item card h-100">
      <img src="${product.thumbnail}" alt="${product.title}" class="card-img-top" />
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${product.title}</h5>
        <p class="card-text mt-auto">Giá: ${product.price || "Liên hệ"} $</p>
        <a href="/products/detail/${product.slug}" class="btn btn-primary mt-2">Xem chi tiết </a>
      </div>
    </div>
  </div>
`;
container.innerHTML += productHTML;
  });
}

const fetchFilteredProducts = async (filters) => {
  const params = new URLSearchParams();

  if (filters.category) params.append("category", filters.category);
  if (filters.brands && filters.brands.length > 0)
    params.append("brand", filters.brands.join(","));

  if (filters.price) {
    const [min, max] = filters.price.split("-");
    if (min) params.append("price_gte", min);
    if (max) params.append("price_lte", max);
  }

  const link = `/home/filter?${params.toString()}`;
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(link, options)
    .then((response) => response.json())
    .then((data) => {

      renderProductList(data.data);
    })
    .catch((error) => {
      console.error("Lỗi khi lấy sản phẩm:", error);
    });
};

document.addEventListener("DOMContentLoaded", () => {
  const filterForm = document.getElementById("filterForm");

  const categorySelect = document.getElementById("filter-category");

  const priceSelect = document.getElementById("filter-price");

  const brandCheckboxes = filterForm.querySelectorAll('input[name="brand"]');

  const resetBtn = document.getElementById("filterResetBtn");

  function getFilters() {
    const selectedCategory = categorySelect.value
    const selectedPrice = priceSelect.value;

    const selectedBrands = Array.from(brandCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
    console.log(selectedBrands);

    return {
      category: selectedCategory,
      price: selectedPrice,
      brands: selectedBrands,
    };
  }
  function updateUrlWithFilters(filters) {
    const params = new URLSearchParams();

    if (filters.category) params.append("category", filters.category);
    if (filters.brands && filters.brands.length > 0)
      params.append("brand", filters.brands.join(","));
    if (filters.price) params.append("price", filters.price);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    history.replaceState(null, "", newUrl);
  }

  function onFiltersChanged() {
    const filters = getFilters();
    updateUrlWithFilters(filters);
    fetchFilteredProducts(filters);
  }

  filterForm.addEventListener("change", onFiltersChanged);

  resetBtn.addEventListener("click", () => {
    categorySelect.value = "";
    priceSelect.value = "";
    brandCheckboxes.forEach((cb) => (cb.checked = false));
    onFiltersChanged();
  });

  onFiltersChanged(); // Load lần đầu
});
