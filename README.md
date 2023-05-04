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
getDynamicFields called
getDynamicFields called
getDynamicFields called
getDynamicFields called
We fetched an array with a length of:  195
We fetched an array with unique items of:  121
```