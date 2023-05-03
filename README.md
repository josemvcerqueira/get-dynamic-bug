# Dynamic Field Pagination Bug

## Quick start

We intend to show that the getDynamicFields method is broken

The hasNextPage attribute always returns true and it returns repeated data and misses most fields.

```bash
  npm i
```

```bash
  npm run dev
```

Please check the logs in the terminal 

```bash
The Pools Bag has a size of:  121
hasNextPage is always true true
hasNextPage is always true true
We fetched an array with a length of:  150
We fetched an array with unique items of:  17
```