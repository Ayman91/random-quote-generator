//Todo: harcoded quotes [static quotes]
const quotes = [
  {
    id: 1,
    saved: false,
    author: 'Oscar Wilde',
    quote: 'Be yourself; everyone else is already taken',
    tags: [
      'attributed-no-source',
      'be - yourself',
      'gilbert - perreira',
      'honesty',
      'inspirational',
      'misattributed - oscar - wilde',
      'quote - investigator',
    ],
  },
  {
    id: 2,
    saved: false,
    author: 'Marilyn Monroe',
    quote:
      "I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can't handle me at my worst, then you sure as hell don't deserve me at my best.",
    tags: [
      'attributed - no - source',
      'best',
      'life',
      'love',
      'misattributed - marilyn - monroe',
      'mistakes',
      'out - of - control',
      'truth',
      'worst',
    ],
  },
  {
    id: 3,
    saved: false,
    author: 'Frank Zappa',
    quote: 'So many books, so little time',
    tags: ['books', 'humor'],
  },
  {
    id: 4,
    saved: false,
    author: 'Albert Einstein',
    quote:
      "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
    tags: [
      'attributed-no-source',
      'human-nature',
      'humor',
      'infinity',
      'philosophy',
      'science',
      'stupidity',
      'universe',
    ],
  },
  {
    id: 5,
    saved: false,
    author: 'Marcus Tullius Cicero',
    quote: 'A room without books is like a body without a soul.',
    tags: ['attributed-no-source', 'books', 'simile', 'soul'],
  },
  {
    id: 6,
    saved: false,
    author: 'Mae West',
    quote: 'You only live once, but if you do it right, once is enough.',
    tags: ['humor', 'life'],
  },
];

//* select HTML element function
const getElement = selector => document.querySelector(selector);

//* load saved quotes
let savedQuotes = JSON.parse(localStorage.getItem('savedQuotes'));

//* set an undefinied number for generate Random number function
let lastNumber;

//* save quotes
!savedQuotes && saveQuote(quotes);

//Todo: save quotes
function saveQuote(quotes) {
  localStorage.setItem('savedQuotes', JSON.stringify(quotes));
  savedQuotes = loadSavedQuotes();
}

// Todo: get all saved quotes
function loadSavedQuotes() {
  return JSON.parse(localStorage.getItem('savedQuotes'));
}

// Todo: generate Random Number
function getRandomNumber() {
  //* check if there is any saved quotes
  if (savedQuotes !== null) {
    let currentNumber = lastNumber;
    while (currentNumber === lastNumber && savedQuotes.length > 1) {
      currentNumber = Math.floor(Math.random() * savedQuotes.length);
    }
    lastNumber = currentNumber;
    return currentNumber;
  } else {
    saveQuote(quotes);
    return 0;
  }
}

function renderQuoteUi() {
  const randomIndex = getRandomNumber();
  if (!savedQuotes[randomIndex]) return;

  getElement('#card') &&
    (getElement('#card').innerHTML = `
  <div class="card-content">
  ${
    (savedQuotes[randomIndex].saved === true &&
      `<i class="bi bi-bookmark-star-fill saved-quote fs-1 text-light"></i>`) ||
    ''
  } 
     <div id="tags">
      ${savedQuotes[randomIndex].tags
        .map(
          item =>
            `<span class="badge text-light shadow-sm border" id="tag-name">${item}</span>`
        )
        .join(' ')}
     </div>
    <h1 id="quote" class="fst-italic fw-bold my-3">${
      savedQuotes[randomIndex].quote
    }</h1>
    <p class="text-light fst-italic fs-5">- ${
      savedQuotes[randomIndex].author
    }</p>
      <div class="d-grid gap-2 d-md-block ">
        <button onclick="save(${randomIndex})" ${
      savedQuotes[randomIndex].saved === true ? 'disabled' : ''
    } class="btn btn-outline-primary text-capitalize">
          <i class="bi bi-bookmark-fill"></i> save
        </button>
        <button
        id="copyBtn"
        onclick="copy(${randomIndex})"
        class="btn btn-outline-secondary text-capitalize">
        <i class="bi bi-check2-square hide"></i>  
        <i class="bi bi-copy "></i> copy
        </button>
      </div>
  </div>`);
  renderSavedQuotesUI(randomIndex);
}

//Todo: save quote
function save(id) {
  savedQuotes[id].saved = true;
  saveQuote(savedQuotes);
  renderQuoteUi();
  getNumberOfSavedQuotes();
  renderSavedQuotesUI();
}

//Todo: copy quote
function copy(id) {
  const copyBtn = getElement('#copyBtn');
  const defaultCopyHtml = copyBtn.innerHTML;

  //* copy quote and author name
  navigator.clipboard.writeText(
    `quote: "${quotes[id].quote}"\nauthor: ${quotes[id].author}`
  );

  copyBtn.innerHTML = '<i class="bi bi-check2-square"></i> Copied';

  //* resets to default HTML
  setTimeout(() => {
    copyBtn.innerHTML = defaultCopyHtml;
  }, 1000);
}

//Todo: get number of saved quotes
function getNumberOfSavedQuotes() {
  return savedQuotes.filter(item => item.saved === true).length;
}

//Todo: initiate render quote function
renderQuoteUi();

//* ----- BOOKMARK PAGE ----- //

//Todo: print number of updated saved quotes to the UI in bookmark page.
getElement('#savedQuotes') &&
  (getElement('#savedQuotes').innerHTML = `   
<span>${getNumberOfSavedQuotes() || 0}</span> saved quotes`);

function renderSavedQuotesUI() {
  if (getElement('.table')) {
    let quoteUi = '';
    savedQuotes.forEach((item, index) => {
      if (item.saved === true) {
        quoteUi += `
          <tr>
            <th scope="row">${index}</th>
            <td scope="row">${item.id}</td>
            <td>${item.author}</td>
            <td>${item.quote}</td>
            <td>
              <button class="btn btn-light shadow-sm"
                onclick="deleteSelectedSavedQuote(${index})">
                <i class="bi bi-trash2-fill text-danger"></i>
              </button>
            </td>
          </tr>`;
      }
    });
    getElement('tbody').innerHTML = quoteUi;
  }
}

//Todo: delete selected saved quote
function deleteSelectedSavedQuote(id) {
  savedQuotes[id].saved = false;
  //* update savedQuotes state
  saveQuote(savedQuotes);

  //* Update the UI
  renderSavedQuotesUI();
  renderQuoteUi();

  //* update the numbers of the saved quotes
  getElement('#savedQuotes').innerHTML = `   
    <span>${getNumberOfSavedQuotes() || 0}</span> saved quotes`;
}

//* EventListeners
getElement('#generateBtn') &&
  getElement('#generateBtn').addEventListener('click', renderQuoteUi);
