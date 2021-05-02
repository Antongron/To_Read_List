export class BooksUI {
    searchResultHolder;
    bookInfoHolder;
  
    currentPage = [];
  
    api;
  
    constructor(api) {
      this.searchResultHolder = document.getElementById("searchResultHolder");
      this.bookInfoHolder = document.getElementById("bookInfoHolder");
  
      const searchInput = document.getElementById("searchInput"),
            goButton = document.getElementById("goButton"),
            previousPage = document.getElementById("previousPage"),
            nextPage = document.getElementById("nextPage"),
            foundItem = document.getElementById("foundItem"),
            startItem = document.getElementById("startItem"),
            pageSize = document.getElementById("pageSize"),
            toReadList = document.getElementById("toReadList"),
            addBook = document.createElement("button");
      addBook.innerHTML = `Add book to Read List`;
      addBook.classList = "addBtn";

      let numPage = 1;
      let temporarySearchHolder;
      let temporaryBookHolder;
      let toReadHolder = [];
      
      
  
      let numItems;
      previousPage.addEventListener("click", () => {
        
        if ((numPage-1) < 1  ) {
          alert("It's the first page")
          return
        }
        numPage--;
        const querry = searchInput.value;
        if (!querry) {
          return;
        }
        api.search(querry, numPage).then(page => {
          this.processSearchResult(page);
          startItem.innerText = `Start: ${page.start}`;
          pageSize.innerText =`Page size: ${page.docs.length}`;
        });
      });

      nextPage.addEventListener("click", () => {
        
        if ((numPage + 1) > (numItems/100 +1 ) ) {
          alert("It's the last page")
          return
        }
        numPage++;
        const querry = searchInput.value;
        if (!querry) {
          return;
        }
        api.search(querry, numPage).then(page => {
          this.processSearchResult(page);
          startItem.innerText = `Start: ${page.start}`;
          pageSize.innerText =`Page size: ${page.docs.length}`;
        });
      })
  
      goButton.addEventListener("click", () => {
        const querry = searchInput.value;
        if (!querry) {
          return;
        }

        numPage = 1;
        
  
        api.search(querry, numPage).then(page => {
          this.processSearchResult(page);
          numItems = page.numFound;
          foundItem.innerText = `Found: ${numItems}`;
          startItem.innerText = `Start: ${page.start}`;
          pageSize.innerText =`Page size: ${page.docs.length}`;
          temporarySearchHolder = page;
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
        temporaryBookHolder = selectedBook;
        console.log(temporaryBookHolder);
        targetDiv.classList.add("select-book");
        let languages;
        if (selectedBook.language !== undefined) {
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
        bookInfoHolder.appendChild(addBook);
      });

      let toReadHTML = document.createElement("div");
      const renderToReadHTML = () => {
        toReadHolder.forEach( item => {
        let languages;
        if (item.language === undefined ) {
          languages = "information of language not found"
        } else { languages = item.language };
        let sub;
        if (item.subtitle === undefined ) {
          sub = ""
        } else { sub = item.subtitle }
        let author;
        if(item.author_name === undefined ) {
          author = "information of author not found"
        } else { author = item.author_name };
      
        
        toReadHTML.innerHTML += `
        <div id="${item.id}">
          <h1>${item.title} (${languages})</h1>
          <p>${sub}</p>
          <p>${author}</p>
          <button id="mark">Mark as read</button>
          <button id="${item.id} remove">Remove</button>
        </div>
        `;
      })};
      let keys;
      
      if (localStorage.length > 0) {
        for( let i = 0; i < localStorage.length; i++) {
          keys = localStorage.key(i);
          toReadHolder.push(JSON.parse(localStorage.getItem(keys)));
      };
      toReadHolder[0] = toReadHolder[0][0];
      renderToReadHTML();
      toReadList.appendChild(toReadHTML);
      };
      
      addBook.addEventListener("click", () => {
        let check = temporaryBookHolder.id;
        if (localStorage.length == 0) {
          toReadHolder.push(temporaryBookHolder);
          localStorage.setItem(check, JSON.stringify(temporaryBookHolder));
        };
         if(JSON.parse(localStorage.getItem(check)) === null ) {
          toReadHolder.push(temporaryBookHolder);
          localStorage.setItem(check, JSON.stringify(temporaryBookHolder));
        };
    
        toReadHTML.innerHTML = "";
        renderToReadHTML();

        toReadList.appendChild(toReadHTML);
        const markBtn = document.querySelector("#mark"),
              removeBtn = document.querySelector("#remove");
        
        Array.from(document.querySelectorAll("#mark"), function(el){
          el.onclick = function() {
            if(this.parentElement.className !== "mark") {
              this.parentElement.classList.add("mark");
              this.innerHTML = `Mark as unread`;
            } else {
              this.parentElement.classList.remove("mark");
              this.innerHTML = `Mark as read`;
            }
            ;
          }
        })
      }) 
    };
  
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
  };
  
