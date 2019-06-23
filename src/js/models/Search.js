import axios from 'axios'

export default class Search{
    constructor(query){
        this.query = query
    }

    async getResults(){
        const key = '04093a89bd4d1d7188a606582d0f8dfb'
        try{
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`)
            this.result = res.data.recipes
        }catch(error){
            alert(error)
        }
    }
}

