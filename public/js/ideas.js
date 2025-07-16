const API_BASE = "https://suitmedia-backend.suitdev.com/api/ideas";

const state = {
  page: parseInt(localStorage.getItem("page")) || 1,
  perPage: parseInt(localStorage.getItem("perPage")) || 10,
  sort: localStorage.getItem("sort") || "-published_at",
};

document.addEventListener("DOMContentLoaded", () => {
  const sortSelect = document.getElementById("sort");
  const perPageSelect = document.getElementById("perPage");

  if (sortSelect && perPageSelect) {
    sortSelect.value = state.sort;
    perPageSelect.value = state.perPage;

    sortSelect.addEventListener("change", () => {
      state.sort = sortSelect.value;
      state.page = 1;
      saveState();
      fetchIdeas();
    });

    perPageSelect.addEventListener("change", () => {
      state.perPage = parseInt(perPageSelect.value);
      state.page = 1;
      saveState();
      fetchIdeas();
    });
  }

  fetchIdeas();
});

function saveState() {
  localStorage.setItem("page", state.page);
  localStorage.setItem("perPage", state.perPage);
  localStorage.setItem("sort", state.sort);
}

async function fetchIdeas() {
  const url = `${API_BASE}?page[number]=${state.page}&page[size]=${state.perPage}&sort=${state.sort}&append[]=small_image&append[]=medium_image`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    const data = await res.json(); // Harus di atas sebelum dipakai
    console.log("API Response:", data);
    console.log("One idea sample:", data.data?.[0]);

    if (!data.data || data.data.length === 0) {
      renderEmptyMessage();
    } else {
      renderIdeas(data.data);

      // Update info jumlah data
      if (data.meta) {
        updateResultInfo(data.meta);
        renderPagination(data.meta); // ← Kalau pagination pakai total_pages & current_page
      }
    }
  } catch (err) {
    console.error("Gagal mengambil data:", err);
  }
}

function renderIdeas(ideas) {
  const container = document.getElementById("posts-container");
  if (!container) return;

  container.innerHTML = "";

  ideas.forEach(idea => {
    const title = idea.title || "Untitled";

    // Ambil URL gambar dari medium_image[0].url jika ada, fallback ke small_image[0].url, lalu placeholder
    const img =
      idea.medium_image?.[0]?.url?.replace(
        "https://assets.suitdev.com",
        "/assets-proxy"
      ) ||
      idea.small_image?.[0]?.url?.replace(
        "https://assets.suitdev.com",
        "/assets-proxy"
      ) ||
      "https://via.placeholder.com/400x300?text=No+Image";


    console.log("Image URL:", img); // 👈 Tambahan debug

    const card = document.createElement("div");
    card.className = "bg-white rounded shadow overflow-hidden flex flex-col";

    card.innerHTML = `
      <img src="${img}" alt="${title}" loading="lazy"
        class="w-full aspect-[4/3] object-cover" />
      <div class="p-4 flex-1 flex flex-col">
        <h2 class="text-lg font-semibold line-clamp-3">${title}</h2>
      </div>
    `;

    container.appendChild(card);
  });
}

function renderEmptyMessage() {
  const container = document.getElementById("posts-container");
  if (!container) return;
  container.innerHTML = `
    <div class="col-span-full text-center text-gray-500">
      Tidak ada ide yang tersedia untuk ditampilkan.
    </div>
  `;
}

function renderPagination(meta) {
  const total = meta.last_page;
  const current = meta.current_page;
  const container = document.getElementById("pagination");
  if (!container) return;

  container.innerHTML = "";

  const maxVisible = 5;
  let startPage = Math.max(1, current - Math.floor(maxVisible / 2));
  let endPage = startPage + maxVisible - 1;

  if (endPage > total) {
    endPage = total;
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  // Tombol First
  const firstBtn = document.createElement("button");
  firstBtn.textContent = "« First";
  firstBtn.className = `px-3 py-1 rounded text-sm transition ${
    current === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"
  }`;
  firstBtn.disabled = current === 1;
  firstBtn.addEventListener("click", () => {
    state.page = 1;
    saveState();
    fetchIdeas();
  });
  container.appendChild(firstBtn);

  // Tombol Prev
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "‹ Prev";
  prevBtn.className = `px-3 py-1 rounded text-sm transition ${
    current === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"
  }`;
  prevBtn.disabled = current === 1;
  prevBtn.addEventListener("click", () => {
    state.page = current - 1;
    saveState();
    fetchIdeas();
  });
  container.appendChild(prevBtn);

  // Ellipsis sebelum
  if (startPage > 1) {
    const ellipsisStart = document.createElement("span");
    ellipsisStart.textContent = "...";
    ellipsisStart.className = "px-2 text-gray-500";
    container.appendChild(ellipsisStart);
  }

  // Tombol Halaman Aktif
  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = `px-3 py-1 rounded text-sm transition ${
      i === current
        ? "bg-orange-600 text-white font-semibold"
        : "bg-gray-200 hover:bg-gray-300"
    }`;
    btn.addEventListener("click", () => {
      state.page = i;
      saveState();
      fetchIdeas();
    });
    container.appendChild(btn);
  }

  // Ellipsis sesudah
  if (endPage < total) {
    const ellipsisEnd = document.createElement("span");
    ellipsisEnd.textContent = "...";
    ellipsisEnd.className = "px-2 text-gray-500";
    container.appendChild(ellipsisEnd);
  }

  // Tombol Next
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next ›";
  nextBtn.className = `px-3 py-1 rounded text-sm transition ${
    current === total ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"
  }`;
  nextBtn.disabled = current === total;
  nextBtn.addEventListener("click", () => {
    state.page = current + 1;
    saveState();
    fetchIdeas();
  });
  container.appendChild(nextBtn);

  // Tombol Last
  const lastBtn = document.createElement("button");
  lastBtn.textContent = "Last »";
  lastBtn.className = `px-3 py-1 rounded text-sm transition ${
    current === total ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"
  }`;
  lastBtn.disabled = current === total;
  lastBtn.addEventListener("click", () => {
    state.page = total;
    saveState();
    fetchIdeas();
  });
  container.appendChild(lastBtn);
}


function updateResultInfo(meta) {
  const el = document.getElementById("result-info");
  if (!el || !meta) return;

  const from = meta.from || 0;
  const to = meta.to || 0;
  const total = meta.total || 0;

  el.textContent = `Showing ${from}–${to} of ${total} results`;
}