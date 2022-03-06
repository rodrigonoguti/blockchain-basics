# Blockchain basics
 
## Requirements
- NodeJS
 
## How to run
- Run `npm install`
- You can run up to five nodes using `npm run node_X`. Considering `X` from 1 to 5.
- You can run more nodes using `nodemon --watch dev -e js dev/networkNode.js <PORT> http://localhost:<PORT>`. Just replace `<PORT>` to a port that is not being used already.

## API Documentation
- Just hit `http://localhost:<PORT>/docs` on your browser. Just replace `<PORT>` to the one running any of your nodes.

## Block Explorer
- Visit `http://localhost:<PORT>/block-explorer` on your browser. It's a web interface to show the blockchain data.
