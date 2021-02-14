const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const noImageFound = document.getElementById('no-found-image');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '20267799-e84529f38bab89d3e3ad0f602';

// show images 
const showImages = (images) => {

  // display section based on images are found or not

  if (images.hits.length === 0) {
    imagesArea.style.display = 'none';
    noImageFound.style.display = 'block';
    const search = document.getElementById('search').value;
    noImageFound.innerHTML = `<h3 class="justify-content-center mt-3 p-3 text-white bg-danger">Sorry, no images found related to ${search}. </h3>`;
  } else if (images.hits.length > 0) {
    noImageFound.style.display = 'none';
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.hits.forEach(image => {
      let div = document.createElement('div');
      div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
      div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div)
    })
  }
  toggleSpinner();
  document.getElementById('search').value = '';
}

const getImages = (query) => {

  toggleSpinner();
  // To avoid empty query field submission

  if (!query) {
    alert('Please write your search query');
  } else {
    fetch(`https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo&pretty=true`)
      .then(response => response.json())
      .then(data => showImages(data))
      .catch(err => displayError('Something Went Wrong!! Please try again later!'))
  }

}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    sliders.splice(item, 1);
    element.classList.remove('added');
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // create slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image area
  imagesArea.style.display = 'none';
  const duration = document.getElementById('duration').value || 1000;
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })

  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, Math.max(duration, 1000));
  document.getElementById('duration').value = '';
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}
document.getElementById('search').addEventListener("keypress", function (e) {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
})
searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})

//display error message

const displayError = err => {
  const errorTag = document.getElementById('error-message');
  errorTag.innerText = err;
  toggleSpinner();
}

// display loading spinner

const toggleSpinner = () => {
  const spinner = document.getElementById('loading-spinner');
  spinner.classList.toggle('d-none');
}
