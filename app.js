const FALLBACK_BOOKS = [
  { id: 1, title: "Bilinmeyen Kutuphane", author: "O. Yazar", isbn: "978-605-000-0000", shelf: "A-12", category: "Roman", status: "available" },
  { id: 2, title: "Derin Sistemler", author: "N. Uzman", isbn: "978-975-111-2233", shelf: "T-04", category: "Teknoloji", status: "loaned" },
  { id: 3, title: "Kurgu Tasarimi", author: "S. Editor", isbn: "978-625-888-9911", shelf: "K-19", category: "Kurgu", status: "overdue" },
  { id: 4, title: "Veri Yapisilari 101", author: "A. Ogretmen", isbn: "978-605-222-3344", shelf: "T-01", category: "Egitim", status: "available" },
  { id: 5, title: "Tarih Atlasi", author: "E. Arastirmaci", isbn: "978-975-444-5566", shelf: "H-07", category: "Tarih", status: "available" },
  { id: 6, title: "Sehir ve Insan", author: "M. Denemeci", isbn: "978-625-123-4567", shelf: "S-02", category: "Deneme", status: "loaned" },
  { id: 7, title: "Bilimsel Merak", author: "L. Bilim", isbn: "978-605-777-8899", shelf: "B-05", category: "Bilim", status: "available" },
  { id: 8, title: "Kayip Zamanin Notlari", author: "P. Anlatici", isbn: "978-975-000-1122", shelf: "R-14", category: "Edebiyat", status: "overdue" },
  { id: 9, title: "Tasarim Prensipleri", author: "D. UI", isbn: "978-625-999-0001", shelf: "T-09", category: "Tasarim", status: "available" },
  { id: 10, title: "Algoritmalarla Dusunmek", author: "K. Mantik", isbn: "978-605-101-2023", shelf: "T-02", category: "Teknoloji", status: "loaned" }
];

let allBooks = [];

function statusLabel(status) {
  if (status === "available") return "Uygun";
  if (status === "loaned") return "Oduncte";
  if (status === "overdue") return "Geciken";
  return "Bilinmiyor";
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function updateStats(books) {
  document.getElementById("bookCount").textContent = String(books.length);
  document.getElementById("availableCount").textContent = String(
    books.filter((b) => b.status === "available").length
  );
  document.getElementById("loanedCount").textContent = String(
    books.filter((b) => b.status === "loaned").length
  );
  document.getElementById("overdueCount").textContent = String(
    books.filter((b) => b.status === "overdue").length
  );
}

function renderBooks(books) {
  const tbody = document.getElementById("booksTbody");
  if (!books.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="message">Kayit bulunamadi.</td></tr>';
    return;
  }

  tbody.innerHTML = books
    .map(
      (book) => `
      <tr>
        <td>${escapeHtml(book.title)}</td>
        <td>${escapeHtml(book.author)}</td>
        <td>${escapeHtml(book.isbn)}</td>
        <td>${escapeHtml(book.shelf)}</td>
        <td>${escapeHtml(book.category)}</td>
        <td><span class="badge ${escapeHtml(book.status)}">${statusLabel(book.status)}</span></td>
      </tr>
    `
    )
    .join("");
}

function applySearch() {
  const q = document.getElementById("searchInput").value.trim().toLowerCase();
  const filtered = allBooks.filter(
    (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
  );
  renderBooks(filtered);
}

async function init() {
  try {
    const response = await fetch("./db.json", { cache: "no-store" });
    if (!response.ok) throw new Error("db.json okunamadi");
    const data = await response.json();
    allBooks = Array.isArray(data.books) ? data.books : [];
  } catch (error) {
    // file:// gibi ortamlarda fetch engellenirse sistem yine calissin.
    allBooks = FALLBACK_BOOKS;
  }

  renderBooks(allBooks);
  updateStats(allBooks);
  document.getElementById("searchInput").addEventListener("input", applySearch);
}

document.addEventListener("DOMContentLoaded", init);
