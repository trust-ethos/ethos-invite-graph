# Ethos Network API v2 Complete Documentation

## Overview

This document provides comprehensive documentation for all Ethos Network API v2
endpoints. The base URL for all endpoints is `https://api.ethos.network/api/v2`.

## Authentication

Most endpoints require authentication using a Bearer token in the Authorization
header:

```
Authorization: Bearer YOUR_SECRET_TOKEN
```

## Standard Error Responses

All endpoints may return these standard error codes:

- **400**: Invalid input data
- **401**: Authorization not provided
- **403**: Insufficient access
- **404**: Not found
- **500**: Internal server error

---

## 1. Activities API

### Get Activity by ID

- **Method**: GET
- **Path**: `/api/v2/activities/{activityType}/{id}`
- **Parameters**:
  - Path:
    - `activityType` (required, enum): `attestation`, `closed-slash`,
      `invitation-accepted`, etc.
    - `id` (required, integer)
- **Responses**:
  - 200: Successful response
  - 400-500: Standard errors

### Get Activities by Type and ID (Bulk)

- **Method**: POST
- **Path**: `/api/v2/activities/bulk`
- **Body Parameters**:
  - `activityType` (required, enum)
  - `id` (required, integer)
- **Responses**:
  - 200: Returns array of activities
  - 400, 500: Standard errors

### Get Activity by Transaction Hash

- **Method**: GET
- **Path**: `/api/v2/activities/{activityType}/tx/{txHash}`
- **Parameters**:
  - Path:
    - `activityType` (required, enum)
    - `txHash` (required, regex: `^0x[a-fA-F0-9]{64}$`)
- **Responses**:
  - 200: Successful response
  - 400-500: Standard errors

### Get Activities by User Key

- **Method**: GET
- **Path**: `/api/v2/activities/userkey`
- **Query Parameters**:
  - `userkey` (required, string)
  - `direction` (optional, enum: `author`, `subject`)
  - `activityType` (optional, array of enums)
  - `orderBy` (optional, enum: `createdAt`, `totalVotes`, etc.)
  - `sort` (optional, default: `desc`)
  - `limit` (optional, max: 1000, default: 50)
  - `offset` (optional)

---

## 2. Apps API

### List Applications

- **Method**: GET
- **Path**: `/api/v2/apps`
- **Description**: Retrieve a paginated list of applications built on Ethos
- **Query Parameters**:
  - `appType` (optional): Enum - `APP`, `INTEGRATION`, `AGENT`
  - `status` (optional): Enum - `ACTIVE`, `INACTIVE`
  - `limit` (optional): Max 50, Default 50
  - `offset` (optional): Default 0
- **Responses**:
  - 200: Successful response with app details
  - 400-500: Standard errors

### Create App

- **Method**: POST
- **Path**: `/api/v2/apps`
- **Authorization**: Required
- **Request Body**:
  - `name` (required): String, 1-100 characters
  - `appType` (required): Enum - `APP`, `INTEGRATION`, `AGENT`
  - `authorUserId` (required): Integer
  - `link` (required): URI
  - `description` (required): String, 1-1000 characters
  - `pictureUrl` (optional): URI
  - `status` (optional): Enum - `ACTIVE`, `INACTIVE`
- **Responses**:
  - 200: Successful app creation
  - 400-500: Standard errors

### Get Specific App

- **Method**: GET
- **Path**: `/api/v2/apps/{id}`
- **Path Parameter**:
  - `id` (required): Integer
- **Responses**:
  - 200: App details
  - 400-500: Standard errors

### Get Apps by Type

- **Method**: GET
- **Path**: `/api/v2/apps/by-type/{appType}`
- **Path Parameter**:
  - `appType` (required): Enum - `APP`, `INTEGRATION`, `AGENT`

---

## 3. Categories API

### List Categories

- **Method**: GET
- **Path**: `/api/v2/categories`
- **Query Parameters**:
  - `showOnLeaderboard` (boolean, optional)
  - `showInDailyService` (boolean, optional)
  - `withUserCount` (boolean, optional)
  - `limit` (number, optional, default: 50)
  - `offset` (number, optional, default: 0)
