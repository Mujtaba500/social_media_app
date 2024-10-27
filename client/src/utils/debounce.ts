const debounceFunc = () => {
let timeout:any
let delay = 1000 
const debounce = (cb: any, id:string) => {
        clearTimeout(timeout)
        timeout = setTimeout(async () => {
            await cb(id)
        }, delay)
    }
return {debounce}
}

export default debounceFunc