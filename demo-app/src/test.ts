export function hello() {


    const hellothere = () => {
        console.log("Hello there!");
    }

    const b = 1;

    () =>  {
        console.log(b);
    };

    setTimeout(() => {
        console.log("Hello xxx!");
    }, 1000);

    const a = Array
        .from({ length: 10 })
        .map(() => ([b + Math.random(), b]));

    return hellothere.toString() + a.toString();
}

export class Hi {

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