- **Response**: List of category objects with total count

### Create Category

- **Method**: POST
- **Path**: `/api/v2/categories`
- **Authorization**: Required
- **Body Parameters**:
  - `name` (string, required)
  - `showOnLeaderboard` (boolean, required)
  - `showInDailyService` (boolean, required)
  - `slug` (optional)
  - `description` (optional)
  - `bannerImageUrl` (optional)
- **Response**: Created category object

### Get Specific Category

- **Method**: GET
- **Path**: `/api/v2/categories/{id}`
- **Path Parameter**: `id` (integer, required)
- **Response**: Detailed category object

### Get Category Summaries

- **Method**: GET
- **Path**: `/api/v2/categories/summaries/bulk`
- **Query Parameters**:
  - `showOnLeaderboard` (boolean, optional)
  - `showInDailyService` (boolean, optional)
  - `topUsersLimit` (number, optional, max: 50, default: 10)
- **Response**: Array of category summary objects

### Update Category

- **Method**: PUT
- **Path**: `/api/v2/categories/{categoryId}`
- **Authorization**: Required
- **Body Parameters**: `slug`, `name`, `description`, `showOnLeaderboard`,
  `showInDailyService`, `bannerImageUrl` (all optional)
- **Response**: Updated category object

### Delete Category

- **Method**: DELETE
- **Path**: `/api/v2/categories/{categoryId}`
- **Authorization**: Required
- **Response**: Deleted category object

### Get Category Users

- **Method**: GET
- **Path**: `/api/v2/categories/{categoryId}/users`

---

## 4. Contributions API

### Get Contributions History

- **Method**: GET
- **Path**: `/api/v2/contributions/history`
- **Query Parameters**:
  - `duration` (optional, default: `1y`): string
- **Authorization**: Bearer token required
- **Response Example**:
  ```json
  {
    "history": [
      {
        "date": "text",
        "tasks": 1
      }
    ]
  }
  ```

---

## 5. Chains API

### List Chains

- **Method**: GET
- **Path**: `/api/v2/chains`
- **Description**: List all available chains
- **Response Example**:
  ```json
  {
    "chains": [
      {
        "id": 1,
        "name": "text",
        "url": "https://example.com",
        "iconUrl": "https://example.com"
      }
    ]
  }
  ```

### Add Chain (Admin only)

- **Method**: POST
- **Path**: `/api/v2/chains`
- **Authorization**: Bearer token required
- **Body Parameters**:
  - `name`: string (1-100 characters)
  - `url`: string (URI)
  - `iconUrl`: string (URI)

### Update Chain (Admin only)

- **Method**: PUT
- **Path**: `/api/v2/chains/{id}`
- **Authorization**: Bearer token required
- **Path Parameter**: `id` (integer)
- **Body Parameters**: Same as POST

### Delete Chain (Admin only)

- **Method**: DELETE
- **Path**: `/api/v2/chains/{id}`
- **Authorization**: Bearer token required
- **Path Parameter**: `id` (integer)

---

## 6. Internal API (Unstable)

### Get User by Userkey

- **Method**: GET
- **Path**: `/api/v2/internal/users/{userkey}`
- **Warning**: This is an internal endpoint. It is not guaranteed to be stable
- **Path Parameter**: `userkey` (string, required)

### Get Internal Listings

- **Method**: GET
- **Path**: `/api/v2/internal/listings`
- **Warning**: This is an internal endpoint. It is not guaranteed to be stable
- **Query Parameters**:
  - `userkey` (string, optional)
  - `year` (number, optional)
  - `period` (number, optional)
  - `limit` (integer, optional, max: 100, default: 50)
  - `offset` (number, optional, default: 0)

### Get Project Details by Username

- **Method**: GET
- **Path**: `/api/v2/internal/listings/{username}`
- **Warning**: This is an internal endpoint. It is not guaranteed to be stable
- **Path Parameter**: `username` (string, required)
- **Query Parameters**:
  - `topVotersLimit` (number, optional, max: 100, default: 3)
  - `year` (number, optional)
  - `period` (number, optional)

