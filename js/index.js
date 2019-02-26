import search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 *  - seach object
 *  current recipe object
 * shopping list object
 * liked recipes
 * 
 */

const state ={};
let searchRes;

const controlSearch = async () => {
    // Get query from view
    const query = searchView.getInput();
    

    if(query){
        // New Search object and add to state
        state.search = new search(query);

        //Prepare UI for result
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        //Search for recipes
        await state.search.getResults();
        
        //Render results on UI
        clearLoader();
        searchRes = state.search.result;
        searchView.renderResults(state.search.result);
    }
}


elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// const Search = new search('pizza');

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        console.log(state.search.state);
        
        searchView.renderResults(state.search.result, goToPage);
    }
});