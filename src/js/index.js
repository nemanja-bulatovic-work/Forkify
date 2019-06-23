import Search from './models/Search'
import Recipe from './models/Recipe'
import List from './models/List'
import Likes from './models/Likes';
import * as searchView from './view/searchView'
import * as recipeView from './view/recipeView'
import * as listView from './view/listView'
import * as likesView from './view/likesView'
import {elements, renderLoader, clearLoader} from './view/base'

const state = {}

const controllSearch = async () => {
    const query = searchView.getInput()
    if(query){
        state.search = new Search(query)
        searchView.clearInput()
        searchView.clearResult()
        renderLoader(elements.searchResult)
        await state.search.getResults()
        clearLoader()
        searchView.renderResult(state.search.result)
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault()
    controllSearch()
})

elements.searchResultPages.addEventListener('click', e => {
   const btn = e.target.closest('.btn-inline')
   if(btn){
       const goToPage = parseInt(btn.dataset.togo, 10)
       searchView.clearResult()
       searchView.renderResult(state.search.result, goToPage)
   }
})

const controllRecipe = async () => {
    const id = window.location.hash.replace('#', '')
    if(id){
            recipeView.clearRecipe()
            renderLoader(elements.recipe)
            if(state.search){
                searchView.highLightSelected(id)
            }
            state.recipe = new Recipe(id)
            await state.recipe.getRecipe()
            state.recipe.parseIngredients()
            state.recipe.calcTime()
            state.recipe.calcServings()
            clearLoader()
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id))
    }
}

['hashchange','load'].forEach(event => {
    return window.addEventListener(event, controllRecipe)
})

const controlList = () => {
    if(!state.list) {
        state.list = new List()
    }
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.unit, el.count, el.ingredient)
        listView.renderItem(item)
    })
}

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        state.list.deleteItem(id)
        listView.deleteItem(id)  
    }else if(e.target.matches('.shopping__count-value, .shopping__count-value *')){
        const val = parseFloat(e.target.value, 10)
        state.list.updateCount(id, val)
    }
})

const controlLike = () => {
    if(!state.likes){
        state.likes = new Likes()
    }
        const currId = state.recipe.id
        

        if(!state.likes.isLiked(currId)){
            likesView.toggleLikeBtn(true)
            const newLike = state.likes.addLike(currId, state.recipe.title, state.recipe.author, state.recipe.img)
            likesView.renderLike(newLike)
        }else{
            likesView.toggleLikeBtn(false)
            state.likes.deleteLike(currId)
            likesView.deleteLike(currId)
        }

    likesView.toggleLikeMenu(state.likes.getNumLikes())
}

window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.readStorage();
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    state.likes.likes.forEach(like => {
        return likesView.renderLike(like)
    })
})

elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec')
            recipeView.updateServingsIngredinets(state.recipe)
        }
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc')
        recipeView.updateServingsIngredinets(state.recipe)
    }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList()
    }else if(e.target.matches('.recipe__love, .recipe__love *')){
        controlLike()
    }
})