---

## 7. Invitations API

### Check Invitation Eligibility

- **Method**: GET
- **Path**: `/api/v2/invitations/check`
- **Description**: Check if the current user is allowed to invite an address or
  ENS name
- **Authorization**: Bearer token required
- **Query Parameter**:
  - `addressOrEns` (string, required): The address or ENS name to check
- **Response Example**:
  ```json
  {
    "canInvite": true,
    "address": "text"
  }
  ```

---

## 8. Markets API

### List Markets

- **Method**: GET
- **Path**: `/api/v2/markets`
- **Description**: List markets with pagination, sorting, and filtering
- **Query Parameters**:
  - `orderBy`: Sort field (default: `createdAt`)
  - `orderDirection`: Sort direction (default: `desc`)
  - `dayRange`: Optional day range filter
  - `filterQuery`: Search query (2-100 characters)
  - `limit`: Max results per page (max 100, default 50)
  - `offset`: Pagination offset (default 0)

### Get Featured Markets

- **Method**: GET
- **Path**: `/api/v2/markets/featured`
- **Description**: Get featured markets

### Simulate Market Purchase

- **Method**: POST
- **Path**: `/api/v2/markets/simulate-buy`
- **Description**: Simulate trust market purchase
- **Request Body**:
  - `profileId`: Integer (Required)
  - `voteType`: String - "trust" or "distrust" (Required)
  - `buyAmountWei`: Integer (Required)
  - `slippagePercentage`: Number (Optional, default 0.01)

---

## 9. NFTs API

### Check User's Validator NFT

- **Method**: GET
- **Path**: `/api/v2/nfts/user/{ethosUserKey}/owns-validator`
- **Path Parameter**: `ethosUserKey` (string, required)
- **Response**: Returns list of validator NFTs

### Get User's NFTs

- **Method**: GET
- **Path**: `/api/v2/nfts/user/{ethosUserKey}`
- **Path Parameter**: `ethosUserKey` (string, required)
- **Query Parameters**:
  - `limit` (optional, integer, max: 1000, default: 50)
  - `offset` (optional, number, default: 0)
- **Response**: Returns paginated list of NFTs

### Track NFT Collection (Admin Only)

- **Method**: POST
- **Path**: `/api/v2/nfts/track`
- **Authorization**: Admin token required
- **Request Body**:
  - `contractAddress` (required, string)

---

## 10. Projects API

### List Projects

- **Method**: GET
- **Path**: `/api/v2/projects`
- **Description**: Show all listings projects with filters
- **Query Parameters**:
  - `status` (optional, string)
  - `userkey` (optional, string)
  - `year` (optional, number)
  - `period` (optional, number)
  - `limit` (optional, default: 50, max: 100)
  - `offset` (optional, default: 0)

### Get Suggested Projects

- **Method**: GET
- **Path**: `/api/v2/projects/suggested`
- **Description**: Get suggested listings projects for a user
- **Query Parameters**:
  - `limit` (optional, default: 5)
  - `year` (optional)
  - `period` (optional)

### Get Project by ID

- **Method**: GET
- **Path**: `/api/v2/projects/{projectId}`
- **Path Parameter**: `projectId` (required)

### Update Project

- **Method**: PUT
- **Path**: `/api/v2/projects/{projectId}`
- **Description**: Update an existing project (Admin or Project Owner only)
- **Authorization**: Required
- **Path Parameter**: `projectId` (required)
- **Body Parameters**:
  - `description` (optional)
  - `bannerImageUrl` (optional)
  - `categoryIds` (optional)
  - `chains` (optional)
  - `isPromoted` (optional)
  - `launchDate` (optional)
  - `links` (optional)
  - `status` (optional)

### Get Project Details

- **Method**: GET
- **Path**: `/api/v2/projects/{projectId}/details`
- **Description**: Get detailed project information with current season votes
- **Path Parameter**: `projectId` (required)
- **Query Parameters**:
  - `topVotersLimit` (optional, default: 3, max: 100)
  - `year` (optional)
  - `period` (optional)

---

## 11. Project Votes API

