export const formatCurrency = (
	amount: number = 0,
	currency: string = "NGN"
) => {
	const formattedAmount = new Intl.NumberFormat(currency, {
		style: "currency",
		currency: currency,
		currencyDisplay: "narrowSymbol",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
	return formattedAmount;
};
