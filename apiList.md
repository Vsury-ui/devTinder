## AuthRouter

POST /auth/signup
POST /auth/login
POST /auth/logout

## ProfileRouter

GET /profile
PATCH /profile/edit
PATCH /profile/password

## connectionRequestRouter

POST /request/send/interested/:userId
POST /request/send/ignored/:userId
POST /request/review/accepted/:requestId
POST /request/review/rejected/:requestId

## userRouter

GET /user/connections
GET /user/requests/received
GET /user/feed - gets you the profiles

## Status: ignore, interested, accepted, rejected