### Cast Vote for Project

- **Method**: POST
- **Path**: `/api/v2/projects/{projectId}/votes`
- **Authorization**: Required
- **Request Body**:
  - `voteType` (string, required): Either "BULLISH" or "BEARISH"
  - `amount` (integer, required)

### Get Vote Balance

- **Method**: GET
- **Path**: `/api/v2/projects/votes/balance`
- **Authorization**: Required
- **Query Parameters**:
  - `projectId` (optional)
  - `year` (optional)
  - `period` (optional)

### Get Project Voters

- **Method**: GET
- **Path**: `/api/v2/projects/{projectId}/voters`
- **Query Parameters**:
  - `orderBy`: Sort by "score" or "updatedAt"
  - `orderDirection`: "asc" or "desc"
  - `sentiment`: "bullish" or "bearish"
  - `scope`: Voting period selection
  - `limit`, `offset`: Pagination parameters

### Reallocate Votes (Admin Only)

- **Method**: POST
- **Path**: `/api/v2/projects/votes/reallocate`
- **Authorization**: Admin access required

### Get Bulk Vote Totals

- **Method**: GET
- **Path**: `/api/v2/projects/votes/bulk-totals`

---

## 12. Reviews API

### Count Reviews Between Users

- **Method**: GET
- **Path**: `/api/v2/reviews/count/between`
- **Query Parameters**:
  - `authorUserKey` (string, required)
  - `subjectUserKey` (string, required)
- **Response**: Integer representing review count

### Get Latest Review Between Users

- **Method**: GET
- **Path**: `/api/v2/reviews/latest/between`
- **Query Parameters**:
  - `authorUserKey` (string, required)
  - `subjectUserKey` (string, required)
- **Response**: Latest review data

---

## 13. Score API

### Get Score by Address

- **Method**: GET
- **Path**: `/api/v2/score/address`
- **Query Parameters**:
  - `address` (string, required)
- **Response Example**:
  ```json
  {
    "score": 1,
    "level": "untrusted"
  }
  ```

### Get Scores by Multiple Addresses

- **Method**: POST
- **Path**: `/api/v2/score/addresses`
- **Body Parameters**:
  - `addresses` (string array, required)
- **Response Example**:
  ```json
  {
    "0x123...": {
      "score": 1,
      "level": "untrusted"
    }
  }
  ```

### Get Score by User ID

- **Method**: GET
- **Path**: `/api/v2/score/userId`
- **Query Parameters**:
  - `userId` (integer, required)

### Get Scores by Multiple User IDs

- **Method**: POST
- **Path**: `/api/v2/score/userIds`
- **Body Parameters**:
  - `userIds` (integer array, required)

---

## 14. System API

### Health Check

- **Method**: GET
- **Path**: `/api/v2/healthcheck`
- **Description**: Basic health check
- **Response**: `{ "ok": true }`

### Authenticated Health Check

- **Method**: GET
- **Path**: `/api/v2/healthcheck/authenticated`
- **Description**: Health check requiring authentication
- **Authorization**: Bearer token required
- **Response**: `{ "ok": true, "profileId": 1 }`

### Always Fail Health Check

- **Method**: GET
- **Path**: `/api/v2/healthcheck/always-fail`
- **Description**: Endpoint designed to always fail

---

## 15. Users API

### Bulk User Retrieval

#### Get Users by IDs

- **Method**: POST
- **Path**: `/api/v2/users/by/ids`
- **Body Parameters**:
  - `userIds` (integer array, 1-500 items)

#### Get Users by Ethereum Addresses

- **Method**: POST
- **Path**: `/api/v2/users/by/address`
- **Body Parameters**:
  - `addresses` (string array, 1-500 items)

#### Get Users by Profile IDs

- **Method**: POST
- **Path**: `/api/v2/users/by/profile-id`
- **Body Parameters**:
  - `profileIds` (integer array, 1-500 items)

#### Get Users by Social Platforms

- **Method**: POST
- **Paths**:
  - `/api/v2/users/by/x` (Twitter/X)
  - `/api/v2/users/by/discord`
  - `/api/v2/users/by/farcaster`
  - `/api/v2/users/by/telegram`
