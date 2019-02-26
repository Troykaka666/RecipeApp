import axios from "axios";

export default class Search{

    //constructor
    constructor(query){
        this.query = query;
    }

    async getResults() {
        const key = '9600c494b3707433de757002970b7f53';
        try {
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            //waitring for to request(promise) until it is fulfill
            this.result = res.data.recipes;
        } catch (error) {
            alert(error);
        }    
    }
}


// 9600c494b3707433de757002970b7f53 
//83483343e31d435ea0d303a7dace5d9c