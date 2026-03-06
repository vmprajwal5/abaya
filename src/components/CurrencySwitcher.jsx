import { useCurrency } from '../contexts/CurrencyContext';

function CurrencySwitcher() {
    const { currency, toggleCurrency } = useCurrency();

    return (
        <button
            onClick={toggleCurrency}
            className="text-xs font-medium tracking-wider hover:opacity-60 transition-opacity uppercase px-2"
            aria-label="Toggle Currency"
        >
            {currency}
        </button>
    );
}

export default CurrencySwitcher;
