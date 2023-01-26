document.addEventListener("DOMContentLoaded", function () {
  const daftarBuku = [];
  const RENDER_EVENT = "render-buku";
  const STORAGE_KEY = "TODO_APPS";

  const submitBuku = document.getElementById("form");
  submitBuku?.addEventListener("submit", function (event) {
    event?.preventDefault();
    masukkanBukuKeDaftarBuku();
    pesanDialog((e) => {
      return `Buku berjudul ${e
        .toLowerCase()
        .toTitleCase()} berhasil ditambahkan`;
    });
  });
  const rakBelumSelesai = document.getElementById("books");
  const rakSudahSelesai = document.getElementById("completed-books");

  const cariBukuSubmit = document.getElementById("search-wrapper");
  cariBukuSubmit?.addEventListener("submit", function (event) {
    rakBelumSelesai.innerHTML = "";
    rakSudahSelesai.innerHTML = "";
    event.preventDefault();
    putBooksOnShelf(getDataSearch());
    ButtonBookHover();
  });

  document.addEventListener(RENDER_EVENT, function () {
    rakBelumSelesai.innerHTML = "";
    rakSudahSelesai.innerHTML = "";
    putBooksOnShelf(daftarBuku);
    ButtonBookHover();
  });

  function putBooksOnShelf(dataBuku) {
    for (const isibuku of dataBuku) {
      const bukuElement = buatBuku(isibuku);
      if (isibuku.isComplete == true) {
        rakSudahSelesai?.append(bukuElement);
      } else {
        rakBelumSelesai?.append(bukuElement);
      }
    }
  }

  function getDataSearch() {
    const keyValueSearch = document.getElementById("caribuku").value;
    const ambilDataStorage = localStorage.getItem(STORAGE_KEY);
    const data = JSON.parse(ambilDataStorage);
    return cariSemuaBukuDariSeluruhHurufKataKunci(keyValueSearch, data);

    function cariSemuaBukuDariSeluruhHurufKataKunci(katakunci, datanya) {
      const result = [];
      const textKataKunci = katakunci.toLowerCase().split("");
      datanya.forEach((isi) => {
        if (textKataKunci.every((x) => isi.title.toLowerCase().includes(x))) {
          result.push(isi);
        }
      });
      return result;
    }
  }

  function masukkanBukuKeDaftarBuku() {
    const judul = document.getElementById("judul").value;
    const penulis = document.getElementById("penulis").value;
    const tahun = document.getElementById("tahun").value;
    const sudahdibaca = document.getElementById("selesaibaca").checked;
    const id = generateId();
    const bukuObject = generateDataObjectBuku(
      id,
      judul.toLowerCase().toTitleCase(),
      penulis.toLowerCase().toTitleCase(),
      tahun,
      sudahdibaca
    );
    daftarBuku.push(bukuObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveDataBukuKeStorage();

    function generateId() {
      return +new Date();
    }
    function generateDataObjectBuku(id, title, author, year, isComplete) {
      return {
        id,
        title,
        author,
        year,
        isComplete,
      };
    }
  }

  function buatBuku(buku) {
    const textTitle = document.createElement("h4");
    textTitle.innerText = buku.title;

    const textPenulis = document.createElement("p");
    textPenulis.innerText = buku.author;

    const textTahun = document.createElement("p");
    textTahun.innerText = buku.year;

    const parentEl_title_penulis_tahun = document.createElement("div");
    parentEl_title_penulis_tahun.classList.add("inner");
    parentEl_title_penulis_tahun.append(textTitle, textPenulis, textTahun);

    const containerBook = document.createElement("div");
    containerBook.classList.add("book");
    containerBook.append(parentEl_title_penulis_tahun);
    containerBook.setAttribute("id", `buku-${buku.id}`);

    const iconBtnEdit = document.createElement("button");
    iconBtnEdit.classList.add("edit-button");

    const iconBtnTrash = document.createElement("button");
    iconBtnTrash.classList.add("trash-button");

    const parentIconBtn = document.createElement("div");
    parentIconBtn.classList.add("btn-book");
    parentIconBtn.classList.add("hidden-btn");

    if (buku.isComplete == true) {
      const iconBtnUndo = document.createElement("button");
      iconBtnUndo.classList.add("undo-button");
      parentIconBtn.append(iconBtnUndo, iconBtnEdit, iconBtnTrash);
      containerBook.append(parentIconBtn);
      iconBtnUndo.addEventListener("click", function () {
        undoBookToUncompleted(buku.id);
      });

      iconBtnEdit.addEventListener("click", function () {
        const editEL = document.querySelector(".edit-wrapper");
        const judul_editEl = document.getElementById("edit-judul");
        const penulis_editEl = document.getElementById("edit-penulis");
        const tahun_editEl = document.getElementById("edit-tahun");
        const TrueOrFalse_editEl = document.getElementById("edit-selesaibaca");
        judul_editEl.value = buku.title;
        penulis_editEl.value = buku.author;
        tahun_editEl.value = buku.year;
        TrueOrFalse_editEl.checked = buku.isComplete;
        editEL.removeAttribute("hidden");
        editEL.setAttribute("dataID", buku.id);
      });

      iconBtnTrash.addEventListener("click", function () {
        removeBookFromList(buku.id);
      });
    } else {
      const iconBtnCheckToTrue = document.createElement("button");
      iconBtnCheckToTrue.classList.add("check-button");
      parentIconBtn.append(iconBtnCheckToTrue, iconBtnEdit, iconBtnTrash);
      containerBook.append(parentIconBtn);
      iconBtnCheckToTrue.addEventListener("click", function () {
        addBookToCompleted(buku.id);
      });

      iconBtnEdit.addEventListener("click", function () {
        const editEL = document.querySelector(".edit-wrapper");
        const judul_editEl = document.getElementById("edit-judul");
        const penulis_editEl = document.getElementById("edit-penulis");
        const tahun_editEl = document.getElementById("edit-tahun");
        const TrueOrFalse_editEl = document.getElementById("edit-selesaibaca");
        judul_editEl.value = buku.title;
        penulis_editEl.value = buku.author;
        tahun_editEl.value = buku.year;
        TrueOrFalse_editEl.checked = buku.isComplete;
        editEL.removeAttribute("hidden");
        editEL.setAttribute("dataID", buku.id);
      });

      iconBtnTrash.addEventListener("click", function () {
        removeBookFromList(buku.id);
      });
    }

    return containerBook;

    function undoBookToUncompleted(bukuid) {
      const bookTarget = cariDataBookBerdasarkanID(bukuid);

      if (bookTarget == null) {
        return;
      }

      bookTarget.isComplete = false;
      document.dispatchEvent(new Event(RENDER_EVENT));
      pesanDialog(() => {
        return `Buku ${buku.title} Belum Selesai dibaca`;
      });
      saveDataBukuKeStorage();
    }

    function removeBookFromList(bukuid) {
      const bookTarget = cariIndexBookBerdasarkanID(bukuid);
      if (bookTarget == null) {
        return;
      }
      daftarBuku.splice(bookTarget, 1);
      document.dispatchEvent(new Event(RENDER_EVENT));
      pesanDialog(() => {
        return `Hapus Buku ${buku.title} Berhasil`;
      });
      saveDataBukuKeStorage();
    }

    function cariIndexBookBerdasarkanID(idbook) {
      for (const index in daftarBuku) {
        if (daftarBuku[index].id == idbook) {
          return index;
        }
      }
      return -1;
    }

    function addBookToCompleted(bukuid) {
      const bookTarget = cariDataBookBerdasarkanID(bukuid);
      if (bookTarget.isComplete == null) return;

      bookTarget.isComplete = true;
      document.dispatchEvent(new Event(RENDER_EVENT));
      pesanDialog(() => {
        return `Buku ${buku.title} Telah Selesai dibaca`;
      });
      saveDataBukuKeStorage();
    }

    function cariDataBookBerdasarkanID(idbook) {
      for (const dataBuku of daftarBuku) {
        if (dataBuku.id == idbook) {
          return dataBuku;
        }
      }
      return null;
    }
  }

  if (localStorageTersedia()) {
    loadDataFromStorage();
  }

  function saveDataBukuKeStorage() {
    if (localStorageTersedia()) {
      const parsedDataToString = JSON.stringify(daftarBuku);
      localStorage.setItem(STORAGE_KEY, parsedDataToString);
    }
  }

  function localStorageTersedia() {
    if (typeof Storage === undefined) {
      alert("Browser kamu tidak mendukung local storage");
      return false;
    }
    return true;
  }

  function loadDataFromStorage() {
    const ambilDataDariStorage = localStorage.getItem(STORAGE_KEY);

    const data = JSON.parse(ambilDataDariStorage);

    if (data !== null) {
      for (const buku of data) {
        daftarBuku.push(buku);
      }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  const editBukuSubmit = document.getElementById("edit-form");
  editBukuSubmit.addEventListener("submit", function (event) {
    event.preventDefault();
    const data_ID = document
      .querySelector(".edit-wrapper")
      .getAttribute("dataid");
    ambilDataEdit((judul, penulis, tahun, isCompleteEdit) => {
      const targetBookEdit = cariDataBookBerdasarkanID(data_ID);
      targetBookEdit.title = judul;
      targetBookEdit.author = penulis;
      targetBookEdit.year = tahun;
      targetBookEdit.isComplete = isCompleteEdit;
    });
    hide();
    saveDataBukuKeStorage();
    document.dispatchEvent(new Event(RENDER_EVENT));

    pesanDialog(() => {
      return `Buku telah diedit`;
    });

    function ambilDataEdit(callback) {
      const judulInputEdit = document.getElementById("edit-judul").value;
      const penulisInputEdit = document.getElementById("edit-penulis").value;
      const tahunInputEdit = document.getElementById("edit-tahun").value;
      const selesaiChecked =
        document.getElementById("edit-selesaibaca").checked;

      return callback(
        judulInputEdit.toLowerCase().toTitleCase(),
        penulisInputEdit.toLowerCase().toTitleCase(),
        tahunInputEdit,
        selesaiChecked
      );
    }

    function cariDataBookBerdasarkanID(idbook) {
      for (const dataBuku of daftarBuku) {
        if (dataBuku.id == idbook) {
          return dataBuku;
        }
      }
      return null;
    }
  });
});
