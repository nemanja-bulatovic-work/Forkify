import { elements } from "./base";

export const getInput = () => {
    return elements.searchInput.value
}

export const clearInput = () => {
    elements.searchInput.value = ''
}

export const clearResult = () => {
    elements.searchResultList.innerHTML = ''
    elements.searchResultPages.innerHTML = ''
}

export const highLightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'))
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active')
    })
    document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active')
}

export const limitRecipeTitile = (title, limit = 17) => {
    const newTitle = []
    if(title.length > limit){
        title.split(' ').reduce((acc, curr) => {
            if(acc + curr.length <= limit){
                newTitle.push(curr)
            }
            return acc + curr.length
        }, 0)
        return `${newTitle.join(' ')} ...`
    }
    return title
}

const renderRecipe = recipe => {
    const markup = `
                <li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="Test">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitile(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>
    
    `

    elements.searchResultList.insertAdjacentHTML('beforeend', markup)
}

const createButton = (page, type) => {
    return `
        <button class="btn-inline results__btn--${type}" data-togo="${type === 'prev' ? page - 1 : page + 1}">
            <svg class="search__icon">
                <use href="img/download.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
            </svg>
            <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        </button>
    `
}

const renderButton = (page, numRes, resPerPage) => {
    const pages = Math.ceil(numRes / resPerPage)
    let button
    if(page === 1 && pages > 1){
        button = createButton(page, 'next') 
    }else if(page < pages){
        button = `
            ${ button = createButton(page, 'next')}
            ${ button = createButton(page, 'prev')}
        `
    }else if(page === pages && pages > 1){
        button = createButton(page, 'prev') 
    }

    elements.searchResultPages.insertAdjacentHTML('afterbegin', button)
}

export const renderResult = (recipes, page = 1, resPerPage = 10)  => {
    const start = (page - 1) * resPerPage
    const end = page * resPerPage
    recipes.slice(start, end).forEach(el => {
        renderRecipe(el)
    });
    renderButton(page, recipes.length, resPerPage)
}