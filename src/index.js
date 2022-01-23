import './sass/main.scss';
import ApiGetImages from './api-pixabay';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import galleryhbs from './gallery.hbs';
import 'simplelightbox/dist/simple-lightbox.min.css';
// import LoadMoreBtn from './load-btn';
let gallery = null;
const refs = {
    galleryRef: document.querySelector('.gallery'),
    formRef: document.querySelector('#search-form'),
    sentinel: document.querySelector('#sentinel'),
}
// const loadMoreBtn = new LoadMoreBtn({
//   selector: '[data-action="load-more"]',
//   hidden: true,
// });
const apiGetImages = new ApiGetImages();

function fetchImages() {
    //  loadMoreBtn.disable();
  apiGetImages.getImages().then(({ hits, totalHits }) => {
      renderMarkup(hits)
      apiGetImages.incrementPage();
      createLightBox();
       
     
      if (hits.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
       
      return;
      }
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
       if (apiGetImages.page > totalHits / apiGetImages.perPage) {
         Notiflix.Notify.warning(`We're sorry, but you've reached the end of search results.`);
         
         return;
        }
      // loadMoreBtn.enable();
       smoothScroll();
  });

}
function renderMarkup(images) {
    refs.galleryRef.insertAdjacentHTML('beforeend', galleryhbs(images));
}

function smoothScroll() {
    const { height: cardHeight } = refs.galleryRef.firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 0.5,
  behavior: 'smooth',
});
 
}

function createLightBox() {
    if (!gallery) {
        gallery = new SimpleLightbox('.gallery a', {
            captionsData: 'alt',
            captionDelay: 250,
    
        });
    }
  

    gallery.refresh();
}

function onSubmit(e) {
    // loadMoreBtn.show();
  e.preventDefault();
  apiGetImages.resetPage();
  refs.galleryRef.innerHTML = '';
  apiGetImages.query = refs.formRef.elements.searchQuery.value.trim();
  refs.formRef.elements.searchQuery.value = apiGetImages.query;

    
  if (apiGetImages.apiQuery === '') {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
   
    return;
  }
    fetchImages(); 

}
const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && apiGetImages.apiQuery !== '') {
      fetchImages();
    }
  });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});
observer.observe(refs.sentinel);


refs.formRef.addEventListener('submit', onSubmit);
// loadMoreBtn.refs.button.addEventListener('click', fetchImages); 
