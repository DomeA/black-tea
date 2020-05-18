export const Add=(function () {
    class Add{
        static #x=1;
        static #y=2;
        constructor() {
        }
        getA(x,y){
            return x+y;
        }
        static getB(){
            return Add.#x+Add.#y;
        }
    }
    return Add;
})();