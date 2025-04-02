def countHighlyProfitableMonths(stock_prices, k):
    count = 0
    for i,x in enumerate(stock_prices): 
        is_trend = True
        try:
            for n in range(1,k):
                is_trend = is_trend and stock_prices[i+n-1] < stock_prices[i+n]
        except IndexError:
            break
        if is_trend:
            count += 1
    return count