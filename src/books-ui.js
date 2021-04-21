export class BooksUI {
    searchResultHolder;
    bookInfoHolder;
  
    currentPage = [];
  
    api;
  
    constructor(api) {
      this.searchResultHolder = document.getElementById("searchResultHolder");
      this.bookInfoHolder = document.getElementById("bookInfoHolder");
  
      const searchInput = document.getElementById("searchInput");
      const goButton = document.getElementById("goButton");
  
      goButton.addEventListener("click", () => {
        const querry = searchInput.value;
        if (!querry) {
          return;
        }
  
        api.search(querry).then(page => {
          this.processSearchResult(page);
        });
      });
  
      this.searchResultHolder.addEventListener("click", event => {
        const targetDiv = event.target;
        const id = targetDiv.id;
  
        const selectedBook = this.currentPage.find(item => item.id === id);
        if (!selectedBook) {
          return;
        }
  
        if (this.selectedBook) {
          const selectedBook = this.searchResultHolder.querySelector(
            "#" + this.selectedBook.id
          );
          if (selectedBook !== null)
          selectedBook.classList.remove("select-book");
        }
  
        this.selectedBook = selectedBook;
        targetDiv.classList.add("select-book");
        let languages;
        if (selectedBook.language != undefined) {
          languages = selectedBook.language.join(", ");
        } else {
          languages = "information not found";
        };

        let yearsPublich;
        if (selectedBook.publish_year != undefined) {
          yearsPublich = selectedBook.publish_year.join(", ")
        } else {
          yearsPublich = "information not found";
        };

        let subtitleBook;
        if (selectedBook.subtitle != undefined) {
          subtitleBook = selectedBook.subtitle;
        } else {
          subtitleBook = '';
        }

        let hasFullText;
        if(selectedBook.has_fulltext === true) {
          hasFullText = "yes &#128522;";
        } else {
          hasFullText = "not now &#128532;";
        }
  
        this.bookInfoHolder.innerHTML = `
        <div class="sticky">
          <h2>${selectedBook.title}</h2>
          <p>${subtitleBook}</p>
          <div>Languages available: ${languages}</div>
          <div>Full text avaliable:${hasFullText}</div>
          <div>First published year: ${selectedBook.first_publish_year}</div>
          <div>Years published: ${yearsPublich}</div>
        </div>
        `;
      });
    }
  
    processSearchResult(page) {
      page.docs.forEach(item => {
        item.id = item.key.split("/").pop();
      });
  
      this.currentPage = page.docs;
  
      const booksHTML = page.docs.reduce((acc, item) => {
        return (
          acc +
          `
            <div id="${item.id}" class="book-info">${item.title}</div>
          `
        );
      }, "");
  
      this.searchResultHolder.innerHTML = booksHTML;
    }
  }
  