import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

const rates = {
    USD: { symbol: '$', rate: 1 },
    EUR: { symbol: '€', rate: 0.92 },
    GBP: { symbol: '£', rate: 0.79 },
    INR: { symbol: '₹', rate: 83.0 },
};

export const CurrencyProvider = ({ children }) => {
    // Load preference from localStorage or default to USD
    const [currency, setCurrencyState] = useState(() => {
        return localStorage.getItem('preferredCurrency') || 'USD';
    });

    const setCurrency = (c) => {
        setCurrencyState(c);
        localStorage.setItem('preferredCurrency', c);
    };

    const formatPrice = (amount) => {
        if (!amount && amount !== 0) return '';
        const selected = rates[currency] || rates['USD'];
        const converted = amount * selected.rate;

        const formatted = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: parseInt(converted) === converted ? 0 : 2, // 0 decimal if integer, 2 if decimal. Usually 2 is standard for currency, but 0 looks cleaner for integers. Actually, let's stick to minimum 2 for consistent alignment in carts/dashboards.
            maximumFractionDigits: 2,
        }).format(converted);

        // Standardize output e.g. $100.00
        return `${selected.symbol}${formatted}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, currencies: Object.keys(rates) }}>
            {children}
        </CurrencyContext.Provider>
    );
};
