export const useDelay = (delayData:number,setIsLoading:React.Dispatch<React.SetStateAction<boolean>>) => {
    return setTimeout(() => setIsLoading(false),delayData);
}

