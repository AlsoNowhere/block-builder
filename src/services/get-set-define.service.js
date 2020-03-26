
export const get = (scope,property,action) => {
    if (!(scope instanceof Object)) {
        throw new Error("Thyme, get, scope -- You must pass an Object as the scope");
    }
    if (typeof property !== "string") {
        throw new Error("Thyme, get, property -- You must pass a string as the property");
    }
    if (!(action instanceof Function)) {
        throw new Error("Thyme, get, action -- You must pass a function as the action");
    }

    Object.defineProperty(scope,property,{
        get: action
    });
}

export const set = (scope,property,action) => {
    if (!(scope instanceof Object)) {
        throw new Error("Thyme, set, scope -- You must pass an Object as the scope");
    }
    if (typeof property !== "string") {
        throw new Error("Thyme, set, property -- You must pass a string as the property");
    }
    if (!(action instanceof Function)) {
        throw new Error("Thyme, set, action -- You must pass a function as the action");
    }

    Object.defineProperty(scope,property,{
        set: action
    });
}

export const define = (scope,property,getAction,setAction) => {
    if (!(scope instanceof Object)) {
        throw new Error("Thyme, define, scope -- You must pass an Object as the scope");
    }
    if (typeof property !== "string") {
        throw new Error("Thyme, define, property -- You must pass a string as the property");
    }
    if (!(getAction instanceof Function)) {
        throw new Error("Thyme, define, getAction -- You must pass a function as the getAction");
    }
    if (!(setAction instanceof Function)) {
        throw new Error("Thyme, define, setAction -- You must pass a function as the setAction");
    }

    Object.defineProperty(scope,property,{
        get: getAction,
        set: setAction
    });
}
