const searchTerm = document.querySelector("#search-term");
const searchResult = document.querySelector("#search-result");

searchTerm.focus();

searchTerm.addEventListener("input", (e) => {
  search(e.target.value);
});

// create a debounce function
const debounce = (fn, delay = 500) => {
  let timeoutId;

  return (...args) => {
    // cancel the previous timer
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    // setup a new timer
    timeoutId = setTimeout(() => {
      fn.apply(null, args);
    }, delay);
  };
};

// search method

const search = debounce(async (searchTerm) => {
  // if the search term is removed,
  // reset the search result
  if (!searchTerm) {
    // reset the search result
    searchResult.innerHTML = "";
    return;
  }

  try {
    // make an API request
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info|extracts&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${searchTerm}`;
    const response = await fetch(url);
    const searchResults = await response.json();

    // render search result
    const searchResultHtml = generateHTML(
      searchResults.query.search,
      searchTerm
    );

    // add the search result to the searchResultElem
    searchResult.innerHTML = searchResultHtml;
  } catch (error) {
    console.log(error);
  }
});

// const search = debounce(async (searchTerm) => {
//   try {
//     const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info|extracts&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${searchTerm}`;
//     const response = await fetch(url);
//     const searchResult = await response.json();
//     // show result in console
//     console.log({
//       term: searchTerm,
//       result: searchResult.query.search,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// strip html tags function
const stripHtml = (html) => {
  let div = document.createElement("div");
  div.textContent = html;
  return div.textContent || "";
};

// highlight function
const highlight = (str, keyword, className = "highlight") => {
  const h1 = `<span class="${className}"></span>`;
  return str.replace(new RegExp(keyword, "gi"), h1);
};

// Convert the search results to HTML
const generateHTML = (result, searchTerm) => {
  return result
    .map((result) => {
      const title = highlight(stripHtml(result.title), searchTerm);
      const snippet = highlight(stripHtml(result.snippet), searchTerm);

      return `<article>
                <a href="https://en.wikipedia.org/?curid=${result.pageid}">
                    <h2>${title}</h2>
                </a>
                <div class="summary">${snippet}...</div>
            </article>`;
    })
    .join("");

  //     return `
  //     <div class="result">
  //       <h2><a href="${result.url}" target="_blank">${result.title}</a></h2>
  //       <p>${highlight(stripHtml(result.snippet), searchTerm)}</p>
  //     </div>
  //   `;
};

// let timeoutId;
// const search = async (searchTerm) => {
//   // reset previous timer
//   if (timeoutId) {
//     clearTimeout(timeoutId);
//   }
//   //set up a new timer
//   timeoutId = setTimeout(async () => {
//     try {
//       const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info|extracts&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${searchTerm}`;
//       const response = await fetch(url);
//       const searchResult = await response.json();
//       // show result in console
//       console.log({
//         term: searchTerm,
//         result: searchResult.query.search,
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   }, 500);
// };
