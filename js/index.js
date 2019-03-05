import search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView.js';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
// import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';
// import { listenerCount } from 'cluster';

/** Global state of the app
 *  seach object
 *  current recipe object
 * shopping list object
 * liked recipes
 * 
 */

const state ={};

/**
 * 
 */

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
        try{
            //Search for recipes
            await state.search.getResults();
                
            //Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        }catch(e){
            console.log(e);
            
            alert('Something wrong with the search...');
        }
    
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
        
        searchView.renderResults(state.search.state, goToPage);
    }
});

// Recipe controller
const controlRecipe = async () => {
    //GGET ID FROM URL
    const id = window.location.hash.replace('#', '');
    
    if(id){
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected search item
        searchView.highlingtSelected(id);

        //Create new recipe object
        state.recipe = new Recipe(id);

        try{
            //Get recipe data and parse ingredients 
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            //Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe, 
                state.likes.isLiked(id)
                );
        }catch(e){
            console.log(e);
            alert('Error processing recipe!');
        }
    }
}
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));

/*
    List Controller
*/ 

const controlList = () =>{
    //create a new list if there is none yet
    if(!state.list) state.list = new List();

    //Add each ingredient to the list 
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

//Hnndle delete and update list item events
elements.shopping.addEventListener('click', e=>{
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //Handle the delete method
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        //Delete from state
        state.list.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);

        //Handle the update
    }else if (e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }
});

/**
 * Like CONTROLLER
 */

 //just test
state.likes = new Likes();
likesView.toggleLikeMenu(state.likes.getNumLikes());


const controlLike = () =>{
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    //User has not yet liked current recipe 
    if(!state.likes.isLiked(currentID)){
        //Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        //toggle the like button
        likesView.toggleLikeBtn(true);

        //Add like to UI list 
        likesView.renderLike(newLike);
    //User has  yet liked current recipe 
    }else{
        //Remove like to the state
        state.likes.deleteLike(currentID);

        //toggle the like button
        likesView.toggleLikeBtn(false);

        //Remove like to UI list 
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}



//handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        //Decrease button is clicked 
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')){
        //Increase button is clicked 
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        //aDD INGREDIENTS TO SHOPPING LIST 


        controlList();
    }else if(e.target.matches('.recipe__love, .recipe__love *')){
        //Like controller
        controlLike();
    }
});

window.l = new List();