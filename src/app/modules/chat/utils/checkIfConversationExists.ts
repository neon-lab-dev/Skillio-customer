export const hasSameId = (arr1: string[], arr2: string[]) => {
    for (const id of arr1) {
        if (arr2.includes(id)) { 
            return { flag: true, id };
        }
    } 
    return { flag: false, id: '' };
}