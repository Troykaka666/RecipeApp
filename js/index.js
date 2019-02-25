import search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from './views/base';

/** Global state of the app
 *  - seach object
 *  current recipe object
 * shopping list object
 * liked recipes
 * 
 */

const state ={};

const controlSearch = async () => {
    // Get query from view
    const query = searchView.getInput();
    

    if(query){
        // New Search object and add to state
        state.search = new search(query);

        //Prepare UI for result
        searchView.clearInput();
        
        //Search for recipes
        await state.search.getResults();
        
        //Render results on UI
        
        searchView.renderResults(state.search.result);
        
    }
}


elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// const Search = new search('pizza');

