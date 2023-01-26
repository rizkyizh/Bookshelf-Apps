String.prototype.toTitleCase = function () {
  return this.replace(/^\w|\s\w|\b\s\w/g, (n) => n.toUpperCase());
};

function ButtonBookHover() {
  const allBookEl = document.querySelectorAll(".book");

  allBookEl.forEach((e) => {
    e.addEventListener("mouseout", function () {
      const btn_Book = e.children[1];
      btn_Book.classList.add("hidden-btn");
    });
    e.addEventListener("mouseover", function () {
      const btn_Book = e.children[1];
      btn_Book.classList.remove("hidden-btn");
    });
  });
}

function pesanDialog(cb) {
  const titleBook = document.getElementById("judul").value;
  const isiPesan = document.querySelector(".pesan");
  isiPesan.removeAttribute("hidden");
  isiPesan.innerText = cb(titleBook);
  setTimeout(function () {
    isiPesan.setAttribute("hidden", "");
  }, 3000);
}

const btnCancel = document.querySelector(".btn-cancel");
btnCancel.addEventListener("click", function () {
  hide();
});

function hide() {
  const editEl = document.querySelector(".edit-wrapper");
  editEl.setAttribute("hidden", "");
}
