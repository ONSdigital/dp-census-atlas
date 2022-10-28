* mktiles2

mktiles uses maps of maps to hold the notional spreadsheet.
This turns out to be a memory and performance hit with dataset sizes this big.
So mktiles2 uses slices of slices as an attempt to improve memory costs.

When we are comfortable with mktiles2, we can get rid of of mktiles.

* ratios and percentages

We originally started with ratios, value divided by total.
But at this point percentages make more sense, value divided by total * 100.

So the -R behaviour was changed to multiply ratios by 100.
So references to "ratio" in code and documentation should be changed to "percentage"
at some point to avoid confusion.
