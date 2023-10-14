## Config

Make the .env file
- # make copy .evn.example to .env
- IS_DEBUG=true
- # true is skip call verify from metamask.
- PRESALE_ID=round-1
- # setup current round preSale. If want to open the next round, just change round id.
- CURRENT_TIME="2023-10-16 00:00:00"
- # debug time to test. Delete the system use the real time.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