- **Body Parameters**: Platform-specific ID arrays

### Individual User Retrieval

#### Search Users

- **Method**: GET
- **Path**: `/api/v2/users/search`
- **Query Parameters**:
  - `query` (string, 2-100 characters, required)
  - `userKeyType` (optional, enum: ADDRESS, DISCORD, etc.)
  - `limit` (optional, max 50)
  - `offset` (optional)

#### Get User by ID

- **Method**: GET
- **Paths**:
  - `/api/v2/user/{userId}`
  - `/api/v2/user/by/address/{address}`
  - `/api/v2/user/by/profile-id/{profileId}`

---

## 16. Votes API

### Get Votes

- **Method**: GET
- **Path**: `/api/v2/votes`
- **Description**: Retrieve votes for an activity
- **Query Parameters**:
  - `type` (string, required): `attestation`, `discussion`, `review`, `slash`,
    `vouch`, `project`, `reputationMarket`
  - `activityId` (number, required)
  - `isUpvote` (boolean, optional)
  - `orderBy` (string, optional, default: `updatedAt`): Can be `score` or
    `updatedAt`
  - `orderDirection` (string, optional, default: `desc`): Can be `asc` or `desc`
  - `limit` (integer, optional, max: 500, default: 50)
  - `offset` (number, optional, default: 0)

### Get Votes Stats (Single Activity)

- **Method**: GET
- **Path**: `/api/v2/votes/stats`
- **Query Parameters**:
  - `type` (string, required)
  - `activityId` (number, required)
  - `includeArchived` (boolean, optional)

### Get Votes Stats (Multiple Activities)

- **Method**: POST
- **Path**: `/api/v2/votes/stats`
- **Body Parameters** (all optional):
  - `attestation` (number array)
  - `discussion` (number array)
  - `review` (number array)
  - `slash` (number array)
  - `vouch` (number array)
  - `project` (number array)
  - `reputationMarket` (number array)
  - `includeArchived` (boolean)

---

## 17. XP API

### Admin XP Weekly Stats

- **Method**: GET
- **Path**: `/api/v2/admin/xp/weekly/stats`
- **Description**: Get detailed weekly XP statistics for specified users
- **Authorization**: Admin only
- **Query Parameters**:
  - `userIds` (integer array, 1-100 users)
  - `weekStart` (string)
  - `weekEnd` (string)

### Admin XP Weekly Active Users

- **Method**: GET
- **Path**: `/api/v2/admin/xp/weekly/active-users`
- **Description**: Get user IDs active in a specified date range
- **Authorization**: Admin only
- **Query Parameters**:
  - `weekStart` (string)
  - `weekEnd` (string)

### Get User Total XP

- **Method**: GET
- **Path**: `/api/v2/xp/user/{userkey}`
- **Description**: Get total XP for a user across all seasons
- **Response**: Returns numeric XP value

### Get User XP in Season

- **Method**: GET
- **Path**: `/api/v2/xp/user/{userkey}/season/{seasonId}`
- **Description**: Get XP for a user in a specific season
- **Response**: Returns numeric XP value

### Get User Weekly XP in Season

- **Method**: GET
- **Path**: `/api/v2/xp/user/{userkey}/season/{seasonId}/weekly`
- **Description**: Get weekly XP breakdown for a user in a specific season

---

## Rate Limiting and Best Practices

1. **Authentication**: Always include the Bearer token in the Authorization
   header for protected endpoints
2. **Pagination**: Use `limit` and `offset` parameters for large result sets
3. **Error Handling**: Implement proper error handling for all standard error
   codes (400, 401, 403, 404, 500)
4. **Internal Endpoints**: Avoid using internal endpoints in production as they
   are not guaranteed to be stable
5. **Bulk Operations**: When fetching multiple items, prefer bulk endpoints over
   multiple individual requests

## Notes

- All timestamps are in ISO 8601 format
- All monetary values are in Wei unless otherwise specified
- ENS names are supported where Ethereum addresses are accepted
- The API uses standard HTTP status codes for responses
