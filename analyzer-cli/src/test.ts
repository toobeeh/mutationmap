export function hello() {


    const hellothere = () => {
        console.log("Hello there!");
    }

    const b = 1;

    () =>  {
        console.log("hi");
    };

    setTimeout(() => {
        console.log("Hello there!");
    }, 1000);

    return hellothere();
}

class Hi {

    get abc() {
        return "abc";
    }

    constructor() {
        console.log("Hi");
    }

    doIt() {
        console.log("Doing it");
    }

}
