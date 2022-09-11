import React, {useEffect, useRef, useState} from 'react';
import './index.scss'
import {Block} from "./Block";

function App() {
    const [fromCurrency, setFromCurrency] = useState<string>('BYN')
    const [toCurrency, setToCurrency] = useState<string>('USD')
    const [fromPrice, setFromPrice] = useState<number>(0)
    const [toPrice, setToPrice] = useState<number>(1)
    const ratesRef = useRef({})
    const onChangeFromPrice = (value:number) => {
        const price = value / ratesRef.current[fromCurrency]
        const result = (price * ratesRef.current[toCurrency]).toFixed(3)
        setFromPrice(value)
        setToPrice(result)
    }
    const onChangeToPrice = (value:number) => {
        const result = (ratesRef.current[fromCurrency] / ratesRef.current[toCurrency]) * value;
        setFromPrice(result.toFixed(3))
        setToPrice(value)
    }
    useEffect(() => {
        fetch('https://cdn.cur.su/api/latest.json')
            .then((res) => res.json())
            .then((json) => {
                ratesRef.current = json.rates
                onChangeToPrice(1)
                console.log(json.rates)
            }).catch(err => {
            console.warn(err)
            alert('Не удалось получить информации!')
        })
    }, [])
    useEffect(() => {
        onChangeFromPrice(fromPrice);
    }, [fromCurrency]);
    useEffect(() => {
        onChangeToPrice(toPrice);
    }, [toCurrency]);
    return (
        <div className="App">
            <Block value={fromPrice} currency={fromCurrency}
                   onChangeCurrency={setFromCurrency} onChangeValue={onChangeFromPrice}/>;
            <Block value={toPrice} currency={toCurrency} onChangeCurrency={setToCurrency}
                   onChangeValue={onChangeToPrice}/>;

        </div>
    );
}

export default App;
