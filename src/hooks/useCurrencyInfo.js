import { useEffect, useState } from "react";

function useCurrencyInfo(currency) {
    const [data, setData] = useState({});

    useEffect(() => {
        // Using the free JSDeliver API which doesn't require a key for basic testing
        fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`)
            .then((res) => res.json())
            .then((res) => setData(res[currency]))
            .catch((err) => console.error("API Error:", err));
    }, [currency]);

    return data;
}

export default useCurrencyInfo;