export default class Like{
    constructor(){
        this.likes = [];
    }

    addLike(id, title, author, img){
       const like = {id, title, author, img};
       this.likes.push(like);

       //Parist data in localStrorage
        this.persistdata();
       return like; 
    }

    deleteLike(id){
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1)

        //Parist data in localStrorage
        this.persistdata();
    }

    isLiked(id){
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes(){
        return this.likes.length;
    }

    persistdata(){
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage(){
        const storage = JSON.parse(localStorage.getItem('likes'));

        //restoring likes from teh localstorage
        if(storage) this.likes = storage;
    }    
}