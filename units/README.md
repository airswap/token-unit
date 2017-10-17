# Token Unit files

Adding a new Token to this library is fairly simple as all Tokens follow the same standard JSON format. To add a new Token, simply clone the repository, create a new JSON file with your token's data, and submit a PR. When submitting a PR, please include:

* The token JSON file
* Your project's website
* Short project description
* Social media accounts or contact information
* Token address if deployed to the blockchain


## Token JSON format

```
{
	"unit": "dollar",
	"anchor": "cent",
	"starting_anchor_to_ether": 0.00003,
	"values": [
		{
			"name": "cent",
			"to_anchor": 1
		},
		{
			"name": "dollar",
			"to_anchor": 100
		}, ...
	]
}
```

At the root level, each Token requires a `unit`, `anchor`, `starting_anchor_to_ether` and one or more `values`.

* `unit` (string): The name of the token in it's colloquial format. Likely the ticker symbol of the token. Ether, AST, GNO, etc.
* `anchor` (string): The nominal unit of the token. For Ether, this is **wei**, since it is the lowest denomination of value. This is likely an internal name and should represent the smallest fraction of your token. If you have 4 decimal places, 10000 of this unit should equal 1 of your tokens. If you have 10 decimal places, then 10000000000 of this unit should equal 1 of your tokens.
* `starting_anchor_to_ether` (number): 1 of your `anchor` units is how many ether (**not** wei)? If 1000 of your tokens is 1 ether, and you use 4 decimals, then your value here should be 0.0000001.
* `values` (array of objects): A list of scaling units for your token. Each unit is represented by its `name` (string), such as `kwei`, `thousand`, etc and how many anchor units this scale represents - the `to_anchor` (number) value. If your `anchor` is the `cent` and your scaling unit is the `thousand`, then your `to_anchor` is `100000`. You can have as many scaling units as you would like.
